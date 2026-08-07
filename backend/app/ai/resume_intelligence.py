import json
from app.ai.llm_client import LLMClient


class ResumeIntelligence:

    def __init__(self):
        self.llm = LLMClient()

    def analyze_resume(self, resume_text):

        prompt = f"""
You are an expert Resume Analyzer.

Extract ONLY the following information from the resume.

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
    ]
}}

Resume:

{resume_text}
"""

        return self.llm.ask_json(prompt)