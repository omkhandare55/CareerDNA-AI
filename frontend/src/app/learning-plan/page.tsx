"use client";

import { GraduationCap, CheckCircle2, ArrowRight } from "lucide-react";

export default function LearningPlanPage() {
  const steps = [
    { title: "Core Python & Data Structures", status: "COMPLETED", duration: "2 WEEKS", score: "+10 POINTS", border: "border-slate-700 shadow-[4px_4px_0px_0px_#020617]" },
    { title: "FastAPI Async Web Services", status: "COMPLETED", duration: "1.5 WEEKS", score: "+8 POINTS", border: "border-slate-700 shadow-[4px_4px_0px_0px_#020617]" },
    { title: "AWS Machine Learning Specialty", status: "COMPLETED", duration: "3 WEEKS", score: "+12 POINTS", border: "border-slate-700 shadow-[4px_4px_0px_0px_#020617]" },
    { title: "CockroachDB HNSW Vector Search", status: "IN_PROGRESS", duration: "3.5 HOURS LEFT", score: "+8 POINTS", active: true, border: "border-yellow-400 shadow-[6px_6px_0px_0px_#FACC15]" },
    { title: "LangGraph State Machine Agent Systems", status: "UPCOMING", duration: "1 WEEK", score: "+10 POINTS", border: "border-slate-700 shadow-[4px_4px_0px_0px_#020617]" },
    { title: "Distributed System Design Masterclass", status: "UPCOMING", duration: "2 WEEKS", score: "+14 POINTS", border: "border-slate-700 shadow-[4px_4px_0px_0px_#020617]" },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b-4 border-slate-800 pb-5 font-mono">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-green-400" /> Personalized Learning Roadmap
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-sans font-medium">
            Dynamic step-by-step path configured to reach Senior AI Engineer target role by October 2026.
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 font-black uppercase">Roadmap Completion</p>
          <p className="text-3xl font-black font-mono text-green-400">72%</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#020617] h-4 border-2 border-slate-700 overflow-hidden p-0.5">
        <div className="bg-[#22C55E] h-full w-[72%] transition-all duration-500"></div>
      </div>

      {/* Roadmap Step Nodes */}
      <div className="space-y-4 font-mono">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={`p-5 bg-[#0F172A] border-4 ${step.border} transition`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className={`w-9 h-9 border-2 flex items-center justify-center font-black text-sm ${
                  step.status === "COMPLETED"
                    ? "bg-[#22C55E] text-slate-950 border-slate-950"
                    : step.active
                    ? "bg-[#FACC15] text-slate-950 border-slate-950 animate-pulse"
                    : "bg-[#020617] text-slate-400 border-slate-700"
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-100 uppercase flex items-center gap-2">
                    {step.title}
                    {step.active && (
                      <span className="text-[9px] px-2 py-0.5 bg-[#3B82F6] text-white border border-slate-100 uppercase">
                        CURRENT FOCUS
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400">DURATION: {step.duration}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-green-400 bg-[#020617] px-3 py-1 border border-slate-700">
                  {step.score}
                </span>
                {step.status === "COMPLETED" ? (
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                ) : (
                  <ArrowRight className="w-6 h-6 text-slate-500" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
