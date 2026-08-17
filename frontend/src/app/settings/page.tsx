"use client";

import { Settings, Database, Key, Trash2, Download } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b-4 border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider font-mono flex items-center gap-2.5">
            <Settings className="w-7 h-7 text-slate-400" /> Account Settings & Memory Controls
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Manage authentication secrets, connected accounts, CockroachDB memory persistence, and privacy.
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6 font-mono">
        {/* Connected Accounts */}
        <div className="bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#3B82F6] space-y-4">
          <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4 text-blue-400" /> Connected Accounts & Integrations
          </h3>

          <div className="space-y-3">
            {[
              { name: "GitHub Account", status: "CONNECTED (omkhandare55)", color: "text-green-400" },
              { name: "AWS Cognito Identity", status: "VERIFIED (AWS Bedrock Enabled)", color: "text-green-400" },
              { name: "LinkedIn Profile", status: "NOT CONNECTED", color: "text-slate-400" }
            ].map((acc, i) => (
              <div key={i} className="p-4 bg-[#020617] border-2 border-slate-700 flex items-center justify-between">
                <span className="text-xs font-black text-slate-200 uppercase">{acc.name}</span>
                <span className={`text-xs font-bold ${acc.color}`}>{acc.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Memory Management */}
        <div className="bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#FACC15] space-y-4">
          <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" /> CockroachDB Memory Controls
          </h3>

          <div className="flex flex-wrap items-center gap-4">
            <button className="py-2.5 px-4 brutal-btn brutal-btn-yellow text-xs flex items-center gap-2">
              <Download className="w-4 h-4" /> EXPORT CAREERDNA MEMORY (JSON)
            </button>
            <button className="py-2.5 px-4 bg-[#020617] border-2 border-red-500 hover:border-red-400 text-red-400 text-xs font-black uppercase flex items-center gap-2 shadow-[2px_2px_0px_0px_#020617]">
              <Trash2 className="w-4 h-4" /> RESET CAREER MEMORY GRAPH
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
