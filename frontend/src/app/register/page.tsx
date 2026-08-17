"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Lock, Mail, User, Target, Sparkles, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("Vijay Kumar");
  const [email, setEmail] = useState("vijay@example.com");
  const [targetRole, setTargetRole] = useState("Senior AI Engineer");
  const [password, setPassword] = useState("Password123!");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          target_role: targetRole,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("careerdna_token", data.access_token);
      } else {
        localStorage.setItem("careerdna_token", "demo_jwt_token_123");
      }
      router.push("/dashboard");
    } catch (err) {
      localStorage.setItem("careerdna_token", "demo_jwt_token_123");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex items-center justify-center p-6 selection:bg-[#FACC15] selection:text-slate-950">
      <div className="w-full max-w-md bg-[#0F172A] border-4 border-slate-100 p-8 shadow-[10px_10px_0px_0px_#A855F7] space-y-6 font-mono">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#A855F7] text-white border-2 border-slate-100 flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_0px_#FACC15]">
              🧬
            </div>
            <span className="font-black text-2xl text-slate-100 uppercase tracking-wider">
              CareerDNA <span className="text-xs px-2 py-0.5 bg-[#FACC15] text-slate-950 border border-slate-950 font-bold">AI</span>
            </span>
          </Link>
          <h1 className="text-lg font-black uppercase text-slate-100 pt-2 tracking-wide">
            CREATE YOUR LIFELONG CAREER DNA PROFILE
          </h1>
          <p className="text-xs text-slate-400 font-sans font-medium">
            Initialize your persistent memory table and state graph.
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-200 uppercase flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-yellow-400" /> FULL NAME
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Vijay Kumar"
              className="w-full p-2.5 bg-[#020617] text-slate-100 text-xs font-bold border-2 border-slate-700 focus:border-yellow-400 focus:outline-none transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-200 uppercase flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" /> EMAIL ADDRESS
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full p-2.5 bg-[#020617] text-slate-100 text-xs font-bold border-2 border-slate-700 focus:border-yellow-400 focus:outline-none transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-200 uppercase flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-green-400" /> TARGET CAREER ROLE
            </label>
            <input
              type="text"
              required
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Senior AI Engineer"
              className="w-full p-2.5 bg-[#020617] text-slate-100 text-xs font-bold border-2 border-slate-700 focus:border-yellow-400 focus:outline-none transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-200 uppercase flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-purple-400" /> PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full p-2.5 bg-[#020617] text-slate-100 text-xs font-bold border-2 border-slate-700 focus:border-yellow-400 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 brutal-btn brutal-btn-yellow text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                INITIALIZING STATE GRAPH...
              </>
            ) : (
              <>
                INITIALIZE CAREER DNA <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-3 border-t-2 border-slate-800 text-center font-mono text-xs text-slate-400">
          ALREADY HAVE AN ACCOUNT?{" "}
          <Link href="/login" className="text-yellow-400 font-black hover:underline uppercase">
            LOG IN HERE
          </Link>
        </div>
      </div>
    </div>
  );
}
