"use client";

import { useState } from "react";
import { Briefcase, Building2, Plus, X, CheckCircle2 } from "lucide-react";

interface AppCard {
  company: string;
  role: string;
  match: string;
  resume: string;
  date: string;
}

export default function ApplicationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newMatch, setNewMatch] = useState("95%");
  const [newColumn, setNewColumn] = useState("APPLIED");

  const [columns, setColumns] = useState([
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
  ]);

  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newRole) return;

    const newCard: AppCard = {
      company: newCompany,
      role: newRole,
      match: newMatch,
      resume: "v3.2",
      date: "Just now"
    };

    setColumns((prev) =>
      prev.map((col) =>
        col.name === newColumn ? { ...col, cards: [newCard, ...col.cards] } : col
      )
    );

    setNewCompany("");
    setNewRole("");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b-4 border-slate-800 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider font-mono flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-blue-400" /> Application Kanban Board
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Track job applications with real-time AI Match Scores and resume version provenance.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2 px-4 brutal-btn brutal-btn-yellow text-xs flex items-center gap-2 font-mono"
        >
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

      {/* Add Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#0F172A] border-4 border-yellow-400 shadow-[8px_8px_0px_0px_#FACC15] p-6 max-w-md w-full space-y-4 font-mono">
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
              <h3 className="text-sm font-black text-slate-100 uppercase flex items-center gap-2">
                <Plus className="w-4 h-4 text-yellow-400" /> Track New Job Application
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddApplication} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anthropic, OpenAI, Stripe"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full bg-[#020617] border-2 border-slate-700 p-2.5 text-xs text-slate-100 focus:border-yellow-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior AI Systems Engineer"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-[#020617] border-2 border-slate-700 p-2.5 text-xs text-slate-100 focus:border-yellow-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">AI Match Score</label>
                  <input
                    type="text"
                    value={newMatch}
                    onChange={(e) => setNewMatch(e.target.value)}
                    className="w-full bg-[#020617] border-2 border-slate-700 p-2 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Stage Column</label>
                  <select
                    value={newColumn}
                    onChange={(e) => setNewColumn(e.target.value)}
                    className="w-full bg-[#020617] border-2 border-slate-700 p-2 text-xs text-slate-100 focus:border-yellow-400 focus:outline-none"
                  >
                    <option value="APPLIED">APPLIED</option>
                    <option value="ONLINE TEST (OA)">ONLINE TEST (OA)</option>
                    <option value="INTERVIEWING">INTERVIEWING</option>
                    <option value="OFFER">OFFER</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full py-3 brutal-btn brutal-btn-yellow text-xs flex items-center justify-center gap-2 mt-4">
                <CheckCircle2 className="w-4 h-4" /> SAVE TO COCKROACHDB STATE
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
