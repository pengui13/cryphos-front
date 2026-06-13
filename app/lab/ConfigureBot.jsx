"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import RsiSettings from "./RsiSettings";
import BollingerBandsSettings from "./BollingerBandsSettings";
import SupportResistanceSettings from "./SupportResistanceSettings";
import EmaSettings from "./EmaSettings";
import MaSettings from "./MaSettings";
import FibonacciSettings from "./FibonacciSettings";
import SmartMoneySettings from "./SmartMoneySettings";
import MacdSettings from "./MacdSettings";
import VolumeSettings from "./VolumeSettings";
import { useLang } from "../LanguageContext";

function ComingSoon({ children }) {
  return (
    <div className="relative">
      {/* Greyed-out, non-interactive indicator */}
      <div className="pointer-events-none select-none opacity-40 blur-[0.5px]" aria-disabled="true">
        {children}
      </div>
      {/* Soon badge */}
      <span className="absolute right-4 top-4 z-10 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-300">
        Soon
      </span>
    </div>
  );
}

export default function ConfigureBot({ step, setStep, botSettings, setBotSettings, onCreateBot }) {
  const { t } = useLang();
  const [isCreating, setIsCreating] = useState(false);

  const [rsiEnabled, setRsiEnabled] = useState(!!botSettings?.rsi);
  const [rsiSettings, setRsiSettings] = useState(botSettings?.rsi ?? {});
  const [bbEnabled, setBbEnabled] = useState(!!botSettings?.bb);
  const [bbSettings, setBbSettings] = useState(botSettings?.bb ?? {});
  const [srEnabled, setSrEnabled] = useState(!!botSettings?.sr);
  const [srSettings, setSrSettings] = useState(botSettings?.sr ?? {});
  const [emaEnabled, setEmaEnabled] = useState(!!botSettings?.ema);
  const [emaSettings, setEmaSettings] = useState(botSettings?.ema ?? {});
  const [maEnabled, setMaEnabled] = useState(!!botSettings?.ma);
  const [maSettings, setMaSettings] = useState(botSettings?.ma ?? {});
  const [fibEnabled, setFibEnabled] = useState(!!botSettings?.fib);
  const [fibSettings, setFibSettings] = useState(botSettings?.fib ?? {});

  // --- "Soon" indicators: ready on the FE but not yet wired on the BE.
  // They are rendered greyed-out / disabled and never added to botSettings.
  const [smcSettings, setSmcSettings] = useState(botSettings?.smc ?? {});
  const [macdSettings, setMacdSettings] = useState(botSettings?.macd ?? {});
  const [volSettings, setVolSettings] = useState(botSettings?.volume ?? {});
  const noop = () => {};

  useEffect(() => {
    const s = { ...botSettings };
    if (rsiEnabled) s.rsi = rsiSettings; else delete s.rsi;
    if (bbEnabled) s.bb = bbSettings; else delete s.bb;
    if (srEnabled) s.sr = srSettings; else delete s.sr;
    if (emaEnabled) s.ema = emaSettings; else delete s.ema;
    if (maEnabled) s.ma = maSettings; else delete s.ma;
    if (fibEnabled) s.fib = fibSettings; else delete s.fib;
    // Soon indicators are never persisted.
    delete s.smc;
    delete s.macd;
    delete s.volume;
    setBotSettings(s);
  }, [
    rsiEnabled, rsiSettings, bbEnabled, bbSettings, srEnabled, srSettings,
    emaEnabled, emaSettings, maEnabled, maSettings, fibEnabled, fibSettings,
    setBotSettings,
  ]);

  const enabledCount = [rsiEnabled, bbEnabled, srEnabled, emaEnabled, maEnabled, fibEnabled].filter(Boolean).length;

  const handleCreateBot = async () => {
    if (enabledCount === 0) { alert(t("bots.atLeastOneIndicator")); return; }
    setIsCreating(true);
    try { await onCreateBot(); } catch (err) { console.error(err); } finally { setIsCreating(false); }
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-white">{t("indicators.configureTitle")}</h2>
        <p className="text-white/60">{t("indicators.configureSubtitle")}</p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
          <div className={`h-2 w-2 rounded-full ${enabledCount > 0 ? "bg-white" : "bg-white/30"}`} />
          <span className="text-sm text-white/70">
            {enabledCount} {enabledCount === 1 ? t("indicators.enabled_one") : t("indicators.enabled_other")}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <RsiSettings enabled={rsiEnabled} setEnabled={setRsiEnabled} settings={rsiSettings} setSettings={setRsiSettings} />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <ComingSoon>
            <MacdSettings enabled={false} setEnabled={noop} settings={macdSettings} setSettings={setMacdSettings} />
          </ComingSoon>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <MaSettings enabled={maEnabled} setEnabled={setMaEnabled} settings={maSettings} setSettings={setMaSettings} />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <EmaSettings enabled={emaEnabled} setEnabled={setEmaEnabled} settings={emaSettings} setSettings={setEmaSettings} />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <BollingerBandsSettings enabled={bbEnabled} setEnabled={setBbEnabled} settings={bbSettings} setSettings={setBbSettings} />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <FibonacciSettings enabled={fibEnabled} setEnabled={setFibEnabled} settings={fibSettings} setSettings={setFibSettings} />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <ComingSoon>
            <VolumeSettings enabled={false} setEnabled={noop} settings={volSettings} setSettings={setVolSettings} />
          </ComingSoon>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <ComingSoon>
            <SmartMoneySettings enabled={false} setEnabled={noop} settings={smcSettings} setSettings={setSmcSettings} />
          </ComingSoon>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <SupportResistanceSettings enabled={srEnabled} setEnabled={setSrEnabled} settings={srSettings} setSettings={setSrSettings} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-6">
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setStep(step - 1)}
          className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-white/90 transition hover:bg-white/10"
        >
          {t("indicators.back")}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleCreateBot}
          disabled={isCreating || enabledCount === 0}
          className="rounded-xl bg-white px-8 py-3 font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCreating ? (
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {t("bots.creatingBot")}
            </span>
          ) : t("bots.createBot")}
        </motion.button>
      </div>
    </div>
  );
}