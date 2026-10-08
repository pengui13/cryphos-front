"use client";

import React, { useRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import {
  TrendingUp, TrendingDown, Activity, BarChart2, Waves, Gauge,
} from "lucide-react";
import { useLang } from "./LanguageContext";

/* ── Strategy presets ──────────────────────────────────────────────────────
   These are example configurations of the builder, not user accounts. The
   section used to present them as real traders with live P&L and win rates —
   invented social proof and invented performance figures for a product that
   has not shipped to users yet.
   ────────────────────────────────────────────────────────────────────────── */

const PRESETS = [
  { key: "rsiReversal", accent: "#a78bfa", asset: "BTC/USDT", timeframe: "4h",  indicators: ["RSI", "EMA"],                icon: TrendingUp },
  { key: "bbSqueeze",   accent: "#38bdf8", asset: "ETH/USDT", timeframe: "1h",  indicators: ["Bollinger", "Volume"],       icon: Waves },
  { key: "trendFollow", accent: "#34d399", asset: "SOL/USDT", timeframe: "1d",  indicators: ["EMA", "Fibonacci"],          icon: TrendingUp },
  { key: "volumeSpike", accent: "#fbbf24", asset: "XRP/USDT", timeframe: "15m", indicators: ["Volume", "RSI"],             icon: Activity },
  { key: "macdCross",   accent: "#f472b6", asset: "BNB/USDT", timeframe: "4h",  indicators: ["MACD", "EMA"],               icon: BarChart2 },
  { key: "srBreak",     accent: "#c084fc", asset: "BTC/USDT", timeframe: "1h",  indicators: ["S/R", "Smart Money"],        icon: TrendingDown },
  { key: "fundingArb",  accent: "#22d3ee", asset: "ETH/USDT", timeframe: "8h",  indicators: ["Funding Rates", "RSI"],      icon: Gauge },
  { key: "fearGreed",   accent: "#8b5cf6", asset: "BTC/USDT", timeframe: "1d",  indicators: ["Fear & Greed", "Volume"],    icon: Activity },
];

// Duplicated so the marquee can loop without a visible seam.
const ITEMS = [...PRESETS, ...PRESETS];

const CARD_W = 272; // w-[272px]
const GAP = 16;

/* ── Card ─────────────────────────────────────────────────────────────────── */

function PresetCard({ preset, t }) {
  const Icon = preset.icon;

  return (
    <div
      className="surface relative w-[272px] flex-shrink-0 overflow-hidden rounded-2xl p-5"
      style={{ marginRight: GAP }}
    >
      {/* A whisper of the preset's accent, so the rail reads as varied rather
          than as eight identical grey tiles. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{ background: `radial-gradient(120% 100% at 50% 0%, ${preset.accent}14, transparent)` }}
      />

      <div className="relative">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: preset.accent + "14",
              border: `1px solid ${preset.accent}33`,
              color: preset.accent,
            }}
          >
            <Icon className="h-4 w-4" />
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="tnum text-[11px] font-medium text-white/50">{preset.asset}</span>
            <span className="rounded-md border border-white/[0.07] bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-white/35">
              {preset.timeframe}
            </span>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-white">
          {t(`home.preset.${preset.key}Title`)}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-white/40">
          {t(`home.preset.${preset.key}Desc`)}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-white/[0.06] pt-4">
          {preset.indicators.map((ind) => (
            <span
              key={ind}
              className="rounded-md border border-white/[0.06] bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-white/45"
            >
              {ind}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Marquee ──────────────────────────────────────────────────────────────── */

function MarqueeRow({ items, speed = 40, reverse = false, t }) {
  const trackRef = useRef(null);
  const x = useRef(0);
  const totalWidth = (CARD_W + GAP) * (items.length / 2); // one original set

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
        {items.map((preset, i) => (
          <PresetCard key={`${preset.key}-${i}`} preset={preset} t={t} />
        ))}
      </div>
    </div>
  );
}

/* ── Section ──────────────────────────────────────────────────────────────── */

export default function StrategiesCarousel() {
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden py-16 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, margin: "-40px" }}
        className="mb-14 px-4 text-center sm:mb-20"
      >
        <h2 className="text-display mx-auto max-w-3xl text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.5rem]">
          {t("home.strategiesTitle")}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-white/45 sm:text-lg">
          {t("home.strategiesSub")}
        </p>
      </motion.div>

      <div className="relative">
        <div
          className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-24 sm:w-32"
          style={{ background: "linear-gradient(to right, #08080b, transparent)" }}
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-24 sm:w-32"
          style={{ background: "linear-gradient(to left, #08080b, transparent)" }}
        />

        <div className="flex flex-col gap-4">
          <MarqueeRow items={ITEMS} speed={35} reverse={false} t={t} />
          <MarqueeRow items={[...ITEMS].reverse()} speed={28} reverse t={t} />
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        viewport={{ once: true }}
        className="mt-10 px-4 text-center text-sm text-white/30"
      >
        {t("home.strategiesNote")}
      </motion.p>
    </section>
  );
}
