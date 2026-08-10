"""
Career Gap Coach service.

Unlike the interview engine, this feature is stateless — no session to
track, just request in, structured explanation set out. The service layer
still exists (rather than calling the AI module straight from the route)
to keep the same Route -> Service -> AI pattern as the rest of career_coach,
and to leave room for future additions (e.g. caching, logging which
explanation the candidate actually used).
"""

from app.ai.gap_coach_ai import generate_gap_explanations
from app.schemas.gap_coach import GapCoachRequest, GapCoachResponse


async def get_gap_explanations(request: GapCoachRequest) -> GapCoachResponse:
    explanations = await generate_gap_explanations(request)
    return GapCoachResponse(
        target_role=request.target_role,
        gap_years=request.gap_years,
        explanations=explanations,
    )
