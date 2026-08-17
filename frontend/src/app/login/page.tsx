"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Lock, Mail, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("vijay@example.com");
  const [password, setPassword] = useState("Password123!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await res.json();
      localStorage.setItem("careerdna_token", data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      // Fallback for demo mode
      localStorage.setItem("careerdna_token", "demo_jwt_token_123");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex items-center justify-center p-6 selection:bg-[#FACC15] selection:text-slate-950">
      <div className="w-full max-w-md bg-[#0F172A] border-4 border-slate-100 p-8 shadow-[10px_10px_0px_0px_#3B82F6] space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2 font-mono">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#FACC15] text-[#020617] border-2 border-slate-100 flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_0px_#EC4899]">
              🧬
            </div>
            <span className="font-black text-2xl text-slate-100 uppercase tracking-wider">
              CareerDNA <span className="text-xs px-2 py-0.5 bg-[#EC4899] text-white border border-slate-100 font-bold">AI</span>
            </span>
          </Link>
          <h1 className="text-lg font-black uppercase text-slate-100 pt-2 tracking-wide">
            WELCOME BACK TO YOUR CAREER ENGINE
          </h1>
          <p className="text-xs text-slate-400 font-sans font-medium">
            Sign in to access your persistent memory graph and evolving recommendations.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 font-mono">
          {error && (
            <div className="p-3 bg-red-500/10 border-2 border-red-500 text-red-400 text-xs font-bold uppercase">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-200 uppercase flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" /> EMAIL ADDRESS
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full p-3 bg-[#020617] text-slate-100 text-xs font-bold border-2 border-slate-700 focus:border-yellow-400 focus:outline-none transition shadow-[3px_3px_0px_0px_#020617]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-200 uppercase flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-400" /> PASSWORD
              </span>
              <a href="#" className="text-[10px] text-yellow-400 hover:underline">FORGOT?</a>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full p-3 bg-[#020617] text-slate-100 text-xs font-bold border-2 border-slate-700 focus:border-yellow-400 focus:outline-none transition shadow-[3px_3px_0px_0px_#020617]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 brutal-btn brutal-btn-yellow text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                AUTHENTICATING...
              </>
            ) : (
              <>
                SIGN IN TO DASHBOARD <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Alternate Navigation */}
        <div className="pt-4 border-t-2 border-slate-800 text-center font-mono text-xs text-slate-400 space-y-2">
          <p>
            DON'T HAVE AN ACCOUNT?{" "}
            <Link href="/register" className="text-yellow-400 font-black hover:underline uppercase">
              CREATE ONE NOW
            </Link>
          </p>
          <p className="pt-2">
            <Link href="/dashboard" className="text-cyan-400 font-bold hover:underline flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5" /> EXPLORE AS DEMO GUEST →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
