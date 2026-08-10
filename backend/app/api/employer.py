"""
api/employer.py
----------------------------------------------------------------------
Employer Intelligence API Routes

Endpoints:
    GET  /employers/matches              — AI-ranked employer matches (query params)
    POST /employers/matches              — AI-ranked employer matches (JSON body)
    GET  /employers                      — List all employers (no AI scoring)
    GET  /employers/stats                — Aggregate dataset statistics
    GET  /employers/readiness            — Returnship readiness score + prep timeline
    GET  /employers/skill-drift          — Detect stale/drifted skills
    GET  /employers/apply-strategy       — AI application priority ranker
    GET  /employers/{id}                 — Full profile for a single employer
    GET  /employers/{id}/interview-prep  — Company-specific interview coaching
    GET  /employers/{id}/skill-gap       — Skill gap analysis vs this employer
----------------------------------------------------------------------
"""

from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from app.services.employer_service import EmployerService

router = APIRouter(prefix="/employers", tags=["Employer Intelligence"])

_service = EmployerService()


# ---------------------------------------------------------------------------
# Shared request / inline schemas
# ---------------------------------------------------------------------------

class CandidateMatchRequest(BaseModel):
    """Body for POST /employers/matches."""
    previous_role: str = Field(..., examples=["Software Engineer"])
    skills: List[str] = Field(default_factory=list, examples=[["Python", "SQL", "AWS"]])
    career_gap_years: float = Field(..., ge=0, examples=[2.5])
    preferred_work_mode: str = Field("Any", examples=["Hybrid"])
    preferred_location: str = Field("Any", examples=["Bengaluru"])
    target_role: str = Field("", examples=["Data Analyst"])
    top_n: int = Field(10, ge=1, le=15)


class CandidateProfileRequest(BaseModel):
    """Generic candidate body used by several endpoints."""
    previous_role: str = Field("", examples=["Software Engineer"])
    skills: List[str] = Field(default_factory=list, examples=[["Python", "SQL"]])
    career_gap_years: float = Field(0, ge=0, examples=[2.5])
    target_role: str = Field("", examples=["Data Analyst"])
    certifications: List[dict] = Field(default_factory=list)
    education: List[dict] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# Helper: build candidate dict from query params
# ---------------------------------------------------------------------------
def _candidate_from_params(
    previous_role: str,
    skills: List[str],
    career_gap_years: float,
    preferred_work_mode: str = "Any",
    preferred_location: str = "Any",
    target_role: str = "",
) -> dict:
    return {
        "previous_role": previous_role,
        "skills": skills,
        "career_gap_years": career_gap_years,
        "preferred_work_mode": preferred_work_mode,
        "preferred_location": preferred_location,
        "target_role": target_role,
    }


# ===========================================================================
# ROUTES
# ===========================================================================

# ─── 1. AI Employer Matches (GET) ──────────────────────────────────────────

@router.get(
    "/matches",
    summary="AI-powered employer matches for a candidate (GET)",
    description=(
        "Runs AI compatibility analysis for all employers against the given "
        "candidate profile and returns the top N results ranked by score. "
        "Each result contains the full employer profile plus AI-generated "
        "match_reasons, gap_areas, culture_fit, recommended_roles, and "
        "interview_tips. Falls back to rule-based scoring if the LLM is "
        "unavailable."
    ),
)
def get_employer_matches(
    previous_role: str = Query(..., description="Candidate's most recent job title"),
    skills: List[str] = Query(
        default_factory=list,
        description="Repeat per skill: ?skills=Python&skills=SQL",
    ),
    career_gap_years: float = Query(..., ge=0, description="Career break length in years"),
    preferred_work_mode: str = Query("Any", description="Remote | Hybrid | Onsite | Any"),
    preferred_location: str = Query("Any", description="Preferred city, or 'Any'"),
    target_role: str = Query("", description="Role the candidate wants to move into"),
    top_n: int = Query(10, ge=1, le=15, description="Number of top matches to return"),
):
    candidate = _candidate_from_params(
        previous_role, skills, career_gap_years,
        preferred_work_mode, preferred_location, target_role,
    )
    results = _service.get_matches(candidate, top_n=top_n)
    return {
        "success": True,
        "candidate_summary": candidate,
        "total_results": len(results),
        "employers": results,
    }


# ─── 2. AI Employer Matches (POST) ─────────────────────────────────────────

@router.post(
    "/matches",
    summary="AI-powered employer matches for a candidate (POST)",
)
def post_employer_matches(request: CandidateMatchRequest):
    candidate = request.model_dump(exclude={"top_n"})
    results = _service.get_matches(candidate, top_n=request.top_n)
    return {
        "success": True,
        "candidate_summary": candidate,
        "total_results": len(results),
        "employers": results,
    }


# ─── 3. Returnship Readiness ───────────────────────────────────────────────

@router.get(
    "/readiness",
    summary="Returnship readiness score + personalised prep timeline",
    description=(
        "Assesses how prepared the candidate is for a returnship right now "
        "(0-100 score, tier label) and generates a week-by-week preparation "
        "timeline to close any gaps."
    ),
)
def get_readiness(
    previous_role: str = Query(..., description="Candidate's most recent job title"),
    skills: List[str] = Query(default_factory=list),
    career_gap_years: float = Query(..., ge=0),
    target_role: str = Query(""),
):
    candidate = {
        "previous_role": previous_role,
        "skills": skills,
        "career_gap_years": career_gap_years,
        "target_role": target_role,
    }
    result = _service.get_returnship_readiness(candidate)
    return {"success": True, **result}


@router.post(
    "/readiness",
    summary="Returnship readiness (POST — for richer candidate profiles)",
)
def post_readiness(request: CandidateProfileRequest):
    result = _service.get_returnship_readiness(request.model_dump())
    return {"success": True, **result}


# ─── 4. Skill Drift Detection ──────────────────────────────────────────────

@router.get(
    "/skill-drift",
    summary="Detect which skills have drifted/become stale during the career break",
    description=(
        "Identifies technologies in the candidate's skill set that have changed "
        "significantly since they last used them, with specific 'what changed' "
        "descriptions and modernisation tips."
    ),
)
def get_skill_drift(
    previous_role: str = Query(""),
    skills: List[str] = Query(default_factory=list),
    career_gap_years: float = Query(..., ge=0),
):
    candidate = {
        "previous_role": previous_role,
        "skills": skills,
        "career_gap_years": career_gap_years,
    }
    result = _service.get_skill_drift(candidate)
    return {"success": True, **result}


# ─── 5. Application Priority Ranker ───────────────────────────────────────

@router.get(
    "/apply-strategy",
    summary="AI-powered application priority ranker — which employers to apply to first",
    description=(
        "Analyses all employer matches and returns a prioritised application "
        "strategy: which company to apply to first, when to apply, and what "
        "to do before submitting each application. Includes an overall strategy summary."
    ),
)
def get_application_strategy(
    previous_role: str = Query(...),
    skills: List[str] = Query(default_factory=list),
    career_gap_years: float = Query(..., ge=0),
    preferred_work_mode: str = Query("Any"),
    preferred_location: str = Query("Any"),
    target_role: str = Query(""),
    top_n: int = Query(8, ge=1, le=15),
):
    candidate = _candidate_from_params(
        previous_role, skills, career_gap_years,
        preferred_work_mode, preferred_location, target_role,
    )
    result = _service.get_application_priority(candidate, top_n=top_n)
    return {"success": True, **result}


# ─── 6. Stats ──────────────────────────────────────────────────────────────

@router.get(
    "/stats",
    summary="Aggregate statistics across all employers in the dataset",
)
def get_employer_stats():
    return _service.get_stats()


# ─── 7. All Employers (no scoring) ────────────────────────────────────────

@router.get(
    "",
    summary="List all employers (no AI scoring)",
)
def list_employers():
    employers = _service.get_all()
    return {"success": True, "total": len(employers), "employers": employers}


# ─── 8. Single Employer Detail ────────────────────────────────────────────

@router.get(
    "/{employer_id}",
    summary="Get full profile for a single employer",
)
def get_employer(employer_id: str):
    employer = _service.get_employer_detail(employer_id)
    if not employer:
        raise HTTPException(
            status_code=404,
            detail=f"Employer '{employer_id}' not found. Use GET /employers for all valid IDs.",
        )
    return {"success": True, "employer": employer}


# ─── 9. Interview Prep Coach ──────────────────────────────────────────────

@router.get(
    "/{employer_id}/interview-prep",
    summary="Company-specific interview coaching for this employer",
    description=(
        "Generates a personalised interview prep guide: culture snapshot, "
        "a scripted gap-framing statement, 6 likely questions with tips, "
        "4 smart questions to ask the interviewer, red flags to avoid, "
        "and a confidence booster."
    ),
)
def get_interview_prep(
    employer_id: str,
    previous_role: str = Query(...),
    skills: List[str] = Query(default_factory=list),
    career_gap_years: float = Query(..., ge=0),
    target_role: str = Query(""),
):
    candidate = {
        "previous_role": previous_role,
        "skills": skills,
        "career_gap_years": career_gap_years,
        "target_role": target_role,
    }
    result = _service.get_interview_prep(candidate, employer_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return {"success": True, **result}


# ─── 10. Skill Gap vs Employer ────────────────────────────────────────────

@router.get(
    "/{employer_id}/skill-gap",
    summary="Skill gap analysis between the candidate and this employer's tech stack",
    description=(
        "Uses taxonomy-expanded matching to identify which of the employer's "
        "required skills the candidate covers, which are missing, and the "
        "fastest learning path to close critical gaps."
    ),
)
def get_skill_gap(
    employer_id: str,
    skills: List[str] = Query(default_factory=list),
    previous_role: str = Query(""),
):
    candidate = {"skills": skills, "previous_role": previous_role}
    result = _service.get_skill_gap(candidate, employer_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return {"success": True, **result}
