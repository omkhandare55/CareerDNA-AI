# CockroachDB Database Schema & Architecture Guide

**Platform**: CareerDNA AI  
**Engine**: CockroachDB Serverless / Enterprise (v24.x+)  
**Vector Engine**: CockroachDB Distributed HNSW Vector Search  
**Author**: Principal Database Architect  
**Status**: Production Ready  

---

## 1. Why CockroachDB is Essential for CareerDNA AI

CareerDNA AI is built to maintain a **lifelong, persistent career memory graph** for every user. Traditional relational databases (PostgreSQL, MySQL) struggle with multi-region scaling and high-availability vector operations, while NoSQL databases lack strict ACID guarantees required for critical user data, session state, and recommendation history audit trails.

### Key Technical Advantages of CockroachDB:

1. **Distributed SQL Architecture**: Built on a cloud-native, distributed key-value architecture that scales horizontally across regions without manual sharding or complex write-master/read-replica topologies.
2. **Serializable ACID Transactions**: Provides strict serializability (SSI), preventing race conditions when parallel background agents (Reflection Agent, LangGraph Execution, GitHub Webhook Ingest) update user profiles simultaneously.
3. **Integrated Distributed Vector Indexing**: CockroachDB natively supports the `VECTOR` data type with HNSW (Hierarchical Navigable Small World) indexes, allowing sub-50ms cosine distance similarity search over millions of vector embeddings across distributed nodes.
4. **Resilience & Zero-Downtime**: Handles cloud provider outages, region failures, and schema migrations without application downtime.
5. **JSONB & Hybrid Data Modeling**: Combines rigid relational integrity (Foreign Keys, UNIQ constraints) with semi-structured JSONB attributes for rapidly evolving AI metadata, memory graph scores, and market trend snapshots.

---

## 2. Table Specifications & Column Explanations

The schema consists of **20 core tables** organized into 5 logical subsystems:
- **Identity & Session Subsystem**: `users`, `profiles`, `sessions`
- **Career State Subsystem**: `career_goals`, `skills`, `projects`, `experiences`, `resume_versions`, `applications`
- **Interactive & Evolution Subsystem**: `messages`, `interview_history`, `learning_progress`
- **Memory Graph & Vector Subsystem**: `career_memory`, `memory_scores`, `memory_relationships`, `embeddings`
- **Agentic Operations Subsystem**: `tasks`, `notifications`, `recommendations`, `market_trends`

---

### 2.1 Identity & Session Subsystem

#### 1. `users`
Core user identity linked to AWS Cognito identity provider.
- `id` (UUID): Primary key, auto-generated.
- `cognito_sub` (VARCHAR(255)): Unique subject identifier from AWS Cognito user pool.
- `email` (VARCHAR(255)): User email address, unique index.
- `full_name` (VARCHAR(255)): Full display name.
- `is_active` (BOOLEAN): Soft-delete flag for user account status.
- `created_at` (TIMESTAMPTZ): Account creation timestamp.
- `updated_at` (TIMESTAMPTZ): Profile update timestamp.

#### 2. `profiles`
Extended profile information, baseline preferences, and state.
- `id` (UUID): Primary key.
- `user_id` (UUID): Foreign key to `users(id)` ON DELETE CASCADE (1:1 relationship).
- `headline` (VARCHAR(500)): Current professional headline.
- `current_role` (VARCHAR(255)): Current job title or student status.
- `years_experience` (NUMERIC(4, 1)): Total years of professional experience.
- `location` (VARCHAR(255)): Current geographic location.
- `bio` (TEXT): Self-written summary or extracted bio.
- `avatar_url` (TEXT): AWS S3 URL for profile picture.
- `preferred_learning_style` (VARCHAR(50)): e.g., 'VISUAL', 'HANDS_ON', 'THEORETICAL'.
- `metadata` (JSONB): Dynamic configuration options (notification preferences, privacy settings).
- `updated_at` (TIMESTAMPTZ): Last update timestamp.

#### 3. `sessions`
Web & mobile application user authentication session tracking.
- `id` (UUID): Primary key.
- `user_id` (UUID): Foreign key to `users(id)` ON DELETE CASCADE.
- `refresh_token_hash` (TEXT): Hashed refresh token for security verification.
- `ip_address` (INET): Client IP address for audit and fraud prevention.
- `user_agent` (TEXT): Client browser/device string.
- `expires_at` (TIMESTAMPTZ): Session expiration timestamp.
- `created_at` (TIMESTAMPTZ): Session start timestamp.

---

### 2.2 Career State Subsystem

#### 4. `career_goals`
User short-term and long-term career targets.
- `id` (UUID): Primary key.
- `user_id` (UUID): Foreign key to `users(id)`.
- `target_role` (VARCHAR(255)): Desired role (e.g., "Senior AI Engineer").
- `target_industry` (VARCHAR(255)): Desired industry (e.g., "Fintech", "HealthTech").
- `target_timeframe_months` (INT): Horizon to reach goal in months (e.g., 6, 12, 24).
- `target_salary_min` (NUMERIC(12, 2)): Minimum acceptable compensation.
- `priority_level` (VARCHAR(50)): 'HIGH', 'MEDIUM', 'LOW'.
- `status` (VARCHAR(50)): 'ACTIVE', 'ACHIEVED', 'ABANDONED'.
- `created_at` (TIMESTAMPTZ): Record creation timestamp.

#### 5. `skills`
Skill matrix representing technical and soft skill proficiency over time.
- `id` (UUID): Primary key.
- `user_id` (UUID): Foreign key to `users(id)`.
- `skill_name` (VARCHAR(255)): Standardized skill name (e.g., "Python", "System Design").
- `category` (VARCHAR(100)): Category ('TECHNICAL', 'SOFT_SKILL', 'DOMAIN_KNOWLEDGE').
- `proficiency_score` (NUMERIC(3, 2)): Normalized score from 0.00 to 1.00.
- `verified_by_evidence` (BOOLEAN): True if skill is backed by GitHub repo, interview, or certification.
- `last_practiced_at` (TIMESTAMPTZ): Timestamp when skill was last demonstrated or updated.
- `created_at` (TIMESTAMPTZ): Creation timestamp.

#### 6. `projects`
Portfolio projects, open-source work, and hackathon entries.
- `id` (UUID): Primary key.
- `user_id` (UUID): Foreign key to `users(id)`.
- `title` (VARCHAR(255)): Project name.
- `description` (TEXT): Detailed project description.
- `github_url` (TEXT): Repository URL.
- `live_url` (TEXT): Live deployment URL.
- `tech_stack` (JSONB): Array of technologies used `["FastAPI", "CockroachDB", "LangGraph"]`.
- `role_in_project` (VARCHAR(255)): User contribution role.
- `start_date` (DATE): Project start date.
- `end_date` (DATE): Project completion date (NULL if ongoing).
- `created_at` (TIMESTAMPTZ): Record creation timestamp.

#### 7. `experiences`
Work history, internships, and educational qualifications.
- `id` (UUID): Primary key.
- `user_id` (UUID): Foreign key to `users(id)`.
- `organization` (VARCHAR(255)): Company or university name.
- `role_or_degree` (VARCHAR(255)): Job title or degree earned.
- `experience_type` (VARCHAR(50)): 'WORK', 'INTERNSHIP', 'EDUCATION', 'BOOTCAMP'.
- `description` (TEXT): Description of duties and accomplishments.
- `start_date` (DATE): Start date.
- `end_date` (DATE): End date (NULL if current position).
- `is_current` (BOOLEAN): True if currently active.
- `created_at` (TIMESTAMPTZ): Record creation timestamp.

#### 8. `resume_versions`
Versioned historical records of user resumes uploaded to AWS S3.
- `id` (UUID): Primary key.
- `user_id` (UUID): Foreign key to `users(id)`.
- `version_number` (INT): Incremental version index (1, 2, 3...).
- `s3_bucket` (VARCHAR(255)): AWS S3 bucket name.
- `s3_key` (TEXT): Object key in AWS S3.
- `parsed_content` (JSONB): Fully parsed structured text (skills, work history, education).
- `is_active` (BOOLEAN): Indicates primary active resume.
- `uploaded_at` (TIMESTAMPTZ): Upload timestamp.

#### 9. `applications`
Job application tracker across target companies.
- `id` (UUID): Primary key.
- `user_id` (UUID): Foreign key to `users(id)`.
- `company_name` (VARCHAR(255)): Target organization.
- `job_title` (VARCHAR(255)): Job title.
- `job_url` (TEXT): URL of job posting.
- `application_status` (VARCHAR(50)): 'SAVED', 'APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED'.
- `applied_date` (DATE): Application submission date.
- `notes` (TEXT): Personal notes or application context.
- `created_at` (TIMESTAMPTZ): Record creation timestamp.

---

### 2.3 Interactive & Evolution Subsystem

#### 10. `messages`
Chat messages and agentic interaction transcripts.
- `id` (UUID): Primary key.
- `user_id` (UUID): Foreign key to `users(id)`.
- `sender_type` (VARCHAR(50)): 'USER', 'AGENT', 'SYSTEM'.
- `agent_id` (VARCHAR(100)): Identifier of agent (e.g., "CAREER_COACH", "INTERVIEW_AGENT").
- `content` (TEXT): Message payload.
- `metadata` (JSONB): UI execution metadata, evidence tags, tool call logs.
- `created_at` (TIMESTAMPTZ): Interaction timestamp.

#### 11. `interview_history`
Detailed logs of mock and actual technical/behavioral interviews.
- `id` (UUID): Primary key.
- `user_id` (UUID): Foreign key to `users(id)`.
- `company_name` (VARCHAR(255)): Target company.
- `role_title` (VARCHAR(255)): Role evaluated.
- `interview_date` (DATE): Date of interview.
- `result` (VARCHAR(50)): 'PASSED', 'FAILED', 'PENDING'.
- `questions_asked` (JSONB): Structured array of questions asked.
- `weak_topics` (JSONB): Specific technical/behavioral areas identified for improvement.
- `feedback` (TEXT): Detailed interviewer/agent feedback.
- `confidence_rating` (NUMERIC(3, 2)): User's self-assessed confidence (0.00 - 1.00).
- `created_at` (TIMESTAMPTZ): Record timestamp.

#### 12. `learning_progress`
Tracking completed courses, DSA problems, certifications, and reading lists.
- `id` (UUID): Primary key.
- `user_id` (UUID): Foreign key to `users(id)`.
- `resource_title` (VARCHAR(255)): Title of course/book/certification (e.g., "AWS Machine Learning Specialty").
- `platform` (VARCHAR(100)): Provider (e.g., "Coursera", "LeetCode", "AWS").
- `resource_type` (VARCHAR(50)): 'COURSE', 'CERTIFICATION', 'PROBLEM_SET', 'BOOK'.
- `progress_percentage` (NUMERIC(5, 2)): Progress from 0.00% to 100.00%.
- `status` (VARCHAR(50)): 'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'.
- `certificate_url` (TEXT): S3 URL of certificate.
- `completed_at` (TIMESTAMPTZ): Completion timestamp.

---

### 2.4 Memory Graph & Vector Subsystem

#### 13. `career_memory`
The central persistent memory log capturing all milestones, events, and failures.
- `id` (UUID): Primary key.
- `user_id` (UUID): Foreign key to `users(id)`.
- `memory_type` (VARCHAR(50)): 'RESUME_UPLOAD', 'INTERVIEW_FAILURE', 'COURSE_COMPLETE', 'REFLECTION_NOTE', 'SKILL_ACQUIRED'.
- `summary` (TEXT): Human-readable event summary.
- `raw_data` (JSONB): Raw input payload snapshot.
- `importance_score` (NUMERIC(3, 2)): System-assessed importance weight (0.00 to 1.00).
- `created_at` (TIMESTAMPTZ): Milestone timestamp.

#### 14. `memory_scores`
Evolving psychological and technical DNA dimension scores.
- `id` (UUID): Primary key.
- `user_id` (UUID): Foreign key to `users(id)`.
- `overall_dna_score` (INT): Composite score from 0 to 100.
- `technical_readiness` (NUMERIC(5, 2)): Readiness for target role (%).
- `growth_velocity` (NUMERIC(5, 2)): Rate of skill improvement week-over-week.
- `consistency_score` (NUMERIC(5, 2)): Streak and reflection regularity index.
- `confidence_score` (NUMERIC(5, 2)): Empirical confidence rating.
- `calculated_at` (TIMESTAMPTZ): Calculation timestamp.

#### 15. `memory_relationships`
Directed graph edges connecting related career memory nodes.
- `id` (UUID): Primary key.
- `user_id` (UUID): Foreign key to `users(id)`.
- `source_memory_id` (UUID): Foreign key to `career_memory(id)`.
- `target_memory_id` (UUID): Foreign key to `career_memory(id)`.
- `relationship_type` (VARCHAR(50)): 'CAUSED_BY', 'IMPROVED_BY', 'SUPERSEDES', 'CONTRADICTS'.
- `weight` (NUMERIC(3, 2)): Connection strength (0.00 to 1.00).
- `created_at` (TIMESTAMPTZ): Timestamp.

#### 16. `embeddings`
Distributed vector index table storing 1024-dimensional embeddings for RAG retrieval.
- `id` (UUID): Primary key.
- `user_id` (UUID): Foreign key to `users(id)`.
- `memory_id` (UUID): Foreign key to `career_memory(id)` ON DELETE CASCADE.
- `content_chunk` (TEXT): The exact text snippet embedded.
- `vector_embedding` (VECTOR(1024)): 1024-dimension vector from AWS Titan Embeddings V2.
- `created_at` (TIMESTAMPTZ): Vector creation timestamp.

---

### 2.5 Agentic Operations Subsystem

#### 17. `tasks`
Background agent tasks, scheduled reflection jobs, and async workflows.
- `id` (UUID): Primary key.
- `user_id` (UUID): Foreign key to `users(id)`.
- `task_name` (VARCHAR(255)): e.g., "WEEKLY_REFLECTION_DISPATCH", "PROFILE_REINDEXING".
- `task_status` (VARCHAR(50)): 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED'.
- `payload` (JSONB): Execution parameters.
- `error_message` (TEXT): Error traceback if status is FAILED.
- `scheduled_for` (TIMESTAMPTZ): Intended execution time.
- `completed_at` (TIMESTAMPTZ): Execution completion time.

#### 18. `notifications`
Proactive AI alerts, weekly reflection reminders, and milestone celebrations.
- `id` (UUID): Primary key.
- `user_id` (UUID): Foreign key to `users(id)`.
- `title` (VARCHAR(255)): Notification title.
- `message` (TEXT): Body text.
- `notification_type` (VARCHAR(50)): 'REFLECTION_PROMPT', 'RECOMMENDATION_CHANGE', 'MILESTONE_REACHED'.
- `is_read` (BOOLEAN): Read status.
- `action_url` (TEXT): Target link.
- `created_at` (TIMESTAMPTZ): Creation timestamp.

#### 19. `recommendations`
Audit history of recommendations generated by AWS Bedrock & LangGraph.
- `id` (UUID): Primary key.
- `user_id` (UUID): Foreign key to `users(id)`.
- `query_prompt` (TEXT): User prompt or automated trigger.
- `previous_recommendation` (TEXT): Previous baseline recommendation.
- `new_recommendation` (TEXT): Updated recommendation.
- `why_changed` (TEXT): Explainable AI reasoning detailing what memory caused the shift.
- `evidence_used` (JSONB): Array of `memory_id`s used as evidence.
- `confidence_score` (NUMERIC(3, 2)): Model confidence (0.00 to 1.00).
- `created_at` (TIMESTAMPTZ): Log timestamp.

#### 20. `market_trends`
Global technical skills demand and industry benchmarks snapshot.
- `id` (UUID): Primary key.
- `role_title` (VARCHAR(255)): e.g., "AI Engineer", "Backend Developer".
- `industry` (VARCHAR(255)): Industry vertical.
- `in_demand_skills` (JSONB): Array of trending skills with weights `[{"skill": "LangGraph", "weight": 0.95}]`.
- `average_salary_range` (JSONB): Salary percentile distribution.
- `growth_rate_pct` (NUMERIC(5, 2)): Annual job market demand growth %.
- `updated_at` (TIMESTAMPTZ): Ingestion timestamp.

---

## 3. Database Indexes Architecture

To guarantee low latency at scale, the following primary, secondary, GIN, and HNSW vector indexes are defined:

1. **HNSW Vector Index**:
   - `idx_embeddings_hnsw` on `embeddings USING hnsw (vector_embedding vector_cosine_ops)`: Enables sub-50ms similarity search over millions of vector memory chunks.
2. **User Isolation Indexes**:
   - High-cardinality multi-column B-Tree indexes on `(user_id, created_at DESC)` across all user-bound tables (`career_memory`, `messages`, `recommendations`, `interview_history`).
3. **JSONB GIN Indexes**:
   - GIN indexes on `projects.tech_stack`, `career_memory.raw_data`, and `interview_history.weak_topics` for fast JSON searching.
4. **Unique Constraints**:
   - `users.cognito_sub`, `users.email`, and `profiles.user_id`.

---

## 4. Complete SQL DDL Script

See the full executable DDL script in [`schema.sql`](file:///c:/Users/omkh4/Downloads/CareerDNA%20AI/schema.sql).
