"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, MapPin, TrendingUp } from "lucide-react";
import successStories from "@/data/successStories.json";

export default function SuccessStoriesSection() {
  const [active, setActive] = useState(0);
  const story = successStories[active];

  const CategoryColors: Record<string, { bg: string; text: string }> = {
    Technology:      { bg: "var(--primary-light)", text: "var(--primary-dark)" },
    Entrepreneurship:{ bg: "#F0F9EC", text: "var(--primary)" },
    Livelihood:      { bg: "#E8F5E2", text: "var(--primary-dark)" },
  };
  const cc = CategoryColors[story.category] ?? CategoryColors.Technology;

  return (
    <section id="stories" className="py-24 px-5" style={{ background: "var(--bg-light)" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14 space-y-4">
          <span className="purple-badge">Success Stories</span>
          <h2 className="section-heading">
            Real Women.{" "}
            <span style={{ color: "var(--primary)" }}>Real Transformations.</span>
          </h2>
          <p className="section-sub max-w-lg mx-auto">
            From rural Bihar to Microsoft Bengaluru — these are the journeys that inspire us to do more.
          </p>
        </motion.div>

        {/* Tab selector */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {successStories.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
              style={active === i
                ? { background: "var(--primary)", color: "white", boxShadow: "0 4px 14px rgba(95,141,78,0.3)" }
                : { background: "white", color: "#6B7280", border: "1.5px solid var(--primary-light)" }
              }
            >
              {s.name.split(" ")[0]}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-8"
          >
            {/* Story card - main */}
            <div className="lg:col-span-3 bg-[var(--bg-light)] rounded-3xl p-8 border flex flex-col gap-6" style={{ borderColor: "var(--primary-light)", boxShadow: "0 8px 40px rgba(95,141,78,0.08)" }}>
              {/* Header */}
              <div className="flex items-start gap-4">
                {/* Faceless avatar */}
                <div className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-xl font-bold text-white"
                  style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
                  {story.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{story.name}</h3>
                  <p className="text-sm flex items-center gap-1 text-gray-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" /> {story.location}
                  </p>
                  <span className="inline-block mt-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: cc.bg, color: cc.text }}>
                    {story.category}
                  </span>
                </div>
              </div>

              {/* Transformation */}
              <div className="rounded-2xl p-5 space-y-3" style={{ background: "var(--bg-light)" }}>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">BEFORE</p>
                  <p className="text-sm text-gray-600">{story.before}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, var(--primary-light), var(--primary))" }} />
                  <TrendingUp className="w-4 h-4" style={{ color: "var(--primary)" }} />
                  <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, var(--primary), var(--primary-light))" }} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">AFTER</p>
                  <p className="text-sm font-semibold" style={{ color: "var(--primary-dark)" }}>{story.after}</p>
                </div>
              </div>

              {/* Story */}
              <blockquote className="text-gray-700 text-sm leading-relaxed italic border-l-2 pl-4" style={{ borderColor: "var(--secondary)" }}>
                &ldquo;{story.story}&rdquo;
              </blockquote>

              <div className="flex flex-wrap gap-2">
                {story.skills.map((s: string) => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ background: "var(--primary-light)", color: "var(--primary-dark)" }}>{s}</span>
                ))}
              </div>
            </div>

            {/* Stats sidebar */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="bg-[var(--bg-light)] rounded-3xl p-7 border space-y-4 flex-1" style={{ borderColor: "var(--primary-light)", boxShadow: "0 8px 40px rgba(95,141,78,0.06)" }}>
                <h4 className="font-semibold text-gray-700 text-sm">Journey Snapshot</h4>
                <div className="space-y-4">
                  {[
                    { label: "Income Today", value: story.income },
                    { label: "Time with NayiUdaan", value: story.duration },
                    { label: "Program", value: story.program },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-4 rounded-2xl" style={{ background: "var(--bg-light)" }}>
                      <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">{label}</p>
                      <p className="font-bold text-gray-900 text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nav arrows */}
              <div className="flex gap-3">
                <button onClick={() => setActive((active - 1 + successStories.length) % successStories.length)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border text-sm font-semibold transition-all hover:-translate-y-0.5"
                  style={{ borderColor: "var(--primary-light)", color: "var(--primary)" }}>
                  <ArrowLeft className="w-4 h-4" /> Prev
                </button>
                <button onClick={() => setActive((active + 1) % successStories.length)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
