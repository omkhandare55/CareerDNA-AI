"use client";

import { useState } from "react";
import { Sparkles, TrendingUp, ShieldCheck, CheckCircle2, Bookmark, Trash2, ArrowRight, History } from "lucide-react";
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
      status: "ACTIVE"
    },
    {
      id: "rec_2",
      action: "Build a Multi-Agent System with LangGraph & FastAPI",
      reason: "High market demand spike (+28.5%) for agentic workflows.",
      impact: "+6 Career Score",
      confidence: 0.92,
      memoriesUsed: ["GitHub Repos", "Target Role: AI Engineer"],
      status: "ACTIVE"
    }
  ];

  const history = [
    { title: "Completed React & Next.js 14 Deep Dive", date: "June 2026", result: "Completed • +6 Points" },
    { title: "Passed AWS Machine Learning Specialty", date: "July 2026", result: "Completed • +4 Points" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-purple-400" /> Decision Engine & Recommendations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic, memory-backed recommendations that evolve continuous with your career trajectory.
          </p>
        </div>
      </div>

      {/* Active Recommendations Feed */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Active Decision Cards</h2>

        {recommendations.map((rec) => (
          <div key={rec.id} className="glass-panel-glow p-6 rounded-2xl border border-blue-500/30 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold border border-purple-500/20">
                  Confidence: {(rec.confidence * 100).toFixed(0)}%
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold border border-green-500/20">
                  {rec.impact}
                </span>
              </div>

              <button
                onClick={() => setIsExplainOpen(true)}
                className="text-xs text-purple-300 hover:text-purple-200 font-medium underline underline-offset-4"
              >
                Why did this recommendation change?
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-50">{rec.action}</h3>
              <p className="text-xs text-slate-300 mt-1">{rec.reason}</p>
            </div>

            {/* Memories Used Provenance */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1E293B]">
              <span className="text-[11px] text-slate-400 font-medium">Memory Sources Used:</span>
              {rec.memoriesUsed.map((mem, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[#0F172A] text-slate-300 border border-[#1E293B]">
                  {mem}
                </span>
              ))}
            </div>

            {/* Card Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition shadow-lg shadow-blue-500/20 flex items-center gap-2">
                Accept Action <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] border border-[#1E293B] text-slate-300 text-xs font-medium transition flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5" /> Save
              </button>
              <button className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] border border-[#1E293B] text-slate-400 hover:text-red-400 text-xs font-medium transition flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5" /> Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Evolution History */}
      <div className="glass-panel p-6 rounded-2xl border border-[#1E293B] space-y-4">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <History className="w-4 h-4 text-blue-400" /> Recommendation Evolution History
        </h3>

        <div className="space-y-3">
          {history.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                <p className="text-[11px] text-slate-400">{item.date}</p>
              </div>
              <span className="text-xs font-semibold text-green-400">{item.result}</span>
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
          { title: "FAANG Mock Interview Failure", date: "Yesterday", type: "INTERVIEW" },
          { title: "AWS ML Specialty Certification", date: "July 2026", type: "CERT" }
        ]}
      />
    </div>
  );
}
