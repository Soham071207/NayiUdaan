"use client";

import { motion } from "framer-motion";
import { Building2, MapPin, Clock, Briefcase, Star, ExternalLink } from "lucide-react";
import { Employer } from "@/types/employer";
import { cn } from "@/lib/utils";

export default function EmployerCard({ employer, index }: { employer: Employer; index: number }) {
  const scoreColor =
    employer.compatibilityScore >= 85 ? "text-cyan-600" :
    employer.compatibilityScore >= 70 ? "text-amber-400"   : "text-gray-600";

  const scoreBg =
    employer.compatibilityScore >= 85 ? "bg-cyan-100 border-cyan-500/30" :
    employer.compatibilityScore >= 70 ? "bg-amber-500/15 border-amber-500/30"     : "bg-purple-100/30 border-purple-300";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="glass rounded-2xl p-5 space-y-4 card-hover border border-purple-200"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        {/* Logo + name */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 border border-purple-200 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-gray-800">{employer.logo}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{employer.name}</h3>
            <p className="text-xs text-gray-500">{employer.industry}</p>
          </div>
        </div>

        {/* Compatibility score */}
        <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold flex-shrink-0", scoreBg)}>
          <Star className={cn("w-3.5 h-3.5", scoreColor)} />
          <span className={scoreColor}>{employer.compatibilityScore}%</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{employer.description}</p>

      {/* Meta */}
      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {employer.location}
        </span>
        {employer.hasReturnship && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> Returnship: {employer.returnshipDuration}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Briefcase className="w-3 h-3" /> {employer.stipend}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {employer.hasReturnship && (
          <span className="badge-violet px-2 py-0.5 rounded-md text-[10px] font-semibold">Returnship</span>
        )}
        {employer.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="badge-cyan px-2 py-0.5 rounded-md text-[10px]">{tag}</span>
        ))}
      </div>

      {/* Open roles */}
      <div className="pt-1">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">Open Roles</p>
        <div className="flex flex-wrap gap-1.5">
          {employer.openRoles.map((role) => (
            <span key={role} className="bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg text-xs text-gray-800">
              {role}
            </span>
          ))}
        </div>
      </div>

      {/* Apply button */}
      <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-violet-500/30 text-violet-700 text-sm font-medium hover:bg-violet-50 transition-all duration-200">
        <ExternalLink className="w-3.5 h-3.5" />
        View Opportunity
      </button>
    </motion.div>
  );
}
