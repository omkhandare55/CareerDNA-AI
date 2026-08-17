"use client";

import { useState } from "react";
import { Network, ZoomIn, ZoomOut, RefreshCw, Info, Layers } from "lucide-react";

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
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b-4 border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider font-mono flex items-center gap-2.5">
            <Network className="w-7 h-7 text-cyan-400" /> Memory Graph Network Visualization
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Visualizing directed memory relationships (`CAUSED_BY`, `SUPERSEDES`, `IMPROVED_BY`) across career milestones.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <button className="p-2 bg-[#0F172A] border-2 border-slate-700 hover:border-yellow-400 text-slate-200 shadow-[2px_2px_0px_0px_#020617]">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button className="p-2 bg-[#0F172A] border-2 border-slate-700 hover:border-yellow-400 text-slate-200 shadow-[2px_2px_0px_0px_#020617]">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button className="p-2 bg-[#0F172A] border-2 border-slate-700 hover:border-yellow-400 text-slate-200 shadow-[2px_2px_0px_0px_#020617]">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive SVG Network Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[8px_8px_0px_0px_#06B6D4] relative min-h-[480px] flex items-center justify-center overflow-hidden">
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
                  stroke="#475569"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const getColor = () => {
                switch (node.category) {
                  case "GOAL": return "fill-[#A855F7] stroke-white";
                  case "SKILL": return "fill-[#3B82F6] stroke-white";
                  case "INTERVIEW": return "fill-[#FACC15] stroke-slate-950";
                  case "CERT": return "fill-[#22C55E] stroke-white";
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
                    r={isSelected ? "24" : "20"}
                    className={`${getColor()} transition-all duration-150 stroke-[3px] filter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] ${
                      isSelected ? "stroke-[5px]" : ""
                    }`}
                  />
                  <text
                    x={node.x}
                    y={node.y + 36}
                    textAnchor="middle"
                    className="fill-slate-100 text-[11px] font-black tracking-wider uppercase font-mono"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Graph Legend */}
          <div className="absolute bottom-4 left-4 flex items-center gap-4 bg-[#020617] p-3 border-2 border-slate-700 text-[10px] font-black uppercase font-mono shadow-[3px_3px_0px_0px_#020617]">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#A855F7] border border-white"></span> Goal</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#3B82F6] border border-white"></span> Skill</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#FACC15] border border-slate-950"></span> Interview</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#22C55E] border border-white"></span> Cert</span>
          </div>
        </div>

        {/* Selected Node Details Drawer */}
        <div className="bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[8px_8px_0px_0px_#EC4899] space-y-4 font-mono">
          <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" /> Node Inspection Drawer
          </h3>

          {selectedNode ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-[#020617] border-2 border-slate-700 space-y-2">
                <span className="text-[9px] font-black px-2 py-0.5 bg-[#3B82F6] text-white border border-slate-100 uppercase">
                  {selectedNode.category} NODE
                </span>
                <h4 className="text-sm font-black text-slate-50 uppercase">{selectedNode.label}</h4>
                <p className="text-xs text-slate-300 font-sans">{selectedNode.evidence}</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 bg-[#020617] border-2 border-slate-700">
                  <span className="text-slate-400 font-bold">Confidence Score</span>
                  <span className="font-black text-purple-400">{(selectedNode.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#020617] border-2 border-slate-700">
                  <span className="text-slate-400 font-bold">Data Source</span>
                  <span className="font-mono text-yellow-400 font-bold">{selectedNode.source}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs space-y-2 font-sans">
              <Layers className="w-8 h-8 mx-auto text-slate-600" />
              <p className="font-mono font-bold uppercase">Click any memory node in the network to inspect evidence provenance.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
