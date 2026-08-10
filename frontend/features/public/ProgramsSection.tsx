"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Laptop, Users, Scale, Heart, Award } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const PROGRAMS = [
  {
    icon: BrainCircuit,
    title: "AI Career Comeback",
    subtitle: "For career returners",
    description: "AI analyses your gap, skills, and market readiness. Get a personalised 8-week roadmap, ATS resume tips, employer matching, and mock interviews.",
    audience: "Working women on break",
    duration: "8 weeks",
    tag: "Most Popular",
    tagColor: "var(--primary)",
    href: "/upload",
    gradient: "linear-gradient(135deg, #F0F9EC, var(--primary-light))",
  },
  {
    icon: Laptop,
    title: "Digital Skilling",
    subtitle: "For digital beginners",
    description: "Smartphones, internet, government portals, digital payments, and basic computers — in Hindi and regional languages. Completely free.",
    audience: "Homemakers & Rural women",
    duration: "2–4 weeks",
    tag: "Free",
    tagColor: "var(--secondary)",
    href: "#skills",
    gradient: "linear-gradient(135deg, var(--bg-light), #EDF7E9)",
  },
  {
    icon: Award,
    title: "Vocational Certification",
    subtitle: "Trade skills for income",
    description: "Tailoring, beauty & wellness, handicrafts, food processing, nursing aide, and more. Industry-recognised certificates included.",
    audience: "Aspiring self-employed",
    duration: "6–12 weeks",
    tag: "Certification",
    tagColor: "var(--primary)",
    href: "#skills",
    gradient: "linear-gradient(135deg, #F0F9EC, var(--primary-light))",
  },
  {
    icon: Users,
    title: "Mentorship Program",
    subtitle: "One-on-one guidance",
    description: "Get matched with a mentor who has walked your exact path. Regular sessions, personalised advice, and a network that opens doors.",
    audience: "Students & Professionals",
    duration: "3–6 months",
    tag: "Guided",
    tagColor: "var(--secondary)",
    href: "#mentors",
    gradient: "linear-gradient(135deg, var(--bg-light), #EDF7E9)",
  },
  {
    icon: Scale,
    title: "Legal Awareness",
    subtitle: "Know your rights",
    description: "Property rights, domestic violence law, maternity benefits, workplace rights, and access to government schemes. Knowledge is power.",
    audience: "All women",
    duration: "Self-paced",
    tag: "Free",
    tagColor: "var(--primary)",
    href: "#skills",
    gradient: "linear-gradient(135deg, #F0F9EC, var(--primary-light))",
  },
  {
    icon: Heart,
    title: "Wellness & Community",
    subtitle: "Strength in sisterhood",
    description: "Safe community spaces, mental health resources, peer support groups, and celebration of every milestone — big or small.",
    audience: "All women",
    duration: "Ongoing",
    tag: "Community",
    tagColor: "var(--secondary)",
    href: "#volunteer",
    gradient: "linear-gradient(135deg, var(--bg-light), #EDF7E9)",
  },
];

export default function ProgramsSection() {
  return (
    <section id="programs" className="py-24 px-5 bg-[var(--bg-light)]">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14 space-y-4">
          <span className="purple-badge">Our Programs</span>
          <h2 className="section-heading">
            Find Your{" "}
            <span style={{ color: "var(--primary)" }}>Right Path.</span>
          </h2>
          <p className="section-sub max-w-xl mx-auto">
            Six curated programs designed for every stage of a woman's journey — from a first phone to a C-suite return.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROGRAMS.map((prog, i) => (
            <motion.div
              key={prog.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="relative rounded-3xl p-7 border group hover:shadow-purple-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
              style={{ background: prog.gradient, borderColor: "var(--primary-light)" }}
            >
              {/* Tag */}
              <span className="absolute top-5 right-5 text-[11px] font-bold px-2.5 py-1 rounded-full text-white"
                style={{ background: prog.tagColor }}>
                {prog.tag}
              </span>

              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-[var(--bg-light)] shadow-purple-sm">
                <prog.icon className="w-6 h-6" style={{ color: "var(--primary)" }} />
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--secondary)" }}>{prog.subtitle}</p>
                  <h3 className="text-lg font-bold text-gray-900">{prog.title}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{prog.description}</p>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-5 border-t flex items-center justify-between" style={{ borderColor: "var(--primary-light)" }}>
                <div>
                  <p className="text-[11px] text-gray-400">For</p>
                  <p className="text-xs font-medium text-gray-600">{prog.audience}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{prog.duration}</p>
                </div>
                <Link href={prog.href}
                  className="flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 group-hover:gap-2.5"
                  style={{ color: "var(--primary)" }}>
                  Explore <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
