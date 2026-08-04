"use client";

import { useState } from "react";
import {
  Sparkles,
  TrendingUp,
  Award,
  Briefcase,
  Target,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Zap,
  Info,
  ChevronRight
} from "lucide-react";
import ExplainModal from "@/components/ExplainModal";

export default function Dashboard() {
  const [isExplainOpen, setIsExplainOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamProgress, setStreamProgress] = useState(100);

  const handleSimulateStreaming = () => {
    setIsStreaming(true);
    setStreamProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setStreamProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsStreaming(false);
      }
    }, 400);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. HERO SECTION */}
      <div className="relative overflow-hidden rounded-2xl glass-panel-glow p-8 border border-blue-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-transparent blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Career DNA Evolved Today</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-50">
              Hello Vijay 👋
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Your lifelong AI Career Agent synthesized 4 new interview signals and updated your career trajectory.
            </p>
          </div>

          {/* Hero Score Badge */}
          <div className="flex items-center gap-6 p-4 rounded-xl bg-[#0F172A]/80 border border-[#1E293B] backdrop-blur-md">
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Career Readiness</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-4xl font-bold font-mono text-slate-50 tracking-tight">87</span>
                <span className="text-sm font-semibold text-green-400 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +3 this week
                </span>
              </div>
            </div>

            <div className="h-10 w-[1px] bg-[#1E293B]"></div>

            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">AI Confidence</p>
              <div className="flex items-center gap-1.5 mt-1">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <span className="text-xl font-bold text-purple-300 font-mono">94%</span>
              </div>
              <p className="text-[10px] text-slate-500">6 Proof Sources Synced</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. QUICK STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Skills Verified", value: "42", change: "+4 new", icon: Award, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Active Applications", value: "31", change: "8 interviewing", icon: Briefcase, color: "text-purple-400", bg: "bg-purple-500/10" },
          { label: "Interview Rate", value: "25.8%", change: "+3.2% vs avg", icon: Target, color: "text-green-400", bg: "bg-green-500/10" },
          { label: "Critical Weakness", value: "System Design", change: "Action required", icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-panel p-5 rounded-xl space-y-3 hover:border-slate-700 transition duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-slate-100">{stat.value}</span>
                <span className="text-xs font-medium text-slate-400">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. TODAY'S ACTIONABLE DECISION ENGINE CARD */}
      <div className="glass-panel-glow p-6 rounded-2xl border border-blue-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Best Next Decision
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">• Generated via LangGraph Agent</span>
          </div>

          <button
            onClick={() => setIsExplainOpen(true)}
            className="text-xs font-medium text-purple-300 hover:text-purple-200 flex items-center gap-1 bg-purple-500/10 px-3 py-1 rounded-lg border border-purple-500/20 transition"
          >
            <Info className="w-3.5 h-3.5" /> Explain Evidence
          </button>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-[#0F172A]/90 p-5 rounded-xl border border-[#1E293B]">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-50 flex items-center gap-2">
              Master CockroachDB Distributed HNSW Vector Search
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Your recent mock interview feedback indicated a gap in vector database tuning. Completing this targeted module will directly address recorded weaknesses and align your profile with senior AI Engineer role requirements.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" /> Est. Time: 3.5 Hours
              </span>
              <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Expected Impact: +8 Career Score
              </span>
              <span className="text-xs text-purple-300 font-medium px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                Confidence: 96%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handleSimulateStreaming}
              disabled={isStreaming}
              className="flex-1 lg:flex-initial px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isStreaming ? (
                <>
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Updating Memory...
                </>
              ) : (
                <>
                  Accept & Start Learning <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live SSE Reasoning Stream Simulator */}
        {isStreaming && (
          <div className="space-y-2 pt-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs text-purple-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-spin" /> Stream Execution: Evolving Career DNA...
              </span>
              <span>{streamProgress}%</span>
            </div>
            <div className="w-full bg-[#1E293B] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                style={{ width: `${streamProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* 4. STORY-DRIVEN ACTIVITY TIMELINE & CAREER TRAJECTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Story Activity (2 Cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-[#1E293B] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" /> Recent Career Milestones & Memory Shifts
            </h3>
            <span className="text-xs text-slate-400">Memory Provenance Engine</span>
          </div>

          <div className="space-y-3">
            {[
              {
                time: "Yesterday",
                title: "Mock Interview Analysis Logged",
                desc: "AI detected weakness in System Design & Vector Indexing during FAANG mock interview.",
                impact: "Recommendation Evolved",
                tagColor: "text-amber-400 bg-amber-500/10 border-amber-500/20"
              },
              {
                time: "3 Days Ago",
                title: "Completed AWS Machine Learning Specialty Cert",
                desc: "Added verified credential to persistent memory. Technical depth score increased from 82 to 86.",
                impact: "+4 DNA Points",
                tagColor: "text-green-400 bg-green-500/10 border-green-500/20"
              },
              {
                time: "5 Days Ago",
                title: "Resume v3.2 Uploaded & Parsed",
                desc: "Extracted FastAPI, LangGraph, and CockroachDB skills. Updated market alignment.",
                impact: "Profile Refined",
                tagColor: "text-blue-400 bg-blue-500/10 border-blue-500/20"
              }
            ].map((event, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#0F172A]/70 border border-[#1E293B] flex items-start justify-between gap-4 hover:border-slate-700 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-medium">{event.time}</span>
                    <span className="text-slate-600">•</span>
                    <h4 className="text-xs font-bold text-slate-200">{event.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400">{event.desc}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${event.tagColor}`}>
                  {event.impact}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Trajectory Growth Graph (1 Col) */}
        <div className="glass-panel p-6 rounded-2xl border border-[#1E293B] space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" /> Career Trajectory
            </h3>
            <p className="text-xs text-slate-400 mt-1">Growth Velocity: 1.25x vs Baseline</p>
          </div>

          {/* Visual Graph Representation */}
          <div className="space-y-3 my-4">
            <div className="flex items-end justify-between gap-2 h-36 pt-4 px-2">
              {[
                { month: "Jan", score: 65, height: "h-[45%]" },
                { month: "Feb", score: 72, height: "h-[58%]" },
                { month: "Mar", score: 78, height: "h-[70%]" },
                { month: "Apr", score: 84, height: "h-[82%]" },
                { month: "May", score: 87, height: "h-[92%]", active: true },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className={`text-[10px] font-mono ${bar.active ? "text-blue-400 font-bold" : "text-slate-500"}`}>
                    {bar.score}
                  </span>
                  <div className="w-full bg-[#1E293B] rounded-t-lg relative flex items-end h-full overflow-hidden">
                    <div
                      className={`w-full ${bar.height} transition-all duration-500 ${
                        bar.active
                          ? "bg-gradient-to-t from-blue-600 to-purple-500 shadow-lg shadow-blue-500/30"
                          : "bg-slate-700/60 group-hover:bg-slate-600"
                      }`}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{bar.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-between text-xs">
            <span className="text-slate-400">Target Role Horizon</span>
            <span className="text-blue-400 font-semibold flex items-center gap-1">
              FAANG AI Engineer <ChevronRight className="w-3.5 h-3.5" />
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
