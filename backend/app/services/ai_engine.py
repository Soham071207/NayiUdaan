import concurrent.futures

from app.ai.resume_intelligence import ResumeIntelligence
from app.ai.market_intelligence import MarketIntelligence
from app.ai.roadmap_generator import RoadmapGenerator
from app.ai.resume_optimizer import ResumeOptimizer
from app.services.report_generator import ReportGenerator
from app.services.employer_service import EmployerService


class AIEngine:

    def __init__(self):
        self.resume_ai = ResumeIntelligence()
        self.market_ai = MarketIntelligence()
        self.roadmap_ai = RoadmapGenerator()
        self.optimizer_ai = ResumeOptimizer()
        self.report_generator = ReportGenerator()
        self.employer_service = EmployerService()

    def analyze_resume(self, resume_text, detected_skills):

        # -------------------------------------------------------------
        # STEP 1: Resume Intelligence + Gap Detection (SINGLE LLM call)
        # Previously this was 2 sequential calls. Now merged into one.
        # -------------------------------------------------------------

        print("STEP 1: Starting Resume Intelligence + Gap Detection...", flush=True)
        candidate = self.resume_ai.analyze_resume(resume_text)
        candidate["skills"] = detected_skills

        # Flatten education array to string to match frontend types
        if isinstance(candidate.get("education"), list):
            edu_strs = []
            for e in candidate["education"]:
                if isinstance(e, dict):
                    deg = e.get("degree", "").strip()
                    maj = e.get("major", "").strip()
                    if deg and maj:
                        edu_strs.append(f"{deg}, {maj}")
                    elif deg or maj:
                        edu_strs.append(deg or maj)
                elif isinstance(e, str):
                    edu_strs.append(e)
            candidate["education"] = " | ".join(edu_strs) if edu_strs else "Unknown Education"

        gap_info = candidate.get("career_gap", {})
        print("STEP 1: Finished Resume Intelligence + Gap Detection.", flush=True)

        # Build the exact profile format that EmployerService expects
        employer_profile = {
            "previous_role": candidate.get("previous_role", ""),
            "skills": detected_skills,
            "career_gap_years": gap_info.get("career_gap_years", 0),
            "preferred_work_mode": "Any",
            "preferred_location": "Any",
            "target_role": candidate.get("previous_role", "")
        }

        # -------------------------------------------------------------
        # STEP 2: Parallel LLM calls (Market, Roadmap, Optimizer, Employer)
        # Report generation is NOT run here — it needs the results from
        # these steps, so it runs after they complete.
        # -------------------------------------------------------------

        def get_employer_data():
            print("  → Employer Intelligence...", flush=True)
            matches = self.employer_service.get_matches(employer_profile, top_n=5)
            strategy = self.employer_service.get_application_priority(
                candidate=employer_profile,
                top_n=5,
                precomputed_matches=matches
            )
            print("  ✓ Employer Intelligence done.", flush=True)
            return matches, strategy

        def get_market_data():
            print("  → Market Intelligence...", flush=True)
            res = self.market_ai.analyze_market(candidate)
            print("  ✓ Market Intelligence done.", flush=True)
            return res

        def get_roadmap_data():
            print("  → Roadmap Generation...", flush=True)
            res = self.roadmap_ai.generate(candidate)
            print("  ✓ Roadmap Generation done.", flush=True)
            return res

        def get_optimizer_data():
            print("  → Resume Optimization...", flush=True)
            res = self.optimizer_ai.optimize(candidate)
            print("  ✓ Resume Optimization done.", flush=True)
            return res

        print("STEP 2: Starting parallel LLM calls...", flush=True)
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
            future_employer = executor.submit(get_employer_data)
            future_market = executor.submit(get_market_data)
            future_roadmap = executor.submit(get_roadmap_data)
            future_optimizer = executor.submit(get_optimizer_data)

            candidate["employer_matches"], candidate["application_strategy"] = future_employer.result()
            candidate["market"] = future_market.result()
            candidate["roadmap"] = future_roadmap.result()
            candidate["resume_review"] = future_optimizer.result()
        print("STEP 2: All parallel calls finished.", flush=True)

        # -------------------------------------------------------------
        # STEP 3: Generate report (pure Python, no LLM — instant)
        # Now runs AFTER market/roadmap/optimizer are available.
        # -------------------------------------------------------------

        print("STEP 3: Generating career report...", flush=True)
        candidate["career_report"] = self.report_generator.generate(candidate)
        print("STEP 3: Done.", flush=True)

        return candidate
