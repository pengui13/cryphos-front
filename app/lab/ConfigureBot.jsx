import RsiSettings from "./RsiSettings";
import { useEffect, useState, useMemo } from "react";
import MaSettings from "./MaSettings";
// import BollingerBands from "./BollingerBands";

export default function ConfigureBot({
  botSettings,
  setBotSettings,
  step,
  setStep,
}) {
  const [rsiEnabled, setRsiEnabled] = useState(
    botSettings?.rsi?.enabled ?? true
  );
  const [rsiSettings, setRsiSettings] = useState({
    period: botSettings?.rsi?.period ?? 14,
    max: botSettings?.rsi?.max ?? 70,
    min: botSettings?.rsi?.min ?? 30,
    intervals: botSettings?.rsi?.intervals ?? ["1m"],
  });

  // EMA / MA
  const [maEnabled, setMaEnabled] = useState(botSettings?.ma?.enabled ?? false);
  const [maSettings, setMaSettings] = useState({
    period: botSettings?.ma?.period ?? 20,
    intervals: botSettings?.ma?.intervals ?? ["1m"],
  });

  // BB (kept for future; not rendered below)
  const [bbEnabled, setBbEnabled] = useState(botSettings?.bb?.enabled ?? false);
  const [bbSettings, setBbSettings] = useState({
    period: botSettings?.bb?.period ?? 20,
    std_dev: botSettings?.bb?.std_dev ?? 2.0,
    intervals: botSettings?.bb?.intervals ?? ["1m"],
  });

  const anyEnabled = useMemo(
    () => rsiEnabled || maEnabled || bbEnabled,
    [rsiEnabled, maEnabled, bbEnabled]
  );

  // Push into parent botSettings
  useEffect(() => {
    setBotSettings((prev) => {
      const next = { ...prev };

      if (rsiEnabled) {
        next.rsi = { ...rsiSettings, enabled: true };
      } else {
        if (next.rsi) delete next.rsi;
      }

      if (maEnabled) {
        next.ma = { ...maSettings, enabled: true };
      } else {
        if (next.ma) delete next.ma;
      }

      if (bbEnabled) {
        next.bb = { ...bbSettings, enabled: true };
      } else {
        if (next.bb) delete next.bb;
      }

      return next;
    });
  }, [
    rsiEnabled,
    rsiSettings,
    maEnabled,
    maSettings,
    bbEnabled,
    bbSettings,
    setBotSettings,
  ]);

  // Parent-level step controls
  const handleBack = () => setStep?.(Math.max(1, (step || 2) - 1));
  const handleNext = () => {
    if (!anyEnabled) return; // guard (button disabled anyway)
    setStep?.((step || 2) + 1);
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Configure Indicators</h2>
          <p className="text-white/60 text-sm">
            Toggle and tune the indicators you want this bot to use.
          </p>
        </div>

        {/* Small summary pill */}
        <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
          {anyEnabled ? (
            <span className="text-white/80">
              Enabled: {rsiEnabled ? "RSI" : ""}{rsiEnabled && (maEnabled || bbEnabled) ? ", " : ""}
              {maEnabled ? "EMA" : ""}{maEnabled && bbEnabled ? ", " : ""}
              {bbEnabled ? "BB" : ""}
            </span>
          ) : (
            <span className="text-white/50">No indicators enabled</span>
          )}
        </div>
      </div>

      {/* Sections (these components handle their own expand/collapse via `enabled`) */}
      <RsiSettings
        step={step}
        setStep={setStep}
        enabled={rsiEnabled}
        setEnabled={setRsiEnabled}
        settings={rsiSettings}
        setSettings={setRsiSettings}
      />

      <MaSettings
        enabled={maEnabled}
        setEnabled={setMaEnabled}
        settings={maSettings}
        setSettings={setMaSettings}
      />

      {/* Keep BB wiring handy for later */}
      {/* <BollingerBands
        enabled={bbEnabled}
        setEnabled={setBbEnabled}
        settings={bbSettings}
        setSettings={setBbSettings}
      /> */}

      {/* Parent step navigation */}
      <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-4">
        <button
          onClick={handleBack}
          className="px-4 py-2 rounded-lg border border-white/15 bg-white/5 text-white hover:bg-white/10 transition-colors"
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
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            anyEnabled
              ? "bg-[#e3b8ff] text-black hover:bg-[#d7a8ff]"
              : "bg-white/10 text-white/50 cursor-not-allowed"
          }`}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
