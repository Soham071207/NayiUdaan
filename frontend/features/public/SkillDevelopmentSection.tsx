"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Award, Users, Star, Clock, Globe } from "lucide-react";
import courses from "@/data/courses.json";

const CATEGORIES = ["All", "Technology", "Language", "Vocational", "Finance", "Life Skills"];
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Technology: BookOpen, Language: Globe, Vocational: Award,
  Finance: Star, "Life Skills": Users,
};

export default function SkillDevelopmentSection() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? courses : courses.filter((c) => c.category === active);

  return (
    <section id="skills" className="py-24 px-5" style={{ background: "var(--bg-light)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 space-y-4">
          <span className="purple-badge">Skill Development</span>
          <h2 className="section-heading">
            Learn at Your{" "}
            <span style={{ color: "var(--primary)" }}>Own Pace.</span>
          </h2>
          <p className="section-sub max-w-xl mx-auto">
            200+ courses in 12 Indian languages. Beginner to advanced. Many completely free with government-recognised certificates.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={active === cat
                ? { background: "var(--primary)", color: "white", boxShadow: "0 4px 14px rgba(95,141,78,0.3)" }
                : { background: "white", color: "#6B7280", border: "1.5px solid var(--primary-light)" }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((course, i) => {
            const CatIcon = CATEGORY_ICONS[course.category] ?? BookOpen;
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="card-purple p-5 flex flex-col group"
              >
                {/* Category icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--primary-light)" }}>
                    <CatIcon className="w-5 h-5" style={{ color: "var(--primary)" }} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {course.free
                      ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-gray-900" style={{ background: "var(--primary)" }}>FREE</span>
                      : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-gray-900" style={{ background: "var(--secondary)" }}>{course.price}</span>
                    }
                    {course.certificate && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>Cert.</span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--secondary)" }}>{course.category} · {course.level}</p>
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug">{course.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{course.description}</p>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-gray-500" style={{ borderColor: "var(--primary-light)" }}>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-gray-600">{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {course.enrolled.toLocaleString("en-IN")}
                  </div>
                </div>

                <button className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: "var(--primary-light)", color: "var(--primary-dark)" }}>
                  Enrol Now
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
