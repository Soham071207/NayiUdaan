"""
returnship_readiness.py
----------------------------------------------------------------------
Returnship Readiness Analyser

Assesses how prepared a candidate is to successfully enter a
returnship programme RIGHT NOW, and generates a personalised
week-by-week preparation timeline to close any gaps.

Output schema:
  {
    "readiness_score": 72,          # 0-100
    "readiness_tier": "Ready",      # Not Ready | Needs Prep | Ready | Highly Ready
    "strengths": [...],             # What's working in their favour
    "quick_wins": [...],            # Things to do in <1 week for max impact
    "preparation_timeline": [       # Week-by-week plan
      {
        "week": 1,
        "focus": "Resume & LinkedIn refresh",
        "actions": ["Update LinkedIn headline", "Add recent certifications"],
        "goal": "Be application-ready by end of week"
      }
    ],
    "estimated_ready_date": "2 weeks",
    "overall_advice": "..."
  }
----------------------------------------------------------------------
"""

import json
import logging
from typing import List, Optional

from app.ai.llm_client import LLMClient, extract_json_object
from app.ai.skill_taxonomy import expand_skills, find_skill_gaps, match_score

logger = logging.getLogger(__name__)


# Domains with rapidly shifting tech landscapes — candidates here may need
# more preparation time after a gap.
_HIGH_DRIFT_INDUSTRIES = {
    "software engineer", "data scientist", "ml engineer", "ai engineer",
    "devops", "cloud engineer", "frontend developer", "backend developer",
    "full stack", "mobile developer",
}


def _is_high_drift_role(role: str) -> bool:
    role_lower = role.lower()
    return any(kw in role_lower for kw in _HIGH_DRIFT_INDUSTRIES)


class ReturnshipReadiness:
    """
    Analyses returnship readiness for a candidate and generates a
    personalised preparation timeline.
    """

    def __init__(self):
        self.llm = LLMClient()

    def assess(self, candidate: dict) -> dict:
        """
        Assess readiness and generate a preparation plan.

        candidate keys:
            previous_role       str
            skills              list[str]
            career_gap_years    float
            target_role         str (optional)
            certifications      list[dict] (optional, from resume parse)
            education           list[dict] (optional)
        """
        try:
            result = self._ai_assess(candidate)
        except Exception as e:
            logger.warning("returnship_readiness: AI path failed (%s), using rule-based fallback", e)
            result = None

        if not result:
            result = self._rule_based_assess(candidate)

        return result

    # ------------------------------------------------------------------
    # AI path
    # ------------------------------------------------------------------
    def _ai_assess(self, candidate: dict) -> Optional[dict]:
        gap = float(candidate.get("career_gap_years", 0) or 0)
        # Compute a human-readable approximate year rather than embedding arithmetic in the prompt
        approx_last_year = max(2019, 2026 - int(gap))

        SYSTEM = (
            "You are a Returnship Readiness Expert who evaluates how prepared a woman is to "
            "successfully re-enter the workforce after a career break. "
            "Always respond with valid JSON only — no prose, no markdown fences."
        )

        prompt = f"""Assess this candidate's returnship readiness and create a personalised prep plan.

CANDIDATE:
{json.dumps(candidate, indent=2)}

Context: The candidate last worked around {approx_last_year}. Identify what may have changed in 
their field since then and tailor the preparation plan accordingly.

Return a JSON object with these EXACT keys:
- readiness_score (integer 0-100)
- readiness_tier (one of: Not Ready | Needs Prep | Ready | Highly Ready)
- strengths (array of 2-4 genuine strength strings)
- quick_wins (array of 3-5 high-impact actions completable in under 1 week)
- preparation_timeline (array of exactly 4 objects, each with: week int, focus str, actions array, goal str)
- estimated_ready_date (one of: Immediately | 1 week | 2-3 weeks | 4-6 weeks)
- skill_modernisation_tips (array of 2-3 specific, actionable strings)
- overall_advice (2-3 sentence string of powerful, specific advice)

Scoring guide:
  90-100: Highly Ready — skills current, gap <1yr, strong profile
  70-89:  Ready — solid foundation, minor work needed
  50-69:  Needs Prep — good base but 2-4 weeks effort required
  0-49:   Not Ready — significant refresh needed

All advice must be specific to THIS candidate's role, skills, and gap length."""

        raw = self.llm.ask(prompt, system=SYSTEM, temperature=0.3)
        try:
            parsed = extract_json_object(raw)
        except (ValueError, Exception) as e:
            logger.warning("returnship_readiness: JSON extraction failed: %s", e)
            return None

        # Validate and clamp score
        score = parsed.get("readiness_score")
        if not isinstance(score, (int, float)):
            logger.warning("returnship_readiness: missing or invalid readiness_score")
            return None
        parsed["readiness_score"] = max(0, min(100, int(score)))
        parsed["analysis_method"] = "ai"
        return parsed

    # ------------------------------------------------------------------
    # Rule-based fallback
    # ------------------------------------------------------------------
    def _rule_based_assess(self, candidate: dict) -> dict:
        gap = float(candidate.get("career_gap_years", 0) or 0)
        skills: List[str] = candidate.get("skills") or []
        role = candidate.get("previous_role", "")
        certifications = candidate.get("certifications") or []

        # ── Score components ──────────────────────────────────────────
        score = 0.0

        # Skills richness (0-40 pts)
        skill_score = min(len(skills) * 4, 40)
        score += skill_score

        # Gap penalty (0-20 pts, decays with gap)
        if gap == 0:
            score += 20
        elif gap <= 1:
            score += 18
        elif gap <= 2:
            score += 14
        elif gap <= 3:
            score += 10
        elif gap <= 5:
            score += 6
        else:
            score += 2

        # Certifications (0-20 pts)
        cert_score = min(len(certifications) * 7, 20)
        score += cert_score

        # High-drift role penalty applied after initial calc
        high_drift = _is_high_drift_role(role)
        if high_drift and gap > 2:
            score = max(score - 10, 0)

        # Education contribution (0-20 pts)
        education = candidate.get("education") or []
        if education:
            score += min(len(education) * 10, 20)

        score = min(round(score), 100)

        # Tier
        if score >= 90:
            tier = "Highly Ready"
            ready_date = "Immediately"
            weeks = 1
        elif score >= 70:
            tier = "Ready"
            ready_date = "1-2 weeks"
            weeks = 2
        elif score >= 50:
            tier = "Needs Prep"
            ready_date = "3-4 weeks"
            weeks = 4
        else:
            tier = "Not Ready"
            ready_date = "6-8 weeks"
            weeks = 4

        strengths = []
        if skills:
            strengths.append(f"Strong skill set with {len(skills)} documented technical skills")
        if gap <= 2:
            strengths.append("Recent industry experience — skills and context are largely current")
        if certifications:
            strengths.append(f"{len(certifications)} certification(s) demonstrate ongoing learning commitment")
        if not strengths:
            strengths.append("Professional experience and domain expertise that remain highly valuable")

        quick_wins = [
            "Update your LinkedIn headline to include your target role and 'Open to Returnship Opportunities'",
            "Add a 'Career Break' entry on LinkedIn with a brief, positive description of the period",
            "Refresh your resume: update the summary, add any recent learning, and remove roles older than 15 years",
            "Complete one free online course or certification in your target role's most in-demand skill",
            "Connect with 5 alumni or ex-colleagues on LinkedIn and let them know you're returning",
        ]

        timeline = [
            {
                "week": 1,
                "focus": "Profile & Presence",
                "actions": [
                    "Rewrite LinkedIn headline and summary for returnship positioning",
                    "Update resume with a confident career break statement",
                    "List 3 target companies and research their returnship programmes",
                ],
                "goal": "Have an application-ready resume and polished LinkedIn profile",
            },
            {
                "week": 2,
                "focus": "Skill Refresh",
                "actions": [
                    f"Complete a short course on the most in-demand skill for {role or 'your target role'}",
                    "Rebuild or update one portfolio project using current tools/frameworks",
                    "Join 2-3 relevant professional communities or alumni networks",
                ],
                "goal": "Have at least one current portfolio piece to reference in interviews",
            },
            {
                "week": 3,
                "focus": "Network & Outreach",
                "actions": [
                    "Reach out to 10 contacts with a personalised returnship message",
                    "Attend at least one virtual networking event or webinar in your field",
                    "Set up job alerts for returnship roles at target companies",
                ],
                "goal": "Have at least 3 active conversations with potential connectors",
            },
            {
                "week": 4,
                "focus": "Interview Readiness",
                "actions": [
                    "Practise the STAR method for 5 core behavioural questions",
                    "Write out and rehearse your career gap explanation (< 60 seconds)",
                    "Submit applications to your top 3 companies",
                ],
                "goal": "Submit first applications and be fully prepared for first-round calls",
            },
        ]

        skill_tips = [
            (
                "Cloud platforms evolve rapidly — spend 2 hours on the free tier of AWS/Azure/GCP "
                "to rebuild muscle memory with current console layouts and services"
                if high_drift
                else "Review any frameworks or tools in your stack that had major version releases in the last 2 years"
            ),
            "Check if any certifications you hold have expired or have newer versions — re-certifying signals commitment",
        ]

        return {
            "readiness_score": score,
            "readiness_tier": tier,
            "strengths": strengths[:4],
            "quick_wins": quick_wins,
            "preparation_timeline": timeline[:weeks] if weeks < 4 else timeline,
            "estimated_ready_date": ready_date,
            "skill_modernisation_tips": skill_tips,
            "overall_advice": (
                f"You have a solid foundation as a {role or 'professional'} and with "
                f"{'a modest' if gap <= 2 else 'some'} preparation you can position yourself "
                "confidently for returnship programmes. The most important thing is to own your "
                "career break as a feature of your story, not a bug — the best employers actively "
                "seek candidates with your kind of life experience."
            ),
            "analysis_method": "rule_based",
        }
