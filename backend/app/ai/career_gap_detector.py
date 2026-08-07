import json
from app.ai.llm_client import LLMClient


class CareerGapDetector:

    def __init__(self):
        self.llm = LLMClient()

    def detect(self, resume_text):

        prompt = f"""
You are an expert Resume Timeline Analyzer.

Analyze ONLY the employment timeline.

Today's year is 2026.

Resume:

{resume_text}

Return ONLY valid JSON.

Schema:

{{
    "career_gap_detected": true,
    "career_gap_years": 0,
    "last_working_year": 0,
    "confidence": 0,
    "possible_reason": "Unknown",
    "reasoning": ""
}}

Rules:

1. Detect the latest employment year.
2. Calculate career gap until 2026.
3. If no gap exists, set career_gap_detected to false.
4. Confidence must be between 0 and 100.
5. Do NOT invent personal reasons.
6. Set possible_reason to "Unknown".
7. Return ONLY JSON.
"""

        return self.llm.ask_json(prompt)