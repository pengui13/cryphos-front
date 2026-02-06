import { useState, useEffect } from "react";

const ALL_TIMEFRAMES = ["1m", "5m", "15m", "30m", "1h", "1d"];

export default function SupportResistanceSettings({
  enabled,
  setEnabled,
  settings,
  setSettings,
}) {
  const [selectedTimeframes, setSelectedTimeframes] = useState(
    settings?.intervals?.length ? settings.intervals : ["1h"]
  );
  const [lookbackPeriod, setLookbackPeriod] = useState(
    settings?.lookback_period ?? 50
  );
  const [sensitivity, setSensitivity] = useState(
    settings?.sensitivity ?? "medium"
  );

  useEffect(() => {
    setSettings({
      lookback_period: lookbackPeriod,
      sensitivity,
      intervals: selectedTimeframes,
    });
  }, [lookbackPeriod, sensitivity, selectedTimeframes, setSettings]);

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

  const sensitivities = [
    { value: "low", label: "Low", desc: "Fewer, stronger levels" },
    { value: "medium", label: "Medium", desc: "Balanced" },
    { value: "high", label: "High", desc: "More levels" },
  ];

  return (
    <div className="space-y-6">
      {/* Header with toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Support & Resistance
          </h3>
          <p className="mt-1 text-sm text-white/50">
            Key price levels
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

        {/* Sensitivity */}
        <div>
          <label className="mb-3 block text-sm font-medium text-white/70">
            Detection Sensitivity
          </label>

          <div className="grid gap-3 md:grid-cols-3">
            {sensitivities.map((sens) => {
              const on = sensitivity === sens.value;
              return (
                <button
                  key={sens.value}
                  onClick={() => setSensitivity(sens.value)}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    on
                      ? "border-white bg-white/5"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <div className="mb-1 font-semibold text-white">
                    {sens.label}
                  </div>
                  <div className="text-xs text-white/50">{sens.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lookback Period */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <label className="mb-3 block text-sm font-medium text-white/70">
            Lookback Period (Candles)
          </label>

          <div className="grid grid-cols-4 gap-2">
            {[30, 50, 100, 200].map((period) => {
              const on = lookbackPeriod === period;
              return (
                <button
                  key={period}
                  onClick={() => setLookbackPeriod(period)}
                  className={`rounded-lg py-2.5 text-sm font-semibold transition-all ${
                    on
                      ? "bg-white text-black"
                      : "bg-white/10 text-white/60 hover:bg-white/15"
                  }`}
                >
                  {period}
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-xs text-white/40">
            More candles = more levels
          </p>
        </div>

        {/* Signal Types */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-white/70">Signal Types</div>

          <div className="flex items-start gap-3 rounded-xl bg-green-500/5 p-3 ring-1 ring-green-500/20">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/20">
              <div className="h-2 w-2 rounded-full bg-green-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white/90">
                Support Hit
              </div>
              <div className="text-xs text-white/50">
                Price bounces up → Buy signal
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-red-500/5 p-3 ring-1 ring-red-500/20">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20">
              <div className="h-2 w-2 rounded-full bg-red-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white/90">
                Resistance Hit
              </div>
              <div className="text-xs text-white/50">
                Price bounces down → Sell signal
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-blue-500/5 p-3 ring-1 ring-blue-500/20">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20">
              <div className="h-2 w-2 rounded-full bg-blue-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white/90">
                Breakout
              </div>
              <div className="text-xs text-white/50">
                Price breaks through → Trend continuation
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}