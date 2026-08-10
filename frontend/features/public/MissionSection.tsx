"use client";

import { motion } from "framer-motion";
import { Shield, BookOpen, TrendingUp } from "lucide-react";
import WomanCommunity from "@/components/illustrations/WomanCommunity";
import LeafDecoration from "@/components/illustrations/LeafDecoration";

const PILLARS = [
  {
    icon: BookOpen,
    title: "Shiksha — Education",
    description: "Digital literacy, vocational skills, English communication, and professional upskilling — available in 12 Indian languages.",
    color: "var(--primary)",
    bg: "var(--primary-light)",
  },
  {
    icon: TrendingUp,
    title: "Rozgaar — Employment",
    description: "AI-powered career analysis, job matching, returnship programs, and direct connections with over 300 employers across India.",
    color: "var(--secondary)",
    bg: "#F0F9EC",
  },
  {
    icon: Shield,
    title: "Sashaktikaran — Empowerment",
    description: "Legal awareness, financial literacy, mental health support, and community networks that give women the confidence to lead.",
    color: "var(--primary)",
    bg: "var(--primary-light)",
  },
];

export default function MissionSection() {
  return (
    <section id="mission" className="py-24 px-5 bg-[var(--bg-light)] relative overflow-hidden">
      {/* Decorative leaves */}
      <LeafDecoration className="absolute top-0 right-0 w-28 h-48 opacity-20" color="var(--secondary)" />
      <LeafDecoration className="absolute bottom-0 left-0 w-24 h-40 opacity-15" color="var(--primary)" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <WomanCommunity className="w-full max-w-lg" />
          </motion.div>

          {/* Content */}
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <span className="purple-badge">Our Mission</span>
              <h2 className="section-heading">
                We Believe Every Woman{" "}
                <span style={{ color: "var(--primary)" }}>Deserves to Thrive.</span>
              </h2>
              <p className="section-sub">
                NayiUdaan bridges the gap between potential and opportunity for women across India — whether they are in metropolitan cities or rural villages.
              </p>
            </motion.div>

            <div className="space-y-5">
              {PILLARS.map((pillar, i) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="flex items-start gap-4 p-5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-purple-md"
                  style={{ background: pillar.bg, border: `1px solid ${pillar.color}20` }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: pillar.color + "20" }}
                  >
                    <pillar.icon className="w-5 h-5" style={{ color: pillar.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{pillar.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{pillar.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
