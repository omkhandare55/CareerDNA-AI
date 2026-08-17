"use client";

import { Search, Bell, Sparkles, Command, Zap } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const getBreadcrumb = () => {
    switch (pathname) {
      case "/":
        return "COMMAND CENTER";
      case "/career-dna":
        return "CAREER DNA (GENOME)";
      case "/timeline":
        return "MEMORY TIMELINE";
      case "/memory-graph":
        return "MEMORY GRAPH NETWORK";
      case "/recommendations":
        return "DECISION ENGINE FEED";
      case "/applications":
        return "APPLICATIONS KANBAN";
      case "/resume":
        return "RESUME & ATS INTELLIGENCE";
      case "/interview-analytics":
        return "INTERVIEW ANALYTICS";
      case "/learning-plan":
        return "LEARNING ROADMAP";
      case "/notifications":
        return "NOTIFICATIONS";
      case "/settings":
        return "SETTINGS";
      default:
        return "COMMAND CENTER";
    }
  };

  return (
    <header className="sticky top-0 left-70 right-0 h-16 bg-[#090D16] border-b-4 border-slate-800 flex items-center justify-between px-8 z-30 ml-70 font-sans">
      {/* Breadcrumb & Path */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#FACC15] text-[#020617] border-2 border-slate-100 font-black shadow-[2px_2px_0px_0px_#06B6D4]">
          <Zap className="w-4 h-4 fill-current" />
        </div>
        <div>
          <h1 className="text-sm font-black text-slate-50 tracking-wider font-mono">{getBreadcrumb()}</h1>
          <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest font-mono">
            Agent Status: Active • CockroachDB Memory Synced
          </p>
        </div>
      </div>

      {/* Action Center: Global Search & Notifications */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative hidden md:flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="SEARCH MEMORY, SKILLS..."
            className="pl-9 pr-12 py-1.5 w-64 bg-[#0F172A] text-slate-100 font-mono text-xs font-bold rounded-none border-2 border-slate-700 focus:border-yellow-400 focus:outline-none transition shadow-[3px_3px_0px_0px_#1E293B]"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] bg-[#3B82F6] text-white border border-slate-100 px-1.5 py-0.5 font-mono font-black flex items-center gap-0.5">
            <Command className="w-3 h-3" /> K
          </kbd>
        </div>

        {/* Notifications Icon */}
        <button
          className="relative p-2 bg-[#0F172A] border-2 border-slate-700 hover:border-yellow-400 text-slate-300 hover:text-white transition shadow-[2px_2px_0px_0px_#020617]"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#EC4899] border border-white rounded-none animate-ping"></span>
        </button>

        {/* Sync Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#22C55E] text-slate-950 border-2 border-slate-100 text-xs font-black uppercase tracking-wider font-mono shadow-[2px_2px_0px_0px_#020617]">
          <span className="w-2 h-2 bg-slate-950 rounded-none animate-pulse"></span>
          <span>CockroachDB Synced</span>
        </div>
      </div>
    </header>
  );
}
