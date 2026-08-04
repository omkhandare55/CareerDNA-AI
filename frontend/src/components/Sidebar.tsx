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
  ShieldCheck
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
    <aside className="fixed top-0 left-0 bottom-0 w-70 bg-[#090D16] border-r border-[#1E293B] flex flex-col justify-between z-40 select-none">
      {/* Brand Header */}
      <div>
        <div className="px-6 py-5 border-b border-[#1E293B] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-cyan-400 p-[1px]">
              <div className="w-full h-full bg-[#090D16] rounded-[11px] flex items-center justify-center group-hover:bg-opacity-80 transition">
                <Dna className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <span className="font-bold text-lg text-slate-50 tracking-tight flex items-center gap-1.5">
                CareerDNA <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">AI</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium">Lifelong AI Agent</p>
            </div>
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#0F172A]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                <span>{item.name}</span>
                {item.name === "Recommendations" && (
                  <span className="ml-auto flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Avatar & Career Score Footer */}
      <div className="p-4 border-t border-[#1E293B] bg-[#0F172A]/50 space-y-3">
        {/* Career Score Badge */}
        <div className="p-3 rounded-xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-green-500/10 text-green-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Career Score</p>
              <p className="text-lg font-bold text-slate-50 leading-none">87 <span className="text-xs text-green-400 font-normal">↑ +3</span></p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
            EVOLVED
          </span>
        </div>

        {/* User Account */}
        <div className="flex items-center justify-between pt-1 px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white">
              VK
            </div>
            <div className="truncate max-w-[130px]">
              <p className="text-xs font-semibold text-slate-200 truncate">Vijay Kumar</p>
              <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-cyan-400 inline" /> Lifetime Memory
              </p>
            </div>
          </div>
          <button
            title="Logout"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-[#1E293B] rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
