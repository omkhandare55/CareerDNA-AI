"""
CareerDNA AI – API v1 Router
Aggregates all sub-routers under /api/v1
"""

from fastapi import APIRouter

from app.api.v1 import (
    auth,
    agent,
    documents,
    timeline,
    dna,
    interviews,
    skills,
    memory,
    notifications,
    learning,
    simulation,
    mock_interview,
    reflection,
    cluster_ops,
)

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router)
api_router.include_router(agent.router)
api_router.include_router(documents.router)
api_router.include_router(timeline.router)
api_router.include_router(dna.router)
api_router.include_router(simulation.router)
api_router.include_router(mock_interview.router)
api_router.include_router(reflection.router)
api_router.include_router(cluster_ops.router)
api_router.include_router(interviews.router)
api_router.include_router(skills.router)
api_router.include_router(memory.router)
api_router.include_router(notifications.router)
api_router.include_router(learning.router)
