import { useState, useEffect } from "react";

const ALL_TIMEFRAMES = ["1m", "5m", "15m", "30m", "1h", "1d"];

const FIB_LEVELS = [0, 23.6, 38.2, 50.0, 61.8, 78.6, 100.0];

export default function FibonacciSettings({
  enabled,
  setEnabled,
  settings,
  setSettings,
}) {
  const [selectedTimeframes, setSelectedTimeframes] = useState(
    settings?.intervals?.length ? settings.intervals : ["1h"]
  );
  const [selectedLevels, setSelectedLevels] = useState(
    settings?.levels?.length ? settings.levels : [38.2, 61.8]
  );
  const [period, setperiod] = useState(settings?.period ?? 50);

  useEffect(() => {
    setSettings({
      intervals: selectedTimeframes,
      levels: selectedLevels,
      period,
    });
  }, [selectedTimeframes, selectedLevels, period, setSettings]);

  function toggleTimeframe(tf) {
    setSelectedTimeframes((cur) => {
      const next = cur.includes(tf) ? cur.filter((t) => t !== tf) : [...cur, tf];
      return next.length ? next : cur;
    });
  }

  function toggleLevel(level) {
    setSelectedLevels((cur) => {
      const next = cur.includes(level)
        ? cur.filter((l) => l !== level)
        : [...cur, level].sort((a, b) => a - b);
      return next.length ? next : cur;
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-white">Fibonacci</h3>
          <p className="mt-1 text-sm text-white/50">Retracement Levels</p>
        </div>
        <button
          onClick={() => setEnabled?.(!enabled)}
          className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors ${
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
            <label className="text-sm font-medium text-white/70">Timeframes</label>
            <button
              onClick={() => setSelectedTimeframes([...ALL_TIMEFRAMES])}
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
                    on ? "bg-white text-black" : "bg-white/10 text-white/60 hover:bg-white/15"
                  }`}
                >
                  {tf}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fib Levels */}
        <div>
          <label className="mb-3 block text-sm font-medium text-white/70">
            Active Retracement Levels
          </label>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
            {FIB_LEVELS.map((level) => {
              const on = selectedLevels.includes(level);
              const pct = level.toFixed(1);
              const isKey = [38.2, 50.0, 61.8].includes(level);
              return (
                <button
                  key={level}
                  onClick={() => toggleLevel(level)}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 transition-all ${
                    on ? "bg-white/10 ring-1 ring-white/20" : "hover:bg-white/5"
                  }`}
                >
                  <div className={`h-2 w-2 shrink-0 rounded-full transition-colors ${on ? "bg-white" : "bg-white/20"}`} />
                  <span className={`w-12 text-left text-sm font-semibold shrink-0 ${on ? "text-white" : "text-white/40"}`}>
                    {pct}%
                  </span>
                  {isKey && (
                    <span className="shrink-0 rounded-md bg-yellow-500/10 px-1.5 py-0.5 text-xs text-yellow-400 ring-1 ring-yellow-500/20">
                      Key
                    </span>
                  )}
                  <div
                    className="h-px flex-1 mx-1"
                    style={{
                      background: on
                        ? `rgba(255,255,255,${0.1 + (level / 100) * 0.3})`
                        : "rgba(255,255,255,0.05)",
                    }}
                  />
                  <span className={`text-xs shrink-0 ${on ? "text-white/50" : "text-white/20"}`}>
                    {level.toFixed(1)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* period period */}
        <div>
          <label className="mb-3 block text-sm font-medium text-white/70">
            Swing period (candles)
          </label>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {[20, 30, 50, 100, 200].map((p) => {
              const on = period === p;
              return (
                <button
                  key={p}
                  onClick={() => setperiod(p)}
                  className={`rounded-lg py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                    on ? "bg-white text-black" : "bg-white/10 text-white/60 hover:bg-white/15"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-white/40">
            How far back to detect swing highs/lows
          </p>
        </div>
      </div>
    </div>
  );
}