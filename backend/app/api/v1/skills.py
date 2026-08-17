"""
CareerDNA AI – Skills Endpoints
GET  /api/v1/skills        → All skills by category
POST /api/v1/skills        → Add or update a skill
DELETE /api/v1/skills/{id} → Remove a skill
"""

import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException

from app.core.database import get_demo_store
from app.core.security import get_current_user
from app.models.schemas import AddSkillRequest, SkillItem

router = APIRouter(prefix="/skills", tags=["Skills"])
logger = logging.getLogger("careerdna.skills")


@router.get("")
async def list_skills(current_user: dict = Depends(get_current_user)):
    """Return all skills grouped by category."""
    user_id = current_user["user_id"]
    store = get_demo_store()
    rows = store.find_all("skills", user_id=user_id)

    technical = []
    soft = []
    other = []

    for s in rows:
        item = SkillItem(
            skill_id=s["id"],
            skill_name=s.get("skill_name", ""),
            category=s.get("category", "TECHNICAL"),
            proficiency_score=float(s.get("proficiency_score", 0.5)),
            verified_by_evidence=bool(s.get("verified_by_evidence", False)),
        )
        cat = s.get("category", "").upper()
        if cat == "TECHNICAL":
            technical.append(item)
        elif cat == "SOFT":
            soft.append(item)
        else:
            other.append(item)

    # Sort by proficiency descending
    for lst in (technical, soft, other):
        lst.sort(key=lambda x: x.proficiency_score, reverse=True)

    return {
        "technical": technical,
        "soft": soft,
        "other": other,
        "total": len(rows),
    }


@router.post("", response_model=SkillItem, status_code=201)
async def add_skill(
    body: AddSkillRequest,
    current_user: dict = Depends(get_current_user),
):
    """Add a new skill or update proficiency if the skill already exists."""
    user_id = current_user["user_id"]
    store = get_demo_store()

    # Check if skill already exists (case-insensitive)
    existing = next(
        (
            s for s in store.find_all("skills", user_id=user_id)
            if s.get("skill_name", "").lower() == body.skill_name.lower()
        ),
        None,
    )

    if existing:
        store.update("skills", existing["id"], {
            "proficiency_score": body.proficiency_score,
            "category": body.category,
        })
        existing["proficiency_score"] = body.proficiency_score
        return SkillItem(
            skill_id=existing["id"],
            skill_name=existing["skill_name"],
            category=existing["category"],
            proficiency_score=body.proficiency_score,
            verified_by_evidence=existing.get("verified_by_evidence", False),
        )

    row = store.insert("skills", {
        "user_id": user_id,
        "skill_name": body.skill_name,
        "category": body.category,
        "proficiency_score": body.proficiency_score,
        "verified_by_evidence": False,
        "created_at": datetime.now(timezone.utc),
    })

    return SkillItem(
        skill_id=row["id"],
        skill_name=row["skill_name"],
        category=row["category"],
        proficiency_score=float(row["proficiency_score"]),
        verified_by_evidence=False,
    )


@router.delete("/{skill_id}")
async def delete_skill(
    skill_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Delete a skill from the user's profile."""
    store = get_demo_store()
    row = store.get_by_id("skills", skill_id)
    if not row or row.get("user_id") != current_user["user_id"]:
        raise HTTPException(status_code=404, detail="Skill not found.")
    store.delete("skills", skill_id)
    return {"message": "Skill deleted."}
