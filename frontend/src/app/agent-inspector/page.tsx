"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Cpu,
  Layers,
  Zap,
  CheckCircle2,
  Clock,
  Database,
  ArrowRight,
  RefreshCw,
  GitBranch,
  ShieldCheck
} from "lucide-react";
import { apiGet } from "@/lib/api";

export default function AgentInspectorPage() {
  const [graphState, setGraphState] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGraphState();
  }, []);

  const fetchGraphState = async () => {
    setLoading(true);
    try {
      const data = await apiGet("/api/v1/agent-inspector/graph-state");
      setGraphState(data);
      if (data?.nodes?.length) {
        setSelectedNode(data.nodes[4]); // Default to node 5 (Recommendation Generator)
      }
    } catch (err) {
      console.error("Graph state error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-slate-800 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider font-mono flex items-center gap-2.5">
            <Activity className="w-7 h-7 text-cyan-400" /> LangGraph Agent State Machine Inspector
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Live telemetry for 10 LangGraph agent nodes, cyclical state transitions, checkpoint rollbacks, and vector memory retrieval.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchGraphState}
            disabled={loading}
            className="px-3 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] border-2 border-slate-700 text-slate-200 text-xs font-mono font-bold uppercase flex items-center gap-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh State
          </button>
          <span className="text-[10px] px-3 py-1.5 bg-cyan-600 text-white border-2 border-slate-100 font-mono font-black uppercase shadow-[3px_3px_0px_0px_#FACC15]">
            10-NODE DAG ACTIVE
          </span>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#0F172A] p-4 border-4 border-slate-800 shadow-[4px_4px_0px_0px_#3B82F6] space-y-1">
          <span className="text-[9px] font-black text-slate-400 uppercase">Active Foundation Model</span>
          <p className="text-sm font-black text-yellow-400 truncate">Claude 3.5 Sonnet</p>
          <p className="text-[10px] text-slate-400">AWS Bedrock Provider</p>
        </div>
        <div className="bg-[#0F172A] p-4 border-4 border-slate-800 shadow-[4px_4px_0px_0px_#A855F7] space-y-1">
          <span className="text-[9px] font-black text-slate-400 uppercase">Titan Embeddings V2</span>
          <p className="text-sm font-black text-purple-400">1024 Dimensions</p>
          <p className="text-[10px] text-slate-400">HNSW Vector Space</p>
        </div>
        <div className="bg-[#0F172A] p-4 border-4 border-slate-800 shadow-[4px_4px_0px_0px_#22C55E] space-y-1">
          <span className="text-[9px] font-black text-slate-400 uppercase">Vector Query Latency</span>
          <p className="text-sm font-black text-green-400">38.4 ms</p>
          <p className="text-[10px] text-slate-400">CockroachDB HNSW</p>
        </div>
        <div className="bg-[#0F172A] p-4 border-4 border-slate-800 shadow-[4px_4px_0px_0px_#FACC15] space-y-1">
          <span className="text-[9px] font-black text-slate-400 uppercase">Active Checkpoint</span>
          <p className="text-sm font-black text-slate-100 truncate">{graphState?.active_checkpoint_id || "chk_0982348"}</p>
          <p className="text-[10px] text-green-400">Rollback Ready</p>
        </div>
      </div>

      {/* Main DAG Graph Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
        {/* Visual 10-Node Flow */}
        <div className="lg:col-span-7 bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#3B82F6] space-y-5">
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
            <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" /> LangGraph 10-Node Execution DAG
            </h3>
            <span className="text-[9px] text-slate-400 font-bold uppercase">CLICK NODE TO INSPECT STATE</span>
          </div>

          <div className="space-y-2.5">
            {graphState?.nodes?.map((node: any) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-3.5 border-2 cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? "bg-[#020617] border-cyan-400 shadow-[3px_3px_0px_0px_#06B6D4] translate-x-1"
                      : "bg-[#020617] border-slate-800 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      node.status === "COMPLETED"
                        ? "bg-green-500"
                        : node.status === "RUNNING"
                        ? "bg-yellow-400 animate-ping"
                        : "bg-slate-600"
                    }`} />
                    <div>
                      <h4 className="text-xs font-black text-slate-100 uppercase">{node.label}</h4>
                      <p className="text-[10px] text-slate-400">{node.phase} PHASE</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-[8px] font-black px-2 py-0.5 border uppercase ${
                      node.status === "COMPLETED"
                        ? "bg-green-500 text-slate-950 border-green-400"
                        : node.status === "RUNNING"
                        ? "bg-yellow-400 text-slate-950 border-yellow-300"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}>
                      {node.status}
                    </span>
                    <p className="text-[9px] text-slate-500 pt-1 font-mono">{node.execution_time_ms}ms</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Node Telemetry & State Inspector */}
        <div className="lg:col-span-5 bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#FACC15] space-y-5">
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
            <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-yellow-400" /> Node Telemetry & State Payload
            </h3>
            {selectedNode && (
              <span className="text-[9px] px-2 py-0.5 bg-[#EC4899] text-white font-black uppercase">
                {selectedNode.phase}
              </span>
            )}
          </div>

          {selectedNode ? (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[#020617] border-2 border-slate-700 space-y-2">
                <h4 className="text-xs font-black text-yellow-400 uppercase">{selectedNode.label}</h4>
                <p className="text-slate-200 text-[11px] leading-relaxed">{selectedNode.summary}</p>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[10px]">
                  <div>
                    <span className="text-slate-400">Execution Latency:</span>
                    <p className="text-green-400 font-bold">{selectedNode.execution_time_ms} ms</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Output Tokens:</span>
                    <p className="text-purple-400 font-bold">{selectedNode.output_tokens} tokens</p>
                  </div>
                </div>
              </div>

              {/* State JSON Viewer */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase">LangGraph State Dictionary</span>
                <pre className="p-4 bg-[#020617] border-2 border-slate-800 text-cyan-400 text-[11px] font-mono overflow-auto max-h-[220px] leading-relaxed">
                  {JSON.stringify(graphState?.state_payload, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Select a node to inspect its execution telemetry.</p>
          )}
        </div>
      </div>
    </div>
  );
}
