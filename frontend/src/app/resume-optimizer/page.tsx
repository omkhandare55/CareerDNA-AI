"use client";

import { useState, useEffect } from "react";
import {
  FileCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Award,
  Zap,
  Copy,
  Download,
  RefreshCw
} from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";

const DEFAULT_BULLETS = [
  "Worked on backend database and added vector search for users.",
  "Built microservices with FastAPI and improved performance.",
  "Helped team maintain distributed clusters and fixed bugs."
];

export default function ResumeOptimizerPage() {
  const [targetRole, setTargetRole] = useState("Staff AI Systems Engineer");
  const [bulletsText, setBulletsText] = useState(DEFAULT_BULLETS.join("\n"));
  const [optimizing, setOptimizing] = useState(false);
  const [optimization, setOptimization] = useState<any>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    runOptimization(DEFAULT_BULLETS, targetRole);
  }, []);

  const runOptimization = async (bullets: string[], role: string) => {
    setOptimizing(true);
    try {
      const res = await apiPost("/api/v1/resume-optimizer/optimize-bullets", {
        original_bullets: bullets,
        target_role: role,
      });
      setOptimization(res);
    } catch (err) {
      console.error("Optimization error:", err);
    } finally {
      setOptimizing(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-slate-800 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider font-mono flex items-center gap-2.5">
            <FileCheck className="w-7 h-7 text-pink-400" /> AI Resume ATS Diff & Bullet Optimizer
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Transform passive resume bullets into high-impact Google XYZ statements (Accomplished [X], measured by [Y], by doing [Z]) with CockroachDB & AWS keywords.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-3 py-1 bg-[#EC4899] text-white border-2 border-slate-100 font-mono font-black uppercase shadow-[3px_3px_0px_0px_#FACC15]">
            GOOGLE XYZ STANDARD ACTIVE
          </span>
        </div>
      </div>

      {/* Editor & Target Bar */}
      <div className="bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#3B82F6] font-mono space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-300 uppercase">Target Role:</span>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="bg-[#020617] border border-slate-700 text-yellow-400 text-xs font-black px-3 py-1.5 uppercase focus:outline-none"
            >
              <option value="Staff AI Systems Engineer">Staff AI Systems Engineer</option>
              <option value="Principal Distributed Systems Architect">Principal Distributed Systems Architect</option>
              <option value="Senior Cloud AI Engineer">Senior Cloud AI Engineer</option>
            </select>
          </div>
          <span className="text-[9px] text-slate-400 font-bold uppercase">1 BULLET PER LINE</span>
        </div>

        <div className="space-y-2">
          <textarea
            rows={4}
            value={bulletsText}
            onChange={(e) => setBulletsText(e.target.value)}
            placeholder="Enter one resume bullet point per line..."
            className="w-full bg-[#020617] border-2 border-slate-700 text-slate-100 p-3 text-xs font-mono focus:border-[#3B82F6] focus:outline-none leading-relaxed"
          />
        </div>

        <button
          onClick={() => {
            const lines = bulletsText.split("\n").map((l) => l.trim()).filter(Boolean);
            if (lines.length > 0) runOptimization(lines, targetRole);
          }}
          disabled={optimizing}
          className="w-full py-3.5 bg-[#3B82F6] hover:bg-blue-600 text-white font-black text-xs uppercase tracking-wider border-2 border-slate-100 shadow-[4px_4px_0px_0px_#FACC15] flex items-center justify-center gap-2 transition active:translate-x-0.5 active:translate-y-0.5"
        >
          <Sparkles className={`w-4 h-4 ${optimizing ? "animate-spin" : ""}`} />
          {optimizing ? "Generating Google XYZ Rewrites..." : "Optimize Bullets & Recalculate ATS Score"}
        </button>
      </div>

      {/* ATS Score Improvement Banner */}
      {optimization && (
        <div className="bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#22C55E] font-mono space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-800 pb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#020617] border-2 border-slate-700 text-center">
                <span className="text-[9px] text-slate-400 uppercase">Original ATS</span>
                <p className="text-2xl font-black text-slate-400">{optimization.original_ats_score}%</p>
              </div>
              <ArrowRight className="w-6 h-6 text-green-400" />
              <div className="p-3 bg-[#020617] border-2 border-green-500 shadow-[2px_2px_0px_0px_#22C55E] text-center">
                <span className="text-[9px] text-green-400 uppercase font-black">Optimized ATS</span>
                <p className="text-2xl font-black text-green-400">{optimization.optimized_ats_score}%</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] text-yellow-400 font-black uppercase tracking-widest">ATS Match Lift</span>
              <p className="text-2xl font-black text-yellow-400 font-mono">+{optimization.score_delta} points</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase">Recommended Keywords Injected:</span>
            <div className="flex flex-wrap gap-1.5">
              {optimization.recommended_keywords_to_add.map((k: string, i: number) => (
                <span key={i} className="px-2.5 py-1 text-[10px] bg-[#020617] text-pink-400 border border-pink-500 font-bold uppercase">
                  ⚡ {k}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Diff Cards */}
      <div className="space-y-6 font-mono">
        <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider">
          Side-by-Side Before / After Diff Rewrites
        </h3>

        <div className="space-y-4">
          {optimization?.bullet_diffs?.map((diff: any, idx: number) => (
            <div
              key={idx}
              className="bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#EC4899] space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original */}
                <div className="p-4 bg-[#020617] border-2 border-red-500/50 space-y-2">
                  <span className="text-[9px] font-black text-red-400 uppercase">Original Bullet (Passive)</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono line-through opacity-70">
                    "{diff.original}"
                  </p>
                </div>

                {/* Optimized Google XYZ */}
                <div className="p-4 bg-[#020617] border-2 border-green-500 shadow-[2px_2px_0px_0px_#22C55E] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-green-400 uppercase">Google XYZ Rewrite</span>
                    <button
                      onClick={() => handleCopy(diff.optimized_xyz, idx)}
                      className="text-[9px] text-yellow-400 hover:text-white font-bold uppercase flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      {copiedIdx === idx ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="text-xs text-slate-50 font-black leading-relaxed font-mono">
                    "{diff.optimized_xyz}"
                  </p>
                </div>
              </div>

              {/* Rationale & Keywords */}
              <div className="p-3 bg-[#0A0F1D] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px]">
                <div className="space-y-1">
                  <span className="text-yellow-400 font-bold uppercase">Rationale: </span>
                  <span className="text-slate-300">{diff.improvement_reason}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-slate-400 font-bold uppercase">Metric:</span>
                  <span className="text-green-400 font-black">{diff.impact_metric_added}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
