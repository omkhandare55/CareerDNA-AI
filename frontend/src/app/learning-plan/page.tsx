"use client";

import { GraduationCap, CheckCircle2, Clock, ArrowRight, Sparkles, BookOpen } from "lucide-react";

export default function LearningPlanPage() {
  const steps = [
    { title: "Core Python & Data Structures", status: "COMPLETED", duration: "2 Weeks", score: "+10 Points" },
    { title: "FastAPI Async Web Services", status: "COMPLETED", duration: "1.5 Weeks", score: "+8 Points" },
    { title: "AWS Machine Learning Specialty", status: "COMPLETED", duration: "3 Weeks", score: "+12 Points" },
    { title: "CockroachDB HNSW Vector Search", status: "IN_PROGRESS", duration: "3.5 Hours Left", score: "+8 Points", active: true },
    { title: "LangGraph State Machine Agent Systems", status: "UPCOMING", duration: "1 Week", score: "+10 Points" },
    { title: "Distributed System Design Masterclass", status: "UPCOMING", duration: "2 Weeks", score: "+14 Points" },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-green-400" /> Personalized Learning Roadmap
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic step-by-step path configured to reach Senior AI Engineer target role by October 2026.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 font-medium">Roadmap Progress</p>
          <p className="text-2xl font-bold font-mono text-green-400">72%</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#0F172A] h-3 rounded-full overflow-hidden border border-[#1E293B] p-0.5">
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-full rounded-full w-[72%] transition-all duration-500"></div>
      </div>

      {/* Roadmap Step Nodes */}
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border transition ${
              step.active
                ? "glass-panel-glow border-blue-500/40"
                : step.status === "COMPLETED"
                ? "glass-panel border-[#1E293B] opacity-80"
                : "glass-panel border-[#1E293B] opacity-60"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  step.status === "COMPLETED"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : step.active
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse"
                    : "bg-[#0F172A] text-slate-500 border border-[#1E293B]"
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    {step.title}
                    {step.active && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider font-semibold">
                        Current Focus
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400">Duration: {step.duration}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-green-400 bg-green-500/10 px-2.5 py-1 rounded-lg border border-green-500/20">
                  {step.score}
                </span>
                {step.status === "COMPLETED" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                ) : (
                  <ArrowRight className="w-5 h-5 text-slate-500" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
