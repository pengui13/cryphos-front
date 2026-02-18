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
  const [smcEnabled, setSmcEnabled] = useState(!!botSettings?.smc);
  const [smcSettings, setSmcSettings] = useState(botSettings?.smc ?? {});
  const [macdEnabled, setMacdEnabled] = useState(!!botSettings?.macd);
  const [macdSettings, setMacdSettings] = useState(botSettings?.macd ?? {});
  const [volEnabled, setVolEnabled] = useState(!!botSettings?.volume);
  const [volSettings, setVolSettings] = useState(botSettings?.volume ?? {});

  useEffect(() => {
    const s = { ...botSettings };
    if (rsiEnabled) s.rsi = rsiSettings; else delete s.rsi;
    if (bbEnabled) s.bb = bbSettings; else delete s.bb;
    if (srEnabled) s.sr = srSettings; else delete s.sr;
    if (emaEnabled) s.ema = emaSettings; else delete s.ema;
    if (maEnabled) s.ma = maSettings; else delete s.ma;
    if (fibEnabled) s.fib = fibSettings; else delete s.fib;
    if (smcEnabled) s.smc = smcSettings; else delete s.smc;
    if (macdEnabled) s.macd = macdSettings; else delete s.macd;
    if (volEnabled) s.volume = volSettings; else delete s.volume;
    setBotSettings(s);
  }, [
    rsiEnabled, rsiSettings, bbEnabled, bbSettings, srEnabled, srSettings,
    emaEnabled, emaSettings, maEnabled, maSettings, fibEnabled, fibSettings,
    smcEnabled, smcSettings, macdEnabled, macdSettings, volEnabled, volSettings,
    setBotSettings,
  ]);

  const enabledCount = [rsiEnabled, bbEnabled, srEnabled, emaEnabled, maEnabled, fibEnabled, smcEnabled, macdEnabled, volEnabled].filter(Boolean).length;

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
          <MacdSettings enabled={macdEnabled} setEnabled={setMacdEnabled} settings={macdSettings} setSettings={setMacdSettings} />
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
          <VolumeSettings enabled={volEnabled} setEnabled={setVolEnabled} settings={volSettings} setSettings={setVolSettings} />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <SmartMoneySettings enabled={smcEnabled} setEnabled={setSmcEnabled} settings={smcSettings} setSettings={setSmcSettings} />
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