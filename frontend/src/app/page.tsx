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
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-[#FACC15] selection:text-slate-950 pb-20">
      {/* ─────────────────────────────────────────────────────────────────────────────
          1. TOP NAVIGATION BAR WITH LOGIN & HOME OPTIONS
         ───────────────────────────────────────────────────────────────────────────── */}
      <nav className="border-b-4 border-slate-800 bg-[#0A0F1D] sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FACC15] text-[#020617] border-2 border-slate-100 flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_0px_#EC4899]">
              🧬
            </div>
            <div>
              <span className="font-black text-xl text-slate-100 uppercase tracking-wider font-mono flex items-center gap-1.5">
                CareerDNA <span className="text-xs px-2 py-0.5 bg-[#EC4899] text-white border border-slate-100 font-bold">AI</span>
              </span>
              <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest font-mono">Lifelong AI Agent Platform</p>
            </div>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8 font-mono text-xs font-black uppercase tracking-wider">
            <a href="#demo" className="hover:text-yellow-400 transition">Agent Simulator</a>
            <a href="#features" className="hover:text-cyan-400 transition">Features</a>
            <a href="#pricing" className="hover:text-purple-400 transition">Pricing</a>
          </div>

          {/* Navigation Action Buttons: HOME, LOGIN, REGISTER */}
          <div className="flex items-center gap-3 font-mono">
            {/* HOME / DASHBOARD */}
            <Link
              href="/dashboard"
              className="py-2 px-3.5 bg-[#0F172A] border-2 border-slate-700 hover:border-yellow-400 text-slate-100 text-xs font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#020617] transition"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" /> HOME
            </Link>

            {/* LOGIN */}
            <Link
              href="/login"
              className="py-2 px-3.5 bg-[#0F172A] border-2 border-slate-100 hover:border-purple-400 text-slate-100 text-xs font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#A855F7] transition"
            >
              <LogIn className="w-3.5 h-3.5 text-yellow-400" /> LOGIN
            </Link>

            {/* REGISTER */}
            <Link
              href="/register"
              className="py-2 px-4 brutal-btn brutal-btn-yellow text-xs flex items-center gap-1.5 font-black uppercase"
            >
              <UserPlus className="w-3.5 h-3.5" /> GET STARTED
            </Link>
          </div>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. DISTINCT HERO SECTION WITH SPLIT TERMINAL SANDBOX
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="relative px-6 pt-12 pb-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline & Value Prop */}
          <div className="lg:col-span-7 space-y-6 font-mono">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#EC4899] text-white border-2 border-slate-100 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#FACC15]">
              <Zap className="w-4 h-4 fill-current text-yellow-300" />
              <span>PERSISTENT CAREER STATE MACHINE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-50 uppercase leading-[1.05]">
              STOP STARTING FROM <span className="text-[#FACC15] bg-[#0F172A] px-2 py-0.5 border-4 border-slate-100 inline-block shadow-[4px_4px_0px_0px_#3B82F6]">SCRATCH</span> EVERY JOB SEARCH.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-sans font-medium leading-relaxed">
              CareerDNA AI continuously updates your personal vector memory graph every time you finish a project, fail a mock interview, or complete a certification. Never lose career context again.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/dashboard"
                className="py-3.5 px-7 brutal-btn brutal-btn-yellow text-xs font-black flex items-center gap-2"
              >
                ENTER COMMAND CENTER <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="py-3.5 px-6 bg-[#0F172A] border-4 border-slate-700 hover:border-purple-400 text-slate-100 text-xs font-black uppercase flex items-center gap-2 shadow-[4px_4px_0px_0px_#020617] transition"
              >
                <LogIn className="w-4 h-4 text-purple-400" /> LOG IN TO ACCOUNT
              </Link>
            </div>
          </div>

          {/* Right Column: Live Interactive Memory Graph Box */}
          <div className="lg:col-span-5 bg-[#0F172A] p-6 border-4 border-slate-100 shadow-[10px_10px_0px_0px_#3B82F6] space-y-4 font-mono">
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-none"></span>
                <span className="w-3 h-3 bg-yellow-400 rounded-none"></span>
                <span className="w-3 h-3 bg-green-500 rounded-none"></span>
                <span className="text-xs font-black text-slate-300 ml-2">CAREER_DNA_CORE.py</span>
              </div>
              <span className="text-[10px] text-green-400 font-black uppercase">LIVE ENGINE</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#020617] border-2 border-yellow-400 shadow-[2px_2px_0px_0px_#FACC15] flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-black">CURRENT READINESS SCORE</span>
                  <p className="text-2xl font-black text-slate-50 font-mono">87 <span className="text-xs text-green-400">↑ +3</span></p>
                </div>
                <Dna className="w-8 h-8 text-purple-400" />
              </div>

              <div className="p-3 bg-[#020617] border-2 border-slate-700 space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>VECTOR SIMILARITY SEARCH</span>
                  <span className="text-cyan-400">48ms</span>
                </div>
                <div className="w-full bg-slate-800 h-2 border border-slate-600">
                  <div className="bg-[#06B6D4] h-full w-[85%]"></div>
                </div>
              </div>

              <div className="p-3 bg-[#020617] border-2 border-slate-700 space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>LANGGRAPH ROUTER LATENCY</span>
                  <span className="text-purple-400">120ms</span>
                </div>
                <div className="w-full bg-slate-800 h-2 border border-slate-600">
                  <div className="bg-[#A855F7] h-full w-[65%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          3. AGENT TERMINAL SIMULATOR SANDBOX
         ───────────────────────────────────────────────────────────────────────────── */}
      <section id="demo" className="px-6 py-16 bg-[#090D16] border-t-4 border-b-4 border-slate-800 font-mono">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 bg-[#FACC15] text-slate-950 text-xs font-black uppercase border border-slate-950">
              INTERACTIVE AGENT SIMULATOR
            </span>
            <h2 className="text-3xl font-black text-slate-50 uppercase">TEST THE LANGGRAPH CAREER ENGINE LIVE</h2>
          </div>

          <div className="bg-[#0F172A] p-6 border-4 border-slate-100 shadow-[8px_8px_0px_0px_#A855F7] space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={terminalQuery}
                onChange={(e) => setTerminalQuery(e.target.value)}
                className="w-full p-3 bg-[#020617] text-slate-100 text-xs font-bold border-2 border-slate-700 focus:border-yellow-400 focus:outline-none"
              />
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="w-full sm:w-auto py-3 px-6 brutal-btn brutal-btn-yellow text-xs font-black uppercase whitespace-nowrap flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" /> EXECUTE ROUTE
              </button>
            </div>

            {/* Simulation Log Stream Output */}
            {simOutput.length > 0 && (
              <div className="p-4 bg-[#020617] border-2 border-purple-500 space-y-2 text-xs text-slate-200 animate-in fade-in">
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
          4. PRICING & TIER MATRIX
         ───────────────────────────────────────────────────────────────────────────── */}
      <section id="pricing" className="px-6 py-16 max-w-7xl mx-auto space-y-12 font-mono">
        <div className="text-center space-y-3">
          <span className="px-3 py-1 bg-[#EC4899] text-white text-xs font-black uppercase border border-slate-100">
            TRANSPARENT PRICING
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-50 uppercase">CHOOSE YOUR CAREER SOVEREIGNTY TIER</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="bg-[#0F172A] p-8 border-4 border-slate-700 space-y-6">
            <div className="font-mono space-y-2 border-b-2 border-slate-800 pb-4">
              <span className="text-xs font-black text-slate-400 uppercase">PIONEER FREE TIER</span>
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
              className="w-full py-3.5 bg-[#020617] border-2 border-slate-600 hover:border-slate-300 text-slate-100 text-xs font-black uppercase text-center block font-mono"
            >
              CREATE FREE ACCOUNT
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-[#0F172A] p-8 border-4 border-yellow-400 shadow-[10px_10px_0px_0px_#FACC15] space-y-6">
            <div className="font-mono space-y-2 border-b-2 border-slate-800 pb-4">
              <span className="px-2 py-0.5 bg-[#A855F7] text-white text-[10px] font-black uppercase border border-slate-100">POPULAR</span>
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
              className="w-full py-3.5 brutal-btn brutal-btn-yellow text-xs font-black uppercase text-center block font-mono"
            >
              START 14-DAY PRO TRIAL
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          5. FOOTER WITH QUICK LINKS
         ───────────────────────────────────────────────────────────────────────────── */}
      <footer className="px-6 pt-12 max-w-7xl mx-auto border-t-4 border-slate-800 font-mono text-xs text-slate-400 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-100">CAREERDNA AI</span>
            <span>• Lifelong AI Career Engine</span>
          </div>

          <div className="flex items-center gap-6 font-bold uppercase">
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
