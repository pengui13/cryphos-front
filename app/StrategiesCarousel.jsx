"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { TrendingUp, TrendingDown, Activity, Zap, BarChart2, Target } from "lucide-react";

// ─── Mock data ───────────────────────────────────────────────────────────────

const STRATEGIES = [
  {
    user: "alex_trades",
    avatar: "AT",
    avatarColor: "#7c3aed",
    strategy: "RSI Reversal",
    asset: "BTC/USDT",
    timeframe: "4h",
    pnl: +18.4,
    signals: 42,
    winrate: 71,
    isLong: true,
    indicators: ["RSI", "EMA"],
    icon: TrendingUp,
  },
  {
    user: "marina_q",
    avatar: "MQ",
    avatarColor: "#0891b2",
    strategy: "BB Squeeze",
    asset: "ETH/USDT",
    timeframe: "1h",
    pnl: -3.2,
    signals: 28,
    winrate: 54,
    isLong: false,
    indicators: ["Bollinger", "Volume"],
    icon: TrendingDown,
  },
  {
    user: "w1ntermu7e",
    avatar: "WM",
    avatarColor: "#059669",
    strategy: "Trend Follower",
    asset: "SOL/USDT",
    timeframe: "1d",
    pnl: +34.7,
    signals: 19,
    winrate: 84,
    isLong: true,
    indicators: ["EMA", "Fibonacci"],
    icon: TrendingUp,
  },
  {
    user: "dn_crypto",
    avatar: "DN",
    avatarColor: "#d97706",
    strategy: "Pump Detector",
    asset: "XRP/USDT",
    timeframe: "15m",
    pnl: +9.1,
    signals: 87,
    winrate: 62,
    isLong: true,
    indicators: ["Volume", "RSI"],
    icon: Activity,
  },
  {
    user: "quant_owl",
    avatar: "QO",
    avatarColor: "#be185d",
    strategy: "MACD Cross",
    asset: "BNB/USDT",
    timeframe: "4h",
    pnl: +22.3,
    signals: 31,
    winrate: 77,
    isLong: true,
    indicators: ["MACD", "EMA"],
    icon: BarChart2,
  },
  {
    user: "sigma_bot",
    avatar: "SB",
    avatarColor: "#7c3aed",
    strategy: "Smart Money",
    asset: "AVAX/USDT",
    timeframe: "1h",
    pnl: -1.8,
    signals: 55,
    winrate: 58,
    isLong: false,
    indicators: ["Smart Money", "Support"],
    icon: Target,
  },
  {
    user: "fxlena",
    avatar: "FL",
    avatarColor: "#0e7490",
    strategy: "Funding Arb",
    asset: "ETH/USDT",
    timeframe: "8h",
    pnl: +11.6,
    signals: 14,
    winrate: 79,
    isLong: true,
    indicators: ["Funding Rates", "RSI"],
    icon: TrendingUp,
  },
  {
    user: "darkpool99",
    avatar: "DP",
    avatarColor: "#9333ea",
    strategy: "Fear & Greed",
    asset: "BTC/USDT",
    timeframe: "1d",
    pnl: +44.2,
    signals: 9,
    winrate: 89,
    isLong: true,
    indicators: ["Fear & Greed", "Volume"],
    icon: TrendingUp,
  },
];

// Duplicate for seamless loop
const ITEMS = [...STRATEGIES, ...STRATEGIES];

// ─── Single card ─────────────────────────────────────────────────────────────

function BotCard({ bot }) {
  const isPos = bot.pnl >= 0;
  const Icon = bot.icon;

  return (
    <div
      className="relative flex-shrink-0 w-64 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-sm"
      style={{ marginRight: "16px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
            style={{ background: bot.avatarColor + "33", border: `1px solid ${bot.avatarColor}55` }}
          >
            <span style={{ color: bot.avatarColor }}>{bot.avatar}</span>
          </div>
          <div>
            <div className="text-xs font-medium text-white/80">{bot.user}</div>
            <div className="text-[10px] text-white/30">{bot.asset} · {bot.timeframe}</div>
          </div>
        </div>
        <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${isPos ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
          <Icon className={`h-3.5 w-3.5 ${isPos ? "text-emerald-400" : "text-red-400"}`} />
        </div>
      </div>

      {/* Strategy name */}
      <div className="mb-4">
        <div className="text-sm font-semibold text-white">{bot.strategy}</div>
        <div className="mt-1 flex gap-1.5 flex-wrap">
          {bot.indicators.map((ind) => (
            <span key={ind} className="rounded-md px-1.5 py-0.5 text-[9px] font-medium bg-white/[0.05] text-white/40 border border-white/[0.06]">
              {ind}
            </span>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-white/[0.03] p-2.5 border border-white/[0.05]">
          <div className="text-[9px] text-white/30 mb-0.5">P&L</div>
          <div className={`text-xs font-semibold ${isPos ? "text-emerald-400" : "text-red-400"}`}>
            {isPos ? "+" : ""}{bot.pnl}%
          </div>
        </div>
        <div className="rounded-xl bg-white/[0.03] p-2.5 border border-white/[0.05]">
          <div className="text-[9px] text-white/30 mb-0.5">Win%</div>
          <div className="text-xs font-semibold text-white">{bot.winrate}%</div>
        </div>
        <div className="rounded-xl bg-white/[0.03] p-2.5 border border-white/[0.05]">
          <div className="text-[9px] text-white/30 mb-0.5">Signals</div>
          <div className="text-xs font-semibold text-white">{bot.signals}</div>
        </div>
      </div>

      {/* Pulse dot */}
      <div className="absolute top-4 right-4 flex items-center gap-1">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
        </span>
      </div>
    </div>
  );
}

// ─── Ticker row ──────────────────────────────────────────────────────────────

function MarqueeRow({ items, speed = 40, reverse = false }) {
  const trackRef = useRef(null);
  const x = useRef(0);
  const CARD_WIDTH = 264 + 16; // w-64 + gap
  const totalWidth = CARD_WIDTH * (items.length / 2); // original set width

  useAnimationFrame((_, delta) => {
    if (!trackRef.current) return;
    const dir = reverse ? 1 : -1;
    x.current += dir * (speed / 1000) * delta;
    if (!reverse && x.current <= -totalWidth) x.current += totalWidth;
    if (reverse && x.current >= 0) x.current -= totalWidth;
    trackRef.current.style.transform = `translateX(${x.current}px)`;
  });

  return (
    <div className="overflow-hidden">
      <div ref={trackRef} className="flex will-change-transform">
        {items.map((bot, i) => (
          <BotCard key={i} bot={bot} />
        ))}
      </div>
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

export default function StrategiesCarousel() {
  return (
    <section className="py-16 sm:py-28 overflow-hidden">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, margin: "-40px" }}
        className="mb-14 sm:mb-20 text-center px-4"
      >
        <h2 className="mx-auto max-w-3xl bg-gradient-to-b from-white to-white/50 bg-clip-text text-4xl font-semibold leading-[1.15] tracking-tight text-transparent sm:text-5xl lg:text-6xl">
          Strategies running right now
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/50 sm:text-lg">
          Real bots, real users. See what the community is trading.
        </p>
      </motion.div>

      {/* Fade edges */}
      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 z-10"
          style={{ background: "linear-gradient(to right, #080808, transparent)" }} />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 z-10"
          style={{ background: "linear-gradient(to left, #080808, transparent)" }} />

        <div className="flex flex-col gap-4">
          <MarqueeRow items={ITEMS} speed={35} reverse={false} />
          <MarqueeRow items={[...ITEMS].reverse()} speed={28} reverse={true} />
        </div>
      </div>

      {/* Live counter */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        viewport={{ once: true }}
        className="mt-10 flex items-center justify-center gap-2 text-sm text-white/30"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span>1,247 bots active globally</span>
      </motion.div>
    </section>
  );
}