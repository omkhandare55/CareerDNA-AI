"""
CareerDNA AI – Career DNA Endpoints
GET /api/v1/dna        → Full Career DNA profile
PUT /api/v1/dna        → Update goals and preferences
GET /api/v1/dna/score  → Just the DNA score metrics
"""

import logging
import math
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException

from app.core.database import get_demo_store
from app.core.security import get_current_user
from app.models.schemas import DNAResponse, SkillItem, UpdateDNARequest

router = APIRouter(prefix="/dna", tags=["Career DNA"])
logger = logging.getLogger("careerdna.dna")


def _compute_dna_score(skills: list, interviews: list, memories: list) -> dict:
    """Computes dynamic Career DNA metrics from stored data."""
    if not skills:
        return {
            "dna_score": 50,
            "growth_velocity": 1.0,
            "technical_readiness": 0.5,
            "confidence_score": 0.5,
            "consistency_score": 0.5,
        }

    tech_skills = [s for s in skills if s.get("category") == "TECHNICAL"]
    avg_proficiency = sum(float(s.get("proficiency_score", 0.5)) for s in tech_skills) / max(len(tech_skills), 1)

    passed = sum(1 for iv in interviews if iv.get("result") == "PASSED")
    total_interviews = len(interviews)
    interview_success_rate = passed / max(total_interviews, 1)

    memory_count = len(memories)
    consistency = min(1.0, memory_count / 10.0)

    technical_readiness = (avg_proficiency * 0.6) + (interview_success_rate * 0.4)
    confidence = (avg_proficiency * 0.4) + (interview_success_rate * 0.3) + (consistency * 0.3)
    dna_score = int(technical_readiness * 60 + confidence * 25 + consistency * 15)

    # Growth velocity: ratio of recent high-importance memories
    high_importance = [m for m in memories if float(m.get("importance_score", 0.5)) > 0.75]
    growth_velocity = round(1.0 + (len(high_importance) / max(memory_count, 1)), 2)

    return {
        "dna_score": min(100, max(0, dna_score)),
        "growth_velocity": growth_velocity,
        "technical_readiness": round(technical_readiness, 4),
        "confidence_score": round(confidence, 4),
        "consistency_score": round(consistency, 4),
    }


@router.get("", response_model=DNAResponse)
async def get_dna(current_user: dict = Depends(get_current_user)):
    """Return the full Career DNA profile including skills, scores, and goals."""
    user_id = current_user["user_id"]
    store = get_demo_store()

    user = store.get_by_id("users", user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    skills = store.find_all("skills", user_id=user_id)
    interviews = store.find_all("interview_history", user_id=user_id)
    memories = store.find_all("career_memory", user_id=user_id)

    metrics = _compute_dna_score(skills, interviews, memories)

    tech_skills = [
        SkillItem(
            skill_id=s["id"],
            skill_name=s["skill_name"],
            category=s["category"],
            proficiency_score=float(s.get("proficiency_score", 0.5)),
            verified_by_evidence=bool(s.get("verified_by_evidence", False)),
        )
        for s in skills if s.get("category") == "TECHNICAL"
    ]

    soft_skills = [
        SkillItem(
            skill_id=s["id"],
            skill_name=s["skill_name"],
            category=s["category"],
            proficiency_score=float(s.get("proficiency_score", 0.5)),
            verified_by_evidence=bool(s.get("verified_by_evidence", False)),
        )
        for s in skills if s.get("category") == "SOFT"
    ]

    # Derive weaknesses from failed interview topics
    weaknesses = []
    for iv in interviews:
        weaknesses.extend(iv.get("weak_topics", []))
    known_weaknesses = list(set(weaknesses))

    return DNAResponse(
        user_id=user_id,
        target_role=user.get("target_role"),
        technical_skills=tech_skills,
        soft_skills=soft_skills,
        known_weaknesses=known_weaknesses,
        career_goals=[user.get("target_role", "AI Engineer")] if user.get("target_role") else [],
        updated_at=datetime.now(timezone.utc),
        **metrics,
    )


@router.get("/score")
async def get_dna_score(current_user: dict = Depends(get_current_user)):
    """Returns just the numeric DNA score and velocity metrics."""
    user_id = current_user["user_id"]
    store = get_demo_store()

    skills = store.find_all("skills", user_id=user_id)
    interviews = store.find_all("interview_history", user_id=user_id)
    memories = store.find_all("career_memory", user_id=user_id)

    return _compute_dna_score(skills, interviews, memories)


@router.put("", response_model=dict)
async def update_dna(
    body: UpdateDNARequest,
    current_user: dict = Depends(get_current_user),
):
    """Update career goals, target role, and known weaknesses."""
    user_id = current_user["user_id"]
    store = get_demo_store()

    updates = {}
    if body.target_role is not None:
        updates["target_role"] = body.target_role
    if body.career_goals is not None:
        updates["career_goals"] = body.career_goals

    store.update("users", user_id, updates)

    return {"message": "Career DNA updated successfully.", "updated_fields": list(updates.keys())}
