"""
FastAPI routes for the Career Readiness Score.
"""

from fastapi import APIRouter, HTTPException

from app.schemas.readiness import CareerReadinessScore, ReadinessRequest
from app.services import readiness_service

router = APIRouter(prefix="/career-coach/readiness-score", tags=["Career Readiness"])


@router.post("", response_model=CareerReadinessScore)
async def compute_readiness_score(request: ReadinessRequest):
    try:
        return readiness_service.compute_readiness_score(request)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
