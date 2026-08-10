"use client";

import { motion } from "framer-motion";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { Market } from "@/types/resume";
import { getScoreColor, getScoreGlow } from "@/lib/utils";

export default function ReadinessScoreCard({ market }: { market: Market }) {
  const score = market.career_readiness_score;
  const scoreColor = getScoreColor(score);
  const glowColor = getScoreGlow(score);

  const chartData = [
    { name: "score", value: score, fill: glowColor },
    { name: "gap",   value: 100 - score, fill: "transparent" },
  ];

  const label =
    score >= 80 ? "Excellent" :
    score >= 65 ? "Good"      :
    score >= 50 ? "Fair"      : "Needs Work";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="glass rounded-2xl p-6 flex flex-col items-center gap-4 h-full"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 w-full">
        <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-gray-500" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">Career Readiness</h3>
          <p className="text-xs text-gray-500">Market Score</p>
        </div>
      </div>

      {/* Radial Chart */}
      <div className="relative w-40 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%" cy="50%"
            innerRadius="70%" outerRadius="100%"
            barSize={10} startAngle={90} endAngle={-270}
            data={[{ value: score, fill: glowColor }]}
          >
            <RadialBar background={{ fill: "rgba(255,255,255,0.04)" }} dataKey="value" cornerRadius={10} />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Score label */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ filter: `drop-shadow(0 0 12px ${glowColor}60)` }}
        >
          <span className={`text-3xl font-bold ${scoreColor}`}>{score}</span>
          <span className="text-xs text-gray-500">/ 100</span>
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <p className={`font-semibold text-base ${scoreColor}`}>{label}</p>
        <p className="text-xs text-gray-500 mt-1 max-w-[180px] text-center leading-relaxed">{market.reason}</p>
      </div>
    </motion.div>
  );
}
