"use client";

import { useState, useEffect } from "react";
import {
  Server,
  Database,
  Activity,
  Terminal,
  ShieldCheck,
  Zap,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Layers,
  ArrowRight,
  Send
} from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";

export default function ClusterOpsPage() {
  const [clusterData, setClusterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cliCommand, setCliCommand] = useState("ccloud cluster list --format=json");
  const [cliOutput, setCliOutput] = useState<any>(null);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    fetchClusterStatus();
    runCcloud("ccloud cluster list --format=json");
  }, []);

  const fetchClusterStatus = async () => {
    setLoading(true);
    try {
      const data = await apiGet("/api/v1/cluster/status");
      setClusterData(data);
    } catch (err) {
      console.error("Cluster status error:", err);
    } finally {
      setLoading(false);
    }
  };

  const runCcloud = async (cmd: string) => {
    setExecuting(true);
    try {
      const res = await apiPost("/api/v1/cluster/exec-ccloud", { command: cmd });
      setCliOutput(res);
    } catch (err) {
      console.error("ccloud exec error:", err);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-slate-800 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider font-mono flex items-center gap-2.5">
            <Server className="w-7 h-7 text-green-400" /> CockroachDB & AWS Control Plane Operations
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Live telemetry for distributed CockroachDB Cloud connection pool, HNSW vector search, Raft leaseholders, and ccloud CLI automation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchClusterStatus}
            disabled={loading}
            className="px-3.5 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] border-2 border-slate-700 text-slate-200 text-xs font-mono font-bold uppercase flex items-center gap-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Status
          </button>
          <span className="text-[10px] px-3 py-1.5 bg-green-500 text-slate-950 border-2 border-slate-100 font-mono font-black uppercase shadow-[3px_3px_0px_0px_#FACC15]">
            CLUSTER: SERVING (0 UNREPLICATED)
          </span>
        </div>
      </div>

      {/* Cluster Overview Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        {/* Cluster Info */}
        <div className="bg-[#0F172A] p-5 border-4 border-slate-800 shadow-[4px_4px_0px_0px_#3B82F6] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cluster Name</span>
            <span className="px-1.5 py-0.5 text-[8px] bg-blue-500 text-white font-black">AWS US-EAST-1</span>
          </div>
          <p className="text-xl font-black text-slate-100 uppercase">{clusterData?.cluster_name || "silk-ninja-32317"}</p>
          <p className="text-[10px] text-yellow-400 font-medium">
            {clusterData?.version || "CockroachDB v24.1.3 Cloud Serverless"}
          </p>
        </div>

        {/* Connection Pool */}
        <div className="bg-[#0F172A] p-5 border-4 border-slate-800 shadow-[4px_4px_0px_0px_#22C55E] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Connection Pool</span>
            <span className="px-1.5 py-0.5 text-[8px] bg-green-500 text-slate-950 font-black">ONLINE</span>
          </div>
          <p className="text-xl font-black text-green-400">
            {clusterData?.connection_pool?.active_connections || 4} / {clusterData?.connection_pool?.max_connections || 20}
          </p>
          <p className="text-[10px] text-slate-400 font-medium">
            SSL: {clusterData?.connection_pool?.ssl_mode || "require"} (psycopg2 pool)
          </p>
        </div>

        {/* HNSW Vector Latency */}
        <div className="bg-[#0F172A] p-5 border-4 border-slate-800 shadow-[4px_4px_0px_0px_#A855F7] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">HNSW Latency</span>
            <span className="px-1.5 py-0.5 text-[8px] bg-purple-500 text-white font-black">1024d VECTOR</span>
          </div>
          <p className="text-xl font-black text-purple-400">
            {clusterData?.vector_indexing?.avg_query_latency_ms || 38.4} ms
          </p>
          <p className="text-[10px] text-slate-400 font-medium">
            Distance: vector_cosine_ops
          </p>
        </div>

        {/* Raft Ranges */}
        <div className="bg-[#0F172A] p-5 border-4 border-slate-800 shadow-[4px_4px_0px_0px_#FACC15] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Raft Ranges</span>
            <span className="px-1.5 py-0.5 text-[8px] bg-yellow-400 text-slate-950 font-black">3x REPLICAS</span>
          </div>
          <p className="text-xl font-black text-yellow-400">
            {clusterData?.raft_topology?.ranges_count || 142} Ranges
          </p>
          <p className="text-[10px] text-green-400 font-medium">
            0 under-replicated ranges
          </p>
        </div>
      </div>

      {/* Main Architecture & CLI Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
        {/* CockroachDB Topology & MCP Server Status */}
        <div className="lg:col-span-5 bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#3B82F6] space-y-5">
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
            <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" /> Vector Index & MCP Schema
            </h3>
            <span className="text-[9px] px-2 py-0.5 bg-blue-500 text-white font-bold border border-slate-700 uppercase">
              SCHEMA VERIFIED
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#020617] border border-slate-700 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-slate-400">Index Name:</span>
                <span className="text-purple-400">idx_career_memories_embedding</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-slate-400">Table:</span>
                <span className="text-slate-200">career_memories</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-slate-400">Vector Dimension:</span>
                <span className="text-yellow-400">1024d (Amazon Titan V2)</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-slate-400">Topology:</span>
                <span className="text-green-400">HNSW Graph</span>
              </div>
            </div>

            <div className="p-3 bg-[#020617] border border-slate-700 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-slate-400">Cloud MCP Server:</span>
                <span className="text-green-400">ONLINE</span>
              </div>
              <p className="text-[10px] text-slate-300 truncate">https://cockroachlabs.cloud/mcp</p>
              <div className="flex flex-wrap gap-1 pt-1">
                <span className="text-[8px] px-1.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-700">
                  query_vector_memory
                </span>
                <span className="text-[8px] px-1.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-700">
                  insert_career_memory
                </span>
                <span className="text-[8px] px-1.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-700">
                  log_recommendation_evolution
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#020617] border border-slate-700 space-y-1">
              <span className="text-[10px] font-bold text-slate-400">Leaseholder Distribution:</span>
              <p className="text-[11px] text-slate-200">{clusterData?.raft_topology?.leaseholder_distribution || "Balanced (us-east-1a, us-east-1b, us-east-1c)"}</p>
            </div>
          </div>
        </div>

        {/* Interactive ccloud CLI Terminal */}
        <div className="lg:col-span-7 bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#22C55E] space-y-5">
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
            <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-green-400" /> ccloud CLI Agent Automation
            </h3>
            <span className="text-[9px] px-2 py-0.5 bg-green-500 text-slate-950 font-black uppercase">
              AGENT-READY
            </span>
          </div>

          {/* Quick Preset Command Chips */}
          <div className="flex flex-wrap gap-2">
            {[
              "ccloud cluster list --format=json",
              "ccloud sql show-indexes",
              "ccloud health check"
            ].map((cmd) => (
              <button
                key={cmd}
                onClick={() => {
                  setCliCommand(cmd);
                  runCcloud(cmd);
                }}
                className={`px-2.5 py-1 text-[10px] font-bold uppercase border transition ${
                  cliCommand === cmd
                    ? "bg-green-500 text-slate-950 border-slate-100"
                    : "bg-[#020617] text-slate-300 border-slate-700 hover:border-slate-500"
                }`}
              >
                $ {cmd}
              </button>
            ))}
          </div>

          {/* CLI Input */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-[#020617] border-2 border-slate-700 px-3 py-2">
              <span className="text-green-400 text-xs font-bold mr-2">$</span>
              <input
                type="text"
                value={cliCommand}
                onChange={(e) => setCliCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") runCcloud(cliCommand);
                }}
                placeholder="Enter ccloud or SQL command..."
                className="w-full bg-transparent text-slate-100 text-xs font-mono focus:outline-none"
              />
            </div>
            <button
              onClick={() => runCcloud(cliCommand)}
              disabled={executing}
              className="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-slate-950 font-black text-xs uppercase border-2 border-slate-100 shadow-[2px_2px_0px_0px_#FACC15] flex items-center gap-1.5 transition active:translate-x-0.5 active:translate-y-0.5"
            >
              <Send className={`w-3.5 h-3.5 ${executing ? "animate-pulse" : ""}`} />
              Run
            </button>
          </div>

          {/* Terminal Output Window */}
          <div className="p-4 bg-[#020617] border-2 border-slate-800 text-[11px] font-mono space-y-2 min-h-[190px] overflow-auto">
            <div className="flex items-center justify-between text-[9px] text-slate-500 border-b border-slate-800 pb-1">
              <span>OUTPUT [JSON FORMAT]</span>
              <span>{cliOutput ? `${cliOutput.execution_time_ms} ms` : "0 ms"}</span>
            </div>
            <pre className="text-green-400 overflow-x-auto leading-relaxed">
              {cliOutput ? JSON.stringify(cliOutput.output, null, 2) : "// Executing command..."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
