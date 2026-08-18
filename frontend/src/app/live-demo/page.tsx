"use client";

import { useState, useEffect } from "react";
import {
  PlayCircle,
  Sparkles,
  Zap,
  CheckCircle2,
  Activity,
  ArrowRight,
  TrendingUp,
  Award,
  Database,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { apiGet, apiPost } from "@/lib/api";

export default function LiveDemoPage() {
  const [steps, setSteps] = useState<any[]>([]);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [stepResults, setStepResults] = useState<Record<string, any>>({});
  const [runningTour, setRunningTour] = useState(false);

  useEffect(() => {
    apiGet("/api/v1/showcase/demo-steps")
      .then((data) => {
        if (data?.steps) setSteps(data.steps);
      })
      .catch(() => {});
  }, []);

  const handleTriggerStep = async (stepId: string) => {
    setActiveStepId(stepId);
    try {
      const res = await apiPost("/api/v1/showcase/trigger-step", { step_id: stepId });
      setStepResults((prev) => ({ ...prev, [stepId]: res }));
    } catch (err) {
      console.error("Step execution error:", err);
    } finally {
      setActiveStepId(null);
    }
  };

  const runAutomatedTour = async () => {
    if (runningTour || !steps.length) return;
    setRunningTour(true);
    for (const s of steps) {
      await handleTriggerStep(s.step_id);
      await new Promise((r) => setTimeout(r, 600));
    }
    setRunningTour(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-slate-800 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider font-mono flex items-center gap-2.5">
            <PlayCircle className="w-7 h-7 text-pink-400" /> Live Guided Demonstration Controller
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Automated 120-second judge walkthrough. Executes live simulations across all core AI subsystems and CockroachDB vector storage.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={runAutomatedTour}
            disabled={runningTour}
            className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white font-mono font-black text-xs uppercase border-2 border-slate-100 shadow-[3px_3px_0px_0px_#FACC15] flex items-center gap-2 transition active:translate-x-0.5 active:translate-y-0.5"
          >
            <Sparkles className={`w-4 h-4 ${runningTour ? "animate-spin" : ""}`} />
            {runningTour ? "Executing Tour..." : "Run Automated Fullstack Demo (120s)"}
          </button>
        </div>
      </div>

      {/* 6 Tour Step Cards */}
      <div className="space-y-4 font-mono">
        {steps.map((s) => {
          const res = stepResults[s.step_id];
          const isExecuting = activeStepId === s.step_id;
          return (
            <div
              key={s.step_id}
              className="bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#3B82F6] space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-black text-yellow-400 uppercase">{s.title}</span>
                  <span className="text-[9px] px-2 py-0.5 bg-slate-800 text-cyan-400 border border-slate-700 uppercase">
                    {s.target_module}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={s.route}
                    className="text-[10px] text-pink-400 hover:text-white flex items-center gap-1 uppercase font-bold"
                  >
                    Open Page <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-8 space-y-1.5 text-xs text-slate-300">
                  <p>{s.description}</p>
                  <p className="text-[11px] text-slate-400 italic">
                    <span className="text-yellow-400 font-bold">Expected: </span>
                    {s.expected_output}
                  </p>
                </div>

                <div className="md:col-span-4 flex justify-end">
                  <button
                    onClick={() => handleTriggerStep(s.step_id)}
                    disabled={isExecuting || runningTour}
                    className={`px-5 py-2.5 text-xs font-black uppercase border-2 border-slate-100 shadow-[3px_3px_0px_0px_#FACC15] flex items-center gap-2 transition active:translate-x-0.5 active:translate-y-0.5 ${
                      res
                        ? "bg-green-500 text-slate-950"
                        : "bg-[#3B82F6] hover:bg-blue-600 text-white"
                    }`}
                  >
                    <Zap className={`w-3.5 h-3.5 ${isExecuting ? "animate-spin" : ""}`} />
                    {isExecuting ? "Executing Live..." : (res ? "Step Verified ✓" : "Trigger Live Step")}
                  </button>
                </div>
              </div>

              {/* Execution Result Box */}
              {res && (
                <div className="p-3.5 bg-[#020617] border-2 border-green-500 shadow-[2px_2px_0px_0px_#22C55E] space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-green-400 font-black uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {res.status}
                    </span>
                    <span className="text-yellow-400 font-bold">Latency: {res.execution_time_ms} ms</span>
                  </div>
                  <p className="text-slate-200 text-[11px]">{res.live_result_summary}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
