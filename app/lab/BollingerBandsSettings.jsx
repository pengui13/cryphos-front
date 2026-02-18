import { useState, useEffect } from "react";
import { useLang } from "../LanguageContext";

const ALL_TIMEFRAMES = ["1m", "5m", "15m", "30m", "1h", "1d"];

export default function BollingerBandsSettings({ enabled, setEnabled, settings, setSettings }) {
  const { t } = useLang();
  const [selectedTimeframes, setSelectedTimeframes] = useState(settings?.intervals?.length ? settings.intervals : ["1m"]);
  const [period, setPeriod] = useState(settings?.period ?? 20);
  const [stdDev, setStdDev] = useState(settings?.std_dev ?? 2);

  useEffect(() => {
    setSettings({ period, std_dev: stdDev, intervals: selectedTimeframes });
  }, [period, stdDev, selectedTimeframes, setSettings]);

  function toggleTimeframe(tf) {
    setSelectedTimeframes((cur) => {
      const next = cur.includes(tf) ? cur.filter((t) => t !== tf) : [...cur, tf];
      return next.length ? next : cur;
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-white">{t("indicators.bb.name")}</h3>
          <p className="mt-1 text-sm text-white/50">{t("indicators.bb.desc")}</p>
        </div>
        <button
          onClick={() => setEnabled?.(!enabled)}
          className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors ${enabled ? "bg-white" : "bg-white/20"}`}
        >
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

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <label className="mb-3 block text-sm font-medium text-white/70">{t("indicators.bb.period")}</label>
            <div className="grid grid-cols-3 gap-2">
              {[10, 20, 30].map((p) => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`rounded-lg py-2.5 text-sm font-semibold transition-all ${period === p ? "bg-white text-black" : "bg-white/10 text-white/60 hover:bg-white/15"}`}>
                  {p}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-white/40">{t("indicators.bb.periodHint")}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <label className="mb-3 block text-sm font-medium text-white/70">{t("indicators.bb.stdDev")}</label>
            <div className="grid grid-cols-3 gap-2">
              {[1.5, 2, 2.5].map((sd) => (
                <button key={sd} onClick={() => setStdDev(sd)}
                  className={`rounded-lg py-2.5 text-sm font-semibold transition-all ${stdDev === sd ? "bg-white text-black" : "bg-white/10 text-white/60 hover:bg-white/15"}`}>
                  {sd}σ
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-white/40">{t("indicators.bb.stdDevHint")}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <div className="mb-2 text-sm font-medium text-white/80">{t("indicators.bb.howItWorks")}</div>
          <div className="space-y-1.5 text-xs text-white/50">
            <p>• {t("indicators.bb.upper")}</p>
            <p>• {t("indicators.bb.lower")}</p>
            <p>• {t("indicators.bb.squeeze")}</p>
            <p>• {t("indicators.bb.expansion")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}