"""
CareerDNA AI — Comprehensive End-to-End Automated Testing Harness
"""

import sys
import time
import json
import httpx
from typing import Dict, Any, List

BASE_API = "http://localhost:8000"
BASE_FRONTEND = "http://localhost:3000"

results = {
    "passed": [],
    "failed": [],
    "observations": []
}

def log_pass(test_name: str, detail: str = ""):
    results["passed"].append({"test": test_name, "detail": detail})
    print(f"  [PASS] {test_name}: {detail}")

def log_fail(test_name: str, error: str):
    results["failed"].append({"test": test_name, "error": error})
    print(f"  [FAIL] {test_name}: {error}")

def log_obs(observation: str):
    results["observations"].append(observation)
    print(f"  [NOTE] Observation: {observation}")

print("=" * 70)
print("  CAREERDNA AI - DEEP SYSTEM AUDIT & TEST LOOP (LIVE COCKROACHDB)")
print("=" * 70)

client = httpx.Client(timeout=30.0)

# 1. SERVER HEALTH & BASIC GATEWAY
print("\n[PHASE 1] Checking Core Gateway & Health Endpoints...")
try:
    r = client.get(f"{BASE_API}/")
    assert r.status_code == 200 and r.json().get("status") == "online"
    log_pass("GET /", f"Status: {r.json().get('status')}")
except Exception as e:
    log_fail("GET /", str(e))

try:
    r = client.get(f"{BASE_API}/health")
    assert r.status_code == 200 and r.json().get("status") == "healthy"
    log_pass("GET /health", f"Status: {r.json().get('status')}")
except Exception as e:
    log_fail("GET /health", str(e))

# 2. AUTHENTICATION
print("\n[PHASE 2] Testing Authentication & Token Security...")
test_email = f"test_auditor_{int(time.time())}@careerdna.ai"
test_password = "SecurePassword123!"
auth_token = None
user_id = None

try:
    r = client.post(f"{BASE_API}/api/v1/auth/register", json={
        "email": test_email,
        "password": test_password,
        "full_name": "Audit Tester",
        "target_role": "Lead AI Engineer"
    })
    assert r.status_code == 201, f"Expected 201, got {r.status_code}: {r.text}"
    data = r.json()
    auth_token = data.get("access_token")
    user_id = data.get("user", {}).get("user_id")
    log_pass("POST /api/v1/auth/register", f"User registered (ID: {user_id}) with Bearer token")
except Exception as e:
    log_fail("POST /api/v1/auth/register", str(e))

try:
    r = client.post(f"{BASE_API}/api/v1/auth/login", json={
        "email": test_email,
        "password": test_password
    })
    assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text}"
    auth_token = r.json().get("access_token")
    log_pass("POST /api/v1/auth/login", f"Token refreshed: {auth_token[:20]}...")
except Exception as e:
    log_fail("POST /api/v1/auth/login", str(e))

headers = {"Authorization": f"Bearer {auth_token}"} if auth_token else {}

try:
    r = client.get(f"{BASE_API}/api/v1/auth/me", headers=headers)
    assert r.status_code == 200 and r.json().get("email") == test_email
    log_pass("GET /api/v1/auth/me", f"Authenticated as {r.json().get('email')} ({r.json().get('target_role')})")
except Exception as e:
    log_fail("GET /api/v1/auth/me", str(e))

# 3. CORE DOMAIN REST APIS
print("\n[PHASE 3] Testing Core Domain REST APIs on CockroachDB Cloud...")

# 3.1 DNA Profile
try:
    r = client.get(f"{BASE_API}/api/v1/dna", headers=headers)
    assert r.status_code == 200
    data = r.json()
    log_pass("GET /api/v1/dna", f"DNA Score: {data.get('dna_score')}")
except Exception as e:
    log_fail("GET /api/v1/dna", str(e))

# 3.2 Skills CRUD
created_skill_id = None
try:
    r = client.get(f"{BASE_API}/api/v1/skills", headers=headers)
    assert r.status_code == 200
    log_pass("GET /api/v1/skills", f"Total Skills: {r.json().get('total')}")
except Exception as e:
    log_fail("GET /api/v1/skills", str(e))

try:
    r = client.post(f"{BASE_API}/api/v1/skills", headers=headers, json={
        "skill_name": "CockroachDB Vector Search",
        "category": "TECHNICAL",
        "proficiency_score": 0.95
    })
    assert r.status_code == 201
    created_skill_id = r.json().get("skill_id")
    log_pass("POST /api/v1/skills", f"Created skill {created_skill_id}")
except Exception as e:
    log_fail("POST /api/v1/skills", str(e))

if created_skill_id:
    try:
        r = client.delete(f"{BASE_API}/api/v1/skills/{created_skill_id}", headers=headers)
        assert r.status_code == 200
        log_pass(f"DELETE /api/v1/skills/{created_skill_id}", "Skill deleted successfully")
    except Exception as e:
        log_fail(f"DELETE /api/v1/skills/{created_skill_id}", str(e))

# 3.3 Timeline
try:
    r = client.get(f"{BASE_API}/api/v1/timeline", headers=headers)
    assert r.status_code == 200
    log_pass("GET /api/v1/timeline", f"Total Events: {len(r.json().get('events', []))}")
except Exception as e:
    log_fail("GET /api/v1/timeline", str(e))

# 3.4 Memory CRUD
try:
    r = client.get(f"{BASE_API}/api/v1/memory", headers=headers)
    assert r.status_code == 200
    log_pass("GET /api/v1/memory", f"Total Memories: {len(r.json().get('memories', []))}")
except Exception as e:
    log_fail("GET /api/v1/memory", str(e))

try:
    r = client.post(f"{BASE_API}/api/v1/memory", headers=headers, json={
        "memory_type": "INTERVIEW_FAILURE",
        "summary": "Failed Meta Distributed Systems Mock on consensus partitioning",
        "importance_score": 0.92
    })
    assert r.status_code == 201
    log_pass("POST /api/v1/memory", f"Created memory node {r.json().get('id')}")
except Exception as e:
    log_fail("POST /api/v1/memory", str(e))

# 3.5 Interview History CRUD
try:
    r = client.get(f"{BASE_API}/api/v1/interviews", headers=headers)
    assert r.status_code == 200
    log_pass("GET /api/v1/interviews", f"Total Interviews: {len(r.json().get('interviews', []))}")
except Exception as e:
    log_fail("GET /api/v1/interviews", str(e))

# 3.6 Learning Progress CRUD
created_resource_id = None
try:
    r = client.get(f"{BASE_API}/api/v1/learning", headers=headers)
    assert r.status_code == 200
    log_pass("GET /api/v1/learning", f"Total Courses: {r.json().get('total')}")
except Exception as e:
    log_fail("GET /api/v1/learning", str(e))

try:
    r = client.post(f"{BASE_API}/api/v1/learning", headers=headers, json={
        "resource_title": "Advanced CockroachDB Vector Indexing",
        "platform": "Cockroach Labs University",
        "resource_type": "WORKSHOP",
        "progress_percentage": 50.0
    })
    assert r.status_code == 201
    created_resource_id = r.json().get("resource_id")
    log_pass("POST /api/v1/learning", f"Created learning course {created_resource_id}")
except Exception as e:
    log_fail("POST /api/v1/learning", str(e))

if created_resource_id:
    try:
        r = client.patch(f"{BASE_API}/api/v1/learning/{created_resource_id}", headers=headers, json={
            "progress_percentage": 100.0,
            "certificate_url": "https://cockroachlabs.com/cert/123"
        })
        assert r.status_code == 200 and r.json().get("status") == "COMPLETED"
        log_pass(f"PATCH /api/v1/learning/{created_resource_id}", "Course completed")
    except Exception as e:
        log_fail(f"PATCH /api/v1/learning/{created_resource_id}", str(e))

# 3.7 Notifications
try:
    r = client.get(f"{BASE_API}/api/v1/notifications", headers=headers)
    assert r.status_code == 200
    notifs = r.json().get("notifications", [])
    log_pass("GET /api/v1/notifications", f"Total Notifications: {len(notifs)}")
    if notifs:
        nid = notifs[0]["notification_id"]
        r_read = client.patch(f"{BASE_API}/api/v1/notifications/{nid}/read", headers=headers)
        assert r_read.status_code == 200
        log_pass(f"PATCH /api/v1/notifications/{nid}/read", "Marked notification as read")
except Exception as e:
    log_fail("Notifications API", str(e))

# 3.8 Documents Presigned URL
try:
    r = client.post(f"{BASE_API}/api/v1/documents/presigned-url", headers=headers, json={
        "filename": "my_resume_2026.pdf",
        "content_type": "application/pdf"
    })
    assert r.status_code == 200
    log_pass("POST /api/v1/documents/presigned-url", f"Upload URL generated: {r.json().get('s3_key')}")
except Exception as e:
    log_fail("Documents Presigned URL", str(e))

# 4. SSE STREAMING TEST
print("\n[PHASE 4] Testing Real-Time SSE Agent Streaming Pipeline...")
try:
    with client.stream("POST", f"{BASE_API}/api/v1/agent/recommend", headers=headers, json={
        "query": "How do I reach Staff AI Engineer level?",
        "target_role": "Staff AI Engineer",
        "execution_mode": "RECOMMENDATION"
    }, timeout=30.0) as response:
        assert response.status_code == 200, f"SSE endpoint status {response.status_code}"
        events_received = []
        chunks = []
        for line in response.iter_lines():
            if line.startswith("data: "):
                raw_data = line[6:].strip()
                try:
                    event = json.loads(raw_data)
                    events_received.append(event.get("type"))
                    if event.get("type") == "RECOMMENDATION_CHUNK":
                        chunks.append(event.get("text", ""))
                except Exception:
                    pass
        
        expected_types = {"MEMORY_RETRIEVED", "SKILL_GAP_IDENTIFIED", "MARKET_INTELLIGENCE", "RECOMMENDATION_CHUNK", "EVOLUTION_METADATA", "DONE"}
        found = set(events_received)
        overlap = expected_types.intersection(found)
        assert len(overlap) >= 4, f"Missing expected SSE events. Found: {found}"
        log_pass("POST /api/v1/agent/recommend (SSE)", f"Received {len(events_received)} events. Flow verified.")
except Exception as e:
    log_fail("POST /api/v1/agent/recommend (SSE)", str(e))

# 5. MEMORY EVOLUTION & RETENTION MATH ENGINE
print("\n[PHASE 5] Testing Memory Evolution Engine & Decay Algorithms...")
try:
    from app.services.memory_evolution_service import (
        calculate_decay_score,
        cosine_similarity,
        MemoryEvolutionService
    )
    s0 = calculate_decay_score(importance=0.9, confidence=0.9, frequency=1, elapsed_days=0.0)
    s30 = calculate_decay_score(importance=0.9, confidence=0.9, frequency=1, elapsed_days=30.0)
    s30_boosted = calculate_decay_score(importance=0.9, confidence=0.9, frequency=5, elapsed_days=30.0)
    assert s0 > s30 and s30_boosted > s30
    log_pass("calculate_decay_score()", f"S(0)={s0}, S(30)={s30}, S(30, F=5)={s30_boosted}")

    vec1 = [1.0, 0.0, 0.0]
    vec2 = [1.0, 0.0, 0.0]
    vec3 = [0.0, 1.0, 0.0]
    assert cosine_similarity(vec1, vec2) == 1.0 and cosine_similarity(vec1, vec3) == 0.0
    log_pass("cosine_similarity()", "Exact match=1.0, Orthogonal=0.0 verified")

    engine = MemoryEvolutionService()
    m1 = engine.create_memory("u1", "Failed Google Mock in System Design", "INTERVIEW", 0.9, [0.1]*1024)
    m1_dup = engine.create_memory("u1", "Failed Google Mock in System Design (retry)", "INTERVIEW", 0.9, [0.1]*1024)
    assert m1_dup.frequency == 2
    log_pass("MemoryEvolutionEngine", "Duplicate vector merging verified")
except Exception as e:
    log_fail("Memory Evolution Math", str(e))

# 6. REAL-TIME CAREER INTELLIGENCE
print("\n[PHASE 6] Testing 7-Stream Career Intelligence Collector...")
try:
    import asyncio
    from app.services.career_intelligence_service import get_career_intelligence_service, SignalRanker

    service = get_career_intelligence_service()
    loop = asyncio.get_event_loop()
    signals = loop.run_until_complete(service.collect_all_signals("AI Engineer"))
    assert len(signals) >= 7
    log_pass("collect_all_signals()", f"Collected {len(signals)} signals across 7 distinct streams")

    ranked = SignalRanker.rank_signals(signals, ["LangGraph", "CockroachDB"], "AI Engineer", top_k=3)
    assert len(ranked) == 3
    log_pass("SignalRanker.rank_signals()", f"Top signal: '{ranked[0].title}'")
except Exception as e:
    log_fail("Career Intelligence Service", str(e))

# 7. FRONTEND WEB ROUTES LIVENESS
print("\n[PHASE 7] Testing Frontend Next.js Web Routes Liveness...")
frontend_routes = [
    "/",
    "/login",
    "/register",
    "/dashboard",
    "/career-dna",
    "/timeline",
    "/memory-graph",
    "/recommendations",
    "/applications",
    "/resume",
    "/interview-analytics",
    "/learning-plan",
    "/notifications",
    "/settings"
]

for route in frontend_routes:
    try:
        r = client.get(f"{BASE_FRONTEND}{route}")
        if r.status_code == 200:
            log_pass(f"GET {route}", "HTTP 200 OK")
        else:
            log_fail(f"GET {route}", f"HTTP {r.status_code}")
    except Exception as e:
        log_fail(f"GET {route}", str(e))

print("\n" + "=" * 70)
print(f"  AUDIT SUMMARY: {len(results['passed'])} PASSED | {len(results['failed'])} FAILED")
print("=" * 70)

if results["failed"]:
    print("\nFAILED CHECKS:")
    for f in results["failed"]:
        print(f"  [FAIL] {f['test']}: {f['error']}")
else:
    print("\n>>> ALL TESTS PASSED! FULLSTACK SYSTEM 100% OPERATIONAL. <<<")

with open("audit_results.json", "w") as f:
    json.dump(results, f, indent=2)
print("\nSaved audit report to backend/audit_results.json\n")
