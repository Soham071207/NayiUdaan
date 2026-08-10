"""
FastAPI routes for the Career Gap Explanation Generator.
"""

from fastapi import APIRouter, HTTPException

from app.ai.gap_coach_ai import GapCoachAIError
from app.schemas.gap_coach import GapCoachRequest, GapCoachResponse
from app.services import gap_coach_service

router = APIRouter(prefix="/career-coach/gap-explanation", tags=["Career Gap Coach"])


@router.post("", response_model=GapCoachResponse)
async def get_gap_explanations(request: GapCoachRequest):
    try:
        return await gap_coach_service.get_gap_explanations(request)
    except GapCoachAIError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
