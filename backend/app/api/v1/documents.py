"""
CareerDNA AI – Document Upload Endpoints
POST /api/v1/documents/presigned-url   → Get S3 presigned URL
POST /api/v1/documents/confirm-upload  → Confirm upload and trigger memory ingestion
"""

import logging
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException

from app.core.database import get_demo_store
from app.core.security import get_current_user
from app.models.schemas import PresignedURLRequest, PresignedURLResponse
from app.services import s3_service, bedrock_service

router = APIRouter(prefix="/documents", tags=["Documents"])
logger = logging.getLogger("careerdna.documents")


@router.post("/presigned-url", response_model=PresignedURLResponse)
async def get_presigned_url(
    body: PresignedURLRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Generates an S3 presigned PUT URL for secure client-side document upload.
    Returns { upload_url, s3_key, expires_in }.
    """
    user_id = current_user["user_id"]

    upload_url, s3_key = s3_service.generate_presigned_url(
        user_id=user_id,
        file_name=body.get_effective_filename(),
        content_type=body.content_type,
        document_type=body.document_type,
    )

    logger.info(f"Generated presigned URL for user {user_id}: key={s3_key}")

    return PresignedURLResponse(
        upload_url=upload_url,
        s3_key=s3_key,
        expires_in=3600,
    )


@router.post("/confirm-upload")
async def confirm_upload(
    s3_key: str,
    document_type: str = "RESUME",
    current_user: dict = Depends(get_current_user),
):
    """
    Called after a successful S3 PUT.  
    Simulates: text extraction → embedding generation → memory insertion.
    In production this is triggered by an S3 event → Lambda → Bedrock pipeline.
    """
    user_id = current_user["user_id"]
    store = get_demo_store()

    # Simulate document text extraction
    extracted_text = (
        f"Uploaded {document_type}: {s3_key}. "
        "Skills: Python, FastAPI, React, AWS. "
        "Experience: 3 years fullstack development at StartupCo."
    )

    # Generate embedding (real or mock)
    embedding = await bedrock_service.generate_embedding(extracted_text)

    # Insert career memory
    memory = store.insert("career_memory", {
        "user_id": user_id,
        "memory_type": document_type,
        "summary": f"Uploaded {document_type.lower()}: {s3_key.split('/')[-1]}",
        "raw_data": {"s3_key": s3_key, "extracted_text": extracted_text[:500]},
        "importance_score": 0.85 if document_type == "RESUME" else 0.75,
        "created_at": datetime.now(timezone.utc),
    })

    # Insert notification
    store.insert("notifications", {
        "user_id": user_id,
        "title": f"{document_type.title()} Processed",
        "message": f"Your {document_type.lower()} was successfully processed and added to your Career DNA.",
        "notification_type": "CAREER_UPDATE",
        "is_read": False,
        "created_at": datetime.now(timezone.utc),
    })

    logger.info(f"Document ingested for user {user_id}: memory_id={memory['id']}")

    return {
        "memory_id": memory["id"],
        "message": f"{document_type} successfully ingested into Career DNA.",
        "embedding_dimensions": len(embedding),
    }
