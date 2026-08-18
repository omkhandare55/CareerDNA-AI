"""
CareerDNA AI – Multi-Cloud Deployment & Packaging Hub API
GET /api/v1/showcase/deploy-manifests → Production deployment manifests (Docker, K8s, Cloud Run, AWS ECS)
"""

import logging
from typing import List, Dict, Any
from pydantic import BaseModel
from fastapi import APIRouter

router = APIRouter(prefix="/showcase", tags=["Hackathon Showcase"])
logger = logging.getLogger("careerdna.deploy_hub")


class DeployManifest(BaseModel):
    target_platform: str
    filename: str
    language: str
    description: str
    manifest_content: str


MANIFESTS: List[DeployManifest] = [
    DeployManifest(
        target_platform="Docker Compose",
        filename="docker-compose.production.yml",
        language="yaml",
        description="Production multi-container orchestration for FastAPI, Next.js frontend, and CockroachDB connection pooling.",
        manifest_content="""version: '3.8'
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - COCKROACH_DATABASE_URL=postgresql://user:pass@silk-ninja-32317.j77.aws-us-east-1.cockroachlabs.cloud:26257/careerdna?sslmode=verify-full
      - AWS_REGION=us-east-1
      - AWS_BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
      - TITAN_EMBEDDING_MODEL_ID=amazon.titan-embed-text-v2:0
      - JWT_SECRET_KEY=careerdna-super-secret-key-2026
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 15s
      timeout: 5s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    depends_on:
      - backend
    restart: always"""
    ),
    DeployManifest(
        target_platform="Kubernetes (K8s)",
        filename="k8s-careerdna-deployment.yaml",
        language="yaml",
        description="High-availability Kubernetes deployment with horizontal pod autoscaling and liveness/readiness probes.",
        manifest_content="""apiVersion: apps/v1
kind: Deployment
metadata:
  name: careerdna-backend
  labels:
    app: careerdna-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: careerdna-backend
  template:
    metadata:
      labels:
        app: careerdna-backend
    spec:
      containers:
      - name: backend
        image: gcr.io/careerdna-ai/backend:v1.0.0
        ports:
        - containerPort: 8000
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 15
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          limits:
            cpu: "1000m"
            memory: "1024Mi"
          requests:
            cpu: "250m"
            memory: "512Mi\""""
    ),
    DeployManifest(
        target_platform="Google Cloud Run / AWS ECS",
        filename="deploy-cloudrun.sh",
        language="bash",
        description="One-command serverless deployment script with automatic HTTPS and secret injection.",
        manifest_content="""#!/usr/bin/env bash
set -e

echo "Deploying CareerDNA AI Backend to Cloud Run..."
gcloud run deploy careerdna-backend \\
  --image gcr.io/careerdna-ai/backend:latest \\
  --platform managed \\
  --region us-central1 \\
  --allow-unauthenticated \\
  --set-env-vars="COCKROACH_DATABASE_URL=$COCKROACH_DATABASE_URL" \\
  --memory 1Gi \\
  --cpu 1

echo "Deploying Next.js Frontend to Cloud Run..."
gcloud run deploy careerdna-frontend \\
  --image gcr.io/careerdna-ai/frontend:latest \\
  --platform managed \\
  --region us-central1 \\
  --allow-unauthenticated \\
  --memory 512Mi

echo "CareerDNA AI Multi-Cloud Stack Successfully Deployed!\""""
    )
]


@router.get("/deploy-manifests")
async def get_deploy_manifests():
    """Return production deployment manifests."""
    return {"manifests": MANIFESTS, "total": len(MANIFESTS)}
