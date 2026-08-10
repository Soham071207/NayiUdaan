"""
AI layer for the Career Gap Explanation Generator.

Only place that calls the LLM for this feature. Uses the shared
utils/llm_client so it stays decoupled from interview_ai.py — this feature
has nothing to do with the interview engine, it just happens to live in
the same career_coach module.
"""

from app.schemas.gap_coach import GapCoachRequest, GapExplanationSet
from app.ai.async_llm_client import call_llm_json, LLMClientError


class GapCoachAIError(Exception):
    """Raised when the AI layer cannot produce a usable structured result."""


async def generate_gap_explanations(request: GapCoachRequest) -> GapExplanationSet:
    system_prompt = (
        "You are a career coach at NayiUdaan helping women confidently explain "
        "a career break (maternity, caregiving, marriage relocation, or other "
        "personal reasons) to employers. Your job is NOT to hide or minimize the "
        "gap — it is to help the candidate own it honestly, frame it professionally, "
        "and connect it back to their readiness for the target role. "
        "Never suggest lying, fabricating employment, or fabricating a cover story. "
        'Respond ONLY with a JSON object with exactly these keys: '
        '{"short_explanation": "...", "detailed_explanation": "...", '
        '"interview_answer": "...", "professional_version": "..."}. '
        "No preamble, no markdown."
    )

    reason_line = (
        f"Reason shared by candidate: {request.reason}"
        if request.reason else "No specific reason was shared by the candidate."
    )
    gap_line = (
        f"Career gap: approx. {request.gap_years} years"
        if request.gap_years is not None else "Career gap: duration not specified"
    )
    experience_line = (
        f"Prior experience: {request.experience_years} years"
        if request.experience_years is not None else ""
    )

    user_prompt = f"""
Previous role: {request.previous_role or "not specified"}
{experience_line}
{gap_line}
{reason_line}
Target role: {request.target_role}

Generate all four explanation variants:

1. short_explanation — 1-2 sentences, resume-summary style. Factual and confident.
2. detailed_explanation — a full paragraph suitable for a cover letter. Honest about
   the gap, but pivots quickly to what the candidate did to stay sharp or is doing
   now to prepare for {request.target_role}.
3. interview_answer — first-person, spoken register, as if answering
   "Can you walk me through your career break?" out loud in an interview.
   Should sound natural and confident, not rehearsed or defensive.
4. professional_version — LinkedIn "About" section style. Slightly more polished
   and forward-looking than the interview answer.

All four should be consistent with each other and never suggest hiding or
misrepresenting the gap.
""".strip()

    try:
        result = await call_llm_json(system_prompt, user_prompt)
    except LLMClientError as exc:
        raise GapCoachAIError(str(exc)) from exc

    try:
        return GapExplanationSet(**result)
    except Exception as exc:
        raise GapCoachAIError(f"AI gap-explanation response did not match schema: {exc}") from exc
