import { Metadata } from "next";
import AuthGuard from "@/components/auth/AuthGuard";

export const metadata: Metadata = {
  title: "AI Resume Analysis",
  description: "Upload your resume for an instant AI analysis. We'll identify your career gap, highlight transferable skills, and generate an 8-week returnship roadmap.",
};

export default function UploadLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
