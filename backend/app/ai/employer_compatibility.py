"""
employer_compatibility.py
----------------------------------------------------------------------
AI-powered Employer Compatibility Analyser

Takes a candidate profile and a list of employers, then uses the LLM
to produce a structured, human-readable compatibility analysis for each
company — including a score, match reasons, gap areas, culture fit
assessment, role recommendations, and personalised interview tips.

Architecture decision:
    Rather than making N separate LLM calls (one per employer), we send
    a single *batch* prompt that contains the candidate profile and all
    employers. The LLM returns a ranked JSON array covering every
    employer in one shot. This keeps latency low and costs minimal for
    a hackathon / demo build.

    If the batch call fails (JSON parse error, timeout, etc.) the module
    transparently falls back to a fast, rule-based scorer so the API
    never returns an empty response.
----------------------------------------------------------------------
"""

import json
import logging
import os
from functools import lru_cache
from typing import List, Optional

from app.ai.llm_client import LLMClient, extract_json_array
from app.ai.skill_taxonomy import match_score, find_skill_gaps, expand_skills

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Dataset loader
# ---------------------------------------------------------------------------
_EMPLOYERS_JSON_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "datasets",
    "employers.json",
)


@lru_cache(maxsize=1)
def _load_employers() -> List[dict]:
    """Load and cache the employer dataset from disk."""
    with open(_EMPLOYERS_JSON_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def get_all_employers() -> List[dict]:
    return _load_employers()


def get_employer_by_id(employer_id: str) -> Optional[dict]:
    return next((e for e in get_all_employers() if e["id"] == employer_id), None)


# ---------------------------------------------------------------------------
# Rule-based fallback scorer
# ---------------------------------------------------------------------------
def _rule_based_score(candidate: dict, employer: dict) -> dict:
    """
    Fast, deterministic compatibility score used when the LLM is
    unavailable or returns invalid JSON. Produces the same output
    schema as the AI scorer so callers don't need to branch.
    """
    score = 0.0
    reasons: List[str] = []
    gap_areas: List[str] = []

    # 1. Career gap fit  (25 pts)
    gap_years = float(candidate.get("career_gap_years", 0) or 0)
    max_accepted = employer.get("maxGapYearsAccepted", 0)
    if gap_years <= max_accepted:
        score += 25
        reasons.append(
            f"Accepts career gaps up to {max_accepted} years "
            f"(your gap: {gap_years:.1f} yr{'s' if gap_years != 1 else ''})"
        )
    elif gap_years <= max_accepted + 2:
        score += 12
        gap_areas.append(
            f"Gap slightly above typical limit ({max_accepted} yr) — "
            "still worth applying given gap-friendly culture"
        )

    # 2. Returnship presence  (20 pts)
    if employer.get("hasReturnship"):
        score += 20
        reasons.append(
            f"Active '{employer['returnshipProgramName']}' returnship "
            f"with {employer.get('returnshipConversionRate', 0):.0f}% "
            "conversion to full-time"
        )

    # 3. Skill match  (25 pts) — taxonomy-expanded for high recall
    candidate_skills = candidate.get("skills") or []
    employer_stack = employer.get("techStack") or []
    if candidate_skills and employer_stack:
        ratio = match_score(candidate_skills, employer_stack)
        skill_pts = round(ratio * 25, 1)
        score += skill_pts
        # Show which raw skills matched using expanded sets
        expanded_candidate = expand_skills(candidate_skills)
        matched = [s for s in employer_stack if s.lower() in expanded_candidate]
        gaps = find_skill_gaps(candidate_skills, employer_stack)
        if matched:
            reasons.append(
                f"{len(matched)} skill(s) aligned with tech stack: "
                + ", ".join(matched[:4])
            )
        if gaps and ratio < 0.7:
            gap_areas.append("Consider building experience with: " + ", ".join(gaps[:3]))

    # 4. Work-mode preference  (15 pts)
    pref = (candidate.get("preferred_work_mode") or "Any").title()
    flex = employer.get("flexibleWork", {})
    if pref in ("", "Any"):
        score += 15
    elif pref == "Remote" and flex.get("remoteAvailable"):
        score += 15
        reasons.append("Remote work available as requested")
    elif pref == "Hybrid" and flex.get("hybridAvailable"):
        score += 15
        reasons.append("Hybrid work available as requested")
    elif pref == "Remote" and flex.get("hybridAvailable"):
        score += 8
        reasons.append("Hybrid available (closest to remote preference)")
    else:
        score += 8

    # 5. Location  (15 pts)
    pref_loc = (candidate.get("preferred_location") or "Any").strip()
    locations_lower = [loc.lower() for loc in employer.get("locations", [])]
    if not pref_loc or pref_loc.lower() == "any":
        score += 15
    elif pref_loc.lower() in locations_lower:
        score += 15
        reasons.append(f"Office in {pref_loc}")
    elif "remote" in locations_lower:
        score += 8
        reasons.append("Remote positions available from any city")

    score = min(round(score), 100)

    # Determine culture fit tier
    policies = employer.get("policies", {})
    wl_score = policies.get("womenLeadershipScore", 0)
    if wl_score >= 8.5:
        culture_fit = "Excellent"
    elif wl_score >= 7.5:
        culture_fit = "High"
    elif wl_score >= 6.5:
        culture_fit = "Moderate"
    else:
        culture_fit = "Low"

    # Recommended roles from openRoles list
    open_roles = employer.get("openRoles", [])

    # Basic interview tips
    interview_tips = [
        "Highlight achievements from before your career break — impact matters more than recency",
        "Address your career gap proactively and frame it as a period of growth",
    ]
    if employer.get("hasReturnship"):
        interview_tips.append(
            f"Mention your interest in the '{employer['returnshipProgramName']}' programme specifically"
        )

    return {
        "employer_id": employer["id"],
        "compatibility_score": score,
        "match_reasons": reasons or ["General career-gap-friendly employer"],
        "gap_areas": gap_areas,
        "culture_fit": culture_fit,
        "recommended_roles": open_roles[:3],
        "interview_tips": interview_tips,
        "confidence": 60,   # lower confidence for rule-based result
        "analysis_method": "rule_based",
    }


# ---------------------------------------------------------------------------
# AI batch analyser
# ---------------------------------------------------------------------------
class EmployerCompatibility:
    """
    AI-powered compatibility analyser.

    Public surface:
        analyze_batch(candidate, employers, top_n) -> list[dict]
            Returns top_n employers ranked by compatibility_score,
            each with a rich AI-generated analysis dict.
    """

    def __init__(self):
        self.llm = LLMClient()

    # ------------------------------------------------------------------
    # Public method
    # ------------------------------------------------------------------
    def analyze_batch(
        self,
        candidate: dict,
        employers: List[dict],
        top_n: int = 10,
    ) -> List[dict]:
        """
        Main entry point: run AI compatibility analysis for all employers
        and return the top_n ranked results.

        Falls back to rule-based scoring if the LLM call fails.
        """
        try:
            results = self._ai_analyze(candidate, employers)
        except Exception as e:
            logger.warning("employer_compatibility: AI path failed (%s), using rule-based fallback", e)
            results = None

        if not results:
            logger.info("employer_compatibility: running rule-based scorer for %d employers", len(employers))
            results = [_rule_based_score(candidate, emp) for emp in employers]

        results.sort(key=lambda r: r["compatibility_score"], reverse=True)
        return results[:top_n]

    # ------------------------------------------------------------------
    # Internal — AI path
    # ------------------------------------------------------------------
    def _ai_analyze(self, candidate: dict, employers: List[dict]) -> Optional[List[dict]]:
        """
        Single LLM batch call: send the candidate profile + all employers
        and receive a ranked JSON array of compatibility analyses.
        """
        employer_summaries = [
            {
                "id": e["id"],
                "name": e["name"],
                "industry": e["industry"],
                "description": e["description"],
                "hasReturnship": e.get("hasReturnship", False),
                "returnshipProgramName": e.get("returnshipProgramName"),
                "returnshipConversionRate": e.get("returnshipConversionRate"),
                "maxGapYearsAccepted": e.get("maxGapYearsAccepted"),
                "openRoles": e.get("openRoles", []),
                "techStack": e.get("techStack", []),
                "tags": e.get("tags", []),
                "womenLeadershipScore": e.get("policies", {}).get("womenLeadershipScore"),
                "womenInLeadershipPct": e.get("policies", {}).get("womenInLeadershipPct"),
                "childcareSupport": e.get("policies", {}).get("childcareSupport"),
                "remoteAvailable": e.get("flexibleWork", {}).get("remoteAvailable"),
                "hybridAvailable": e.get("flexibleWork", {}).get("hybridAvailable"),
                "locations": e.get("locations", []),
            }
            for e in employers
        ]

        SYSTEM = (
            "You are an expert Career Comeback Advisor specialising in helping women "
            "return to work after a career break. You analyse employer-candidate "
            "compatibility and always respond with valid JSON only — no prose, no fences."
        )

        prompt = f"""Analyse the compatibility between this candidate and each employer.

CANDIDATE:
{json.dumps(candidate, indent=2)}

EMPLOYERS:
{json.dumps(employer_summaries, indent=2)}

For EACH employer return a JSON object with these EXACT keys:
- employer_id (string, must match id exactly)
- compatibility_score (integer 0-100)
- match_reasons (array of 2-4 specific strings)
- gap_areas (array of 0-3 actionable strings)
- culture_fit (one of: Excellent | High | Moderate | Low)
- recommended_roles (array of 2-3 role title strings from openRoles)
- interview_tips (array of 2-3 specific strings)
- confidence (integer 0-100)

Scoring: weight skill alignment 30%, career-gap acceptance 25%, returnship quality 25%, culture 20%.
Be encouraging — frame gap_areas as opportunities, not criticisms.
CRITICAL RULE: If the candidate's career_gap_years is GREATER than the employer's maxGapYearsAccepted, you MUST heavily penalise the score (cap the score at 60).

Return a JSON ARRAY of objects, sorted descending by compatibility_score. No extra text."""

        raw = self.llm.ask(prompt, system=SYSTEM, temperature=0.2)
        parsed = extract_json_array(raw)

        if not isinstance(parsed, list) or not parsed:
            logger.warning("employer_compatibility: LLM returned empty or non-list JSON")
            return None

        # Validate each item has required fields + employer_id is known
        employer_ids = {e["id"] for e in employers}
        required_keys = {"employer_id", "compatibility_score", "match_reasons",
                         "gap_areas", "culture_fit", "recommended_roles",
                         "interview_tips", "confidence"}
        validated = []
        for item in parsed:
            if not isinstance(item, dict):
                continue
            if item.get("employer_id") not in employer_ids:
                logger.debug("employer_compatibility: unknown employer_id '%s' skipped", item.get("employer_id"))
                continue
            missing = required_keys - item.keys()
            if missing:
                logger.debug("employer_compatibility: item missing keys %s, skipping", missing)
                continue
            # Clamp score to valid range
            item["compatibility_score"] = max(0, min(100, int(item["compatibility_score"])))
            # Cap score manually if gap exceeds limit
            employer_data = next((e for e in employers if e["id"] == item["employer_id"]), None)
            if employer_data:
                max_gap = employer_data.get("maxGapYearsAccepted", 0)
                candidate_gap = float(candidate.get("career_gap_years", 0) or 0)
                if candidate_gap > max_gap:
                    item["compatibility_score"] = min(item["compatibility_score"], 60)
                    if "gap_areas" not in item:
                        item["gap_areas"] = []
                    item["gap_areas"].append(f"Note: Your {candidate_gap}-year gap exceeds their typical {max_gap}-year limit. Focus heavily on recent upskilling in your application.")

            item["analysis_method"] = "ai"
            validated.append(item)

        if not validated:
            logger.warning("employer_compatibility: no valid items after field validation")
            return None

        logger.info("employer_compatibility: AI analysis succeeded for %d/%d employers",
                    len(validated), len(employers))
        return validated
