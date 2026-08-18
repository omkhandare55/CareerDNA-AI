"use client";

import { useState, useEffect } from "react";
import {
  Compass,
  TrendingUp,
  Award,
  Zap,
  Target,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  Building
} from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";

export default function SimulationPage() {
  const [targets, setTargets] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState("Staff AI Systems Engineer");
  const [selectedTier, setSelectedTier] = useState("FAANG");
  const [timelineMonths, setTimelineMonths] = useState(6);
  const [loading, setLoading] = useState(false);
  const [simulation, setSimulation] = useState<any>(null);
  const [adopted, setAdopted] = useState(false);

  useEffect(() => {
    apiGet("/api/v1/simulate/targets")
      .then((data) => {
        if (data?.targets?.length) {
          setTargets(data.targets);
        }
      })
      .catch(() => {});

    // Run initial simulation
    runSimulation("Staff AI Systems Engineer", "FAANG", 6);
  }, []);

  const runSimulation = async (role: string, tier: string, months: number) => {
    setLoading(true);
    setAdopted(false);
    try {
      const res = await apiPost("/api/v1/simulate/career-transition", {
        target_role: role,
        target_company_tier: tier,
        timeline_months: months,
      });
      setSimulation(res);
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptPlan = async () => {
    setAdopted(true);
    try {
      await apiPost("/api/v1/learning", {
        course_name: `Simulated Roadmap: ${simulation?.target_role || "Staff AI Engineer"}`,
        provider: "CareerDNA AI Sandbox",
        category: "DISTRIBUTED_SYSTEMS",
        target_skills: simulation?.critical_skill_gaps || ["CockroachDB", "LangGraph"],
      });
    } catch (err) {
      console.warn("Adopt fallback:", err);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-slate-800 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider font-mono flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-yellow-400" /> Career Transition Simulation Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Test "What-If" career jumps against your persistent CockroachDB Career DNA and real-time market signals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-3 py-1 bg-[#3B82F6] text-white border-2 border-slate-100 font-mono font-black uppercase shadow-[3px_3px_0px_0px_#FACC15]">
            ENGINE: AWS BEDROCK + CDB VECTORS
          </span>
        </div>
      </div>

      {/* Interactive Controls & Parameters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Card */}
        <div className="bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#3B82F6] space-y-6 font-mono lg:col-span-1">
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
            <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-yellow-400" /> Scenario Parameters
            </h3>
            <span className="text-[9px] px-2 py-0.5 bg-[#EC4899] text-white font-bold border border-slate-700 uppercase">
              WHAT-IF MODE
            </span>
          </div>

          {/* Target Role Selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-300 uppercase tracking-wider">
              Target Engineering Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                runSimulation(e.target.value, selectedTier, timelineMonths);
              }}
              className="w-full bg-[#020617] border-2 border-slate-700 text-slate-100 px-3 py-2 text-xs font-bold focus:border-[#3B82F6] focus:outline-none"
            >
              {targets.length > 0 ? (
                targets.map((t, idx) => (
                  <option key={idx} value={t.role}>
                    {t.role} ({t.difficulty})
                  </option>
                ))
              ) : (
                <>
                  <option value="Staff AI Systems Engineer">Staff AI Systems Engineer (ADVANCED)</option>
                  <option value="Principal Distributed Systems Architect">Principal Distributed Systems Architect (EXPERT)</option>
                  <option value="Senior Cloud AI Engineer">Senior Cloud AI Engineer (INTERMEDIATE)</option>
                  <option value="Lead Fullstack AI Architect">Lead Fullstack AI Architect (INTERMEDIATE)</option>
                </>
              )}
            </select>
          </div>

          {/* Company Tier Selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-300 uppercase tracking-wider">
              Target Company Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["FAANG", "Unicorn", "AI Labs"].map((tier) => (
                <button
                  key={tier}
                  onClick={() => {
                    setSelectedTier(tier);
                    runSimulation(selectedRole, tier, timelineMonths);
                  }}
                  className={`py-2 text-[11px] font-black uppercase border-2 transition-all ${
                    selectedTier === tier
                      ? "bg-[#FACC15] text-slate-950 border-slate-50 shadow-[2px_2px_0px_0px_#3B82F6]"
                      : "bg-[#020617] text-slate-400 border-slate-700 hover:border-slate-500"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-black uppercase">
              <span className="text-slate-300">Transition Timeline</span>
              <span className="text-cyan-400 font-bold">{timelineMonths} Months</span>
            </div>
            <input
              type="range"
              min="3"
              max="24"
              step="3"
              value={timelineMonths}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setTimelineMonths(val);
                runSimulation(selectedRole, selectedTier, val);
              }}
              className="w-full accent-[#3B82F6] cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-slate-500 font-bold uppercase">
              <span>3m (Aggressive)</span>
              <span>12m (Optimal)</span>
              <span>24m (Gradual)</span>
            </div>
          </div>

          <button
            onClick={() => runSimulation(selectedRole, selectedTier, timelineMonths)}
            disabled={loading}
            className="w-full py-3 bg-[#3B82F6] hover:bg-blue-600 text-white font-black text-xs uppercase tracking-wider border-2 border-slate-100 shadow-[4px_4px_0px_0px_#FACC15] flex items-center justify-center gap-2 transition active:translate-x-0.5 active:translate-y-0.5"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Simulating Vector DAG..." : "Re-Calculate Scenario"}
          </button>
        </div>

        {/* Projection Metrics Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Feasibility Metric */}
            <div className="bg-[#0F172A] p-5 border-4 border-slate-800 shadow-[4px_4px_0px_0px_#22C55E] space-y-2 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Feasibility</span>
                <span className="px-1.5 py-0.5 text-[8px] bg-green-500 text-slate-950 font-black">HIGH</span>
              </div>
              <p className="text-3xl font-black text-green-400">
                {simulation ? `${Math.round(simulation.feasibility_score * 100)}%` : "88%"}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                {simulation?.why_feasible || "High overlap with verified CockroachDB & AWS experience."}
              </p>
            </div>

            {/* Salary Metric */}
            <div className="bg-[#0F172A] p-5 border-4 border-slate-800 shadow-[4px_4px_0px_0px_#FACC15] space-y-2 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Projected Comp</span>
                <DollarSign className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-3xl font-black text-yellow-400">
                ${simulation ? (simulation.projected_salary_est / 1000).toFixed(0) : "245"}k
              </p>
              <p className="text-[10px] text-green-400 font-bold">
                +{simulation?.salary_increase_pct ?? 48.5}% projected increase
              </p>
            </div>

            {/* Readiness Jump */}
            <div className="bg-[#0F172A] p-5 border-4 border-slate-800 shadow-[4px_4px_0px_0px_#A855F7] space-y-2 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">DNA Readiness</span>
                <Award className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-3xl font-black text-purple-400">
                {simulation?.current_readiness_score ?? 68} <span className="text-lg text-slate-500">→</span> {simulation?.projected_readiness_score ?? 94}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                +{((simulation?.projected_readiness_score ?? 94) - (simulation?.current_readiness_score ?? 68))} score jump upon completion
              </p>
            </div>
          </div>

          {/* Critical Skill Gaps */}
          <div className="bg-[#0F172A] p-5 border-4 border-slate-800 shadow-[4px_4px_0px_0px_#EC4899] space-y-3 font-mono">
            <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center justify-between">
              <span>Required Skill Remediations</span>
              <span className="text-[9px] text-pink-400 font-bold">COCKROACHDB & AWS BENCHMARK</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {simulation?.critical_skill_gaps?.map((skill: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs bg-[#020617] text-pink-300 border border-pink-500 font-bold uppercase shadow-[2px_2px_0px_0px_#EC4899]"
                >
                  ⚡ {skill}
                </span>
              )) || (
                <span className="text-xs text-slate-400 font-medium">Loading skills...</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Generated Milestone Roadmap */}
      <div className="bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[8px_8px_0px_0px_#3B82F6] space-y-6 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-800 pb-4 gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-50 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-5 h-5 text-yellow-400" /> Actionable Step-by-Step Transition Roadmap
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Synthesized by AWS Bedrock & LangGraph based on your persistent career memories.
            </p>
          </div>
          <button
            onClick={handleAdoptPlan}
            disabled={adopted}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-slate-100 flex items-center gap-2 transition shadow-[3px_3px_0px_0px_#FACC15] ${
              adopted
                ? "bg-green-600 text-slate-950 cursor-default"
                : "bg-[#22C55E] hover:bg-green-600 text-slate-950 active:translate-x-0.5 active:translate-y-0.5"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {adopted ? "Adopted into Learning Plan!" : "Adopt into Learning Plan"}
          </button>
        </div>

        {/* Milestones Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {simulation?.recommended_milestones?.map((m: any, idx: number) => (
            <div
              key={idx}
              className="bg-[#020617] p-5 border-2 border-slate-700 space-y-3 relative hover:border-[#3B82F6] transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black px-2 py-0.5 bg-[#3B82F6] text-white border border-slate-600 uppercase">
                  Month {m.month}
                </span>
                <span className="text-xs font-black text-green-400 font-mono">
                  +{m.expected_readiness_delta} pts
                </span>
              </div>
              <h4 className="text-xs font-black text-slate-100 uppercase">{m.title}</h4>
              <div className="p-3 bg-[#0A0F1D] border border-slate-800 space-y-1.5 text-[10px]">
                <p className="text-yellow-400 font-bold uppercase">CockroachDB Goal:</p>
                <p className="text-slate-300 font-medium">{m.cockroachdb_learning_goal}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Skills Acquired:</span>
                <div className="flex flex-wrap gap-1">
                  {m.skills_to_acquire.map((s: string, sIdx: number) => (
                    <span key={sIdx} className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-200 border border-slate-700 font-mono">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
