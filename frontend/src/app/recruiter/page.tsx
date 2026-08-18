"use client";

import { useState, useEffect } from "react";
import {
  Building,
  ShieldCheck,
  Search,
  CheckCircle2,
  TrendingUp,
  Award,
  Database,
  ExternalLink,
  Target,
  Zap,
  Lock
} from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";

export default function RecruiterPortalPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [minScore, setMinScore] = useState(70);
  const [searchRole, setSearchRole] = useState("");
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verifiedProofs, setVerifiedProofs] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchCandidates();
  }, [minScore, searchRole]);

  const fetchCandidates = async () => {
    try {
      const data = await apiGet(`/api/v1/recruiter/candidates?min_score=${minScore}${searchRole ? `&role_filter=${searchRole}` : ""}`);
      if (data?.candidates) {
        setCandidates(data.candidates);
      }
    } catch (err) {
      console.error("Fetch candidates error:", err);
    }
  };

  const handleVerifyProof = async (candidate: any) => {
    setVerifyingId(candidate.candidate_id);
    try {
      const res = await apiPost("/api/v1/recruiter/verify-proof", {
        candidate_id: candidate.candidate_id,
        proof_hash: candidate.cockroachdb_proof_hash,
      });
      setVerifiedProofs((prev) => ({ ...prev, [candidate.candidate_id]: res }));
    } catch (err) {
      console.error("Verify proof error:", err);
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-slate-800 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider font-mono flex items-center gap-2.5">
            <Building className="w-7 h-7 text-yellow-400" /> Enterprise Recruiter Talent Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Search verified engineering talent. Audit candidate claims against immutable CockroachDB memory timelines and vector embeddings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-3 py-1 bg-yellow-500 text-slate-950 border-2 border-slate-100 font-mono font-black uppercase shadow-[3px_3px_0px_0px_#3B82F6]">
            COCKROACHDB VERIFIABLE TALENT POOL
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#0F172A] p-5 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#FACC15] font-mono space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-300 uppercase">Search by Role or Keyword</label>
            <div className="flex items-center bg-[#020617] border-2 border-slate-700 px-3 py-2">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                value={searchRole}
                onChange={(e) => setSearchRole(e.target.value)}
                placeholder="e.g. AI Systems, Distributed, Fullstack..."
                className="w-full bg-transparent text-slate-100 text-xs font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-black uppercase">
              <span className="text-slate-300">Minimum Career DNA Score</span>
              <span className="text-green-400 font-bold">{minScore} / 100</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={minScore}
              onChange={(e) => setMinScore(parseInt(e.target.value))}
              className="w-full accent-yellow-400 cursor-pointer mt-2"
            />
          </div>
        </div>
      </div>

      {/* Candidate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
        {candidates.map((c) => {
          const proof = verifiedProofs[c.candidate_id];
          return (
            <div
              key={c.candidate_id}
              className="bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#3B82F6] space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between border-b-2 border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-100 uppercase">{c.full_name}</h3>
                    <p className="text-[10px] text-yellow-400 font-bold">{c.target_role}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 font-black uppercase">DNA Score</span>
                    <p className="text-2xl font-black text-green-400 leading-none">{c.dna_score}</p>
                  </div>
                </div>

                {/* Metrics Matrix */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 bg-[#020617] border border-slate-700">
                    <span className="text-[8px] text-slate-400 font-black uppercase">Growth Velocity</span>
                    <p className="text-xs font-black text-cyan-400">+{c.growth_velocity_pct}%</p>
                  </div>
                  <div className="p-2 bg-[#020617] border border-slate-700">
                    <span className="text-[8px] text-slate-400 font-black uppercase">Mock Interview Avg</span>
                    <p className="text-xs font-black text-purple-400">{c.mock_interview_avg}%</p>
                  </div>
                </div>

                {/* Verified Skills */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase">
                    Verified Competencies ({c.verified_skills_count}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {c.top_verified_skills.map((s: string, idx: number) => (
                      <span key={idx} className="text-[9px] px-2 py-0.5 bg-slate-800 text-slate-200 border border-slate-700">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recent Milestone */}
                <div className="p-3 bg-[#0A0F1D] border border-slate-800 space-y-1 text-[10px]">
                  <span className="text-[8px] font-black text-slate-500 uppercase">Recent Verified Achievement:</span>
                  <p className="text-slate-300 font-medium">{c.recent_milestone}</p>
                </div>

                {/* Proof Status Badge */}
                {proof && (
                  <div className="p-3 bg-[#020617] border-2 border-green-500 space-y-1 text-[10px]">
                    <div className="flex items-center gap-1.5 text-green-400 font-black">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{proof.status}</span>
                    </div>
                    <p className="text-slate-400 text-[9px]">{proof.verification_details}</p>
                  </div>
                )}
              </div>

              {/* Verify Proof Action */}
              <button
                onClick={() => handleVerifyProof(c)}
                disabled={verifyingId === c.candidate_id}
                className={`w-full py-2.5 text-xs font-black uppercase tracking-wider border-2 border-slate-100 flex items-center justify-center gap-2 transition shadow-[3px_3px_0px_0px_#FACC15] ${
                  proof
                    ? "bg-green-500 text-slate-950 cursor-default"
                    : "bg-[#3B82F6] hover:bg-blue-600 text-white active:translate-x-0.5 active:translate-y-0.5"
                }`}
              >
                <Lock className={`w-3.5 h-3.5 ${verifyingId === c.candidate_id ? "animate-spin" : ""}`} />
                {verifyingId === c.candidate_id ? "Verifying CockroachDB Hash..." : (proof ? "Proof Verified ✓" : "Verify CockroachDB Proof")}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
