"use client";

import { FileText, Upload, Download, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export default function ResumePage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-blue-400" /> Resume & ATS Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Active resume version stored in AWS S3 and parsed into CockroachDB Career DNA state.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] border border-[#1E293B] text-slate-300 text-xs font-semibold transition flex items-center gap-2">
            <Download className="w-4 h-4" /> Download Resume PDF
          </button>
          <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload New Version
          </button>
        </div>
      </div>

      {/* Main Resume Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ATS Score Overview */}
        <div className="glass-panel p-6 rounded-2xl border border-[#1E293B] space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">ATS Optimization Index</h3>

          <div className="flex items-center justify-between p-4 rounded-xl bg-[#0F172A] border border-[#1E293B]">
            <div>
              <p className="text-[11px] text-slate-400 font-medium uppercase">Overall ATS Score</p>
              <p className="text-3xl font-extrabold font-mono text-green-400">89%</p>
            </div>
            <div className="p-3 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Keyword Density</span>
              <span className="text-slate-200 font-bold">94%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Formatting Quality</span>
              <span className="text-slate-200 font-bold">96%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Target Role Alignment</span>
              <span className="text-purple-400 font-bold">88%</span>
            </div>
          </div>
        </div>

        {/* Missing Keywords & Recruiter Suggestions */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-[#1E293B] space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" /> Recruiter Optimization Suggestions
          </h3>

          <div className="space-y-3">
            {[
              {
                title: "Add Explicit Vector Database Metrics",
                suggestion: "Specify CockroachDB HNSW index performance (sub-50ms latency) in project bullet points.",
                status: "Recommended",
                color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
              },
              {
                title: "Highlight AWS Bedrock LLM Integration",
                suggestion: "Mention Claude 3.5 Sonnet & Titan Embeddings model deployment experience.",
                status: "High Impact",
                color: "text-purple-400 bg-purple-500/10 border-purple-500/20"
              }
            ].map((rec, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B] space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-100">{rec.title}</h4>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${rec.color}`}>
                    {rec.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{rec.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
