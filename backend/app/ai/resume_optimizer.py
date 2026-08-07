import json
from app.ai.llm_client import LLMClient


class ResumeOptimizer:

    def __init__(self):
        self.llm = LLMClient()

    def optimize(self, analysis):

        prompt = f"""
You are an ATS Resume Expert.

Candidate Analysis:

{json.dumps(analysis, indent=2)}

Analyze the resume.

Return ONLY valid JSON.

Schema:

{{
    "ats_score":0,
    "professional_summary":"",
    "resume_tips":[],
    "keyword_additions":[],
    "missing_sections":[],
    "strengths":[],
    "overall_feedback":""
}}

Rules:

- ATS score between 0-100
- 4-6 resume tips
- 5 ATS keywords
- Mention missing sections
- Professional summary in 2-3 lines
- Return ONLY JSON
"""

        return self.llm.ask_json(prompt)