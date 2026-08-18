"use client";

import { Search, Bell, Zap, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
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
    <header className="sticky top-0 right-0 h-16 bg-[#090D16] border-b-4 border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 lg:ml-70 font-sans transition-all duration-300">
      {/* Hamburger Toggle + Breadcrumb & Path */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          className="p-2 bg-[#0F172A] border-2 border-slate-700 text-slate-300 hover:text-white lg:hidden hover:border-yellow-400"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="p-2 bg-[#FACC15] text-[#020617] border-2 border-slate-100 font-black shadow-[2px_2px_0px_0px_#06B6D4] hidden sm:block">
          <Zap className="w-4 h-4 fill-current" />
        </div>
        <div>
          <h1 className="text-xs sm:text-sm font-black text-slate-50 tracking-wider font-mono truncate max-w-[180px] sm:max-w-xs md:max-w-none">
            {getBreadcrumb()}
          </h1>
          <p className="text-[9px] sm:text-[10px] text-cyan-400 font-bold uppercase tracking-widest font-mono truncate">
            CockroachDB Memory Active
          </p>
        </div>
      </div>

      {/* Action Center: Global Search & Notifications */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search Bar */}
        <div className="relative hidden md:flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="SEARCH MEMORY, SKILLS..."
            className="pl-9 pr-4 py-1.5 w-48 lg:w-64 bg-[#0F172A] text-slate-100 font-mono text-xs font-bold rounded-none border-2 border-slate-700 focus:border-yellow-400 focus:outline-none transition shadow-[3px_3px_0px_0px_#1E293B]"
          />
        </div>

        {/* Notifications Icon */}
        <button
          className="relative p-2 bg-[#0F172A] border-2 border-slate-700 hover:border-yellow-400 text-slate-300 hover:text-white transition shadow-[2px_2px_0px_0px_#020617]"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#EC4899] border border-white rounded-none animate-ping"></span>
        </button>

        {/* Sync Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#22C55E] text-slate-950 border-2 border-slate-100 text-[10px] font-black uppercase tracking-wider font-mono shadow-[2px_2px_0px_0px_#020617]">
          <span className="w-2 h-2 bg-slate-950 rounded-none animate-pulse"></span>
          <span>CockroachDB Synced</span>
        </div>
      </div>
    </header>
  );
}
