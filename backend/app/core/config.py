"""
CareerDNA AI – Core Application Settings
Reads from environment variables / .env file via pydantic-settings
"""

from functools import lru_cache
from typing import List
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ---- Application ----
    APP_NAME: str = "CareerDNA AI"
    APP_ENV: str = "development"
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24h

    # ---- CORS ----
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    @property
    def cors_origins(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    # ---- Database ----
    DATABASE_URL: str = "postgresql+asyncpg://root@localhost:26257/careerdna?sslmode=disable"
    USE_DEMO_DB: bool = True  # Falls back to in-memory store when True

    # ---- AWS Core ----
    AWS_REGION: str = "us-east-1"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""

    # ---- AWS Bedrock ----
    BEDROCK_CLAUDE_MODEL_ID: str = "anthropic.claude-3-5-sonnet-20241022-v2:0"
    BEDROCK_EMBEDDING_MODEL_ID: str = "amazon.titan-embed-text-v2:0"
    USE_MOCK_AI: bool = True  # Returns deterministic mocks when True

    # ---- AWS S3 ----
    S3_BUCKET_NAME: str = "careerdna-resumes-dev"
    S3_PRESIGNED_URL_EXPIRY: int = 3600

    # ---- AWS Cognito (optional) ----
    USE_COGNITO_AUTH: bool = False
    COGNITO_USER_POOL_ID: str = ""
    COGNITO_APP_CLIENT_ID: str = ""
    COGNITO_REGION: str = "us-east-1"

    @property
    def is_production(self) -> bool:
        return self.APP_ENV.lower() == "production"

    @property
    def has_aws_credentials(self) -> bool:
        return bool(self.AWS_ACCESS_KEY_ID and self.AWS_SECRET_ACCESS_KEY)


@lru_cache
def get_settings() -> Settings:
    return Settings()
