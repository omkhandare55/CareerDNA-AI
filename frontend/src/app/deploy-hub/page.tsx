"use client";

import { useState, useEffect } from "react";
import {
  Cloud,
  Copy,
  CheckCircle2,
  Terminal,
  Server,
  ShieldCheck,
  Zap,
  Download,
  ExternalLink
} from "lucide-react";
import { apiGet } from "@/lib/api";

export default function DeployHubPage() {
  const [manifests, setManifests] = useState<any[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    apiGet("/api/v1/showcase/deploy-manifests")
      .then((data) => {
        if (data?.manifests?.length) setManifests(data.manifests);
      })
      .catch(() => {});
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selected = manifests[selectedIdx];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-slate-800 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider font-mono flex items-center gap-2.5">
            <Cloud className="w-7 h-7 text-cyan-400" /> Multi-Cloud Production Deployment Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Production-grade deployment configurations for Docker Compose, Kubernetes, AWS ECS, and Google Cloud Run with CockroachDB Cloud connection pooling.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-3 py-1 bg-cyan-600 text-white border-2 border-slate-100 font-mono font-black uppercase shadow-[3px_3px_0px_0px_#FACC15]">
            ENTERPRISE DEPLOYMENT READY
          </span>
        </div>
      </div>

      {/* Production Readiness Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#0F172A] p-4 border-4 border-slate-800 shadow-[4px_4px_0px_0px_#22C55E] space-y-1">
          <span className="text-[9px] font-black text-slate-400 uppercase">Database Cluster</span>
          <p className="text-xs font-black text-green-400">CockroachDB Cloud</p>
          <p className="text-[10px] text-slate-400">Serverless (TLS SSL)</p>
        </div>
        <div className="bg-[#0F172A] p-4 border-4 border-slate-800 shadow-[4px_4px_0px_0px_#A855F7] space-y-1">
          <span className="text-[9px] font-black text-slate-400 uppercase">Foundation Models</span>
          <p className="text-xs font-black text-purple-400">AWS Bedrock</p>
          <p className="text-[10px] text-slate-400">Claude 3.5 + Titan 1024d</p>
        </div>
        <div className="bg-[#0F172A] p-4 border-4 border-slate-800 shadow-[4px_4px_0px_0px_#3B82F6] space-y-1">
          <span className="text-[9px] font-black text-slate-400 uppercase">Backend Gateway</span>
          <p className="text-xs font-black text-cyan-400">FastAPI AsyncIO</p>
          <p className="text-[10px] text-slate-400">Uvicorn + SSE Streamer</p>
        </div>
        <div className="bg-[#0F172A] p-4 border-4 border-slate-800 shadow-[4px_4px_0px_0px_#EC4899] space-y-1">
          <span className="text-[9px] font-black text-slate-400 uppercase">Frontend Web App</span>
          <p className="text-xs font-black text-pink-400">Next.js 16 (Turbopack)</p>
          <p className="text-[10px] text-slate-400">30 Static Prerendered Pages</p>
        </div>
      </div>

      {/* Manifest Tabs & Viewer */}
      <div className="bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#FACC15] font-mono space-y-4">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b-2 border-slate-800 pb-3">
          {manifests.map((m, i) => (
            <button
              key={i}
              onClick={() => setSelectedIdx(i)}
              className={`px-4 py-2 text-xs font-black uppercase border-2 transition ${
                selectedIdx === i
                  ? "bg-[#020617] text-yellow-400 border-yellow-400 shadow-[2px_2px_0px_0px_#FACC15]"
                  : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
              }`}
            >
              {m.target_platform}
            </button>
          ))}
        </div>

        {selected && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-slate-100 uppercase">{selected.filename}</span>
                <p className="text-[10px] text-slate-400">{selected.description}</p>
              </div>
              <button
                onClick={() => handleCopy(selected.manifest_content)}
                className="px-3.5 py-1.5 bg-[#3B82F6] hover:bg-blue-600 text-white text-[10px] font-black uppercase border border-slate-100 flex items-center gap-1.5 transition shadow-[2px_2px_0px_0px_#FACC15]"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? "Copied!" : "Copy Manifest"}
              </button>
            </div>

            {/* Code Block */}
            <pre className="p-4 bg-[#020617] border-2 border-slate-800 text-green-400 text-xs font-mono overflow-auto max-h-[360px] leading-relaxed">
              {selected.manifest_content}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
