"use client";

import { motion } from "framer-motion";
import {
  FileSearch, BrainCircuit, TrendingUp, Map, Building2, MessageSquare,
} from "lucide-react";

const FEATURES = [
  {
    icon: FileSearch,
    title: "Resume Intelligence",
    description: "AI extracts your skills, experience, education, and certifications with precision.",
    color: "from-violet-500/20 to-violet-600/10",
    iconColor: "text-violet-400",
    borderColor: "hover:border-violet-500/40",
  },
  {
    icon: BrainCircuit,
    title: "Career Gap Detection",
    description: "Understands your break context and identifies transferable skills from your break period.",
    color: "from-cyan-500/20 to-cyan-600/10",
    iconColor: "text-cyan-400",
    borderColor: "hover:border-cyan-500/40",
  },
  {
    icon: TrendingUp,
    title: "Market Intelligence",
    description: "Compares your skills against current market demand and calculates your Career Readiness Score.",
    color: "from-emerald-500/20 to-emerald-600/10",
    iconColor: "text-emerald-400",
    borderColor: "hover:border-emerald-500/40",
  },
  {
    icon: Map,
    title: "8-Week Roadmap",
    description: "A personalised, week-by-week upskilling plan to get you job-ready in 2 months.",
    color: "from-amber-500/20 to-amber-600/10",
    iconColor: "text-amber-400",
    borderColor: "hover:border-amber-500/40",
  },
  {
    icon: Building2,
    title: "Employer Matching",
    description: "Discover companies with active returnship programs compatible with your background.",
    color: "from-pink-500/20 to-pink-600/10",
    iconColor: "text-pink-400",
    borderColor: "hover:border-pink-500/40",
  },
  {
    icon: MessageSquare,
    title: "Interview Coach",
    description: "AI-powered mock interviews with real-time feedback for technical and behavioral rounds.",
    color: "from-indigo-500/20 to-indigo-600/10",
    iconColor: "text-indigo-400",
    borderColor: "hover:border-indigo-500/40",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function FeaturesGrid() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 space-y-3"
        >
          <p className="text-sm font-medium badge-violet inline-flex px-3 py-1 rounded-full">
            Everything You Need
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Six AI Engines.{" "}
            <span className="text-gradient">One Platform.</span>
          </h2>
          <p className="max-w-xl mx-auto text-slate-400 text-lg">
            Built specifically for women returning to work, with deep empathy and cutting-edge AI.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((feat) => (
            <motion.div
              key={feat.title}
              variants={item}
              className={`glass rounded-2xl p-6 card-hover cursor-default border border-purple-200 ${feat.borderColor} transition-all duration-300`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-4`}>
                <feat.icon className={`w-6 h-6 ${feat.iconColor}`} />
              </div>

              <h3 className="font-semibold text-base text-slate-100 mb-2">{feat.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
