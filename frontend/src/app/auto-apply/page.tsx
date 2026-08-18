"use client";

import { useState, useEffect } from "react";
import {
  Send,
  Sparkles,
  Building,
  CheckCircle2,
  Briefcase,
  TrendingUp,
  Award,
  Zap,
  ArrowRight,
  ExternalLink,
  Copy,
  Download
} from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";

export default function AutoApplyPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);
  const [dispatchedApps, setDispatchedApps] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await apiGet("/api/v1/auto-apply/matches");
      if (data?.jobs) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error("Fetch jobs error:", err);
    }
  };

  const handleDispatch = async (job: any) => {
    setDispatchingId(job.job_id);
    try {
      const res = await apiPost("/api/v1/auto-apply/dispatch", {
        job_id: job.job_id,
      });
      setDispatchedApps((prev) => ({ ...prev, [job.job_id]: res }));
    } catch (err) {
      console.error("Dispatch error:", err);
    } finally {
      setDispatchingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-slate-800 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider font-mono flex items-center gap-2.5">
            <Send className="w-7 h-7 text-cyan-400" /> Autonomous Job Match & 1-Click Auto-Apply
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Autonomous vector matching against top AI job listings. Generates Google XYZ tailored cover letters and dispatches applications instantly.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-3 py-1 bg-cyan-600 text-white border-2 border-slate-100 font-mono font-black uppercase shadow-[3px_3px_0px_0px_#FACC15]">
            4 TIER-1 AI ROLES MATCHED
          </span>
        </div>
      </div>

      {/* Matched Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
        {jobs.map((job) => {
          const app = dispatchedApps[job.job_id];
          return (
            <div
              key={job.job_id}
              className="bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#3B82F6] space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between border-b-2 border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-cyan-400 border border-cyan-500 font-bold uppercase">
                      {job.company_name}
                    </span>
                    <h3 className="text-sm font-black text-slate-100 uppercase mt-1.5">{job.role_title}</h3>
                    <p className="text-[10px] text-slate-400">{job.location}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 uppercase font-bold">Vector Match</span>
                    <p className="text-2xl font-black text-green-400 leading-none">{job.match_score}%</p>
                  </div>
                </div>

                {/* Salary */}
                <div className="p-2.5 bg-[#020617] border border-slate-700 text-center">
                  <span className="text-[8px] text-slate-400 uppercase font-black">Target Compensation Range</span>
                  <p className="text-xs font-black text-yellow-400">{job.salary_range}</p>
                </div>

                {/* Matched Skills */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Verified Skill Matches:</span>
                  <div className="flex flex-wrap gap-1">
                    {job.matched_skills.map((s: string, idx: number) => (
                      <span key={idx} className="text-[9px] px-2 py-0.5 bg-slate-800 text-green-400 border border-green-500 font-bold">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dispatched Cover Letter Drawer */}
                {app && (
                  <div className="p-4 bg-[#020617] border-2 border-green-500 shadow-[3px_3px_0px_0px_#22C55E] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-green-400 uppercase flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {app.dispatch_status}
                      </span>
                      <span className="text-[8px] text-slate-400">Timeline ID: {app.timeline_event_id.substring(0, 8)}</span>
                    </div>
                    <pre className="text-[10px] text-slate-300 font-mono whitespace-pre-wrap bg-[#0A0F1D] p-3 border border-slate-800 max-h-[140px] overflow-auto leading-relaxed">
                      {app.generated_cover_letter}
                    </pre>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleDispatch(job)}
                disabled={dispatchingId === job.job_id}
                className={`w-full py-3 text-xs font-black uppercase tracking-wider border-2 border-slate-100 flex items-center justify-center gap-2 transition shadow-[3px_3px_0px_0px_#FACC15] ${
                  app
                    ? "bg-green-500 text-slate-950 cursor-default"
                    : "bg-[#3B82F6] hover:bg-blue-600 text-white active:translate-x-0.5 active:translate-y-0.5"
                }`}
              >
                <Send className={`w-4 h-4 ${dispatchingId === job.job_id ? "animate-spin" : ""}`} />
                {dispatchingId === job.job_id
                  ? "Generating Cover Letter & Dispatching..."
                  : (app ? "Application Dispatched ✓" : "1-Click Auto-Apply with AI Cover Letter")}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
