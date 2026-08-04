"""
CareerDNA AI - Memory Evolution Engine Implementation
Engine: Python 3.11, CockroachDB Vector Search, Pydantic v2
"""

import math
import time
import logging
from typing import List, Dict, Any, Optional, Tuple
from enum import Enum
from pydantic import BaseModel, Field

logger = logging.getLogger("careerdna.memory_engine")
logger.setLevel(logging.INFO)

# =============================================================================
# 1. ENUMS & SCHEMAS
# =============================================================================

class MemoryStatus(str, Enum):
    ACTIVE = "ACTIVE"
    MERGED = "MERGED"
    ARCHIVED = "ARCHIVED"
    CONFLICTED = "CONFLICTED"

class RelationshipType(str, Enum):
    CAUSED_BY = "CAUSED_BY"
    IMPROVED_BY = "IMPROVED_BY"
    SUPERSEDES = "SUPERSEDES"
    CONTRADICTS = "CONTRADICTS"

class MemoryRelationship(BaseModel):
    target_memory_id: str
    relationship_type: RelationshipType
    weight: float = 1.0

class CareerMemoryNode(BaseModel):
    memory_id: str
    user_id: str
    summary: str
    source: str  # 'RESUME', 'GITHUB', 'INTERVIEW', 'REFLECTION'
    importance: float = Field(ge=0.0, le=1.0, default=0.5)
    confidence: float = Field(ge=0.0, le=1.0, default=0.8)
    frequency: int = Field(ge=1, default=1)
    recency_days: float = 0.0
    decay_score: float = 1.0
    relationships: List[MemoryRelationship] = []
    embedding: List[float] = []
    status: MemoryStatus = MemoryStatus.ACTIVE
    created_at_timestamp: float = Field(default_factory=time.time)

# =============================================================================
# 2. ALGORITHMIC FUNCTIONS
# =============================================================================

def calculate_decay_score(
    importance: float,
    confidence: float,
    frequency: int,
    elapsed_days: float,
    lambda_decay: float = 0.015,
    beta: float = 0.25
) -> float:
    """
    Computes effective retention score S(t) using modified Ebbinghaus curve:
    S(t) = min(1.0, I * C * (1 + beta * ln(F)) * e^(-lambda * t))
    """
    freq_boost = 1.0 + beta * math.log(frequency)
    retention = importance * confidence * freq_boost * math.exp(-lambda_decay * elapsed_days)
    return round(min(1.0, max(0.0, retention)), 4)


def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    """Calculates cosine similarity between two equal-dimension vectors."""
    if not vec_a or not vec_b or len(vec_a) != len(vec_b):
        return 0.0
    dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot_product / (norm_a * norm_b)

# =============================================================================
# 3. MEMORY EVOLUTION ENGINE CORE
# =============================================================================

class MemoryEvolutionEngine:
    def __init__(self):
        # In-memory simulated storage matching CockroachDB table layout
        self.memory_store: Dict[str, CareerMemoryNode] = {}

    def create_memory(
        self,
        user_id: str,
        summary: str,
        source: str,
        importance: float,
        embedding: List[float]
    ) -> CareerMemoryNode:
        """1. Creates new memory or triggers duplicate merging / conflict resolution."""
        logger.info(f"Processing new memory creation for user {user_id}: '{summary}'")
        
        # Check for vector duplicate (Cosine similarity > 0.92)
        duplicate = self._find_duplicate(user_id, embedding, threshold=0.92)
        if duplicate:
            logger.info(f"Duplicate memory detected ({duplicate.memory_id}). Merging...")
            return self.merge_duplicates(existing_memory_id=duplicate.memory_id, new_summary=summary)
            
        # Check for conflict
        conflicting = self.detect_conflicts(user_id, summary)
        
        memory_id = f"mem_{int(time.time() * 1000)}"
        node = CareerMemoryNode(
            memory_id=memory_id,
            user_id=user_id,
            summary=summary,
            source=source,
            importance=importance,
            confidence=0.85,
            frequency=1,
            recency_days=0.0,
            decay_score=importance * 0.85,
            embedding=embedding,
            status=MemoryStatus.ACTIVE
        )
        
        # Connect conflict edge if applicable
        if conflicting:
            node.relationships.append(
                MemoryRelationship(
                    target_memory_id=conflicting.memory_id,
                    relationship_type=RelationshipType.SUPERSEDES,
                    weight=1.0
                )
            )
            conflicting.status = MemoryStatus.CONFLICTED
            conflicting.confidence = 0.20
            logger.info(f"Conflict resolved. Memory {node.memory_id} supersedes {conflicting.memory_id}")
            
        self.memory_store[memory_id] = node
        return node

    def merge_duplicates(self, existing_memory_id: str, new_summary: str) -> CareerMemoryNode:
        """2. Merges duplicate memory, boosting frequency and confidence."""
        node = self.memory_store[existing_memory_id]
        return self.strengthen_memory(node.memory_id)

    def strengthen_memory(self, memory_id: str) -> CareerMemoryNode:
        """3. Strengthens memory upon user re-engagement or reinforcement."""
        node = self.memory_store[memory_id]
        node.frequency += 1
        node.recency_days = 0.0
        node.confidence = min(1.0, node.confidence + 0.05)
        node.decay_score = calculate_decay_score(
            importance=node.importance,
            confidence=node.confidence,
            frequency=node.frequency,
            elapsed_days=0.0
        )
        logger.info(f"Strengthened memory {memory_id}: Freq={node.frequency}, DecayScore={node.decay_score}")
        return node

    def detect_conflicts(self, user_id: str, summary: str) -> Optional[CareerMemoryNode]:
        """4. Detects direct contradictions in user claims (e.g. Failed vs Passed)."""
        summary_lower = summary.lower()
        for node in self.memory_store.values():
            if node.user_id == user_id and node.status == MemoryStatus.ACTIVE:
                if "failed" in summary_lower and "passed" in node.summary.lower():
                    return node
                elif "passed" in summary_lower and "failed" in node.summary.lower():
                    return node
        return None

    def archive_old_memories(self, user_id: str, current_elapsed_days: float = 60.0) -> List[str]:
        """5. Background maintenance sweep: Archives memories with Decay Score < 0.15."""
        archived_ids = []
        for node in self.memory_store.values():
            if node.user_id == user_id and node.status == MemoryStatus.ACTIVE:
                decay = calculate_decay_score(
                    importance=node.importance,
                    confidence=node.confidence,
                    frequency=node.frequency,
                    elapsed_days=current_elapsed_days
                )
                node.decay_score = decay
                if decay < 0.15 and node.importance < 0.80:
                    node.status = MemoryStatus.ARCHIVED
                    archived_ids.append(node.memory_id)
                    logger.info(f"Archived low-decay memory {node.memory_id} (DecayScore={decay})")
        return archived_ids

    def restore_archived_memory(self, memory_id: str) -> CareerMemoryNode:
        """6. Restores an archived memory back to ACTIVE state."""
        node = self.memory_store[memory_id]
        node.status = MemoryStatus.ACTIVE
        return self.strengthen_memory(memory_id)

    def retrieve_hybrid_memories(
        self,
        user_id: str,
        query_vector: List[float],
        top_k: int = 5,
        alpha: float = 0.70
    ) -> List[Tuple[CareerMemoryNode, float]]:
        """
        7. Hybrid Retrieval Ranking Formula:
        R_final = alpha * CosineSim + (1 - alpha) * DecayScore
        """
        scored_memories = []
        for node in self.memory_store.values():
            if node.user_id == user_id and node.status == MemoryStatus.ACTIVE:
                sim = cosine_similarity(query_vector, node.embedding)
                r_final = alpha * sim + (1.0 - alpha) * node.decay_score
                scored_memories.append((node, round(r_final, 4)))
                
        scored_memories.sort(key=lambda x: x[1], reverse=True)
        return scored_memories[:top_k]

    def _find_duplicate(self, user_id: str, embedding: List[float], threshold: float = 0.92) -> Optional[CareerMemoryNode]:
        for node in self.memory_store.values():
            if node.user_id == user_id and node.status == MemoryStatus.ACTIVE:
                sim = cosine_similarity(embedding, node.embedding)
                if sim >= threshold:
                    return node
        return None
