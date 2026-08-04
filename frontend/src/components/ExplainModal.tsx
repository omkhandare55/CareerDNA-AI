"use client";

import { X, Sparkles, Database, ShieldCheck, CheckCircle2, History, ArrowRight } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl glass-panel-glow rounded-2xl border border-blue-500/30 p-6 shadow-2xl text-slate-100 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#1E293B] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-50">{title}</h3>
              <p className="text-xs text-slate-400">Explainable AI • Memory Evidence Provenance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-[#1E293B] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reason / Why Changed */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Why This Recommendation Changed
          </h4>
          <p className="text-sm text-slate-300 bg-[#0F172A] p-3.5 rounded-xl border border-[#1E293B] leading-relaxed">
            {whyChanged}
          </p>
        </div>

        {/* Evidence / Memories Used */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
            <History className="w-4 h-4" /> CockroachDB Memory Evidence Used
          </h4>
          <div className="space-y-2">
            {memoriesUsed.map((mem, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-[#0F172A]/70 border border-[#1E293B] text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px] border border-blue-500/20">
                    {mem.type}
                  </span>
                  <span className="text-slate-200 font-medium">{mem.title}</span>
                </div>
                <span className="text-[11px] text-slate-400">{mem.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Confidence & Impact Footer */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#1E293B]">
          <div className="p-3 rounded-xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase">Model Confidence</p>
              <p className="text-base font-bold text-purple-400">{(confidenceScore * 100).toFixed(0)}%</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-purple-400" />
          </div>

          <div className="p-3 rounded-xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase">Expected Impact</p>
              <p className="text-base font-bold text-green-400">{expectedImpact}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-green-400" />
          </div>
        </div>

        {/* Dismiss CTA */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition shadow-lg shadow-blue-500/20"
        >
          Understood • Close Analysis
        </button>
      </div>
    </div>
  );
}
