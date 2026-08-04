"use client";

import { Briefcase, Building2, Plus, Sparkles, CheckCircle2 } from "lucide-react";

export default function ApplicationsPage() {
  const columns = [
    {
      name: "Applied",
      color: "border-blue-500/30 bg-blue-500/5",
      cards: [
        { company: "Stripe", role: "Software Engineer", match: "94%", resume: "v3.2", date: "Applied 2d ago" },
        { company: "Vercel", role: "Frontend Platform Engineer", match: "91%", resume: "v3.2", date: "Applied 4d ago" }
      ]
    },
    {
      name: "Online Test (OA)",
      color: "border-purple-500/30 bg-purple-500/5",
      cards: [
        { company: "Adobe", role: "Backend Developer", match: "88%", resume: "v3.1", date: "Due in 3 days" }
      ]
    },
    {
      name: "Interviewing",
      color: "border-amber-500/30 bg-amber-500/5",
      cards: [
        { company: "Google", role: "Senior AI Engineer", match: "96%", resume: "v3.2", date: "Round 2 tomorrow" },
        { company: "Amazon", role: "SDE II - AWS Bedrock", match: "92%", resume: "v3.2", date: "System Design next week" }
      ]
    },
    {
      name: "Offer",
      color: "border-green-500/30 bg-green-500/5",
      cards: [
        { company: "TechCorp AI", role: "AI Systems Engineer", match: "98%", resume: "v3.2", date: "Offer Received ($165k)" }
      ]
    },
    {
      name: "Rejected",
      color: "border-slate-800 bg-slate-900/40",
      cards: [
        { company: "Meta", role: "Production Engineer", match: "82%", resume: "v2.8", date: "Feedback logged" }
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-blue-400" /> Application Kanban Board
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track job applications with real-time AI Match Scores and resume version provenance.
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Application
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto">
        {columns.map((col, idx) => (
          <div key={idx} className={`p-4 rounded-2xl border ${col.color} space-y-4 min-w-[220px]`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{col.name}</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0F172A] text-slate-400 border border-[#1E293B]">
                {col.cards.length}
              </span>
            </div>

            <div className="space-y-3">
              {col.cards.map((card, cIdx) => (
                <div key={cIdx} className="glass-panel p-4 rounded-xl border border-[#1E293B] space-y-2 hover:border-slate-700 transition cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-400" /> {card.company}
                    </span>
                    <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                      {card.match} Match
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-medium">{card.role}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-[#1E293B]">
                    <span>Resume: {card.resume}</span>
                    <span className="text-slate-400 font-medium">{card.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
