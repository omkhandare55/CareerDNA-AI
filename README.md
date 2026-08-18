# CareerDNA AI — Lifelong AI Agent with Production-Grade Persistent Memory

> **CockroachDB × AWS Hackathon Official Submission**  
> **Open Source License:** [MIT License](LICENSE)  
> **Full Submission Package:** [HACKATHON_SUBMISSION.md](HACKATHON_SUBMISSION.md)  
> **Live Web Application:** [http://localhost:3000](http://localhost:3000)  
> **FastAPI Gateway Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)  

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14_App_Router-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688)](https://fastapi.tiangolo.com/)
[![CockroachDB](https://img.shields.io/badge/CockroachDB-Distributed_Vector_Index-6933FF)](https://www.cockroachlabs.com/)
[![AWS Bedrock](https://img.shields.io/badge/AWS-Amazon_Bedrock-FF9900)](https://aws.amazon.com/bedrock/)

---

## 📌 Problem & Solution

AI agents are rapidly moving into real production workflows, but **traditional agents suffer from severe context amnesia**. When a session ends or a context window resets, the agent forgets past user interactions, interview logs, and verified achievements.

**An agent whose memory goes offline or resets degrades into generic, low-value advice.**

### The Solution
**CareerDNA AI** is an event-driven AI platform that gives every user a lifelong, always-on **Career DNA**. Every milestone—uploading a resume, completing an AWS certification, failing a mock interview question, or committing code to GitHub—updates a persistent, globally distributed state machine in **CockroachDB** powered by **AWS Bedrock** and **LangGraph**.

---

## 🪳 CockroachDB Tools Used (4 Tools Integrated)

1. **Distributed Vector Indexing**: Stored 1024-dimensional embeddings of career memories, resume points, and mock interview logs in `career_memories` using `VECTOR(1024)` with `CREATE INDEX idx_embeddings_hnsw ON career_memories USING HNSW (embedding vector_cosine_ops);` for sub-50ms hybrid vector-decay search.
2. **Cloud Managed MCP Server**: Connected AI agent nodes directly to CockroachDB clusters via `https://cockroachlabs.cloud/mcp` for safe read-only queries & audit logging.
3. **ccloud CLI (Agent-Ready)**: Programmatically executed cluster control plane commands (`ccloud cluster list --format=json`) to monitor health & audit logs.
4. **Agent Skills Repo (Open Source)**: Embedded machine-executable CockroachDB Agent Skills for schema optimization and vector index tuning.

---

## ☁️ AWS Services Used (4 Services Integrated)

1. **Amazon Bedrock**: Foundation model reasoning (Claude 3.5 Sonnet for multi-step recommendation synthesis) & Titan Embeddings V2 for 1024d semantic vector generation.
2. **AWS Lambda & API Gateway**: Serverless route execution & Server-Sent Events (SSE) streaming API proxying.
3. **Amazon S3**: Encrypted storage for original PDF resumes, verified certificate files, and code artifacts.
4. **AWS Cognito**: Enterprise user identity, OAuth2 Bearer token authentication, and role-based access control.

---

## 📐 System Architecture Diagram

```mermaid
graph TD
    User["👤 User / Web Browser"] -->|HTTPS| Frontend["🎨 Next.js 14 Web Frontend\n(Neo-Brutalist UI)"]
    Frontend -->|OAuth2 Bearer JWT| Gateway["⚡ FastAPI API Gateway\n(Python 3.11 / AsyncIO)"]
    
    subgraph "AWS Cloud Infrastructure"
        Gateway -->|Server-Sent Events| SSE["📡 SSE Streaming Engine"]
        Gateway -->|Invoke LLM & Embeddings| Bedrock["☁️ Amazon Bedrock\n(Claude 3.5 Sonnet & Titan 1024d)"]
        Gateway -->|Pre-Signed Uploads| S3["📦 Amazon S3\n(Encrypted PDF & Cert Storage)"]
        Gateway -->|Token Verification| Cognito["🔐 AWS Cognito / JWT"]
    end
    
    subgraph "CockroachDB Persistent Memory Layer"
        Gateway -->|HNSW Vector Query < 48ms| CDB_Vector["🪳 CockroachDB Distributed Vector Indexing\n(VECTOR(1024) / HNSW Index)"]
        Gateway -->|MCP Protocol| CDB_MCP["🪳 CockroachDB Cloud Managed MCP Server\n(https://cockroachlabs.cloud/mcp)"]
        Gateway -->|Control Plane JSON| CDB_CLI["🪳 ccloud CLI Agent Controls"]
    end
    
    subgraph "10-Node LangGraph Agent Network"
        SSE --> Node1["1. Resume Analyzer"]
        Node1 --> Node2["2. Memory Retriever"]
        Node2 --> Node3["3. Market Analyzer"]
        Node3 --> Node4["4. Skill Gap Analyzer"]
        Node4 --> Node5["5. Recommendation Generator"]
        Node5 --> Node6["6. Memory Evolution Engine"]
        Node6 --> Node7["7. Notification Engine"]
    end
```

---

## 🚀 Quick Start & Installation

### 1. Clone Repository
```bash
git clone https://github.com/omkhandare55/GDG-demo.git
cd GDG-demo
```

### 2. Backend Setup
```bash
cd backend
pip install fastapi "uvicorn[standard]" pydantic pydantic-settings python-dotenv asyncpg sqlalchemy python-multipart httpx orjson "python-jose[cryptography]" "passlib[bcrypt]"
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
- FastAPI Swagger Docs: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:3000`

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
