"use client";

import { Dna, ShieldCheck, Award, Zap, AlertTriangle, TrendingUp, CheckCircle2, Info } from "lucide-react";

export default function CareerDNAPage() {
  const traits = [
    { name: "Problem Solving", score: 92, level: "Exceptional", color: "from-blue-500 to-cyan-400" },
    { name: "Learning Speed", score: 95, level: "Top 5%", color: "from-purple-500 to-pink-500" },
    { name: "Consistency", score: 90, level: "High Streak", color: "from-green-500 to-emerald-400" },
    { name: "Backend Architecture", score: 88, level: "Advanced", color: "from-blue-600 to-indigo-500" },
    { name: "Leadership & Mentorship", score: 71, level: "Developing", color: "from-amber-500 to-orange-400" },
    { name: "Communication", score: 69, level: "Needs Practice", color: "from-red-500 to-amber-500" },
  ];

  const strengths = [
    { name: "Python / FastAPI", evidence: "Verified by 4 GitHub Repos + AWS ML Cert" },
    { name: "CockroachDB Vector Search", evidence: "Verified by Schema DDL + Memory Engine Project" },
    { name: "LangGraph State Machines", evidence: "Verified by Agentic Architecture implementation" },
    { name: "System Design Concepts", evidence: "Passed 3 technical mock assessments" },
  ];

  const weaknesses = [
    { name: "System Design Edge Cases", impact: "High Risk", fix: "Practice distributed consensus & Raft protocol" },
    { name: "Behavioral Storytelling", impact: "Medium Risk", fix: "Complete 2 behavioral STAR method mock runs" },
    { name: "Cloud IAM Hardening", impact: "Low Risk", fix: "Review AWS KMS least-privilege policies" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2.5">
            <Dna className="w-6 h-6 text-purple-400" /> Career DNA Genome Profile
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Empirical multi-dimensional identity model updated dynamically via CockroachDB vector search.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            Genome Version: v4.2
          </span>
        </div>
      </div>

      {/* Trait Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {traits.map((trait, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-2xl border border-[#1E293B] space-y-4 hover:border-slate-700 transition">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100">{trait.name}</h3>
              <span className="text-xs text-slate-400 font-mono">{trait.level}</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-slate-50">{trait.score}%</span>
              <span className="text-xs text-slate-400">Readiness Score</span>
            </div>

            <div className="w-full bg-[#1E293B] h-2 rounded-full overflow-hidden">
              <div
                className={`bg-gradient-to-r ${trait.color} h-full transition-all duration-500`}
                style={{ width: `${trait.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Strengths & Weaknesses Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verified Strengths */}
        <div className="glass-panel p-6 rounded-2xl border border-[#1E293B] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" /> Verified Core Strengths
            </h3>
            <span className="text-xs text-green-400 font-medium">4 Verified Signals</span>
          </div>

          <div className="space-y-3">
            {strengths.map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B] space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-100">{item.name}</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                    VERIFIED
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{item.evidence}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Known Weaknesses */}
        <div className="glass-panel p-6 rounded-2xl border border-[#1E293B] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Recorded Weaknesses & Risk Areas
            </h3>
            <span className="text-xs text-amber-400 font-medium">3 Target Focus Areas</span>
          </div>

          <div className="space-y-3">
            {weaknesses.map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B] space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-100">{item.name}</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {item.impact}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-blue-400" /> Action: {item.fix}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
