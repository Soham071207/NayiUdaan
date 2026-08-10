"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import GapCoach from "@/features/gap-coach/GapCoach";

export default function GapCoachPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Career Gap Coach</h1>
            <p className="text-gray-500 text-sm">Generate confident, professional scripts to explain your career break.</p>
          </div>
        </div>

        {/* Tips banner */}
        <div className="glass rounded-xl p-4 flex items-start gap-3 border border-amber-200 mt-4">
          <span className="text-lg flex-shrink-0">💡</span>
          <div>
            <p className="text-sm font-medium text-amber-600">Why this matters</p>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
              Employers appreciate honesty and confidence. Your career gap is a part of your journey, not a hole in it. Let AI help you frame it as a period of growth.
            </p>
          </div>
        </div>
      </motion.div>

      <GapCoach />
    </div>
  );
}
