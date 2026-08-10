"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
// Note: upload page uses dark-shell via wrapper div below
import { Sparkles, ArrowRight, AlertCircle } from "lucide-react";
import DropZone from "@/features/upload/DropZone";
import ProcessingSteps, { PROCESSING_STEPS } from "@/features/upload/ProcessingSteps";
import { uploadResume } from "@/services/api";
import { useCareerReport } from "@/context/CareerReportContext";
import { sleep } from "@/lib/utils";

type Stage = "idle" | "processing" | "done" | "error";

export default function UploadPage() {
  const router = useRouter();
  const { setReport } = useCareerReport();

  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((selected: File) => {
    setFile(selected);
    setStage("idle");
    setError(null);
  }, []);

  const handleAnalyse = async () => {
    if (!file) return;
    setStage("processing");
    setCurrentStep(0);
    setError(null);

    try {
      // Simulate sequential AI steps for UX drama
      for (let i = 0; i < PROCESSING_STEPS.length - 1; i++) {
        setCurrentStep(i);
        await sleep(650 + Math.random() * 400);
      }
      setCurrentStep(PROCESSING_STEPS.length - 1);

      // Real API call (intercepted by Mirage in dev)
      const response = await uploadResume(file);

      if (!response.success) throw new Error("Analysis failed. Please try again.");

      setReport(response);
      setStage("done");

      // Navigate after a brief celebratory pause
      await sleep(900);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please retry.");
      setStage("error");
    }
  };

  return (
    <div className="font-jakarta bg-[#F5FAF4] text-gray-900 selection:bg-violet-600/20 min-h-screen">
      <main className="flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden min-h-screen">
        {/* Decorative blobs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#EAF5E4] blur-3xl pointer-events-none -z-10" />

        <div className="relative z-10 w-full max-w-xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-violet-600 flex items-center justify-center mx-auto shadow-green-md">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Upload Your <span style={{ color: "#5F8D4E" }}>Resume</span>
            </h1>
            <p className="text-gray-600 text-base">
              Our AI will analyse your career gap, skills, and market readiness in seconds.
            </p>
          </motion.div>

          {/* Drop Zone */}
          <AnimatePresence mode="wait">
            {stage === "idle" || stage === "error" ? (
              <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <DropZone onFileSelect={handleFileSelect} disabled={stage === "processing"} />

                {/* Error */}
                {error && (
                  <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Analyse button */}
                {file && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleAnalyse}
                    className="mt-6 w-full flex items-center justify-center gap-3 py-4 rounded-2xl btn-primary text-white font-semibold text-base transition-all duration-300 hover:scale-[1.02] shadow-green-md"
                  >
                    <Sparkles className="w-5 h-5" />
                    Analyse My Career
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Processing */}
          <AnimatePresence>
            {(stage === "processing" || stage === "done") && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <p className="text-gray-900 font-semibold text-lg">
                    {stage === "done" ? "✨ Analysis Complete!" : "AI is analysing your resume..."}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {stage === "done" ? "Redirecting you to your dashboard..." : "Our AI is currently running deeply personalised analysis."}
                  </p>
                  {stage === "processing" && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="text-xs text-amber-700 font-medium flex items-center justify-center gap-1.5">
                        <AlertCircle className="w-4 h-4" />
                        Please don't refresh. This takes about 1-2 minutes using the free AI tier.
                      </p>
                    </div>
                  )}
                </div>
                <ProcessingSteps currentStep={currentStep} done={stage === "done"} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
