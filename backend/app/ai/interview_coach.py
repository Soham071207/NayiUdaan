"""
interview_coach.py
----------------------------------------------------------------------
AI Interview Coach — Employer-Specific Interview Preparation

Takes a candidate profile + a specific employer and generates a
highly personalised, company-specific interview preparation guide:

  - Company culture insights relevant to returners
  - 6 likely interview questions (behavioural + technical) with tips
    on answering them given the candidate's specific background
  - Questions the candidate SHOULD ask the interviewer
  - How to frame the career gap for THIS company specifically
  - Red flags to avoid

Falls back to a curated rule-based guide if the LLM is unavailable.
----------------------------------------------------------------------
"""

import json
import logging
from typing import List, Optional

from app.ai.llm_client import LLMClient, extract_json_object
from app.ai.employer_compatibility import get_employer_by_id

logger = logging.getLogger(__name__)


class InterviewCoach:
    """
    Generates a company-specific interview preparation guide for a
    returning candidate.
    """

    def __init__(self):
        self.llm = LLMClient()

    def prepare(self, candidate: dict, employer_id: str) -> dict:
        """
        Main entry point.

        Args:
            candidate: dict with previous_role, skills, career_gap_years,
                       target_role (all optional except career_gap_years)
            employer_id: the employer's id string from employers.json

        Returns:
            A preparation guide dict, or an error dict if employer not found.
        """
        employer = get_employer_by_id(employer_id)
        if not employer:
            return {"error": f"Employer '{employer_id}' not found"}

        try:
            result = self._ai_prepare(candidate, employer)
        except Exception as e:
            logger.warning("interview_coach: AI path failed (%s), using rule-based fallback", e)
            result = None

        if not result:
            result = self._rule_based_prepare(candidate, employer)

        return result

    # ------------------------------------------------------------------
    # AI path
    # ------------------------------------------------------------------
    def _ai_prepare(self, candidate: dict, employer: dict) -> Optional[dict]:
        SYSTEM = (
            "You are a senior Career Coach specialising in helping women return to work "
            "after a career break. You give specific, empowering, company-tailored advice. "
            "Always respond with valid JSON only — no prose, no markdown fences."
        )

        prompt = f"""Generate a personalised interview prep guide for this candidate at {employer['name']}.

CANDIDATE:
{json.dumps(candidate, indent=2)}

COMPANY: {employer['name']}
Industry: {employer['industry']}
Culture Tags: {', '.join(employer.get('tags', []))}
Open Roles: {', '.join(employer.get('openRoles', []))}
Description: {employer.get('description', '')}
Returnship Programme: {employer.get('returnshipProgramName', 'N/A')}
Women in Leadership: {employer.get('policies', {}).get('womenInLeadershipPct', 'N/A')}%
Childcare Support: {employer.get('policies', {}).get('childcareSupport', False)}
Remote Available: {employer.get('flexibleWork', {}).get('remoteAvailable', False)}

Return a JSON object with these EXACT keys:
- employer_name (string)
- culture_snapshot (2-3 sentence string specific to this company)
- gap_framing_script (3-4 sentence string, confident, tailored to this company's values)
- likely_questions (array of exactly 6 objects, each with: question, category, tip)
  categories must be a mix of: Behavioural, Technical, Situational, HR
- questions_to_ask (array of exactly 4 smart, company-specific strings)
- red_flags_to_avoid (array of exactly 3 specific strings)
- returnship_programme_tip (string, specific to their programme if hasReturnship=true, else empty string)
- confidence_booster (one powerful, specific sentence)

All advice must be SPECIFIC to this candidate + this company. No generic platitudes."""

        raw = self.llm.ask(prompt, system=SYSTEM, temperature=0.4)
        try:
            parsed = extract_json_object(raw)
        except (ValueError, Exception) as e:
            logger.warning("interview_coach: JSON extraction failed: %s", e)
            return None

        # Basic field validation
        if not isinstance(parsed.get("likely_questions"), list):
            logger.warning("interview_coach: likely_questions missing or not a list")
            return None

        parsed["analysis_method"] = "ai"
        return parsed

    # ------------------------------------------------------------------
    # Rule-based fallback
    # ------------------------------------------------------------------
    def _rule_based_prepare(self, candidate: dict, employer: dict) -> dict:
        role = candidate.get("previous_role", "your previous role")
        gap = candidate.get("career_gap_years", 0)
        name = employer["name"]
        program = employer.get("returnshipProgramName", "their returnship programme")

        likely_questions = [
            {
                "question": "Tell me about yourself and your career journey.",
                "category": "HR",
                "tip": (
                    f"Start with your professional identity as a {role}, "
                    "briefly mention the career break with confidence, "
                    "then pivot immediately to what you've done to stay current "
                    "and your excitement about returning to work."
                ),
            },
            {
                "question": "Why did you take a career break, and why are you returning now?",
                "category": "HR",
                "tip": (
                    "Be honest but brief about the reason. "
                    "Spend 80% of your answer on the 'returning now' part — "
                    f"mention {name}'s {program} specifically as a key draw."
                ),
            },
            {
                "question": "How have you kept your skills up to date during your break?",
                "category": "HR",
                "tip": (
                    "List any courses, certifications, freelance projects, "
                    "or community involvement. Even reading industry blogs counts. "
                    "Be specific — name the platforms and topics."
                ),
            },
            {
                "question": "Describe a challenging project you led. What was the outcome?",
                "category": "Behavioural",
                "tip": (
                    "Use the STAR method (Situation, Task, Action, Result). "
                    "Pick an example that shows leadership, problem-solving, or "
                    "cross-functional collaboration — skills that don't expire."
                ),
            },
            {
                "question": "How do you prioritise competing deadlines?",
                "category": "Situational",
                "tip": (
                    "Give a concrete past example. Mention tools you use "
                    "(Jira, Trello, calendar blocks). Show self-awareness about "
                    "your working style."
                ),
            },
            {
                "question": f"What do you know about {name} and why do you want to join us?",
                "category": "HR",
                "tip": (
                    f"Research {name}'s recent news, their stated DEI commitments, "
                    f"and the {program}. Reference something specific — "
                    "interviewers notice candidates who've done real homework."
                ),
            },
        ]

        questions_to_ask = [
            f"What does a typical first 90 days look like for someone joining through {program}?",
            "How does the team support returners in rebuilding their confidence and speed?",
            "What are the biggest challenges someone in this role will face in the first 6 months?",
            "How does the company approach flexible working arrangements long-term?",
        ]

        gap_script = (
            f"I took {gap:.0f} year{'s' if gap != 1 else ''} away from full-time work "
            "to focus on personal commitments. During that time, I kept myself connected "
            "to my field through continuous learning and staying engaged with the community. "
            f"I'm excited to bring my experience and fresh perspective back to a team at {name} "
            "where I know I can make a meaningful impact from day one."
        )

        return {
            "employer_name": name,
            "culture_snapshot": (
                f"{name} is known for its inclusive culture and strong support for "
                "career returners. Their commitment to diversity is reflected in their "
                f"{employer.get('policies', {}).get('womenInLeadershipPct', 'significant')}% "
                "women in leadership."
            ),
            "gap_framing_script": gap_script,
            "likely_questions": likely_questions,
            "questions_to_ask": questions_to_ask,
            "red_flags_to_avoid": [
                "Apologising for or over-explaining your career gap — own it with confidence",
                "Saying 'I'm not sure if my skills are still relevant' — frame gaps as areas of active growth instead",
                "Failing to research the company — always name-drop a specific programme, product, or value they hold",
            ],
            "returnship_programme_tip": (
                f"When discussing {program}, show that you've researched it thoroughly — "
                "mention the duration, the mentorship component, and why this structure "
                "specifically appeals to you at this stage of your career."
            )
            if employer.get("hasReturnship") else "",
            "confidence_booster": (
                f"You bring {role} experience that no one can take away — your career break "
                f"is part of your story, not a hole in it, and {name} is actively looking for "
                "exactly the kind of experienced returner you are."
            ),
            "analysis_method": "rule_based",
        }
