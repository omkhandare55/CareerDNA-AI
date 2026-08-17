"use client";

import { FileText, Upload, Download, CheckCircle2, Sparkles } from "lucide-react";

export default function ResumePage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b-4 border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider font-mono flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-blue-400" /> Resume & ATS Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Active resume version stored in AWS S3 and parsed into CockroachDB Career DNA state.
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono">
          <button className="py-2 px-4 bg-[#0F172A] border-2 border-slate-700 hover:border-yellow-400 text-slate-200 text-xs font-black uppercase flex items-center gap-2 shadow-[2px_2px_0px_0px_#020617]">
            <Download className="w-4 h-4 text-cyan-400" /> DOWNLOAD PDF
          </button>
          <button className="py-2 px-4 brutal-btn brutal-btn-yellow text-xs flex items-center gap-2">
            <Upload className="w-4 h-4" /> UPLOAD NEW VERSION
          </button>
        </div>
      </div>

      {/* Main Resume Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ATS Score Overview */}
        <div className="bg-[#0F172A] p-6 border-4 border-green-500 shadow-[6px_6px_0px_0px_#22C55E] space-y-4 font-mono">
          <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider">ATS Optimization Index</h3>

          <div className="flex items-center justify-between p-4 bg-[#020617] border-2 border-green-500 shadow-[3px_3px_0px_0px_#22C55E]">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Overall ATS Score</p>
              <p className="text-4xl font-black font-mono text-green-400">89%</p>
            </div>
            <div className="p-3 bg-green-500 text-slate-950 border border-slate-950 font-black">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 bg-[#020617] border border-slate-700">
              <span className="text-slate-400 font-bold">Keyword Density</span>
              <span className="text-slate-100 font-black">94%</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-[#020617] border border-slate-700">
              <span className="text-slate-400 font-bold">Formatting Quality</span>
              <span className="text-slate-100 font-black">96%</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-[#020617] border border-slate-700">
              <span className="text-slate-400 font-bold">Target Role Alignment</span>
              <span className="text-purple-400 font-black">88%</span>
            </div>
          </div>
        </div>

        {/* Missing Keywords & Recruiter Suggestions */}
        <div className="lg:col-span-2 bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#A855F7] space-y-4 font-mono">
          <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" /> Recruiter Optimization Suggestions
          </h3>

          <div className="space-y-3">
            {[
              {
                title: "Add Explicit Vector Database Metrics",
                suggestion: "Specify CockroachDB HNSW index performance (sub-50ms latency) in project bullet points.",
                status: "RECOMMENDED",
                color: "bg-amber-400 text-slate-950 border-slate-950"
              },
              {
                title: "Highlight AWS Bedrock LLM Integration",
                suggestion: "Mention Claude 3.5 Sonnet & Titan Embeddings model deployment experience.",
                status: "HIGH IMPACT",
                color: "bg-purple-500 text-white border-slate-100"
              }
            ].map((rec, i) => (
              <div key={i} className="p-4 bg-[#020617] border-2 border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-100 uppercase">{rec.title}</h4>
                  <span className={`text-[9px] font-black px-2 py-0.5 border ${rec.color}`}>
                    {rec.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans font-medium">{rec.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
