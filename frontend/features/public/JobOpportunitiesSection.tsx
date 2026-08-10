"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Briefcase, Clock, ArrowRight, Filter, Search } from "lucide-react";
import jobs from "@/data/jobs.json";

const TYPES = ["All", "Full-Time", "Returnship", "Part-Time", "Government"];

export default function JobOpportunitiesSection() {
  const [activeType, setActiveType] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = jobs.filter((j) => {
    const matchType   = activeType === "All" || j.type === activeType;
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <section id="jobs" className="py-24 px-5 bg-[var(--bg-light)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div className="space-y-3">
            <span className="purple-badge">Job Opportunities</span>
            <h2 className="section-heading">
              Companies That{" "}
              <span style={{ color: "var(--primary)" }}>Want You Back.</span>
            </h2>
            <p className="section-sub max-w-lg">
              300+ employers who actively hire women with career breaks. Filtered and verified.
            </p>
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search role or company..."
              className="pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 w-full sm:w-64"
              style={{ borderColor: "var(--primary-light)", background: "var(--bg-light)", focusRingColor: "var(--primary)" } as React.CSSProperties}
            />
          </div>
        </motion.div>

        {/* Type filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TYPES.map((t) => (
            <button key={t} onClick={() => setActiveType(t)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
              style={activeType === t
                ? { background: "var(--primary)", color: "white" }
                : { background: "white", color: "#6B7280", border: "1.5px solid var(--primary-light)" }
              }>{t}</button>
          ))}
        </div>

        {/* Job cards */}
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((job, i) => (
              <motion.div key={job.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: i * 0.04 }}
                className="card-purple p-5 flex flex-col sm:flex-row sm:items-center gap-4 group"
              >
                {/* Company avatar */}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-sm font-bold text-gray-900"
                  style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
                  {job.company.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    {job.breakFriendly && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold text-gray-900" style={{ background: "var(--secondary)" }}>Break-Friendly</span>
                    )}
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium border" style={{ borderColor: "var(--primary-light)", color: "#6B7280" }}>{job.type}</span>
                  </div>
                  <p className="text-sm font-medium" style={{ color: "var(--primary)" }}>{job.company}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.salary}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Posted {job.posted}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {job.skills.slice(0, 3).map((s) => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-md" style={{ background: "var(--primary-light)", color: "var(--primary-dark)" }}>{s}</span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <p className="text-xs text-gray-500">Deadline: {job.deadline}</p>
                  <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 text-gray-900"
                    style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
                    Apply <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No jobs match your filter. Try a different search.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
