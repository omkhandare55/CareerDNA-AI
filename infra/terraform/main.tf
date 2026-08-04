# =============================================================================
# CareerDNA AI - AWS Infrastructure as Code (Terraform)
# Event-Driven Serverless AI Platform Infrastructure
# =============================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project     = "CareerDNA-AI"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "environment" {
  type    = string
  default = "production"
}

# -----------------------------------------------------------------------------
# 1. KMS Encryption Key
# -----------------------------------------------------------------------------

resource "aws_kms_key" "careerdna_key" {
  description             = "KMS Key for CareerDNA AI data encryption at rest"
  deletion_window_in_days = 30
  enable_key_rotation     = true
}

# -----------------------------------------------------------------------------
# 2. Amazon S3 Document Buckets
# -----------------------------------------------------------------------------

resource "aws_s3_bucket" "resumes_bucket" {
  bucket = "careerdna-resumes-${var.environment}"
}

resource "aws_s3_bucket_server_side_encryption_configuration" "resumes_encryption" {
  bucket = aws_s3_bucket.resumes_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.careerdna_key.arn
      sse_algorithm     = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_versioning" "resumes_versioning" {
  bucket = aws_s3_bucket.resumes_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

# -----------------------------------------------------------------------------
# 3. Amazon Cognito User Pool
# -----------------------------------------------------------------------------

resource "aws_cognito_user_pool" "user_pool" {
  name = "careerdna-user-pool-${var.environment}"

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  auto_verified_attributes = ["email"]
}

resource "aws_cognito_user_pool_client" "client" {
  name         = "careerdna-web-client"
  user_pool_id = aws_cognito_user_pool.user_pool.id

  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]
}

# -----------------------------------------------------------------------------
# 4. IAM Roles for Backend Lambdas & Bedrock
# -----------------------------------------------------------------------------

resource "aws_iam_role" "lambda_exec_role" {
  name = "careerdna_lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "lambda_policy" {
  name = "careerdna_lambda_policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ]
        Resource = "${aws_s3_bucket.resumes_bucket.arn}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_lambda_policy" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

# -----------------------------------------------------------------------------
# 5. Amazon API Gateway
# -----------------------------------------------------------------------------

resource "aws_apigatewayv2_api" "http_api" {
  name          = "careerdna-api-${var.environment}"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "api_stage" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true
}

output "api_endpoint" {
  value       = aws_apigatewayv2_api.http_api.api_endpoint
  description = "Production API Gateway Endpoint"
}
