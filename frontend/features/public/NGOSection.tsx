"use client";

import { motion } from "framer-motion";
import { Globe, Users, Heart, ArrowRight } from "lucide-react";
import ngos from "@/data/ngos.json";

const VOLUNTEER_ROLES = [
  { icon: Globe, title: "Digital Trainer", description: "Teach basic computer and phone skills to women in your community. 2 hours/week. No degree needed.", commitment: "2 hrs/week" },
  { icon: Heart, title: "Mentor Match", description: "Offer 1-on-1 career guidance sessions to women on a comeback. Share your expertise and lived experience.", commitment: "4 hrs/month" },
  { icon: Users, title: "Community Coordinator", description: "Run a local NayiUdaan circle — organize events, connect members, and represent your community.", commitment: "5 hrs/week" },
];

export default function NGOSection() {
  return (
    <>
      {/* NGO Partners */}
      <section id="partners" className="py-20 px-5" style={{ background: "var(--bg-light)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 space-y-3">
            <span className="purple-badge">NGO Partners</span>
            <h2 className="section-heading">
              Powered by{" "}
              <span style={{ color: "var(--primary)" }}>Mission-Driven Partners.</span>
            </h2>
            <p className="section-sub max-w-lg mx-auto">
              We work with India's most impactful NGOs to deliver programmes at the grassroots level.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ngos.map((ngo, i) => (
              <motion.div key={ngo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="card-purple p-6 space-y-4"
              >
                {/* Logo */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black text-gray-900"
                  style={{ background: `linear-gradient(135deg, ${ngo.color}, ${ngo.color}CC)` }}>
                  {ngo.name.split(" ")[0].slice(0, 2).toUpperCase()}
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-sm leading-tight">{ngo.name}</h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--secondary)" }}>{ngo.focus}</p>
                </div>

                <div className="space-y-1.5 text-xs text-gray-500">
                  <p>📍 {ngo.location}</p>
                  <p>🗓️ Est. {ngo.founded}</p>
                  <p className="font-semibold" style={{ color: "var(--primary)" }}>👥 {ngo.reach} reached</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Want to partner with us?{" "}
              <a href="#footer" className="font-semibold underline-offset-2 underline" style={{ color: "var(--primary)" }}>
                Get in touch →
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Volunteer */}
      <section id="volunteer" className="py-24 px-5 bg-[var(--bg-light)]">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14 space-y-4">
            <span className="purple-badge">Volunteer With Us</span>
            <h2 className="section-heading">
              Give an Hour.{" "}
              <span style={{ color: "var(--primary)" }}>Change a Life.</span>
            </h2>
            <p className="section-sub max-w-lg mx-auto">
              Join 3,000+ volunteers who are building India's most inclusive women's network — one community at a time.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {VOLUNTEER_ROLES.map((role, i) => (
              <motion.div key={role.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-7 rounded-3xl border text-center space-y-4 group hover:-translate-y-1 hover:shadow-purple-md transition-all duration-300"
                style={{ background: "var(--bg-light)", borderColor: "var(--primary-light)" }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform"
                  style={{ background: "var(--primary-light)" }}>
                  <role.icon className="w-7 h-7" style={{ color: "var(--primary)" }} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">{role.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{role.description}</p>
                </div>
                <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "var(--primary-light)", color: "var(--primary-dark)" }}>
                  {role.commitment}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6"
            style={{ background: "linear-gradient(135deg, #F0F9EC, var(--primary-light))", border: "1.5px solid var(--primary-light)" }}>
            <div>
              <h3 className="font-bold text-gray-900 text-xl mb-1">Ready to make a difference?</h3>
              <p className="text-gray-600 text-sm">Fill out a quick form. Our team will reach out within 48 hours.</p>
            </div>
            <button className="btn-primary flex-shrink-0">
              Apply to Volunteer <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
