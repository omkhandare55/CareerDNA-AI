"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  TrendingUp,
  Award,
  Briefcase,
  Target,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
  Clock,
  ChevronRight
} from "lucide-react";
import ExplainModal from "@/components/ExplainModal";
import { apiGet } from "@/lib/api";

export default function Dashboard() {
  const [isExplainOpen, setIsExplainOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamProgress, setStreamProgress] = useState(100);

  const [loading, setLoading] = useState(true);
  const [dna, setDna] = useState<any>(null);
  const [skills, setSkills] = useState<any>(null);
  const [timeline, setTimeline] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      apiGet('/api/v1/dna').catch(() => null),
      apiGet('/api/v1/skills').catch(() => null),
      apiGet('/api/v1/timeline').catch(() => null),
    ]).then(([dnaData, skillsData, timelineData]) => {
      setDna(dnaData);
      setSkills(skillsData);
      setTimeline(timelineData);
      setLoading(false);
    });
  }, []);

  const handleSimulateStreaming = () => {
    setIsStreaming(true);
    setStreamProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setStreamProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsStreaming(false);
      }
    }, 300);
  };

  const score = dna?.dna_score ?? 87;
  const name = "Vijay"; // Or from auth/me if we want, but keeping hardcoded fallback if needed
  const verifiedSkillsCount = skills?.total ?? 42;
  const activeApps = 31; // Mock fallback
  const interviewRate = "25.8%"; // Mock fallback

  const recentEvents = timeline?.events?.slice(0, 3) ?? [
    {
      time: "YESTERDAY",
      title: "FAANG Mock Interview Analysis Logged",
      desc: "AI detected weakness in System Design & Vector Indexing during mock interview.",
      impact: "RECOMMENDATION SHIFT",
      badge: "bg-amber-500 text-slate-950 border-slate-950"
    },
    {
      time: "3 DAYS AGO",
      title: "Completed AWS Machine Learning Specialty Cert",
      desc: "Verified credential added to persistent memory. Technical depth score increased from 82 to 86.",
      impact: "+4 DNA POINTS",
      badge: "bg-green-500 text-slate-950 border-slate-950"
    },
    {
      time: "5 DAYS AGO",
      title: "Resume v3.2 Uploaded & Parsed",
      desc: "Extracted FastAPI, LangGraph, and CockroachDB skills into database profile.",
      impact: "PROFILE REFINED",
      badge: "bg-blue-500 text-white border-slate-100"
    }
  ];

  if (loading) {
    return <div className="text-white p-8 animate-pulse font-mono">Loading Neural Links...</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      {/* 1. HERO SECTION - NEO-BRUTALIST */}
      <div className="relative bg-[#0F172A] p-8 border-4 border-slate-100 shadow-[8px_8px_0px_0px_#3B82F6]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#A855F7] text-white border-2 border-slate-100 text-xs font-black uppercase tracking-wider font-mono shadow-[2px_2px_0px_0px_#FACC15]">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Career DNA Evolved Today</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-50 uppercase font-mono">
              Hello {name} 👋
            </h1>
            <p className="text-xs text-slate-300 font-medium max-w-2xl leading-relaxed">
              Your lifelong AI Career Agent synthesized 4 new interview signals and updated your trajectory graph in CockroachDB.
            </p>
          </div>

          {/* Hero Score Brutalist Box */}
          <div className="flex items-center gap-6 p-5 bg-[#020617] border-4 border-yellow-400 shadow-[6px_6px_0px_0px_#FACC15]">
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest font-mono">Career Readiness</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-5xl font-black font-mono text-slate-50">{score}</span>
                <span className="text-xs font-black text-green-400 flex items-center gap-0.5 font-mono">
                  <TrendingUp className="w-4 h-4" /> +3 W/W
                </span>
              </div>
            </div>

            <div className="h-12 w-1 bg-slate-700"></div>

            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest font-mono">AI Confidence</p>
              <div className="flex items-center gap-1.5 mt-1">
                <ShieldCheck className="w-6 h-6 text-purple-400" />
                <span className="text-2xl font-black text-purple-300 font-mono">94%</span>
              </div>
              <p className="text-[9px] text-yellow-400 font-bold font-mono uppercase">6 Proof Sources</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. QUICK STATS GRID - NEO-BRUTALIST CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Verified Skills", value: verifiedSkillsCount.toString(), change: "+4 new", icon: Award, border: "border-blue-500 shadow-[4px_4px_0px_0px_#3B82F6]", badge: "bg-blue-500" },
          { label: "Active Applications", value: activeApps.toString(), change: "8 interviewing", icon: Briefcase, border: "border-purple-500 shadow-[4px_4px_0px_0px_#A855F7]", badge: "bg-purple-500" },
          { label: "Interview Rate", value: interviewRate, change: "+3.2% vs avg", icon: Target, border: "border-green-500 shadow-[4px_4px_0px_0px_#22C55E]", badge: "bg-green-500" },
          { label: "Critical Gap", value: dna?.weaknesses?.[0]?.name || "System Design", change: "Action required", icon: Zap, border: "border-yellow-400 shadow-[4px_4px_0px_0px_#FACC15]", badge: "bg-yellow-400 text-slate-950" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`bg-[#0F172A] p-5 border-2 ${stat.border} space-y-3`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">{stat.label}</span>
                <div className={`p-2 border border-slate-100 ${stat.badge} text-slate-950 font-black`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black font-mono text-slate-50">{stat.value}</span>
                <span className="text-[11px] font-bold text-slate-300 font-mono uppercase">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. TODAY'S ACTIONABLE DECISION CARD */}
      <div className="bg-[#0F172A] p-6 border-4 border-blue-500 shadow-[8px_8px_0px_0px_#3B82F6] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-[#FACC15] text-slate-950 text-xs font-black uppercase tracking-wider border-2 border-slate-950 font-mono shadow-[2px_2px_0px_0px_#020617]">
              ⚡ BEST NEXT DECISION
            </span>
            <span className="text-xs text-slate-300 font-mono font-bold hidden sm:inline">• LangGraph Agent Synthesized</span>
          </div>

          <button
            onClick={() => setIsExplainOpen(true)}
            className="text-xs font-black text-slate-950 bg-[#A855F7] hover:bg-purple-400 px-3 py-1.5 border-2 border-slate-100 uppercase tracking-wider font-mono flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#FACC15] transition"
          >
            <Info className="w-4 h-4 text-white" /> EXPLAIN EVIDENCE
          </button>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-[#020617] p-5 border-2 border-slate-700">
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-50 uppercase tracking-tight font-mono">
              Master CockroachDB Distributed HNSW Vector Search
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed font-medium">
              Your recent FAANG mock interview indicated a gap in vector database tuning. Completing this module will directly resolve recorded weaknesses and align your profile with senior AI Engineer role benchmarks.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 font-mono">
              <span className="text-xs text-cyan-400 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> EST: 3.5 HOURS
              </span>
              <span className="text-xs text-green-400 font-black flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> IMPACT: +8 CAREER SCORE
              </span>
              <span className="text-xs text-purple-300 font-black px-2 py-0.5 bg-[#A855F7]/20 border border-purple-500 uppercase">
                CONFIDENCE: 96%
              </span>
            </div>
          </div>

          <div className="w-full lg:w-auto">
            <button
              onClick={handleSimulateStreaming}
              disabled={isStreaming}
              className="w-full lg:w-auto py-3 px-6 brutal-btn brutal-btn-yellow text-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isStreaming ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  EVOLVED MEMORY...
                </>
              ) : (
                <>
                  ACCEPT & START LEARNING <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live SSE Progress */}
        {isStreaming && (
          <div className="space-y-2 pt-2 animate-in fade-in font-mono">
            <div className="flex items-center justify-between text-xs text-yellow-400 font-black uppercase">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 animate-spin text-purple-400" /> SSE Stream Execution: Evolving Career DNA...
              </span>
              <span>{streamProgress}%</span>
            </div>
            <div className="w-full bg-[#020617] h-3 border-2 border-slate-600">
              <div
                className="bg-[#FACC15] h-full transition-all duration-300"
                style={{ width: `${streamProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* 4. STORY TIMELINE & CAREER TRAJECTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Story Activity Feed (2 Cols) */}
        <div className="lg:col-span-2 bg-[#0F172A] p-6 border-4 border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
            <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" /> Recent Career Milestones & Memory Shifts
            </h3>
            <span className="text-[10px] text-yellow-400 font-bold uppercase font-mono">Provenanced History</span>
          </div>

          <div className="space-y-3">
            {recentEvents.map((event: any, i: number) => (
              <div key={i} className="p-4 bg-[#020617] border-2 border-slate-700 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[10px] text-slate-400 font-bold">{event.time || event.date || "RECENTLY"}</span>
                    <span className="text-slate-600">•</span>
                    <h4 className="text-xs font-black text-slate-100 uppercase">{event.title}</h4>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">{event.desc}</p>
                </div>
                <span className={`text-[9px] font-black px-2.5 py-1 border uppercase whitespace-nowrap font-mono ${event.badge || "bg-blue-500 text-white border-slate-100"}`}>
                  {event.impact || "VERIFIED"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Trajectory Graph (1 Col) */}
        <div className="bg-[#0F172A] p-6 border-4 border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" /> Trajectory Growth
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-1">Velocity: 1.25x vs Baseline</p>
          </div>

          <div className="space-y-3 my-4">
            <div className="flex items-end justify-between gap-2 h-36 pt-4 px-2">
              {[
                { month: "JAN", score: 65, height: "h-[45%]" },
                { month: "FEB", score: 72, height: "h-[58%]" },
                { month: "MAR", score: 78, height: "h-[70%]" },
                { month: "APR", score: 84, height: "h-[82%]" },
                { month: "MAY", score: score, height: "h-[92%]", active: true },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <span className={`text-[10px] font-mono font-black ${bar.active ? "text-yellow-400" : "text-slate-400"}`}>
                    {bar.score}
                  </span>
                  <div className="w-full bg-[#020617] border border-slate-700 relative flex items-end h-full">
                    <div
                      className={`w-full ${bar.height} transition-all duration-300 ${
                        bar.active ? "bg-[#FACC15] border-t-2 border-slate-950" : "bg-slate-700"
                      }`}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold font-mono">{bar.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-[#020617] border-2 border-slate-700 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Target Horizon</span>
            <span className="text-yellow-400 font-black flex items-center gap-1">
              FAANG AI Engineer <ChevronRight className="w-4 h-4 text-yellow-400" />
            </span>
          </div>
        </div>
      </div>

      {/* EXPLAINABILITY MODAL */}
      <ExplainModal
        isOpen={isExplainOpen}
        onClose={() => setIsExplainOpen(false)}
        title="Master CockroachDB Vector Search Recommendation"
        whyChanged="Recommendation changed from general DSA to CockroachDB HNSW Vector Search because user completed AWS ML Certification and logged a FAANG mock interview failure in vector indexing."
        confidenceScore={0.96}
        expectedImpact="+8 Career Score"
        memoriesUsed={[
          { title: "FAANG Mock Interview: Weakness in Vector DBs", date: "Yesterday", type: "INTERVIEW_FAIL" },
          { title: "AWS ML Specialty Certification Completed", date: "3 days ago", type: "CERTIFICATE" },
          { title: "Target Role set to Senior AI Engineer", date: "2 weeks ago", type: "CAREER_GOAL" }
        ]}
      />
    </div>
  );
}
