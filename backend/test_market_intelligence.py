from app.ai.market_intelligence import MarketIntelligence

candidate = {
    "name": "Sneha Sharma",
    "previous_role": "Backend Engineer",
    "experience_years": 4,
    "skills": [
        "Python",
        "Java",
        "SQL",
        "Git"
    ]
}

market = MarketIntelligence()

result = market.analyze_market(candidate)

print(result)