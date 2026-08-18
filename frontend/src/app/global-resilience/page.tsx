"use client";

import { useState, useEffect } from "react";
import {
  Globe,
  Shield,
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Server,
  RefreshCw,
  Cpu,
  Lock
} from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";

export default function GlobalResiliencePage() {
  const [topology, setTopology] = useState<any>(null);
  const [targetRegion, setTargetRegion] = useState("aws-eu-west-1");
  const [simulating, setSimulating] = useState(false);
  const [simulation, setSimulation] = useState<any>(null);

  useEffect(() => {
    fetchTopology();
  }, []);

  const fetchTopology = async () => {
    try {
      const data = await apiGet("/api/v1/resilience/topology");
      setTopology(data);
    } catch (err) {
      console.error("Topology error:", err);
    }
  };

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      const res = await apiPost("/api/v1/resilience/simulate-partition", {
        isolated_region: targetRegion,
        failure_type: "NETWORK_PARTITION",
      });
      setSimulation(res);
    } catch (err) {
      console.error("Partition error:", err);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-slate-800 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider font-mono flex items-center gap-2.5">
            <Globe className="w-7 h-7 text-cyan-400" /> Multi-Region Global Resilience & Raft Simulator
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            CockroachDB Cloud Multi-Region Sandbox. Test regional node partitions, automated Raft leaseholder rebalancing, and zero-data-loss failover.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-3 py-1 bg-[#22C55E] text-slate-950 border-2 border-slate-100 font-mono font-black uppercase shadow-[3px_3px_0px_0px_#FACC15]">
            9-NODE 3-REGION CLOUD TOPOLOGY
          </span>
        </div>
      </div>

      {/* Regional Topology Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
        {topology?.regions?.map((reg: any) => {
          const isIsolated = simulation?.isolated_region === reg.aws_region;
          return (
            <div
              key={reg.region_id}
              className={`p-6 border-4 shadow-[6px_6px_0px_0px_#020617] space-y-4 transition ${
                isIsolated
                  ? "bg-[#1E1117] border-red-500 shadow-[6px_6px_0px_0px_#EF4444]"
                  : "bg-[#0F172A] border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-[10px] px-2 py-0.5 bg-[#020617] text-cyan-400 border border-cyan-500 font-bold uppercase">
                  {reg.aws_region}
                </span>
                <span
                  className={`text-[9px] font-black px-2 py-0.5 uppercase border ${
                    isIsolated
                      ? "bg-red-500 text-white border-red-400"
                      : reg.is_leaseholder
                      ? "bg-green-500 text-slate-950 border-green-400"
                      : "bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                >
                  {isIsolated ? "ISOLATED" : reg.raft_status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-100 uppercase">{reg.region_name}</h3>
                <p className="text-[10px] text-slate-400">Nodes: {reg.nodes_count} Dedicated CockroachDB Nodes</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                <div className="p-2 bg-[#020617] border border-slate-800">
                  <span className="text-[8px] text-slate-400 uppercase font-black">Inter-Region Latency</span>
                  <p className="text-xs font-black text-yellow-400">{reg.inter_region_latency_ms}ms</p>
                </div>
                <div className="p-2 bg-[#020617] border border-slate-800">
                  <span className="text-[8px] text-slate-400 uppercase font-black">Availability</span>
                  <p className="text-xs font-black text-green-400">{(reg.health_score * 100).toFixed(2)}%</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulator Control Bar */}
      <div className="bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#FACC15] font-mono space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-300 uppercase">Select Target Region for Outage Drill:</span>
            <select
              value={targetRegion}
              onChange={(e) => setTargetRegion(e.target.value)}
              className="bg-[#020617] border border-slate-700 text-yellow-400 text-xs font-black px-3 py-1.5 uppercase focus:outline-none"
            >
              <option value="aws-eu-west-1">AWS eu-west-1 (Ireland)</option>
              <option value="aws-ap-southeast-1">AWS ap-southeast-1 (Singapore)</option>
              <option value="aws-us-east-1">AWS us-east-1 (N. Virginia)</option>
            </select>
          </div>
          <span className="text-[9px] text-slate-400 font-bold uppercase">ZERO RPO / RTO &lt; 500MS SLA</span>
        </div>

        <button
          onClick={handleSimulate}
          disabled={simulating}
          className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider border-2 border-slate-100 shadow-[4px_4px_0px_0px_#FACC15] flex items-center justify-center gap-2 transition active:translate-x-0.5 active:translate-y-0.5"
        >
          <AlertTriangle className={`w-4 h-4 ${simulating ? "animate-spin" : ""}`} />
          {simulating ? "Executing Raft Quorum Partition..." : `Simulate Outage in ${targetRegion} & Test Failover`}
        </button>
      </div>

      {/* Failover Telemetry Stream */}
      {simulation && (
        <div className="bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[8px_8px_0px_0px_#22C55E] space-y-5 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-800 pb-3 gap-2">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-green-500 text-slate-950 font-black border border-slate-100">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[9px] text-green-400 font-bold uppercase tracking-widest">
                  Failover Succeeded: Zero Data Loss
                </span>
                <h3 className="text-sm font-black text-slate-100 uppercase">
                  Raft Quorum Maintained in {simulation.failover_duration_ms}ms
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2.5 py-1 bg-[#020617] text-green-400 border border-green-400 font-bold">
                DATA LOSS: {simulation.data_loss_bytes} BYTES
              </span>
            </div>
          </div>

          {/* Raft Execution Log */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-yellow-400 uppercase tracking-wider">
              CockroachDB Raft Consensus Event Trace:
            </span>
            <div className="space-y-2">
              {simulation.raft_consensus_log.map((log: string, i: number) => (
                <div key={i} className="p-3 bg-[#020617] border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                  <span className="text-green-400 font-mono font-bold">[{i + 1}]</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
