from app.ai.career_gap_detector import CareerGapDetector

resume = """
Sneha Sharma

Backend Engineer

Infosys

January 2018 - March 2022

Skills

Python
Java
SQL
Docker
"""

detector = CareerGapDetector()

result = detector.detect(resume)

print(result)