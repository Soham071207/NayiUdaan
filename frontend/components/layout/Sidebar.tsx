"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, Map, Building2, MessageSquare, Bird, Plus, ChevronRight, LogOut, UserCircle, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard",  label: "Dashboard",    icon: LayoutDashboard },
  { href: "/roadmap",    label: "My Roadmap",   icon: Map },
  { href: "/employers",  label: "Employers",    icon: Building2 },
  { href: "/gap-coach",  label: "Gap Coach",    icon: Sparkles },
  { href: "/interview",  label: "Interview Coach", icon: MessageSquare },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col z-40 border-r border-violet-100 bg-white/90 backdrop-blur-xl">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-violet-100">
        <Link href="/" className="flex items-center gap-2.5 group">
          <img src="/logo.png" alt="NayiUdaan" className="h-8 object-contain group-hover:scale-105 transition-transform" />
        </Link>
      </div>

      {/* Action Button */}
      <div className="px-4 pt-5 pb-2">
        <Link
          href="/upload"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600/90 to-cyan-500/90 text-white text-sm font-semibold hover:from-violet-600 hover:to-cyan-500 shadow-sm transition-all duration-200 group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          New Analysis
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                active
                  ? "bg-violet-50 text-violet-700 border border-violet-200"
                  : "text-gray-500 hover:text-gray-800 hover:bg-violet-50"
              )}
            >
              <Icon className={cn("w-4.5 h-4.5 flex-shrink-0", active ? "text-violet-700" : "text-gray-500 group-hover:text-gray-800")} />
              {label}
              {active && <ChevronRight className="ml-auto w-3.5 h-3.5 text-violet-700/60" />}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Actions */}
      <div className="p-4 border-t border-violet-100 space-y-3">
        {user && (
          <div className="flex items-center gap-3 px-2 py-2">
            <UserCircle className="w-8 h-8 text-gray-500" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <button onClick={logout} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Log out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
