from app.ai.resume_intelligence import ResumeIntelligence

sample_resume = """
Name: Sneha Sharma

Backend Engineer

Experience:
Worked as a Backend Engineer at ABC Technologies from 2018 to 2022.

Skills:
Python
Java
SQL
Docker
AWS

Education:
B.Tech in Computer Science

Projects:
Inventory Management System
Employee Portal

Certifications:
AWS Cloud Practitioner
"""

ai = ResumeIntelligence()

result = ai.analyze_resume(sample_resume)

print(result)