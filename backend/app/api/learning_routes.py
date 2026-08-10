"""
FastAPI routes for the Learning Tracker.
"""

from fastapi import APIRouter, HTTPException

from app.schemas.learning import (
    InitializeTrackerRequest,
    ToggleTaskRequest,
    TrackerState,
)
from app.services import learning_service
from app.services.learning_service import TaskNotFound, TrackerNotFound

router = APIRouter(prefix="/career-coach/learning-tracker", tags=["Learning Tracker"])


@router.post("/initialize", response_model=TrackerState)
async def initialize_tracker(request: InitializeTrackerRequest):
    return learning_service.initialize_tracker(request)


@router.get("/{tracker_id}", response_model=TrackerState)
async def get_tracker_state(tracker_id: str):
    try:
        return learning_service.get_tracker_state(tracker_id)
    except TrackerNotFound as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.patch("/task", response_model=TrackerState)
async def toggle_task(request: ToggleTaskRequest):
    try:
        return learning_service.toggle_task(request)
    except TrackerNotFound as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except TaskNotFound as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
