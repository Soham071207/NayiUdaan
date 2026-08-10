"""
Pydantic schemas for the AI Mock Interview Engine (Member 3, Priority 1).

These define the request/response contracts for interview_routes.py.
Keeping them in one place means Member 4 (frontend) always knows exactly
what JSON shape to expect, and it stays stable even as the service/AI
internals change.
"""

from __future__ import annotations

from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class InterviewType(str, Enum):
    TECHNICAL = "technical"
    BEHAVIORAL = "behavioral"
    CAREER_RETURN = "career_return"


class CandidateContext(BaseModel):
    """
    Optional context pulled from Member 1's output (candidate / career_gap
    fields in the existing API contract). Passing this in lets the AI ask
    more relevant, personalized questions without Member 3 re-implementing
    any of Member 1's analysis. Entirely optional — the engine works fine
    without it.
    """
    previous_role: Optional[str] = None
    experience_years: Optional[float] = None
    career_gap: Optional[bool] = None
    gap_years: Optional[int] = None
    target_role: Optional[str] = None
    field: Optional[str] = None  # Industry/domain e.g. 'Technology', 'Healthcare', 'Finance'


class StartInterviewRequest(BaseModel):
    target_role: str = Field(..., description="e.g. 'Data Analyst'")
    field: Optional[str] = Field(None, description="Industry/domain e.g. 'Technology', 'Healthcare', 'Finance'")
    interview_type: InterviewType
    candidate_context: Optional[CandidateContext] = None
    total_questions: int = Field(default=5, ge=1, le=15)


class QuestionPayload(BaseModel):
    question_number: int
    question: str
    interview_type: InterviewType


class StartInterviewResponse(BaseModel):
    session_id: str
    first_question: QuestionPayload
    total_questions: int


class SubmitAnswerRequest(BaseModel):
    session_id: str
    answer: str = Field(..., min_length=1)


class AnswerEvaluation(BaseModel):
    overall_score: int = Field(..., ge=0, le=100)
    communication: int = Field(..., ge=0, le=100)
    technical_accuracy: int = Field(..., ge=0, le=100)
    relevance: int = Field(..., ge=0, le=100)
    structure: int = Field(..., ge=0, le=100)
    confidence: int = Field(..., ge=0, le=100)
    strengths: List[str] = []
    weaknesses: List[str] = []
    feedback: str = ""
    improved_answer: str = ""


class SubmitAnswerResponse(BaseModel):
    session_id: str
    evaluation: AnswerEvaluation
    next_question: Optional[QuestionPayload] = None
    is_complete: bool


class InterviewReportQuestion(BaseModel):
    question_number: int
    question: str
    answer: str
    evaluation: AnswerEvaluation


class ConfidenceScoreBreakdown(BaseModel):
    """One weighted component of the Interview Confidence Score."""
    dimension: str
    raw_score: int = Field(..., ge=0, le=100)
    weight_pct: int
    weighted_contribution: float


class InterviewConfidenceScore(BaseModel):
    """
    Explainable, deterministic confidence score per the doc's weighting model:
    Communication 30% / Relevance 25% / Technical Accuracy 20% /
    Structure 15% / Consistency 10%.

    This is computed in Python from the AI's per-answer evaluations, not
    invented by an LLM — every point in `overall_confidence` traces back to
    a value in `breakdown`.
    """
    overall_confidence: int = Field(..., ge=0, le=100)
    breakdown: List[ConfidenceScoreBreakdown]
    strengths: List[str]
    weaknesses: List[str]
    recommended_improvements: List[str]


class FinalInterviewReport(BaseModel):
    session_id: str
    target_role: str
    interview_type: InterviewType
    questions: List[InterviewReportQuestion]
    average_overall_score: int
    average_communication: int
    average_technical_accuracy: int
    average_relevance: int
    average_structure: int
    average_confidence: int
    top_strengths: List[str]
    top_weaknesses: List[str]
    recommendations: List[str]
    confidence_score: InterviewConfidenceScore
