-- Enable vector extension
SET CLUSTER SETTING feature.vector_index.enabled = true;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email STRING UNIQUE NOT NULL,
    password_hash STRING NOT NULL,
    full_name STRING NOT NULL DEFAULT '',
    target_role STRING NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS career_memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    memory_type STRING NOT NULL,
    summary TEXT NOT NULL,
    raw_data JSONB DEFAULT '{}',
    importance_score FLOAT DEFAULT 0.5,
    embedding VECTOR(1024),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    skill_name STRING NOT NULL,
    category STRING NOT NULL DEFAULT 'TECHNICAL',
    proficiency_score FLOAT DEFAULT 0.5,
    verified_by_evidence BOOL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS interview_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    company_name STRING NOT NULL,
    role_title STRING NOT NULL,
    interview_date DATE,
    result STRING NOT NULL DEFAULT 'PENDING',
    questions_asked JSONB DEFAULT '[]',
    weak_topics JSONB DEFAULT '[]',
    feedback TEXT DEFAULT '',
    confidence_rating FLOAT DEFAULT 0.5,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    resource_title STRING NOT NULL,
    platform STRING,
    resource_type STRING DEFAULT 'COURSE',
    progress_percentage FLOAT DEFAULT 0.0,
    status STRING DEFAULT 'NOT_STARTED',
    certificate_url STRING,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    title STRING NOT NULL,
    message TEXT NOT NULL,
    notification_type STRING DEFAULT 'INFO',
    is_read BOOL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    query_prompt TEXT,
    previous_recommendation TEXT,
    new_recommendation TEXT,
    why_changed TEXT,
    evidence_used JSONB DEFAULT '[]',
    confidence_score FLOAT DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    event_type STRING NOT NULL,
    title STRING NOT NULL,
    description TEXT DEFAULT '',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Vector index for semantic memory search
CREATE VECTOR INDEX IF NOT EXISTS idx_career_memories_embedding
ON career_memories (user_id, embedding vector_cosine_ops);

-- Standard indexes
CREATE INDEX IF NOT EXISTS idx_memories_user ON career_memories (user_id);
CREATE INDEX IF NOT EXISTS idx_skills_user ON skills (user_id);
CREATE INDEX IF NOT EXISTS idx_interviews_user ON interview_history (user_id);
CREATE INDEX IF NOT EXISTS idx_learning_user ON learning_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON recommendations (user_id);
CREATE INDEX IF NOT EXISTS idx_timeline_user ON timeline_events (user_id);
