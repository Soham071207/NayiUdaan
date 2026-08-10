import json
from app.ai.llm_client import LLMClient


class MarketIntelligence:

    def __init__(self):
        self.llm = LLMClient()

    def analyze_market(self, candidate):

        prompt = f"""
You are a Senior Technical Recruiter at a top product company.

Evaluate this candidate fairly.

Candidate:

{json.dumps(candidate, indent=2)}

Return ONLY valid JSON.

Schema:

{{
    "market_required_skills":[],
    "strong_skills":[],
    "missing_skills":[],
    "priority_to_learn":[],
    "career_readiness_score":0,
    "reason":""
}}

Rules:

- Maximum 5 missing skills
- Maximum 2 priority skills
- Score between 0 and 100
- Return ONLY JSON
"""

        return self.llm.ask_json(prompt)
