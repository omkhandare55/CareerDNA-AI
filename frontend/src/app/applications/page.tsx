"use client";

import { Briefcase, Building2, Plus } from "lucide-react";

export default function ApplicationsPage() {
  const columns = [
    {
      name: "APPLIED",
      border: "border-blue-500 shadow-[6px_6px_0px_0px_#3B82F6]",
      cards: [
        { company: "Stripe", role: "Software Engineer", match: "94%", resume: "v3.2", date: "Applied 2d ago" },
        { company: "Vercel", role: "Frontend Platform Engineer", match: "91%", resume: "v3.2", date: "Applied 4d ago" }
      ]
    },
    {
      name: "ONLINE TEST (OA)",
      border: "border-purple-500 shadow-[6px_6px_0px_0px_#A855F7]",
      cards: [
        { company: "Adobe", role: "Backend Developer", match: "88%", resume: "v3.1", date: "Due in 3 days" }
      ]
    },
    {
      name: "INTERVIEWING",
      border: "border-yellow-400 shadow-[6px_6px_0px_0px_#FACC15]",
      cards: [
        { company: "Google", role: "Senior AI Engineer", match: "96%", resume: "v3.2", date: "Round 2 tomorrow" },
        { company: "Amazon", role: "SDE II - AWS Bedrock", match: "92%", resume: "v3.2", date: "System Design next week" }
      ]
    },
    {
      name: "OFFER",
      border: "border-green-500 shadow-[6px_6px_0px_0px_#22C55E]",
      cards: [
        { company: "TechCorp AI", role: "AI Systems Engineer", match: "98%", resume: "v3.2", date: "Offer Received ($165k)" }
      ]
    },
    {
      name: "REJECTED",
      border: "border-slate-700 shadow-[4px_4px_0px_0px_#020617]",
      cards: [
        { company: "Meta", role: "Production Engineer", match: "82%", resume: "v2.8", date: "Feedback logged" }
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b-4 border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider font-mono flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-blue-400" /> Application Kanban Board
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Track job applications with real-time AI Match Scores and resume version provenance.
          </p>
        </div>
        <button className="py-2 px-4 brutal-btn brutal-btn-yellow text-xs flex items-center gap-2 font-mono">
          <Plus className="w-4 h-4" /> ADD APPLICATION
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 overflow-x-auto">
        {columns.map((col, idx) => (
          <div key={idx} className={`bg-[#0F172A] p-4 border-4 ${col.border} space-y-4 min-w-[220px]`}>
            <div className="flex items-center justify-between font-mono">
              <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider">{col.name}</h3>
              <span className="text-[10px] font-black px-2 py-0.5 bg-[#020617] text-yellow-400 border border-slate-700">
                {col.cards.length}
              </span>
            </div>

            <div className="space-y-3">
              {col.cards.map((card, cIdx) => (
                <div key={cIdx} className="bg-[#020617] p-4 border-2 border-slate-700 space-y-2.5 hover:border-slate-400 transition cursor-pointer font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-100 uppercase flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-400" /> {card.company}
                    </span>
                    <span className="text-[9px] font-black text-slate-950 bg-[#FACC15] px-1.5 py-0.5 border border-slate-950 uppercase">
                      {card.match} MATCH
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 font-bold uppercase">{card.role}</p>

                  <div className="flex items-center justify-between text-[9px] text-slate-400 pt-2 border-t border-slate-800">
                    <span>RESUME: {card.resume}</span>
                    <span className="text-yellow-400 font-bold uppercase">{card.date}</span>
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
