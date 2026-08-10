import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to NayiUdaan to resume your career comeback journey, view your roadmap, and access your career reports.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
