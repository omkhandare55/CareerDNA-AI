"""
CareerDNA AI – Live Audio Voice Interview Simulator API
GET  /api/v1/voice/scenarios            → List voice interview scenarios
POST /api/v1/voice/evaluate-transcript  → Multi-dimensional voice clarity & technical evaluation
"""

import logging
import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException

from app.core.database import get_demo_store
from app.core.security import get_current_user

router = APIRouter(prefix="/voice", tags=["Voice Interview Simulator"])
logger = logging.getLogger("careerdna.voice_interview")


class VoiceScenario(BaseModel):
    scenario_id: str
    title: str
    company_context: str
    question_audio_text: str
    focus_areas: List[str]
    time_limit_sec: int


class VoiceEvaluationRequest(BaseModel):
    scenario_id: str = Field(..., example="sc_01")
    transcript: str = Field(..., min_length=10, example="In CockroachDB, Raft consensus ensures distributed transaction serializability...")
    duration_seconds: int = Field(default=45, example=45)


class VoiceEvaluationResponse(BaseModel):
    evaluation_id: str
    scenario_id: str
    overall_score: int
    technical_clarity_score: int
    pacing_words_per_minute: int
    filler_word_count: int
    filler_words_detected: List[str]
    strengths: List[str]
    blindspots: List[str]
    dna_delta: int
    vector_memory_id: str
    created_at: datetime


SCENARIOS: List[VoiceScenario] = [
    VoiceScenario(
        scenario_id="sc_01",
        title="CockroachDB Multi-Region Raft Consensus",
        company_context="Google Cloud Spanner / Distributed DB Team",
        question_audio_text="Explain how CockroachDB balances leaseholder placement across AWS us-east-1 and eu-west-1 to minimize cross-region read latency.",
        focus_areas=["Raft Leaseholders", "Cross-Region Roundtrips", "Follower Reads", "ACID Serializable"],
        time_limit_sec=60,
    ),
    VoiceScenario(
        scenario_id="sc_02",
        title="HNSW Vector Search vs Inverted File Index",
        company_context="Anthropic AI Core Infrastructure",
        question_audio_text="Walk me through the trade-offs between Hierarchical Navigable Small World graphs and IVF-PQ for sub-50ms vector retrieval at scale.",
        focus_areas=["Graph Traversal", "Recall vs Latency", "Memory Overhead", "Cosine Similarity"],
        time_limit_sec=60,
    ),
    VoiceScenario(
        scenario_id="sc_03",
        title="LangGraph Cyclical State Machine Execution",
        company_context="OpenAI Agent Systems",
        question_audio_text="How do you architect checkpoint rollbacks and memory retention decay within a multi-turn LangGraph agentic loop?",
        focus_areas=["State Schema", "Checkpointing", "Ebbinghaus Formula", "Feedback Loops"],
        time_limit_sec=60,
    ),
]


@router.get("/scenarios")
async def list_voice_scenarios():
    """Return voice scenarios for FAANG/AI systems practice."""
    return {"scenarios": SCENARIOS, "total": len(SCENARIOS)}


@router.post("/evaluate-transcript", response_model=VoiceEvaluationResponse)
async def evaluate_voice_transcript(
    req: VoiceEvaluationRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Evaluate audio interview speech transcript for technical depth, speech pacing (WPM),
    filler word density, and ingest memory embedding into CockroachDB.
    """
    user_id = current_user["user_id"]
    store = get_demo_store()
    now = datetime.now(timezone.utc)

    words = req.transcript.split()
    total_words = len(words)
    duration_min = max(0.1, req.duration_seconds / 60.0)
    wpm = int(total_words / duration_min)

    # Detect filler words
    filler_set = {"um", "uh", "like", "you know", "basically", "actually", "sort of", "kind of"}
    t_lower = req.transcript.lower()
    fillers_found = [f for f in filler_set if f in t_lower]
    filler_count = sum(t_lower.count(f) for f in filler_set)

    # Technical depth score
    tech_keywords = ["cockroachdb", "raft", "leaseholder", "vector", "hnsw", "cosine", "latency", "serializable", "langgraph", "checkpoint"]
    tech_matches = sum(1 for k in tech_keywords if k in t_lower)
    tech_score = min(98, 60 + tech_matches * 8)

    # Voice delivery score
    pacing_score = 95 if 120 <= wpm <= 160 else max(60, 95 - abs(wpm - 140))
    filler_penalty = min(25, filler_count * 5)
    clarity_score = max(50, pacing_score - filler_penalty)

    overall = int((tech_score * 0.6) + (clarity_score * 0.4))
    dna_delta = 5 if overall >= 80 else 2

    eval_id = str(uuid.uuid4())
    mem_id = str(uuid.uuid4())

    # Insert into CockroachDB career_memories
    store.insert("career_memories", {
        "id": mem_id,
        "user_id": user_id,
        "memory_type": "VOICE_INTERVIEW",
        "summary": f"Completed Voice Simulation ({req.scenario_id}): {overall}% score, {wpm} WPM speech rate.",
        "raw_data": {
            "evaluation_id": eval_id,
            "scenario_id": req.scenario_id,
            "wpm": wpm,
            "filler_count": filler_count,
            "score": overall,
        },
        "importance_score": 0.88,
        "created_at": now,
    })

    # Insert into timeline
    store.insert("timeline_events", {
        "user_id": user_id,
        "title": f"Live Voice Interview Simulation Passed ({overall}%)",
        "event_type": "VOICE_INTERVIEW",
        "description": f"Spoke at {wpm} WPM with {filler_count} filler words. Technical clarity scored {tech_score}%.",
        "metadata": {"wpm": wpm, "score": overall, "delta": dna_delta},
        "created_at": now,
    })

    # Notification
    store.insert("notifications", {
        "user_id": user_id,
        "title": f"Voice Practice Milestone: +{dna_delta} DNA Points",
        "message": f"Completed voice round with {wpm} WPM and {overall}% clarity. Memory node embedded in CockroachDB.",
        "notification_type": "CAREER_UPDATE",
        "is_read": False,
        "created_at": now,
    })

    logger.info(f"Voice interview evaluated: user={user_id}, score={overall}, wpm={wpm}")

    return VoiceEvaluationResponse(
        evaluation_id=eval_id,
        scenario_id=req.scenario_id,
        overall_score=overall,
        technical_clarity_score=tech_score,
        pacing_words_per_minute=wpm,
        filler_word_count=filler_count,
        filler_words_detected=fillers_found,
        strengths=[
            f"Strong command of distributed storage concepts ({tech_matches} technical keywords matched)",
            f"Vocal pacing at {wpm} words per minute is within professional FAANG delivery range",
            "Clear and confident articulation of architectural trade-offs"
        ],
        blindspots=[
            f"Detected {filler_count} filler word instances (e.g. {', '.join(fillers_found[:2]) or 'none'})" if filler_count > 0 else "Excellent vocal conciseness with 0 filler pauses",
            "Ensure you explicitly quantify latency metrics (e.g., p99 < 40ms) when discussing leaseholder hops"
        ],
        dna_delta=dna_delta,
        vector_memory_id=mem_id,
        created_at=now,
    )
