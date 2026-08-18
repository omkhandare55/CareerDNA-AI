"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Zap,
  Layers,
  History,
  ShieldCheck,
  Send
} from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";

const PRESET_SKILLS = [
  "CockroachDB Vector Search",
  "LangGraph State Machines",
  "AWS Bedrock / Claude 3.5",
  "Raft Distributed Consensus",
  "FastAPI AsyncIO",
  "Next.js 14 Turbopack",
  "HNSW Cosine Similarity",
  "PostgreSQL / SQL DDL"
];

export default function ReflectionPage() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [currentWeek, setCurrentWeek] = useState(33);
  const [highlights, setHighlights] = useState("");
  const [challenges, setChallenges] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["CockroachDB Vector Search", "FastAPI AsyncIO"]);
  const [hoursInvested, setHoursInvested] = useState(18);
  const [submitting, setSubmitting] = useState(false);
  const [reflectionResult, setReflectionResult] = useState<any>(null);

  useEffect(() => {
    apiGet("/api/v1/reflection/prompts")
      .then((data) => {
        if (data?.prompts) setPrompts(data.prompts);
        if (data?.current_week) setCurrentWeek(data.current_week);
      })
      .catch(() => {});
  }, []);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmitReflection = async () => {
    if (!highlights.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await apiPost("/api/v1/reflection/submit", {
        highlights,
        challenges_faced: challenges,
        skills_practiced: selectedSkills,
        hours_invested: hoursInvested,
        mood_rating: 5,
      });
      setReflectionResult(res);
    } catch (err) {
      console.error("Reflection submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-slate-800 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider font-mono flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-cyan-400" /> Weekly Career Reflection Agent
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Log weekly technical breakthroughs. AI resets Ebbinghaus memory retention decay timers for demonstrated competencies.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-3 py-1 bg-cyan-600 text-white border-2 border-slate-100 font-mono font-black uppercase shadow-[3px_3px_0px_0px_#FACC15]">
            WEEK {currentWeek} CHECK-IN
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Reflection Form */}
        <div className="lg:col-span-7 bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#06B6D4] space-y-6 font-mono">
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
            <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" /> Weekly Check-In Journal
            </h3>
            <span className="text-[9px] text-yellow-400 font-bold uppercase">AUTONOMOUS MEMORY SYNC</span>
          </div>

          {/* Highlights Prompt */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-300 uppercase">
              1. Technical Accomplishments & Code Shipped
            </label>
            <textarea
              rows={4}
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              placeholder="e.g., Completed live CockroachDB Cloud connection pool with 20 connections, passed all 39 audit checks, tuned HNSW vector cosine search..."
              className="w-full bg-[#020617] border-2 border-slate-700 text-slate-100 p-3 text-xs font-mono focus:border-cyan-400 focus:outline-none placeholder:text-slate-600 leading-relaxed"
            />
          </div>

          {/* Challenges Prompt */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-300 uppercase">
              2. Technical Obstacles or Blind Spots Encountered
            </label>
            <textarea
              rows={3}
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              placeholder="e.g., Encountered latency on multi-region Raft replication, resolved with leaseholder rebalancing..."
              className="w-full bg-[#020617] border-2 border-slate-700 text-slate-100 p-3 text-xs font-mono focus:border-cyan-400 focus:outline-none placeholder:text-slate-600 leading-relaxed"
            />
          </div>

          {/* Skills Tag Selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-300 uppercase">
              3. Select Core Competencies Practiced (Decay Timer Reset)
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1 text-[11px] font-black uppercase border-2 transition ${
                      isSelected
                        ? "bg-cyan-500 text-slate-950 border-slate-100 shadow-[2px_2px_0px_0px_#FACC15]"
                        : "bg-[#020617] text-slate-400 border-slate-700 hover:border-slate-500"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "} {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hours Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-black uppercase">
              <span className="text-slate-300">Engineering Focus Hours Invested</span>
              <span className="text-yellow-400 font-bold">{hoursInvested} Hours / Week</span>
            </div>
            <input
              type="range"
              min="2"
              max="60"
              value={hoursInvested}
              onChange={(e) => setHoursInvested(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <button
            onClick={handleSubmitReflection}
            disabled={submitting || highlights.length < 5}
            className={`w-full py-3.5 font-black text-xs uppercase tracking-wider border-2 border-slate-100 flex items-center justify-center gap-2 transition shadow-[4px_4px_0px_0px_#FACC15] ${
              submitting || highlights.length < 5
                ? "bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700 shadow-none"
                : "bg-cyan-500 hover:bg-cyan-600 text-slate-950 active:translate-x-0.5 active:translate-y-0.5"
            }`}
          >
            <Send className={`w-4 h-4 ${submitting ? "animate-pulse" : ""}`} />
            {submitting ? "Processing Reflection & Resetting Decay..." : "Submit Reflection & Refresh Memory"}
          </button>
        </div>

        {/* AI Memory Feedback & Retention Metrics */}
        <div className="lg:col-span-5 bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#FACC15] space-y-6 font-mono">
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
            <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" /> Retention Evolution Telemetry
            </h3>
            <span className="text-[9px] px-2 py-0.5 bg-green-500 text-slate-950 font-black uppercase">
              EBBINGHAUS ENGINE
            </span>
          </div>

          {reflectionResult ? (
            <div className="space-y-5">
              {/* Ebbinghaus Boost Card */}
              <div className="p-4 bg-[#020617] border-2 border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 font-black uppercase">Retention Boost</span>
                  <p className="text-3xl font-black text-green-400 font-mono">
                    +{reflectionResult.ebbinghaus_retention_boost_pct}%
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-yellow-400 font-black uppercase">Velocity Gain</span>
                  <p className="text-xl font-black text-yellow-400 font-mono">
                    +{reflectionResult.dna_velocity_delta} pts
                  </p>
                </div>
              </div>

              {/* Skills Refreshed */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-cyan-400 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Skills Decay Timers Reset (t=0)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {reflectionResult.skills_reinforced.map((s: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 text-xs bg-[#020617] text-slate-200 border border-cyan-500 font-bold">
                      ⚡ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Feedback */}
              <div className="p-4 bg-[#020617] border-l-4 border-yellow-400 space-y-1.5 text-xs text-slate-200 leading-relaxed">
                <span className="text-[9px] font-black text-yellow-400 uppercase">AI Coach Synthesis</span>
                <p>{reflectionResult.ai_feedback}</p>
              </div>

              {/* Memory Node ID */}
              <div className="p-3 bg-[#0A0F1D] border border-slate-800 text-[10px] text-slate-400 font-mono space-y-1">
                <p>Timeline Event: {reflectionResult.timeline_event_id}</p>
                <p>Memory Node: {reflectionResult.memory_node_id}</p>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 bg-[#020617] border-2 border-slate-700 mx-auto flex items-center justify-center text-slate-500 shadow-[3px_3px_0px_0px_#06B6D4]">
                <Clock className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-xs font-black text-slate-300 uppercase">Awaiting Weekly Log</p>
              <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                Fill in your weekly breakthroughs and submit to refresh your Ebbinghaus memory retention curves and elevate Career DNA velocity.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
