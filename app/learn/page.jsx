'use client';

import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  Zap,
  Shield,
  BarChart3,
  Cpu,
  Rocket,
  LineChart,
  Activity,
  Gauge
} from "lucide-react";

export default function LearnMore() {
  return (
    <div className="min-h-screen bg-[#0B0710] text-purple-100 overflow-hidden">

      {/* ================= HERO SECTION ================ */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">

        {/* BACKGROUND */}
        <div className="absolute inset-0 z-0">

          {/* Soft matte gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#140A1F]/60 to-[#0A0710]/80 z-10"></div>

          {/* Subtle noise texture */}
          <div
            className="absolute inset-0 opacity-[0.045] mix-blend-soft-light z-10"
            style={{ backgroundImage: "url(/noise.png)" }}
          />

          {/* Softened grid */}
          <svg className="absolute w-full h-full opacity-[0.07]" viewBox="0 0 1200 600">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path
                  d="M 60 0 L 0 0 0 60"
                  stroke="rgba(200,160,255,0.10)"
                  strokeWidth="1"
                  fill="none"
                />
              </pattern>
            </defs>
            <rect width="1200" height="600" fill="url(#grid)" />
          </svg>

          {/* ANIMATED LINE (unchanged animation, softer color) */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.25]" viewBox="0 0 1200 600">
            <path
              d="M0 420 L150 350 L300 260 L450 310 L600 180 L750 290 L900 210 L1050 120 L1200 180"
              stroke="rgba(200,160,255,0.28)"
              strokeWidth="3"
              fill="none"
              className="chart-line"
            />
            <style>{`
              .chart-line {
                stroke-dasharray: 2000;
                stroke-dashoffset: 2000;
                animation: drawLine 2.4s ease-out forwards;
              }
              @keyframes drawLine {
                to { stroke-dashoffset: 0; }
              }
            `}</style>
          </svg>

          {/* CANDLES (animations kept, brightness lowered) */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.18]" viewBox="0 0 1200 600">
            {[...Array(12)].map((_, i) => {
              const x = 70 + i * 90;
              const h = 50 + (i % 5) * 22;
              return (
                <g
                  key={i}
                  style={{
                    animation: `fadeIn 0.7s ease-out ${i * 0.18}s forwards`,
                    opacity: 0
                  }}
                >
                  <line
                    x1={x}
                    y1={300 - h}
                    x2={x}
                    y2={300 + h}
                    stroke="rgba(200,160,255,0.22)"
                    strokeWidth="2"
                  />
                  <rect
                    x={x - 10}
                    y={300 - h / 2}
                    width="20"
                    height={h}
                    fill="rgba(200,160,255,0.12)"
                    rx="3"
                  />
                </g>
              );
            })}
            <style>{`
              @keyframes fadeIn {
                0% { opacity: 0; transform: translateY(10px); }
                100% { opacity: 1; transform: translateY(0); }
              }
            `}</style>
          </svg>
        </div>

        {/* HERO CONTENT */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center">
          <div className="mb-6 inline-block">
            <span className="bg-purple-800/15 border border-purple-600/20 rounded-full px-4 py-2 text-xs font-medium text-purple-200 flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              Cryphos Market Intelligence
            </span>
          </div>

          <h1 className="text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            A New Standard in
            <span className="block bg-gradient-to-r from-purple-200 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Technical Analysis & Backtesting
            </span>
          </h1>

          <p className="text-xl text-purple-200/70 max-w-2xl mx-auto mb-8">
            Explore markets with clarity and precision. Cryphos delivers next-gen tools for structure detection,
            volatility mapping, and strategy validation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group px-8 py-4 bg-purple-200 text-black rounded-lg font-semibold hover:bg-purple-100 transition-all inline-flex items-center gap-2">
              Start Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 border border-purple-300/20 text-purple-200 rounded-lg font-semibold hover:border-purple-300/40 hover:bg-purple-900/20 transition-all">
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* ================= FEATURES ================= */}
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-white mb-6">Tools Built for Modern Analysts</h2>
          <p className="text-xl text-purple-200/70 max-w-2xl mx-auto">
            A unified toolkit for traders, quant researchers, and data-driven investors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: LineChart,
              title: "Advanced Indicators",
              description: "RSI, ATR, MACD, Bollinger Bands and more — engineered with precision.",
              color: "from-[#2A173A]/15 to-[#110A18]/15"
            },
            {
              icon: BarChart3,
              title: "Backtesting Engine",
              description: "Replay and validate strategies using verified historical datasets.",
              color: "from-[#3A1741]/15 to-[#110A18]/15"
            },
            {
              icon: Activity,
              title: "Real-Time Data",
              description: "Low-latency streams for stocks, ETFs and crypto assets.",
              color: "from-[#381531]/15 to-[#110A18]/15"
            },
            {
              icon: Gauge,
              title: "RSI & ATR Deep-Dive",
              description: "Momentum, volatility bursts, and adaptive signal generation.",
              color: "from-[#2E1C46]/15 to-[#110A18]/15"
            },
            {
              icon: TrendingUp,
              title: "Multi-Asset Support",
              description: "Analyze stocks, funds, and crypto in a single workspace.",
              color: "from-[#241437]/15 to-[#110A18]/15"
            },
            {
              icon: Zap,
              title: "High-Speed Engine",
              description: "Optimized for rapid computations and instant visual feedback.",
              color: "from-[#3A1635]/15 to-[#110A18]/15"
            }
          ].map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="group relative">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${f.color} rounded-xl blur-xl opacity-0 group-hover:opacity-70 transition-all duration-300`}
                ></div>

                <div className="relative p-8 border border-purple-400/10 rounded-xl bg-[#1A1124]/40 backdrop-blur-sm group-hover:border-purple-300/20 transition-all">
                  <div className="mb-4 p-3 w-fit rounded-lg bg-purple-700/15 group-hover:bg-purple-700/25">
                    <Icon className="w-6 h-6 text-purple-200" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{f.title}</h3>
                  <p className="text-purple-200/70 text-sm">{f.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= HOW IT WORKS ================= */}
      <div className="relative max-w-7xl mx-auto px-6 py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1124]/40 to-transparent rounded-3xl"></div>

        <div className="relative">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">Your Workflow. Simplified.</h2>
            <p className="text-xl text-purple-200/70 max-w-2xl mx-auto">
              Everything you need — from asset selection to full strategy validation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Select Your Asset",
                description: "Choose stocks, ETFs, funds, or crypto with instant data loading."
              },
              {
                step: 2,
                title: "Analyze Indicators",
                description: "Use RSI, ATR, MACD and trend tools to understand market structure."
              },
              {
                step: 3,
                title: "Run Backtests",
                description: "Validate your strategies with structured historical datasets."
              }
            ].map((item, idx) => (
              <div key={idx} className="relative group animate-slideUp">
                <style>{`
                  @keyframes slideUp {
                    0% { opacity: 0; transform: translateY(25px); }
                    100% { opacity: 1; transform: translateY(0); }
                  }
                `}</style>

                <div className="border border-purple-400/10 rounded-xl p-8 bg-[#1A1124]/40 backdrop-blur-sm group-hover:border-purple-300/20 transition-all">
                  <div className="w-12 h-12 rounded-full bg-purple-700/15 flex items-center justify-center mb-6 text-xl text-purple-200 font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-purple-200/70 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= INDICATORS SECTION ================= */}
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-white mb-6">Core Indicators</h2>
          <p className="text-xl text-purple-200/70 max-w-2xl mx-auto">
            Momentum, volatility, trend, and range — all measured with precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              name: "RSI (Relative Strength Index)",
              description: "Momentum tracking, reversal detection, and divergence analysis.",
              metrics: ["14-period default", "Momentum signals", "Divergence mapping"]
            },
            {
              name: "ATR (Average True Range)",
              description: "Volatility profiling for adaptive stop-loss and movement dynamics.",
              metrics: ["Volatility measure", "Dynamic SL/TP", "Risk scaling"]
            },
            {
              name: "MACD & MA Signals",
              description: "Trend following and momentum confirmation using price averages.",
              metrics: ["Crossover logic", "Trend confirmation", "Momentum flow"]
            },
            {
              name: "Bollinger Bands",
              description: "Range tightening, expansion bursts, and breakout forecasting.",
              metrics: ["Range mapping", "Breakout zones", "Volatility squeeze"]
            }
          ].map((ind, idx) => (
            <div
              key={idx}
              className="border border-purple-400/10 rounded-xl p-8 bg-[#1A1124]/40 backdrop-blur-sm hover:border-purple-300/20 transition-all"
            >
              <h3 className="text-xl font-semibold text-white mb-3">{ind.name}</h3>
              <p className="text-purple-200/70 text-sm mb-4">{ind.description}</p>

              <div className="flex flex-wrap gap-2">
                {ind.metrics.map((m, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-full bg-purple-700/15 text-purple-200"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { value: "Scalable", label: "Handles heavy analytical workloads" },
            { value: "Optimized", label: "Fast, efficient backtesting engine" },
            { value: "50+ Tools", label: "Full suite of indicators" },
            { value: "Real-Time", label: "Continuously updated data streams" }
          ].map((s, idx) => (
            <div
              key={idx}
              className="text-center p-8 border border-purple-400/10 rounded-xl bg-[#1A1124]/40 hover:bg-[#1A1124]/60 transition-all"
            >
              <div className="text-2xl font-bold text-purple-200 mb-2">{s.value}</div>
              <p className="text-purple-200/60 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= CTA ================= */}
      <div className="max-w-4xl mx-auto px-6 mb-32">
        <div className="relative overflow-hidden rounded-2xl border border-purple-400/10 bg-gradient-to-br from-[#1A1124]/60 to-[#120A1A]/60 backdrop-blur-sm p-12 md:p-20 text-center">
          <div className="absolute inset-0 opacity-[0.15]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#2A1740]/20 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trade With Certainty.
              <span className="block bg-gradient-to-r from-purple-200 to-pink-300 bg-clip-text text-transparent">
                Not Assumptions.
              </span>
            </h2>

            <p className="text-lg text-purple-200/70 mb-8 max-w-2xl mx-auto">
              Start your 7-day free trial and unlock advanced charts, strategy validation, and real-time insights.
            </p>

            <button className="group px-10 py-4 bg-purple-200 text-black rounded-lg font-semibold hover:bg-purple-100 transition-all inline-flex items-center gap-2">
              Begin Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
