import type { Metadata } from "next";
import PublicNavbar from "@/components/layout/PublicNavbar";
import HeroSection from "@/features/public/HeroSection";

export const metadata: Metadata = {
  title: "Home | NayiUdaan — Empowering Every Indian Woman",
  description:
    "India's leading AI-powered women empowerment platform. Skills, jobs, mentorship, returnship programs, and community for every woman — from villages to cities.",
  keywords: [
    "women empowerment India", "career comeback women", "returnship India",
    "skill development women", "NGO women India", "women mentorship",
  ],
  openGraph: {
    title: "NayiUdaan — Har Naari Ka Naya Aagaz",
    description: "Skills. Jobs. Mentorship. Community. For every Indian woman.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div className="font-jakarta" style={{ background: "var(--bg-light)", color: "var(--text-main)" }}>
      <PublicNavbar />

      {/* Hero only */}
      <main id="main-content">
        <HeroSection />
      </main>
    </div>
  );
}
