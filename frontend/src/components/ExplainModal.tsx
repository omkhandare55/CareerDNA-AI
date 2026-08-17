"use client";

import { X, Sparkles, ShieldCheck, CheckCircle2, History, ArrowRight } from "lucide-react";

interface ExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  whyChanged: string;
  confidenceScore: number;
  expectedImpact: string;
  memoriesUsed: { title: string; date: string; type: string }[];
}

export default function ExplainModal({
  isOpen,
  onClose,
  title,
  whyChanged,
  confidenceScore,
  expectedImpact,
  memoriesUsed
}: ExplainModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-[#0F172A] border-4 border-slate-100 p-6 shadow-[8px_8px_0px_0px_#A855F7] text-slate-100 space-y-6 font-sans">
        {/* Header */}
        <div className="flex items-start justify-between border-b-4 border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#A855F7] text-white border-2 border-slate-100 font-black shadow-[2px_2px_0px_0px_#FACC15]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-50 uppercase tracking-wider font-mono">{title}</h3>
              <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest font-mono">
                Explainable AI • Memory Evidence Provenance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-[#020617] border-2 border-slate-600 hover:border-red-400 text-slate-300 hover:text-red-400 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reason / Why Changed */}
        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-purple-400 font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-400" /> Why This Recommendation Changed
          </h4>
          <p className="text-xs text-slate-200 bg-[#020617] p-4 border-2 border-purple-500 shadow-[3px_3px_0px_0px_#A855F7] leading-relaxed font-medium">
            {whyChanged}
          </p>
        </div>

        {/* Evidence / Memories Used */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-1.5">
            <History className="w-4 h-4 text-cyan-400" /> CockroachDB Memory Evidence Used
          </h4>
          <div className="space-y-2">
            {memoriesUsed.map((mem, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-[#020617] border-2 border-slate-700 text-xs font-mono"
              >
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 bg-[#3B82F6] text-white font-black text-[9px] border border-slate-100 uppercase">
                    {mem.type}
                  </span>
                  <span className="text-slate-100 font-bold">{mem.title}</span>
                </div>
                <span className="text-[10px] text-yellow-400 font-bold">{mem.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Confidence & Impact Footer */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t-4 border-slate-800">
          <div className="p-3 bg-[#020617] border-2 border-purple-500 shadow-[3px_3px_0px_0px_#A855F7] flex items-center justify-between">
            <div>
              <p className="text-[9px] text-slate-400 font-black uppercase font-mono">Model Confidence</p>
              <p className="text-lg font-black font-mono text-purple-400">{(confidenceScore * 100).toFixed(0)}%</p>
            </div>
            <CheckCircle2 className="w-6 h-6 text-purple-400" />
          </div>

          <div className="p-3 bg-[#020617] border-2 border-green-500 shadow-[3px_3px_0px_0px_#22C55E] flex items-center justify-between">
            <div>
              <p className="text-[9px] text-slate-400 font-black uppercase font-mono">Expected Impact</p>
              <p className="text-lg font-black font-mono text-green-400">{expectedImpact}</p>
            </div>
            <ArrowRight className="w-6 h-6 text-green-400" />
          </div>
        </div>

        {/* Dismiss CTA */}
        <button
          onClick={onClose}
          className="w-full py-3 brutal-btn brutal-btn-yellow text-xs font-black tracking-wider uppercase"
        >
          UNDERSTOOD • CLOSE ANALYSIS
        </button>
      </div>
    </div>
  );
}
