"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import WomanHero from "@/components/illustrations/WomanHero";
import { LeafCluster, FloatingDots, SubtleFlower, SingleLeaf } from "@/components/illustrations/LeafDecoration";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center pt-24 pb-16 px-5 overflow-hidden"
      style={{ background: "linear-gradient(160deg, var(--bg-light) 0%, var(--primary-light) 50%, var(--bg-light) 100%)" }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-20 left-0 w-72 h-72 rounded-full opacity-40 -translate-x-1/2 pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--primary-light), transparent)" }}
      />
      <div
        className="absolute bottom-20 right-0 w-96 h-96 rounded-full opacity-30 translate-x-1/3 pointer-events-none"
        style={{ background: "radial-gradient(circle, #F48FB1, transparent)" }}
      />

      {/* Subtle scattered flowers */}
      <SubtleFlower className="absolute top-[15%] left-[20%] w-24 h-24 animate-pulse duration-[4000ms] opacity-50" color="var(--secondary)" />
      <SubtleFlower className="absolute bottom-[20%] left-[45%] w-16 h-16 animate-pulse duration-[5000ms] opacity-40" color="var(--primary)" />
      <SubtleFlower className="absolute top-[30%] right-[10%] w-32 h-32 animate-pulse duration-[6000ms] opacity-30" color="var(--secondary)" />

      {/* Scattered small leaves */}
      <SingleLeaf className="absolute top-[45%] left-[10%] w-8 h-8 -rotate-12 animate-float opacity-50" color="var(--primary)" />
      <SingleLeaf className="absolute bottom-[35%] right-[25%] w-10 h-10 rotate-45 animate-float opacity-40" color="var(--secondary)" />
      <SingleLeaf className="absolute top-[25%] right-[40%] w-6 h-6 rotate-12 animate-float opacity-60" color="var(--primary)" />

      {/* Original Leaf decorations */}
      <LeafCluster
        className="absolute top-32 right-8 w-20 h-24 opacity-35 animate-leaf-sway"
        color="var(--secondary)"
      />
      <LeafCluster
        className="absolute bottom-28 left-8 w-16 h-20 opacity-25 animate-leaf-sway"
        color="var(--primary)"
      />
      <FloatingDots className="absolute top-40 left-1/4 w-40 h-40 opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left — Text */}
        <div className="space-y-8">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="purple-badge">
              <span className="w-2 h-2 rounded-full bg-violet-600 inline-block" />
              India's Women Empowerment Platform
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-3"
          >
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight text-gray-900">
              Har Naari Ka<br />
              <span
                style={{
                  background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Naya Aagaz.
              </span>
            </h1>
            <p className="text-lg text-gray-500 font-normal">Every Woman's New Beginning.</p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-lg"
          >
            From homemakers to professionals, from villages to cities — NayiUdaan provides
            AI-powered career guidance, skill development, mentorship, and job opportunities
            for every Indian woman.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/upload" className="btn-primary text-base gap-2.5">
              Start My Journey
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Trust line — no fake numbers */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-gray-400"
          >
            Trusted by NGOs across India &middot; 100% Free to start
          </motion.p>
        </div>

        {/* Right — Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex justify-center lg:justify-end"
        >
          <WomanHero className="w-full max-w-md lg:max-w-lg animate-float" />
        </motion.div>
      </div>
    </section>
  );
}
