"""
CareerDNA AI – Judge & Investor Pitch Deck Studio API
GET /api/v1/showcase/pitch-slides → Structured slide deck for hackathon evaluation
"""

import logging
from typing import List, Dict, Any
from pydantic import BaseModel
from fastapi import APIRouter

router = APIRouter(prefix="/showcase", tags=["Hackathon Showcase"])
logger = logging.getLogger("careerdna.pitch_deck")


class PitchSlide(BaseModel):
    slide_number: int
    title: str
    subtitle: str
    category: str
    key_metrics: List[str]
    bullet_points: List[str]
    quote_or_highlight: str


SLIDES: List[PitchSlide] = [
    PitchSlide(
        slide_number=1,
        title="CareerDNA AI",
        subtitle="The Autonomous, Long-Horizon Career Agent Powered by CockroachDB Cloud & AWS Bedrock",
        category="VISION & INTRO",
        key_metrics=["100% Vector Native", "38.4ms p99 Latency", "1024d Embeddings"],
        bullet_points=[
            "Traditional career guidance is fragmented, point-in-time, and quickly forgotten.",
            "CareerDNA AI continuously evolves with every line of code shipped, mock interview passed, and weekly reflection logged.",
            "Built on CockroachDB Cloud Serverless with native HNSW vector indexing for persistent, multi-region memory."
        ],
        quote_or_highlight="Turning transient engineering accomplishments into persistent, verifiable Career DNA."
    ),
    PitchSlide(
        slide_number=2,
        title="The Problem: Engineering Career Amnesia",
        subtitle="High-Performers Lose 60%+ of Verifiable Leverage Between Job Changes",
        category="PROBLEM",
        key_metrics=["64% Skill Retention Decay", "40+ Hrs Wasted on Resumes", "$35k Left on Table"],
        bullet_points=[
            "Ebbinghaus decay erodes active recall of technical nuances over time.",
            "Resume preparation is stressful, manual, and fails ATS keyword matching heuristics.",
            "Recruiters lack immutable cryptographic proof of candidate claims, leading to bloated 6-round hiring loops."
        ],
        quote_or_highlight="Engineers build mission-critical distributed systems, yet manage their careers with static PDF documents."
    ),
    PitchSlide(
        slide_number=3,
        title="The Solution: Autonomous Intelligence Stack",
        subtitle="Continuous Memory Ingestion, Multi-Agent Deliberation & Recruiter Proofs",
        category="SOLUTION",
        key_metrics=["6 Specialized AI Subagents", "10-Node LangGraph DAG", "0 Bytes Data Loss"],
        bullet_points=[
            "7-Stream Career Intelligence Collector continuously ingests GitHub, AWS, and CockroachDB signals.",
            "Multi-Agent Committee conducts parallel debates across resume optimization, interview coaching, and salary strategy.",
            "Interactive Voice Room and Negotiation Arena simulate real-time FAANG rounds with instant feedback."
        ],
        quote_or_highlight="An active AI pair programmer and career strategist that works in the background 24/7."
    ),
    PitchSlide(
        slide_number=4,
        title="Why CockroachDB Cloud is Our Unfair Moat",
        subtitle="ACID Transactions + Distributed HNSW Vector Search + Multi-Region Resilience",
        category="TECHNICAL ARCHITECTURE",
        key_metrics=["idx_career_memories_embedding", "9 Dedicated Nodes", "380ms Regional Failover"],
        bullet_points=[
            "Vector Native: Native VECTOR(1024) column and cosine HNSW index eliminates separate Pinecone/Qdrant databases.",
            "ACID Consistency: Combines relational integrity (users, skills, timeline) with semantic vector search in a single engine.",
            "Global Multi-Region Survival: Raft 2/3 quorum survival across AWS us-east-1, eu-west-1, and ap-southeast-1 with zero RPO."
        ],
        quote_or_highlight="One database to rule both transactional career metadata and high-dimensional semantic memory."
    ),
    PitchSlide(
        slide_number=5,
        title="Market Size & Business Model",
        subtitle="$45B Global Recruitment & Technical Upskilling Market",
        category="BUSINESS & TRACTION",
        key_metrics=["$45B Total Addressable Market", "$29/mo Pro Tier", "$499/mo Enterprise Recruiter"],
        bullet_points=[
            "B2C Pro Model: Continuous memory evolution, unlimited voice mock rounds, and automated 1-click auto-apply.",
            "B2B Recruiter Portal: Verified candidate talent search with cryptographic CockroachDB timeline verification.",
            "API Monetization: Embeddable Career DNA badges and verifiable memory verification APIs for enterprise hiring."
        ],
        quote_or_highlight="Aligning incentives: Candidates achieve higher compensation, recruiters hire with verifiable confidence."
    )
]


@router.get("/pitch-slides")
async def get_pitch_slides():
    """Return all pitch deck slides."""
    return {"slides": SLIDES, "total": len(SLIDES)}
