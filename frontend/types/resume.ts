export interface RoadmapWeek {
  week: number;
  title: string;
  tasks: string[];
  resources: string[];
}

export interface CareerGap {
  career_gap_detected: boolean;
  career_gap_years: number;
  last_working_year: number;
  confidence: "high" | "medium" | "low";
  reasoning: string;
}

export interface Market {
  strong_skills: string[];
  missing_skills: string[];
  priority_to_learn: string[];
  market_required_skills: string[];
  career_readiness_score: number;
  reason: string;
}

export interface ResumeReview {
  ats_score: number;
  resume_tips: string[];
  missing_sections: string[];
  keyword_suggestions: string[];
  professional_summary: string;
  overall_feedback: string;
}

export interface CareerReport {
  executive_summary: string;
  career_gap: {
    detected: boolean;
    years: number;
    reasoning: string;
  };
  market_readiness: {
    score: number;
    reason: string;
  };
  top_strengths: string[];
  top_priorities: string[];
  ats_score: number;
  resume_tips: string[];
  professional_summary: string;
  estimated_return_time: string;
  recommended_next_step: string;
  overall_recommendation: string;
  roadmap: RoadmapWeek[];
}

export interface ResumeAnalysis {
  name: string;
  previous_role: string;
  experience_years: number;
  education: string;
  skills: string[];
  career_gap: CareerGap;
  market: Market;
  roadmap: { roadmap: RoadmapWeek[] };
  resume_review: ResumeReview;
  career_report: CareerReport;
  employer_matches?: any[];
  application_strategy?: any;
}

export interface ApiResponse {
  success: boolean;
  filename: string;
  data: ResumeAnalysis;
}

export interface UploadState {
  status: "idle" | "uploading" | "processing" | "done" | "error";
  progress: number;
  currentStep: string;
  error?: string;
}
