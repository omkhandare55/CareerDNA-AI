"""
CareerDNA AI – Agent / Recommendation Streaming Endpoint
POST /api/v1/agent/recommend  → Server-Sent Events stream
"""

import logging
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from app.core.database import get_demo_store
from app.core.security import get_current_user
from app.models.schemas import AgentRecommendRequest
from app.services.agent_service import stream_recommendation

router = APIRouter(prefix="/agent", tags=["AI Agent"])
logger = logging.getLogger("careerdna.agent")


@router.post("/recommend")
async def recommend(
    body: AgentRecommendRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Streams real-time AI career recommendations as Server-Sent Events.

    Event types emitted in order:
      MEMORY_RETRIEVED → SKILL_GAP_IDENTIFIED → MARKET_INTELLIGENCE →
      REASONING (×6) → RECOMMENDATION_CHUNK (×N) → EVOLUTION_METADATA → DONE
    """
    user_id = current_user["user_id"]
    store = get_demo_store()

    logger.info(
        f"Agent recommend request: user={user_id}, mode={body.execution_mode}, "
        f"query='{body.query[:60]}...'"
    )

    async def event_stream():
        async for chunk in stream_recommendation(
            user_id=user_id,
            query=body.query,
            target_role=body.target_role or "AI Engineer",
            execution_mode=body.execution_mode,
            db_store=store,
        ):
            yield chunk

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )
