"use client";

import { useState, useEffect } from "react";
import {
  Tv,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  TrendingUp,
  CheckCircle2,
  Database,
  Zap,
  ArrowRight,
  Maximize2
} from "lucide-react";
import { apiGet } from "@/lib/api";

export default function PitchDeckPage() {
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  useEffect(() => {
    apiGet("/api/v1/showcase/pitch-slides")
      .then((data) => {
        if (data?.slides?.length) {
          setSlides(data.slides);
        }
      })
      .catch(() => {});
  }, []);

  const nextSlide = () => {
    if (currentSlideIdx < slides.length - 1) {
      setCurrentSlideIdx(currentSlideIdx + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIdx > 0) {
      setCurrentSlideIdx(currentSlideIdx - 1);
    }
  };

  const slide = slides[currentSlideIdx];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-slate-800 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-50 uppercase tracking-wider font-mono flex items-center gap-2.5">
            <Tv className="w-7 h-7 text-yellow-400" /> Judge & Investor Interactive Pitch Deck
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Executive pitch presentation for hackathon evaluation. Built with live system metrics, CockroachDB vector moat, and financial projections.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-3 py-1 bg-[#FACC15] text-slate-950 border-2 border-slate-100 font-mono font-black uppercase shadow-[3px_3px_0px_0px_#3B82F6]">
            HACKATHON FINALIST PRESENTATION
          </span>
        </div>
      </div>

      {/* Main Slide Card */}
      {slide && (
        <div className="bg-[#0F172A] p-8 border-4 border-slate-800 shadow-[10px_10px_0px_0px_#3B82F6] space-y-8 font-mono min-h-[500px] flex flex-col justify-between relative">
          <div className="space-y-6">
            {/* Top Badge & Slide Indicator */}
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4">
              <span className="text-[11px] px-3 py-1 bg-[#EC4899] text-white border border-slate-100 font-black uppercase tracking-wider">
                {slide.category}
              </span>
              <span className="text-xs text-yellow-400 font-black uppercase">
                SLIDE {slide.slide_number} OF {slides.length}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-50 uppercase tracking-wide">
                {slide.title}
              </h2>
              <p className="text-sm font-bold text-cyan-400">{slide.subtitle}</p>
            </div>

            {/* 3 Key Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {slide.key_metrics.map((metric: string, idx: number) => (
                <div
                  key={idx}
                  className="p-4 bg-[#020617] border-2 border-slate-700 text-center shadow-[3px_3px_0px_0px_#FACC15]"
                >
                  <p className="text-lg font-black text-yellow-400">{metric}</p>
                </div>
              ))}
            </div>

            {/* Bullet Points */}
            <div className="space-y-3 bg-[#0A0F1D] p-6 border-2 border-slate-800">
              {slide.bullet_points.map((pt: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 text-xs text-slate-200 leading-relaxed">
                  <span className="text-green-400 font-black text-sm">▶</span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            {/* Highlight Banner */}
            <div className="p-4 bg-[#020617] border-l-4 border-green-400 text-xs text-green-400 font-bold italic">
              "{slide.quote_or_highlight}"
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t-2 border-slate-800">
            <button
              onClick={prevSlide}
              disabled={currentSlideIdx === 0}
              className={`px-5 py-2.5 text-xs font-black uppercase border-2 border-slate-100 flex items-center gap-2 transition ${
                currentSlideIdx === 0
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700"
                  : "bg-[#0F172A] hover:bg-[#1E293B] text-slate-100 shadow-[3px_3px_0px_0px_#FACC15]"
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Previous Slide
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlideIdx(i)}
                  className={`w-3 h-3 rounded-full transition ${
                    i === currentSlideIdx ? "bg-yellow-400 scale-125" : "bg-slate-700 hover:bg-slate-500"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              disabled={currentSlideIdx === slides.length - 1}
              className={`px-5 py-2.5 text-xs font-black uppercase border-2 border-slate-100 flex items-center gap-2 transition ${
                currentSlideIdx === slides.length - 1
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700"
                  : "bg-[#3B82F6] hover:bg-blue-600 text-white shadow-[3px_3px_0px_0px_#FACC15]"
              }`}
            >
              Next Slide <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
