"use client";

import { Bell } from "lucide-react";

export default function NotificationsPage() {
  const notifs = [
    { title: "Career DNA Evolved Today (+3 Points)", desc: "AI analyzed mock interview feedback and updated vector recommendations.", time: "1 HOUR AGO", unread: true, border: "border-yellow-400 shadow-[4px_4px_0px_0px_#FACC15]" },
    { title: "Weekly Reflection Scheduled", desc: "Share what you built this week to keep memory fresh.", time: "YESTERDAY", unread: false, border: "border-slate-700 shadow-[2px_2px_0px_0px_#020617]" },
    { title: "AWS Certificate Verified", desc: "Added to persistent memory table career_memories.", time: "3 DAYS AGO", unread: false, border: "border-slate-700 shadow-[2px_2px_0px_0px_#020617]" },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans">
      <div className="flex items-center justify-between border-b-4 border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider font-mono flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-blue-400" /> Notifications & Agent Alerts
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Proactive alerts triggered by memory shifts, skill updates, and reflection prompts.
          </p>
        </div>
      </div>

      <div className="space-y-4 font-mono">
        {notifs.map((item, idx) => (
          <div
            key={idx}
            className={`p-5 bg-[#0F172A] border-4 ${item.border} flex items-start justify-between gap-4`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {item.unread && <span className="w-3 h-3 bg-[#EC4899] border border-white"></span>}
                <h3 className="text-xs font-black text-slate-100 uppercase">{item.title}</h3>
              </div>
              <p className="text-xs text-slate-300 font-sans font-medium">{item.desc}</p>
            </div>
            <span className="text-[10px] text-yellow-400 font-bold whitespace-nowrap">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
