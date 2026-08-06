from fastapi import FastAPI
from app.api.resume import router as resume_router

app = FastAPI(
    title="NayiUdaan AI",
    description="AI Career Comeback Platform for Women",
    version="1.0.0"
)
app.include_router(
    resume_router,
    prefix="/api",
    tags=["Resume"]
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