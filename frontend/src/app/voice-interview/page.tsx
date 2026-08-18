"use client";

import { useState, useEffect } from "react";
import {
  Radio,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Zap,
  RotateCcw,
  ShieldCheck,
  Play
} from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";

const SAMPLE_TRANSCRIPTS: Record<string, string> = {
  sc_01:
    "In CockroachDB, Raft consensus ensures distributed transaction serializability across regions. Leaseholders handle reads directly without cross-region roundtrips when using follower reads. For write operations, the Raft leader in us-east-1 coordinates quorum across eu-west-1 and ap-southeast-1, ensuring zero data loss and serializable isolation even under node partition.",
  sc_02:
    "When comparing HNSW to IVF-PQ for vector retrieval, HNSW builds multi-layer proximity graphs offering sub-40ms recall without requiring offline centroid training. Although HNSW consumes more RAM for graph edges, its cosine similarity retrieval throughput on CockroachDB vector indexes scales seamlessly across multi-node clusters.",
  sc_03:
    "Within our LangGraph agent architecture, every state transition is saved as a checkpoint in CockroachDB. If a downstream tool invocation encounters backpressure, the state machine rolls back to the prior checkpoint. We integrate Ebbinghaus retention decay formulas into memory recall weights to ensure relevant past interactions remain prioritized."
};

export default function VoiceInterviewPage() {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    apiGet("/api/v1/voice/scenarios")
      .then((data) => {
        if (data?.scenarios?.length) {
          setScenarios(data.scenarios);
          setSelectedScenario(data.scenarios[0]);
          setTranscript(SAMPLE_TRANSCRIPTS[data.scenarios[0].scenario_id] || "");
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => setSecondsElapsed((s) => s + 1), 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleSelectScenario = (sc: any) => {
    setSelectedScenario(sc);
    setEvaluation(null);
    setSecondsElapsed(0);
    setIsRecording(false);
    setTranscript(SAMPLE_TRANSCRIPTS[sc.scenario_id] || "");
  };

  const handleSpeakQuestion = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window && selectedScenario) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(selectedScenario.question_audio_text);
      utter.rate = 1.0;
      utter.pitch = 1.0;
      window.speechSynthesis.speak(utter);
    }
  };

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setSecondsElapsed(0);
    } else {
      setIsRecording(false);
    }
  };

  const handleEvaluate = async () => {
    if (!transcript.trim() || evaluating) return;
    setEvaluating(true);
    try {
      const res = await apiPost("/api/v1/voice/evaluate-transcript", {
        scenario_id: selectedScenario?.scenario_id || "sc_01",
        transcript: transcript,
        duration_seconds: Math.max(25, secondsElapsed || 45),
      });
      setEvaluation(res);
    } catch (err) {
      console.error("Voice evaluation error:", err);
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
            <Radio className="w-7 h-7 text-pink-400" /> Live Audio Voice Interview AI Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            FAANG audio simulations. Evaluates vocal pace (WPM), speech filler density, and technical clarity with automated CockroachDB vector storage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-3 py-1 bg-[#EC4899] text-white border-2 border-slate-100 font-mono font-black uppercase shadow-[3px_3px_0px_0px_#FACC15]">
            SPEECH SYNTHESIS & WAV ENGINE ONLINE
          </span>
        </div>
      </div>

      {/* Scenario Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
        {scenarios.map((sc) => {
          const isSel = selectedScenario?.scenario_id === sc.scenario_id;
          return (
            <button
              key={sc.scenario_id}
              onClick={() => handleSelectScenario(sc)}
              className={`p-4 text-left border-4 transition ${
                isSel
                  ? "bg-[#0F172A] border-pink-500 shadow-[4px_4px_0px_0px_#EC4899]"
                  : "bg-[#0A0F1D] border-slate-800 hover:border-slate-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-pink-400 border border-pink-500 font-bold uppercase">
                  {sc.company_context.split("/")[0]}
                </span>
                <span className="text-[9px] text-slate-400">{sc.time_limit_sec}s LIMIT</span>
              </div>
              <h4 className="text-xs font-black text-slate-100 uppercase mt-2">{sc.title}</h4>
            </button>
          );
        })}
      </div>

      {/* Main Studio Arena */}
      {selectedScenario && (
        <div className="bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[6px_6px_0px_0px_#3B82F6] space-y-6 font-mono">
          {/* Question Audio Bar */}
          <div className="p-4 bg-[#020617] border-2 border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-yellow-400 font-black uppercase tracking-wider">
                AI Voice Interviewer Question:
              </span>
              <button
                onClick={handleSpeakQuestion}
                className="text-[10px] px-3 py-1 bg-[#3B82F6] hover:bg-blue-600 text-white font-bold uppercase flex items-center gap-1.5 border border-slate-100 transition shadow-[2px_2px_0px_0px_#FACC15]"
              >
                <Volume2 className="w-3.5 h-3.5" /> Listen to AI Voice
              </button>
            </div>
            <p className="text-xs font-black text-slate-100 leading-relaxed">
              "{selectedScenario.question_audio_text}"
            </p>
          </div>

          {/* Audio Waveform Simulator */}
          <div className="p-6 bg-[#020617] border-2 border-slate-800 flex flex-col items-center justify-center space-y-4">
            <div className="flex items-end gap-1.5 h-16">
              {[12, 28, 45, 18, 55, 32, 60, 42, 24, 50, 62, 38, 20, 48, 58, 30, 16, 44, 22, 35].map(
                (h, i) => (
                  <div
                    key={i}
                    className={`w-2 transition-all duration-300 ${
                      isRecording
                        ? "bg-pink-500 animate-pulse"
                        : "bg-slate-700"
                    }`}
                    style={{
                      height: isRecording ? `${Math.max(10, (h * (i % 3 + 1)) % 64)}px` : "12px",
                    }}
                  />
                )
              )}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleToggleRecord}
                className={`px-6 py-2.5 font-black text-xs uppercase tracking-wider border-2 border-slate-100 flex items-center gap-2 transition shadow-[3px_3px_0px_0px_#FACC15] ${
                  isRecording
                    ? "bg-red-600 text-white animate-pulse"
                    : "bg-[#EC4899] hover:bg-pink-600 text-white"
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isRecording ? `Recording... (${secondsElapsed}s)` : "Record Microphone"}
              </button>

              <span className="text-[10px] text-slate-400">
                {isRecording ? "Listening to vocal stream..." : "Ready to speak response"}
              </span>
            </div>
          </div>

          {/* Transcript Box */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-300 uppercase flex items-center justify-between">
              <span>Speech-to-Text Transcript (Editable)</span>
              <span className="text-green-400">1024D TITAN VECTOR EMBEDDING</span>
            </label>
            <textarea
              rows={4}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Speak your response or paste practice transcript..."
              className="w-full bg-[#020617] border-2 border-slate-700 text-slate-100 p-3 text-xs font-mono focus:border-pink-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Evaluate Button */}
          <button
            onClick={handleEvaluate}
            disabled={evaluating || !transcript.trim()}
            className="w-full py-3.5 bg-[#3B82F6] hover:bg-blue-600 text-white font-black text-xs uppercase tracking-wider border-2 border-slate-100 shadow-[4px_4px_0px_0px_#FACC15] flex items-center justify-center gap-2 transition active:translate-x-0.5 active:translate-y-0.5"
          >
            <Sparkles className={`w-4 h-4 ${evaluating ? "animate-spin" : ""}`} />
            {evaluating ? "Evaluating Voice Dynamics & Vector Embedding..." : "Submit Voice Round for AI Evaluation"}
          </button>
        </div>
      )}

      {/* Evaluation Results Card */}
      {evaluation && (
        <div className="bg-[#0F172A] p-6 border-4 border-slate-800 shadow-[8px_8px_0px_0px_#22C55E] space-y-6 font-mono">
          {/* Top Score Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b-2 border-slate-800 pb-4">
            <div className="p-3 bg-[#020617] border border-slate-700 text-center">
              <span className="text-[9px] text-slate-400 uppercase font-black">Overall Score</span>
              <p className="text-2xl font-black text-green-400">{evaluation.overall_score}%</p>
            </div>
            <div className="p-3 bg-[#020617] border border-slate-700 text-center">
              <span className="text-[9px] text-slate-400 uppercase font-black">Technical Depth</span>
              <p className="text-2xl font-black text-cyan-400">{evaluation.technical_clarity_score}%</p>
            </div>
            <div className="p-3 bg-[#020617] border border-slate-700 text-center">
              <span className="text-[9px] text-slate-400 uppercase font-black">Pacing (WPM)</span>
              <p className="text-2xl font-black text-yellow-400">{evaluation.pacing_words_per_minute}</p>
            </div>
            <div className="p-3 bg-[#020617] border border-slate-700 text-center">
              <span className="text-[9px] text-slate-400 uppercase font-black">Filler Words</span>
              <p className="text-2xl font-black text-pink-400">{evaluation.filler_word_count}</p>
            </div>
          </div>

          {/* Feedback Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#020617] border border-green-500/50 space-y-2">
              <span className="text-[10px] font-black text-green-400 uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Demonstrated Strengths
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {evaluation.strengths.map((s: string, i: number) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-[#020617] border border-yellow-500/50 space-y-2">
              <span className="text-[10px] font-black text-yellow-400 uppercase flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Vocal Coaching & Refinement
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {evaluation.blindspots.map((b: string, i: number) => (
                  <li key={i}>• {b}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* CockroachDB Vector Badge */}
          <div className="p-3 bg-[#0A0F1D] border border-slate-800 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">CockroachDB Vector Memory Node Committed:</span>
            <span className="text-green-400 font-bold font-mono">
              {evaluation.vector_memory_id.substring(0, 16)}... (1024d)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
