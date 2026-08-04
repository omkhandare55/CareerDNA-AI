# Product Requirements Document (PRD): CareerDNA AI

**Tagline**: *"Your lifelong AI Career Agent that remembers every decision, every skill, every interview, and every career milestone."*

---

## 1. Vision

### Vision Statement
Build an AI Career Agent that continuously evolves with users throughout their career journey.

Unlike traditional AI assistants that forget previous conversations, CareerDNA AI maintains persistent memory using CockroachDB and continuously improves recommendations using AWS AI services.

The goal is **not to build another chatbot**, but to build a lifelong AI career companion that learns, adapts, and grows with the user.

---

## 2. Problem Statement & Opportunity

### Current Problems

Today's AI career assistants suffer from three major limitations:

1. **No Long-Term Memory**: Every conversation starts from zero. Users repeatedly explain their education, skills, experience, projects, career goals, and resume. The AI forgets everything after the session ends.
2. **Generic Career Advice**: Current AI provides one-size-fits-all recommendations (e.g., "Learn DSA", "Learn React") that ignore previous learning history, interview failures, career interests, learning pace, existing strengths, and long-term goals.
3. **Career Growth is Continuous**: Real careers evolve over years (`Learn → Practice → Fail → Improve → Interview → Receive Feedback → Learn Again → Get Job → Switch Career → Promotion`). AI should remember every stage rather than acting statelessly.

### Opportunity
Create the world's first AI Career Agent that builds a persistent **Career DNA** for every user and continuously evolves recommendations based on long-term memory.

---

## 3. Target Users

- **Primary Users**: College Students, Fresh Graduates, Internship Seekers, Placement Aspirants.
- **Secondary Users**: Software Engineers, Career Switchers, Designers, Data Scientists, Product Managers.
- **Future Users**: Recruiters, HR Teams, Universities, EdTech Platforms, Bootcamps.

---

## 4. User Personas

| Persona | Goal | Pain Points |
|---|---|---|
| **1. Engineering Student** | Get first internship | Doesn't know where to start, learns random tech, lacks personalized roadmap |
| **2. Software Engineer** | Switch to FAANG | Doesn't know missing skills, cannot track long-term growth, needs interview guidance |
| **3. Career Switcher** | Move into AI/ML | Unknown skill gaps, needs transition roadmap, wants confidence before switching |
| **4. Recruiter** | Understand candidate growth | Resume only shows final state, no visibility into learning journey & consistency |

---

## 5. User Journey

- **Day 1**: User signs in and uploads Resume, GitHub, LinkedIn, and Portfolio. CareerDNA profile is created.
- **Week 1**: AI analyzes skills, experience, projects, weaknesses, and career goals, storing everything in persistent memory.
- **Week 2**: User completes a DSA course. CareerDNA updates automatically, and recommendations refine.
- **Week 3**: User interviews at Google and fails. AI remembers questions asked, weak topics, mistakes, feedback, and confidence level.
- **Month 3**: Recommendations become hyper-personalized based on months of persistent memory.

---

## 6. Core Value Proposition

| Dimension | Traditional AI | CareerDNA AI |
|---|---|---|
| **Memory** | ❌ Session Memory | ✅ Lifetime Memory |
| **Purpose** | Answers Questions | Builds Careers |
| **State** | Stateless | Persistent |
| **Advice** | Generic Advice | Personalized Recommendations Based on Career History |

---

## 7. Core Features

1. **Persistent Career Memory**: Stores skills, projects, resume versions, interview history, certifications, goals, weaknesses, learning preferences, achievements, and reflection notes.
2. **Career DNA Graph**: Creates a structured profile covering technical & soft skills, strengths, weaknesses, career interests, learning style, growth velocity, and confidence score.
3. **Autonomous Career Updates**: Automatically updates memory following GitHub repos, resume uploads, new certificates, hackathons, internships, or interviews.
4. **Memory Evolution Engine**: Every recommendation details previous recommendations, new recommendations, why it changed, evidence used, and confidence score.
5. **Career Timeline**: Interactive timeline visualizing projects, skills, interviews, achievements, certifications, and career milestones.
6. **Interview Memory**: Tracks company name, date, questions asked, weak areas, feedback, and behavioral performance.
7. **Skill Gap Analysis**: Predicts missing skills, industry trends, learning priorities, and career risks.
8. **Career Simulation**: Simulates career transitions (e.g., "What if I become an AI Engineer?", "What if I pursue Masters?") and predicts outcomes.
9. **Weekly Reflection Agent**: Weekly prompts ("What did you learn this week?") that automatically update CareerDNA.
10. **Explainable AI**: Displays why each recommendation was made, evidence relied upon, past memory used, and confidence score.

---

## 8. Non-Features (Out of Scope)

CareerDNA AI is **NOT**:
- Another Chatbot
- Resume Builder
- Job Portal
- LinkedIn Clone
- Applicant Tracking System (ATS)
- Online Course Platform

---

## 9. MVP Scope

### Must Have
- User Authentication (AWS Cognito)
- Resume Upload (AWS S3)
- CareerDNA Creation
- Persistent Memory (CockroachDB)
- AWS AI Recommendation Engine (AWS Bedrock)
- Career Timeline
- Skill Gap Analysis
- Interview Memory
- Weekly Reflection
- Explainable Recommendations

---

## 10. Future Scope

- **Multi-Agent Career Team**: Dedicated subagents (Resume Agent, Interview Agent, Career Coach, Salary Negotiation Agent, Networking Agent, Portfolio Reviewer, Learning Planner, Mental Wellness Coach).
- **Recruiter Dashboard**: Candidate growth analysis, skill progress tracking, career insights.
- **University Dashboard**: Student progress, placement readiness, skill distribution.

---

## 11. Technical Architecture & Constraints

### Tech Stack
- **Frontend**: React / Next.js, Tailwind CSS
- **Backend**: FastAPI / Node.js
- **Database**: CockroachDB (Distributed SQL, Persistent Memory)
- **AI Engine**: AWS Bedrock (Claude / Llama / Titan Models)
- **Authentication**: AWS Cognito
- **Storage**: AWS S3
- **Event Processing**: AWS EventBridge / Lambda
- **Monitoring**: AWS CloudWatch

---

## 12. Success Metrics

- **Product**: Recommendation accuracy, user retention, WAU, memory growth rate, reflection completion rate.
- **Technical**: Memory retrieval latency, database availability, AI response time, recommendation confidence score.
- **Hackathon**: Innovation, technical architecture, practical impact, AI usage, CockroachDB & AWS integration depth, demo quality.

---

## 13. Demo Flow & WOW Moments

### 5-Minute Demo Flow
1. **Min 1**: Upload resume → CareerDNA generated.
2. **Min 2**: Ask "How do I become an AI Engineer?" → Get personalized roadmap.
3. **Min 3**: Upload new AWS Certificate → CareerDNA updates instantly, roadmap adapts.
4. **Min 4**: Mock interview failure logged → Weak topics & feedback recorded.
5. **Min 5**: Ask same question again → Roadmap evolves based on newly logged failure and certificate.

### Key Judge WOW Moments
- **WOW 1**: Cross-device login restores complete career memory seamless persistent state.
- **WOW 2**: Dynamic recommendation evolution after every single interaction.
- **WOW 3**: Real-time interactive Career Timeline updates.
- **WOW 4**: Transparent, explainable AI ("Why recommendation changed").
- **WOW 5**: Career Simulation with multi-path outcome prediction.
- **WOW 6**: Evolving Career DNA Score backed by empirical evidence.
- **WOW 7**: Memory Replay tracing past events to current recommendations.
