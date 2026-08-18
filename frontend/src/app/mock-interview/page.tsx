"use client";

import { useState, useEffect } from "react";
import {
  Mic,
  Sparkles,
  Target,
  Award,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  Database,
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen
} from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";

export default function MockInterviewPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [activeQuestion, setActiveQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [targetCompany, setTargetCompany] = useState("Google");
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);

  useEffect(() => {
    apiGet("/api/v1/interviews/practice-topics")
      .then((data) => {
        if (data?.topics?.length) {
          setTopics(data.topics);
          setSelectedTopic(data.topics[0]);
          setActiveQuestion(data.topics[0].sample_questions[0]);
        }
      })
      .catch(() => {});
  }, []);

  const handleSelectTopic = (t: any) => {
    setSelectedTopic(t);
    setActiveQuestion(t.sample_questions[0]);
    setEvaluation(null);
  };

  const handleNextQuestion = () => {
    if (!selectedTopic?.sample_questions) return;
    const questions = selectedTopic.sample_questions;
    const nextIdx = (questions.indexOf(activeQuestion) + 1) % questions.length;
    setActiveQuestion(questions[nextIdx]);
    setEvaluation(null);
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || evaluating) return;
    setEvaluating(true);
    try {
      const res = await apiPost("/api/v1/interviews/evaluate", {
        category: selectedTopic?.name || "Distributed Systems & CockroachDB",
        question: activeQuestion,
        user_answer: userAnswer,
        target_company: targetCompany,
      });
      setEvaluation(res);
    } catch (err) {
      console.error("Evaluation error:", err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-slate-800 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider font-mono flex items-center gap-2.5">
            <Mic className="w-7 h-7 text-pink-400" /> Live AI Mock Interview Practice Room
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Simulate real-time FAANG rounds. Evaluated answers automatically commit to CockroachDB memory with 1024d HNSW embeddings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-3 py-1 bg-[#A855F7] text-white border-2 border-slate-100 font-mono font-black uppercase shadow-[3px_3px_0px_0px_#EC4899]">
            PERSISTENT VECTOR INGESTION ACTIVE
          </span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {topics.map((t, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectTopic(t)}
            className={`p-4 text-left border-4 transition-all font-mono ${
              selectedTopic?.category_id === t.category_id
                ? "bg-[#0F172A] border-slate-100 shadow-[4px_4px_0px_0px_#FACC15] -translate-y-1"
                : "bg-[#020617] border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-[8px] font-black px-1.5 py-0.5 border uppercase ${
                t.difficulty === "HARD" ? "bg-red-500 text-white border-red-400" : "bg-blue-500 text-white border-blue-400"
              }`}>
                {t.difficulty}
              </span>
              <span className="text-[10px] text-slate-500 font-bold">{t.question_count} Qs</span>
            </div>
            <h3 className="text-xs font-black text-slate-100 uppercase tracking-tight">{t.name}</h3>
          </button>
        ))}
      </div>

      {/* Main Practice Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Question & Answer Editor */}
        <div className="lg:col-span-7 bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#3B82F6] space-y-6 font-mono">
          {/* Target Company & Question Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Targeting:</span>
              <select
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                className="bg-[#020617] border border-slate-700 text-yellow-400 text-xs font-black px-2 py-1 uppercase focus:outline-none"
              >
                <option value="Google">Google (L6 Systems)</option>
                <option value="AWS">AWS (Bedrock & Core)</option>
                <option value="Meta">Meta (Distributed Infra)</option>
                <option value="Cockroach Labs">Cockroach Labs (Core DB)</option>
              </select>
            </div>
            <button
              onClick={handleNextQuestion}
              className="text-[10px] text-slate-300 hover:text-white font-bold uppercase flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-yellow-400" /> Next Question
            </button>
          </div>

          {/* Active Question Box */}
          <div className="p-5 bg-[#020617] border-2 border-yellow-400 shadow-[3px_3px_0px_0px_#FACC15] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-yellow-400 uppercase tracking-widest flex items-center gap-1">
                <Target className="w-3.5 h-3.5" /> Technical Interview Question
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase">Topic: {selectedTopic?.name}</span>
            </div>
            <p className="text-sm font-black text-slate-50 uppercase leading-relaxed">
              "{activeQuestion || 'Explain how CockroachDB achieves distributed ACID transactions.'}"
            </p>
          </div>

          {/* User Answer Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400">
              <span>Your Technical Solution</span>
              <span>{userAnswer.length} chars (min 50)</span>
            </div>
            <textarea
              rows={8}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Structure your answer with architectural components, protocols (e.g. Raft, HLC, HNSW), trade-offs, and failure recovery mechanics..."
              className="w-full bg-[#020617] border-2 border-slate-700 text-slate-100 p-4 text-xs font-mono focus:border-[#3B82F6] focus:outline-none placeholder:text-slate-600 leading-relaxed"
            />
          </div>

          <button
            onClick={handleSubmitAnswer}
            disabled={evaluating || userAnswer.length < 10}
            className={`w-full py-3.5 font-black text-xs uppercase tracking-wider border-2 border-slate-100 flex items-center justify-center gap-2 transition shadow-[4px_4px_0px_0px_#EC4899] ${
              evaluating || userAnswer.length < 10
                ? "bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700 shadow-none"
                : "bg-[#EC4899] hover:bg-pink-600 text-white active:translate-x-0.5 active:translate-y-0.5"
            }`}
          >
            <Send className={`w-4 h-4 ${evaluating ? "animate-pulse" : ""}`} />
            {evaluating ? "Evaluating Answer with AWS Bedrock..." : "Grade Answer & Commit to CockroachDB"}
          </button>
        </div>

        {/* Live Evaluation & Memory Feedback */}
        <div className="lg:col-span-5 bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#FACC15] space-y-6 font-mono">
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
            <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" /> AI Evaluation & Vector Memory
            </h3>
            {evaluation && (
              <span className={`text-[9px] font-black px-2 py-0.5 border uppercase ${
                evaluation.result === "EXCELLENT" ? "bg-green-500 text-slate-950" : "bg-blue-500 text-white"
              }`}>
                {evaluation.result}
              </span>
            )}
          </div>

          {evaluation ? (
            <div className="space-y-5">
              {/* Score Counter */}
              <div className="p-4 bg-[#020617] border-2 border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 font-black uppercase">Overall Score</span>
                  <p className="text-3xl font-black text-yellow-400 font-mono">{evaluation.score} / 100</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-green-400 font-black uppercase">Career DNA Lift</span>
                  <p className="text-xl font-black text-green-400 font-mono">+{evaluation.dna_score_delta} pts</p>
                </div>
              </div>

              {/* Strengths */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-green-400 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Demonstrated Strengths
                </span>
                <div className="space-y-1.5">
                  {evaluation.strengths.map((s: string, idx: number) => (
                    <div key={idx} className="p-2.5 bg-[#020617] border-l-4 border-green-500 text-[11px] text-slate-200">
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Points */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-yellow-400 uppercase flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-yellow-400" /> Blind Spots & Missing Points
                </span>
                <div className="space-y-1.5">
                  {evaluation.missing_technical_points.map((m: string, idx: number) => (
                    <div key={idx} className="p-2.5 bg-[#020617] border-l-4 border-yellow-500 text-[11px] text-slate-300">
                      {m}
                    </div>
                  ))}
                </div>
              </div>

              {/* Vector Memory Ingestion Badge */}
              <div className="p-4 bg-[#0A0F1D] border-2 border-[#A855F7] shadow-[2px_2px_0px_0px_#A855F7] space-y-1.5">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-400" />
                  <span className="text-[9px] font-black text-purple-300 uppercase">Persistent Memory Ingested</span>
                </div>
                <p className="text-[10px] text-slate-300 font-medium">{evaluation.hnsw_embedding_status}</p>
                <p className="text-[9px] text-slate-500 font-mono">Node ID: {evaluation.memory_node_id}</p>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 bg-[#020617] border-2 border-slate-700 mx-auto flex items-center justify-center text-slate-500 shadow-[3px_3px_0px_0px_#3B82F6]">
                <Mic className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-xs font-black text-slate-300 uppercase">Ready for your answer</p>
              <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                Type your technical solution and click Grade Answer to receive instant feedback and commit to your CockroachDB Career Memory.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
