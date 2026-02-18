import { useState, useEffect } from "react";
import { useLang } from "../LanguageContext";

const ALL_TIMEFRAMES = ["1m", "5m", "15m", "30m", "1h", "1d"];
const CONCEPT_IDS = ["ob", "fvg", "bos", "liquidity", "pd"];

export default function SmartMoneySettings({ enabled, setEnabled, settings, setSettings }) {
  const { t } = useLang();
  const [selectedTimeframes, setSelectedTimeframes] = useState(settings?.intervals?.length ? settings.intervals : ["1h"]);
  const [selectedConcepts, setSelectedConcepts] = useState(settings?.concepts?.length ? settings.concepts : ["ob", "bos"]);
  const [sensitivity, setSensitivity] = useState(settings?.sensitivity ?? "medium");

  useEffect(() => {
    setSettings({ intervals: selectedTimeframes, concepts: selectedConcepts, sensitivity });
  }, [selectedTimeframes, selectedConcepts, sensitivity, setSettings]);

  function toggleTimeframe(tf) {
    setSelectedTimeframes((cur) => {
      const next = cur.includes(tf) ? cur.filter((x) => x !== tf) : [...cur, tf];
      return next.length ? next : cur;
    });
  }
  function toggleConcept(id) {
    setSelectedConcepts((cur) => {
      const next = cur.includes(id) ? cur.filter((c) => c !== id) : [...cur, id];
      return next.length ? next : cur;
    });
  }

  const concepts = CONCEPT_IDS.map((id) => ({
    id,
    label: t(`indicators.smc.${id}`),
    desc: t(`indicators.smc.${id}Desc`),
  }));

  const sensitivityLevels = [
    { key: "low", label: t("indicators.smc.low") },
    { key: "medium", label: t("indicators.smc.medium") },
    { key: "high", label: t("indicators.smc.high") },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-white">{t("indicators.smc.name")}</h3>
          <p className="mt-1 text-sm text-white/50">{t("indicators.smc.desc")}</p>
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
          <label className="mb-3 block text-sm font-medium text-white/70">{t("indicators.smc.activeConcepts")}</label>
          <div className="space-y-2">
            {concepts.map(({ id, label, desc }) => {
              const on = selectedConcepts.includes(id);
              return (
                <button key={id} onClick={() => toggleConcept(id)}
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

        <div>
          <label className="mb-3 block text-sm font-medium text-white/70">{t("indicators.smc.sensitivity")}</label>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {sensitivityLevels.map(({ key, label }) => (
              <button key={key} onClick={() => setSensitivity(key)}
                className={`rounded-lg py-2.5 text-sm font-semibold transition-all ${sensitivity === key ? "bg-white text-black" : "bg-white/10 text-white/60 hover:bg-white/15"}`}>
                {label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-white/40">{t("indicators.smc.sensitivityHint")}</p>
        </div>
      </div>
    </div>
  );
}