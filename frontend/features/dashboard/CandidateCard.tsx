"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Clock } from "lucide-react";
import { ResumeAnalysis } from "@/types/resume";

export default function CandidateCard({ data }: { data: ResumeAnalysis }) {
  const initials = data.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 col-span-full"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-gray-900 text-xl font-bold shadow-glow-violet">
            {initials}
          </div>
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-surface" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-gray-900 truncate">{data.name}</h2>
          <p className="text-gray-600 font-medium mt-0.5">{data.previous_role}</p>
          <p className="text-xs text-gray-500 mt-1.5 truncate">{data.education}</p>
        </div>

        {/* Stats pills */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl badge-primary text-xs font-medium">
            <Clock className="w-3.5 h-3.5" />
            {data.experience_years} Yrs Experience
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl badge-secondary text-xs font-medium">
            <Briefcase className="w-3.5 h-3.5" />
            {data.previous_role.split(" ")[0]}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl badge-amber text-xs font-medium">
            <GraduationCap className="w-3.5 h-3.5" />
            {data.career_gap.career_gap_years}Y Gap
          </div>
        </div>
      </div>
    </motion.div>
  );
}
