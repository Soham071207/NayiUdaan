"""
employer_service.py
----------------------------------------------------------------------
Employer Intelligence Orchestration Service

Coordinates the full employer-matching pipeline and exposes all the
higher-order intelligence features:

  1. get_matches()           — AI-scored, ranked employer matches
  2. get_employer_detail()   — Single employer profile
  3. get_all()               — Full dataset (no scoring)
  4. get_stats()             — Aggregate statistics
  5. get_interview_prep()    — Company-specific interview coaching
  6. get_application_priority() — AI-powered "apply to these first" ranker
  7. get_returnship_readiness() — Readiness score + prep timeline
  8. get_skill_gap()         — Skill gap analysis vs a specific employer
  9. get_skill_drift()       — Detect drifted/stale skills
----------------------------------------------------------------------
"""

from typing import List, Optional

from app.ai.employer_compatibility import (
    EmployerCompatibility,
    get_all_employers,
    get_employer_by_id,
)
from app.ai.interview_coach import InterviewCoach
from app.ai.returnship_discovery import ReturnshipReadiness
from app.ai.skill_analyzer import SkillAnalyzer
from app.ai.llm_client import LLMClient
import json


class EmployerService:
    """Orchestrates all employer intelligence features."""

    def __init__(self):
        self._ai = EmployerCompatibility()
        self._coach = InterviewCoach()
        self._readiness = ReturnshipReadiness()
        self._skill_ai = SkillAnalyzer()
        self._llm = LLMClient()

    # ------------------------------------------------------------------
    # 1. Employer Matches
    # ------------------------------------------------------------------
    def get_matches(
        self,
        candidate_input: dict,
        top_n: int = 10,
    ) -> List[dict]:
        """
        Return top_n employers ranked by AI compatibility score.
        Each result merges the full employer profile with AI analysis fields.
        """
        employers = get_all_employers()
        analyses: List[dict] = self._ai.analyze_batch(
            candidate=candidate_input,
            employers=employers,
            top_n=top_n,
        )

        results = []
        for analysis in analyses:
            employer = get_employer_by_id(analysis["employer_id"])
            if not employer:
                continue
            merged = {**employer, **analysis}
            results.append(merged)

        return results

    # ------------------------------------------------------------------
    # 2. Single Employer Detail
    # ------------------------------------------------------------------
    def get_employer_detail(self, employer_id: str) -> Optional[dict]:
        return get_employer_by_id(employer_id)

    # ------------------------------------------------------------------
    # 3. All Employers (no scoring)
    # ------------------------------------------------------------------
    def get_all(self) -> List[dict]:
        return get_all_employers()

    # ------------------------------------------------------------------
    # 4. Dataset Statistics
    # ------------------------------------------------------------------
    def get_stats(self) -> dict:
        employers = get_all_employers()
        returnship_companies = [e for e in employers if e.get("hasReturnship")]
        all_locations: List[str] = []
        for e in employers:
            all_locations.extend(e.get("locations", []))
        all_locations = [loc for loc in all_locations if loc.lower() != "remote"]

        conversion_rates = [
            e["returnshipConversionRate"]
            for e in returnship_companies
            if e.get("returnshipConversionRate")
        ]
        total_open_roles = sum(len(e.get("openRoles", [])) for e in employers)
        industries = sorted({e["industry"] for e in employers})

        location_counts: dict = {}
        for loc in all_locations:
            location_counts[loc] = location_counts.get(loc, 0) + 1
        top_locations = sorted(location_counts, key=lambda l: -location_counts[l])[:5]

        avg_conversion = (
            round(sum(conversion_rates) / len(conversion_rates), 1)
            if conversion_rates else 0
        )

        return {
            "total_employers": len(employers),
            "returnship_employers": len(returnship_companies),
            "total_open_roles": total_open_roles,
            "avg_returnship_conversion_rate": avg_conversion,
            "top_locations": top_locations,
            "industries": industries,
        }

    # ------------------------------------------------------------------
    # 5. Interview Prep Coach
    # ------------------------------------------------------------------
    def get_interview_prep(self, candidate: dict, employer_id: str) -> dict:
        """
        Generate a company-specific interview preparation guide.
        """
        return self._coach.prepare(candidate=candidate, employer_id=employer_id)

    # ------------------------------------------------------------------
    # 6. Application Priority Ranker
    # ------------------------------------------------------------------
    def get_application_priority(
        self,
        candidate: dict,
        top_n: int = 10,
        precomputed_matches: Optional[List[dict]] = None
    ) -> dict:
        """
        AI-powered application strategy: given a candidate, return a
        prioritised order for applying to the top N matched employers,
        with a rationale for each position and an overall strategy.

        Returns:
            {
                "strategy_summary": "...",
                "priority_order": [
                    {
                        "rank": 1,
                        "employer_id": "adobe",
                        "employer_name": "Adobe",
                        "why_first": "...",
                        "apply_by": "This week",
                        "key_action_before_applying": "..."
                    }, ...
                ],
                "overall_tips": [...]
            }
        """
        # First get the ranked matches (use precomputed if provided)
        matches = precomputed_matches if precomputed_matches is not None else self.get_matches(candidate, top_n=top_n)

        if not matches:
            return {"error": "No employer matches found"}

        # Attempt AI priority analysis
        try:
            result = self._ai_priority(candidate, matches)
        except Exception:
            result = None

        if not result:
            result = self._rule_based_priority(candidate, matches)

        return result

    def _ai_priority(self, candidate: dict, matches: List[dict]) -> Optional[dict]:
        compact_matches = [
            {
                "employer_id": m["id"],
                "name": m["name"],
                "compatibility_score": m.get("compatibility_score", 0),
                "match_reasons": m.get("match_reasons", []),
                "gap_areas": m.get("gap_areas", []),
                "hasReturnship": m.get("hasReturnship", False),
                "returnshipConversionRate": m.get("returnshipConversionRate"),
                "openRoles": m.get("openRoles", [])[:3],
            }
            for m in matches
        ]

        prompt = f"""
You are a Career Strategist helping a woman return to work after a career break.

Given this candidate's profile and their ranked employer matches, determine the OPTIMAL
application order and strategy.

=== CANDIDATE ===
{json.dumps(candidate, indent=2)}

=== RANKED EMPLOYER MATCHES ===
{json.dumps(compact_matches, indent=2)}

Return ONLY valid JSON:
{{
  "strategy_summary": "<2-3 sentence executive summary of the recommended application strategy>",
  "priority_order": [
    {{
      "rank": <integer starting from 1>,
      "employer_id": "<must match an employer_id from the list>",
      "employer_name": "<company name>",
      "why_first": "<specific reason why this rank — reference the candidate's profile>",
      "apply_by": "<Immediately | This week | Week 2 | Week 3>",
      "key_action_before_applying": "<one specific thing to do before submitting this application>"
    }}
  ],
  "overall_tips": [
    "<3-4 strategic tips specific to this candidate's situation>"
  ]
}}

Priority reasoning guidelines:
- Returnship programmes with high conversion rates + strong skill match → top priority
- Companies where the gap is well within their accepted limit → higher priority
- Culture-fit alignment → bonus for candidates with specific work-mode preferences
- Apply to 2-3 companies in the same week, not all at once — quality > quantity
- Return ONLY the JSON. No markdown fences.
"""
        raw = self._llm.ask(prompt)
        raw = raw.replace("```json", "").replace("```", "").strip()
        start, end = raw.find("{"), raw.rfind("}")
        if start == -1 or end == -1:
            return None

        parsed = json.loads(raw[start: end + 1])
        parsed["analysis_method"] = "ai"
        return parsed

    def _rule_based_priority(self, candidate: dict, matches: List[dict]) -> dict:
        gap = float(candidate.get("career_gap_years", 0) or 0)

        # Sort by: returnship companies with high conversion first, then score
        def _priority_key(m):
            returnship_bonus = m.get("returnshipConversionRate", 0) if m.get("hasReturnship") else 0
            gap_fits = 10 if gap <= m.get("maxGapYearsAccepted", 0) else 0
            return m.get("compatibility_score", 0) + returnship_bonus * 0.3 + gap_fits

        sorted_matches = sorted(matches, key=_priority_key, reverse=True)

        timing_labels = ["Immediately", "This week", "This week", "Week 2", "Week 2",
                         "Week 3", "Week 3", "Week 3", "Week 4", "Week 4"]

        priority_order = [
            {
                "rank": i + 1,
                "employer_id": m["id"],
                "employer_name": m["name"],
                "why_first": (
                    f"Compatibility score {m.get('compatibility_score', 0)}/100"
                    + (f" with {m.get('returnshipConversionRate')}% returnship conversion rate" if m.get("hasReturnship") else "")
                    + (" — your gap fits their acceptance window" if gap <= m.get("maxGapYearsAccepted", 0) else "")
                ),
                "apply_by": timing_labels[i] if i < len(timing_labels) else "Week 4",
                "key_action_before_applying": (
                    f"Research '{m.get('returnshipProgramName', 'their programme')}' in detail and reference it in your cover letter"
                    if m.get("hasReturnship")
                    else "Tailor your resume to highlight skills matching their tech stack"
                ),
            }
            for i, m in enumerate(sorted_matches)
        ]

        return {
            "strategy_summary": (
                "Focus your first applications on returnship programmes with high conversion rates "
                f"where your {gap:.1f}-year gap falls within the accepted window. "
                "Apply to 2-3 companies per week to maintain quality while building momentum."
            ),
            "priority_order": priority_order,
            "overall_tips": [
                "Customise your cover letter for each company — a generic letter is immediately spotted",
                "Apply to returnship programmes AND direct roles simultaneously for maximum coverage",
                "Follow up 7 days after submission if you haven't heard back — polite persistence works",
                "Track every application in a spreadsheet with dates, contacts, and next steps",
            ],
            "analysis_method": "rule_based",
        }

    # ------------------------------------------------------------------
    # 7. Returnship Readiness
    # ------------------------------------------------------------------
    def get_returnship_readiness(self, candidate: dict) -> dict:
        return self._readiness.assess(candidate)

    # ------------------------------------------------------------------
    # 8. Skill Gap vs Employer
    # ------------------------------------------------------------------
    def get_skill_gap(self, candidate: dict, employer_id: str) -> dict:
        employer = get_employer_by_id(employer_id)
        if not employer:
            return {"error": f"Employer '{employer_id}' not found"}
        return self._skill_ai.analyze_gap(candidate, employer)

    # ------------------------------------------------------------------
    # 9. Skill Drift Detection
    # ------------------------------------------------------------------
    def get_skill_drift(self, candidate: dict) -> dict:
        return self._skill_ai.detect_drift(candidate)
