"""
CareerDNA AI – AWS S3 Service
Generates presigned PUT URLs for secure client-side document uploads.
Falls back to mock mode when AWS credentials are not available.
"""

import logging
import uuid
from typing import Tuple

from app.core.config import get_settings

logger = logging.getLogger("careerdna.s3")
settings = get_settings()

_s3_client = None


def _get_s3_client():
    global _s3_client
    if _s3_client is None:
        import boto3
        _s3_client = boto3.client(
            "s3",
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID or None,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY or None,
        )
    return _s3_client


def _use_mock() -> bool:
    return settings.USE_MOCK_AI or not settings.has_aws_credentials


def generate_presigned_url(
    user_id: str,
    file_name: str,
    content_type: str = "application/pdf",
    document_type: str = "RESUME",
) -> Tuple[str, str]:
    """
    Returns (presigned_upload_url, s3_key).
    In mock mode, returns a fake URL so the demo contract works.
    """
    safe_name = file_name.replace(" ", "_")
    s3_key = f"{document_type.lower()}s/{user_id}/{uuid.uuid4()}_{safe_name}"

    if _use_mock():
        logger.debug("[MOCK] generate_presigned_url")
        mock_url = (
            f"https://{settings.S3_BUCKET_NAME}.s3.amazonaws.com/{s3_key}"
            f"?X-Amz-Mock=true&X-Amz-Expires={settings.S3_PRESIGNED_URL_EXPIRY}"
        )
        return mock_url, s3_key

    try:
        client = _get_s3_client()
        url = client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": settings.S3_BUCKET_NAME,
                "Key": s3_key,
                "ContentType": content_type,
            },
            ExpiresIn=settings.S3_PRESIGNED_URL_EXPIRY,
        )
        return url, s3_key
    except Exception as exc:
        logger.warning(f"S3 presigned URL generation failed, using mock: {exc}")
        mock_url = (
            f"https://{settings.S3_BUCKET_NAME}.s3.amazonaws.com/{s3_key}"
            f"?X-Amz-Mock=true&X-Amz-Expires={settings.S3_PRESIGNED_URL_EXPIRY}"
        )
        return mock_url, s3_key
