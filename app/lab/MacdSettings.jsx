import { useState, useEffect } from "react";
import { useLang } from "../LanguageContext";

const ALL_TIMEFRAMES = ["1m", "5m", "15m", "30m", "1h", "1d"];
const SIGNAL_IDS = ["crossover", "zero_cross", "divergence", "histogram"];

export default function MacdSettings({ enabled, setEnabled, settings, setSettings }) {
  const { t } = useLang();
  const [selectedTimeframes, setSelectedTimeframes] = useState(settings?.intervals?.length ? settings.intervals : ["1h"]);
  const [fast, setFast] = useState(settings?.fast ?? 12);
  const [slow, setSlow] = useState(settings?.slow ?? 26);
  const [signal, setSignal] = useState(settings?.signal ?? 9);
  const [selectedSignals, setSelectedSignals] = useState(settings?.signals?.length ? settings.signals : ["crossover"]);

  useEffect(() => {
    setSettings({ intervals: selectedTimeframes, fast, slow, signal, signals: selectedSignals });
  }, [selectedTimeframes, fast, slow, signal, selectedSignals, setSettings]);

  function toggleTimeframe(tf) {
    setSelectedTimeframes((cur) => {
      const next = cur.includes(tf) ? cur.filter((x) => x !== tf) : [...cur, tf];
      return next.length ? next : cur;
    });
  }
  function toggleSignal(id) {
    setSelectedSignals((cur) => {
      const next = cur.includes(id) ? cur.filter((s) => s !== id) : [...cur, id];
      return next.length ? next : cur;
    });
  }

  const signals = [
    { id: "crossover", label: t("indicators.macd.crossover"), desc: t("indicators.macd.crossoverDesc") },
    { id: "zero_cross", label: t("indicators.macd.zeroCross"), desc: t("indicators.macd.zeroCrossDesc") },
    { id: "divergence", label: t("indicators.macd.divergence"), desc: t("indicators.macd.divergenceDesc") },
    { id: "histogram", label: t("indicators.macd.histogram"), desc: t("indicators.macd.histogramDesc") },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-white">{t("indicators.macd.name")}</h3>
          <p className="mt-1 text-sm text-white/50">{t("indicators.macd.desc")}</p>
        </div>
        <button onClick={() => setEnabled?.(!enabled)}
          className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors ${enabled ? "bg-white" : "bg-white/20"}`}>
          <span className={`inline-block h-6 w-6 transform rounded-full bg-black transition-transform ${enabled ? "translate-x-7" : "translate-x-1"}`} />
        </button>
      </div>

      <div className={`space-y-6 transition-all duration-300 ${enabled ? "max-h-[2000px] opacity-100" : "pointer-events-none max-h-0 select-none opacity-0"} overflow-hidden`}>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-medium text-white/70">{t("indicators.timeframes")}</label>
            <button onClick={() => setSelectedTimeframes([...ALL_TIMEFRAMES])} className="text-xs text-white/50 transition hover:text-white">
              {t("indicators.selectAll")}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {ALL_TIMEFRAMES.map((tf) => {
              const on = selectedTimeframes.includes(tf);
              return (
                <button key={tf} onClick={() => toggleTimeframe(tf)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${on ? "bg-white text-black" : "bg-white/10 text-white/60 hover:bg-white/15"}`}>
                  {tf}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-white/70">{t("indicators.macd.parameters")}</label>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-4">
            {[
              { label: t("indicators.macd.fastPeriod"), value: fast, set: setFast, options: [8, 10, 12, 14, 16] },
              { label: t("indicators.macd.slowPeriod"), value: slow, set: setSlow, options: [20, 24, 26, 30, 34] },
              { label: t("indicators.macd.signalPeriod"), value: signal, set: setSignal, options: [7, 8, 9, 10, 11] },
            ].map(({ label, value, set, options }) => (
              <div key={label}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-white/50">{label}</span>
                  <span className="text-xs font-bold text-white">{value}</span>
                </div>
                <div className="grid grid-cols-5 gap-1 sm:gap-2">
                  {options.map((o) => (
                    <button key={o} onClick={() => set(o)}
                      className={`rounded-lg py-2 text-xs font-semibold transition-all ${value === o ? "bg-white text-black" : "bg-white/10 text-white/60 hover:bg-white/15"}`}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-white/40">{t("indicators.macd.defaultsHint")}</p>
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-white/70">{t("indicators.macd.signalTypes")}</label>
          <div className="space-y-2">
            {signals.map(({ id, label, desc }) => {
              const on = selectedSignals.includes(id);
              return (
                <button key={id} onClick={() => toggleSignal(id)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${on ? "border-white/20 bg-white/10" : "border-white/5 bg-white/[0.02] hover:bg-white/5"}`}>
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm font-semibold truncate ${on ? "text-white" : "text-white/40"}`}>{label}</div>
                    <div className="text-xs text-white/30 mt-0.5 truncate">{desc}</div>
                  </div>
                  <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors ${on ? "border-white bg-white" : "border-white/20"}`}>
                    {on && <div className="h-2 w-2 rounded-full bg-black" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}