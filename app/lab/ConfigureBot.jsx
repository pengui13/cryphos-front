"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import RsiSettings from "./RsiSettings";
import BollingerBandsSettings from "./BollingerBandsSettings";
import SupportResistanceSettings from "./SupportResistanceSettings";
import EmaSettings from "./EmaSettings";
import MaSettings from "./MaSettings";


export default function ConfigureBot({
  step,
  setStep,
  botSettings,
  setBotSettings,
  onCreateBot,
}) {
  const [isCreating, setIsCreating] = useState(false);

  // RSI state
  const [rsiEnabled, setRsiEnabled] = useState(!!botSettings?.rsi);
  const [rsiSettings, setRsiSettings] = useState(botSettings?.rsi ?? {});

  // Bollinger Bands state
  const [bbEnabled, setBbEnabled] = useState(!!botSettings?.bb);
  const [bbSettings, setBbSettings] = useState(botSettings?.bb ?? {});

  // Support & Resistance state
  const [srEnabled, setSrEnabled] = useState(!!botSettings?.sr);
  const [srSettings, setSrSettings] = useState(botSettings?.sr ?? {});

  // EMA state
  const [emaEnabled, setEmaEnabled] = useState(!!botSettings?.ema);
  const [emaSettings, setEmaSettings] = useState(botSettings?.ema ?? {});

  const [maEnabled, setMaEnabled] = useState(!!botSettings?.ma);
  const [maSettings, setMaSettings] = useState(botSettings?.ma ?? {});
  // Update parent settings whenever anything changes
  useEffect(() => {
    const updatedSettings = { ...botSettings };

    if (rsiEnabled) updatedSettings.rsi = rsiSettings;
    else delete updatedSettings.rsi;

    if (bbEnabled) updatedSettings.bb = bbSettings;
    else delete updatedSettings.bb;

    if (srEnabled) updatedSettings.sr = srSettings;
    else delete updatedSettings.sr;

    if (emaEnabled) updatedSettings.ema = emaSettings;
    else delete updatedSettings.ema;

    if (maEnabled) updatedSettings.ma = maSettings;
    else delete updatedSettings.ma;
    setBotSettings(updatedSettings);
  }, [
    rsiEnabled,
    rsiSettings,
    bbEnabled,
    bbSettings,
    srEnabled,
    srSettings,
    emaEnabled,
    emaSettings,
    maEnabled,
    maSettings,
    setBotSettings,
  ]);

  const handleCreateBot = async () => {
    if (!rsiEnabled && !bbEnabled && !srEnabled && !emaEnabled && !maEnabled) {
      alert("Please enable at least one indicator");
      return;
    }

    setIsCreating(true);
    try {
      await onCreateBot();
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const enabledCount = [rsiEnabled, bbEnabled, srEnabled, emaEnabled, maEnabled].filter(
    Boolean
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-white">
          Configure Indicators
        </h2>
        <p className="text-white/60">
          Enable and customize technical indicators for your bot
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
          <div
            className={`h-2 w-2 rounded-full ${
              enabledCount > 0 ? "bg-white" : "bg-white/30"
            }`}
          />
          <span className="text-sm text-white/70">
            {enabledCount} {enabledCount === 1 ? "indicator" : "indicators"}{" "}
            enabled
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* RSI */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <RsiSettings
            enabled={rsiEnabled}
            setEnabled={setRsiEnabled}
            settings={rsiSettings}
            setSettings={setRsiSettings}
          />
        </div>

        {/* EMA */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <MaSettings
            enabled={maEnabled}
            setEnabled={setMaEnabled}
            settings={maSettings}
            setSettings={setMaSettings}
          />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <EmaSettings
            enabled={emaEnabled}
            setEnabled={setEmaEnabled}
            settings={emaSettings}
            setSettings={setEmaSettings}
          />
        </div>

        {/* Bollinger Bands */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <BollingerBandsSettings
            enabled={bbEnabled}
            setEnabled={setBbEnabled}
            settings={bbSettings}
            setSettings={setBbSettings}
          />
        </div>

        {/* Support & Resistance */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <SupportResistanceSettings
            enabled={srEnabled}
            setEnabled={setSrEnabled}
            settings={srSettings}
            setSettings={setSrSettings}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setStep(step - 1)}
          className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-white/90 transition hover:bg-white/10"
        >
          ← Back
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateBot}
          disabled={isCreating || enabledCount === 0}
          className="rounded-xl bg-white px-8 py-3 font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCreating ? (
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating Bot...
            </span>
          ) : (
            `Create Bot`
          )}
        </motion.button>
      </div>
    </div>
  );
}
