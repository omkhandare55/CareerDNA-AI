"""
CareerDNA AI - Complete LangGraph Agent Graph Implementation
Engine: Python 3.11, LangGraph, Pydantic v2, AWS Bedrock, CockroachDB MCP Tools
"""

import os
import json
import logging
from typing import List, Dict, Any, Optional, Literal
from typing_extensions import TypedDict
from pydantic import BaseModel, Field

# LangGraph Core Imports
from langgraph.graph import StateGraph, END
from langgraph.pregel import RetryPolicy
from langchain_core.tools import tool

logger = logging.getLogger("careerdna.agent")
logger.setLevel(logging.INFO)

# =============================================================================
# 1. AGENT STATE SCHEMAS
# =============================================================================

class MemoryItem(BaseModel):
    memory_id: str
    memory_type: str
    summary: str
    importance_score: float = 0.5
    relevance_score: float = 0.0

class CareerDNAAgentState(TypedDict):
    # Core User Context
    user_id: str
    cognito_sub: str
    input_prompt: str
    execution_mode: Literal["RECOMMENDATION", "LEARNING_PLAN", "MOCK_INTERVIEW"]
    
    # Node Outputs
    resume_data: Optional[Dict[str, Any]]
    retrieved_memories: List[Dict[str, Any]]
    market_trends: Optional[Dict[str, Any]]
    skill_gap_analysis: Optional[Dict[str, Any]]
    generated_recommendation: Optional[str]
    learning_plan: Optional[Dict[str, Any]]
    interview_feedback: Optional[Dict[str, Any]]
    
    # Memory Evolution & Audit Metadata
    previous_recommendation: Optional[str]
    why_changed: Optional[str]
    evidence_used: List[str]
    confidence_score: float
    
    # System & Resilience Control
    retry_count: Dict[str, int]
    error: Optional[str]
    is_complete: bool

# =============================================================================
# 2. MCP & AWS TOOLS
# =============================================================================

@tool
def mcp_query_vector_memory_tool(user_id: str, query_text: str, top_k: int = 5) -> List[Dict[str, Any]]:
    """Executes HNSW vector search on CockroachDB embeddings table via MCP Server."""
    logger.info(f"[MCP Tool] Querying vector memory for user {user_id} with query '{query_text}'")
    # Simulated response from CockroachDB MCP vector search
    return [
        {
            "memory_id": "mem_001",
            "memory_type": "INTERVIEW_FAILURE",
            "summary": "Failed Google Mock Interview: Weakness in System Design & Dynamic Programming.",
            "importance_score": 0.9,
            "relevance_score": 0.94
        },
        {
            "memory_id": "mem_002",
            "memory_type": "CERTIFICATE",
            "summary": "Completed AWS Machine Learning Specialty Certification.",
            "importance_score": 0.85,
            "relevance_score": 0.88
        }
    ]

@tool
def mcp_fetch_user_dna_tool(user_id: str) -> Dict[str, Any]:
    """Fetches user structured skills and DNA score from CockroachDB career_dna table."""
    logger.info(f"[MCP Tool] Fetching Career DNA for user {user_id}")
    return {
        "technical_skills": ["Python", "FastAPI", "PostgreSQL", "Docker"],
        "known_weaknesses": ["System Design", "Distributed Locking"],
        "dna_score": 72,
        "growth_velocity": 1.25
    }

@tool
def mcp_get_market_trends_tool(target_role: str) -> Dict[str, Any]:
    """Queries CockroachDB market_trends table for skill demand and salary benchmarks."""
    logger.info(f"[MCP Tool] Fetching market trends for role '{target_role}'")
    return {
        "target_role": target_role,
        "trending_skills": ["LangGraph", "Vector DBs", "AWS Bedrock", "CockroachDB"],
        "growth_rate_pct": 28.5,
        "avg_salary_range": {"min": 130000, "max": 190000}
    }

@tool
def mcp_insert_career_memory_tool(user_id: str, memory_type: str, summary: str) -> str:
    """Inserts a new milestone event into CockroachDB career_memory table."""
    logger.info(f"[MCP Tool] Writing new memory event for user {user_id}: {summary}")
    return "mem_new_999"

@tool
def mcp_log_recommendation_evolution_tool(
    user_id: str,
    prompt: str,
    previous_rec: str,
    new_rec: str,
    why_changed: str,
    evidence: List[str],
    confidence: float
) -> bool:
    """Logs recommendation evolution into CockroachDB recommendations audit table."""
    logger.info(f"[MCP Tool] Logged recommendation evolution for user {user_id} with confidence {confidence}")
    return True

# =============================================================================
# 3. LANGGRAPH NODE IMPLEMENTATIONS (10 NODES)
# =============================================================================

def resume_analyzer_node(state: CareerDNAAgentState) -> Dict[str, Any]:
    """Node 1: Parses or retrieves structured resume data."""
    logger.info("--> Executing Node 1: Resume Analyzer")
    user_id = state["user_id"]
    
    # Simulate resume analysis
    parsed_resume = {
        "current_title": "Fullstack Developer",
        "years_exp": 3.5,
        "top_skills": ["Python", "React", "Node.js", "SQL"],
        "education": "B.S. Computer Science"
    }
    return {"resume_data": parsed_resume}


def memory_retriever_node(state: CareerDNAAgentState) -> Dict[str, Any]:
    """Node 2: Fetches vector memory from CockroachDB vector index via MCP."""
    logger.info("--> Executing Node 2: Memory Retriever")
    user_id = state["user_id"]
    prompt = state["input_prompt"]
    
    memories = mcp_query_vector_memory_tool.invoke({"user_id": user_id, "query_text": prompt, "top_k": 5})
    return {"retrieved_memories": memories}


def market_analyzer_node(state: CareerDNAAgentState) -> Dict[str, Any]:
    """Node 3: Fetches market intelligence for user target role."""
    logger.info("--> Executing Node 3: Market Analyzer")
    target_role = state.get("resume_data", {}).get("current_title", "Software Engineer")
    
    trends = mcp_get_market_trends_tool.invoke({"target_role": target_role})
    return {"market_trends": trends}


def skill_gap_analyzer_node(state: CareerDNAAgentState) -> Dict[str, Any]:
    """Node 4: Evaluates skill gaps between user DNA and market demand."""
    logger.info("--> Executing Node 4: Skill Gap Analyzer")
    user_skills = set(state.get("resume_data", {}).get("top_skills", []))
    market_skills = set(state.get("market_trends", {}).get("trending_skills", []))
    
    missing_skills = list(market_skills - user_skills)
    readiness_pct = round((len(user_skills & market_skills) / max(len(market_skills), 1)) * 100, 2)
    
    gap_analysis = {
        "missing_skills": missing_skills,
        "readiness_pct": readiness_pct,
        "critical_gaps": ["LangGraph", "Vector DBs"]
    }
    return {"skill_gap_analysis": gap_analysis}


def recommendation_generator_node(state: CareerDNAAgentState) -> Dict[str, Any]:
    """Node 5: Formulates dynamic personalized recommendation."""
    logger.info("--> Executing Node 5: Recommendation Generator")
    gaps = state.get("skill_gap_analysis", {}).get("critical_gaps", [])
    memories = state.get("retrieved_memories", [])
    
    rec_text = (
        f"Based on your persistent career memory (including past mock interview feedback on System Design), "
        f"your immediate priority should be mastering {', '.join(gaps)}. "
        f"This addresses your recorded technical weaknesses while matching current market trends."
    )
    return {"generated_recommendation": rec_text}


def learning_planner_node(state: CareerDNAAgentState) -> Dict[str, Any]:
    """Node 6: Generates customized step-by-step learning roadmap."""
    logger.info("--> Executing Node 6: Learning Planner")
    gaps = state.get("skill_gap_analysis", {}).get("critical_gaps", ["LangGraph"])
    
    plan = {
        "weekly_milestones": [
            {"week": 1, "topic": gaps[0] if gaps else "System Design", "action": "Build prototype using FastAPI & LangGraph"},
            {"week": 2, "topic": "CockroachDB Vector Search", "action": "Implement HNSW vector index integration"}
        ],
        "estimated_completion_weeks": 4
    }
    return {"learning_plan": plan}


def interview_coach_node(state: CareerDNAAgentState) -> Dict[str, Any]:
    """Node 7: Conducts mock interview coaching and evaluates responses."""
    logger.info("--> Executing Node 7: Interview Coach")
    feedback = {
        "company_simulated": "FAANG Mock",
        "question": "How do you handle distributed consensus in CockroachDB?",
        "evaluation": "Strong conceptual understanding, but work on detailing Raft consensus group behavior.",
        "score": 0.82
    }
    return {"interview_feedback": feedback}


def memory_evolution_node(state: CareerDNAAgentState) -> Dict[str, Any]:
    """Node 9: Evaluates why recommendation changed using evidence and memory logs."""
    logger.info("--> Executing Node 9: Memory Evolution Engine")
    previous_rec = "Focus on general DSA and LeetCode Mediums."
    new_rec = state.get("generated_recommendation") or "Focus on LangGraph & Vector Databases."
    
    why_changed = (
        "Updated advice from general DSA to Agentic AI Systems because user completed AWS ML Certification "
        "and demonstrated high readiness in core Python while showing gaps in vector retrieval."
    )
    evidence = [m.get("memory_id", "mem_001") for m in state.get("retrieved_memories", [])]
    
    return {
        "previous_recommendation": previous_rec,
        "why_changed": why_changed,
        "evidence_used": evidence,
        "confidence_score": 0.94
    }


def memory_writer_node(state: CareerDNAAgentState) -> Dict[str, Any]:
    """Node 8: Writes execution outcomes and evolutions into CockroachDB via MCP."""
    logger.info("--> Executing Node 8: Memory Writer")
    user_id = state["user_id"]
    prompt = state["input_prompt"]
    prev_rec = state.get("previous_recommendation", "")
    new_rec = state.get("generated_recommendation", "")
    why = state.get("why_changed", "")
    evidence = state.get("evidence_used", [])
    confidence = state.get("confidence_score", 0.9)
    
    # Write memory & recommendation evolution log
    mcp_insert_career_memory_tool.invoke({
        "user_id": user_id,
        "memory_type": "RECOMMENDATION_GENERATED",
        "summary": f"Generated recommendation: {new_rec[:60]}..."
    })
    
    mcp_log_recommendation_evolution_tool.invoke({
        "user_id": user_id,
        "prompt": prompt,
        "previous_rec": prev_rec,
        "new_rec": new_rec,
        "why_changed": why,
        "evidence": evidence,
        "confidence": confidence
    })
    
    return {"is_complete": True}


def notification_engine_node(state: CareerDNAAgentState) -> Dict[str, Any]:
    """Node 10: Dispatches alerts, weekly reflection scheduling, or SSE complete signal."""
    logger.info("--> Executing Node 10: Notification Engine")
    return {"is_complete": True}

# =============================================================================
# 4. ROUTER & GRAPH COMPOSITION
# =============================================================================

def intent_router(state: CareerDNAAgentState) -> str:
    """Conditional Edge Router based on requested execution_mode."""
    mode = state.get("execution_mode", "RECOMMENDATION").upper()
    logger.info(f"[Router] Routing request based on mode: {mode}")
    
    if mode == "LEARNING_PLAN":
        return "learning_planner_node"
    elif mode == "MOCK_INTERVIEW":
        return "interview_coach_node"
    else:
        return "recommendation_generator_node"


def build_careerdna_graph():
    """Compiles the full state graph with nodes, conditional edges, and retries."""
    builder = StateGraph(CareerDNAAgentState)
    
    # Add all 10 Nodes
    builder.add_node("resume_analyzer_node", resume_analyzer_node)
    builder.add_node("memory_retriever_node", memory_retriever_node)
    builder.add_node("market_analyzer_node", market_analyzer_node)
    builder.add_node("skill_gap_analyzer_node", skill_gap_analyzer_node)
    builder.add_node("recommendation_generator_node", recommendation_generator_node)
    builder.add_node("learning_planner_node", learning_planner_node)
    builder.add_node("interview_coach_node", interview_coach_node)
    builder.add_node("memory_evolution_node", memory_evolution_node)
    builder.add_node("memory_writer_node", memory_writer_node)
    builder.add_node("notification_engine_node", notification_engine_node)
    
    # Set Entry Point
    builder.set_entry_point("resume_analyzer_node")
    
    # Linear Flow Phase 1: Intake & Context
    builder.add_edge("resume_analyzer_node", "memory_retriever_node")
    builder.add_edge("memory_retriever_node", "market_analyzer_node")
    builder.add_edge("market_analyzer_node", "skill_gap_analyzer_node")
    
    # Conditional Edge Phase 2: Intent Routing
    builder.add_conditional_edges(
        "skill_gap_analyzer_node",
        intent_router,
        {
            "recommendation_generator_node": "recommendation_generator_node",
            "learning_planner_node": "learning_planner_node",
            "interview_coach_node": "interview_coach_node"
        }
    )
    
    # Convergence Phase 3: Evolution, Persistence & Notification
    builder.add_edge("recommendation_generator_node", "memory_evolution_node")
    builder.add_edge("learning_planner_node", "memory_evolution_node")
    builder.add_edge("interview_coach_node", "memory_evolution_node")
    
    builder.add_edge("memory_evolution_node", "memory_writer_node")
    builder.add_edge("memory_writer_node", "notification_engine_node")
    builder.add_edge("notification_engine_node", END)
    
    return builder.compile()

# Instantiated Graph Engine
careerdna_agent_app = build_careerdna_graph()

if __name__ == "__main__":
    # Test Execution Run
    initial_state: CareerDNAAgentState = {
        "user_id": "usr_test_12345",
        "cognito_sub": "sub_cognito_abc",
        "input_prompt": "How do I become an AI Engineer?",
        "execution_mode": "RECOMMENDATION",
        "resume_data": None,
        "retrieved_memories": [],
        "market_trends": None,
        "skill_gap_analysis": None,
        "generated_recommendation": None,
        "learning_plan": None,
        "interview_feedback": None,
        "previous_recommendation": None,
        "why_changed": None,
        "evidence_used": [],
        "confidence_score": 0.0,
        "retry_count": {},
        "error": None,
        "is_complete": False
    }
    
    result = careerdna_agent_app.invoke(initial_state)
    print("\n================ AGENT EXECUTION RESULT ================")
    print(f"Confidence Score: {result['confidence_score']}")
    print(f"Why Changed: {result['why_changed']}")
    print(f"Recommendation: {result['generated_recommendation']}")
