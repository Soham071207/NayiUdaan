from fastapi import FastAPI

app = FastAPI(
    title="NayiUdaan AI",
    description="AI Career Comeback Platform for Women",
    version="1.0.0"
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