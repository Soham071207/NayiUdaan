"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, FileText, MessageSquare, Linkedin, Briefcase } from "lucide-react";
import { getGapExplanations } from "@/services/api";
import { GapExplanationSet } from "@/types/career_coach";

export default function GapCoach() {
  const [targetRole, setTargetRole] = useState("");
  const [previousRole, setPreviousRole] = useState("");
  const [gapYears, setGapYears] = useState("2");
  const [reason, setReason] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GapExplanationSet | null>(null);

  const handleGenerate = async () => {
    if (!targetRole.trim()) return;
    setLoading(true);
    try {
      const res = await getGapExplanations({
        target_role: targetRole,
        previous_role: previousRole || undefined,
        career_gap: true,
        gap_years: parseFloat(gapYears) || 0,
        reason: reason || undefined
      });
      setResults(res.explanations);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!results ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="glass p-6 rounded-2xl border border-purple-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Target Role *</label>
                  <input 
                    type="text" 
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Product Manager" 
                    className="w-full bg-white/50 border border-purple-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-violet-500/50 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Previous Role (Optional)</label>
                  <input 
                    type="text" 
                    value={previousRole}
                    onChange={(e) => setPreviousRole(e.target.value)}
                    placeholder="e.g. Software Engineer" 
                    className="w-full bg-white/50 border border-purple-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-violet-500/50 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Gap Duration (Years)</label>
                  <input 
                    type="number" 
                    value={gapYears}
                    onChange={(e) => setGapYears(e.target.value)}
                    className="w-full bg-white/50 border border-purple-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-violet-500/50 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Reason for Gap (Optional)</label>
                  <input 
                    type="text" 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Caregiving, Relocation" 
                    className="w-full bg-white/50 border border-purple-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-violet-500/50 outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!targetRole.trim() || loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold disabled:opacity-50 hover:from-violet-500 hover:to-cyan-500 transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {loading ? "Generating Scripts..." : "Generate Gap Explanations"}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Resume Summary */}
              <div className="glass p-5 rounded-2xl border border-violet-500/20 space-y-3">
                <div className="flex items-center gap-2 text-violet-400">
                  <FileText className="w-4 h-4" />
                  <h3 className="font-semibold text-sm uppercase tracking-wide">Resume Summary</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{results.short_explanation}</p>
              </div>

              {/* LinkedIn */}
              <div className="glass p-5 rounded-2xl border border-blue-500/20 space-y-3">
                <div className="flex items-center gap-2 text-blue-400">
                  <Linkedin className="w-4 h-4" />
                  <h3 className="font-semibold text-sm uppercase tracking-wide">LinkedIn About</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{results.professional_version}</p>
              </div>

              {/* Cover Letter */}
              <div className="glass p-5 rounded-2xl border border-emerald-500/20 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Briefcase className="w-4 h-4" />
                  <h3 className="font-semibold text-sm uppercase tracking-wide">Cover Letter</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{results.detailed_explanation}</p>
              </div>

              {/* Interview Script */}
              <div className="glass p-5 rounded-2xl border border-amber-500/20 space-y-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <MessageSquare className="w-4 h-4" />
                  <h3 className="font-semibold text-sm uppercase tracking-wide">Interview Script</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{results.interview_answer}</p>
              </div>
            </div>

            <button
              onClick={() => setResults(null)}
              className="px-6 py-2.5 rounded-xl bg-white/50 border border-purple-200 text-gray-900 text-sm font-semibold hover:bg-white/5"
            >
              Start Over
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
