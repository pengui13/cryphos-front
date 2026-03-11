"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimationFrame } from "framer-motion";
import { TrendingUp, TrendingDown, Zap } from "lucide-react";

// ─── Candle chart generator ───────────────────────────────────────────────────

function generateCandles(n = 40, seed = 100) {
  const candles = [];
  let price = seed;
  for (let i = 0; i < n; i++) {
    const change = (Math.random() - 0.48) * 4;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;
    candles.push({ open, close, high, low });
    price = close;
  }
  return candles;
}

// ─── Mini candlestick chart ───────────────────────────────────────────────────

function CandleChart({ candles, width, height, highlight }) {
  if (!candles.length) return null;
  const allPrices = candles.flatMap((c) => [c.high, c.low]);
  const minP = Math.min(...allPrices);
  const maxP = Math.max(...allPrices);
  const range = maxP - minP || 1;
  const pad = 8;
  const chartH = height - pad * 2;
  const chartW = width;
  const cw = chartW / candles.length;

  const py = (p) => pad + ((maxP - p) / range) * chartH;

  return (
    <svg width={width} height={height} className="overflow-visible">
      {candles.map((c, i) => {
        const x = i * cw + cw / 2;
        const isUp = c.close >= c.open;
        const color = isUp ? "#34d399" : "#f87171";
        const bodyTop = py(Math.max(c.open, c.close));
        const bodyBot = py(Math.min(c.open, c.close));
        const bodyH = Math.max(bodyBot - bodyTop, 1);
        const isHighlighted = highlight === i;

        return (
          <g key={i} opacity={isHighlighted ? 1 : 0.7}>
            {/* Wick */}
            <line x1={x} y1={py(c.high)} x2={x} y2={py(c.low)} stroke={color} strokeWidth={1} />
            {/* Body */}
            <rect
              x={x - cw * 0.3}
              y={bodyTop}
              width={cw * 0.6}
              height={bodyH}
              fill={color}
              rx={1}
              style={{ filter: isHighlighted ? `drop-shadow(0 0 4px ${color})` : undefined }}
            />
          </g>
        );
      })}
    </svg>
  );
}

// ─── Floating profit popup ────────────────────────────────────────────────────

function FloatPop({ value, x, y, id }) {
  const isPos = value >= 0;
  return (
    <motion.div
      key={id}
      initial={{ opacity: 1, y: 0, scale: 1 }}
      animate={{ opacity: 0, y: -60, scale: 0.8 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="pointer-events-none absolute text-sm font-bold"
      style={{ left: x, top: y, color: isPos ? "#34d399" : "#f87171" }}
    >
      {isPos ? "+" : ""}{value.toFixed(2)}%
    </motion.div>
  );
}

// ─── Main interactive game ────────────────────────────────────────────────────

const ASSETS = ["BTC/USDT", "ETH/USDT", "SOL/USDT"];

export default function TradingGame() {
  const [candles, setCandles] = useState(() => generateCandles(40, 100));
  const [asset, setAsset] = useState(0);
  const [position, setPosition] = useState(null); // { type: 'long'|'short', price, candle }
  const [balance, setBalance] = useState(1000);
  const [pnl, setPnl] = useState(0);
  const [pops, setPops] = useState([]);
  const [highlight, setHighlight] = useState(null);
  const [streak, setStreak] = useState(0);
  const [message, setMessage] = useState(null);
  const [ticks, setTicks] = useState(0);
  const tickRef = useRef(0);
  const posRef = useRef(null);
  const balRef = useRef(1000);
  const streakRef = useRef(0);

  // Live price ticker
  useAnimationFrame((time) => {
    const t = Math.floor(time / 800);
    if (t !== tickRef.current) {
      tickRef.current = t;
      setTicks(t);
      setCandles((prev) => {
        const last = prev[prev.length - 1];
        const change = (Math.random() - 0.48) * 2.5;
        const open = last.close;
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * 1.2;
        const low = Math.min(open, close) - Math.random() * 1.2;
        const next = [...prev.slice(1), { open, close, high, low }];

        // Resolve position
        if (posRef.current) {
          const entry = posRef.current.price;
          const exit = close;
          const rawPnl = posRef.current.type === "long"
            ? ((exit - entry) / entry) * 100
            : ((entry - exit) / entry) * 100;

          if (Math.abs(rawPnl) > 1.5 || Math.random() < 0.06) {
            const profit = rawPnl * 5;
            balRef.current = Math.max(0, balRef.current + profit);
            setBalance(balRef.current);
            setPnl(rawPnl);

            const won = rawPnl > 0;
            streakRef.current = won ? streakRef.current + 1 : 0;
            setStreak(streakRef.current);

            setPops((p) => [...p.slice(-5), {
              id: Date.now(),
              value: rawPnl,
              x: Math.random() * 200 + 80,
              y: Math.random() * 60 + 40,
            }]);

            setMessage(won
              ? streakRef.current >= 3 ? `🔥 ${streakRef.current}x streak!` : "✓ Nice call"
              : "✗ Wrong direction"
            );
            setTimeout(() => setMessage(null), 1500);
            posRef.current = null;
            setPosition(null);
          }
        }

        return next;
      });
      setHighlight(39);
      setTimeout(() => setHighlight(null), 300);
    }
  });

  // Switch asset
  const switchAsset = () => {
    const next = (asset + 1) % ASSETS.length;
    setAsset(next);
    setCandles(generateCandles(40, 80 + next * 20));
    posRef.current = null;
    setPosition(null);
  };

  const trade = (type) => {
    if (posRef.current || balance <= 0) return;
    const currentPrice = candles[candles.length - 1].close;
    posRef.current = { type, price: currentPrice };
    setPosition({ type, price: currentPrice });
  };

  const currentPrice = candles[candles.length - 1]?.close ?? 0;
  const liveChange = candles.length > 1
    ? ((candles[candles.length - 1].close - candles[candles.length - 2].close) / Math.abs(candles[candles.length - 2].close)) * 100
    : 0;

  return (
    <section className="py-16 sm:py-28">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        className="mb-10 sm:mb-16 text-center"
      >
     
        <h2 className="mx-auto max-w-3xl bg-gradient-to-b from-white to-white/50 bg-clip-text text-4xl font-semibold leading-[1.15] tracking-tight text-transparent sm:text-5xl lg:text-6xl">
          Feel the edge
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/50">
          Call the next candle. Long or Short. This is what your bot does — every second.
        </p>
      </motion.div>

      {/* Game card */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-2xl rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
          <button
            onClick={switchAsset}
            className="flex items-center gap-2 text-sm font-semibold text-white hover:text-white/80 transition-colors"
          >
            <span>{ASSETS[asset]}</span>
            <span className="text-[10px] text-white/30 border border-white/10 rounded px-1">switch</span>
          </button>

          <div className="flex items-center gap-3">
            <div className={`text-sm font-mono font-medium ${liveChange >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {liveChange >= 0 ? "▲" : "▼"} {Math.abs(liveChange).toFixed(2)}%
            </div>
            <div className="text-xs text-white/30 font-mono">
              ${(90000 + currentPrice * 100).toFixed(0)}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-white/30">Balance</span>
            <span className={`font-semibold font-mono ${balance >= 1000 ? "text-white" : "text-red-400"}`}>
              ${balance.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Chart area */}
        <div className="relative px-4 pt-4 pb-2">
          <div className="relative w-full" style={{ height: 180 }}>
            <CandleChart
              candles={candles}
              width={600}
              height={180}
              highlight={highlight}
            />

            {/* Float pops */}
            {pops.map((pop) => (
              <FloatPop key={pop.id} {...pop} />
            ))}

            {/* Position indicator */}
            <AnimatePresence>
              {position && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-2 left-2 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold"
                  style={{
                    background: position.type === "long" ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)",
                    border: `1px solid ${position.type === "long" ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
                    color: position.type === "long" ? "#34d399" : "#f87171",
                  }}
                >
                  {position.type === "long" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {position.type.toUpperCase()} open
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message overlay */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="text-2xl font-bold text-white drop-shadow-lg">{message}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Streak bar */}
          <div className="flex items-center gap-1.5 pb-1">
            <span className="text-[10px] text-white/20">streak</span>
            {Array.from({ length: Math.min(streak, 8) }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="h-1.5 w-4 rounded-full bg-emerald-500"
              />
            ))}
            {streak === 0 && <span className="text-[10px] text-white/20">—</span>}
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 p-4 pt-2">
          <button
            onClick={() => trade("long")}
            disabled={!!position || balance <= 0}
            className="group flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: "rgba(52,211,153,0.12)",
              border: "1px solid rgba(52,211,153,0.25)",
              color: "#34d399",
            }}
            onMouseEnter={(e) => { if (!position) e.currentTarget.style.background = "rgba(52,211,153,0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(52,211,153,0.12)"; }}
          >
            <TrendingUp className="h-4 w-4" />
            Long
          </button>
          <button
            onClick={() => trade("short")}
            disabled={!!position || balance <= 0}
            className="group flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: "rgba(248,113,113,0.12)",
              border: "1px solid rgba(248,113,113,0.25)",
              color: "#f87171",
            }}
            onMouseEnter={(e) => { if (!position) e.currentTarget.style.background = "rgba(248,113,113,0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(248,113,113,0.12)"; }}
          >
            <TrendingDown className="h-4 w-4" />
            Short
          </button>
        </div>

        {/* Bottom hint */}
        <div className="border-t border-white/[0.05] px-5 py-3 text-center">
          <p className="text-[11px] text-white/25">
            This is exactly what Cryphos bots do — automated, 24/7, across any asset.
          </p>
        </div>
      </motion.div>
    </section>
  );
}