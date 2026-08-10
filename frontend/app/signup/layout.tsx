import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Join NayiUdaan today. Free AI-powered career analysis, skill building, and mentorship for women returning to the workforce.",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
