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
    simulation,
    mock_interview,
    reflection,
    cluster_ops,
    agents_team,
    recruiter,
    agent_inspector,
    resume_optimizer,
    voice_interview,
    auto_apply,
    global_resilience,
    negotiation_lab,
    pitch_deck,
    live_demo,
    deploy_hub,
    architecture_flow,
    interviews,
    skills,
    memory,
    notifications,
    learning,
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
api_router.include_router(agents_team.router)
api_router.include_router(recruiter.router)
api_router.include_router(agent_inspector.router)
api_router.include_router(resume_optimizer.router)
api_router.include_router(voice_interview.router)
api_router.include_router(auto_apply.router)
api_router.include_router(global_resilience.router)
api_router.include_router(negotiation_lab.router)
api_router.include_router(pitch_deck.router)
api_router.include_router(live_demo.router)
api_router.include_router(deploy_hub.router)
api_router.include_router(architecture_flow.router)
api_router.include_router(interviews.router)
api_router.include_router(skills.router)
api_router.include_router(memory.router)
api_router.include_router(notifications.router)
api_router.include_router(learning.router)
