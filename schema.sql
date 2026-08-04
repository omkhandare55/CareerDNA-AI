-- =============================================================================
-- CareerDNA AI - Complete Production CockroachDB Schema (20 Tables)
-- Engine: CockroachDB v24.x+ with Distributed HNSW Vector Search
-- =============================================================================

-- 1. Enable Vector Search Extension
CREATE EXTENSION IF NOT EXISTS vector;

-- =============================================================================
-- SUBSYSTEM 1: IDENTITY & SESSION MANAGEMENT
-- =============================================================================

-- Table 1: Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cognito_sub VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table 2: Profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    headline VARCHAR(500),
    current_role VARCHAR(255),
    years_experience NUMERIC(4, 1) DEFAULT 0.0,
    location VARCHAR(255),
    bio TEXT,
    avatar_url TEXT,
    preferred_learning_style VARCHAR(50) DEFAULT 'HANDS_ON',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table 3: Sessions
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- SUBSYSTEM 2: CAREER STATE & PROFILE MATRIX
-- =============================================================================

-- Table 4: Career Goals
CREATE TABLE career_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_role VARCHAR(255) NOT NULL,
    target_industry VARCHAR(255),
    target_timeframe_months INT DEFAULT 12,
    target_salary_min NUMERIC(12, 2),
    priority_level VARCHAR(50) DEFAULT 'HIGH',
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table 5: Skills
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'TECHNICAL',
    proficiency_score NUMERIC(3, 2) NOT NULL DEFAULT 0.10,
    verified_by_evidence BOOLEAN NOT NULL DEFAULT FALSE,
    last_practiced_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table 6: Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    github_url TEXT,
    live_url TEXT,
    tech_stack JSONB NOT NULL DEFAULT '[]'::jsonb,
    role_in_project VARCHAR(255),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table 7: Experiences
CREATE TABLE experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization VARCHAR(255) NOT NULL,
    role_or_degree VARCHAR(255) NOT NULL,
    experience_type VARCHAR(50) NOT NULL DEFAULT 'WORK',
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table 8: Resume Versions
CREATE TABLE resume_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    version_number INT NOT NULL DEFAULT 1,
    s3_bucket VARCHAR(255) NOT NULL,
    s3_key TEXT NOT NULL,
    parsed_content JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table 9: Applications
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    job_url TEXT,
    application_status VARCHAR(50) NOT NULL DEFAULT 'APPLIED',
    applied_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- SUBSYSTEM 3: INTERACTIVE & EVOLUTION HISTORY
-- =============================================================================

-- Table 10: Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sender_type VARCHAR(50) NOT NULL DEFAULT 'USER',
    agent_id VARCHAR(100),
    content TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table 11: Interview History
CREATE TABLE interview_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    role_title VARCHAR(255) NOT NULL,
    interview_date DATE NOT NULL,
    result VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    questions_asked JSONB NOT NULL DEFAULT '[]'::jsonb,
    weak_topics JSONB NOT NULL DEFAULT '[]'::jsonb,
    feedback TEXT,
    confidence_rating NUMERIC(3, 2) DEFAULT 0.50,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table 12: Learning Progress
CREATE TABLE learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resource_title VARCHAR(255) NOT NULL,
    platform VARCHAR(100),
    resource_type VARCHAR(50) NOT NULL DEFAULT 'COURSE',
    progress_percentage NUMERIC(5, 2) DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS',
    certificate_url TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- SUBSYSTEM 4: MEMORY GRAPH & VECTOR MEMORY
-- =============================================================================

-- Table 13: Career Memory
CREATE TABLE career_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    memory_type VARCHAR(50) NOT NULL,
    summary TEXT NOT NULL,
    raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    importance_score NUMERIC(3, 2) NOT NULL DEFAULT 0.50,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table 14: Memory Scores
CREATE TABLE memory_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    overall_dna_score INT NOT NULL DEFAULT 50,
    technical_readiness NUMERIC(5, 2) DEFAULT 0.00,
    growth_velocity NUMERIC(5, 2) DEFAULT 1.00,
    consistency_score NUMERIC(5, 2) DEFAULT 0.00,
    confidence_score NUMERIC(5, 2) DEFAULT 0.50,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table 15: Memory Relationships (Graph Edges)
CREATE TABLE memory_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_memory_id UUID NOT NULL REFERENCES career_memory(id) ON DELETE CASCADE,
    target_memory_id UUID NOT NULL REFERENCES career_memory(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) NOT NULL DEFAULT 'CAUSED_BY',
    weight NUMERIC(3, 2) DEFAULT 1.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table 16: Embeddings (CockroachDB Distributed Vector Table)
CREATE TABLE embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    memory_id UUID NOT NULL REFERENCES career_memory(id) ON DELETE CASCADE,
    content_chunk TEXT NOT NULL,
    vector_embedding VECTOR(1024) NOT NULL, -- AWS Titan Embeddings V2 1024d
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- SUBSYSTEM 5: AGENTIC OPERATIONS & MARKET INTELLIGENCE
-- =============================================================================

-- Table 17: Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_name VARCHAR(255) NOT NULL,
    task_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    error_message TEXT,
    scheduled_for TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table 18: Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL DEFAULT 'SYSTEM',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table 19: Recommendations
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    query_prompt TEXT NOT NULL,
    previous_recommendation TEXT,
    new_recommendation TEXT NOT NULL,
    why_changed TEXT NOT NULL,
    evidence_used JSONB NOT NULL DEFAULT '[]'::jsonb,
    confidence_score NUMERIC(3, 2) NOT NULL DEFAULT 0.50,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table 20: Market Trends
CREATE TABLE market_trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_title VARCHAR(255) NOT NULL,
    industry VARCHAR(255) NOT NULL,
    in_demand_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    average_salary_range JSONB NOT NULL DEFAULT '{}'::jsonb,
    growth_rate_pct NUMERIC(5, 2) DEFAULT 0.00,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- SECONDARY & VECTOR INDEXES
-- =============================================================================

-- CockroachDB Distributed HNSW Vector Index
CREATE INDEX idx_embeddings_hnsw ON embeddings 
USING hnsw (vector_embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);

-- Core Lookups and Foreign Key B-Tree Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sessions_user ON sessions(user_id, expires_at);
CREATE INDEX idx_skills_user ON skills(user_id, category);
CREATE INDEX idx_career_memory_user_time ON career_memory(user_id, created_at DESC);
CREATE INDEX idx_messages_user_time ON messages(user_id, created_at DESC);
CREATE INDEX idx_interview_history_user ON interview_history(user_id, interview_date DESC);
CREATE INDEX idx_recommendations_user ON recommendations(user_id, created_at DESC);
CREATE INDEX idx_tasks_status ON tasks(task_status, scheduled_for);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_market_trends_role ON market_trends(role_title, industry);

-- JSONB Inverted GIN Indexes
CREATE INDEX idx_projects_tech_stack ON projects USING GIN (tech_stack);
CREATE INDEX idx_interview_weak_topics ON interview_history USING GIN (weak_topics);
CREATE INDEX idx_career_memory_raw_data ON career_memory USING GIN (raw_data);
