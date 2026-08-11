import type { Metadata } from "next";
import "./globals.css";
import { CareerReportProvider } from "@/context/CareerReportContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: {
    template: "%s | NayiUdaan",
    default: "NayiUdaan — Empowering Every Indian Woman",
  },
  description:
    "NayiUdaan is India's premier AI-powered women empowerment platform offering career guidance, skill development, mentorship, and returnship opportunities.",
  keywords: ["women empowerment", "career comeback", "skill development", "India", "returnship", "mentorship", "jobs for women"],
  authors: [{ name: "NayiUdaan Team" }],
  openGraph: {
    title: "NayiUdaan — Empowering Every Indian Woman",
    description: "Skills. Jobs. Mentorship. Community. For every woman in India.",
    url: "https://nayiudaan.in",
    siteName: "NayiUdaan",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NayiUdaan — Empowering Every Indian Woman",
    description: "Join India's premier AI-powered career comeback platform for women.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-jakarta antialiased">
        <AuthProvider>
          <CareerReportProvider>
            <div className="cosmic-element">
              <div className="stars-layer"></div>
              <div className="wind-wave"></div>
              <div className="ice-crystal"></div>
            </div>
            {children}
          </CareerReportProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
