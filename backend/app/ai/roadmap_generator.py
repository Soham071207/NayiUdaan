import json
from app.ai.llm_client import LLMClient


class RoadmapGenerator:

    def __init__(self):
        self.llm = LLMClient()

    def generate(self, analysis):

        prompt = f"""
You are an expert Career Coach.

Candidate Analysis:

{json.dumps(analysis, indent=2)}

Generate a personalized 8-week roadmap.

Return ONLY valid JSON.

Schema:

{{
    "roadmap":[
        {{
            "week":1,
            "title":"",
            "tasks":["", ""],
            "resources":["", ""]
        }}
    ]
}}

Rules:

- Exactly 8 weeks
- One main theme/title per week
- Provide 3-4 specific tasks per week
- Provide 2-3 specific learning resources per week
- Learn highest priority skills first
- Include one portfolio project
- Include resume optimization
- Include interview preparation
- Finish with job applications
"""

        return self.llm.ask_json(prompt)
