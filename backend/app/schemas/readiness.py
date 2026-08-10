"""
Pydantic schemas for the Career Readiness Score (Priority 5).

Combines signals from all three members:
- Member 1 (resume_strength, skill_readiness) — from resume_review / market
- Member 2 (employer_compatibility) — from employer matching
- Member 3 (interview_performance, learning_progress, gap_preparedness) —
  interview_performance / learning_progress can be auto-resolved from an
  interview_session_id / learning_tracker_id that Member 3 already owns.

Member 1 and Member 2's exact output shapes aren't finalized yet, so this
accepts plain 0-100 scores per component rather than their raw JSON —
whoever wires the integration maps their output into these fields.
"""

from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class ReadinessComponentInput(BaseModel):
    resume_strength: Optional[int] = Field(default=None, ge=0, le=100)
    skill_readiness: Optional[int] = Field(default=None, ge=0, le=100)
    employer_compatibility: Optional[int] = Field(default=None, ge=0, le=100)
    gap_preparedness: Optional[int] = Field(default=None, ge=0, le=100)
    interview_performance: Optional[int] = Field(
        default=None, ge=0, le=100,
        description="If omitted and interview_session_id is provided, this is pulled from that session's confidence score.",
    )
    learning_progress: Optional[int] = Field(
        default=None, ge=0, le=100,
        description="If omitted and learning_tracker_id is provided, this is pulled from that tracker's overall_progress.",
    )


class ReadinessRequest(BaseModel):
    components: ReadinessComponentInput = ReadinessComponentInput()
    interview_session_id: Optional[str] = None
    learning_tracker_id: Optional[str] = None


class ReadinessComponentBreakdown(BaseModel):
    component: str
    raw_score: int
    weight_pct: int = Field(..., description="Weight actually used, renormalized across available components")
    weighted_contribution: float


class CareerReadinessScore(BaseModel):
    overall_readiness: int = Field(..., ge=0, le=100)
    breakdown: List[ReadinessComponentBreakdown]
    missing_components: List[str] = Field(
        default_factory=list,
        description="Components with no data available, excluded from the score (weights renormalized among the rest).",
    )
    strongest_area: Optional[str] = None
    weakest_areas: List[str] = []
    explanation: str
    recommendation: str
