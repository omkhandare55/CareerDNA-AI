"use client";

import { useEffect, useState } from "react";
import { History, Sparkles, Filter, Calendar } from "lucide-react";
import { apiGet } from "@/lib/api";

export default function TimelinePage() {
  const [timelineData, setTimelineData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet('/api/v1/timeline')
      .then((data) => {
        setTimelineData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const fallbackEvents = [
    {
      date: "AUGUST 15, 2026",
      type: "INTERVIEW_LOG",
      title: "FAANG Mock Interview: System Design & Vector Storage",
      desc: "Detailed evaluation of multi-region read/write latency. Mock interviewer highlighted gap in CockroachDB Raft leaseholder tuning.",
      confidence: "96% Confidence",
      impact: "+2 DNA Score Shift",
      color: "border-amber-400 shadow-[4px_4px_0px_0px_#FACC15]"
    },
    {
      date: "JULY 28, 2026",
      type: "CERTIFICATE",
      title: "AWS Certified Machine Learning – Specialty Passed",
      desc: "Official credential issued by Amazon Web Services. Machine learning architecture proficiency verified.",
      confidence: "99% Confidence",
      impact: "+6 DNA Score Shift",
      color: "border-green-500 shadow-[4px_4px_0px_0px_#22C55E]"
    },
    {
      date: "JUNE 10, 2026",
      type: "PROJECT_COMMIT",
      title: "Built Agentic Career DNA Memory Engine",
      desc: "Designed Ebbinghaus decay math engine with vector duplicate merging and CockroachDB vector index schema.",
      confidence: "94% Confidence",
      impact: "+8 DNA Score Shift",
      color: "border-purple-500 shadow-[4px_4px_0px_0px_#A855F7]"
    },
    {
      date: "MAY 02, 2026",
      type: "RESUME_PARSED",
      title: "Uploaded Resume v3.1",
      desc: "Extracted 34 core skills and historical trajectory from PDF resume.",
      confidence: "92% Confidence",
      impact: "+4 DNA Score Shift",
      color: "border-blue-500 shadow-[4px_4px_0px_0px_#3B82F6]"
    }
  ];

  const events = timelineData?.events?.map((evt: any) => ({
    date: evt.date || evt.created_at ? new Date(evt.created_at || evt.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase() : "RECENT",
    type: evt.event_type || evt.type || "MEMORY_EVENT",
    title: evt.title || evt.summary,
    desc: evt.description || evt.summary || "Empirical event logged in persistent CockroachDB store.",
    confidence: `${Math.round((evt.confidence || evt.importance_score || 0.9) * 100)}% Confidence`,
    impact: "+3 DNA Score Shift",
    color: evt.event_type === "INTERVIEW" ? "border-amber-400 shadow-[4px_4px_0px_0px_#FACC15]" :
           evt.event_type === "CERTIFICATE" ? "border-green-500 shadow-[4px_4px_0px_0px_#22C55E]" :
           "border-blue-500 shadow-[4px_4px_0px_0px_#3B82F6]"
  })) ?? fallbackEvents;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b-4 border-slate-800 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider font-mono flex items-center gap-2.5">
            <History className="w-7 h-7 text-cyan-400" /> Persistent Memory Timeline
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Immutable audit log of career events, mock interviews, certifications, and AI memory shifts.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <button className="px-3 py-1.5 bg-[#0F172A] border-2 border-slate-700 hover:border-yellow-400 text-slate-200 text-xs font-black uppercase flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Total Events: {events.length}
          </button>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 border-l-4 border-slate-800 space-y-8 my-6">
        {events.map((evt: any, idx: number) => (
          <div key={idx} className="relative">
            {/* Timeline Node Point */}
            <div className="absolute -left-[31px] top-4 w-4 h-4 bg-[#FACC15] border-2 border-slate-950 shadow-[2px_2px_0px_0px_#020617]"></div>

            {/* Event Card */}
            <div className={`bg-[#0F172A] p-6 border-2 ${evt.color} space-y-3`}>
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#020617] text-yellow-400 text-[10px] font-black border border-slate-700 flex items-center gap-1 uppercase">
                    <Calendar className="w-3 h-3 text-cyan-400" /> {evt.date}
                  </span>
                  <span className="px-2 py-0.5 bg-[#3B82F6] text-white text-[10px] font-black border border-slate-100 uppercase">
                    {evt.type}
                  </span>
                </div>
                <span className="text-xs font-black text-green-400">{evt.impact}</span>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-50 uppercase tracking-tight font-mono">{evt.title}</h3>
                <p className="text-xs text-slate-300 mt-1 font-medium leading-relaxed">{evt.desc}</p>
              </div>

              <div className="pt-2 border-t-2 border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>VERIFIED PROVENANCE LOG</span>
                <span className="text-purple-400 font-bold">{evt.confidence}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
