"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  { q: "Is NayiUdaan completely free?", a: "Most features are free — AI career analysis, digital literacy courses, financial literacy, legal awareness, and community access. Some advanced vocational courses have a small fee (₹200–₹1,299). We never charge anything upfront." },
  { q: "I haven't worked in 8 years. Can NayiUdaan still help me?", a: "Absolutely — in fact, that's who we were built for. Our AI career analysis is specifically designed to recognise skills from homemaking, caregiving, and community work. Many of our success stories are women who returned after 5–10 year breaks." },
  { q: "Are courses available in Hindi and other regional languages?", a: "Yes. Our courses are available in 12 languages — Hindi, English, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Odia, Punjabi, and Assamese. You can choose your preferred language when enrolling." },
  { q: "How does the AI career analysis work?", a: "Upload your resume (or fill in your background manually). Our AI — powered by the same technology as leading global career platforms — analyses your experience, identifies your career gap, maps your skills against the current job market, and produces a personalised 8-week recovery roadmap with ATS resume tips and employer matches." },
  { q: "I live in a rural area. Can I still access NayiUdaan?", a: "Yes. NayiUdaan is designed to work on low-bandwidth mobile connections. All text-based courses work offline. We also have offline access points through our NGO partner network in rural districts of UP, Bihar, Rajasthan, Maharashtra, and Odisha." },
  { q: "How do I find a mentor?", a: "After completing your profile, we automatically suggest mentors based on your career background, goals, location, and language preference. You can also browse all mentors and request a session directly. All initial sessions are free." },
  { q: "Are the job listings verified?", a: "Yes. Every employer on the NayiUdaan job board goes through a verification process. We also confirm their commitment to women returners — flexible hours, no career gap discrimination, and returnship structures where applicable." },
  { q: "How can my NGO partner with NayiUdaan?", a: "We love partnering with mission-aligned NGOs. Our partnerships include co-delivering courses in your community, referral programs, and shared volunteer networks. Email us at partners@nayiudaan.in or fill in the partner enquiry form on the Contact page." },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 px-5 overflow-hidden" style={{ background: "var(--bg-light)" }}>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-end gap-8 relative">
        {/* Left Side: FAQs */}
        <div className="flex-1 w-full max-w-3xl z-10 lg:pr-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-left mb-12 space-y-4">
            <span className="purple-badge">FAQ</span>
            <h2 className="section-heading text-4xl sm:text-5xl font-bold tracking-tight">
              Common{" "}
              <span style={{ color: "var(--primary)" }}>Questions.</span>
            </h2>
            <p className="section-sub text-lg text-gray-500 max-w-md">
              Everything you need to know about NayiUdaan. Can't find your answer?{" "}
              <a href="mailto:hello@nayiudaan.in" className="underline underline-offset-2 hover:text-[var(--primary)] transition-colors" style={{ color: "var(--primary)" }}>Write to us.</a>
            </p>
          </motion.div>

          <div className="space-y-3 relative z-20">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="bg-purple-100/300 backdrop-blur-md rounded-2xl border overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md"
                style={{ borderColor: open === i ? "var(--secondary)" : "#EAF5E4" }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-[#F9FCF8] transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-sm leading-snug">{faq.q}</span>
                  <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                    style={{ background: open === i ? "var(--primary)" : "var(--primary-light)" }}>
                    {open === i
                      ? <Minus className="w-3.5 h-3.5 text-white" />
                      : <Plus className="w-3.5 h-3.5" style={{ color: "var(--primary)" }} />
                    }
                  </div>
                </button>

                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden bg-white/40"
                    >
                      <p className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t pt-4" style={{ borderColor: "var(--primary-light)" }}>
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: Popping Woman Illustration */}
        <motion.div
          className="hidden lg:flex justify-end items-end absolute bottom-0 right-0 w-[45%] max-w-[500px] pointer-events-none z-0"
          initial={{ x: 100, y: 100, opacity: 0, scale: 0.9, rotate: 10 }}
          whileInView={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", bounce: 0.4, duration: 1.2, delay: 0.1 }}
        >
          <Image
            src="/images/faq-illustration.png"
            alt="Woman waving happily"
            width={500}
            height={500}
            className="w-full h-auto drop-shadow-xl object-contain object-bottom origin-bottom-right"
            style={{ mixBlendMode: "multiply" }}
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
