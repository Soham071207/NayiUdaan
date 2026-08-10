"use client";

import { motion } from "framer-motion";
import { Zap, Target } from "lucide-react";
import { Market } from "@/types/resume";

export default function SkillsCard({ market }: { market: Market }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-2xl p-6 space-y-5 h-full"
    >
      {/* Strong skills */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" />
          <h3 className="font-semibold text-gray-900 text-sm">Strong Skills</h3>
          <span className="ml-auto text-xs text-gray-500">{market.strong_skills.length} skills</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {market.strong_skills.map((skill) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="badge-primary px-2.5 py-1 rounded-lg text-xs font-medium"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="h-px bg-purple-50" />

      {/* Missing skills */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-red-400" />
          <h3 className="font-semibold text-gray-900 text-sm">Skills to Acquire</h3>
          <span className="ml-auto text-xs text-gray-500">{market.missing_skills.length} skills</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {market.missing_skills.map((skill) => {
            const isPriority = market.priority_to_learn.includes(skill);
            return (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium ${isPriority ? "badge-amber" : "badge-red"}`}
              >
                {isPriority ? "★ " : ""}{skill}
              </motion.span>
            );
          })}
        </div>
        <p className="text-xs text-gray-600">★ = High priority</p>
      </div>
    </motion.div>
  );
}
