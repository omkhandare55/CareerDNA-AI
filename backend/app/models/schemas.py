"""
CareerDNA AI – Pydantic v2 Request / Response Schemas
All schemas used across API endpoints are centralised here.
"""

from __future__ import annotations

import uuid
from datetime import date, datetime
from typing import Any, Dict, List, Literal, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator


# ─────────────────────────────────────────────────────────────────────────────
# Common
# ─────────────────────────────────────────────────────────────────────────────

class MessageResponse(BaseModel):
    message: str


class PaginatedMeta(BaseModel):
    total: int
    page: int
    page_size: int


# ─────────────────────────────────────────────────────────────────────────────
# Auth
# ─────────────────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str = Field(min_length=2, max_length=255)
    current_title: Optional[str] = None
    target_role: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds
    user: "UserProfile"


class UserProfile(BaseModel):
    user_id: str
    email: str
    full_name: str
    current_title: Optional[str] = None
    target_role: Optional[str] = None
    created_at: Optional[datetime] = None


# ─────────────────────────────────────────────────────────────────────────────
# Career DNA
# ─────────────────────────────────────────────────────────────────────────────

class SkillItem(BaseModel):
    skill_id: Optional[str] = None
    skill_name: str
    category: str = "TECHNICAL"
    proficiency_score: float = Field(ge=0.0, le=1.0)
    verified_by_evidence: bool = False


class DNAResponse(BaseModel):
    user_id: str
    dna_score: int = Field(ge=0, le=100)
    growth_velocity: float
    technical_readiness: float
    confidence_score: float
    consistency_score: float
    target_role: Optional[str] = None
    technical_skills: List[SkillItem] = []
    soft_skills: List[SkillItem] = []
    known_weaknesses: List[str] = []
    career_goals: List[str] = []
    updated_at: Optional[datetime] = None


class UpdateDNARequest(BaseModel):
    target_role: Optional[str] = None
    career_goals: Optional[List[str]] = None
    known_weaknesses: Optional[List[str]] = None


# ─────────────────────────────────────────────────────────────────────────────
# Agent / Recommendation Stream
# ─────────────────────────────────────────────────────────────────────────────

class AgentRecommendRequest(BaseModel):
    query: str = Field(
        min_length=3,
        example="How do I transition from Fullstack Developer to AI Engineer?"
    )
    target_role: Optional[str] = Field(default="Senior AI Engineer", example="AI Engineer")
    execution_mode: str = "RECOMMENDATION"
    simulation_mode: bool = False

    @field_validator("execution_mode", mode="before")
    @classmethod
    def normalize_mode(cls, v: Any) -> str:
        if not v or str(v).lower() in ["default", "recommendation"]:
            return "RECOMMENDATION"
        v_upper = str(v).upper()
        if v_upper in ["LEARNING_PLAN", "MOCK_INTERVIEW", "RECOMMENDATION"]:
            return v_upper
        return "RECOMMENDATION"


class SSEEvent(BaseModel):
    type: str
    data: Dict[str, Any] = {}


# ─────────────────────────────────────────────────────────────────────────────
# Documents / Resume
# ─────────────────────────────────────────────────────────────────────────────

class PresignedURLRequest(BaseModel):
    file_name: Optional[str] = None
    filename: Optional[str] = None
    content_type: str = "application/pdf"
    document_type: str = "RESUME"

    def get_effective_filename(self) -> str:
        return self.file_name or self.filename or "resume.pdf"


class PresignedURLResponse(BaseModel):
    upload_url: str
    s3_key: str
    expires_in: int


# ─────────────────────────────────────────────────────────────────────────────
# Timeline
# ─────────────────────────────────────────────────────────────────────────────

class TimelineEvent(BaseModel):
    event_id: str
    event_type: str   # MEMORY | INTERVIEW | CERTIFICATE | PROJECT | REFLECTION
    title: str
    description: str
    date: datetime
    badge_label: Optional[str] = None
    confidence_score: Optional[float] = None
    metadata: Dict[str, Any] = {}


class TimelineResponse(BaseModel):
    events: List[TimelineEvent]
    total: int


# ─────────────────────────────────────────────────────────────────────────────
# Interviews
# ─────────────────────────────────────────────────────────────────────────────

class InterviewRecord(BaseModel):
    interview_id: Optional[str] = None
    company_name: str
    role_title: str
    interview_date: date
    result: str = "PENDING"
    questions_asked: List[str] = []
    weak_topics: List[str] = []
    feedback: Optional[str] = None
    confidence_rating: float = Field(ge=0.0, le=1.0, default=0.5)


class InterviewListResponse(BaseModel):
    interviews: List[InterviewRecord]
    total: int


# ─────────────────────────────────────────────────────────────────────────────
# Memory
# ─────────────────────────────────────────────────────────────────────────────

class AddMemoryRequest(BaseModel):
    memory_type: str = "REFLECTION"
    summary: str
    importance_score: float = Field(default=0.7, ge=0.0, le=1.0)
    raw_data: Optional[Dict[str, Any]] = None


class MemoryNode(BaseModel):
    memory_id: str
    memory_type: str
    summary: str
    importance_score: float
    decay_score: Optional[float] = None
    created_at: datetime


class MemoryEdge(BaseModel):
    source_id: str
    target_id: str
    relationship_type: str
    weight: float


class MemoryGraphResponse(BaseModel):
    nodes: List[MemoryNode]
    edges: List[MemoryEdge]


# ─────────────────────────────────────────────────────────────────────────────
# Skills
# ─────────────────────────────────────────────────────────────────────────────

class AddSkillRequest(BaseModel):
    skill_name: str
    category: str = "TECHNICAL"
    proficiency_score: float = Field(ge=0.0, le=1.0, default=0.5)


# ─────────────────────────────────────────────────────────────────────────────
# Notifications
# ─────────────────────────────────────────────────────────────────────────────

class NotificationItem(BaseModel):
    notification_id: str
    title: str
    message: str
    notification_type: str
    is_read: bool
    created_at: datetime


class NotificationListResponse(BaseModel):
    notifications: List[NotificationItem]
    unread_count: int
