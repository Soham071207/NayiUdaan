# NayiUdaan AI

NayiUdaan AI is an AI-powered career comeback platform for women restarting their careers after maternity, marriage relocation, caregiving, or a career break.

## Repository Layout

- `frontend/` - Next.js 15 application for the user experience, dashboard, and AI-powered career tools.
- `backend/` - FastAPI service that handles parsing, analysis, AI orchestration, and API delivery.
- `docs/` - Product, architecture, and implementation notes.
- `datasets/` - Shared sample inputs, evaluation fixtures, and reference data.
- `presentation/` - Pitch assets, demo material, and hackathon presentation files.

## Frontend Structure

- `frontend/app/` - App Router entry points, pages, layouts, and route-level UI.
- `frontend/components/` - Reusable UI components and shadcn/ui building blocks.
- `frontend/features/` - Feature-scoped modules for product areas such as dashboard, resume upload, and coaching.
- `frontend/hooks/` - Shared React hooks.
- `frontend/lib/` - Client-side utilities, helpers, and framework adapters.
- `frontend/services/` - Frontend service clients for APIs and external integrations.
- `frontend/types/` - Shared TypeScript types and interfaces.
- `frontend/public/` - Static assets served directly by Next.js.
- `frontend/styles/` - Shared global styles, tokens, and design primitives.

## Backend Structure

- `backend/app/` - FastAPI application source.
- `backend/app/api/` - API routing, dependency wiring, and versioned endpoints.
- `backend/app/ai/` - AI orchestration modules for resume parsing, scoring, and roadmap generation.
- `backend/app/prompts/` - Prompt templates and prompt assets for Gemini-based workflows.
- `backend/app/datasets/` - Backend-local reference data and fixtures.
- `backend/app/services/` - Infrastructure services such as storage, database, and model integrations.
- `backend/app/models/` - Domain models and persistence entities.
- `backend/app/schemas/` - Pydantic request and response schemas.
- `backend/app/utils/` - General-purpose helpers and shared utilities.

## Development Notes

- Business logic is intentionally not implemented yet.
- The repository is scaffolded for clean architecture, separation of concerns, and easy feature expansion.
- Environment variables should be defined in local `.env` files and never committed.
