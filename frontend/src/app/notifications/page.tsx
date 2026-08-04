"use client";

import { Bell, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";

export default function NotificationsPage() {
  const notifs = [
    { title: "Career DNA Evolved Today (+3 Points)", desc: "AI analyzed mock interview feedback and updated vector recommendations.", time: "1 hour ago", unread: true },
    { title: "Weekly Reflection Scheduled", desc: "Share what you built this week to keep memory fresh.", time: "Yesterday", unread: false },
    { title: "AWS Certificate Verified", desc: "Added to persistent memory table career_memories.", time: "3 days ago", unread: false },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-blue-400" /> Notifications & Agent Alerts
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Proactive alerts triggered by memory shifts, skill updates, and reflection prompts.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {notifs.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border transition flex items-start justify-between gap-4 ${
              item.unread ? "glass-panel-glow border-blue-500/30" : "glass-panel border-[#1E293B]"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {item.unread && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                <h3 className="text-xs font-bold text-slate-100">{item.title}</h3>
              </div>
              <p className="text-xs text-slate-400">{item.desc}</p>
            </div>
            <span className="text-[11px] text-slate-500 font-mono whitespace-nowrap">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
