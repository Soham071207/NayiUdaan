"""
Pydantic schemas for the Career Gap Explanation Generator (Priority 3).

Consumes fields Member 1 already produces (candidate / career_gap in the
existing API contract) — Member 3 does not re-derive any of this, it only
takes the values as input.
"""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class GapCoachRequest(BaseModel):
    # Pulled from Member 1's `candidate` object
    previous_role: Optional[str] = None
    experience_years: Optional[float] = None

    # Pulled from Member 1's `career_gap` object
    career_gap: bool = True
    gap_years: Optional[int] = None
    reason: Optional[str] = Field(
        default=None,
        description="Free-text reason if the candidate has shared one, e.g. 'maternity', 'caregiving'. Optional — the generator works without it.",
    )

    target_role: str = Field(..., description="Role the candidate is applying/preparing for")


class GapExplanationSet(BaseModel):
    short_explanation: str = Field(..., description="1-2 sentences, e.g. for a resume summary line")
    detailed_explanation: str = Field(..., description="A fuller paragraph, e.g. for a cover letter")
    interview_answer: str = Field(..., description="Spoken-register answer to 'walk me through your career break'")
    professional_version: str = Field(..., description="LinkedIn 'About'-style framing")


class GapCoachResponse(BaseModel):
    target_role: str
    gap_years: Optional[int] = None
    explanations: GapExplanationSet
