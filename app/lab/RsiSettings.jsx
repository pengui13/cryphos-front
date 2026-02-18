import { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useLang } from "../LanguageContext";

const ALL_TIMEFRAMES = ["1m", "5m", "15m", "30m", "1h", "1d"];

export default function RsiSettings({ enabled, setEnabled, settings, setSettings }) {
  const { t } = useLang();
  const [selectedTimeframes, setSelectedTimeframes] = useState(settings?.intervals?.length ? settings.intervals : ["1m"]);
  const [rsiValues, setRsiValues] = useState([settings?.min ?? 30, settings?.max ?? 70]);
  const [period, setPeriod] = useState(settings?.period ?? 14);

  useEffect(() => {
    setSettings({ period, max: rsiValues[1], min: rsiValues[0], intervals: selectedTimeframes });
  }, [period, rsiValues, selectedTimeframes, setSettings]);

  function toggleTimeframe(tf) {
    setSelectedTimeframes((cur) => {
      const next = cur.includes(tf) ? cur.filter((x) => x !== tf) : [...cur, tf];
      return next.length ? next : cur;
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-white">{t("indicators.rsi.name")}</h3>
          <p className="mt-1 text-sm text-white/50">{t("indicators.rsi.desc")}</p>
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
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${on ? "bg-white text-black" : "bg-white/10 text-white/60 hover:bg-white/15"}`}>
                  {tf}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-4 block text-sm font-medium text-white/70">{t("indicators.rsi.thresholds")}</label>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
            <div className="mb-6 px-1 sm:px-2">
              <Slider
                range min={0} max={100} value={rsiValues}
                onChange={(v) => setRsiValues(v)} allowCross={false} pushable={5}
                trackStyle={[{ backgroundColor: "#fff", height: 4, borderRadius: 2 }]}
                railStyle={{ backgroundColor: "rgba(255,255,255,0.1)", height: 4, borderRadius: 2 }}
                handleStyle={[
                  { backgroundColor: "#fff", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.3)", height: 16, width: 16, marginTop: -6 },
                  { backgroundColor: "#fff", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.3)", height: 16, width: 16, marginTop: -6 },
                ]}
                marks={{
                  0: { style: { color: "#ffffff40", fontSize: "11px" }, label: "0" },
                  50: { style: { color: "#ffffff40", fontSize: "11px" }, label: "50" },
                  100: { style: { color: "#ffffff40", fontSize: "11px" }, label: "100" },
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="rounded-xl bg-green-500/10 p-2.5 sm:p-3 ring-1 ring-green-500/20">
                <div className="mb-1 flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                  <span className="text-xs font-medium text-green-300">{t("indicators.rsi.buySignal")}</span>
                </div>
                <div className="text-sm sm:text-base font-semibold text-green-400">RSI &lt; {rsiValues[0]}</div>
              </div>
              <div className="rounded-xl bg-red-500/10 p-2.5 sm:p-3 ring-1 ring-red-500/20">
                <div className="mb-1 flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  <span className="text-xs font-medium text-red-300">{t("indicators.rsi.sellSignal")}</span>
                </div>
                <div className="text-sm sm:text-base font-semibold text-red-400">RSI &gt; {rsiValues[1]}</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-white/70">{t("indicators.rsi.period")}</label>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {[7, 9, 14, 17, 21].map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`rounded-lg py-2.5 text-xs sm:text-sm font-semibold transition-all ${period === p ? "bg-white text-black" : "bg-white/10 text-white/60 hover:bg-white/15"}`}>
                {p}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-white/40">{t("indicators.rsi.periodHint")}</p>
        </div>
      </div>
    </div>
  );
}