"""
CareerDNA AI – Timeline Endpoints
GET /api/v1/timeline  → Unified career timeline across all event types
"""

import logging
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, Query

from app.core.database import get_demo_store
from app.core.security import get_current_user
from app.models.schemas import TimelineEvent, TimelineResponse

router = APIRouter(prefix="/timeline", tags=["Timeline"])
logger = logging.getLogger("careerdna.timeline")

_MEMORY_TYPE_LABELS = {
    "RESUME": "Resume",
    "CERTIFICATE": "Certificate",
    "INTERVIEW_FAILURE": "Interview",
    "REFLECTION": "Reflection",
    "PROJECT": "Project",
    "RECOMMENDATION_GENERATED": "Recommendation",
}

_MEMORY_TYPE_BADGE = {
    "INTERVIEW_FAILURE": "❌ Failed",
    "CERTIFICATE": "🏆 Certified",
    "PROJECT": "🚀 Project",
    "REFLECTION": "💭 Reflection",
    "RESUME": "📄 Resume",
    "RECOMMENDATION_GENERATED": "🤖 AI Insight",
}


@router.get("", response_model=TimelineResponse)
async def get_timeline(
    limit: int = Query(default=50, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
):
    """
    Returns a unified chronological timeline of all career events including:
    career memories, interview history, and learning milestones.
    """
    user_id = current_user["user_id"]
    store = get_demo_store()
    events: list[TimelineEvent] = []

    # ── Career Memories ────────────────────────────────────────────────────
    memories = store.find_all("career_memory", user_id=user_id)
    for m in memories:
        events.append(TimelineEvent(
            event_id=m["id"],
            event_type=m.get("memory_type", "MEMORY"),
            title=_MEMORY_TYPE_LABELS.get(m.get("memory_type", ""), "Career Event"),
            description=m.get("summary", ""),
            date=m.get("created_at", datetime.now(timezone.utc)),
            badge_label=_MEMORY_TYPE_BADGE.get(m.get("memory_type", ""), "📌 Memory"),
            confidence_score=float(m.get("importance_score", 0.5)),
            metadata=m.get("raw_data", {}),
        ))

    # ── Interview History ──────────────────────────────────────────────────
    interviews = store.find_all("interview_history", user_id=user_id)
    for iv in interviews:
        result = iv.get("result", "PENDING")
        badge = "✅ Passed" if result == "PASSED" else ("❌ Failed" if result == "FAILED" else "⏳ Pending")
        events.append(TimelineEvent(
            event_id=iv["id"],
            event_type="INTERVIEW",
            title=f"Interview – {iv.get('company_name', 'Company')}",
            description=(
                f"{iv.get('role_title', '')} role. {iv.get('feedback') or 'No feedback recorded.'}"
            ),
            date=datetime.combine(
                iv.get("interview_date", datetime.now().date()), datetime.min.time()
            ).replace(tzinfo=timezone.utc),
            badge_label=badge,
            confidence_score=float(iv.get("confidence_rating", 0.5)),
            metadata={
                "company": iv.get("company_name"),
                "result": result,
                "weak_topics": iv.get("weak_topics", []),
            },
        ))

    # ── Learning Milestones ────────────────────────────────────────────────
    courses = store.find_all("learning_progress", user_id=user_id)
    for c in courses:
        if c.get("status") == "COMPLETED":
            events.append(TimelineEvent(
                event_id=c["id"],
                event_type="CERTIFICATE",
                title=f"Completed – {c.get('resource_title', '')}",
                description=f"Finished {c.get('resource_type', 'course')} on {c.get('platform', '')}.",
                date=c.get("created_at", datetime.now(timezone.utc)),
                badge_label="🎓 Completed",
                confidence_score=1.0,
                metadata={"platform": c.get("platform"), "type": c.get("resource_type")},
            ))

    # Sort by date descending
    events.sort(key=lambda e: e.date, reverse=True)
    events = events[:limit]

    logger.info(f"Timeline for user {user_id}: {len(events)} events")
    return TimelineResponse(events=events, total=len(events))
