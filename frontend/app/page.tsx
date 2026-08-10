import type { Metadata } from "next";
import PublicNavbar from "@/components/layout/PublicNavbar";
import HeroSection from "@/features/public/HeroSection";
import MissionSection from "@/features/public/MissionSection";
import FeaturesSection from "@/features/public/FeaturesSection";
import ProgramsSection from "@/features/public/ProgramsSection";
import SkillDevelopmentSection from "@/features/public/SkillDevelopmentSection";
import JobOpportunitiesSection from "@/features/public/JobOpportunitiesSection";
import SuccessStoriesSection from "@/features/public/SuccessStoriesSection";
import TestimonialsSection from "@/features/public/TestimonialsSection";
import NGOSection from "@/features/public/NGOSection";
import EventsSection from "@/features/public/EventsSection";
import MentorSection from "@/features/public/MentorSection";
import FAQSection from "@/features/public/FAQSection";
import PublicFooter from "@/features/public/PublicFooter";

export const metadata: Metadata = {
  title: "NayiUdaan — Empowering Every Indian Woman",
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

      {/* All 14 sections */}
      <main id="main-content">
        <HeroSection />
        <MissionSection />
        <FeaturesSection />
        <ProgramsSection />
        <SkillDevelopmentSection />
        <JobOpportunitiesSection />
        <SuccessStoriesSection />
        <TestimonialsSection />
        <NGOSection />
        <EventsSection />
        <MentorSection />
        <FAQSection />
      </main>

      <PublicFooter />
    </div>
  );
}
