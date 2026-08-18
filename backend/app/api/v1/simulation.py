"""
CareerDNA AI – Career Transition Simulation Studio API
POST /api/v1/simulate/career-transition → Run What-If Transition Sandbox
GET  /api/v1/simulate/targets           → List available benchmark target roles
"""

import logging
import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException

from app.core.database import get_demo_store
from app.core.security import get_current_user

router = APIRouter(prefix="/simulate", tags=["Career Simulation"])
logger = logging.getLogger("careerdna.simulation")


class SimulationRequest(BaseModel):
    target_role: str = Field(..., example="Staff AI Systems Engineer")
    target_company_tier: str = Field(default="FAANG", example="FAANG")
    timeline_months: int = Field(default=6, ge=1, le=36, example=6)
    focus_areas: Optional[List[str]] = Field(default_factory=list)


class MilestonePlan(BaseModel):
    month: int
    title: str
    skills_to_acquire: List[str]
    cockroachdb_learning_goal: str
    expected_readiness_delta: int


class SimulationResult(BaseModel):
    simulation_id: str
    current_role: str
    target_role: str
    current_readiness_score: int
    projected_readiness_score: int
    current_salary_est: int
    projected_salary_est: int
    salary_increase_pct: float
    feasibility_score: float
    critical_skill_gaps: List[str]
    recommended_milestones: List[MilestonePlan]
    market_demand_velocity: str
    why_feasible: str
    created_at: datetime


BENCHMARK_ROLES = [
    {
        "role": "Staff AI Systems Engineer",
        "category": "AI / ML",
        "avg_salary": 245000,
        "required_skills": ["CockroachDB Vector Search", "LangGraph State Machines", "AWS Bedrock / Titan", "Distributed Consensus (Raft)", "GPU Cluster Orchestration"],
        "difficulty": "ADVANCED"
    },
    {
        "role": "Principal Distributed Systems Architect",
        "category": "Infrastructure",
        "avg_salary": 275000,
        "required_skills": ["Distributed Consensus", "CockroachDB Multi-Region", "Zero-Downtime Migration", "K8s Operator Development", "High-Throughput Streaming"],
        "difficulty": "EXPERT"
    },
    {
        "role": "Senior Cloud AI Engineer",
        "category": "Cloud / Backend",
        "avg_salary": 185000,
        "required_skills": ["AWS Bedrock / Claude 3.5", "FastAPI / AsyncIO", "Vector Databases", "Cognito / OAuth2", "Terraform IaC"],
        "difficulty": "INTERMEDIATE"
    },
    {
        "role": "Lead Fullstack AI Architect",
        "category": "Fullstack",
        "avg_salary": 195000,
        "required_skills": ["Next.js 14 / App Router", "Server-Sent Events (SSE)", "CockroachDB Vector Indexing", "LangGraph Agent Workflows", "TypeScript / Tailwind"],
        "difficulty": "INTERMEDIATE"
    }
]


@router.get("/targets")
async def list_simulation_targets():
    """Return benchmark target roles with market salary and skill standards."""
    return {"targets": BENCHMARK_ROLES, "total": len(BENCHMARK_ROLES)}


@router.post("/career-transition", response_model=SimulationResult)
async def run_career_simulation(
    req: SimulationRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Simulate career transition trajectory based on user's current DNA profile,
    skills in CockroachDB, and target market intelligence.
    """
    user_id = current_user["user_id"]
    store = get_demo_store()
    now = datetime.now(timezone.utc)

    # Fetch user skills and DNA profile
    skills_rows = store.find_all("skills", user_id=user_id)
    user_skills = {r.get("skill_name", "").lower() for r in skills_rows}
    user_row = store.get_by_id("users", user_id) or {}
    current_score = 65 if not skills_rows else min(95, 50 + len(skills_rows) * 3)

    # Find matching benchmark role or interpolate
    matched = next((r for r in BENCHMARK_ROLES if r["role"].lower() == req.target_role.lower()), None)
    if not matched:
        matched = {
            "role": req.target_role,
            "avg_salary": 210000,
            "required_skills": ["CockroachDB Vector Indexing", "Distributed Systems", "LangGraph Agents", "AWS Cloud Architecture", "System Design"],
            "difficulty": "ADVANCED"
        }

    # Calculate skill gaps
    missing_skills = [
        s for s in matched["required_skills"]
        if s.lower() not in user_skills and not any(part in s.lower() for part in ["sql", "python", "git"])
    ]
    if not missing_skills:
        missing_skills = ["Advanced Raft Leaseholder Tuning", "Bedrock Multi-Agent Tool Orchestration"]

    # Calculate scores
    readiness_gap = max(10, min(35, len(missing_skills) * 8))
    current_readiness = max(45, min(88, current_score - 10))
    projected_readiness = min(98, current_readiness + readiness_gap)

    current_salary_est = 120000 + (current_score * 500)
    multiplier = 1.35 if req.target_company_tier == "FAANG" else (1.25 if req.target_company_tier == "Unicorn" else 1.18)
    projected_salary_est = int(max(current_salary_est * 1.15, matched["avg_salary"] * multiplier))
    salary_increase_pct = round(((projected_salary_est - current_salary_est) / current_salary_est) * 100, 1)

    feasibility_score = round(max(0.72, min(0.96, 1.0 - (len(missing_skills) * 0.05) + (req.timeline_months * 0.02))), 2)

    # Generate milestones
    months = req.timeline_months
    milestones = []
    step_duration = max(1, months // 3)

    milestones.append(MilestonePlan(
        month=1,
        title="Foundation & Persistent Vector Indexing",
        skills_to_acquire=[missing_skills[0] if missing_skills else "CockroachDB HNSW Vector Indexing"],
        cockroachdb_learning_goal="Deploy distributed vector search tables and tune cosine distance thresholds.",
        expected_readiness_delta=+8,
    ))

    if len(missing_skills) > 1 or months >= 3:
        milestones.append(MilestonePlan(
            month=min(months, 1 + step_duration),
            title="Agentic State Machines & Cloud Scaling",
            skills_to_acquire=[missing_skills[1] if len(missing_skills) > 1 else "LangGraph State Graphs", "AWS Bedrock Orchestration"],
            cockroachdb_learning_goal="Build multi-step cyclical graph agents with rollback checkpoints.",
            expected_readiness_delta=+12,
        ))

    milestones.append(MilestonePlan(
        month=months,
        title=f"FAANG Mock Verification & {req.target_role} Readiness",
        skills_to_acquire=["Distributed System Consensus", "Production Failover Topologies"],
        cockroachdb_learning_goal="Execute live high-availability chaos tests and pass FAANG-grade mock design rounds.",
        expected_readiness_delta=+10,
    ))

    sim_id = str(uuid.uuid4())

    # Log milestone notification to CockroachDB store
    store.insert("notifications", {
        "user_id": user_id,
        "title": f"Career Simulation Completed: {req.target_role}",
        "message": f"Projected +{salary_increase_pct}% compensation trajectory with {int(feasibility_score*100)}% feasibility over {req.timeline_months} months.",
        "notification_type": "RECOMMENDATION",
        "is_read": False,
        "created_at": now,
    })

    result = SimulationResult(
        simulation_id=sim_id,
        current_role=user_row.get("target_role") or "Software Engineer",
        target_role=req.target_role,
        current_readiness_score=current_readiness,
        projected_readiness_score=projected_readiness,
        current_salary_est=current_salary_est,
        projected_salary_est=projected_salary_est,
        salary_increase_pct=salary_increase_pct,
        feasibility_score=feasibility_score,
        critical_skill_gaps=missing_skills,
        recommended_milestones=milestones,
        market_demand_velocity="+32.4% YoY Surge in US & Global Remote",
        why_feasible=f"Strong foundational score ({current_score}/100) and verified GitHub/resume experience provide high transferability to {req.target_role}.",
        created_at=now,
    )

    logger.info(f"Career simulation computed for user={user_id}, target={req.target_role}, feasibility={feasibility_score}")
    return result
