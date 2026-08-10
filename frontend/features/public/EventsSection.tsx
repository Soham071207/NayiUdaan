"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Clock, ExternalLink, Tag } from "lucide-react";
import events from "@/data/events.json";

const MODE_COLORS: Record<string, { bg: string; text: string }> = {
  Hybrid:     { bg: "var(--primary-light)", text: "var(--primary-dark)" },
  Online:     { bg: "#E0F2FE", text: "#0369A1" },
  "In-Person":{ bg: "#FEF3C7", text: "#92400E" },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default function EventsSection() {
  return (
    <section id="events" className="py-24 px-5" style={{ background: "var(--bg-light)" }}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <span className="purple-badge">Upcoming Events</span>
            <h2 className="section-heading">
              Join the{" "}
              <span style={{ color: "var(--primary)" }}>Movement.</span>
            </h2>
            <p className="section-sub max-w-md">Workshops, summits, webinars, and fairs — join us live or online.</p>
          </div>
          <button className="btn-outline text-sm self-start sm:self-end">View All Events</button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map((event, i) => {
            const mode = MODE_COLORS[event.mode] ?? MODE_COLORS.Hybrid;
            const spotsLeft = event.seats - event.registered;
            const fillPct   = (event.registered / event.seats) * 100;

            return (
              <motion.div key={event.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="card-purple overflow-hidden flex flex-col"
              >
                {/* Header band */}
                <div className="p-5 flex items-start justify-between gap-3" style={{ background: "linear-gradient(135deg, #F0F9EC, var(--primary-light))" }}>
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full text-gray-900" style={{ background: "var(--primary)" }}>{event.type}</span>
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: mode.bg, color: mode.text }}>{event.mode}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 leading-snug text-base">{event.title}</h3>
                  </div>
                  {/* Date block */}
                  <div className="flex-shrink-0 text-center bg-[var(--bg-light)] rounded-2xl px-3 py-2 border" style={{ borderColor: "var(--primary-light)", minWidth: 54 }}>
                    <p className="text-xs text-gray-500 leading-none">{new Date(event.date).toLocaleString("en-IN", { month: "short" })}</p>
                    <p className="text-2xl font-black leading-tight" style={{ color: "var(--primary)" }}>{new Date(event.date).getDate()}</p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 space-y-3">
                  <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
                  <div className="space-y-1.5 text-xs text-gray-500">
                    <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gray-500" />{event.time}</p>
                    <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-500" />{event.location}</p>
                    <p className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-gray-500" />Speaker: <span className="font-medium text-gray-700">{event.speaker}</span></p>
                  </div>

                  {/* Spots progress */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">{event.registered} registered</span>
                      <span className="font-semibold" style={{ color: spotsLeft < 30 ? "#DC2626" : "var(--primary)" }}>
                        {spotsLeft} spots left
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${fillPct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: fillPct > 90 ? "#DC2626" : "linear-gradient(90deg, var(--primary), var(--secondary))" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 pb-5">
                  <button className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 text-gray-900"
                    style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
                    {event.free ? "Register Free" : `Register · ${(event as typeof event & { fee?: string }).fee}`}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
