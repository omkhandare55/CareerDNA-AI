"use client";

import { Target, Sparkles, MessageSquare } from "lucide-react";

export default function InterviewAnalyticsPage() {
  const topics = [
    { name: "System Design & Architecture", score: "88%", level: "STRONG", bar: "w-[88%] bg-[#3B82F6]" },
    { name: "Vector Indexing & RAG", score: "76%", level: "NEEDS PRACTICE", bar: "w-[76%] bg-[#A855F7]" },
    { name: "Dynamic Programming", score: "92%", level: "EXCEPTIONAL", bar: "w-[92%] bg-[#22C55E]" },
    { name: "Graphs & Search Algorithms", score: "85%", level: "PROFICIENT", bar: "w-[85%] bg-[#06B6D4]" },
    { name: "Behavioral Communication", score: "70%", level: "DEVELOPING", bar: "w-[70%] bg-[#FACC15]" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b-4 border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider font-mono flex items-center gap-2.5">
            <Target className="w-7 h-7 text-purple-400" /> Technical & Behavioral Interview Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Empirical interview logs stored in CockroachDB memory providing pinpoint feedback and Q&A replays.
          </p>
        </div>
      </div>

      {/* Performance Heatmap & Topic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#3B82F6] space-y-4 font-mono">
          <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider">Topic Performance Breakdown</h3>

          <div className="space-y-4">
            {topics.map((t, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-100 font-bold uppercase">{t.name}</span>
                  <span className="text-yellow-400 font-black">{t.score} ({t.level})</span>
                </div>
                <div className="w-full bg-[#020617] h-3 border border-slate-700 overflow-hidden">
                  <div className={`h-full ${t.bar} transition-all duration-500`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Q&A Interview Replay */}
        <div className="bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#FACC15] space-y-4 font-mono">
          <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-400" /> Recent Mock Q&A Analysis Replay
          </h3>

          <div className="p-5 bg-[#020617] border-2 border-slate-700 space-y-4 text-xs">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-purple-400 uppercase">Question Asked</span>
              <p className="text-slate-50 font-black uppercase">"How do you handle multi-region write latency in CockroachDB?"</p>
            </div>

            <div className="space-y-1 pt-3 border-t border-slate-800">
              <span className="text-[9px] font-black text-slate-400 uppercase">Your Response</span>
              <p className="text-slate-300 font-sans italic">"I mentioned leaseholders and Raft consensus groups, but forgot regional table pinning."</p>
            </div>

            <div className="space-y-1 pt-3 border-t border-slate-800 bg-[#A855F7]/10 p-3 border-2 border-purple-500 shadow-[3px_3px_0px_0px_#A855F7]">
              <span className="text-[9px] font-black text-purple-300 uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> AI Coach Feedback & Improved Answer
              </span>
              <p className="text-purple-200 font-sans font-medium">
                Explicitly mention REGIONAL BY TABLE topologies to keep leaseholders local to the primary user region for sub-10ms writes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
