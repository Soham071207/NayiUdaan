import { ApiResponse } from "@/types/resume";
import { EmployerMatchResponse } from "@/types/employer";
import { 
  StartInterviewRequest, 
  StartInterviewResponse, 
  SubmitAnswerRequest, 
  SubmitAnswerResponse,
  GapCoachRequest,
  GapCoachResponse 
} from "@/types/career_coach";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    headers: { "Accept": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const error = await res.text().catch(() => "Unknown error");
    throw new Error(`API Error ${res.status}: ${error}`);
  }

  return res.json();
}

// ─── Resume API ─────────────────────────────────────────────────────────────

export async function uploadResume(file: File): Promise<ApiResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch<ApiResponse>("/upload-resume", {
    method: "POST",
    body: formData,
    // Don't set Content-Type for FormData — browser sets it with boundary
    headers: {},
  });
}

// ─── Employer API ────────────────────────────────────────────────────────────

export async function getEmployerMatches(candidate: any): Promise<EmployerMatchResponse> {
  return apiFetch<EmployerMatchResponse>("/employers/matches", {
    method: "POST",
    body: JSON.stringify(candidate),
    headers: { "Content-Type": "application/json" },
  });
}

// ─── Career Coach API ─────────────────────────────────────────────────────────

export async function startInterview(req: StartInterviewRequest): Promise<StartInterviewResponse> {
  return apiFetch<StartInterviewResponse>("/career-coach/interview/start", {
    method: "POST",
    body: JSON.stringify(req),
    headers: { "Content-Type": "application/json" },
  });
}

export async function submitAnswer(req: SubmitAnswerRequest): Promise<SubmitAnswerResponse> {
  return apiFetch<SubmitAnswerResponse>("/career-coach/interview/answer", {
    method: "POST",
    body: JSON.stringify(req),
    headers: { "Content-Type": "application/json" },
  });
}

export async function getGapExplanations(req: GapCoachRequest): Promise<GapCoachResponse> {
  return apiFetch<GapCoachResponse>("/career-coach/gap-explanation", {
    method: "POST",
    body: JSON.stringify(req),
    headers: { "Content-Type": "application/json" },
  });
}
