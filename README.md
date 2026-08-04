# CareerDNA AI 🧬

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CockroachDB](https://img.shields.io/badge/Database-CockroachDB%20v24.x-6933FF?logo=cockroachlabs&logoColor=white)](https://www.cockroachlabs.com/)
[![AWS Bedrock](https://img.shields.io/badge/AI Engine-AWS%20Bedrock-FF9900?logo=amazon-aws&logoColor=white)](https://aws.amazon.com/bedrock/)
[![LangGraph](https://img.shields.io/badge/Agentic-LangGraph-000000?logo=langchain&logoColor=white)](https://www.langchain.com/langgraph)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)

> **"Your lifelong AI Career Agent that remembers every decision, every skill, every interview, and every career milestone."**

---

## 💡 Problem Statement

Today's AI career tools suffer from three fundamental flaws:
1. **Zero Long-Term Memory**: Every chat session resets. Users constantly re-explain their background, resume, skills, and past interview failures.
2. **Generic, One-Size-Fits-All Advice**: Chatbots offer superficial recommendations ("Learn DSA", "Learn React") ignoring learning pace, past rejections, and personal strengths.
3. **Stateless Nature**: Real career progression is a multi-year continuous journey (`Learn → Practice → Fail → Improve → Interview → Receive Feedback → Learn Again → Get Job`). Current AI works statelessly (`Question → Answer → Forget`).

---

## ✨ The Solution

**CareerDNA AI** is the world’s first persistent AI Career Agent that builds an evolving **Career DNA** profile for every user. 

Powered by **CockroachDB's Distributed Vector Index** for persistent memory and **AWS Bedrock** for high-reasoning intelligence, CareerDNA AI learns, adapts, and evolves recommendations over months and years.

---

## 🏗️ System Architecture

```mermaid
flowchart TB
    subgraph Client Layer ["Client & Presentation Layer"]
        UI["Next.js 14 App Router\n(React 18, TailwindCSS, SSE Client)"]
    end

    subgraph Edge & API Layer ["Edge & Ingress Layer"]
        CDN["AWS CloudFront / Vercel Edge"]
        Gateway["FastAPI Gateway & Async Orchestrator\n(Python 3.11, Pydantic v2)"]
    end

    subgraph Agentic Intelligence ["Agentic Intelligence Layer (LangGraph & Bedrock)"]
        AgentCore["LangGraph Orchestrator Engine"]
        Nodes["10 Graph Nodes\n(Resume, Memory, Market, Skill Gap, Evolution, etc.)"]
        Bedrock["AWS Bedrock\n(Claude 3.5 Sonnet & Titan Embeddings)"]
    end

    subgraph Persistence & MCP Layer ["Persistence & Tool Access Layer"]
        MCPServer["CockroachDB MCP Server\n(Structured DB Access & Schema Safety)"]
        CRDB[("CockroachDB Serverless / Enterprise\n- Relational Core\n- Distributed Vector Index (`pgvector`/HNSW)\n- JSONB Memory Graph")]
    end

    subgraph Infrastructure ["AWS Infrastructure"]
        S3["AWS S3 Bucket (Resumes & Certificates)"]
        Cognito["AWS Cognito (JWT Authentication)"]
    end

    UI --> CDN
    CDN --> Gateway
    UI <--> Cognito
    Gateway --> AgentCore
    AgentCore --> Nodes
    Nodes <--> Bedrock
    Nodes <--> MCPServer
    MCPServer <--> CRDB
    Gateway <--> S3
```

---

## 📸 Screenshots & Wireframes

| Career Command Center (Dashboard) | Memory Graph Visualization |
|---|---|
| ![Dashboard Wireframe](https://raw.githubusercontent.com/omkhandare55/GDG-demo/main/docs/dashboard.png) | ![Memory Graph](https://raw.githubusercontent.com/omkhandare55/GDG-demo/main/docs/memory_graph.png) |

---

## 🚀 Key Features

- **🧠 Persistent Career Memory**: Lifelong storage of skills, projects, resume versions, interview history, and reflection notes in CockroachDB.
- **🧬 Career DNA Graph**: 6-dimensional trait scores (Problem Solving, Technical Depth, Learning Speed, Consistency, Communication, Leadership).
- **🔄 Memory Evolution Engine**: Evaluates *why* advice changed over time, citing evidence from past interview failures and recent certifications.
- **🗺️ Interactive Career Timeline**: Visualizes career milestones from first internship to FAANG transition.
- **🎯 Skill Gap Analysis & Simulation**: Simulates career transitions (e.g. "What if I become an AI Engineer?") and highlights missing skills.
- **📢 Real-Time Career Intelligence**: Scrapes and synthesizes 7 live job market streams (listings, salary trends, hackathons, scholarships, hiring news).
- **🔍 Explainable AI**: Every recommendation answers: *Why? How? Evidence? Confidence %? Expected Impact?*

---

## 🪳 Why CockroachDB is Essential

CockroachDB serves as the **persistent long-term memory layer** for CareerDNA AI:
- **Distributed SQL**: Seamless multi-region scalability without sharding.
- **Serializable ACID Transactions**: Guarantees zero race conditions during concurrent agent updates.
- **Native HNSW Vector Indexing**: `VECTOR(1024)` support for sub-50ms RAG memory lookups.
- **Hybrid Data Modeling**: Rigid relational constraints (`users`, `career_goals`) combined with flexible JSONB memory graphs.

---

## ☁️ Why AWS is Essential

AWS powers the **intelligence and serverless compute layer**:
- **Amazon Bedrock**: Serves Claude 3.5 Sonnet for complex career reasoning and Titan Embeddings V2 for vector memory indexing.
- **AWS Cognito**: Secure OAuth2 / OIDC authentication.
- **AWS S3**: KMS-encrypted document storage for resumes and certificates.
- **AWS Lambda & EventBridge**: Async event-driven profile updates and reflection dispatches.

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- CockroachDB (v24.x+) or CockroachDB Serverless Cluster
- AWS Account with Amazon Bedrock model access

### 1. Clone Repository
```bash
git clone https://github.com/omkhandare55/GDG-demo.git
cd GDG-demo
```

### 2. Database Setup (CockroachDB)
Execute the production DDL script to initialize the 20 tables and HNSW vector index:
```bash
cockroach sql --url "<YOUR_COCKROACH_DB_URL>" --file schema.sql
```

### 3. Backend Setup (FastAPI & LangGraph Agent)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 4. Frontend Setup (Next.js 14)
```bash
cd ../frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```ini
# CockroachDB Configuration
DATABASE_URL=postgresql://user:password@free-tier.gcp-us-central1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full

# AWS Credentials & Bedrock
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
BEDROCK_EMBEDDING_MODEL_ID=amazon.titan-embed-text-v2:0

# AWS Cognito Auth
COGNITO_USER_POOL_ID=us-east-1_XXXXX
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx

# AWS S3 Storage
S3_RESUME_BUCKET_NAME=careerdna-resumes-production
```

---

## 🎬 5-Minute Demo Flow

1. **Minute 1**: User uploads resume $\rightarrow$ CareerDNA generated instantly.
2. **Minute 2**: Ask *"How do I become an AI Engineer?"* $\rightarrow$ AI generates initial roadmap.
3. **Minute 3**: User uploads new AWS Certification $\rightarrow$ CareerDNA updates; recommendation dynamically adapts.
4. **Minute 4**: User logs a mock interview failure (e.g. System Design) $\rightarrow$ Weak points stored.
5. **Minute 5**: Ask same question $\rightarrow$ Recommendation evolves, explaining *why* advice shifted based on failure evidence and certificate.

---

## 🔭 Future Scope

- **Multi-Agent Career Team**: Dedicated subagents (Resume Reviewer, Salary Negotiator, Mental Wellness Coach).
- **Recruiter Dashboard**: Candidate growth analytics and trajectory insights over time.
- **University Dashboard**: Student placement readiness and aggregate skill distributions.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the Repository.
2. Create a Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit Changes (`git commit -m 'Add AmazingFeature'`).
4. Push to Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.
