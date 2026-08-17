"""
CareerDNA AI – Learning Progress Endpoints
GET  /api/v1/learning         → All learning resources and progress
POST /api/v1/learning         → Add a new learning resource
PATCH /api/v1/learning/{id}   → Update progress percentage
"""

import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, Literal

from app.core.database import get_demo_store
from app.core.security import get_current_user

router = APIRouter(prefix="/learning", tags=["Learning"])
logger = logging.getLogger("careerdna.learning")


class LearningItem(BaseModel):
    resource_id: Optional[str] = None
    resource_title: str
    platform: Optional[str] = None
    resource_type: Literal["COURSE", "CERTIFICATION", "WORKSHOP", "BOOK", "PROJECT"] = "COURSE"
    progress_percentage: float = Field(ge=0.0, le=100.0, default=0.0)
    status: Literal["NOT_STARTED", "IN_PROGRESS", "COMPLETED"] = "IN_PROGRESS"
    certificate_url: Optional[str] = None
    created_at: Optional[datetime] = None


class AddLearningRequest(BaseModel):
    resource_title: str
    platform: Optional[str] = None
    resource_type: str = "COURSE"
    progress_percentage: float = Field(ge=0.0, le=100.0, default=0.0)


class UpdateProgressRequest(BaseModel):
    progress_percentage: float = Field(ge=0.0, le=100.0)
    certificate_url: Optional[str] = None


def _row_to_item(row: dict) -> LearningItem:
    created = row.get("created_at", datetime.now(timezone.utc))
    if isinstance(created, str):
        created = datetime.fromisoformat(created)

    pct = float(row.get("progress_percentage", 0))
    status = row.get("status", "IN_PROGRESS")
    if pct >= 100:
        status = "COMPLETED"
    elif pct == 0:
        status = "NOT_STARTED"

    return LearningItem(
        resource_id=row["id"],
        resource_title=row.get("resource_title", ""),
        platform=row.get("platform"),
        resource_type=row.get("resource_type", "COURSE"),
        progress_percentage=pct,
        status=status,
        certificate_url=row.get("certificate_url"),
        created_at=created,
    )


@router.get("")
async def list_learning(current_user: dict = Depends(get_current_user)):
    """Return all learning resources grouped by status."""
    user_id = current_user["user_id"]
    store = get_demo_store()
    rows = store.find_all("learning_progress", user_id=user_id)

    in_progress = []
    completed = []
    not_started = []

    for r in rows:
        item = _row_to_item(r)
        if item.status == "COMPLETED":
            completed.append(item)
        elif item.status == "NOT_STARTED":
            not_started.append(item)
        else:
            in_progress.append(item)

    return {
        "in_progress": in_progress,
        "completed": completed,
        "not_started": not_started,
        "total": len(rows),
        "completion_rate": round(len(completed) / max(len(rows), 1) * 100, 1),
    }


@router.post("", response_model=LearningItem, status_code=201)
async def add_learning(
    body: AddLearningRequest,
    current_user: dict = Depends(get_current_user),
):
    """Add a new learning resource."""
    user_id = current_user["user_id"]
    store = get_demo_store()
    now = datetime.now(timezone.utc)

    row = store.insert("learning_progress", {
        "user_id": user_id,
        "resource_title": body.resource_title,
        "platform": body.platform,
        "resource_type": body.resource_type,
        "progress_percentage": body.progress_percentage,
        "status": "NOT_STARTED" if body.progress_percentage == 0 else "IN_PROGRESS",
        "created_at": now,
    })
    return _row_to_item(row)


@router.patch("/{resource_id}", response_model=LearningItem)
async def update_progress(
    resource_id: str,
    body: UpdateProgressRequest,
    current_user: dict = Depends(get_current_user),
):
    """Update progress on a learning resource."""
    user_id = current_user["user_id"]
    store = get_demo_store()

    row = store.get_by_id("learning_progress", resource_id)
    if not row or row.get("user_id") != user_id:
        raise HTTPException(status_code=404, detail="Resource not found.")

    updates = {"progress_percentage": body.progress_percentage}
    if body.certificate_url:
        updates["certificate_url"] = body.certificate_url
    if body.progress_percentage >= 100:
        updates["status"] = "COMPLETED"
        updates["completed_at"] = datetime.now(timezone.utc)

        # Auto-insert memory for completed courses
        store.insert("career_memory", {
            "user_id": user_id,
            "memory_type": "CERTIFICATE",
            "summary": f"Completed {row.get('resource_title', 'course')} on {row.get('platform', 'online platform')}.",
            "raw_data": {"resource_id": resource_id},
            "importance_score": 0.80,
            "created_at": datetime.now(timezone.utc),
        })

    store.update("learning_progress", resource_id, updates)
    updated_row = store.get_by_id("learning_progress", resource_id)
    return _row_to_item(updated_row)
