"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Dna,
  History,
  Network,
  Sparkles,
  Briefcase,
  FileText,
  Target,
  GraduationCap,
  Bell,
  Settings,
  LogOut,
  TrendingUp,
  Zap
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Command Center", path: "/", icon: LayoutDashboard },
  { name: "Career DNA", path: "/career-dna", icon: Dna },
  { name: "Memory Timeline", path: "/timeline", icon: History },
  { name: "Memory Graph", path: "/memory-graph", icon: Network },
  { name: "Recommendations", path: "/recommendations", icon: Sparkles },
  { name: "Applications", path: "/applications", icon: Briefcase },
  { name: "Resume & ATS", path: "/resume", icon: FileText },
  { name: "Interview Analytics", path: "/interview-analytics", icon: Target },
  { name: "Learning Plan", path: "/learning-plan", icon: GraduationCap },
  { name: "Notifications", path: "/notifications", icon: Bell },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-70 bg-[#0A0F1D] border-r-4 border-slate-800 flex flex-col justify-between z-40 select-none font-sans">
      {/* Brand Header */}
      <div>
        <div className="px-5 py-5 border-b-4 border-slate-800 flex items-center justify-between bg-[#020617]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#FACC15] text-[#020617] border-2 border-slate-50 flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_0px_#3B82F6]">
              🧬
            </div>
            <div>
              <span className="font-black text-lg text-slate-100 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                CareerDNA <span className="text-[10px] px-1.5 py-0.5 bg-[#EC4899] text-white border border-slate-100 font-bold">AI</span>
              </span>
              <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest font-mono">Lifelong AI Agent</p>
            </div>
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="px-3 py-4 space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-black uppercase tracking-wider transition-all duration-150 border-2 ${
                  isActive
                    ? "bg-[#3B82F6] text-white border-slate-100 shadow-[3px_3px_0px_0px_#FACC15] translate-x-1"
                    : "bg-[#0F172A] text-slate-300 border-slate-700 hover:border-slate-400 hover:bg-[#1E293B] hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-yellow-300" : "text-slate-400"}`} />
                <span>{item.name}</span>
                {item.name === "Recommendations" && (
                  <span className="ml-auto px-1.5 py-0.5 text-[9px] bg-[#EC4899] text-white border border-slate-100 font-black animate-pulse">
                    NEW
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Avatar & Career Score Footer */}
      <div className="p-4 border-t-4 border-slate-800 bg-[#020617] space-y-3">
        {/* Career Score Brutalist Badge */}
        <div className="p-3 bg-[#0F172A] border-2 border-yellow-400 shadow-[3px_3px_0px_0px_#FACC15] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-green-500 text-slate-950 font-black border border-slate-100">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest font-mono">Career Score</p>
              <p className="text-xl font-black text-slate-50 font-mono leading-none">
                87 <span className="text-xs text-green-400 font-bold">↑ +3</span>
              </p>
            </div>
          </div>
          <span className="text-[9px] px-2 py-0.5 bg-[#A855F7] text-white font-black border border-slate-100 uppercase tracking-widest font-mono">
            EVOLVED
          </span>
        </div>

        {/* User Account */}
        <div className="flex items-center justify-between pt-1 px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#3B82F6] text-white border-2 border-slate-100 flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_0px_#EC4899]">
              VK
            </div>
            <div className="truncate max-w-[130px]">
              <p className="text-xs font-black text-slate-100 truncate uppercase">Vijay Kumar</p>
              <p className="text-[9px] text-yellow-400 font-bold truncate uppercase tracking-tight flex items-center gap-1 font-mono">
                <Zap className="w-3 h-3 text-cyan-400 inline" /> Lifetime Memory
              </p>
            </div>
          </div>
          <button
            title="Logout"
            className="p-1.5 bg-[#0F172A] border-2 border-slate-700 hover:border-red-400 text-slate-400 hover:text-red-400 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
