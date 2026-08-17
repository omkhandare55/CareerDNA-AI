"""
CareerDNA AI – Interview History Endpoints
GET  /api/v1/interviews          → Paginated interview history
POST /api/v1/interviews          → Log a new interview
GET  /api/v1/interviews/{id}     → Single interview detail
"""

import logging
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.database import get_demo_store
from app.core.security import get_current_user
from app.models.schemas import InterviewRecord, InterviewListResponse

router = APIRouter(prefix="/interviews", tags=["Interviews"])
logger = logging.getLogger("careerdna.interviews")


def _row_to_record(row: dict) -> InterviewRecord:
    from datetime import date
    interview_date = row.get("interview_date")
    if isinstance(interview_date, datetime):
        interview_date = interview_date.date()
    elif isinstance(interview_date, str):
        interview_date = date.fromisoformat(interview_date)

    return InterviewRecord(
        interview_id=row["id"],
        company_name=row.get("company_name", ""),
        role_title=row.get("role_title", ""),
        interview_date=interview_date or datetime.now().date(),
        result=row.get("result", "PENDING"),
        questions_asked=row.get("questions_asked", []),
        weak_topics=row.get("weak_topics", []),
        feedback=row.get("feedback"),
        confidence_rating=float(row.get("confidence_rating", 0.5)),
    )


@router.get("", response_model=InterviewListResponse)
async def list_interviews(
    limit: int = Query(default=20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
):
    """Return paginated interview history sorted by date descending."""
    user_id = current_user["user_id"]
    store = get_demo_store()

    rows = store.find_all("interview_history", user_id=user_id)
    # Sort by interview_date descending
    rows.sort(key=lambda r: r.get("interview_date", datetime.min), reverse=True)
    rows = rows[:limit]

    return InterviewListResponse(
        interviews=[_row_to_record(r) for r in rows],
        total=len(rows),
    )


@router.get("/{interview_id}", response_model=InterviewRecord)
async def get_interview(
    interview_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Return a single interview record."""
    store = get_demo_store()
    row = store.get_by_id("interview_history", interview_id)
    if not row or row.get("user_id") != current_user["user_id"]:
        raise HTTPException(status_code=404, detail="Interview not found.")
    return _row_to_record(row)


@router.post("", response_model=InterviewRecord, status_code=201)
async def log_interview(
    body: InterviewRecord,
    current_user: dict = Depends(get_current_user),
):
    """Log a new interview experience and write it to Career Memory."""
    user_id = current_user["user_id"]
    store = get_demo_store()
    now = datetime.now(timezone.utc)

    row = store.insert("interview_history", {
        "user_id": user_id,
        "company_name": body.company_name,
        "role_title": body.role_title,
        "interview_date": body.interview_date,
        "result": body.result,
        "questions_asked": body.questions_asked,
        "weak_topics": body.weak_topics,
        "feedback": body.feedback,
        "confidence_rating": body.confidence_rating,
        "created_at": now,
    })

    # Auto-insert career memory event
    result_label = "Passed" if body.result == "PASSED" else ("Failed" if body.result == "FAILED" else "Pending")
    memory_type = "INTERVIEW_FAILURE" if body.result == "FAILED" else "CERTIFICATE"
    store.insert("career_memory", {
        "user_id": user_id,
        "memory_type": memory_type,
        "summary": (
            f"{result_label} {body.company_name} interview for {body.role_title}. "
            + (f"Weak areas: {', '.join(body.weak_topics)}." if body.weak_topics else "")
        ),
        "raw_data": {"interview_id": row["id"], "company": body.company_name},
        "importance_score": 0.95 if body.result == "FAILED" else 0.8,
        "created_at": now,
    })

    # Notification
    store.insert("notifications", {
        "user_id": user_id,
        "title": f"Interview Logged – {body.company_name}",
        "message": f"Your {body.company_name} interview ({result_label}) has been added to your Career DNA.",
        "notification_type": "CAREER_UPDATE",
        "is_read": False,
        "created_at": now,
    })

    logger.info(f"Interview logged: user={user_id}, company={body.company_name}, result={body.result}")
    return _row_to_record(row)
