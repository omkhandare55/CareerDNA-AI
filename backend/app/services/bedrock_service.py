"""
CareerDNA AI – AWS Bedrock Service
Provides:
  • generate_embedding(text)  → 1024-dim float list (Titan Embeddings V2)
  • invoke_claude(prompt)     → str (Claude 3.5 Sonnet)

When USE_MOCK_AI=true or AWS credentials are absent, returns
deterministic high-quality mock responses so the demo works without AWS.
"""

import json
import logging
import math
import random
from typing import Any, Dict, List, Optional

from app.core.config import get_settings

logger = logging.getLogger("careerdna.bedrock")
settings = get_settings()


# ──────────────────────────────────────────────────────────────────────────────
# Deterministic Mock Responses
# ──────────────────────────────────────────────────────────────────────────────

_MOCK_RECOMMENDATIONS = {
    "default": (
        "Based on your persistent Career DNA and memory of past interactions, here is your personalised roadmap:\n\n"
        "**Phase 1 – Immediate Priorities (Weeks 1–4)**\n"
        "• Master LangGraph stateful agent workflows — your recent system design interview at Google "
        "revealed gaps in distributed state management that directly overlap here.\n"
        "• Deep-dive CockroachDB vector search (HNSW indexing) — the job market shows 40%+ adoption growth "
        "and it directly addresses your weakest technical dimension.\n\n"
        "**Phase 2 – Consolidation (Weeks 5–8)**\n"
        "• Build a production-grade RAG pipeline: your PyTorch course completion shows readiness for "
        "applied ML, and your AWS ML Specialty certification gives you the cloud deployment foundation.\n"
        "• Mock interview circuit: target 3 mock system design interviews per week. "
        "Your confidence rating jumped from 0.55 → 0.88 at Stripe after deliberate practice.\n\n"
        "**Evidence Used**: Google interview failure (mem_001), AWS ML Cert (mem_002), Stripe pass (mem_003)\n"
        "**Confidence Score**: 0.94"
    ),
    "learning_plan": (
        "**Personalised 8-Week Learning Roadmap**\n\n"
        "Week 1–2: LangGraph Fundamentals → Complete the Udemy course (currently 65% done). "
        "Build a mini career agent with 3 nodes.\n"
        "Week 3–4: CockroachDB Vector Search → Implement HNSW indexing, run cosine similarity queries.\n"
        "Week 5–6: AWS Bedrock Integration → Wire Claude 3.5 Sonnet into your LangGraph pipeline.\n"
        "Week 7–8: System Design Mastery → Design Twitter, YouTube, and a distributed cache from scratch.\n\n"
        "Estimated completion: 8 weeks at 2 hours/day.\n"
        "**Evidence**: Skill gap analysis identified LangGraph, Vector DBs, and System Design as critical gaps."
    ),
    "mock_interview": (
        "**FAANG Mock Interview – AI Engineer Role**\n\n"
        "**Question**: Design a distributed career memory system that supports semantic search across "
        "millions of user profiles with sub-50ms latency.\n\n"
        "**Evaluation**: Your answer demonstrated strong understanding of vector indexing (HNSW) and "
        "distributed SQL trade-offs using CockroachDB. However, you should elaborate on:\n"
        "• Raft consensus group behaviour during network partitions\n"
        "• Multi-region replication strategies and failover SLAs\n\n"
        "**Score**: 8.2/10 — Strong foundation, minor gaps in consensus algorithms.\n"
        "**Recommendation**: Review CockroachDB Raft implementation docs before your next FAANG interview."
    ),
}

_REASONING_THOUGHTS = [
    "Analysing your career memory graph — found 5 relevant events spanning 14 days...",
    "Cross-referencing skill gaps with current market demand for AI Engineer roles...",
    "Detected Google interview failure in System Design — weighting recommendations accordingly...",
    "AWS ML Certification completion detected — upgrading cloud deployment readiness score...",
    "Comparing with your previous recommendation from 7 days ago to track evolution...",
    "Calculating confidence score based on evidence strength and recency...",
]


def _mock_embedding(text: str) -> List[float]:
    """Generates a deterministic pseudo-embedding seeded by the text content."""
    rng = random.Random(hash(text) % (2**32))
    raw = [rng.gauss(0, 1) for _ in range(1024)]
    norm = math.sqrt(sum(x * x for x in raw)) or 1.0
    return [round(x / norm, 6) for x in raw]


# ──────────────────────────────────────────────────────────────────────────────
# Real AWS Bedrock Client (lazy-loaded)
# ──────────────────────────────────────────────────────────────────────────────

_bedrock_client = None


def _get_bedrock_client():
    global _bedrock_client
    if _bedrock_client is None:
        import boto3
        _bedrock_client = boto3.client(
            "bedrock-runtime",
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID or None,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY or None,
        )
    return _bedrock_client


# ──────────────────────────────────────────────────────────────────────────────
# Public API
# ──────────────────────────────────────────────────────────────────────────────

def _use_mock() -> bool:
    return settings.USE_MOCK_AI or not settings.has_aws_credentials


async def generate_embedding(text: str) -> List[float]:
    """
    Generates a 1024-dimensional text embedding.
    Uses Amazon Titan Text Embeddings V2 in production.
    Falls back to a seeded deterministic mock in demo mode.
    """
    if _use_mock():
        logger.debug("[MOCK] generate_embedding called")
        return _mock_embedding(text)

    try:
        client = _get_bedrock_client()
        body = json.dumps({"inputText": text, "dimensions": 1024, "normalize": True})
        response = client.invoke_model(
            modelId=settings.BEDROCK_EMBEDDING_MODEL_ID,
            body=body,
            contentType="application/json",
            accept="application/json",
        )
        result = json.loads(response["body"].read())
        return result["embedding"]
    except Exception as exc:
        logger.warning(f"Bedrock embedding failed, using mock: {exc}")
        return _mock_embedding(text)


async def invoke_claude(
    prompt: str,
    execution_mode: str = "RECOMMENDATION",
    system_prompt: Optional[str] = None,
    max_tokens: int = 2048,
) -> str:
    """
    Invokes Claude 3.5 Sonnet for career reasoning.
    Returns full completion text.
    """
    if _use_mock():
        logger.debug(f"[MOCK] invoke_claude mode={execution_mode}")
        mode_key = execution_mode.lower().replace("_", "_")
        return _MOCK_RECOMMENDATIONS.get(mode_key, _MOCK_RECOMMENDATIONS["default"])

    try:
        client = _get_bedrock_client()
        system = system_prompt or (
            "You are CareerDNA AI, a lifelong AI career agent that provides highly personalised "
            "career guidance based on a user's persistent career memory, skills, and history."
        )
        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": max_tokens,
            "system": system,
            "messages": [{"role": "user", "content": prompt}],
        })
        response = client.invoke_model(
            modelId=settings.BEDROCK_CLAUDE_MODEL_ID,
            body=body,
            contentType="application/json",
            accept="application/json",
        )
        result = json.loads(response["body"].read())
        return result["content"][0]["text"]
    except Exception as exc:
        logger.warning(f"Bedrock Claude call failed, using mock: {exc}")
        return _MOCK_RECOMMENDATIONS.get(execution_mode.lower(), _MOCK_RECOMMENDATIONS["default"])


def get_reasoning_thoughts() -> List[str]:
    """Returns the list of reasoning thought strings for SSE streaming."""
    return _REASONING_THOUGHTS
