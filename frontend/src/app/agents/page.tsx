"use client";

import { useState, useEffect } from "react";
import {
  Bot,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Send,
  RefreshCw,
  Award,
  Zap,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";

export default function MultiAgentTeamPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [query, setQuery] = useState(
    "Should I prioritize learning CockroachDB vector indexing or focus on distributed consensus for my upcoming Google L6 interview?"
  );
  const [deliberating, setDeliberating] = useState(false);
  const [deliberation, setDeliberation] = useState<any>(null);

  useEffect(() => {
    apiGet("/api/v1/agents/roster")
      .then((data) => {
        if (data?.agents) setAgents(data.agents);
      })
      .catch(() => {});

    // Run initial collaboration
    runDeliberation(query);
  }, []);

  const runDeliberation = async (qText: string) => {
    if (!qText.trim() || deliberating) return;
    setDeliberating(true);
    try {
      const res = await apiPost("/api/v1/agents/collaborate", { query: qText });
      setDeliberation(res);
    } catch (err) {
      console.error("Deliberation error:", err);
    } finally {
      setDeliberating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-slate-800 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider font-mono flex items-center gap-2.5">
            <Bot className="w-7 h-7 text-pink-400" /> Multi-Agent Career Team Collaboration
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            6 specialized autonomous AI agents debate, deliberate, and formulate unified career strategies backed by CockroachDB memory.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-3 py-1 bg-[#EC4899] text-white border-2 border-slate-100 font-mono font-black uppercase shadow-[3px_3px_0px_0px_#FACC15]">
            6 SPECIALIZED SUBAGENTS ONLINE
          </span>
        </div>
      </div>

      {/* 6 Agent Roster Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
        {agents.map((agent) => (
          <div
            key={agent.agent_id}
            className="bg-[#0F172A] p-3.5 border-2 border-slate-800 space-y-2 hover:border-slate-500 transition relative shadow-[3px_3px_0px_0px_#020617]"
          >
            <div className="flex items-center justify-between">
              <div
                className="w-3 h-3 rounded-full border border-slate-100"
                style={{ backgroundColor: agent.avatar_color }}
              />
              <span className="text-[8px] px-1.5 py-0.5 bg-green-500 text-slate-950 font-black">
                ACTIVE
              </span>
            </div>
            <div>
              <h4 className="text-[11px] font-black text-slate-100 uppercase truncate">
                {agent.name.replace(" Agent", "")}
              </h4>
              <p className="text-[9px] text-slate-400 truncate">{agent.role_title}</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {agent.expertise.slice(0, 2).map((exp: string, i: number) => (
                <span key={i} className="text-[8px] px-1 py-0.5 bg-slate-800 text-slate-300 border border-slate-700">
                  {exp}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Query Bar */}
      <div className="bg-[#0F172A] p-5 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#3B82F6] font-mono space-y-3">
        <label className="text-[10px] font-black text-slate-300 uppercase flex items-center justify-between">
          <span>Submit Strategic Career Dilemma for Multi-Agent Deliberation</span>
          <span className="text-yellow-400">AWS BEDROCK MULTI-AGENT DAG</span>
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything (e.g. negotiation tactics, interview trade-offs, skill priorities)..."
            className="flex-1 bg-[#020617] border-2 border-slate-700 text-slate-100 px-4 py-2.5 text-xs font-mono focus:border-[#3B82F6] focus:outline-none"
          />
          <button
            onClick={() => runDeliberation(query)}
            disabled={deliberating || !query.trim()}
            className="px-6 py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-white font-black text-xs uppercase border-2 border-slate-100 shadow-[3px_3px_0px_0px_#FACC15] flex items-center justify-center gap-2 transition active:translate-x-0.5 active:translate-y-0.5"
          >
            <Send className={`w-4 h-4 ${deliberating ? "animate-spin" : ""}`} />
            {deliberating ? "Deliberating..." : "Start Deliberation"}
          </button>
        </div>
      </div>

      {/* Unified Consensus Card */}
      {deliberation && (
        <div className="bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[8px_8px_0px_0px_#22C55E] space-y-5 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-800 pb-3 gap-2">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-green-500 text-slate-950 font-black border border-slate-100">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[9px] text-green-400 font-bold uppercase tracking-widest">
                  Cross-Agent Unified Consensus
                </span>
                <h3 className="text-sm font-black text-slate-100 uppercase">{deliberation.consensus_action}</h3>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 bg-[#020617] text-yellow-400 border border-yellow-400 font-bold">
              6 / 6 AGENTS ALIGNED
            </span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed bg-[#020617] p-4 border border-slate-700">
            {deliberation.strategic_summary}
          </p>

          {/* Action Items */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-yellow-400 uppercase tracking-wider">
              Synthesized Next Action Items:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {deliberation.next_action_items.map((item: string, i: number) => (
                <div key={i} className="p-3 bg-[#0A0F1D] border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
                  <span className="text-green-400 font-bold">▶</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Individual Agent Deliberations Feed */}
      <div className="space-y-4 font-mono">
        <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" /> Individual Subagent Deliberations & Perspectives
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deliberation?.agent_opinions?.map((op: any) => (
            <div
              key={op.agent_id}
              className="bg-[#0F172A] p-5 border-2 border-slate-800 shadow-[4px_4px_0px_0px_#020617] space-y-3 relative hover:border-slate-600 transition"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-3 h-3 rounded-full border border-slate-100"
                    style={{ backgroundColor: op.avatar_color }}
                  />
                  <div>
                    <h4 className="text-xs font-black text-slate-100 uppercase">{op.agent_name}</h4>
                    <p className="text-[9px] text-slate-400">{op.role_title}</p>
                  </div>
                </div>
                <span
                  className={`text-[8px] font-black px-2 py-0.5 border uppercase ${
                    op.vote === "STRONGLY_SUPPORT"
                      ? "bg-green-500 text-slate-950 border-green-400"
                      : "bg-amber-500 text-slate-950 border-yellow-400"
                  }`}
                >
                  {op.vote.replace("_", " ")}
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed bg-[#020617] p-3 border border-slate-800">
                "{op.analysis}"
              </p>

              <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1">
                <span>Confidence Index</span>
                <span className="text-yellow-400 font-bold">{(op.confidence_score * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
