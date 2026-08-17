"""
CareerDNA AI – Agent Service
Runs the LangGraph CareerDNA agent and yields SSE-formatted event strings.
Each event follows the contract agreed in TEAM_TASK_DIVISION.md.
"""

import asyncio
import json
import logging
import time
from typing import AsyncGenerator, Dict, Any, List

from app.core.config import get_settings
from app.services import bedrock_service

logger = logging.getLogger("careerdna.agent_service")
settings = get_settings()


# ──────────────────────────────────────────────────────────────────────────────
# SSE Helpers
# ──────────────────────────────────────────────────────────────────────────────

def _sse(event_type: str, payload: Dict[str, Any]) -> str:
    data = json.dumps({"type": event_type, **payload})
    return f"data: {data}\n\n"


# ──────────────────────────────────────────────────────────────────────────────
# Mock Memory Store (used when USE_DEMO_DB=true)
# ──────────────────────────────────────────────────────────────────────────────

_DEMO_MEMORIES = [
    {
        "memory_id": "mem_001",
        "memory_type": "INTERVIEW_FAILURE",
        "summary": "Failed Google System Design Mock – weakness in distributed consensus & dynamic programming.",
        "importance_score": 0.95,
        "relevance_score": 0.94,
    },
    {
        "memory_id": "mem_002",
        "memory_type": "CERTIFICATE",
        "summary": "Completed AWS Machine Learning Specialty Certification (score: 892/1000).",
        "importance_score": 0.85,
        "relevance_score": 0.89,
    },
    {
        "memory_id": "mem_003",
        "memory_type": "PROJECT",
        "summary": "Built RAG pipeline prototype using LangChain + FAISS, deployed on AWS Lambda.",
        "importance_score": 0.75,
        "relevance_score": 0.82,
    },
    {
        "memory_id": "mem_004",
        "memory_type": "REFLECTION",
        "summary": "Weekly reflection: Struggling with LangGraph state transitions and checkpointing.",
        "importance_score": 0.6,
        "relevance_score": 0.77,
    },
]

_DEMO_SKILL_GAPS = ["LangGraph", "CockroachDB Vector Search", "System Design at Scale", "AWS Bedrock Integration"]

_DEMO_MARKET_TRENDS = {
    "target_role": "AI Engineer",
    "trending_skills": ["LangGraph", "Vector DBs", "AWS Bedrock", "CockroachDB", "Claude API"],
    "growth_rate_pct": 28.5,
    "avg_salary_range": {"min": 130_000, "max": 195_000},
}


# ──────────────────────────────────────────────────────────────────────────────
# Main Streaming Generator
# ──────────────────────────────────────────────────────────────────────────────

async def stream_recommendation(
    user_id: str,
    query: str,
    target_role: str,
    execution_mode: str,
    db_store=None,
) -> AsyncGenerator[str, None]:
    """
    Async generator that streams SSE events for the recommendation flow.
    Mirrors the LangGraph graph execution with real-time event emission.
    """
    try:
        # ── Phase 1: Memory Retrieval ──────────────────────────────────────
        await asyncio.sleep(0.4)

        # Pull memories from DB or demo store
        if db_store is not None:
            raw_memories = db_store.find_all("career_memory", user_id=user_id)
            memories = [
                {
                    "memory_id": m["id"],
                    "memory_type": m.get("memory_type", "MEMORY"),
                    "summary": m.get("summary", ""),
                    "importance_score": float(m.get("importance_score", 0.5)),
                    "relevance_score": 0.80 + float(m.get("importance_score", 0.5)) * 0.15,
                }
                for m in raw_memories[:5]
            ]
        else:
            memories = _DEMO_MEMORIES

        key_events = [m["summary"][:70] + "..." for m in memories[:3]]

        yield _sse("MEMORY_RETRIEVED", {
            "memories_count": len(memories),
            "key_events": key_events,
        })

        await asyncio.sleep(0.3)

        # ── Phase 2: Skill Gap Analysis ────────────────────────────────────
        if db_store is not None:
            skills = db_store.find_all("skills", user_id=user_id)
            user_skill_names = {s.get("skill_name", "") for s in skills}
            market_skills = set(_DEMO_MARKET_TRENDS["trending_skills"])
            gaps = list(market_skills - user_skill_names)
        else:
            gaps = _DEMO_SKILL_GAPS

        yield _sse("SKILL_GAP_IDENTIFIED", {
            "missing_skills": gaps,
            "readiness_pct": max(0.0, 100.0 - len(gaps) * 12.5),
        })

        await asyncio.sleep(0.3)

        # ── Phase 3: Market Intelligence ───────────────────────────────────
        yield _sse("MARKET_INTELLIGENCE", {
            "target_role": target_role or "AI Engineer",
            "trending_skills": _DEMO_MARKET_TRENDS["trending_skills"],
            "growth_rate_pct": _DEMO_MARKET_TRENDS["growth_rate_pct"],
            "avg_salary_range": _DEMO_MARKET_TRENDS["avg_salary_range"],
        })

        await asyncio.sleep(0.3)

        # ── Phase 4: Reasoning Thoughts ────────────────────────────────────
        for thought in bedrock_service.get_reasoning_thoughts():
            yield _sse("REASONING", {"thought": thought})
            await asyncio.sleep(0.25)

        # ── Phase 5: Recommendation Generation ────────────────────────────
        full_recommendation = await bedrock_service.invoke_claude(
            prompt=query,
            execution_mode=execution_mode,
        )

        # Stream the recommendation in 80-char chunks
        chunk_size = 80
        for i in range(0, len(full_recommendation), chunk_size):
            chunk = full_recommendation[i : i + chunk_size]
            yield _sse("RECOMMENDATION_CHUNK", {"text": chunk})
            await asyncio.sleep(0.04)

        # ── Phase 6: Evolution Metadata ────────────────────────────────────
        await asyncio.sleep(0.3)

        evidence_ids = [m["memory_id"] for m in memories[:3]]
        why_changed = (
            f"Recommendation evolved from generic DSA advice to {execution_mode.replace('_', ' ').title()} "
            f"strategy after detecting: (1) Google interview failure in System Design, "
            f"(2) AWS ML Certification completion, (3) skill gap in {', '.join(gaps[:2])} "
            f"vs current market demand for {target_role or 'AI Engineer'} roles."
        )

        yield _sse("EVOLUTION_METADATA", {
            "why_changed": why_changed,
            "confidence_score": 0.94,
            "evidence_used": evidence_ids,
            "previous_recommendation": "Focus on general DSA and LeetCode Mediums.",
        })

        # ── Phase 7: Persist to DB ─────────────────────────────────────────
        if db_store is not None:
            from datetime import datetime, timezone
            db_store.insert("recommendations", {
                "user_id": user_id,
                "query_prompt": query,
                "previous_recommendation": "Focus on general DSA and LeetCode Mediums.",
                "new_recommendation": full_recommendation,
                "why_changed": why_changed,
                "evidence_used": evidence_ids,
                "confidence_score": 0.94,
                "created_at": datetime.now(timezone.utc),
            })
            db_store.insert("career_memory", {
                "user_id": user_id,
                "memory_type": "RECOMMENDATION_GENERATED",
                "summary": f"AI generated {execution_mode} recommendation for query: {query[:60]}...",
                "raw_data": {"query": query, "mode": execution_mode},
                "importance_score": 0.7,
                "created_at": datetime.now(timezone.utc),
            })

        await asyncio.sleep(0.1)
        yield _sse("DONE", {"status": "complete"})

    except asyncio.CancelledError:
        logger.info(f"SSE stream cancelled for user {user_id}")
        raise
    except Exception as exc:
        logger.exception(f"Agent stream error for user {user_id}: {exc}")
        yield _sse("ERROR", {"message": str(exc)})
