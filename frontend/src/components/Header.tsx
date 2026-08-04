"use client";

import { Search, Bell, Sparkles, Command } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const getBreadcrumb = () => {
    switch (pathname) {
      case "/":
        return "Command Center";
      case "/career-dna":
        return "Career DNA (Genome)";
      case "/timeline":
        return "Memory Timeline";
      case "/memory-graph":
        return "Memory Graph Network";
      case "/recommendations":
        return "Decision Engine Feed";
      case "/applications":
        return "Applications Tracker";
      case "/resume":
        return "Resume & ATS Analysis";
      case "/interview-analytics":
        return "Interview Analytics";
      case "/learning-plan":
        return "Learning Roadmap";
      case "/notifications":
        return "Notifications";
      case "/settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  return (
    <header className="sticky top-0 left-70 right-0 h-16 glass-panel border-b border-[#1E293B] flex items-center justify-between px-8 z-30 ml-70">
      {/* Breadcrumb & Path */}
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-slate-100 tracking-tight">{getBreadcrumb()}</h1>
          <p className="text-[11px] text-slate-400">CareerDNA Agent Active • CockroachDB Memory Synced</p>
        </div>
      </div>

      {/* Action Center: Global Search & Notifications */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative hidden md:flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search memory, skills, interviews..."
            className="pl-9 pr-12 py-1.5 w-64 bg-[#0F172A] text-slate-200 text-xs rounded-lg border border-[#1E293B] focus:outline-none focus:border-blue-500 transition"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-[#1E293B] text-slate-400 px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <Command className="w-3 h-3" /> K
          </kbd>
        </div>

        {/* Notifications Icon */}
        <button
          className="relative p-2 rounded-lg bg-[#0F172A] border border-[#1E293B] text-slate-300 hover:text-slate-100 hover:border-slate-700 transition"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500"></span>
        </button>

        {/* Sync Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>CockroachDB Synced</span>
        </div>
      </div>
    </header>
  );
}
