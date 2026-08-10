"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle, Circle, ExternalLink, BookOpen } from "lucide-react";
import { RoadmapWeek } from "@/types/resume";
import { cn } from "@/lib/utils";

interface RoadmapTimelineProps {
  weeks: RoadmapWeek[];
}

export default function RoadmapTimeline({ weeks }: RoadmapTimelineProps) {
  const [expanded, setExpanded] = useState<number | null>(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const toggleTask = (key: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const completedWeeks = weeks.filter((w) =>
    w.tasks.every((_, i) => completed.has(`${w.week}-${i}`))
  ).length;

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="glass rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700 font-medium">Overall Progress</span>
          <span className="badge-primary px-2.5 py-1 rounded-lg text-xs font-bold">
            {completedWeeks} / {weeks.length} weeks
          </span>
        </div>
        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
          <motion.div
            animate={{ width: `${(completedWeeks / weeks.length) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500"
          />
        </div>
      </div>

      {/* Weeks */}
      {weeks.map((week, idx) => {
        const isExpanded = expanded === idx;
        const weekCompleted = week.tasks.every((_, i) => completed.has(`${week.week}-${i}`));
        const completedCount = week.tasks.filter((_, i) => completed.has(`${week.week}-${i}`)).length;

        return (
          <motion.div
            key={week.week}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            className={cn(
              "glass rounded-2xl border transition-all duration-300",
              weekCompleted ? "border-violet-500/30" : "border-purple-500/20",
              isExpanded && "border-violet-500/30"
            )}
          >
            {/* Week header */}
            <button
              onClick={() => setExpanded(isExpanded ? null : idx)}
              className="w-full flex items-center gap-4 p-5 text-left"
            >
              {/* Week number */}
              <div className={cn(
                "w-11 h-11 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-xs font-bold",
                weekCompleted
                  ? "bg-emerald-500/20 text-gray-500"
                  : isExpanded
                  ? "bg-purple-50 text-gray-600"
                  : "bg-purple-50 text-gray-500"
              )}>
                <span className="text-[10px] leading-none">WK</span>
                <span className="text-base leading-none">{week.week}</span>
              </div>

              <div className="flex-1 min-w-0">
                <p className={cn(
                  "font-semibold text-sm truncate",
                  weekCompleted ? "text-gray-600" : "text-gray-800"
                )}>
                  {week.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {completedCount}/{week.tasks.length} tasks · {week.resources.length} resources
                </p>
              </div>

              {weekCompleted && <CheckCircle className="w-5 h-5 text-gray-500 flex-shrink-0" />}
              <ChevronDown className={cn(
                "w-4 h-4 text-gray-500 flex-shrink-0 transition-transform duration-200",
                isExpanded && "rotate-180"
              )} />
            </button>

            {/* Expanded content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 space-y-4 border-t border-purple-500/20 pt-4">
                    {/* Tasks */}
                    <div className="space-y-2.5">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tasks</p>
                      {week.tasks.map((task, ti) => {
                        const key = `${week.week}-${ti}`;
                        const done = completed.has(key);
                        return (
                          <button
                            key={ti}
                            onClick={() => toggleTask(key)}
                            className="w-full flex items-start gap-3 text-left group"
                          >
                            {done
                              ? <CheckCircle className="w-4.5 h-4.5 text-gray-500 flex-shrink-0 mt-0.5" />
                              : <Circle className="w-4.5 h-4.5 text-gray-500 flex-shrink-0 mt-0.5 group-hover:text-gray-500 transition-colors" />
                            }
                            <span className={cn(
                              "text-sm transition-colors",
                              done ? "line-through text-gray-500" : "text-gray-700 group-hover:text-gray-800"
                            )}>
                              {task}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Resources */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" /> Resources
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {week.resources.map((res, ri) => (
                          <span key={ri} className="flex items-center gap-1 badge-secondary px-2.5 py-1 rounded-lg text-xs">
                            <ExternalLink className="w-3 h-3" />
                            {res}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
