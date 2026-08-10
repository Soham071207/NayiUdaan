export interface Employer {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  compatibilityScore: number;
  hasReturnship: boolean;
  openRoles: string[];
  description: string;
  returnshipDuration: string;
  stipend: string;
  tags: string[];
}

export interface EmployerMatchResponse {
  success: boolean;
  employers: Employer[];
}

export interface InterviewQuestion {
  id: string;
  category: "behavioral" | "technical" | "hr";
  question: string;
}

export interface InterviewFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  model_answer: string;
}

export interface InterviewSession {
  session_id: string;
  question: InterviewQuestion;
}

export interface InterviewAnswerResponse {
  success: boolean;
  feedback: InterviewFeedback;
  next_question: InterviewQuestion;
}
