class ReportGenerator:

    def generate(self, analysis):

        candidate = analysis

        market = candidate.get("market", {})

        roadmap = candidate.get("roadmap", {})

        resume_review = candidate.get("resume_review", {})

        career_gap = candidate.get("career_gap", {})

        report = {

            "executive_summary": (
                f"{candidate.get('name', 'Candidate')} is a "
                f"{candidate.get('previous_role', 'Professional')} "
                f"with {candidate.get('experience_years', 0)} years of experience."
            ),

            "career_gap": {
                "detected": career_gap.get("career_gap_detected", False),
                "years": career_gap.get("career_gap_years", 0),
                "reasoning": career_gap.get("reasoning", "")
            },

            "market_readiness": {
                "score": market.get("career_readiness_score", 0),
                "reason": market.get("reason", "")
            },

            "top_strengths": market.get("strong_skills", []),

            "top_priorities": market.get("priority_to_learn", []),

            "ats_score": resume_review.get("ats_score", 0),

            "resume_tips": resume_review.get("resume_tips", []),

            "professional_summary": resume_review.get(
                "professional_summary", ""
            ),

            "estimated_return_time": "8 Weeks",

            "recommended_next_step": (
                market.get("priority_to_learn", ["Continue Learning"])[0]
                if market.get("priority_to_learn")
                else "Continue Learning"
            ),

            "overall_recommendation": (
                "Your previous experience remains valuable. "
                "Focus on the priority skills, complete the roadmap, "
                "and update your resume before applying for returnship "
                "or full-time opportunities."
            ),

            "roadmap": roadmap.get("roadmap", [])
        }

        return report
