"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Map } from "lucide-react";
import { useCareerReport } from "@/context/CareerReportContext";
import RoadmapTimeline from "@/features/roadmap/RoadmapTimeline";

export default function RoadmapPage() {
  const { report, isLoading } = useCareerReport();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !report) router.push("/upload");
  }, [isLoading, report, router]);

  if (isLoading || !report) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const weeks = report.data.roadmap.roadmap;
  const name  = report.data.name.split(" ")[0];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-3xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Map className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{name}&apos;s 8-Week Roadmap</h1>
            <p className="text-gray-500 text-sm">Your personalised career recovery plan</p>
          </div>
        </div>

        {/* Priority skills */}
        <div className="glass rounded-xl p-4 flex items-center gap-3">
          <p className="text-sm text-gray-600">
            🎯 Your top priority skills to learn:{" "}
            {report.data.market.priority_to_learn.map((s, i) => (
              <span key={s}>
                <span className="text-violet-600 font-semibold">{s}</span>
                {i < report.data.market.priority_to_learn.length - 1 ? " & " : ""}
              </span>
            ))}
          </p>
        </div>
      </motion.div>

      <RoadmapTimeline weeks={weeks} />
    </div>
  );
}
