from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.resume import router as resume_router
from app.api.employer import router as employer_router
from app.api.gap_coach_routes import router as gap_coach_router
from app.api.interview_routes import router as interview_router
from app.api.learning_routes import router as learning_router
from app.api.readiness_routes import router as readiness_router

app = FastAPI(
    title="NayiUdaan AI",
    description="AI Career Comeback Platform for Women",
    version="1.0.0"
)

# Allow CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    resume_router,
    prefix="/api",
    tags=["Resume"]
)

app.include_router(
    employer_router,
    prefix="/api",
)

app.include_router(
    gap_coach_router,
    prefix="/api",
)

app.include_router(
    interview_router,
    prefix="/api",
)

app.include_router(
    learning_router,
    prefix="/api",
)

app.include_router(
    readiness_router,
    prefix="/api",
)

@app.get("/")
def root():
    return {
        "message": "Welcome to NayiUdaan AI 🚀"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }