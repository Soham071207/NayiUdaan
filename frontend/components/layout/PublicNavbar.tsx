"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bird, Menu, X, ChevronDown, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { label: "Home",      href: "/" },
  { label: "Programs",  href: "#programs" },
  { label: "Mentors",   href: "#mentors" },
  { label: "Events",    href: "#events" },
  { label: "Jobs",      href: "#jobs" },
  { label: "About",     href: "#mission" },
];

export default function PublicNavbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-purple-200/50"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-5 py-4 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <img src="/logo.png" alt="NayiUdaan" className="h-14 w-auto object-contain group-hover:scale-105 transition-transform" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  "text-gray-600 hover:text-[var(--primary)] hover:bg-[var(--primary-light)]/60"
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 hover:-translate-y-0.5"
                  style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 ml-2 pl-4 border-l border-gray-200">
                  <UserCircle className="w-6 h-6 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-[var(--primary-light)]/60 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="btn-primary text-sm !py-2.5 !px-5"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-[var(--primary-light)]/60 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-[var(--bg-light)] border-b border-[var(--primary-light)] shadow-purple-md md:hidden"
          >
            <nav className="p-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:text-[var(--primary)] hover:bg-[var(--primary-light)]/60 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 pb-1 space-y-2 border-t border-gray-100 mt-2">
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" className="block w-full text-center btn-primary text-sm mb-2" onClick={() => setMobileOpen(false)}>
                      Dashboard
                    </Link>
                    <button onClick={() => { logout(); setMobileOpen(false); }} className="block w-full text-center px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm">
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block w-full text-center px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm" onClick={() => setMobileOpen(false)}>
                      Log In
                    </Link>
                    <Link href="/signup" className="block w-full text-center btn-primary text-sm" onClick={() => setMobileOpen(false)}>
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
