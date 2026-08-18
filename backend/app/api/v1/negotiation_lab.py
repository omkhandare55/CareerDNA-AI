"""
CareerDNA AI – Salary Counter-Offer & Equity Negotiation Battle Lab API
GET  /api/v1/negotiation/benchmarks    → Compensation bands by tier & role
POST /api/v1/negotiation/counter-offer → AI Hiring Manager counter-offer battle simulator
"""

import logging
import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException

from app.core.database import get_demo_store
from app.core.security import get_current_user

router = APIRouter(prefix="/negotiation", tags=["Salary Negotiation Battle Lab"])
logger = logging.getLogger("careerdna.negotiation_lab")


class CompBenchmark(BaseModel):
    tier: str
    role_title: str
    base_salary_median: int
    equity_annual_median: int
    signing_bonus_median: int
    total_annual_comp: int


class CounterOfferRequest(BaseModel):
    company_name: str = Field(default="Google", example="Google")
    target_role: str = Field(default="Staff AI Systems Engineer", example="Staff AI Systems Engineer")
    initial_base: int = Field(default=220000, example=220000)
    initial_equity_annual: int = Field(default=120000, example=120000)
    initial_signing_bonus: int = Field(default=30000, example=30000)
    counter_base: int = Field(default=245000, example=245000)
    counter_equity_annual: int = Field(default=150000, example=150000)
    counter_signing_bonus: int = Field(default=50000, example=50000)
    competing_offer_company: Optional[str] = Field(default="Anthropic", example="Anthropic")
    justification_pitch: str = Field(..., example="Given my verified CockroachDB vector indexing background and Anthropic competing offer...")


class CounterOfferResponse(BaseModel):
    negotiation_id: str
    company_name: str
    acceptance_probability_pct: int
    hiring_manager_verdict: str  # "ACCEPTED" | "COUNTER_PROPOSED" | "REJECTED"
    recruiter_response_dialogue: str
    final_base_salary: int
    final_equity_annual: int
    final_signing_bonus: int
    first_year_comp_delta: int
    four_year_total_delta: int
    strategic_advice: List[str]
    created_at: datetime


BENCHMARKS: List[CompBenchmark] = [
    CompBenchmark(
        tier="Tier 1 (FAANG / AI Labs)",
        role_title="Staff AI Systems Engineer",
        base_salary_median=245000,
        equity_annual_median=160000,
        signing_bonus_median=50000,
        total_annual_comp=455000,
    ),
    CompBenchmark(
        tier="Tier 1 (FAANG / AI Labs)",
        role_title="Principal Distributed Systems Architect",
        base_salary_median=275000,
        equity_annual_median=220000,
        signing_bonus_median=75000,
        total_annual_comp=570000,
    ),
    CompBenchmark(
        tier="Tier 2 (High-Growth Unicorn)",
        role_title="Staff Backend / Storage Engineer",
        base_salary_median=215000,
        equity_annual_median=110000,
        signing_bonus_median=35000,
        total_annual_comp=360000,
    )
]


@router.get("/benchmarks")
async def get_comp_benchmarks():
    """Return top compensation bands and market equity medians."""
    return {"benchmarks": BENCHMARKS, "total": len(BENCHMARKS)}


@router.post("/counter-offer", response_model=CounterOfferResponse)
async def evaluate_counter_offer(
    req: CounterOfferRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Simulate AI Hiring Manager negotiation round: calculates acceptance probability
    based on leverage, competing offers, and market bands.
    """
    user_id = current_user["user_id"]
    store = get_demo_store()
    now = datetime.now(timezone.utc)

    # Initial vs Counter deltas
    initial_first_year = req.initial_base + req.initial_equity_annual + req.initial_signing_bonus
    counter_first_year = req.counter_base + req.counter_equity_annual + req.counter_signing_bonus
    first_year_delta = counter_first_year - initial_first_year

    # Leverage multiplier from competing offer & justification
    has_competing = bool(req.competing_offer_company and len(req.competing_offer_company) > 2)
    has_cockroach = "cockroach" in req.justification_pitch.lower() or "vector" in req.justification_pitch.lower()

    if first_year_delta <= 40000 and has_competing:
        prob = 92
        verdict = "ACCEPTED"
        f_base = req.counter_base
        f_equity = req.counter_equity_annual
        f_bonus = req.counter_signing_bonus
        dialogue = (
            f"We reviewed your counter-proposal with our compensation committee. Given your verified expertise in "
            f"distributed vector indexing on CockroachDB and the competing timeline with {req.competing_offer_company}, "
            f"we are delighted to meet your numbers: ${f_base:,} Base, ${f_equity:,}/yr Equity, and a ${f_bonus:,} Signing Bonus."
        )
    elif first_year_delta <= 80000:
        prob = 78
        verdict = "COUNTER_PROPOSED"
        f_base = int((req.initial_base + req.counter_base) / 2)
        f_equity = req.counter_equity_annual
        f_bonus = int((req.initial_signing_bonus + req.counter_signing_bonus) / 2)
        dialogue = (
            f"We cannot meet the full base salary increase due to band constraints, but we have adjusted your equity grant "
            f"to ${f_equity:,}/yr and increased your signing bonus to ${f_bonus:,}. Total 4-year compensation is significantly increased."
        )
    else:
        prob = 45
        verdict = "COUNTER_PROPOSED"
        f_base = req.initial_base + 10000
        f_equity = req.initial_equity_annual + 20000
        f_bonus = req.initial_signing_bonus + 15000
        dialogue = (
            f"Your counter represents an out-of-band jump for this tier. We have maximized our discretionary band to "
            f"offer ${f_base:,} Base and ${f_bonus:,} Signing Bonus."
        )

    realized_first_year = f_base + f_equity + f_bonus
    realized_delta = realized_first_year - initial_first_year
    four_year_delta = realized_delta * 4

    neg_id = str(uuid.uuid4())
    timeline_id = str(uuid.uuid4())

    # Record in timeline
    store.insert("timeline_events", {
        "id": timeline_id,
        "user_id": user_id,
        "title": f"Salary Negotiation Simulation: +${realized_delta:,}/yr Gain",
        "event_type": "NEGOTIATION",
        "description": f"Negotiated with {req.company_name} recruiter. Verdict: {verdict} ({prob}% acceptance). 4-Year Gain: +${four_year_delta:,}.",
        "metadata": {"company": req.company_name, "verdict": verdict, "gain": four_year_delta},
        "created_at": now,
    })

    # Notification
    store.insert("notifications", {
        "user_id": user_id,
        "title": f"Negotiation Win: +${four_year_delta:,} 4-Year Comp",
        "message": f"AI Hiring Manager simulation concluded with {verdict} outcome. First year gain: +${realized_delta:,}.",
        "notification_type": "RECOMMENDATION",
        "is_read": False,
        "created_at": now,
    })

    logger.info(f"Negotiation simulated for user={user_id}, verdict={verdict}, 4yr_delta=${four_year_delta}")

    return CounterOfferResponse(
        negotiation_id=neg_id,
        company_name=req.company_name,
        acceptance_probability_pct=prob,
        hiring_manager_verdict=verdict,
        recruiter_response_dialogue=dialogue,
        final_base_salary=f_base,
        final_equity_annual=f_equity,
        final_signing_bonus=f_bonus,
        first_year_comp_delta=realized_delta,
        four_year_total_delta=four_year_delta,
        strategic_advice=[
            "Always anchor equity increases to 4-year enterprise valuation trajectory.",
            "Cite verified CockroachDB production benchmarks as irreplaceable architectural leverage.",
            "Request accelerated 1-year cliff vesting or quarterly equity vesting schedules."
        ],
        created_at=now,
    )
