from app.ai.resume_optimizer import ResumeOptimizer

analysis = {

    "name": "Sneha Sharma",

    "previous_role": "Backend Engineer",

    "experience_years": 4,

    "career_gap_years": 3,

    "skills": {
        "strong": [
            "Python",
            "Java",
            "SQL"
        ],

        "missing": [
            "Docker",
            "AWS"
        ]
    },

    "market": {
        "career_readiness_score": 75
    }
}

optimizer = ResumeOptimizer()

result = optimizer.optimize(analysis)

print(result)