"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, Rocket } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Your Resume",
    description: "Simply drag and drop your PDF resume. Takes less than 10 seconds.",
    color: "from-violet-500 to-purple-600",
    glow: "rgba(124, 58, 237, 0.3)",
  },
  {
    step: "02",
    icon: Cpu,
    title: "AI Analyses Everything",
    description: "Six specialised AI engines analyse your career gap, skills, and market readiness in real time.",
    color: "from-cyan-500 to-blue-600",
    glow: "rgba(6, 182, 212, 0.3)",
  },
  {
    step: "03",
    icon: Rocket,
    title: "Get Your Career Plan",
    description: "Receive a personalised 8-week roadmap, ATS-optimised resume tips, and matched employers.",
    color: "from-emerald-500 to-teal-600",
    glow: "rgba(16, 185, 129, 0.3)",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 space-y-3"
        >
          <p className="text-sm font-medium badge-cyan inline-flex px-3 py-1 rounded-full">
            How It Works
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            From Resume to{" "}
            <span className="text-gradient">Ready in 3 Steps</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-14 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-violet-500/40 via-cyan-500/40 to-emerald-500/40" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                {/* Icon circle */}
                <div
                  className={`relative w-28 h-28 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-xl animate-float`}
                  style={{
                    boxShadow: `0 0 40px ${step.glow}, 0 0 80px ${step.glow}`,
                    animationDelay: `${i * 0.8}s`,
                  }}
                >
                  <step.icon className="w-12 h-12 text-white" strokeWidth={1.5} />
                  <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-surface border-2 border-white/20 flex items-center justify-center text-[10px] font-bold text-slate-300">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-slate-100 mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
