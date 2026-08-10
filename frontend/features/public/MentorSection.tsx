"use client";

import { motion } from "framer-motion";
import { Star, MessageCircle, MapPin, Clock, Users } from "lucide-react";
import mentors from "@/data/mentors.json";

export default function MentorSection() {
  return (
    <section id="mentors" className="py-24 px-5 bg-[var(--bg-light)]">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14 space-y-4">
          <span className="purple-badge">Our Mentors</span>
          <h2 className="section-heading">
            Learn from Women{" "}
            <span style={{ color: "var(--primary)" }}>Who've Done It.</span>
          </h2>
          <p className="section-sub max-w-lg mx-auto">
            500+ mentors. Real professionals. Real stories. All of them are ready to guide you through your own journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor, i) => (
            <motion.div key={mentor.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="card-purple p-6 flex flex-col gap-5"
            >
              {/* Profile row */}
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-lg font-bold text-gray-900"
                  style={{ background: i % 2 === 0 ? "linear-gradient(135deg, var(--primary), var(--secondary))" : "linear-gradient(135deg, var(--secondary), var(--primary-light))" }}>
                  {mentor.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{mentor.name}</h3>
                  <p className="text-sm font-medium truncate" style={{ color: "var(--primary)" }}>{mentor.role}</p>
                  <p className="text-xs text-gray-500 truncate">{mentor.company}</p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{mentor.bio}</p>

              {/* Expertise tags */}
              <div className="flex flex-wrap gap-1.5">
                {mentor.expertise.map((tag) => (
                  <span key={tag} className="text-[11px] px-2.5 py-1 rounded-lg font-medium" style={{ background: "var(--primary-light)", color: "var(--primary-dark)" }}>{tag}</span>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="text-center p-2.5 rounded-xl" style={{ background: "var(--bg-light)" }}>
                  <p className="font-bold text-sm" style={{ color: "var(--primary)" }}>{mentor.experience}Y</p>
                  <p className="text-[10px] text-gray-500">Experience</p>
                </div>
                <div className="text-center p-2.5 rounded-xl" style={{ background: "var(--bg-light)" }}>
                  <p className="font-bold text-sm" style={{ color: "var(--primary)" }}>{mentor.sessions}</p>
                  <p className="text-[10px] text-gray-500">Sessions</p>
                </div>
                <div className="text-center p-2.5 rounded-xl" style={{ background: "var(--bg-light)" }}>
                  <p className="font-bold text-sm flex items-center justify-center gap-0.5" style={{ color: "var(--primary)" }}>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{mentor.rating}
                  </p>
                  <p className="text-[10px] text-gray-500">Rating</p>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{mentor.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{mentor.availability}</span>
                </div>
                <button className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 text-gray-900"
                  style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
                  <MessageCircle className="w-4 h-4" />
                  Book a Session
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-10">
          <button className="btn-outline">View All 500+ Mentors</button>
        </motion.div>
      </div>
    </section>
  );
}
