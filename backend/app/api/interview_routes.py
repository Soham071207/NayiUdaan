"""
FastAPI routes for the Mock Interview Engine.

Controllers stay thin — they call into the service layer and translate
service-level exceptions into HTTP responses. No business logic lives here.
"""

from fastapi import APIRouter, HTTPException

from app.ai.interview_ai import InterviewAIError
from app.schemas.interview import (
    FinalInterviewReport,
    InterviewConfidenceScore,
    StartInterviewRequest,
    StartInterviewResponse,
    SubmitAnswerRequest,
    SubmitAnswerResponse,
)
from app.services import interview_service
from app.services.interview_service import InterviewSessionNotFound

router = APIRouter(prefix="/career-coach/interview", tags=["Mock Interview"])


@router.post("/start", response_model=StartInterviewResponse)
async def start_interview(request: StartInterviewRequest):
    try:
        return await interview_service.start_interview(request)
    except InterviewAIError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.post("/answer", response_model=SubmitAnswerResponse)
async def submit_answer(request: SubmitAnswerRequest):
    try:
        return await interview_service.submit_answer(request)
    except InterviewSessionNotFound as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except InterviewAIError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.get("/{session_id}/report", response_model=FinalInterviewReport)
async def get_report(session_id: str):
    try:
        return interview_service.get_final_report(session_id)
    except InterviewSessionNotFound as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except InterviewAIError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/{session_id}/confidence-score", response_model=InterviewConfidenceScore)
async def get_confidence_score(session_id: str):
    """Standalone endpoint for the dashboard's 'Interview Confidence: X/100' widget."""
    try:
        return interview_service.get_confidence_score(session_id)
    except InterviewSessionNotFound as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except InterviewAIError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
