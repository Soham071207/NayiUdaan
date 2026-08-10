"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Calendar, Info } from "lucide-react";
import { CareerGap } from "@/types/resume";

export default function CareerGapCard({ gap }: { gap: CareerGap }) {
  const confidenceColor =
    gap.confidence === "high" ? "text-emerald-400" :
    gap.confidence === "medium" ? "text-amber-400" : "text-red-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-2xl p-6 space-y-4 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Career Gap</h3>
            <p className="text-xs text-gray-500">Detected</p>
          </div>
        </div>
        <span className="badge-amber px-2.5 py-1 rounded-lg text-xs font-bold">
          {gap.career_gap_years} {gap.career_gap_years === 1 ? "Year" : "Years"}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-purple-50" />

      {/* Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>Last Active</span>
          </div>
          <span className="text-gray-800 font-medium">{gap.last_working_year}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Info className="w-3.5 h-3.5" />
            <span>Confidence</span>
          </div>
          <span className={`font-medium capitalize ${confidenceColor}`}>{gap.confidence}</span>
        </div>
      </div>

      {/* Reasoning */}
      <div className="rounded-xl bg-white/4 border border-white/6 px-4 py-3">
        <p className="text-xs text-gray-500 leading-relaxed">{gap.reasoning}</p>
      </div>
    </motion.div>
  );
}
