"""
Interview session orchestration.

This is the ONLY layer that owns interview session state. Routes call into
this service; the service calls the AI layer (app.ai.interview_ai)
for reasoning and does deterministic bookkeeping (session state, score
averages, recommendations) itself — per the "AI for reasoning, Python for
math" engineering rule.

NOTE: Sessions are stored in-memory (`_SESSIONS`) since the shared database
is still being built by another teammate. This is intentionally the only
place that knows that — swap it for a real repository later without
touching routes.py or interview_ai.py.
"""

import statistics
import uuid
from typing import Dict, List, Optional

from app.ai import interview_ai
from app.ai.interview_ai import InterviewAIError
from app.schemas.interview import (
    AnswerEvaluation,
    CandidateContext,
    ConfidenceScoreBreakdown,
    FinalInterviewReport,
    InterviewConfidenceScore,
    InterviewReportQuestion,
    QuestionPayload,
    StartInterviewRequest,
    StartInterviewResponse,
    SubmitAnswerRequest,
    SubmitAnswerResponse,
)

# Weighting model from the project doc, section 12.
# Communication 30% / Relevance 25% / Technical Accuracy 20% / Structure 15% / Consistency 10%
CONFIDENCE_WEIGHTS = {
    "communication": 0.30,
    "relevance": 0.25,
    "technical_accuracy": 0.20,
    "structure": 0.15,
    "consistency": 0.10,
}


class InterviewSessionNotFound(Exception):
    pass


class InterviewSession:
    def __init__(self, request: StartInterviewRequest):
        self.session_id = str(uuid.uuid4())
        self.target_role = request.target_role
        self.field = request.field  # Industry/domain e.g. 'Technology', 'Healthcare'
        self.interview_type = request.interview_type
        self.candidate_context: Optional[CandidateContext] = request.candidate_context
        self.total_questions = request.total_questions
        self.current_question_number = 0
        self.current_question_text: Optional[str] = None
        # Each entry: {"question": str, "answer": str, "evaluation": AnswerEvaluation}
        self.qa_history: List[dict] = []

    @property
    def is_complete(self) -> bool:
        return len(self.qa_history) >= self.total_questions


# In-memory session store: session_id -> InterviewSession
_SESSIONS: Dict[str, InterviewSession] = {}


def _get_session(session_id: str) -> InterviewSession:
    session = _SESSIONS.get(session_id)
    if session is None:
        raise InterviewSessionNotFound(f"No interview session with id {session_id}")
    return session


async def start_interview(request: StartInterviewRequest) -> StartInterviewResponse:
    session = InterviewSession(request)
    session.current_question_number = 1

    question_text = await interview_ai.generate_question(
        target_role=session.target_role,
        interview_type=session.interview_type,
        question_number=1,
        total_questions=session.total_questions,
        candidate_context=session.candidate_context,
        previous_qa=[],
        field=session.field,
    )
    session.current_question_text = question_text
    _SESSIONS[session.session_id] = session

    return StartInterviewResponse(
        session_id=session.session_id,
        first_question=QuestionPayload(
            question_number=1,
            question=question_text,
            interview_type=session.interview_type,
        ),
        total_questions=session.total_questions,
    )


async def submit_answer(request: SubmitAnswerRequest) -> SubmitAnswerResponse:
    session = _get_session(request.session_id)
    if session.current_question_text is None:
        raise InterviewAIError("Session has no active question to answer")

    evaluation = await interview_ai.evaluate_answer(
        target_role=session.target_role,
        interview_type=session.interview_type,
        question=session.current_question_text,
        answer=request.answer,
        candidate_context=session.candidate_context,
        field=session.field,
    )

    session.qa_history.append(
        {
            "question": session.current_question_text,
            "answer": request.answer,
            "evaluation": evaluation,
        }
    )

    if session.is_complete:
        session.current_question_text = None
        return SubmitAnswerResponse(
            session_id=session.session_id,
            evaluation=evaluation,
            next_question=None,
            is_complete=True,
        )

    session.current_question_number += 1
    next_question_text = await interview_ai.generate_question(
        target_role=session.target_role,
        interview_type=session.interview_type,
        question_number=session.current_question_number,
        total_questions=session.total_questions,
        candidate_context=session.candidate_context,
        previous_qa=[
            {"question": qa["question"], "answer": qa["answer"]}
            for qa in session.qa_history
        ],
        field=session.field,
    )
    session.current_question_text = next_question_text

    return SubmitAnswerResponse(
        session_id=session.session_id,
        evaluation=evaluation,
        next_question=QuestionPayload(
            question_number=session.current_question_number,
            question=next_question_text,
            interview_type=session.interview_type,
        ),
        is_complete=False,
    )


def _average(values: List[int]) -> int:
    return round(sum(values) / len(values)) if values else 0


def _dedupe_top(items: List[str], limit: int = 5) -> List[str]:
    seen: List[str] = []
    for item in items:
        if item not in seen:
            seen.append(item)
        if len(seen) >= limit:
            break
    return seen


def _basic_recommendations(evaluations: List[AnswerEvaluation]) -> List[str]:
    """
    Deterministic recommendation logic based on the two weakest average
    dimensions. Simple on purpose — this can feed into the Priority 5
    Career Readiness Score later without changing the report contract.
    """
    dims = {
        "communication": _average([e.communication for e in evaluations]),
        "technical_accuracy": _average([e.technical_accuracy for e in evaluations]),
        "relevance": _average([e.relevance for e in evaluations]),
        "structure": _average([e.structure for e in evaluations]),
        "confidence": _average([e.confidence for e in evaluations]),
    }
    weakest = sorted(dims.items(), key=lambda kv: kv[1])[:2]

    tips = {
        "communication": "Practice explaining your answers more clearly and concisely.",
        "technical_accuracy": "Review core technical concepts for your target role before your next mock interview.",
        "relevance": "Focus answers more directly on what the question is actually asking.",
        "structure": "Use a framework like STAR (Situation, Task, Action, Result) to structure answers.",
        "confidence": "Practice answering out loud to build comfort and reduce hesitation.",
    }
    return [tips[dim] for dim, _ in weakest]


def _consistency_score(overall_scores: List[int]) -> int:
    """
    Consistency isn't scored per-answer by the AI, so we derive it
    deterministically from how much the candidate's overall_score swings
    across questions. Low variance -> steady performance -> high consistency.

    stdev is mapped onto a 0-100 scale where a stdev of 0 (identical scores
    every question) = 100, and a stdev of 40+ points (wildly inconsistent
    performance) floors out at 0. One answer alone can't show consistency,
    so a single-question session defaults to a neutral 70.
    """
    if len(overall_scores) < 2:
        return 70
    stdev = statistics.pstdev(overall_scores)
    score = 100 - (stdev / 40 * 100)
    return max(0, min(100, round(score)))


def compute_confidence_score(evaluations: List[AnswerEvaluation]) -> InterviewConfidenceScore:
    """
    Deterministic, explainable Interview Confidence Score (doc section 12).
    Every point in overall_confidence traces back to a weighted component
    below — the LLM never invents this number.
    """
    overall_scores = [e.overall_score for e in evaluations]

    dimension_scores = {
        "communication": _average([e.communication for e in evaluations]),
        "relevance": _average([e.relevance for e in evaluations]),
        "technical_accuracy": _average([e.technical_accuracy for e in evaluations]),
        "structure": _average([e.structure for e in evaluations]),
        "consistency": _consistency_score(overall_scores),
    }

    breakdown = []
    weighted_total = 0.0
    for dimension, weight in CONFIDENCE_WEIGHTS.items():
        raw = dimension_scores[dimension]
        contribution = round(raw * weight, 2)
        weighted_total += contribution
        breakdown.append(
            ConfidenceScoreBreakdown(
                dimension=dimension,
                raw_score=raw,
                weight_pct=round(weight * 100),
                weighted_contribution=contribution,
            )
        )

    all_strengths = [s for e in evaluations for s in e.strengths]
    all_weaknesses = [w for e in evaluations for w in e.weaknesses]
    weakest_two = sorted(dimension_scores.items(), key=lambda kv: kv[1])[:2]
    improvement_tips = {
        "communication": "Practice explaining your answers more clearly and concisely.",
        "technical_accuracy": "Review core technical concepts for your target role.",
        "relevance": "Focus answers more directly on what's actually being asked.",
        "structure": "Use a framework like STAR to structure your answers.",
        "consistency": "Aim for the same level of detail and confidence on every answer, not just the strong ones.",
    }

    return InterviewConfidenceScore(
        overall_confidence=round(weighted_total),
        breakdown=breakdown,
        strengths=_dedupe_top(all_strengths),
        weaknesses=_dedupe_top(all_weaknesses),
        recommended_improvements=[improvement_tips[dim] for dim, _ in weakest_two],
    )


def get_final_report(session_id: str) -> FinalInterviewReport:
    session = _get_session(session_id)
    if not session.qa_history:
        raise InterviewAIError("Cannot generate a report for a session with no answered questions")

    questions_report = [
        InterviewReportQuestion(
            question_number=i + 1,
            question=qa["question"],
            answer=qa["answer"],
            evaluation=qa["evaluation"],
        )
        for i, qa in enumerate(session.qa_history)
    ]

    evaluations: List[AnswerEvaluation] = [qa["evaluation"] for qa in session.qa_history]
    all_strengths = [s for e in evaluations for s in e.strengths]
    all_weaknesses = [w for e in evaluations for w in e.weaknesses]

    return FinalInterviewReport(
        session_id=session.session_id,
        target_role=session.target_role,
        interview_type=session.interview_type,
        questions=questions_report,
        average_overall_score=_average([e.overall_score for e in evaluations]),
        average_communication=_average([e.communication for e in evaluations]),
        average_technical_accuracy=_average([e.technical_accuracy for e in evaluations]),
        average_relevance=_average([e.relevance for e in evaluations]),
        average_structure=_average([e.structure for e in evaluations]),
        average_confidence=_average([e.confidence for e in evaluations]),
        top_strengths=_dedupe_top(all_strengths),
        top_weaknesses=_dedupe_top(all_weaknesses),
        recommendations=_basic_recommendations(evaluations),
        confidence_score=compute_confidence_score(evaluations),
    )


def get_confidence_score(session_id: str) -> InterviewConfidenceScore:
    """Standalone accessor for the dashboard 'Interview Confidence: 74/100' widget,
    for callers that just want the score without the full question-by-question report."""
    session = _get_session(session_id)
    if not session.qa_history:
        raise InterviewAIError("Cannot compute a confidence score for a session with no answered questions")
    evaluations = [qa["evaluation"] for qa in session.qa_history]
    return compute_confidence_score(evaluations)
