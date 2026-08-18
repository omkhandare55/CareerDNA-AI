"use client";

import { useState, useEffect } from "react";
import {
  Layers,
  Cpu,
  Database,
  Globe,
  Zap,
  ArrowRight,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Lock
} from "lucide-react";
import { apiGet } from "@/lib/api";

export default function ArchitecturePage() {
  const [arch, setArch] = useState<any>(null);

  useEffect(() => {
    apiGet("/api/v1/showcase/architecture-spec")
      .then((data) => {
        if (data) setArch(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-slate-800 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider font-mono flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-cyan-400" /> Fullstack System Architecture & Data Flow Explorer
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            End-to-end technical topology. Maps interactions across Next.js 16, FastAPI AsyncIO, AWS Bedrock, and CockroachDB Cloud Serverless HNSW vector indexes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-3 py-1 bg-cyan-600 text-white border-2 border-slate-100 font-mono font-black uppercase shadow-[3px_3px_0px_0px_#FACC15]">
            4-LAYER VECTOR NATIVE STACK
          </span>
        </div>
      </div>

      {/* 4 Architectural Layers */}
      <div className="space-y-4 font-mono">
        <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider">
          Architectural Layer Hierarchy & SLAs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {arch?.layers?.map((layer: any, idx: number) => (
            <div
              key={idx}
              className="bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#020617] space-y-4 hover:border-slate-600 transition"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-xs font-black text-slate-100 uppercase">{layer.layer_name}</h4>
                <span
                  className="text-[9px] px-2 py-0.5 text-slate-950 font-black uppercase"
                  style={{ backgroundColor: layer.layer_color }}
                >
                  {layer.benchmark_sla}
                </span>
              </div>

              {/* Technologies */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase">Core Technologies:</span>
                <div className="flex flex-wrap gap-1">
                  {layer.technologies.map((t: string, i: number) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-[#020617] text-cyan-400 border border-slate-700 font-bold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Responsibilities */}
              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-400 uppercase">Key Responsibilities:</span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {layer.responsibilities.map((r: string, i: number) => (
                    <li key={i}>• {r}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* End-to-End Data Flow Sequence */}
      <div className="bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#22C55E] font-mono space-y-4">
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
          <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-400" /> End-to-End Async Vector Data Flow (Step 1 to 6)
          </h3>
          <span className="text-[9px] text-yellow-400 font-bold uppercase">ROUNDTRIP &lt; 550MS P99</span>
        </div>

        <div className="space-y-3">
          {arch?.data_flows?.map((step: any) => (
            <div
              key={step.step_num}
              className="p-4 bg-[#020617] border-2 border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-yellow-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  {step.step_num}
                </span>
                <div>
                  <div className="flex items-center gap-2 text-xs font-black text-slate-100 uppercase">
                    <span>{step.source_layer}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{step.target_layer}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{step.payload_description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[9px] px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                  {step.protocol}
                </span>
                <span className="text-xs font-black text-green-400">{step.avg_latency_ms} ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
