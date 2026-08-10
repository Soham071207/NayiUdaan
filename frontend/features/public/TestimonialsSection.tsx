"use client";

import { motion } from "framer-motion";
import { Star, Quote, MapPin } from "lucide-react";
import testimonials from "@/data/testimonials.json";

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 px-5 bg-[var(--bg-light)] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14 space-y-4">
          <span className="purple-badge">Testimonials</span>
          <h2 className="section-heading">
            Their Words,{" "}
            <span style={{ color: "var(--primary)" }}>Our Purpose.</span>
          </h2>
          <p className="section-sub max-w-md mx-auto">
            From Hindi-speaking homemakers to English-speaking professionals — their stories are told in their own voices.
          </p>
        </motion.div>

        {/* Featured large testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 p-8 md:p-12 rounded-3xl relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
        >
          <Quote className="absolute top-8 right-8 w-16 h-16 text-white/10" />
          <div className="relative z-10 max-w-3xl">
            <p className="text-xl md:text-2xl text-gray-900 font-light leading-relaxed mb-6 italic">
              &ldquo;{testimonials[1].quoteEn}&rdquo;
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                {testimonials[1].name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="text-gray-900 font-semibold">{testimonials[1].name}</p>
                <p className="text-white/70 text-sm">{testimonials[1].role}</p>
                <p className="text-white/60 text-xs flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" /> {testimonials[1].location}
                </p>
              </div>
              <div className="ml-auto hidden md:flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-white text-white" />)}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grid of smaller testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.filter((_, i) => i !== 1).map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card-purple p-6 space-y-4"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
              </div>

              {/* Quote — Hindi first */}
              {t.quote !== t.quoteEn && (
                <p className="text-gray-600 text-sm leading-relaxed italic" lang="hi">&ldquo;{t.quote}&rdquo;</p>
              )}
              <p className="text-gray-600 text-sm leading-relaxed italic">&ldquo;{t.quoteEn}&rdquo;</p>

              {/* Attribution */}
              <div className="pt-3 border-t flex items-center gap-3" style={{ borderColor: "var(--primary-light)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-gray-900"
                  style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
                  {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {t.location}
                  </p>
                </div>
              </div>

              {/* Program */}
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "var(--primary-light)", color: "var(--primary-dark)" }}>
                {t.program}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
