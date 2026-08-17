"use client";

import { useState } from "react";
import { Sparkles, Bookmark, Trash2, ArrowRight, History } from "lucide-react";
import ExplainModal from "@/components/ExplainModal";

export default function RecommendationsPage() {
  const [isExplainOpen, setIsExplainOpen] = useState(false);

  const recommendations = [
    {
      id: "rec_1",
      action: "Master CockroachDB HNSW Vector Indexing",
      reason: "Your last 4 job target listings & FAANG mock interview required vector storage tuning.",
      impact: "+8 Career Score",
      confidence: 0.96,
      memoriesUsed: ["FAANG Mock Interview", "AWS ML Specialty Cert", "Resume v3.2"],
      border: "border-purple-500 shadow-[8px_8px_0px_0px_#A855F7]"
    },
    {
      id: "rec_2",
      action: "Build a Multi-Agent System with LangGraph & FastAPI",
      reason: "High market demand spike (+28.5%) for agentic workflows.",
      impact: "+6 Career Score",
      confidence: 0.92,
      memoriesUsed: ["GitHub Repos", "Target Role: AI Engineer"],
      border: "border-blue-500 shadow-[8px_8px_0px_0px_#3B82F6]"
    }
  ];

  const history = [
    { title: "Completed React & Next.js 14 Deep Dive", date: "JUNE 2026", result: "COMPLETED • +6 POINTS" },
    { title: "Passed AWS Machine Learning Specialty", date: "JULY 2026", result: "COMPLETED • +4 POINTS" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b-4 border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider font-mono flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-yellow-400" /> Decision Engine Feed
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Dynamic, memory-backed recommendations that evolve continuous with your career trajectory.
          </p>
        </div>
      </div>

      {/* Active Recommendations Feed */}
      <div className="space-y-6">
        <h2 className="text-xs font-black text-slate-100 uppercase tracking-widest font-mono">Active Decision Cards</h2>

        {recommendations.map((rec) => (
          <div key={rec.id} className={`bg-[#0F172A] p-6 border-4 ${rec.border} space-y-4`}>
            <div className="flex flex-wrap items-center justify-between gap-3 font-mono">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-[#A855F7] text-white text-xs font-black border border-slate-100 uppercase">
                  CONFIDENCE: {(rec.confidence * 100).toFixed(0)}%
                </span>
                <span className="px-2.5 py-1 bg-[#22C55E] text-slate-950 text-xs font-black border border-slate-950 uppercase">
                  {rec.impact}
                </span>
              </div>

              <button
                onClick={() => setIsExplainOpen(true)}
                className="text-xs text-yellow-400 hover:text-white font-black uppercase underline underline-offset-4"
              >
                WHY DID THIS RECOMMENDATION CHANGE?
              </button>
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-50 uppercase font-mono tracking-tight">{rec.action}</h3>
              <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed">{rec.reason}</p>
            </div>

            {/* Memories Used Provenance */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t-2 border-slate-800 font-mono">
              <span className="text-[11px] text-slate-400 font-bold uppercase">Memory Sources Used:</span>
              {rec.memoriesUsed.map((mem, i) => (
                <span key={i} className="text-[10px] font-black px-2 py-0.5 bg-[#020617] text-slate-200 border border-slate-700 uppercase">
                  {mem}
                </span>
              ))}
            </div>

            {/* Card Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2 font-mono">
              <button className="py-2.5 px-5 brutal-btn brutal-btn-yellow text-xs flex items-center gap-2">
                ACCEPT ACTION <ArrowRight className="w-4 h-4" />
              </button>
              <button className="py-2.5 px-4 bg-[#020617] border-2 border-slate-700 hover:border-slate-400 text-slate-200 text-xs font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#020617]">
                <Bookmark className="w-4 h-4 text-cyan-400" /> SAVE
              </button>
              <button className="py-2.5 px-4 bg-[#020617] border-2 border-slate-700 hover:border-red-400 text-slate-400 hover:text-red-400 text-xs font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#020617]">
                <Trash2 className="w-4 h-4" /> DISMISS
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Evolution History */}
      <div className="bg-[#0F172A] p-6 border-4 border-slate-800 space-y-4 font-mono">
        <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <History className="w-4 h-4 text-blue-400" /> Recommendation Evolution History
        </h3>

        <div className="space-y-3">
          {history.map((item, idx) => (
            <div key={idx} className="p-4 bg-[#020617] border-2 border-slate-700 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-200 uppercase">{item.title}</h4>
                <p className="text-[10px] text-slate-400 font-bold">{item.date}</p>
              </div>
              <span className="text-xs font-black text-green-400">{item.result}</span>
            </div>
          ))}
        </div>
      </div>

      <ExplainModal
        isOpen={isExplainOpen}
        onClose={() => setIsExplainOpen(false)}
        title="CockroachDB HNSW Vector Indexing Recommendation"
        whyChanged="Advice evolved because user passed AWS ML Specialty cert and logged vector tuning weakness during mock interview."
        confidenceScore={0.96}
        expectedImpact="+8 Career Score"
        memoriesUsed={[
          { title: "FAANG Mock Interview Failure", date: "YESTERDAY", type: "INTERVIEW" },
          { title: "AWS ML Specialty Certification", date: "JULY 2026", type: "CERT" }
        ]}
      />
    </div>
  );
}
