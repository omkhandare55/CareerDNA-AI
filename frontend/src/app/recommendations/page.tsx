"use client";

import { useState } from "react";
import { Sparkles, Bookmark, Trash2, ArrowRight, History, Zap, ShieldCheck, Terminal, Cpu, Database, CheckCircle2, Play } from "lucide-react";
import ExplainModal from "@/components/ExplainModal";
import { apiStream } from "@/lib/api";

export default function RecommendationsPage() {
  const [isExplainOpen, setIsExplainOpen] = useState(false);
  const [queryPrompt, setQueryPrompt] = useState("What is my optimal career move to become a Lead AI Engineer?");
  const [executionMode, setExecutionMode] = useState<"default" | "learning_plan" | "mock_interview">("default");
  
  // Streaming state
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamEvents, setStreamEvents] = useState<any[]>([]);
  const [streamingText, setStreamingText] = useState("");
  const [evolutionData, setEvolutionData] = useState<any>(null);
  const [skillGaps, setSkillGaps] = useState<string[]>([]);
  const [memoriesRetrieved, setMemoriesRetrieved] = useState<string[]>([]);
  const [marketData, setMarketData] = useState<any>(null);

  const handleStartAgentStream = () => {
    setIsStreaming(true);
    setStreamEvents([]);
    setStreamingText("");
    setEvolutionData(null);
    setSkillGaps([]);
    setMemoriesRetrieved([]);
    setMarketData(null);

    apiStream(
      "/api/v1/agent/recommend",
      {
        query: queryPrompt,
        target_role: "Senior AI Engineer",
        execution_mode: executionMode
      },
      (event: any) => {
        setStreamEvents((prev) => [...prev, event]);
        if (event.type === "MEMORY_RETRIEVED") {
          setMemoriesRetrieved(event.key_events || []);
        } else if (event.type === "SKILL_GAP_IDENTIFIED") {
          setSkillGaps(event.missing_skills || []);
        } else if (event.type === "MARKET_INTELLIGENCE") {
          setMarketData(event);
        } else if (event.type === "RECOMMENDATION_CHUNK") {
          setStreamingText((prev) => prev + (event.text || ""));
        } else if (event.type === "EVOLUTION_METADATA") {
          setEvolutionData(event);
        }
      },
      () => {
        setIsStreaming(false);
      }
    );
  };

  const defaultRecommendations = [
    {
      id: "rec_1",
      action: "Master CockroachDB HNSW Vector Indexing",
      reason: "Your last 4 job target listings & FAANG mock interview required vector storage tuning.",
      impact: "+8 Career Score",
      confidence: 0.96,
      memoriesUsed: ["FAANG Mock Interview (mem_001)", "AWS ML Specialty Cert (mem_002)", "Resume v3.2 (mem_003)"],
      border: "border-purple-500 shadow-[8px_8px_0px_0px_#A855F7]"
    },
    {
      id: "rec_2",
      action: "Build a Multi-Agent System with LangGraph & FastAPI",
      reason: "High market demand spike (+28.5%) for agentic workflows.",
      impact: "+6 Career Score",
      confidence: 0.92,
      memoriesUsed: ["GitHub Repos", "Target Role: AI Engineer"],
      border: "border-blue-500 shadow-[8px_8px_0px_0px_#3B82F6]"
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b-4 border-slate-800 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider font-mono flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-yellow-400" /> Decision Engine Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Persistent CockroachDB memory + AWS Bedrock (Claude 3.5 Sonnet) real-time reasoning engine.
          </p>
        </div>
        <span className="px-3 py-1.5 bg-[#A855F7] text-white border-2 border-slate-100 text-xs font-black font-mono shadow-[3px_3px_0px_0px_#FACC15]">
          ENGINE: CLAUDE 3.5 + TITAN 1024D
        </span>
      </div>

      {/* Interactive Agent Trigger Box */}
      <div className="bg-[#0F172A] p-6 border-4 border-yellow-400 shadow-[8px_8px_0px_0px_#FACC15] space-y-4">
        <div className="flex items-center justify-between font-mono">
          <span className="text-xs font-black uppercase text-yellow-400 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" /> PROMPT AGENTIC REASONING
          </span>
          <div className="flex gap-2">
            {(["default", "learning_plan", "mock_interview"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setExecutionMode(mode)}
                className={`text-[10px] font-black uppercase px-2.5 py-1 border-2 transition ${
                  executionMode === mode
                    ? "bg-[#3B82F6] text-white border-slate-100 shadow-[2px_2px_0px_0px_#020617]"
                    : "bg-[#020617] text-slate-400 border-slate-700 hover:text-white"
                }`}
              >
                {mode.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={queryPrompt}
            onChange={(e) => setQueryPrompt(e.target.value)}
            placeholder="Ask CareerDNA AI for strategic guidance..."
            className="flex-1 bg-[#020617] border-2 border-slate-700 p-3 text-xs text-slate-100 font-mono focus:border-yellow-400 focus:outline-none"
          />
          <button
            onClick={handleStartAgentStream}
            disabled={isStreaming}
            className="py-3 px-6 brutal-btn brutal-btn-yellow text-xs flex items-center justify-center gap-2 font-mono whitespace-nowrap disabled:opacity-50"
          >
            {isStreaming ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                STREAMING REASONING...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> RUN AGENT STREAM (SSE)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live SSE Streaming Terminal View (When Running or Results Available) */}
      {(isStreaming || streamingText || streamEvents.length > 0) && (
        <div className="bg-[#020617] p-6 border-4 border-blue-500 shadow-[8px_8px_0px_0px_#3B82F6] space-y-5">
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3 font-mono">
            <span className="text-xs font-black uppercase text-cyan-400 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400" /> LIVE AGENTIC SSE PIPELINE TRACE
            </span>
            <span className={`text-[10px] font-black px-2 py-0.5 border ${isStreaming ? "bg-amber-400 text-slate-950 animate-pulse" : "bg-green-500 text-slate-950"}`}>
              {isStreaming ? "EXECUTING GRAPH" : "GRAPH COMPLETE"}
            </span>
          </div>

          {/* Phase Telemetry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
            {/* Phase 1: CockroachDB Memory Retrieval */}
            <div className="p-3 bg-[#0F172A] border border-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-yellow-400 font-bold">
                <Database className="w-3.5 h-3.5" /> 1. COCKROACHDB MEMORY
              </div>
              <p className="text-[11px] text-slate-300">
                {memoriesRetrieved.length > 0 ? `${memoriesRetrieved.length} vector nodes retrieved` : "Querying HNSW vector index..."}
              </p>
            </div>

            {/* Phase 2: Skill Gaps */}
            <div className="p-3 bg-[#0F172A] border border-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-pink-400 font-bold">
                <Zap className="w-3.5 h-3.5" /> 2. SKILL GAP DETECTION
              </div>
              <p className="text-[11px] text-slate-300">
                {skillGaps.length > 0 ? `${skillGaps.slice(0, 2).join(", ")} (${skillGaps.length} gaps)` : "Cross-referencing profile..."}
              </p>
            </div>

            {/* Phase 3: Market Signal */}
            <div className="p-3 bg-[#0F172A] border border-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-green-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> 3. CONFIDENCE SCORE
              </div>
              <p className="text-[11px] text-slate-300">
                {evolutionData?.confidence_score ? `${(evolutionData.confidence_score * 100).toFixed(0)}% Provenanced` : "Synthesizing..."}
              </p>
            </div>
          </div>

          {/* Synthesized Recommendation Output */}
          <div className="space-y-2">
            <span className="text-xs font-black uppercase text-slate-400 font-mono">Synthesized Strategy (Claude 3.5 Sonnet):</span>
            <div className="p-5 bg-[#0F172A] border-2 border-slate-700 text-xs text-slate-100 font-mono whitespace-pre-wrap leading-relaxed">
              {streamingText || "Awaiting token stream..."}
              {isStreaming && <span className="inline-block w-2 h-4 bg-yellow-400 animate-pulse ml-1"></span>}
            </div>
          </div>

          {/* Evolution Explanation Drawer */}
          {evolutionData && (
            <div className="p-4 bg-[#0F172A] border-2 border-purple-500 shadow-[4px_4px_0px_0px_#A855F7] space-y-2 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-purple-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" /> WHY DID THIS RECOMMENDATION EVOLVE?
                </span>
                <span className="text-[10px] text-yellow-400 font-bold">CONFIDENCE: 94%</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{evolutionData.why_changed}</p>
            </div>
          )}
        </div>
      )}

      {/* Active Recommendations Feed */}
      <div className="space-y-6">
        <h2 className="text-xs font-black text-slate-100 uppercase tracking-widest font-mono">Standing Recommendations in CockroachDB Memory</h2>

        {defaultRecommendations.map((rec) => (
          <div key={rec.id} className={`bg-[#0F172A] p-6 border-4 ${rec.border} space-y-4`}>
            <div className="flex flex-wrap items-center justify-between gap-3 font-mono">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-[#A855F7] text-white text-xs font-black border border-slate-100 uppercase">
                  CONFIDENCE: {(rec.confidence * 100).toFixed(0)}%
                </span>
                <span className="px-2.5 py-1 bg-[#22C55E] text-slate-950 text-xs font-black border border-slate-950 uppercase">
                  {rec.impact}
                </span>
              </div>

              <button
                onClick={() => setIsExplainOpen(true)}
                className="text-xs text-yellow-400 hover:text-white font-black uppercase underline underline-offset-4"
              >
                WHY DID THIS RECOMMENDATION CHANGE?
              </button>
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-50 uppercase font-mono tracking-tight">{rec.action}</h3>
              <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed">{rec.reason}</p>
            </div>

            {/* Memories Used Provenance */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t-2 border-slate-800 font-mono">
              <span className="text-[11px] text-slate-400 font-bold uppercase">Memory Sources Used:</span>
              {rec.memoriesUsed.map((mem, i) => (
                <span key={i} className="text-[10px] font-black px-2 py-0.5 bg-[#020617] text-slate-200 border border-slate-700 uppercase">
                  {mem}
                </span>
              ))}
            </div>

            {/* Card Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2 font-mono">
              <button className="py-2.5 px-5 brutal-btn brutal-btn-yellow text-xs flex items-center gap-2">
                ACCEPT ACTION <ArrowRight className="w-4 h-4" />
              </button>
              <button className="py-2.5 px-4 bg-[#020617] border-2 border-slate-700 hover:border-slate-400 text-slate-200 text-xs font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#020617]">
                <Bookmark className="w-4 h-4 text-cyan-400" /> SAVE
              </button>
              <button className="py-2.5 px-4 bg-[#020617] border-2 border-slate-700 hover:border-red-400 text-slate-400 hover:text-red-400 text-xs font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#020617]">
                <Trash2 className="w-4 h-4" /> DISMISS
              </button>
            </div>
          </div>
        ))}
      </div>

      <ExplainModal
        isOpen={isExplainOpen}
        onClose={() => setIsExplainOpen(false)}
        title="CockroachDB HNSW Vector Indexing Recommendation"
        whyChanged="Advice evolved because user passed AWS ML Specialty cert and logged vector tuning weakness during mock interview."
        confidenceScore={0.96}
        expectedImpact="+8 Career Score"
        memoriesUsed={[
          { title: "FAANG Mock Interview Failure", date: "YESTERDAY", type: "INTERVIEW" },
          { title: "AWS ML Specialty Certification", date: "JULY 2026", type: "CERT" }
        ]}
      />
    </div>
  );
}
