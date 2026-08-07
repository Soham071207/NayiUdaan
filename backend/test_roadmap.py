from app.ai.roadmap_generator import RoadmapGenerator

analysis = {

    "previous_role": "Backend Engineer",

    "experience_years": 4,

    "career_gap": 3,

    "strong_skills": [
        "Python",
        "Java",
        "SQL"
    ],

    "missing_skills": [
        "Docker",
        "AWS",
        "Kubernetes"
    ],

    "priority_to_learn": [
        "Docker",
        "AWS"
    ]
}

roadmap = RoadmapGenerator()

result = roadmap.generate(analysis)

print(result)