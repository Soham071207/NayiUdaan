import json
from app.ai.llm_client import LLMClient, extract_json_object
import logging

logger = logging.getLogger(__name__)


class ResumeIntelligence:

    def __init__(self):
        self.llm = LLMClient()

    def analyze_resume(self, resume_text):
        """
        Combined Resume Intelligence + Career Gap Detection in a single LLM call.
        Previously these were 2 separate sequential calls, adding ~3-5s of latency.
        """

        prompt = f"""
You are an expert Resume Analyzer and Timeline Analyst.

Today's year is 2026.

Extract ALL the following information from the resume in a single pass.

Return ONLY valid JSON.

Schema:

{{
    "name":"",
    "previous_role":"",
    "experience_years":0,

    "education":[
        {{
            "degree":"",
            "major":""
        }}
    ],

    "projects":[
        {{
            "name":""
        }}
    ],

    "certifications":[
        {{
            "name":""
        }}
    ],

    "career_gap": {{
        "career_gap_detected": true,
        "last_working_year": 0,
        "confidence": "high",
        "possible_reason": "Unknown",
        "reasoning": ""
    }}
}}

Rules:

- Extract name, role, experience, education, projects, certifications from the resume.
- For career_gap: detect the latest employment year from the timeline.
- career_gap_detected = true if (2026 - last_working_year) > 0.
- Confidence must be 'high', 'medium', or 'low'.
- Do NOT invent personal reasons for the gap. Set possible_reason to "Unknown".
- Return ONLY JSON.

Resume:

{resume_text}
"""

        raw = self.llm.ask(prompt, temperature=0.0)
        try:
            parsed = extract_json_object(raw)

            # Post-process career_gap fields
            gap = parsed.get("career_gap", {})
            last_working_year = gap.get("last_working_year", 2026)
            gap_years = max(0, 2026 - last_working_year)
            gap["career_gap_years"] = gap_years
            gap["career_gap_detected"] = gap_years > 0

            # Ensure confidence is a string
            conf = gap.get("confidence", "high")
            if isinstance(conf, (int, float)):
                gap["confidence"] = "high" if conf > 80 else "medium" if conf > 50 else "low"

            parsed["career_gap"] = gap
            return parsed

        except Exception as e:
            logger.warning("resume_intelligence: JSON extraction failed: %s", e)
            # Return safe defaults
            return {
                "name": "Unknown",
                "previous_role": "Unknown",
                "experience_years": 0,
                "education": [],
                "projects": [],
                "certifications": [],
                "career_gap": {
                    "career_gap_detected": False,
                    "career_gap_years": 0,
                    "last_working_year": 2026,
                    "confidence": "low",
                    "possible_reason": "Unknown",
                    "reasoning": "Fallback due to parse error"
                }
            }
