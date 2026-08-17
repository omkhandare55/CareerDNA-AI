"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Dna,
  Network,
  History,
  CheckCircle2,
  TrendingUp,
  Zap,
  Terminal,
  Layers,
  Cpu,
  Database,
  Lock,
  ChevronRight,
  ExternalLink
} from "lucide-react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"memory" | "agent" | "db">("memory");

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-[#FACC15] selection:text-slate-950 pb-20">
      {/* ─────────────────────────────────────────────────────────────────────────────
          1. TOP NAVIGATION BAR
         ───────────────────────────────────────────────────────────────────────────── */}
      <nav className="border-b-4 border-slate-800 bg-[#0A0F1D] sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FACC15] text-[#020617] border-2 border-slate-100 flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_0px_#3B82F6]">
              🧬
            </div>
            <div>
              <span className="font-black text-xl text-slate-100 uppercase tracking-wider font-mono flex items-center gap-1.5">
                CareerDNA <span className="text-xs px-2 py-0.5 bg-[#EC4899] text-white border border-slate-100 font-bold">AI</span>
              </span>
              <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest font-mono">Lifelong AI Career Engine</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 font-mono text-xs font-black uppercase tracking-wider">
            <a href="#features" className="hover:text-yellow-400 transition">Features</a>
            <a href="#architecture" className="hover:text-cyan-400 transition">Architecture</a>
            <a href="#demo" className="hover:text-purple-400 transition">Live Demo</a>
            <a href="#stack" className="hover:text-green-400 transition">Tech Stack</a>
          </div>

          <div className="flex items-center gap-3 font-mono">
            <Link
              href="/dashboard"
              className="py-2.5 px-5 brutal-btn brutal-btn-yellow text-xs flex items-center gap-2"
            >
              LAUNCH COMMAND CENTER <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. HERO SECTION - NEO-BRUTALIST IMPACT
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="relative px-6 pt-16 pb-20 max-w-7xl mx-auto overflow-hidden">
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#A855F7] text-white border-2 border-slate-100 text-xs font-black uppercase tracking-wider font-mono shadow-[4px_4px_0px_0px_#FACC15]">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
            <span>WORLD'S FIRST LIFELONG AI CAREER ENGINE</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-50 uppercase font-mono leading-[1.05]">
            YOUR CAREER HAS A <span className="text-[#FACC15] bg-[#0F172A] px-3 py-1 border-4 border-slate-100 inline-block shadow-[6px_6px_0px_0px_#3B82F6]">DNA.</span>
            <br />
            LET AI EVOLVE IT <span className="text-[#06B6D4] underline underline-offset-8">CONTINUOUSLY.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-medium max-w-3xl leading-relaxed font-sans">
            CareerDNA AI synthesizes your resume, GitHub commits, mock interview logs, and certifications into a persistent CockroachDB vector state machine powered by a 10-node LangGraph agent network and AWS Bedrock.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 font-mono">
            <Link
              href="/dashboard"
              className="py-4 px-8 brutal-btn brutal-btn-yellow text-sm flex items-center gap-3 text-slate-950 font-black"
            >
              LAUNCH COMMAND CENTER <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#architecture"
              className="py-4 px-6 bg-[#0F172A] border-4 border-slate-700 hover:border-cyan-400 text-slate-100 text-sm font-black uppercase flex items-center gap-2 shadow-[4px_4px_0px_0px_#020617] transition"
            >
              <Terminal className="w-5 h-5 text-cyan-400" /> VIEW ARCHITECTURE SPEC
            </a>
          </div>
        </div>

        {/* Hero Interactive Proof Box */}
        <div className="mt-12 p-8 bg-[#0F172A] border-4 border-slate-100 shadow-[10px_10px_0px_0px_#3B82F6] grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
          <div className="p-4 bg-[#020617] border-2 border-yellow-400 shadow-[3px_3px_0px_0px_#FACC15]">
            <p className="text-[10px] text-slate-400 font-black uppercase">Persistent Career Score</p>
            <p className="text-4xl font-black font-mono text-slate-50 mt-1">
              87 <span className="text-xs text-green-400 font-bold">↑ +3 W/W</span>
            </p>
            <p className="text-[9px] text-yellow-400 font-bold mt-1 uppercase">Ebbinghaus Retention Applied</p>
          </div>

          <div className="p-4 bg-[#020617] border-2 border-purple-500 shadow-[3px_3px_0px_0px_#A855F7]">
            <p className="text-[10px] text-slate-400 font-black uppercase">CockroachDB Vector Search</p>
            <p className="text-4xl font-black font-mono text-purple-400 mt-1">
              &lt; 48ms
            </p>
            <p className="text-[9px] text-purple-300 font-bold mt-1 uppercase">HNSW 1024d Embedding Query</p>
          </div>

          <div className="p-4 bg-[#020617] border-2 border-green-500 shadow-[3px_3px_0px_0px_#22C55E]">
            <p className="text-[10px] text-slate-400 font-black uppercase">LangGraph Agent Nodes</p>
            <p className="text-4xl font-black font-mono text-green-400 mt-1">
              10 NODES
            </p>
            <p className="text-[9px] text-green-300 font-bold mt-1 uppercase">Self-Healing Intent Router</p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          3. FEATURE MATRIX GRID
         ───────────────────────────────────────────────────────────────────────────── */}
      <section id="features" className="px-6 py-16 bg-[#090D16] border-t-4 border-b-4 border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 font-mono">
            <span className="px-3 py-1 bg-[#3B82F6] text-white text-xs font-black uppercase border border-slate-100 shadow-[2px_2px_0px_0px_#FACC15]">
              CORE SYSTEM CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-50 uppercase tracking-tight">
              ENGINEERED FOR LIFELONG CAREER SOVEREIGNTY
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
            {[
              {
                title: "Lifelong Ebbinghaus Memory Engine",
                desc: "Never lose record of a project, cert, or interview question. Uses exponential decay formulas to calculate skill retention over time.",
                icon: History,
                border: "border-purple-500 shadow-[6px_6px_0px_0px_#A855F7]"
              },
              {
                title: "CockroachDB HNSW Vector Search",
                desc: "High-performance distributed SQL table indexed with 1024-dimensional embeddings for sub-50ms career context similarity lookup.",
                icon: Database,
                border: "border-blue-500 shadow-[6px_6px_0px_0px_#3B82F6]"
              },
              {
                title: "7-Stream Career Intelligence",
                desc: "Real-time scraper monitoring job listings, salary benchmarks, company hiring news, hackathons, and tech demand spikes.",
                icon: Zap,
                border: "border-yellow-400 shadow-[6px_6px_0px_0px_#FACC15]"
              },
              {
                title: "10-Node LangGraph Agent Engine",
                desc: "Modular state machine executing resume parsing, skill gap analysis, interview coaching, and automatic memory evolution.",
                icon: Cpu,
                border: "border-green-500 shadow-[6px_6px_0px_0px_#22C55E]"
              },
              {
                title: "Explainable AI Decision Audit",
                desc: "Zero black box advice. Every recommendation cites exact historical memory evidence and provides model confidence ratings.",
                icon: ShieldCheck,
                border: "border-pink-500 shadow-[6px_6px_0px_0px_#EC4899]"
              },
              {
                title: "AWS Bedrock Cloud Security",
                desc: "Enterprise infrastructure secured with KMS encryption, S3 pre-signed upload URLs, and Cognito OAuth2 tokens.",
                icon: Lock,
                border: "border-cyan-400 shadow-[6px_6px_0px_0px_#06B6D4]"
              }
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className={`bg-[#0F172A] p-6 border-4 ${feat.border} space-y-3`}>
                  <div className="w-12 h-12 bg-[#020617] border-2 border-slate-100 flex items-center justify-center text-yellow-400 font-black shadow-[3px_3px_0px_0px_#020617]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-50 uppercase font-mono">{feat.title}</h3>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          4. ARCHITECTURE DEEP DIVE & TABBED DEMO
         ───────────────────────────────────────────────────────────────────────────── */}
      <section id="architecture" className="px-6 py-16 max-w-7xl mx-auto space-y-8 font-mono">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-4 border-slate-800 pb-5">
          <div>
            <span className="px-3 py-1 bg-[#22C55E] text-slate-950 text-xs font-black uppercase border border-slate-950">
              SYSTEM ARCHITECTURE SPECIFICATION
            </span>
            <h2 className="text-3xl font-black text-slate-50 uppercase mt-2">
              HOW CAREERDNA AI PROCESSES CAREER EVENTS
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("memory")}
              className={`px-4 py-2 border-2 text-xs font-black uppercase ${
                activeTab === "memory"
                  ? "bg-[#FACC15] text-slate-950 border-slate-950 shadow-[3px_3px_0px_0px_#020617]"
                  : "bg-[#0F172A] text-slate-300 border-slate-700"
              }`}
            >
              MEMORY EVOLUTION
            </button>
            <button
              onClick={() => setActiveTab("agent")}
              className={`px-4 py-2 border-2 text-xs font-black uppercase ${
                activeTab === "agent"
                  ? "bg-[#A855F7] text-white border-slate-100 shadow-[3px_3px_0px_0px_#FACC15]"
                  : "bg-[#0F172A] text-slate-300 border-slate-700"
              }`}
            >
              LANGGRAPH ROUTING
            </button>
            <button
              onClick={() => setActiveTab("db")}
              className={`px-4 py-2 border-2 text-xs font-black uppercase ${
                activeTab === "db"
                  ? "bg-[#3B82F6] text-white border-slate-100 shadow-[3px_3px_0px_0px_#FACC15]"
                  : "bg-[#0F172A] text-slate-300 border-slate-700"
              }`}
            >
              COCKROACHDB DDL
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="bg-[#0F172A] p-6 border-4 border-slate-100 shadow-[8px_8px_0px_0px_#3B82F6]">
          {activeTab === "memory" && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-lg font-black text-yellow-400 uppercase">Ebbinghaus Retention Decay & Vector Deduplication</h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Skill memory units suffer retention decay unless reinforced by project commits or mock interviews. When vector similarity between two memories exceeds 0.92, the engine automatically merges evidence records without losing historical context.
              </p>
              <div className="p-4 bg-[#020617] border-2 border-slate-700 text-xs font-mono text-cyan-400 space-y-1">
                <p>Retention Formula: S(t) = min(1.0, Initial_Impact * Confidence * (1 + beta * ln(Frequency)) * e^(-lambda * t))</p>
                <p className="text-slate-400">// Automatically triggered every 24h via scheduled background worker</p>
              </div>
            </div>
          )}

          {activeTab === "agent" && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-lg font-black text-purple-400 uppercase">10-Node LangGraph State Graph Workflow</h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Requests route through intent classifiers: Resume Analyzer $\rightarrow$ Memory Retriever $\rightarrow$ Market Analyzer $\rightarrow$ Skill Gap Analyzer $\rightarrow$ Recommendation Generator $\rightarrow$ Interview Coach $\rightarrow$ Memory Evolution $\rightarrow$ Notification Engine.
              </p>
              <div className="p-4 bg-[#020617] border-2 border-slate-700 text-xs font-mono text-green-400 space-y-1">
                <p>Nodes: [Resume, Retriever, Market, SkillGap, RecGen, LearningPlanner, Coach, Evolution, Writer, Notifier]</p>
                <p className="text-slate-400">// Exponential backoff retries (max_retries=3) on LLM rate limits</p>
              </div>
            </div>
          )}

          {activeTab === "db" && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-lg font-black text-blue-400 uppercase">CockroachDB HNSW Vector Table Definition</h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                20 relational tables with 1024-dimensional vector embeddings stored using CockroachDB's HNSW vector index format for distributed scale.
              </p>
              <pre className="p-4 bg-[#020617] border-2 border-slate-700 text-[11px] font-mono text-yellow-300 overflow-x-auto">
{`CREATE TABLE career_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  memory_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(1024),
  confidence_score FLOAT DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_embeddings_hnsw ON career_memories USING HNSW (embedding vector_cosine_ops);`}
              </pre>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          5. NAVIGATION CALL TO ACTION & FOOTER
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="px-6 pt-12 pb-8 max-w-7xl mx-auto">
        <div className="p-10 bg-[#0F172A] border-4 border-yellow-400 shadow-[10px_10px_0px_0px_#FACC15] flex flex-col md:flex-row items-center justify-between gap-6 font-mono">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-50 uppercase">START EVOLVING YOUR CAREER TODAY.</h2>
            <p className="text-xs text-slate-300 font-sans font-medium">Explore the interactive dashboard, memory graph, and decision engine feed.</p>
          </div>
          <Link
            href="/dashboard"
            className="py-4 px-8 brutal-btn brutal-btn-yellow text-sm font-black flex items-center gap-3"
          >
            LAUNCH COMMAND CENTER <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <footer className="mt-16 pt-8 border-t-4 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-100">CAREERDNA AI</span>
            <span>• Built for Software Engineers & AI Engineers</span>
          </div>
          <div className="flex items-center gap-6 font-bold uppercase">
            <Link href="/dashboard" className="hover:text-yellow-400">Dashboard</Link>
            <Link href="/career-dna" className="hover:text-purple-400">Career DNA</Link>
            <Link href="/memory-graph" className="hover:text-cyan-400">Memory Graph</Link>
            <Link href="/timeline" className="hover:text-green-400">Timeline</Link>
          </div>
        </footer>
      </section>
    </div>
  );
}
