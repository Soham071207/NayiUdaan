import json
from app.ai.llm_client import GeminiClient


class ResumeIntelligence:

    def __init__(self):
        self.llm = GeminiClient()

    def analyze_resume(self, resume_text: str):

        prompt = f"""
You are an expert resume parser.

Analyze the resume and return ONLY valid JSON.

Schema:

{{
    "name":"",
    "previous_role":"",
    "experience_years":0,
    "education":[],
    "projects":[],
    "certifications":[]
}}

Resume:

{resume_text}
"""

        response = self.llm.ask(prompt)
        response = response.replace("```json", "")
        response = response.replace("```", "")
        response = response.strip()

        try:
            return json.loads(response)

        except Exception:

            return {
                "error":"Invalid JSON",
                "raw_response":response
            }