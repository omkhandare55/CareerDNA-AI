"use client";

import { useEffect, useState } from "react";
import { Dna, CheckCircle2, AlertTriangle, Zap } from "lucide-react";
import { apiGet } from "@/lib/api";

export default function CareerDNAPage() {
  const [dna, setDna] = useState<any>(null);
  const [skills, setSkills] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGet('/api/v1/dna').catch(() => null),
      apiGet('/api/v1/skills').catch(() => null),
    ]).then(([dnaData, skillsData]) => {
      setDna(dnaData);
      setSkills(skillsData);
      setLoading(false);
    });
  }, []);

  const traits = [
    { name: "Problem Solving", score: dna?.readiness_breakdown?.problem_solving ?? 92, level: "Exceptional", color: "bg-[#3B82F6]", border: "border-blue-500 shadow-[4px_4px_0px_0px_#3B82F6]" },
    { name: "Learning Speed", score: dna?.readiness_breakdown?.learning_velocity ?? 95, level: "Top 5%", color: "bg-[#EC4899]", border: "border-pink-500 shadow-[4px_4px_0px_0px_#EC4899]" },
    { name: "Consistency", score: dna?.readiness_breakdown?.consistency ?? 90, level: "High Streak", color: "bg-[#22C55E]", border: "border-green-500 shadow-[4px_4px_0px_0px_#22C55E]" },
    { name: "Backend Architecture", score: dna?.readiness_breakdown?.architecture ?? 88, level: "Advanced", color: "bg-[#A855F7]", border: "border-purple-500 shadow-[4px_4px_0px_0px_#A855F7]" },
    { name: "Leadership & Mentorship", score: dna?.readiness_breakdown?.leadership ?? 71, level: "Developing", color: "bg-[#FACC15] text-slate-950", border: "border-yellow-400 shadow-[4px_4px_0px_0px_#FACC15]" },
    { name: "Communication", score: dna?.readiness_breakdown?.communication ?? 69, level: "Needs Practice", color: "bg-[#EF4444]", border: "border-red-500 shadow-[4px_4px_0px_0px_#EF4444]" },
  ];

  const strengths = dna?.strengths ?? [
    { name: "Python / FastAPI", evidence: "Verified by 4 GitHub Repos + AWS ML Cert" },
    { name: "CockroachDB Vector Search", evidence: "Verified by Schema DDL + Memory Engine Project" },
    { name: "LangGraph State Machines", evidence: "Verified by Agentic Architecture implementation" },
    { name: "System Design Concepts", evidence: "Passed 3 technical mock assessments" },
  ];

  const weaknesses = dna?.weaknesses ?? [
    { name: "System Design Edge Cases", impact: "HIGH RISK", fix: "Practice distributed consensus & Raft protocol" },
    { name: "Behavioral Storytelling", impact: "MEDIUM RISK", fix: "Complete 2 behavioral STAR method mock runs" },
    { name: "Cloud IAM Hardening", impact: "LOW RISK", fix: "Review AWS KMS least-privilege policies" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b-4 border-slate-800 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider font-mono flex items-center gap-2.5">
            <Dna className="w-7 h-7 text-purple-400" /> Career DNA Genome Profile
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Empirical multi-dimensional identity model updated dynamically via CockroachDB vector search.
          </p>
        </div>
        <span className="px-3 py-1.5 bg-[#A855F7] text-white border-2 border-slate-100 text-xs font-black font-mono shadow-[3px_3px_0px_0px_#FACC15]">
          GENOME VERSION: V4.2
        </span>
      </div>

      {/* Trait Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {traits.map((trait, idx) => (
          <div key={idx} className={`bg-[#0F172A] p-5 border-2 ${trait.border} space-y-4`}>
            <div className="flex items-center justify-between font-mono">
              <h3 className="text-xs font-black uppercase text-slate-100">{trait.name}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-[#020617] text-yellow-400 border border-slate-700">
                {trait.level}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black font-mono text-slate-50">{trait.score}%</span>
              <span className="text-xs font-mono text-slate-400">READINESS</span>
            </div>

            <div className="w-full bg-[#020617] h-3 border border-slate-700 overflow-hidden">
              <div
                className={`h-full ${trait.color} transition-all duration-500`}
                style={{ width: `${trait.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verified Strengths */}
        <div className="bg-[#0F172A] p-6 border-4 border-green-500 shadow-[6px_6px_0px_0px_#22C55E] space-y-4">
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3 font-mono">
            <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" /> Verified Core Strengths
            </h3>
            <span className="text-xs text-green-400 font-bold">{strengths.length} SIGNALS</span>
          </div>

          <div className="space-y-3">
            {strengths.map((item: any, i: number) => (
              <div key={i} className="p-4 bg-[#020617] border-2 border-slate-700 space-y-1">
                <div className="flex items-center justify-between font-mono">
                  <h4 className="text-xs font-black text-slate-100">{item.name || item.skill_name}</h4>
                  <span className="text-[9px] font-black px-2 py-0.5 bg-green-500 text-slate-950 border border-slate-100 uppercase">
                    VERIFIED
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">{item.evidence || "Empirical achievement signal recorded."}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Known Weaknesses */}
        <div className="bg-[#0F172A] p-6 border-4 border-amber-400 shadow-[6px_6px_0px_0px_#FACC15] space-y-4">
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3 font-mono">
            <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> Recorded Weaknesses & Risk Areas
            </h3>
            <span className="text-xs text-amber-400 font-bold">{weaknesses.length} FOCUS AREAS</span>
          </div>

          <div className="space-y-3">
            {weaknesses.map((item: any, i: number) => (
              <div key={i} className="p-4 bg-[#020617] border-2 border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between font-mono">
                  <h4 className="text-xs font-black text-slate-100">{item.name || item.topic}</h4>
                  <span className="text-[9px] font-black px-2 py-0.5 bg-amber-400 text-slate-950 border border-slate-950 uppercase">
                    {item.impact || "HIGH RISK"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-mono font-medium flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" /> ACTION: {item.fix || "Target deliberate practice session."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
