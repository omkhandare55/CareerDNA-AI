"use client";

import { Target, Zap, CheckCircle2, AlertTriangle, Sparkles, MessageSquare } from "lucide-react";

export default function InterviewAnalyticsPage() {
  const topics = [
    { name: "System Design & Architecture", score: "88%", level: "Strong", bar: "w-[88%] bg-blue-500" },
    { name: "Vector Indexing & RAG", score: "76%", level: "Needs Practice", bar: "w-[76%] bg-purple-500" },
    { name: "Dynamic Programming", score: "92%", level: "Exceptional", bar: "w-[92%] bg-green-500" },
    { name: "Graphs & Search Algorithms", score: "85%", level: "Proficient", bar: "w-[85%] bg-cyan-500" },
    { name: "Behavioral Communication", score: "70%", level: "Developing", bar: "w-[70%] bg-amber-500" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2.5">
            <Target className="w-6 h-6 text-purple-400" /> Technical & Behavioral Interview Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Empirical interview logs stored in CockroachDB memory providing pinpoint feedback and Q&A replays.
          </p>
        </div>
      </div>

      {/* Performance Heatmap & Topic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-[#1E293B] space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Topic Performance Breakdown</h3>

          <div className="space-y-4">
            {topics.map((t, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-semibold">{t.name}</span>
                  <span className="text-slate-400 font-mono">{t.score} ({t.level})</span>
                </div>
                <div className="w-full bg-[#0F172A] h-2 rounded-full overflow-hidden border border-[#1E293B]">
                  <div className={`h-full ${t.bar} transition-all duration-500`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Q&A Interview Replay */}
        <div className="glass-panel p-6 rounded-2xl border border-[#1E293B] space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-400" /> Recent Mock Q&A Analysis Replay
          </h3>

          <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B] space-y-3 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-purple-400 uppercase">Question Asked</span>
              <p className="text-slate-100 font-semibold">"How do you handle multi-region write latency in CockroachDB?"</p>
            </div>

            <div className="space-y-1 pt-2 border-t border-[#1E293B]">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Your Response</span>
              <p className="text-slate-300 italic">"I mentioned leaseholders and Raft consensus groups, but forgot regional table pinning."</p>
            </div>

            <div className="space-y-1 pt-2 border-t border-[#1E293B] bg-purple-500/10 p-3 rounded-lg border-purple-500/20">
              <span className="text-[10px] font-mono text-purple-300 uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" /> AI Coach Feedback & Improved Answer
              </span>
              <p className="text-purple-200">
                Explicitly mention REGIONAL BY TABLE topologies to keep leaseholders local to the primary user region for sub-10ms writes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
