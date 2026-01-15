"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import RsiSettings from "./RsiSettings";

export default function ConfigureBot({
  botSettings,
  setBotSettings,
  step,
  setStep,
  onCreateBot,
}) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  /* ===================== RSI ===================== */
  const [rsiEnabled, setRsiEnabled] = useState(botSettings?.rsi?.enabled ?? true);
  const [rsiSettings, setRsiSettings] = useState({
    period:    botSettings?.rsi?.period    ?? 14,
    max:       botSettings?.rsi?.max       ?? 70,
    min:       botSettings?.rsi?.min       ?? 30,
    intervals: botSettings?.rsi?.intervals ?? ["1m"],
  });

  /* ===================== Any enabled? ===================== */
  const anyEnabled = useMemo(() => rsiEnabled, [rsiEnabled]);

  /* ===================== Persist → parent JSON ===================== */
  useEffect(() => {
    setBotSettings((prev) => {
      const next = { ...prev };

      if (rsiEnabled) next.rsi = { ...rsiSettings, enabled: true };
      else if (next.rsi) delete next.rsi;

      return next;
    });
  }, [rsiEnabled, rsiSettings, setBotSettings]);

  /* ===================== Step controls ===================== */
  const handleBack = () => setStep?.(Math.max(1, (step || 2) - 1));

  const handleCreateBot = async () => {
    if (!anyEnabled || creating) return;
    setCreating(true);
    try {
      await onCreateBot?.();
      router.push("/bots");
    } catch (err) {
      console.error(err);
      setCreating(false);
    }
  };

  /* ===================== UI helpers ===================== */
  const enabledBadges = [rsiEnabled && "RSI"].filter(Boolean);

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
      </div>

      {/* ===== Footer nav ===== */}
      <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-4">
        <button
          onClick={handleBack}
          disabled={creating}
          className="rounded-2xl border border-white/15 bg-white/5 px-5 py-2.5 text-white transition hover:bg-white/10 disabled:opacity-50"
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
          onClick={handleCreateBot}
          disabled={!anyEnabled || creating}
          className={`rounded-2xl px-6 py-2.5 font-semibold transition-[transform,background,box-shadow]
            ${anyEnabled && !creating
              ? "bg-[#e3b8ff] text-black shadow-[0_12px_30px_-10px_rgba(227,184,255,0.6)] hover:-translate-y-0.5 hover:bg-[#d7a8ff] focus:outline-none focus-visible:ring focus-visible:ring-[#e3b8ff]/40 active:translate-y-0"
              : "bg-white/10 text-white/50 cursor-not-allowed"}`}
        >
          {creating ? "Creating..." : "Create Bot →"}
        </button>
      </div>
    </motion.div>
  );
} 