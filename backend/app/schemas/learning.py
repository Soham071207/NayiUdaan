"""
Pydantic schemas for the Learning Tracker (Priority 4).

Consumes Member 1's `market` + `roadmap` output — the caller (frontend or
an integration layer) maps Member 1's roadmap JSON into RoadmapItemInput
objects before calling /initialize. Member 3 does not regenerate or own
the roadmap itself, only tracks progress against it.
"""

from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class RoadmapItemInput(BaseModel):
    """One task from Member 1's 8-week roadmap, as consumed by the tracker."""
    skill: str
    title: str
    week: Optional[int] = Field(default=None, ge=1, le=8)


class InitializeTrackerRequest(BaseModel):
    user_id: Optional[str] = Field(
        default=None,
        description="Stable id for this candidate if known (e.g. from auth/DB). "
                    "If omitted, a new tracker_id is generated and returned.",
    )
    roadmap_items: List[RoadmapItemInput] = Field(..., min_length=1)


class LearningTask(BaseModel):
    task_id: str
    skill: str
    title: str
    week: Optional[int] = None
    completed: bool = False


class SkillProgress(BaseModel):
    skill: str
    completed_tasks: int
    total_tasks: int
    progress_percentage: int = Field(..., ge=0, le=100)


class TrackerState(BaseModel):
    tracker_id: str
    tasks: List[LearningTask]
    skills_progress: List[SkillProgress]
    overall_progress: int = Field(..., ge=0, le=100)


class ToggleTaskRequest(BaseModel):
    tracker_id: str
    task_id: str
    completed: bool
