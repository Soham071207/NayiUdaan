"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, SlidersHorizontal } from "lucide-react";
import { getEmployerMatches } from "@/services/api";
import { Employer } from "@/types/employer";
import EmployerCard from "@/features/employers/EmployerCard";
import { useCareerReport } from "@/context/CareerReportContext";
import { useRouter } from "next/navigation";

const FILTERS = ["All", "Returnship", "Remote-First", "Mentorship", "Flexible Work"];

export default function EmployersPage() {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading]     = useState(true);
  const [activeFilter, setFilter] = useState("All");
  const [sortBy, setSortBy]       = useState<"score" | "name">("score");

  const { report, isLoading } = useCareerReport();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !report) {
      router.push("/upload");
      return;
    }
    
    if (report?.data) {
      // Use cached employer matches from initial resume analysis if available
      if (report.data.employer_matches && report.data.employer_matches.length > 0) {
        setEmployers(report.data.employer_matches);
        setLoading(false);
        return;
      }

      // Fallback: If for some reason matches are missing, fetch them
      const candidate = {
        previous_role: report.data.previous_role || "",
        skills: report.data.skills || [],
        career_gap_years: report.data.career_gap?.career_gap_years || 0,
        preferred_work_mode: "Any",
        preferred_location: "Any",
        target_role: report.data.previous_role || "",
        top_n: 10
      };
      
      getEmployerMatches(candidate)
        .then((res) => setEmployers(res.employers))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [report, isLoading, router]);

  const filtered = employers
    .filter((e) => {
      if (activeFilter === "All") return true;
      if (activeFilter === "Returnship") return e.hasReturnship;
      return e.tags.includes(activeFilter);
    })
    .sort((a, b) =>
      sortBy === "score" ? b.compatibilityScore - a.compatibilityScore : a.name.localeCompare(b.name)
    );

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employer Matches</h1>
            <p className="text-gray-500 text-sm">Companies aligned with your profile and career goals</p>
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "score" | "name")}
            className="bg-surface-2 border border-purple-200 text-gray-700 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-violet-500/50"
          >
            <option value="score">Sort by Compatibility</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeFilter === f
                ? "bg-purple-500/20 border border-violet-500/40 text-violet-300"
                : "glass border-purple-200 text-gray-600 hover:text-gray-800 hover:bg-white/8"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass rounded-2xl h-64 animate-shimmer" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((employer, i) => (
            <EmployerCard key={employer.id} employer={employer} index={i} />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No employers match this filter.</p>
        </div>
      )}
    </div>
  );
}
