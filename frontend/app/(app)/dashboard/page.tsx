"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Map, Building2, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useCareerReport } from "@/context/CareerReportContext";
import CandidateCard from "@/features/dashboard/CandidateCard";
import CareerGapCard from "@/features/dashboard/CareerGapCard";
import ReadinessScoreCard from "@/features/dashboard/ReadinessScoreCard";
import SkillsCard from "@/features/dashboard/SkillsCard";
import ATSScoreCard from "@/features/dashboard/ATSScoreCard";
import MatchedEmployersCard from "@/features/dashboard/MatchedEmployersCard";

const QUICK_LINKS = [
  { href: "/roadmap",   label: "View My Roadmap",    icon: Map,          color: "from-violet-500/20 to-violet-600/10", accent: "text-gray-500", border: "hover:border-violet-500/30" },
  { href: "/employers", label: "Browse Employers",   icon: Building2,    color: "from-cyan-500/20 to-cyan-600/10",    accent: "text-cyan-600",   border: "hover:border-cyan-500/30" },
  { href: "/interview", label: "Practice Interview", icon: MessageSquare,color: "from-emerald-500/20 to-emerald-600/10", accent: "text-gray-500", border: "hover:border-cyan-500/30" },
];

export default function DashboardPage() {
  const { report, isLoading } = useCareerReport();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !report) {
      router.push("/upload");
    }
  }, [isLoading, report, router]);

  if (isLoading || !report) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const data = report.data;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Page title */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">Career Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Your personalised AI career analysis for{" "}
          <span className="text-gray-500">{report.filename}</span>
        </p>
      </motion.div>

      {/* Candidate card — full width */}
      <div className="grid grid-cols-1 gap-5">
        <CandidateCard data={data} />
      </div>

      {/* Middle row: Gap + Score + Skills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <CareerGapCard gap={data.career_gap} />
        <ReadinessScoreCard market={data.market} />
        <SkillsCard market={data.market} />
      </div>

      {/* ATS Score + Executive Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ATSScoreCard review={data.resume_review} />

        {/* Executive Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Executive Summary</h3>
              <p className="text-xs text-gray-500">AI Career Report</p>
            </div>
          </div>

          <div className="h-px bg-purple-50" />

          <p className="text-gray-500 text-sm leading-relaxed">{data.career_report.executive_summary}</p>

          <div className="rounded-xl bg-purple-500/8 border border-violet-500/20 px-4 py-3">
            <p className="text-xs text-gray-600 font-medium mb-1">Overall Recommendation</p>
            <p className="text-xs text-gray-500 leading-relaxed">{data.career_report.overall_recommendation}</p>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Estimated Return Time</span>
            <span className="badge-primary px-2.5 py-1 rounded-lg text-xs font-bold">
              {data.career_report.estimated_return_time}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Professional Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass rounded-2xl p-6 space-y-3"
      >
        <h3 className="font-semibold text-gray-900 text-sm">✨ AI-Generated Professional Summary</h3>
        <p className="text-gray-700 text-sm leading-relaxed italic border-l-2 border-violet-500/50 pl-4">
          &ldquo;{data.resume_review.professional_summary}&rdquo;
        </p>
      </motion.div>

      {/* Matched Employers Section */}
      {data.employer_matches && data.application_strategy && (
        <MatchedEmployersCard 
          matches={data.employer_matches} 
          strategy={data.application_strategy} 
        />
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {QUICK_LINKS.map(({ href, label, icon: Icon, color, accent, border }) => (
          <Link
            key={href}
            href={href}
            className={`group glass rounded-2xl p-5 flex items-center gap-4 border border-purple-500/20 ${border} transition-all duration-200 hover:-translate-y-1`}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${accent}`} />
            </div>
            <span className="font-medium text-gray-700 text-sm flex-1">{label}</span>
            <ArrowRight className={`w-4 h-4 ${accent} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
          </Link>
        ))}
      </div>
    </div>
  );
}
