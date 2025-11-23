"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import RsiSettings from "./RsiSettings";
import MaSettings from "./MaSettings";
// import FGSettings from "./FGSettings";
import SrSettings from "./SrSettings"; // ⬅️ новый модуль S/R

export default function ConfigureBot({
  botSettings,
  setBotSettings,
  step,
  setStep,
}) {
  /* ===================== RSI ===================== */
  const [rsiEnabled, setRsiEnabled] = useState(botSettings?.rsi?.enabled ?? true);
  const [rsiSettings, setRsiSettings] = useState({
    period:    botSettings?.rsi?.period    ?? 14,
    max:       botSettings?.rsi?.max       ?? 70,
    min:       botSettings?.rsi?.min       ?? 30,
    intervals: botSettings?.rsi?.intervals ?? ["1m"],
  });

  /* ===================== EMA / MA ===================== */
  const [maEnabled, setMaEnabled] = useState(botSettings?.ma?.enabled ?? false);
  const [maSettings, setMaSettings] = useState({
    period:    botSettings?.ma?.period    ?? 20,
    intervals: botSettings?.ma?.intervals ?? ["1m"],
  });

  /* ===================== Fear & Greed (опционально) ===================== */
  const [fgEnabled, setFgEnabled] = useState(botSettings?.fg?.enabled ?? false);
  const [fgSettings, setFgSettings] = useState({
    lower:    botSettings?.fg?.lower    ?? 20,
    upper:    botSettings?.fg?.upper    ?? 80,
    lookback: botSettings?.fg?.lookback ?? 2,
  });

  /* ===================== S/R (Support / Resistance) ===================== */
  const [srEnabled, setSrEnabled] = useState(botSettings?.sr?.enabled ?? true);
  const [srSettings, setSrSettings] = useState({
    mode:            botSettings?.sr?.mode            ?? "both",      // "rolling" | "pivots" | "both"
    intervals:       botSettings?.sr?.intervals       ?? ["5m","15m","1h"],
    lookback:        botSettings?.sr?.lookback        ?? 50,
    levels_count:    botSettings?.sr?.levels_count    ?? 6,
    zone_mode:       botSettings?.sr?.zone_mode       ?? "atr",       // "atr" | "fixed"
    atr_period:      botSettings?.sr?.atr_period      ?? 14,
    atr_mult:        botSettings?.sr?.atr_mult        ?? 0.75,
    fixed_width:     botSettings?.sr?.fixed_width     ?? 0.002,       // 0.2% от цены
    merge_dist_atr:  botSettings?.sr?.merge_dist_atr  ?? 0.5,
    pivot_type:      botSettings?.sr?.pivot_type      ?? "classic",   // "classic" | "fibo" | "woodie" | "camarilla"
    pivot_tf:        botSettings?.sr?.pivot_tf        ?? "daily",     // "daily" | "weekly" | "monthly"
    vwap_enabled:    botSettings?.sr?.vwap_enabled    ?? true,
    vwap_bands:      botSettings?.sr?.vwap_bands      ?? 1,
  });

  /* ===================== Any enabled? ===================== */
  const anyEnabled = useMemo(
    () => rsiEnabled || maEnabled || fgEnabled || srEnabled,
    [rsiEnabled, maEnabled, fgEnabled, srEnabled]
  );

  /* ===================== Persist → parent JSON ===================== */
  useEffect(() => {
    setBotSettings((prev) => {
      const next = { ...prev };

      // RSI
      if (rsiEnabled) next.rsi = { ...rsiSettings, enabled: true };
      else if (next.rsi) delete next.rsi;

      // MA
      if (maEnabled) next.ma = { ...maSettings, enabled: true };
      else if (next.ma) delete next.ma;

      // FG
      if (fgEnabled) next.fg = { ...fgSettings, enabled: true, type: "FG" };
      else if (next.fg) delete next.fg;

      // S/R
      if (srEnabled) next.sr = { ...srSettings, enabled: true, type: "SR" };
      else if (next.sr) delete next.sr;

      return next;
    });
  }, [
    rsiEnabled, rsiSettings,
    maEnabled,  maSettings,
    fgEnabled,  fgSettings,
    srEnabled,  srSettings,
    setBotSettings,
  ]);

  /* ===================== Step controls ===================== */
  const handleBack = () => setStep?.(Math.max(1, (step || 2) - 1));
  const handleNext = () => {
    if (!anyEnabled) return;
    setStep?.((step || 2) + 1);
  };

  /* ===================== UI helpers ===================== */
  const enabledBadges = [
    srEnabled && "S/R",
    rsiEnabled && "RSI",
    maEnabled && "EMA",
    fgEnabled && "FG",
    // bbEnabled && "BB", // если вернёте BB
  ].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.997 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col w-full gap-6"
    >
      {/* ===== Header ===== */}
      <div className="flex items-start justify-between rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div>
          <h2 className="text-[22px] font-semibold tracking-tight">Configure indicators</h2>
          <p className="mt-1 text-white/70 text-sm">
            Toggle and tune the indicators you want this bot to use.
          </p>
        </div>

        {/* Summary chips */}
        <div className="flex flex-wrap items-center gap-2">
          {anyEnabled ? (
            enabledBadges.map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/80"
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#e3b8ff]" />
                {label}
              </span>
            ))
          ) : (
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60">
              No indicators enabled
            </span>
          )}
        </div>
      </div>

      {/* ===== Sections ===== */}
      <div className="grid grid-cols-1 gap-6">
        {/* S/R */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <SrSettings
            enabled={srEnabled}
            setEnabled={setSrEnabled}
            settings={srSettings}
            setSettings={setSrSettings}
          />
        </section>

        {/* RSI */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <RsiSettings
            step={step}
            setStep={setStep}
            enabled={rsiEnabled}
            setEnabled={setRsiEnabled}
            settings={rsiSettings}
            setSettings={setRsiSettings}
          />
        </section>

        {/* MA */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <MaSettings
            enabled={maEnabled}
            setEnabled={setMaEnabled}
            settings={maSettings}
            setSettings={setMaSettings}
          />
        </section>

        {/* FG (если нужно — раскомментируйте секцию и импорт) */}
        {/*
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <FGSettings
            enabled={fgEnabled}
            setEnabled={setFgEnabled}
            settings={fgSettings}
            setSettings={setFgSettings}
          />
        </section>
        */}
      </div>

      {/* ===== Footer nav ===== */}
      <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-4">
        <button
          onClick={handleBack}
          className="rounded-2xl border border-white/15 bg-white/5 px-5 py-2.5 text-white transition hover:bg-white/10"
        >
          ← Back
        </button>

        <div className="text-xs text-white/60">
          {anyEnabled ? (
            <span>At least one indicator selected</span>
          ) : (
            <span className="text-red-300">Enable at least one indicator to continue</span>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={!anyEnabled}
          className={`rounded-2xl px-6 py-2.5 font-semibold transition-[transform,background,box-shadow]
            ${anyEnabled
              ? "bg-[#e3b8ff] text-black shadow-[0_12px_30px_-10px_rgba(227,184,255,0.6)] hover:-translate-y-0.5 hover:bg-[#d7a8ff] focus:outline-none focus-visible:ring focus-visible:ring-[#e3b8ff]/40 active:translate-y-0"
              : "bg-white/10 text-white/50 cursor-not-allowed"}`}
        >
          Continue →
        </button>
      </div>
    </motion.div>
  );
}
