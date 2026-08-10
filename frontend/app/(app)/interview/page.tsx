"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import InterviewCoach from "@/features/interview/InterviewCoach";

export default function InterviewPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-3xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Interview Coach</h1>
            <p className="text-gray-500 text-sm">Practice with real questions and get instant AI feedback</p>
          </div>
        </div>

        {/* Tips banner */}
        <div className="glass rounded-xl p-4 flex items-start gap-3 border border-amber-200">
          <span className="text-lg flex-shrink-0">💡</span>
          <div>
            <p className="text-sm font-medium text-amber-600">Pro Tip</p>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
              For behavioural questions, use the <span className="text-amber-600 font-semibold">STAR method</span> — Situation, Task, Action, Result. 
              Aim for 150–250 word answers with a clear outcome.
            </p>
          </div>
        </div>
      </motion.div>

      <InterviewCoach />
    </div>
  );
}
