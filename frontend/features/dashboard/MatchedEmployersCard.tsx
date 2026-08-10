"use client";

import { motion } from "framer-motion";
import { Building2, ArrowUpRight, Target } from "lucide-react";
import Link from "next/link";

interface EmployerMatch {
  id: string;
  name: string;
  industry: string;
  compatibility_score: number;
  match_reasons: string[];
  gap_areas: string[];
  culture_fit: string;
  hasReturnship: boolean;
  returnshipProgramName?: string;
  returnshipConversionRate?: number;
}

interface ApplicationStrategy {
  strategy_summary: string;
  priority_order: {
    rank: number;
    employer_id: string;
    employer_name: string;
    why_first: string;
    apply_by: string;
    key_action_before_applying: string;
  }[];
  overall_tips: string[];
}

interface Props {
  matches: EmployerMatch[];
  strategy: ApplicationStrategy;
}

export default function MatchedEmployersCard({ matches, strategy }: Props) {
  if (!matches || matches.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass rounded-2xl p-6 space-y-6"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-cyan-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">AI Employer Matches</h3>
          <p className="text-xs text-gray-500">Top companies that fit your profile</p>
        </div>
      </div>

      <div className="h-px bg-purple-50" />
      
      {/* Strategy Summary */}
      {strategy && strategy.strategy_summary && (
        <div className="rounded-xl bg-purple-500/10 border border-violet-500/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-700">Application Strategy</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{strategy.strategy_summary}</p>
        </div>
      )}

      {/* Employers List */}
      <div className="space-y-4">
        {matches.slice(0, 3).map((match, idx) => {
          // Find the corresponding strategy for this employer
          const applyStrategy = strategy?.priority_order?.find(p => p.employer_id === match.id);
          
          return (
            <div key={match.id} className="p-4 rounded-xl border border-purple-500/20 bg-purple-50 hover:bg-white/10 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 text-base">{match.name}</span>
                    {match.hasReturnship && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-cyan-500/30">
                        {match.returnshipProgramName || "Returnship"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{match.industry}</p>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className="text-2xl font-black bg-gradient-to-br from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    {match.compatibility_score}%
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Match Score</span>
                </div>
              </div>

              {match.match_reasons && match.match_reasons.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {match.match_reasons.slice(0, 2).map((reason, i) => (
                    <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              )}
              
              {applyStrategy && (
                <div className="mt-4 pt-3 border-t border-purple-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500">Apply by:</span>
                    <span className="font-semibold text-cyan-300">{applyStrategy.apply_by}</span>
                  </div>
                  <Link 
                    href={`/employers/${match.id}`}
                    className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-600 transition-colors"
                  >
                    View Details <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="pt-2 flex justify-center">
        <Link href="/employers" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
          View all matches &rarr;
        </Link>
      </div>
    </motion.div>
  );
}
