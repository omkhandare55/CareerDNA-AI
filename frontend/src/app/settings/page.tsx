"use client";

import { Settings, ShieldCheck, Database, Key, Trash2, Download } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-slate-400" /> Account Settings & Memory Controls
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage authentication secrets, connected accounts, CockroachDB memory persistence, and privacy.
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Connected Accounts */}
        <div className="glass-panel p-6 rounded-2xl border border-[#1E293B] space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4 text-blue-400" /> Connected Accounts & Integrations
          </h3>

          <div className="space-y-3">
            {[
              { name: "GitHub Account", status: "Connected (omkhandare55)", color: "text-green-400" },
              { name: "AWS Cognito Identity", status: "Verified (AWS Bedrock Enabled)", color: "text-green-400" },
              { name: "LinkedIn Profile", status: "Not Connected", color: "text-slate-400" }
            ].map((acc, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">{acc.name}</span>
                <span className={`text-xs ${acc.color}`}>{acc.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Memory Management */}
        <div className="glass-panel p-6 rounded-2xl border border-[#1E293B] space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" /> CockroachDB Memory Controls
          </h3>

          <div className="flex flex-wrap items-center gap-4">
            <button className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition flex items-center gap-2">
              <Download className="w-4 h-4" /> Export Complete CareerDNA Memory (JSON)
            </button>
            <button className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Reset Career Memory Graph
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
