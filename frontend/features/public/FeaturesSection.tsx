"use client";

import { motion } from "framer-motion";
import { Sparkles, HeartHandshake, BadgeCheck, BookHeart, ShieldCheck, HandHeart } from "lucide-react";

const FEATURES = [
  { icon: Sparkles, title: "AI Career Analysis", description: "Upload your resume. Our AI analyses your career gap, skills, and market readiness in seconds — with a personalised 8-week recovery plan.", color: "var(--primary)" },
  { icon: BookHeart,     title: "Multilingual Courses", description: "200+ courses in Hindi, English, Tamil, Telugu, Bengali, and 8 more languages. From digital literacy to professional certifications.", color: "var(--secondary)" },
  { icon: HeartHandshake,        title: "Expert Mentorship", description: "One-on-one sessions with 500+ verified mentors — successful women professionals who have walked the path before you.", color: "var(--primary)" },
  { icon: BadgeCheck,    title: "Verified Job Board", description: "300+ employers actively seeking women returners. Filter by location, domain, type, and break-friendliness.", color: "var(--secondary)" },
  { icon: ShieldCheck,        title: "Legal & Financial Aid", description: "Know your rights. Understand government schemes, property law, maternity benefits, and financial planning.", color: "var(--primary)" },
  { icon: HandHeart,        title: "Community & Support", description: "Safe, private community groups. Share stories, seek advice, celebrate wins. You are never alone in this journey.", color: "var(--secondary)" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 px-5 overflow-hidden" style={{ background: "linear-gradient(135deg, var(--bg-light) 0%, rgba(124, 58, 237, 0.1) 100%)" }}>
      {/* Decorative blobs for depth */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-transparent rounded-full blur-3xl opacity-50 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--secondary)] rounded-full blur-3xl opacity-10 translate-y-1/2 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16 space-y-4">
          <span className="purple-badge">Why NayiUdaan?</span>
          <h2 className="section-heading">
            Everything You Need,{" "}
            <span style={{ color: "var(--primary)" }}>In One Place.</span>
          </h2>
          <p className="section-sub max-w-xl mx-auto">
            We are not a job portal. We are your complete career and life partner — built specifically for women in India.
          </p>
        </motion.div>

        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat) => (
            <motion.div
              key={feat.title}
              variants={item}
              className="card-purple p-7 group cursor-default"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                style={{ background: feat.color + "18", border: `1.5px solid ${feat.color}25` }}>
                <feat.icon className="w-6 h-6" style={{ color: feat.color }} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2.5 text-base">{feat.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feat.description}</p>
              <div className="mt-5 h-0.5 rounded-full w-0 group-hover:w-full transition-all duration-500"
                style={{ background: `linear-gradient(90deg, ${feat.color}, transparent)` }} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
