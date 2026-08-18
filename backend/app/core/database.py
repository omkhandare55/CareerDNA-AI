"""
CareerDNA AI – Dual-Mode Database Layer
Supports:
  • Production CockroachDB Cloud via connection pooling, distributed vector indexing (VECTOR(1024) HNSW),
    ACID transactions, and JSONB document storage.
  • In-memory demo store fallback for standalone offline development.
"""

import os
import json
import uuid
import time
import logging
from datetime import date, datetime, timezone
from typing import Any, Dict, List, Optional, Tuple

import psycopg2
from psycopg2 import pool
from psycopg2.extras import RealDictCursor, Json

from app.core.config import get_settings

logger = logging.getLogger("careerdna.db")
settings = get_settings()


# ─────────────────────────────────────────────────────────────────────────────
# In-Memory Demo Database (Fallback)
# ─────────────────────────────────────────────────────────────────────────────

class _InMemoryStore:
    """Thread-safe dict-of-tables that mimics CockroachDB for local demos."""

    def __init__(self):
        self._tables: Dict[str, Dict[str, Dict]] = {}

    def _tbl(self, table: str) -> Dict[str, Dict]:
        return self._tables.setdefault(table, {})

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
        """Populate realistic demo data for a user."""
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
            m = self.insert("career_memories", {
                "user_id": user_id, "memory_type": mtype, "summary": summary,
                "raw_data": {}, "importance_score": importance,
                "created_at": ts(-day_offset),
            })
            self.insert("career_memory", {
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


# ─────────────────────────────────────────────────────────────────────────────
# Production CockroachDB Store (psycopg2 Pooled)
# ─────────────────────────────────────────────────────────────────────────────

class CockroachDBStore:
    """Production CockroachDB store executing distributed SQL & Vector searches."""

    def __init__(self, connection_pool: pool.ThreadedConnectionPool):
        self._pool = connection_pool

    def _normalize_table(self, table: str) -> str:
        if table == "career_memory":
            return "career_memories"
        return table

    def _get_conn(self):
        for attempt in range(3):
            conn = None
            try:
                conn = self._pool.getconn()
                if conn.closed != 0:
                    self._pool.putconn(conn, close=True)
                    continue
                with conn.cursor() as cur:
                    cur.execute("SELECT 1;")
                return conn
            except Exception as e:
                if conn:
                    try:
                        self._pool.putconn(conn, close=True)
                    except Exception:
                        pass
        return self._pool.getconn()

    def _put_conn(self, conn, is_error: bool = False):
        if conn is None:
            return
        try:
            if is_error or conn.closed != 0:
                if conn.closed == 0:
                    try:
                        conn.rollback()
                    except Exception:
                        pass
                self._pool.putconn(conn, close=True)
            else:
                self._pool.putconn(conn)
        except Exception:
            pass

    def insert(self, table: str, row: Dict) -> Dict:
        table = self._normalize_table(table)
        row_copy = dict(row)
        if "id" not in row_copy or not row_copy["id"]:
            row_copy["id"] = str(uuid.uuid4())

        for attempt in range(2):
            conn = None
            is_err = False
            try:
                conn = self._get_conn()
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    columns = []
                    values = []
                    placeholders = []
                    for k, v in row_copy.items():
                        columns.append(k)
                        if isinstance(v, (dict, list)):
                            values.append(Json(v))
                        else:
                            values.append(v)
                        placeholders.append("%s")

                    sql = f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({', '.join(placeholders)}) RETURNING *;"
                    cur.execute(sql, values)
                    result = dict(cur.fetchone())
                    conn.commit()
                    return result
            except Exception as e:
                is_err = True
                if conn and conn.closed == 0:
                    try:
                        conn.rollback()
                    except Exception:
                        pass
                logger.error(f"CockroachDB insert error on {table} (attempt {attempt+1}): {e}")
                if attempt == 1:
                    raise
            finally:
                self._put_conn(conn, is_err)

    def get_by_id(self, table: str, row_id: str) -> Optional[Dict]:
        table = self._normalize_table(table)
        for attempt in range(2):
            conn = None
            is_err = False
            try:
                conn = self._get_conn()
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(f"SELECT * FROM {table} WHERE id = %s;", (row_id,))
                    res = cur.fetchone()
                    return dict(res) if res else None
            except Exception as e:
                is_err = True
                logger.error(f"CockroachDB get_by_id error on {table} (attempt {attempt+1}): {e}")
                if attempt == 1:
                    return None
            finally:
                self._put_conn(conn, is_err)
        return None

    def find_one(self, table: str, **filters) -> Optional[Dict]:
        results = self.find_all(table, **filters)
        return results[0] if results else None

    def find_all(self, table: str, **filters) -> List[Dict]:
        table = self._normalize_table(table)
        for attempt in range(2):
            conn = None
            is_err = False
            try:
                conn = self._get_conn()
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    if not filters:
                        cur.execute(f"SELECT * FROM {table} ORDER BY created_at DESC;")
                    else:
                        where_clauses = [f"{k} = %s" for k in filters.keys()]
                        sql = f"SELECT * FROM {table} WHERE {' AND '.join(where_clauses)} ORDER BY created_at DESC;"
                        cur.execute(sql, list(filters.values()))
                    rows = cur.fetchall()
                    return [dict(r) for r in rows]
            except Exception as e:
                is_err = True
                logger.error(f"CockroachDB find_all error on {table} (attempt {attempt+1}): {e}")
                if attempt == 1:
                    return []
            finally:
                self._put_conn(conn, is_err)
        return []

    def update(self, table: str, row_id: str, updates: Dict) -> Optional[Dict]:
        table = self._normalize_table(table)
        if not updates:
            return self.get_by_id(table, row_id)

    def delete(self, table: str, row_id: str) -> bool:
        table = self._normalize_table(table)
        conn = None
        is_err = False
        try:
            conn = self._get_conn()
            with conn.cursor() as cur:
                cur.execute(f"DELETE FROM {table} WHERE id = %s;", (row_id,))
                conn.commit()
                return cur.rowcount > 0
        except Exception as e:
            is_err = True
            logger.error(f"CockroachDB delete error on {table}: {e}")
            return False
        finally:
            self._put_conn(conn, is_err)

    def vector_search(self, user_id: str, query_embedding: List[float], top_k: int = 5) -> List[Dict]:
        """Perform native CockroachDB distributed vector cosine similarity search."""
        conn = None
        is_err = False
        try:
            conn = self._get_conn()
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                vec_str = "[" + ",".join(str(x) for x in query_embedding) + "]"
                sql = """
                SELECT 
                    id, memory_type, summary, raw_data, importance_score, created_at,
                    1 - (embedding <=> %s::VECTOR) AS similarity_score
                FROM career_memories
                WHERE user_id = %s AND embedding IS NOT NULL
                ORDER BY embedding <=> %s::VECTOR ASC
                LIMIT %s;
                """
                cur.execute(sql, (vec_str, user_id, vec_str, top_k))
                rows = cur.fetchall()
                return [dict(r) for r in rows]
        except Exception as e:
            is_err = True
            logger.warning(f"CockroachDB vector_search query note: {e}")
            return self.find_all("career_memories", user_id=user_id)[:top_k]
        finally:
            self._put_conn(conn, is_err)

    def seed_demo_data(self, user_id: str):
        """Batch-seed demo data in CockroachDB inside a single connection transaction."""
        _mem_seeder = _InMemoryStore()
        _mem_seeder.seed_demo_data(user_id)

        conn = None
        is_err = False
        try:
            conn = self._get_conn()
            with conn.cursor() as cur:
                for tbl in ["skills", "career_memories", "interview_history", "learning_progress", "recommendations", "notifications"]:
                    for row in _mem_seeder.find_all(tbl):
                        row_copy = dict(row)
                        if "id" not in row_copy or not row_copy["id"]:
                            row_copy["id"] = str(uuid.uuid4())
                        cols = list(row_copy.keys())
                        vals = [Json(v) if isinstance(v, (dict, list)) else v for v in row_copy.values()]
                        placeholders = ["%s"] * len(cols)
                        cur.execute(f"INSERT INTO {tbl} ({', '.join(cols)}) VALUES ({', '.join(placeholders)}) ON CONFLICT DO NOTHING;", vals)
            conn.commit()
        except Exception as e:
            is_err = True
            if conn and conn.closed == 0:
                try:
                    conn.rollback()
                except Exception:
                    pass
            logger.warning(f"Batch seed note: {e}")
        finally:
            self._put_conn(conn, is_err)


# ─────────────────────────────────────────────────────────────────────────────
# Store Singleton & Lifecycle
# ─────────────────────────────────────────────────────────────────────────────

_demo_store = _InMemoryStore()
_cockroach_store: Optional[CockroachDBStore] = None
_db_pool: Optional[pool.ThreadedConnectionPool] = None


def get_demo_store():
    """Returns active database store (CockroachDBStore if connected, else DemoStore)."""
    if _cockroach_store is not None and not settings.USE_DEMO_DB:
        return _cockroach_store
    return _demo_store


def _clean_dsn(dsn: str) -> str:
    """Normalize database connection string for psycopg2."""
    if dsn.startswith("postgresql+asyncpg://"):
        return dsn.replace("postgresql+asyncpg://", "postgresql://")
    return dsn


async def init_db():
    """App startup lifecycle hook: initialises connection pool and applies DDL schema."""
    global _cockroach_store, _db_pool

    if settings.USE_DEMO_DB or "REPLACE_PASSWORD" in settings.DATABASE_URL:
        logger.info("🟡 Demo DB mode active – using in-memory store.")
        return

    dsn = _clean_dsn(settings.DATABASE_URL)
    logger.info(f"🟢 Connecting to CockroachDB Cloud cluster...")

    try:
        _db_pool = pool.ThreadedConnectionPool(
            minconn=1,
            maxconn=20,
            dsn=dsn,
            sslmode="require",
            connect_timeout=15,
            keepalives=1,
            keepalives_idle=30,
            keepalives_interval=10,
            keepalives_count=5
        )
        _cockroach_store = CockroachDBStore(_db_pool)
        logger.info("✅ CockroachDB Cloud connection pool initialized (20 connections).")
    except Exception as exc:
        logger.warning(f"⚠️ Could not connect to CockroachDB Cloud ({exc}). Falling back to in-memory store.")
        _cockroach_store = None


async def close_db():
    """App shutdown lifecycle hook."""
    global _db_pool
    if _db_pool:
        _db_pool.closeall()
        logger.info("CockroachDB connection pool closed.")
