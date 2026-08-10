# System Architecture: NayiUdaan

## 1. High-Level Architecture
NayiUdaan follows a decoupled client-server architecture.
- **Frontend**: Next.js / React (App Router, Tailwind CSS, shadcn/ui)
- **Backend**: Python (FastAPI)
- **AI Layer**: OpenRouter API (LLM Integration)
- **Database**: PostgreSQL (Planned)

## 2. System Flow Diagram

```mermaid
flowchart TD
    Client[React Frontend] -->|POST /api/upload-resume| API[FastAPI Routes]
    API --> Controller[Resume Controller]
    Controller --> Engine[AIEngine Orchestrator]
    
    subgraph AI Service Layer
        Engine --> RI[Resume Intelligence]
        Engine --> CG[Career Gap Detector]
        Engine --> MI[Market Intelligence]
        Engine --> RG[Roadmap Generator]
        Engine --> RO[Resume Optimizer]
        Engine --> CR[Report Generator]
    end
    
    AI Service Layer -->|LLM Prompts| LLM[OpenRouter / Gemini API]
    
    CR --> Engine
    Engine --> Controller
    Controller -->|JSON Response| Client
```

## 3. Core Architectural Principles
1. **Service Layer Pattern**: Business logic is isolated in `services/` and `ai/` modules. Controllers remain thin.
2. **AI as a Reasoning Engine**: LLMs are used strictly for reasoning, data extraction, and synthesis. Structured JSON outputs are enforced.
3. **Immutability of Existing APIs**: Existing endpoints (e.g., the combined JSON response for resume upload) must not break.
4. **Modularity**: New features (Auth, Employer Intelligence, Interview Coach) must be built as independent services.

## 4. Database Architecture (Proposed Entity Draft)
- **Users**: `id`, `email`, `password_hash`, `role` (candidate/employer), `created_at`
- **Profiles**: `user_id`, `name`, `current_status`, `career_gap_years`, `target_role`
- **Resumes**: `id`, `user_id`, `s3_url`, `parsed_data_json`, `uploaded_at`
- **CareerReports**: `id`, `user_id`, `resume_id`, `full_report_json`, `generated_at`

## 5. Deployment Strategy
- **Frontend**: Vercel / Netlify
- **Backend**: Render / Railway / AWS ECS
- **Database**: Supabase / Neon (Serverless Postgres)
- **Storage**: AWS S3 (for storing PDF resumes)
