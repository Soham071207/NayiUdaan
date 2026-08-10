"""
Career Readiness Score service (Priority 5).

Combines signals from all three members into one explainable score:
- Member 1: resume_strength, skill_readiness (from resume_review / market)
- Member 2: employer_compatibility (from employer matching)
- Member 3: interview_performance, learning_progress, gap_preparedness

NOTE ON WEIGHTS: the doc explicitly says the exact weighting "should be
agreed upon before implementation" (section 14) — unlike the Interview
Confidence Score, no formula is given. DEFAULT_WEIGHTS below is a
reasonable placeholder split across the 6 components shown in the doc's
example dashboard (section 20). Confirm the real split with the team;
nothing else in this file depends on the specific numbers, so it's a
one-line change once you agree on it.

If some components aren't available yet (e.g. Member 1/2 integrations
aren't wired up during early hackathon dev), the score is computed from
whatever IS available, with weights renormalized across just those —
it never silently zeroes out the score for missing upstream data.
"""

from typing import Dict, List, Optional

from app.ai.interview_ai import InterviewAIError
from app.schemas.readiness import (
    CareerReadinessScore,
    ReadinessComponentBreakdown,
    ReadinessRequest,
)
from app.services import interview_service, learning_service
from app.services.interview_service import InterviewSessionNotFound
from app.services.learning_service import TrackerNotFound

DEFAULT_WEIGHTS: Dict[str, float] = {
    "resume_strength": 0.15,
    "skill_readiness": 0.20,
    "interview_performance": 0.20,
    "learning_progress": 0.15,
    "gap_preparedness": 0.15,
    "employer_compatibility": 0.15,
}

_COMPONENT_LABELS = {
    "resume_strength": "resume strength",
    "skill_readiness": "priority skill development",
    "interview_performance": "interview performance",
    "learning_progress": "learning progress",
    "gap_preparedness": "career-gap preparedness",
    "employer_compatibility": "employer compatibility",
}

_IMPROVEMENT_TIPS = {
    "resume_strength": "Tighten your resume's summary and keyword coverage for your target role.",
    "skill_readiness": "Focus your next study sessions on your priority skill gaps.",
    "interview_performance": "Run a few more mock interviews to build confidence and structure.",
    "learning_progress": "Pick up the pace on your roadmap tasks - a few more completions moves this a lot.",
    "gap_preparedness": "Practice your career-gap explanation until it feels natural, not rehearsed.",
    "employer_compatibility": "Look at roles with a closer skills match while you keep upskilling.",
}


def _resolve_components(request: ReadinessRequest) -> Dict[str, Optional[int]]:
    components = request.components

    interview_performance = components.interview_performance
    if interview_performance is None and request.interview_session_id:
        try:
            score = interview_service.get_confidence_score(request.interview_session_id)
            interview_performance = score.overall_confidence
        except (InterviewSessionNotFound, InterviewAIError):
            interview_performance = None

    learning_progress = components.learning_progress
    if learning_progress is None and request.learning_tracker_id:
        try:
            state = learning_service.get_tracker_state(request.learning_tracker_id)
            learning_progress = state.overall_progress
        except TrackerNotFound:
            learning_progress = None

    return {
        "resume_strength": components.resume_strength,
        "skill_readiness": components.skill_readiness,
        "interview_performance": interview_performance,
        "learning_progress": learning_progress,
        "gap_preparedness": components.gap_preparedness,
        "employer_compatibility": components.employer_compatibility,
    }


def compute_readiness_score(request: ReadinessRequest) -> CareerReadinessScore:
    resolved = _resolve_components(request)
    present = {k: v for k, v in resolved.items() if v is not None}
    missing = [k for k, v in resolved.items() if v is None]

    if not present:
        raise ValueError("At least one readiness component must be available to compute a score")

    present_weight_total = sum(DEFAULT_WEIGHTS[k] for k in present)

    breakdown: List[ReadinessComponentBreakdown] = []
    weighted_total = 0.0
    for component, raw_score in present.items():
        normalized_weight = DEFAULT_WEIGHTS[component] / present_weight_total
        contribution = round(raw_score * normalized_weight, 2)
        weighted_total += contribution
        breakdown.append(
            ReadinessComponentBreakdown(
                component=component,
                raw_score=raw_score,
                weight_pct=round(normalized_weight * 100),
                weighted_contribution=contribution,
            )
        )

    sorted_desc = sorted(breakdown, key=lambda b: b.raw_score, reverse=True)
    strongest = sorted_desc[0].component if sorted_desc else None
    remaining = [b for b in sorted_desc if b.component != strongest]
    weakest = [b.component for b in sorted(remaining, key=lambda b: b.raw_score)[:2]]

    overall = round(weighted_total)
    explanation = _build_explanation(overall, strongest, weakest, missing)
    recommendation = _IMPROVEMENT_TIPS.get(weakest[0]) if weakest else (
        _IMPROVEMENT_TIPS.get(strongest, "") if strongest else ""
    )

    return CareerReadinessScore(
        overall_readiness=overall,
        breakdown=breakdown,
        missing_components=missing,
        strongest_area=_COMPONENT_LABELS.get(strongest) if strongest else None,
        weakest_areas=[_COMPONENT_LABELS[w] for w in weakest],
        explanation=explanation,
        recommendation=recommendation,
    )


def _build_explanation(
    overall: int,
    strongest: Optional[str],
    weakest: List[str],
    missing: List[str],
) -> str:
    if overall >= 85:
        readiness_line = "The candidate is job-ready."
    elif overall >= 70:
        readiness_line = "The candidate is close to being job-ready."
    elif overall >= 50:
        readiness_line = "The candidate is making solid progress but has some gaps to close."
    else:
        readiness_line = "The candidate is early in their readiness journey."

    if strongest and weakest:
        weakest_joined = " and ".join(_COMPONENT_LABELS[w] for w in weakest)
        verb = "needs" if len(weakest) == 1 else "need"
        explanation = (
            f"{readiness_line} Their strongest area is {_COMPONENT_LABELS[strongest]}, "
            f"while {weakest_joined} {verb} further improvement."
        )
    elif strongest:
        explanation = f"{readiness_line} Score is currently based only on {_COMPONENT_LABELS[strongest]}."
    else:
        explanation = readiness_line

    if missing:
        missing_labels = ", ".join(_COMPONENT_LABELS[m] for m in missing)
        explanation += f" (Score excludes {missing_labels}, which isn't available yet.)"

    return explanation
