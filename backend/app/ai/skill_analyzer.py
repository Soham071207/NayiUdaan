"""
skill_analyzer.py
----------------------------------------------------------------------
Skill Drift Detector & Gap Analyser

Two capabilities in one module:

1. SKILL DRIFT DETECTION
   Identifies skills in the candidate's profile that have evolved
   significantly since they last used them, and suggests what the
   modern equivalent looks like. A candidate who used "React 15" in
   2019 needs to know the ecosystem now includes hooks, suspense,
   server components, etc.

2. SKILL GAP ANALYSIS per employer
   Given a candidate and an employer, returns a structured gap report:
   - Matched skills (with taxonomy expansion)
   - Missing skills (ranked by criticality)
   - Learning path: fastest way to close each gap

Both use the taxonomy from skill_taxonomy.py for intelligent matching,
and fall back gracefully if the LLM is unavailable.
----------------------------------------------------------------------
"""

import json
import logging
from typing import List, Optional

from app.ai.llm_client import LLMClient, extract_json_object
from app.ai.skill_taxonomy import expand_skills, find_skill_gaps, match_score

logger = logging.getLogger(__name__)


# Skills known to have significant ecosystem changes since 2020
_KNOWN_DRIFT_SIGNALS: dict[str, str] = {
    "react": "React 18 introduced hooks-first architecture, Suspense, and Server Components. The ecosystem now centres on Next.js/Vite rather than Create React App.",
    "angular": "Angular has moved from AngularJS (deprecated) to Angular 17+ with standalone components and signals. If you used AngularJS, a significant relearn is needed.",
    "node": "Node.js ecosystem has shifted toward ESM modules, native fetch, and edge runtimes. npm workspaces and pnpm are now standard.",
    "python": "Python 3.10+ introduced structural pattern matching, type hints are now standard. FastAPI/Pydantic v2 have replaced older frameworks.",
    "java": "Java 17+ LTS (and now 21 LTS) introduced records, sealed classes, virtual threads (Project Loom). Spring Boot 3.x requires Java 17+.",
    "machine learning": "The field has shifted dramatically toward transformer architectures, LLMs, and fine-tuning. PyTorch is now dominant over TensorFlow in research.",
    "aws": "AWS has expanded massively — Bedrock (generative AI), Lambda Powertools, CDK v2. IAM best practices have also tightened.",
    "docker": "Docker Desktop licensing changed for enterprises. Podman, containerd, and OCI specs are now commonly required alongside Docker knowledge.",
    "kubernetes": "K8s has matured with Helm v3, Karpenter, Gateway API, and GitOps (Flux/ArgoCD) becoming standard — just kubectl knowledge isn't enough.",
    "devops": "Platform engineering, Internal Developer Platforms (IDPs), and GitOps have emerged as major disciplines within DevOps.",
    "angular js": "AngularJS reached end-of-life in December 2021 and is no longer maintained. Migration to Angular 17+ is strongly recommended.",
    "redux": "Redux Toolkit (RTK) is now the official standard, and React Query / TanStack Query are preferred for server state. Classic Redux is outdated.",
    "rest api": "GraphQL, gRPC, and tRPC have become common alongside REST. API security practices (OAuth2, PKCE) have also evolved significantly.",
    "sql": "Modern data stacks use dbt, DuckDB, and analytical SQL (window functions, CTEs) heavily. Basic SQL knowledge needs to be extended.",
}


class SkillAnalyzer:
    """
    Detects skill drift and generates gap analyses for candidates.
    """

    def __init__(self):
        self.llm = LLMClient()

    # ------------------------------------------------------------------
    # Skill Drift Detection
    # ------------------------------------------------------------------
    def detect_drift(self, candidate: dict) -> dict:
        """
        Detect which of the candidate's skills may have drifted during
        their career break, and suggest modernisation paths.

        Returns:
            {
                "drifted_skills": [
                    {
                        "skill": "React",
                        "drift_level": "Moderate | Significant | Critical",
                        "what_changed": "...",
                        "modernisation_tip": "...",
                        "estimated_refresh_hours": 8
                    }
                ],
                "stable_skills": ["SQL", "Python fundamentals", ...],
                "overall_drift_risk": "Low | Moderate | High",
                "priority_refresh": ["...", "..."]
            }
        """
        skills: List[str] = candidate.get("skills") or []
        gap = float(candidate.get("career_gap_years", 0) or 0)

        try:
            result = self._ai_detect_drift(candidate)
        except Exception as e:
            logger.warning("skill_analyzer: AI drift detection failed (%s), using rule-based", e)
            result = None

        if not result:
            result = self._rule_based_drift(skills, gap)

        return result

    def _ai_detect_drift(self, candidate: dict) -> Optional[dict]:
        gap = float(candidate.get("career_gap_years", 0) or 0)
        # Pre-compute safe variables — never embed arithmetic inside an f-string in a prompt
        approx_last_year = max(2019, 2026 - int(gap))
        gap_label = f"{gap:.1f} year{'s' if gap != 1 else ''}"

        SYSTEM = (
            "You are a Technology Skills Analyst who identifies which technical skills "
            "have changed significantly since a professional last used them. "
            "Always respond with valid JSON only — no prose, no markdown fences."
        )

        prompt = f"""Identify which skills in this candidate's profile have significantly 
drifted during their {gap_label} career break (they last worked around {approx_last_year}).

CANDIDATE:
{json.dumps(candidate, indent=2)}

Return a JSON object with these EXACT keys:
- drifted_skills (array of objects, each with: skill str, drift_level str, what_changed str, modernisation_tip str, estimated_refresh_hours int)
  drift_level must be one of: Low | Moderate | Significant | Critical
  Only include a skill if there is a GENUINE, MATERIAL change since {approx_last_year}
- stable_skills (array of strings — skills whose fundamentals haven't changed significantly)
- overall_drift_risk (one of: Low | Moderate | High)
- priority_refresh (array of up to 3 skill name strings, most urgent first)

Guidelines:
- Be specific: cite year, version number, or paradigm shift
- estimated_refresh_hours: 2-4h minor, 8-20h significant, 40+ critical
- Stable skills include: SQL fundamentals, data structures, algorithms, soft skills"""

        raw = self.llm.ask(prompt, system=SYSTEM, temperature=0.2)
        try:
            parsed = extract_json_object(raw)
        except (ValueError, Exception) as e:
            logger.warning("skill_analyzer: JSON extraction failed: %s", e)
            return None

        # Validate structure
        if not isinstance(parsed.get("drifted_skills"), list):
            logger.warning("skill_analyzer: drifted_skills missing or not a list")
            return None

        parsed["analysis_method"] = "ai"
        return parsed

    def _rule_based_drift(self, skills: List[str], gap: float) -> dict:
        drifted = []
        stable = []

        for skill in skills:
            skill_lower = skill.lower()
            drift_info = None

            for keyword, description in _KNOWN_DRIFT_SIGNALS.items():
                if keyword in skill_lower or skill_lower in keyword:
                    drift_info = description
                    break

            if drift_info and gap >= 1:
                severity = "Significant" if gap >= 3 else "Moderate"
                hours = 20 if gap >= 3 else 8
                drifted.append({
                    "skill": skill,
                    "drift_level": severity,
                    "what_changed": drift_info,
                    "modernisation_tip": f"Spend a focused {hours}h on the official docs / a recent tutorial for the current version",
                    "estimated_refresh_hours": hours,
                })
            else:
                stable.append(skill)

        overall = "High" if len(drifted) >= 3 else "Moderate" if drifted else "Low"
        priority = [d["skill"] for d in sorted(
            drifted,
            key=lambda x: {"Critical": 4, "Significant": 3, "Moderate": 2, "Low": 1}.get(x["drift_level"], 0),
            reverse=True,
        )[:3]]

        return {
            "drifted_skills": drifted,
            "stable_skills": stable,
            "overall_drift_risk": overall,
            "priority_refresh": priority,
            "analysis_method": "rule_based",
        }

    # ------------------------------------------------------------------
    # Skill Gap Analysis per Employer
    # ------------------------------------------------------------------
    def analyze_gap(self, candidate: dict, employer: dict) -> dict:
        """
        Analyse the skill gap between a candidate and a specific employer's
        tech stack, using taxonomy-expanded matching.

        Returns:
            {
                "match_score": 0.65,
                "matched_skills": [...],
                "missing_skills": [
                    {
                        "skill": "Kubernetes",
                        "criticality": "High | Medium | Low",
                        "learning_path": "...",
                        "estimated_hours": 20
                    }
                ],
                "transferable_skills": [...],
                "gap_summary": "..."
            }
        """
        candidate_skills: List[str] = candidate.get("skills") or []
        employer_stack: List[str] = employer.get("techStack") or []

        score = match_score(candidate_skills, employer_stack)
        gaps = find_skill_gaps(candidate_skills, employer_stack)

        # Expand candidate skills to find what they actually cover
        expanded = expand_skills(candidate_skills)
        matched = [s for s in employer_stack if s.lower() in expanded
                   or any(s.lower() in alias for alias in expanded)]

        missing_details = [
            {
                "skill": skill,
                "criticality": "High" if i < 2 else "Medium" if i < 4 else "Low",
                "learning_path": f"Official docs + 1 hands-on project using {skill}",
                "estimated_hours": 16 if i < 2 else 8,
            }
            for i, skill in enumerate(gaps[:6])
        ]

        return {
            "employer_name": employer.get("name", ""),
            "match_score": round(score, 2),
            "match_percentage": round(score * 100),
            "matched_skills": matched,
            "missing_skills": missing_details,
            "gap_summary": (
                f"You match {round(score * 100)}% of {employer.get('name', 'this employer')}'s "
                f"tech stack. You have {len(matched)} of the key technologies — "
                f"{', '.join(gaps[:2]) + ' are the top gaps to address.' if gaps else 'no critical gaps identified.'}"
            ),
            "analysis_method": "rule_based",
        }
