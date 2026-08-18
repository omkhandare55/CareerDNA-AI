"""
CareerDNA AI – Career Memory Endpoints
GET /api/v1/memory         → Paginated career memories with decay scores
GET /api/v1/memory/graph   → Memory relationship graph (nodes + edges)
POST /api/v1/memory        → Manually add a career memory
"""

import logging
import math
import time
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Query

from app.core.database import get_demo_store
from app.core.security import get_current_user
from app.models.schemas import MemoryGraphResponse, MemoryNode, MemoryEdge, AddMemoryRequest

router = APIRouter(prefix="/memory", tags=["Memory"])
logger = logging.getLogger("careerdna.memory")


def _compute_decay(importance: float, created_at: datetime) -> float:
    """Ebbinghaus decay: S(t) = I * e^(-0.015 * days_elapsed)"""
    now = datetime.now(timezone.utc)
    elapsed_days = max(0.0, (now - created_at).total_seconds() / 86400)
    return round(min(1.0, importance * math.exp(-0.015 * elapsed_days)), 4)


@router.get("")
async def list_memories(
    limit: int = Query(default=30, ge=1, le=100),
    memory_type: str = Query(default=None),
    current_user: dict = Depends(get_current_user),
):
    """Return career memories sorted by importance × recency, with decay scores."""
    user_id = current_user["user_id"]
    store = get_demo_store()

    rows = store.find_all("career_memory", user_id=user_id)

    # Optional type filter
    if memory_type:
        rows = [r for r in rows if r.get("memory_type") == memory_type.upper()]

    memories = []
    for m in rows:
        created = m.get("created_at", datetime.now(timezone.utc))
        if isinstance(created, str):
            created = datetime.fromisoformat(created)
        importance = float(m.get("importance_score", 0.5))
        decay = _compute_decay(importance, created)

        memories.append(MemoryNode(
            memory_id=m["id"],
            memory_type=m.get("memory_type", "MEMORY"),
            summary=m.get("summary", ""),
            importance_score=importance,
            decay_score=decay,
            created_at=created,
        ))

    # Sort by decay score descending (most relevant first)
    memories.sort(key=lambda x: (x.decay_score or 0), reverse=True)
    memories = memories[:limit]

    logger.info(f"Returned {len(memories)} memories for user {user_id}")
    return {"memories": memories, "total": len(memories)}


@router.get("/graph", response_model=MemoryGraphResponse)
async def get_memory_graph(current_user: dict = Depends(get_current_user)):
    """
    Returns a graph of memory nodes and their causal relationships.
    Used to power the interactive Memory Graph visualization on the frontend.
    """
    user_id = current_user["user_id"]
    store = get_demo_store()

    rows = store.find_all("career_memory", user_id=user_id)

    nodes = []
    for m in rows:
        created = m.get("created_at", datetime.now(timezone.utc))
        if isinstance(created, str):
            created = datetime.fromisoformat(created)
        nodes.append(MemoryNode(
            memory_id=m["id"],
            memory_type=m.get("memory_type", "MEMORY"),
            summary=m.get("summary", "")[:100],
            importance_score=float(m.get("importance_score", 0.5)),
            decay_score=_compute_decay(float(m.get("importance_score", 0.5)), created),
            created_at=created,
        ))

    # Generate synthetic edges: connect high-importance nodes to lower ones
    edges = []
    high_nodes = [n for n in nodes if (n.importance_score or 0) > 0.8]
    low_nodes = [n for n in nodes if (n.importance_score or 0) <= 0.8]

    for h in high_nodes:
        for l in low_nodes[:2]:
            edges.append(MemoryEdge(
                source_id=h.memory_id,
                target_id=l.memory_id,
                relationship_type="CAUSED_BY",
                weight=round((h.importance_score or 0.5) * 0.8, 2),
            ))

    return MemoryGraphResponse(nodes=nodes, edges=edges)


@router.post("", status_code=201)
async def add_memory(
    body: AddMemoryRequest,
    current_user: dict = Depends(get_current_user),
):
    """Manually insert a career memory event."""
    user_id = current_user["user_id"]
    store = get_demo_store()

    row = store.insert("career_memory", {
        "user_id": user_id,
        "memory_type": body.memory_type.upper(),
        "summary": body.summary,
        "raw_data": body.raw_data or {},
        "importance_score": body.importance_score,
        "created_at": datetime.now(timezone.utc),
    })

    return {"id": row["id"], "memory_id": row["id"], "message": "Memory created successfully."}
