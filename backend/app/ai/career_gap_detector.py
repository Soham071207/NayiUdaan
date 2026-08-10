import json
import logging
from app.ai.llm_client import LLMClient, extract_json_object

logger = logging.getLogger(__name__)


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
    "last_working_year": 0,
    "confidence": "high",
    "possible_reason": "Unknown",
    "reasoning": ""
}}

Rules:

1. Detect the latest employment year.
2. If no gap exists, set career_gap_detected to false.
3. Confidence must be 'high', 'medium', or 'low'.
4. Do NOT invent personal reasons.
5. Set possible_reason to "Unknown".
6. Return ONLY JSON.
"""
        raw = self.llm.ask(prompt, temperature=0.2)
        try:
            parsed = extract_json_object(raw)
            last_working_year = parsed.get("last_working_year", 2026)
            gap_years = max(0, 2026 - last_working_year)
            parsed["career_gap_years"] = gap_years
            parsed["career_gap_detected"] = gap_years > 0
            
            # Ensure confidence is a string (high/medium/low)
            conf = parsed.get("confidence", "high")
            if isinstance(conf, (int, float)):
                parsed["confidence"] = "high" if conf > 80 else "medium" if conf > 50 else "low"
            
            return parsed
        except Exception as e:
            logger.warning("career_gap_detector: JSON extraction failed: %s", e)
            return {
                "career_gap_detected": False,
                "career_gap_years": 0,
                "last_working_year": 2026,
                "confidence": "low",
                "possible_reason": "Unknown",
                "reasoning": "Fallback due to parse error"
            }
