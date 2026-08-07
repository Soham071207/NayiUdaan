from app.services.ai_engine import AIEngine

resume_text = """
Sneha Sharma

Backend Engineer

4 years experience

Skills:
Python
Java
SQL
Git
Docker

Education:
B.Tech Computer Science

Project:
Inventory Management System
"""

skills = [
    "Python",
    "Java",
    "SQL",
    "Git",
    "Docker"
]

engine = AIEngine()

result = engine.analyze_resume(
    resume_text=resume_text,
    detected_skills=skills
)

print(result)