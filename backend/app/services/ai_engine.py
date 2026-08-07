from app.ai.resume_intelligence import ResumeIntelligence
from app.ai.market_intelligence import MarketIntelligence
from app.ai.roadmap_generator import RoadmapGenerator
from app.ai.resume_optimizer import ResumeOptimizer
from app.services.report_generator import ReportGenerator


class AIEngine:

    def __init__(self):

        self.resume_ai = ResumeIntelligence()
        self.market_ai = MarketIntelligence()
        self.roadmap_ai = RoadmapGenerator()
        self.optimizer_ai = ResumeOptimizer()
        self.report_generator = ReportGenerator()

    def analyze_resume(self, resume_text, detected_skills):

        # -----------------------------
        # STEP 1 : Resume Intelligence
        # -----------------------------

        candidate = self.resume_ai.analyze_resume(resume_text)

        candidate["skills"] = detected_skills

        # -----------------------------
        # STEP 2 : Market Intelligence
        # -----------------------------

        market = self.market_ai.analyze_market(candidate)

        candidate["market"] = market

        # -----------------------------
        # STEP 3 : Roadmap
        # -----------------------------

        roadmap = self.roadmap_ai.generate(candidate)

        candidate["roadmap"] = roadmap

        # -----------------------------
        # STEP 4 : Resume Optimizer
        # -----------------------------

        optimizer = self.optimizer_ai.optimize(candidate)

        candidate["resume_review"] = optimizer

        # -----------------------------
        # STEP 5 : Career Report
        # -----------------------------

        report = self.report_generator.generate(candidate)

        candidate["career_report"] = report

        return candidate