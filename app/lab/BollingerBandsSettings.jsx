import { useState, useEffect } from "react";

const ALL_TIMEFRAMES = ["1m", "5m", "15m", "30m", "1h", "1d"];

export default function BollingerBandsSettings({
  enabled,
  setEnabled,
  settings,
  setSettings,
}) {
  const [selectedTimeframes, setSelectedTimeframes] = useState(
    settings?.intervals?.length ? settings.intervals : ["1m"]
  );
  const [period, setPeriod] = useState(settings?.period ?? 20);
  const [stdDev, setStdDev] = useState(settings?.std_dev ?? 2);

  useEffect(() => {
    setSettings({
      period,
      std_dev: stdDev,
      intervals: selectedTimeframes,
    });
  }, [period, stdDev, selectedTimeframes, setSettings]);

  function toggleTimeframe(tf) {
    setSelectedTimeframes((cur) => {
      const exists = cur.includes(tf);
      const next = exists ? cur.filter((t) => t !== tf) : [...cur, tf];
      return next.length ? next : cur;
    });
  }

  function selectAll() {
    setSelectedTimeframes([...ALL_TIMEFRAMES]);
  }

  return (
    <div className="space-y-6">
      {/* Header with toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Bollinger Bands</h3>
          <p className="mt-1 text-sm text-white/50">
            Volatility indicator
          </p>
        </div>

        <button
          onClick={() => setEnabled?.(!enabled)}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
            enabled ? "bg-white" : "bg-white/20"
          }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-black transition-transform ${
              enabled ? "translate-x-7" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Collapsible content */}
      <div
        className={`space-y-6 transition-all duration-300 ${
          enabled
            ? "max-h-[2000px] opacity-100"
            : "pointer-events-none max-h-0 select-none opacity-0"
        } overflow-hidden`}
      >
        {/* Timeframes */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-medium text-white/70">
              Timeframes
            </label>
            <button
              onClick={selectAll}
              className="text-xs text-white/50 transition hover:text-white"
            >
              Select All
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {ALL_TIMEFRAMES.map((tf) => {
              const on = selectedTimeframes.includes(tf);
              return (
                <button
                  key={tf}
                  onClick={() => toggleTimeframe(tf)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    on
                      ? "bg-white text-black"
                      : "bg-white/10 text-white/60 hover:bg-white/15"
                  }`}
                >
                  {tf}
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Period */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <label className="mb-3 block text-sm font-medium text-white/70">
              Period (SMA)
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[10, 20, 30].map((p) => {
                const on = period === p;
                return (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`rounded-lg py-2.5 text-sm font-semibold transition-all ${
                      on
                        ? "bg-white text-black"
                        : "bg-white/10 text-white/60 hover:bg-white/15"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <p className="mt-3 text-xs text-white/40">
              20 is standard
            </p>
          </div>

          {/* Standard Deviation */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <label className="mb-3 block text-sm font-medium text-white/70">
              Standard Deviation
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[1.5, 2, 2.5].map((sd) => {
                const on = stdDev === sd;
                return (
                  <button
                    key={sd}
                    onClick={() => setStdDev(sd)}
                    className={`rounded-lg py-2.5 text-sm font-semibold transition-all ${
                      on
                        ? "bg-white text-black"
                        : "bg-white/10 text-white/60 hover:bg-white/15"
                    }`}
                  >
                    {sd}σ
                  </button>
                );
              })}
            </div>

            <p className="mt-3 text-xs text-white/40">
              2σ is standard
            </p>
          </div>
        </div>

        {/* Info box */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <div className="mb-2 text-sm font-medium text-white/80">
            How it works
          </div>
          <div className="space-y-1.5 text-xs text-white/50">
            <p>• Upper band → Potential sell (overbought)</p>
            <p>• Lower band → Potential buy (oversold)</p>
            <p>• Band squeeze → Breakout coming</p>
            <p>• Band expansion → Trend in motion</p>
          </div>
        </div>
      </div>
    </div>
  );
}