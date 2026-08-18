"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  Building,
  Zap,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";

export default function NegotiationLabPage() {
  const [company, setCompany] = useState("Google");
  const [initialBase, setInitialBase] = useState(220000);
  const [initialEquity, setInitialEquity] = useState(120000);
  const [initialBonus, setInitialBonus] = useState(30000);

  const [counterBase, setCounterBase] = useState(245000);
  const [counterEquity, setCounterEquity] = useState(150000);
  const [counterBonus, setCounterBonus] = useState(50000);

  const [competingCompany, setCompetingCompany] = useState("Anthropic");
  const [pitch, setPitch] = useState(
    "Given my verified track record in architecting sub-40ms CockroachDB vector search and my competing offer with Anthropic, I would like to align on $245k Base with accelerated equity vesting."
  );

  const [simulating, setSimulating] = useState(false);
  const [outcome, setOutcome] = useState<any>(null);

  useEffect(() => {
    handleRunBattle();
  }, []);

  const handleRunBattle = async () => {
    if (simulating) return;
    setSimulating(true);
    try {
      const res = await apiPost("/api/v1/negotiation/counter-offer", {
        company_name: company,
        target_role: "Staff AI Systems Engineer",
        initial_base: initialBase,
        initial_equity_annual: initialEquity,
        initial_signing_bonus: initialBonus,
        counter_base: counterBase,
        counter_equity_annual: counterEquity,
        counter_signing_bonus: counterBonus,
        competing_offer_company: competingCompany,
        justification_pitch: pitch,
      });
      setOutcome(res);
    } catch (err) {
      console.error("Negotiation error:", err);
    } finally {
      setSimulating(false);
    }
  };

  const initialTotal = initialBase + initialEquity + initialBonus;
  const counterTotal = counterBase + counterEquity + counterBonus;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-slate-800 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider font-mono flex items-center gap-2.5">
            <DollarSign className="w-7 h-7 text-yellow-400" /> Salary Counter-Offer & Equity Negotiation Battle Lab
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Roleplay compensation negotiations against an AI Hiring Manager. Maximize base salary, equity grants, and signing bonuses with market data leverage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-3 py-1 bg-[#FACC15] text-slate-950 border-2 border-slate-100 font-mono font-black uppercase shadow-[3px_3px_0px_0px_#3B82F6]">
            FAANG COMPENSATION BENCHMARKS ACTIVE
          </span>
        </div>
      </div>

      {/* Inputs & Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
        {/* Initial Offer */}
        <div className="bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#3B82F6] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-black text-slate-400 uppercase">Initial Employer Offer</h3>
            <span className="text-xs font-black text-slate-300 font-mono">${initialTotal.toLocaleString()} First-Yr</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mb-1">
                <span>Base Salary:</span>
                <span className="text-slate-200">${initialBase.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="180000"
                max="300000"
                step="5000"
                value={initialBase}
                onChange={(e) => setInitialBase(parseInt(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mb-1">
                <span>Equity (Annual):</span>
                <span className="text-slate-200">${initialEquity.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="250000"
                step="5000"
                value={initialEquity}
                onChange={(e) => setInitialEquity(parseInt(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mb-1">
                <span>Signing Bonus:</span>
                <span className="text-slate-200">${initialBonus.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="100000"
                step="5000"
                value={initialBonus}
                onChange={(e) => setInitialBonus(parseInt(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Counter Offer */}
        <div className="bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#22C55E] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-black text-green-400 uppercase">Your Counter-Proposal</h3>
            <span className="text-xs font-black text-yellow-400 font-mono">${counterTotal.toLocaleString()} First-Yr</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mb-1">
                <span>Counter Base Salary:</span>
                <span className="text-green-400 font-bold">${counterBase.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="180000"
                max="320000"
                step="5000"
                value={counterBase}
                onChange={(e) => setCounterBase(parseInt(e.target.value))}
                className="w-full accent-green-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mb-1">
                <span>Counter Equity (Annual):</span>
                <span className="text-green-400 font-bold">${counterEquity.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="280000"
                step="5000"
                value={counterEquity}
                onChange={(e) => setCounterEquity(parseInt(e.target.value))}
                className="w-full accent-green-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mb-1">
                <span>Counter Signing Bonus:</span>
                <span className="text-green-400 font-bold">${counterBonus.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="120000"
                step="5000"
                value={counterBonus}
                onChange={(e) => setCounterBonus(parseInt(e.target.value))}
                className="w-full accent-green-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Leverage Pitch & Company Bar */}
      <div className="bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#FACC15] font-mono space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-slate-300 uppercase block mb-1">Employer Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-[#020617] border-2 border-slate-700 text-yellow-400 px-3 py-2 text-xs font-mono focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-300 uppercase block mb-1">Competing Offer Company (Leverage)</label>
            <input
              type="text"
              value={competingCompany}
              onChange={(e) => setCompetingCompany(e.target.value)}
              className="w-full bg-[#020617] border-2 border-slate-700 text-pink-400 px-3 py-2 text-xs font-mono focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-300 uppercase block mb-1">
            Justification & Technical Leverage Pitch
          </label>
          <textarea
            rows={3}
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            className="w-full bg-[#020617] border-2 border-slate-700 text-slate-100 p-3 text-xs font-mono focus:border-yellow-400 focus:outline-none leading-relaxed"
          />
        </div>

        <button
          onClick={handleRunBattle}
          disabled={simulating}
          className="w-full py-3.5 bg-[#FACC15] hover:bg-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider border-2 border-slate-100 shadow-[4px_4px_0px_0px_#3B82F6] flex items-center justify-center gap-2 transition active:translate-x-0.5 active:translate-y-0.5"
        >
          <DollarSign className={`w-4 h-4 ${simulating ? "animate-spin" : ""}`} />
          {simulating ? "Simulating Recruiter Reaction..." : "Run AI Hiring Manager Battle & Calculate Acceptance"}
        </button>
      </div>

      {/* Outcome Results Card */}
      {outcome && (
        <div className="bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[8px_8px_0px_0px_#22C55E] space-y-6 font-mono">
          {/* Header Metric Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b-2 border-slate-800 pb-4">
            <div className="p-3 bg-[#020617] border border-slate-700 text-center">
              <span className="text-[9px] text-slate-400 uppercase font-black">Acceptance Probability</span>
              <p className="text-2xl font-black text-green-400">{outcome.acceptance_probability_pct}%</p>
            </div>
            <div className="p-3 bg-[#020617] border border-slate-700 text-center">
              <span className="text-[9px] text-slate-400 uppercase font-black">First-Year Delta</span>
              <p className="text-2xl font-black text-yellow-400">+${outcome.first_year_comp_delta.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-[#020617] border border-slate-700 text-center">
              <span className="text-[9px] text-slate-400 uppercase font-black">4-Year Total Gain</span>
              <p className="text-2xl font-black text-cyan-400">+${outcome.four_year_total_delta.toLocaleString()}</p>
            </div>
          </div>

          {/* Recruiter Dialogue Box */}
          <div className="p-5 bg-[#020617] border-2 border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-yellow-400 uppercase">
                {outcome.company_name} Lead Recruiter Dialogue Response:
              </span>
              <span className="text-[9px] px-2 py-0.5 bg-green-500 text-slate-950 font-black uppercase">
                {outcome.hiring_manager_verdict}
              </span>
            </div>
            <p className="text-xs text-slate-100 leading-relaxed italic">
              "{outcome.recruiter_response_dialogue}"
            </p>
          </div>

          {/* Strategic Takeaways */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase">Negotiation Strategy Rules:</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {outcome.strategic_advice.map((adv: string, i: number) => (
                <div key={i} className="p-3 bg-[#0A0F1D] border border-slate-800 text-[11px] text-slate-300">
                  <span className="text-yellow-400 font-bold">✓ </span> {adv}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
