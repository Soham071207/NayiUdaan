"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bird, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/upload", label: "Get Started" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isDashboard = ["/dashboard", "/roadmap", "/employers", "/interview"].some(
    (p) => pathname?.startsWith(p)
  );

  if (isDashboard) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <nav className="mx-auto max-w-7xl flex items-center justify-between glass rounded-2xl px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Bird className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight">
            <span className="text-gradient">Nayi</span>
            <span className="text-gray-900">Udaan</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                pathname === link.href
                  ? "bg-violet-500/20 text-violet-300"
                  : "text-slate-400 hover:text-gray-900 hover:bg-white/5"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/upload"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white text-sm font-semibold hover:from-violet-500 hover:to-violet-400 transition-all duration-200 hover:scale-105 shadow-lg shadow-violet-500/25"
        >
          <Sparkles className="w-4 h-4" />
          Analyse My Resume
        </Link>
      </nav>
    </header>
  );
}
