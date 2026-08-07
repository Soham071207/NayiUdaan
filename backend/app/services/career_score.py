class CareerScore:

    def calculate(
        self,
        resume_score,
        skill_score,
        market_score,
        gap_score
    ):

        overall = (

            resume_score * 0.20 +

            skill_score * 0.30 +

            market_score * 0.30 +

            gap_score * 0.20

        )

        return round(overall)