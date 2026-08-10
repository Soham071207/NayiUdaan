// Career Coach / mem3 TypeScript Interfaces

export interface CandidateContext {
  previous_role?: string;
  experience_years?: number;
  career_gap: boolean;
  gap_years?: number;
  target_role?: string;
  field?: string;
}

// ─── Interview API Types ──────────────────────────────────────────────────

export interface StartInterviewRequest {
  target_role: string;
  field?: string;
  interview_type: string;
  total_questions: number;
  candidate_context?: CandidateContext;
}

export interface InterviewQuestion {
  question_number: number;
  question: string;
  interview_type: string;
}

export interface StartInterviewResponse {
  session_id: string;
  first_question: InterviewQuestion;
  total_questions: number;
}

export interface AnswerEvaluation {
  overall_score: number;
  communication: number;
  technical_accuracy: number;
  relevance: number;
  structure: number;
  confidence: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
  improved_answer: string;
}

export interface SubmitAnswerRequest {
  session_id: string;
  answer: string;
}

export interface SubmitAnswerResponse {
  session_id: string;
  evaluation: AnswerEvaluation;
  next_question?: InterviewQuestion;
  is_complete: boolean;
}

// ─── Gap Coach API Types ──────────────────────────────────────────────────

export interface GapCoachRequest {
  previous_role?: string;
  experience_years?: number;
  career_gap: boolean;
  gap_years?: number;
  reason?: string;
  target_role: string;
}

export interface GapExplanationSet {
  short_explanation: string;
  detailed_explanation: string;
  interview_answer: string;
  professional_version: string;
}

export interface GapCoachResponse {
  target_role: string;
  gap_years?: number;
  explanations: GapExplanationSet;
}
