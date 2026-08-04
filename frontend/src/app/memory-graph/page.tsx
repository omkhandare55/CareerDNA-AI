"use client";

import { useState } from "react";
import { Network, Sparkles, Database, Info, Layers, ZoomIn, ZoomOut, RefreshCw } from "lucide-react";

interface NodeData {
  id: string;
  label: string;
  category: "SKILL" | "GOAL" | "INTERVIEW" | "CERT";
  confidence: number;
  evidence: string;
  source: string;
  x: number;
  y: number;
}

export default function MemoryGraphPage() {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

  const nodes: NodeData[] = [
    { id: "n1", label: "Senior AI Engineer Goal", category: "GOAL", confidence: 0.98, evidence: "Primary career objective set by user", source: "CAREER_GOALS", x: 400, y: 100 },
    { id: "n2", label: "LangGraph Framework", category: "SKILL", confidence: 0.95, evidence: "Agentic architecture implementation", source: "PROJECT", x: 220, y: 220 },
    { id: "n3", label: "CockroachDB HNSW Vector Search", category: "SKILL", confidence: 0.92, evidence: "Distributed SQL vector table setup", source: "SCHEMA_DDL", x: 580, y: 220 },
    { id: "n4", label: "FAANG Mock Interview", category: "INTERVIEW", confidence: 0.94, evidence: "Failed System Design question on vector tuning", source: "INTERVIEW_LOG", x: 180, y: 380 },
    { id: "n5", label: "AWS ML Specialty Cert", category: "CERT", confidence: 0.99, evidence: "Passed official AWS exam", source: "S3_CERTIFICATE", x: 620, y: 380 },
    { id: "n6", label: "Python & FastAPI", category: "SKILL", confidence: 0.96, evidence: "4 GitHub Repos + Async Gateway", source: "GITHUB", x: 400, y: 320 }
  ];

  const edges = [
    { from: "n1", to: "n2" },
    { from: "n1", to: "n3" },
    { from: "n2", to: "n4" },
    { from: "n3", to: "n5" },
    { from: "n6", to: "n2" },
    { from: "n6", to: "n3" }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2.5">
            <Network className="w-6 h-6 text-cyan-400" /> CockroachDB Memory Graph Network
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visualizing directed memory relationships (`CAUSED_BY`, `SUPERSEDES`, `IMPROVED_BY`) across career milestones.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg bg-[#0F172A] border border-[#1E293B] text-slate-300 hover:text-white transition">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-[#0F172A] border border-[#1E293B] text-slate-300 hover:text-white transition">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-[#0F172A] border border-[#1E293B] text-slate-300 hover:text-white transition">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive SVG Network Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-[#1E293B] relative min-h-[480px] flex items-center justify-center overflow-hidden">
          <svg className="w-full h-[450px]" viewBox="0 0 800 480">
            {/* Edges */}
            {edges.map((edge, idx) => {
              const sourceNode = nodes.find(n => n.id === edge.from)!;
              const targetNode = nodes.find(n => n.id === edge.to)!;
              return (
                <line
                  key={idx}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke="#334155"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const getColor = () => {
                switch (node.category) {
                  case "GOAL": return "fill-purple-500 stroke-purple-300";
                  case "SKILL": return "fill-blue-500 stroke-blue-300";
                  case "INTERVIEW": return "fill-amber-500 stroke-amber-300";
                  case "CERT": return "fill-emerald-500 stroke-emerald-300";
                }
              };

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer group"
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? "22" : "18"}
                    className={`${getColor()} transition-all duration-200 opacity-90 group-hover:opacity-100 ${
                      isSelected ? "stroke-[4px]" : "stroke-2"
                    }`}
                  />
                  <text
                    x={node.x}
                    y={node.y + 34}
                    textAnchor="middle"
                    className="fill-slate-200 text-[11px] font-semibold tracking-tight"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Graph Legend */}
          <div className="absolute bottom-4 left-4 flex items-center gap-4 bg-[#0F172A]/90 p-2.5 rounded-xl border border-[#1E293B] text-[11px]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Goal</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Skill</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Interview</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Certificate</span>
          </div>
        </div>

        {/* Selected Node Details Drawer */}
        <div className="glass-panel p-6 rounded-2xl border border-[#1E293B] space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" /> Node Inspection
          </h3>

          {selectedNode ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B] space-y-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {selectedNode.category} NODE
                </span>
                <h4 className="text-sm font-bold text-slate-50">{selectedNode.label}</h4>
                <p className="text-xs text-slate-400">{selectedNode.evidence}</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0F172A] border border-[#1E293B]">
                  <span className="text-slate-400">Confidence Score</span>
                  <span className="font-bold text-purple-400">{(selectedNode.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0F172A] border border-[#1E293B]">
                  <span className="text-slate-400">Data Source</span>
                  <span className="font-mono text-slate-200">{selectedNode.source}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs space-y-2">
              <Layers className="w-8 h-8 mx-auto text-slate-600" />
              <p>Click any memory node in the network to inspect its relationships and evidence provenance.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
