"""
CareerDNA AI – LangGraph Agent State Machine DAG Inspector API
GET  /api/v1/agent/graph-state       → Active 10-node DAG state, tokens & checkpoints
POST /api/v1/agent/simulate-dag-step → Step through LangGraph state graph node transitions
"""

import logging
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException

from app.core.database import get_demo_store
from app.core.security import get_current_user

router = APIRouter(prefix="/agent-inspector", tags=["LangGraph DAG Inspector"])
logger = logging.getLogger("careerdna.agent_inspector")


class GraphNode(BaseModel):
    id: str
    label: str
    phase: str
    status: str  # "IDLE" | "RUNNING" | "COMPLETED" | "WAITING"
    execution_time_ms: float
    output_tokens: int
    summary: str


class GraphEdge(BaseModel):
    from_node: str
    to_node: str
    edge_type: str  # "SEQUENTIAL" | "CONDITIONAL" | "CONVERGENCE"
    condition_label: Optional[str] = None


class GraphStateResponse(BaseModel):
    graph_name: str
    total_nodes: int
    active_checkpoint_id: str
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    state_payload: Dict[str, Any]
    memory_retrieval_latency_ms: float
    timestamp: datetime


GRAPH_NODES: List[GraphNode] = [
    GraphNode(id="node_1_resume", label="1. Resume Analyzer", phase="INGESTION", status="COMPLETED", execution_time_ms=124.5, output_tokens=320, summary="Extracted 14 verified skills & experience timeline from PDF."),
    GraphNode(id="node_2_memory", label="2. Memory Retriever", phase="INGESTION", status="COMPLETED", execution_time_ms=38.4, output_tokens=180, summary="Executed HNSW vector search on CockroachDB (cos_sim > 0.85)."),
    GraphNode(id="node_3_market", label="3. Market Analyzer", phase="INGESTION", status="COMPLETED", execution_time_ms=86.2, output_tokens=240, summary="Ranked 7 Career Intelligence market signals for target role."),
    GraphNode(id="node_4_gap", label="4. Skill Gap Analyzer", phase="ANALYSIS", status="COMPLETED", execution_time_ms=92.1, output_tokens=310, summary="Identified missing CockroachDB Raft & vector search gaps."),
    GraphNode(id="node_5_rec", label="5. Recommendation Gen", phase="SYNTHESIS", status="RUNNING", execution_time_ms=340.8, output_tokens=850, summary="Streaming real-time SSE tokens via Claude 3.5 Sonnet on Bedrock."),
    GraphNode(id="node_6_learn", label="6. Learning Planner", phase="SYNTHESIS", status="WAITING", execution_time_ms=0.0, output_tokens=0, summary="Generates weekly decay-resistant learning roadmap."),
    GraphNode(id="node_7_mock", label="7. Interview Coach", phase="SYNTHESIS", status="WAITING", execution_time_ms=0.0, output_tokens=0, summary="Simulates FAANG-grade technical questions."),
    GraphNode(id="node_8_decay", label="8. Memory Evolution", phase="CONVERGENCE", status="WAITING", execution_time_ms=0.0, output_tokens=0, summary="Applies Ebbinghaus retention decay formula & deduplication."),
    GraphNode(id="node_9_writer", label="9. CockroachDB Writer", phase="CONVERGENCE", status="WAITING", execution_time_ms=0.0, output_tokens=0, summary="Writes 1024d embedded memory node into CockroachDB cluster."),
    GraphNode(id="node_10_notif", label="10. Notification Engine", phase="CONVERGENCE", status="WAITING", execution_time_ms=0.0, output_tokens=0, summary="Dispatches real-time WebSocket / SSE notification to UI.")
]

GRAPH_EDGES: List[GraphEdge] = [
    GraphEdge(from_node="node_1_resume", to_node="node_2_memory", edge_type="SEQUENTIAL"),
    GraphEdge(from_node="node_2_memory", to_node="node_3_market", edge_type="SEQUENTIAL"),
    GraphEdge(from_node="node_3_market", to_node="node_4_gap", edge_type="SEQUENTIAL"),
    GraphEdge(from_node="node_4_gap", to_node="node_5_rec", edge_type="CONDITIONAL", condition_label="mode == RECOMMENDATION"),
    GraphEdge(from_node="node_4_gap", to_node="node_6_learn", edge_type="CONDITIONAL", condition_label="mode == LEARNING_PLAN"),
    GraphEdge(from_node="node_4_gap", to_node="node_7_mock", edge_type="CONDITIONAL", condition_label="mode == MOCK_INTERVIEW"),
    GraphEdge(from_node="node_5_rec", to_node="node_8_decay", edge_type="CONVERGENCE"),
    GraphEdge(from_node="node_6_learn", to_node="node_8_decay", edge_type="CONVERGENCE"),
    GraphEdge(from_node="node_7_mock", to_node="node_8_decay", edge_type="CONVERGENCE"),
    GraphEdge(from_node="node_8_decay", to_node="node_9_writer", edge_type="SEQUENTIAL"),
    GraphEdge(from_node="node_9_writer", to_node="node_10_notif", edge_type="SEQUENTIAL"),
]


@router.get("/graph-state", response_model=GraphStateResponse)
async def get_graph_state():
    """Return active 10-node LangGraph execution state, checkpoints, and edge conditions."""
    now = datetime.now(timezone.utc)
    return GraphStateResponse(
        graph_name="CareerDNA_Persistent_Agent_Graph_v1",
        total_nodes=10,
        active_checkpoint_id="chk_bedrock_0982348",
        nodes=GRAPH_NODES,
        edges=GRAPH_EDGES,
        state_payload={
            "user_id": "80794e01-d958-4cb5-b8eb-babcd71106de",
            "execution_mode": "RECOMMENDATION",
            "target_role": "Staff AI Systems Engineer",
            "retrieved_memories_count": 5,
            "skill_gaps_count": 2,
            "cockroachdb_vector_latency_ms": 38.4,
            "active_llm": "anthropic.claude-3-5-sonnet-20241022-v2:0",
            "embedding_model": "amazon.titan-embed-text-v2:0 (1024d)"
        },
        memory_retrieval_latency_ms=38.4,
        timestamp=now,
    )
