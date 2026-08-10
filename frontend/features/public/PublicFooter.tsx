"use client";

import Link from "next/link";
import { Bird, Mail, Phone, MapPin, Twitter, Linkedin, Youtube, Instagram, ArrowRight } from "lucide-react";

const FOOTER_LINKS = {
  Platform: [
    { label: "AI Career Analysis", href: "/upload" },
    { label: "Skill Courses",      href: "#skills" },
    { label: "Mentors",            href: "#mentors" },
    { label: "Job Board",          href: "#jobs" },
    { label: "Events",             href: "#events" },
    { label: "Community",          href: "#" },
  ],
  Organisation: [
    { label: "About Us",      href: "#mission" },
    { label: "NGO Partners",  href: "#partners" },
    { label: "Volunteer",     href: "#volunteer" },
    { label: "Press & Media", href: "#" },
    { label: "Careers",       href: "#" },
    { label: "Contact",       href: "#" },
  ],
  Support: [
    { label: "FAQ",             href: "#faq" },
    { label: "Help Centre",     href: "#" },
    { label: "Report an Issue", href: "#" },
    { label: "Privacy Policy",  href: "#" },
    { label: "Terms of Use",    href: "#" },
  ],
};

const SOCIALS = [
  { icon: Twitter,   label: "Twitter",   href: "#" },
  { icon: Linkedin,  label: "LinkedIn",  href: "#" },
  { icon: Youtube,   label: "YouTube",   href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
];

export default function PublicFooter() {
  return (
    <footer id="footer" style={{ background: "#1A2F14", color: "#D1E9C8" }}>
      {/* CTA Banner */}
      <div style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }} className="py-16 px-5">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Your Next Chapter Starts Today.
          </h2>
          <p className="text-white/80 text-lg max-w-lg mx-auto">
            Join 52,000+ women who have already taken the first step. Free to start. Life-changing to finish.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/upload" className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[var(--bg-light)] font-bold text-base transition-all hover:-translate-y-0.5 hover:shadow-xl"
              style={{ color: "var(--primary)" }}>
              Analyse My Resume Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#programs" className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/40 text-white font-semibold text-base hover:bg-white/10 transition-all">
              Explore Programs
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
                <Bird className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-[var(--secondary)]">Nayi</span>
                <span className="font-bold text-xl text-white">Udaan</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#A8CFA0" }}>
              India's premier AI-powered women empowerment platform. Skills, jobs, mentorship, and community — for every woman in India.
            </p>
            <div className="space-y-2 text-sm" style={{ color: "#A8CFA0" }}>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@nayiudaan.in</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> 1800-XXX-XXXX (Toll Free)</p>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> New Delhi, India 🇮🇳</p>
            </div>
            {/* Social */}
            <div className="flex gap-3 pt-1">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:-translate-y-1"
                  style={{ background: "rgba(95,141,78,0.2)" }}>
                  <Icon className="w-4 h-4" style={{ color: "var(--secondary)" }} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading} className="space-y-4">
              <h4 className="font-semibold text-sm text-white">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm transition-colors hover:text-[var(--secondary)]" style={{ color: "#A8CFA0" }}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ borderColor: "rgba(95,141,78,0.2)", color: "#6B9C60" }}>
        <p>© 2024 NayiUdaan. All rights reserved. Made with ❤️ for every Indian woman.</p>
        <p>Supported by the <span style={{ color: "var(--secondary)" }}>Ministry of Women & Child Development, Government of India</span></p>
      </div>
    </footer>
  );
}
