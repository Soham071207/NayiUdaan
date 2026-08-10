"use client";

import { motion } from "framer-motion";
import { FileCheck, CheckCircle, Lightbulb } from "lucide-react";
import { ResumeReview } from "@/types/resume";
import { getScoreColor } from "@/lib/utils";

export default function ATSScoreCard({ review }: { review: ResumeReview }) {
  const score = review.ats_score;
  const scoreColor = getScoreColor(score);
  const barWidth = `${score}%`;
  const barColor =
    score >= 80 ? "from-emerald-500 to-emerald-400" :
    score >= 60 ? "from-amber-500 to-amber-400"     : "from-red-500 to-red-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="glass rounded-2xl p-6 space-y-5 h-full"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center">
          <FileCheck className="w-5 h-5 text-cyan-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">ATS Score</h3>
          <p className="text-xs text-gray-500">Resume Compatibility</p>
        </div>
        <span className={`ml-auto text-2xl font-bold ${scoreColor}`}>{score}<span className="text-sm text-gray-500 font-normal">/100</span></span>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="h-2 rounded-full bg-purple-50 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: barWidth }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
          />
        </div>
        <p className="text-xs text-gray-500">
          {score >= 80 ? "Excellent ATS compatibility" :
           score >= 60 ? "Good. A few tweaks needed" : "Needs significant improvement"}
        </p>
      </div>

      <div className="h-px bg-purple-50" />

      {/* Tips */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <p className="text-sm font-semibold text-gray-800">Resume Tips</p>
        </div>
        {review.resume_tips.slice(0, 4).map((tip, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 leading-relaxed">{tip}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
