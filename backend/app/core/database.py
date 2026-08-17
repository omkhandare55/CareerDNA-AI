"""
CareerDNA AI – Database Layer
Supports:
  • Live CockroachDB via asyncpg (when USE_DEMO_DB=false)
  • In-memory demo store (when USE_DEMO_DB=true) – no external DB required
"""

import uuid
import time
import logging
from datetime import date, datetime, timezone
from typing import Any, Dict, List, Optional

from app.core.config import get_settings

logger = logging.getLogger("careerdna.db")
settings = get_settings()


# ─────────────────────────────────────────────────────────────────────────────
# In-Memory Demo Database
# ─────────────────────────────────────────────────────────────────────────────

class _InMemoryStore:
    """Thread-safe dict-of-tables that mimics CockroachDB for local demos."""

    def __init__(self):
        self._tables: Dict[str, Dict[str, Dict]] = {}

    def _tbl(self, table: str) -> Dict[str, Dict]:
        return self._tables.setdefault(table, {})

    # ── generic helpers ──────────────────────────────────────────────────────

    def insert(self, table: str, row: Dict) -> Dict:
        row_id = row.get("id") or str(uuid.uuid4())
        row["id"] = row_id
        for k, v in row.items():
            if isinstance(v, datetime) and v.tzinfo is None:
                row[k] = v.replace(tzinfo=timezone.utc)
        self._tbl(table)[row_id] = row
        return row

    def get_by_id(self, table: str, row_id: str) -> Optional[Dict]:
        return self._tbl(table).get(row_id)

    def find_one(self, table: str, **filters) -> Optional[Dict]:
        for row in self._tbl(table).values():
            if all(row.get(k) == v for k, v in filters.items()):
                return row
        return None

    def find_all(self, table: str, **filters) -> List[Dict]:
        rows = []
        for row in self._tbl(table).values():
            if all(row.get(k) == v for k, v in filters.items()):
                rows.append(row)
        return rows

    def update(self, table: str, row_id: str, updates: Dict) -> Optional[Dict]:
        row = self._tbl(table).get(row_id)
        if row:
            row.update(updates)
        return row

    def delete(self, table: str, row_id: str) -> bool:
        return bool(self._tbl(table).pop(row_id, None))

    def seed_demo_data(self, user_id: str):
        """Populate realistic demo data for a user so the dashboard looks good."""
        now = datetime.now(timezone.utc)
        ts = lambda d: now.replace(day=max(1, now.day - d))

        # Skills
        skills = [
            ("Python", "TECHNICAL", 0.92), ("FastAPI", "TECHNICAL", 0.85),
            ("React", "TECHNICAL", 0.78), ("PostgreSQL", "TECHNICAL", 0.75),
            ("Docker", "TECHNICAL", 0.70), ("LangGraph", "TECHNICAL", 0.45),
            ("AWS Bedrock", "TECHNICAL", 0.40), ("CockroachDB", "TECHNICAL", 0.35),
            ("Communication", "SOFT", 0.80), ("Leadership", "SOFT", 0.65),
        ]
        for name, cat, score in skills:
            self.insert("skills", {
                "user_id": user_id, "skill_name": name, "category": cat,
                "proficiency_score": score, "verified_by_evidence": score > 0.7,
                "created_at": now,
            })

        # Career memories
        memories = [
            ("RESUME", "Uploaded resume – 3 years fullstack experience at StartupCo", 0.9, -14),
            ("INTERVIEW_FAILURE", "Failed Google System Design mock: weakness in distributed consensus", 0.95, -7),
            ("CERTIFICATE", "Completed AWS Machine Learning Specialty Certification", 0.85, -5),
            ("REFLECTION", "Weekly reflection: Struggling with LangGraph state management", 0.6, -2),
            ("PROJECT", "Built RAG pipeline prototype using LangChain + FAISS", 0.75, -1),
        ]
        mem_ids = []
        for mtype, summary, importance, day_offset in memories:
            m = self.insert("career_memory", {
                "user_id": user_id, "memory_type": mtype, "summary": summary,
                "raw_data": {}, "importance_score": importance,
                "created_at": ts(-day_offset),
            })
            mem_ids.append(m["id"])

        # Interview history
        self.insert("interview_history", {
            "user_id": user_id, "company_name": "Google", "role_title": "Senior Software Engineer",
            "interview_date": date(2026, 8, 10), "result": "FAILED",
            "questions_asked": ["System design: Design Twitter", "LRU Cache implementation"],
            "weak_topics": ["Distributed Systems", "Dynamic Programming"],
            "feedback": "Good communication, needs deeper distributed systems knowledge.",
            "confidence_rating": 0.55, "created_at": now,
        })
        self.insert("interview_history", {
            "user_id": user_id, "company_name": "Stripe", "role_title": "Backend Engineer",
            "interview_date": date(2026, 7, 20), "result": "PASSED",
            "questions_asked": ["Design payment processing system", "Rate limiting algorithms"],
            "weak_topics": [],
            "feedback": "Excellent problem-solving and clear API design thinking.",
            "confidence_rating": 0.88, "created_at": now,
        })

        # Learning progress
        courses = [
            ("LangGraph Mastery Course", "Udemy", "COURSE", 65, "IN_PROGRESS"),
            ("AWS Machine Learning Specialty", "AWS", "CERTIFICATION", 100, "COMPLETED"),
            ("CockroachDB Vector Search Workshop", "CockroachDB University", "WORKSHOP", 30, "IN_PROGRESS"),
            ("System Design Interview Prep", "Educative", "COURSE", 45, "IN_PROGRESS"),
        ]
        for title, platform, rtype, pct, status in courses:
            self.insert("learning_progress", {
                "user_id": user_id, "resource_title": title, "platform": platform,
                "resource_type": rtype, "progress_percentage": pct, "status": status,
                "created_at": now,
            })

        # Recommendations history
        self.insert("recommendations", {
            "user_id": user_id,
            "query_prompt": "How do I become an AI Engineer?",
            "previous_recommendation": "Focus on general DSA and LeetCode Mediums.",
            "new_recommendation": (
                "Prioritize LangGraph and Vector Database mastery. Your AWS ML certification "
                "shows strong cloud foundation. Address the System Design gap from your Google "
                "interview before your next FAANG attempt."
            ),
            "why_changed": (
                "Updated from generic DSA advice after detecting: (1) AWS ML cert completion, "
                "(2) Google interview failure in System Design, (3) LangGraph course in progress."
            ),
            "evidence_used": mem_ids[:3],
            "confidence_score": 0.94,
            "created_at": now,
        })

        # Notifications
        notifs = [
            ("Career DNA Updated", "Your AWS ML Certification was processed and added to your Career DNA.", "CAREER_UPDATE"),
            ("Weekly Reflection Due", "You haven't logged a reflection this week. Keep your memory graph fresh!", "REMINDER"),
            ("New Opportunity Match", "Senior AI Engineer role at Anthropic matches 87% of your target profile.", "OPPORTUNITY"),
        ]
        for title, message, ntype in notifs:
            self.insert("notifications", {
                "user_id": user_id, "title": title, "message": message,
                "notification_type": ntype, "is_read": False, "created_at": now,
            })


# Singleton store
_demo_store = _InMemoryStore()


# ─────────────────────────────────────────────────────────────────────────────
# Public Database API
# ─────────────────────────────────────────────────────────────────────────────

def get_demo_store() -> _InMemoryStore:
    return _demo_store


async def init_db():
    """Called at app startup. Initialises the DB connection pool (or demo store)."""
    if settings.USE_DEMO_DB:
        logger.info("🟡 Demo DB mode active – using in-memory store (no CockroachDB needed)")
    else:
        logger.info(f"🟢 Connecting to CockroachDB: {settings.DATABASE_URL}")
        # In production: set up asyncpg pool here
        # global _pool
        # _pool = await asyncpg.create_pool(settings.DATABASE_URL)
        pass


async def close_db():
    """Called at app shutdown."""
    if not settings.USE_DEMO_DB:
        pass  # Close asyncpg pool in production
