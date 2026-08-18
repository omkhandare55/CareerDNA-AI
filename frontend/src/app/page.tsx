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
  LogIn,
  UserPlus,
  Play,
  Check,
  Globe
} from "lucide-react";

export default function LandingPage() {
  const [terminalQuery, setTerminalQuery] = useState("How do I prepare for a Google AI Engineer interview?");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simOutput, setSimOutput] = useState<string[]>([]);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimOutput([
      "▶ Initializing CockroachDB HNSW Vector Context Search...",
      "✔ Retrieved 5 memories: AWS ML Cert (0.99), Mock System Design Failure (0.94), FastAPI Gateway Repo (0.96)",
      "▶ Executing LangGraph Skill Gap Node...",
      "⚡ Identified Gap: CockroachDB Raft Consensus & Vector Storage Tuning",
      "✔ Decision Generated: Master CockroachDB Distributed HNSW Vector Search (+8 Career Points)",
      "▶ Memory Decay Applied: Ebbinghaus retention refreshed for Python & FastAPI skills."
    ]);
    setTimeout(() => setIsSimulating(false), 800);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-purple-500 selection:text-white pb-20 relative overflow-hidden">
      {/* Ambient Glassmorphic Background Gradient Orbs */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-gradient-to-tr from-blue-600/25 via-purple-600/25 to-pink-600/20 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-bl from-purple-600/20 via-cyan-600/20 to-blue-600/25 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[10%] left-[-5%] w-[550px] h-[550px] bg-gradient-to-r from-emerald-600/20 via-blue-600/20 to-purple-600/20 rounded-full blur-[130px] pointer-events-none -z-10"></div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          1. GLASSMORPHIC TOP NAVIGATION BAR
         ───────────────────────────────────────────────────────────────────────────── */}
      <nav className="glass-nav sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 text-[#020617] rounded-xl flex items-center justify-center font-black text-xl shadow-[0_0_20px_rgba(250,204,21,0.4)] border border-yellow-300/40">
              🧬
            </div>
            <div>
              <span className="font-black text-xl text-slate-100 tracking-wider font-mono flex items-center gap-1.5">
                CareerDNA <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md font-bold shadow-lg shadow-purple-500/20 border border-white/20">AI</span>
              </span>
              <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest font-mono">Lifelong AI Agent Platform</p>
            </div>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8 font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
            <a href="#demo" className="hover:text-yellow-400 transition">Agent Simulator</a>
            <a href="#features" className="hover:text-cyan-400 transition">Capabilities</a>
            <a href="#pricing" className="hover:text-purple-400 transition">Pricing</a>
          </div>

          {/* Nav Action Buttons */}
          <div className="flex items-center gap-3 font-mono">
            {/* HOME / DASHBOARD */}
            <Link
              href="/dashboard"
              className="py-2 px-3.5 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/60 text-slate-100 text-xs font-bold rounded-xl flex items-center gap-1.5 backdrop-blur-md transition shadow-md"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" /> HOME
            </Link>

            {/* LOGIN */}
            <Link
              href="/login"
              className="py-2 px-3.5 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs font-bold rounded-xl flex items-center gap-1.5 backdrop-blur-md transition shadow-md shadow-purple-500/10"
            >
              <LogIn className="w-3.5 h-3.5 text-yellow-400" /> LOGIN
            </Link>

            {/* REGISTER */}
            <Link
              href="/register"
              className="py-2 px-4 glass-btn-yellow rounded-xl text-xs flex items-center gap-1.5 font-extrabold"
            >
              <UserPlus className="w-3.5 h-3.5" /> GET STARTED
            </Link>
          </div>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. GLASSMORPHIC HERO SECTION
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="relative px-6 pt-16 pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Main Value Prop */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-purple-500/15 border border-purple-500/30 rounded-full text-xs font-bold font-mono text-purple-300 backdrop-blur-md shadow-lg shadow-purple-500/10">
              <Zap className="w-4 h-4 text-yellow-400 animate-pulse fill-current" />
              <span>PERSISTENT CAREER VECTOR STATE MACHINE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-50 uppercase leading-[1.1] font-mono">
              YOUR CAREER HAS A <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(250,204,21,0.4)]">DNA.</span>
              <br />
              LET AI EVOLVE IT <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">CONTINUOUSLY.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-medium max-w-2xl leading-relaxed">
              CareerDNA AI connects your resume, GitHub commits, mock interview logs, and certifications into a persistent CockroachDB vector state machine powered by a 10-node LangGraph agent network and AWS Bedrock.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 font-mono">
              <Link
                href="/dashboard"
                className="py-4 px-8 glass-btn-yellow rounded-xl text-xs flex items-center gap-2 font-black"
              >
                ENTER COMMAND CENTER <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="py-4 px-6 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/60 text-slate-100 text-xs font-bold rounded-xl flex items-center gap-2 backdrop-blur-md transition shadow-lg"
              >
                <LogIn className="w-4 h-4 text-purple-400" /> LOG IN TO ACCOUNT
              </Link>
            </div>
          </div>

          {/* Right Column: Glassmorphic Live Proof Sandbox */}
          <div className="lg:col-span-5 glass-panel p-7 rounded-3xl border border-white/15 space-y-5 font-mono relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500/80 rounded-full"></span>
                <span className="w-3 h-3 bg-yellow-400/80 rounded-full"></span>
                <span className="w-3 h-3 bg-green-500/80 rounded-full"></span>
                <span className="text-xs font-bold text-slate-300 ml-2">CAREER_DNA_CORE.py</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-green-500/15 border border-green-500/30 text-green-400 font-bold rounded-full">
                LIVE ENGINE
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-yellow-400/30 shadow-lg shadow-yellow-500/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">CURRENT READINESS SCORE</span>
                  <p className="text-3xl font-black font-mono text-slate-50 mt-0.5">87 <span className="text-xs text-green-400">↑ +3</span></p>
                </div>
                <Dna className="w-9 h-9 text-purple-400" />
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-cyan-500/30 space-y-1.5">
                <div className="flex justify-between text-[10px] text-slate-300 font-bold">
                  <span>VECTOR SIMILARITY SEARCH</span>
                  <span className="text-cyan-400 font-mono">48ms</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full w-[85%] rounded-full"></div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-purple-500/30 space-y-1.5">
                <div className="flex justify-between text-[10px] text-slate-300 font-bold">
                  <span>LANGGRAPH ROUTER LATENCY</span>
                  <span className="text-purple-400 font-mono">120ms</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full w-[65%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          3. GLASSMORPHIC AGENT TERMINAL SIMULATOR
         ───────────────────────────────────────────────────────────────────────────── */}
      <section id="demo" className="px-6 py-16 max-w-7xl mx-auto font-mono">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="px-3.5 py-1 bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-xs font-bold rounded-full uppercase">
              INTERACTIVE AGENT SIMULATOR
            </span>
            <h2 className="text-3xl font-black text-slate-50 uppercase tracking-tight">TEST THE LANGGRAPH CAREER ENGINE LIVE</h2>
          </div>

          <div className="glass-panel p-7 rounded-3xl border border-white/15 space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={terminalQuery}
                onChange={(e) => setTerminalQuery(e.target.value)}
                className="w-full p-3.5 bg-slate-950/80 text-slate-100 text-xs font-bold rounded-xl border border-slate-700/70 focus:border-yellow-400 focus:outline-none backdrop-blur-md"
              />
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="w-full sm:w-auto py-3.5 px-6 glass-btn-yellow rounded-xl text-xs font-black uppercase whitespace-nowrap flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" /> EXECUTE ROUTE
              </button>
            </div>

            {/* Simulation Log Stream Output */}
            {simOutput.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-purple-500/40 space-y-2.5 text-xs text-slate-200 animate-in fade-in">
                {simOutput.map((line, idx) => (
                  <p key={idx} className={line.startsWith("⚡") ? "text-yellow-400 font-black" : line.startsWith("✔") ? "text-green-400 font-bold" : "text-slate-300"}>
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          4. GLASSMORPHIC CAPABILITIES MATRIX
         ───────────────────────────────────────────────────────────────────────────── */}
      <section id="features" className="px-6 py-16 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 font-mono">
          <span className="px-3.5 py-1 bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold rounded-full uppercase">
            CORE SYSTEM CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-50 uppercase tracking-tight">
            ENGINEERED FOR LIFELONG CAREER SOVEREIGNTY
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Lifelong Ebbinghaus Memory Engine",
              desc: "Never lose record of a project, cert, or interview question. Uses exponential decay formulas to calculate skill retention over time.",
              icon: History,
              class: "glass-card-purple"
            },
            {
              title: "CockroachDB HNSW Vector Search",
              desc: "High-performance distributed SQL table indexed with 1024-dimensional embeddings for sub-50ms career context similarity lookup.",
              icon: Database,
              class: "glass-card-blue"
            },
            {
              title: "7-Stream Career Intelligence",
              desc: "Real-time scraper monitoring job listings, salary benchmarks, company hiring news, hackathons, and tech demand spikes.",
              icon: Zap,
              class: "glass-card-yellow"
            },
            {
              title: "10-Node LangGraph Agent Engine",
              desc: "Modular state machine executing resume parsing, skill gap analysis, interview coaching, and automatic memory evolution.",
              icon: Cpu,
              class: "glass-card-cyan"
            },
            {
              title: "Explainable AI Decision Audit",
              desc: "Zero black box advice. Every recommendation cites exact historical memory evidence and provides model confidence ratings.",
              icon: ShieldCheck,
              class: "glass-card-purple"
            },
            {
              title: "AWS Bedrock Cloud Security",
              desc: "Enterprise infrastructure secured with KMS encryption, S3 pre-signed upload URLs, and Cognito OAuth2 tokens.",
              icon: Lock,
              class: "glass-card-blue"
            }
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className={`${feat.class} p-7 rounded-3xl space-y-3.5`}>
                <div className="w-12 h-12 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center justify-center text-yellow-400 font-bold shadow-lg">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-50 uppercase font-mono">{feat.title}</h3>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          5. GLASSMORPHIC PRICING TIERS
         ───────────────────────────────────────────────────────────────────────────── */}
      <section id="pricing" className="px-6 py-16 max-w-7xl mx-auto space-y-12 font-mono">
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1 bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-bold rounded-full uppercase">
            TRANSPARENT PRICING
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-50 uppercase tracking-tight">CHOOSE YOUR CAREER SOVEREIGNTY TIER</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto font-sans">
          {/* Free Tier */}
          <div className="glass-panel p-8 rounded-3xl space-y-6">
            <div className="font-mono space-y-2 border-b border-white/10 pb-4">
              <span className="text-xs font-bold text-slate-400 uppercase">PIONEER FREE TIER</span>
              <p className="text-4xl font-black text-slate-50">$0 <span className="text-xs font-mono text-slate-400">/ FOREVER</span></p>
            </div>
            <ul className="space-y-3 text-xs font-mono">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> 100 Persistent Vector Memories</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Full Access to Command Center</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Basic ATS Resume Analysis</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Ebbinghaus Skill Decay Engine</li>
            </ul>
            <Link
              href="/register"
              className="w-full py-3.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-100 text-xs font-bold rounded-xl uppercase text-center block font-mono backdrop-blur-md transition shadow-lg"
            >
              CREATE FREE ACCOUNT
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="glass-card-yellow p-8 rounded-3xl space-y-6 relative overflow-hidden">
            <div className="font-mono space-y-2 border-b border-yellow-400/20 pb-4">
              <span className="px-2.5 py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-black uppercase rounded-full border border-white/20">POPULAR</span>
              <p className="text-4xl font-black text-slate-50">$19 <span className="text-xs font-mono text-slate-400">/ MONTH</span></p>
            </div>
            <ul className="space-y-3 text-xs font-mono">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-yellow-400" /> Unlimited Persistent Memories</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-yellow-400" /> 7-Stream Real-Time Intelligence Scraper</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-yellow-400" /> Full Mock Interview Q&A Feedback</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-yellow-400" /> Direct AWS Bedrock Claude 3.5 Sonnet</li>
            </ul>
            <Link
              href="/register"
              className="w-full py-3.5 glass-btn-yellow rounded-xl text-xs font-black uppercase text-center block font-mono"
            >
              START 14-DAY PRO TRIAL
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          6. FOOTER
         ───────────────────────────────────────────────────────────────────────────── */}
      <footer className="px-6 pt-12 max-w-7xl mx-auto border-t border-white/10 font-mono text-xs text-slate-400 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-100">CAREERDNA AI</span>
            <span>• Lifelong AI Career Engine</span>
          </div>

          <div className="flex items-center gap-6 font-bold uppercase text-slate-300">
            <Link href="/dashboard" className="hover:text-yellow-400">Home (Dashboard)</Link>
            <Link href="/login" className="hover:text-purple-400">Login</Link>
            <Link href="/register" className="hover:text-cyan-400">Register</Link>
            <Link href="/memory-graph" className="hover:text-green-400">Memory Graph</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
