"use client";

import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const PROCESSING_STEPS = [
  { id: "parse",   label: "Reading & Parsing Resume",        detail: "Extracting text and structure from PDF" },
  { id: "intel",   label: "Resume Intelligence",             detail: "Identifying skills, roles, and experience" },
  { id: "gap",     label: "Career Gap Detection",            detail: "Analysing career timeline and context" },
  { id: "market",  label: "Market Intelligence",             detail: "Comparing skills against market demand" },
  { id: "roadmap", label: "Generating 8-Week Roadmap",       detail: "Building your personalised recovery plan" },
  { id: "ats",     label: "Resume Optimisation",             detail: "ATS scoring and improvement suggestions" },
  { id: "report",  label: "Compiling Career Report",         detail: "Assembling your executive career summary" },
];

interface ProcessingStepsProps {
  currentStep: number; // index of step currently running
  done: boolean;
}

export default function ProcessingSteps({ currentStep, done }: ProcessingStepsProps) {
  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      {PROCESSING_STEPS.map((step, i) => {
        const isComplete = done || i < currentStep;
        const isActive   = !done && i === currentStep;
        const isPending  = !done && i > currentStep;

        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className={cn(
              "flex items-center gap-3.5 px-4 py-3 rounded-xl border transition-all duration-500 bg-[var(--bg-light)]",
              isComplete && "border-[#7FB77E] bg-[#F5FAF4]",
              isActive   && "border-violet-600 shadow-sm",
              isPending  && "border-gray-200 opacity-60"
            )}
          >
            {/* Status icon */}
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
              {isComplete ? (
                <CheckCircle className="w-5 h-5 text-[#7FB77E]" />
              ) : isActive ? (
                <Loader2 className="w-5 h-5 text-[#5F8D4E] animate-spin" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm font-medium leading-tight",
                isComplete && "text-[#5F8D4E]",
                isActive   && "text-gray-900",
                isPending  && "text-gray-400"
              )}>
                {step.label}
              </p>
              {isActive && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-xs text-gray-500 mt-0.5"
                >
                  {step.detail}
                </motion.p>
              )}
            </div>

            {/* Step number */}
            <span className={cn(
              "text-xs font-mono flex-shrink-0",
              isComplete ? "text-[#7FB77E]" : "text-gray-300"
            )}>
              {String(i + 1).padStart(2, "0")}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
