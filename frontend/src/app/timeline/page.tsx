"use client";

import { History, Award, Briefcase, FileText, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export default function MemoryTimelinePage() {
  const events = [
    {
      year: "2026",
      date: "August 4, 2026",
      title: "Google Mock Interview Completed",
      summary: "Evaluated on System Design & Vector Indexing. Identified weakness in distributed lock tuning.",
      type: "INTERVIEW_FAIL",
      confidence: "94%",
      impact: "Recommendation Changed"
    },
    {
      year: "2026",
      date: "August 1, 2026",
      title: "AWS Machine Learning Specialty Certification",
      summary: "Passed official AWS exam. Verified ML infrastructure & model deployment capabilities.",
      type: "CERTIFICATE",
      confidence: "99%",
      impact: "+4 DNA Score"
    },
    {
      year: "2026",
      date: "July 20, 2026",
      title: "Built CareerDNA AI Prototype",
      summary: "Integrated LangGraph agent framework with CockroachDB distributed vector index.",
      type: "PROJECT",
      confidence: "95%",
      impact: "+8 Career Score"
    },
    {
      year: "2026",
      date: "June 15, 2026",
      title: "Resume Version 3.2 Uploaded & Parsed",
      summary: "Extracted FastAPI, Python, and SQL skills into persistent database state.",
      type: "RESUME",
      confidence: "92%",
      impact: "DNA Profile Refined"
    },
    {
      year: "2025",
      date: "December 10, 2025",
      title: "Completed 500 LeetCode Problems milestone",
      summary: "Demonstrated high proficiency in Graphs, Dynamic Programming, and Heaps.",
      type: "LEARNING",
      confidence: "96%",
      impact: "+6 DNA Score"
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2.5">
            <History className="w-6 h-6 text-blue-400" /> Persistent Memory Timeline
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Chronological audit log of every decision, interview failure, certificate, and career milestone stored in CockroachDB.
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          Total Memory Nodes: 48
        </div>
      </div>

      {/* Vertical Timeline Component */}
      <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#1E293B]">
        {events.map((event, idx) => (
          <div key={idx} className="relative flex items-start gap-6 group">
            {/* Timeline Node Icon */}
            <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-[#0F172A] border-2 border-blue-500 flex items-center justify-center group-hover:scale-110 transition">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            </div>

            {/* Event Card */}
            <div className="glass-panel p-5 rounded-2xl border border-[#1E293B] w-full space-y-3 hover:border-slate-700 transition">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">{event.date}</span>
                  <span className="text-slate-600">•</span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-mono border border-blue-500/20">
                    {event.type}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-purple-300 font-medium">Confidence: {event.confidence}</span>
                  <span className="text-xs font-semibold text-green-400 bg-green-500/10 px-2.5 py-0.5 rounded-full border border-green-500/20">
                    {event.impact}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-100">{event.title}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{event.summary}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
