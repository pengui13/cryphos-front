import { useState, useEffect, useMemo } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const ALL_TIMEFRAMES = ["1m", "5m", "15m", "30m", "1h", "1d"];

const PRESETS = {
  aggressive: {
    label: "Aggressive",
    min: 25,
    max: 75,
    period: 7,
    intervals: ["1m", "5m", "15m"],
    note: "Faster signals, higher trade frequency",
  },
  balanced: {
    label: "Balanced",
    min: 30,
    max: 70,
    period: 14,
    intervals: ["5m", "15m", "1h"],
    note: "Standard RSI, good for most markets",
  },
  defensive: {
    label: "Defensive",
    min: 35,
    max: 65,
    period: 21,
    intervals: ["15m", "30m", "1h", "1d"],
    note: "Fewer signals, smoother noise",
  },
};

export default function RsiSettings({
  enabled,
  setEnabled,
  step,
  setStep,
  settings,
  setSettings,
}) {
  const [preset, setPreset] = useState(null);
  const [selectedTimeframes, setSelectedTimeframes] = useState(
    settings?.intervals?.length ? settings.intervals : ["1m"]
  );
  const [rsiValues, setRsiValues] = useState([
    settings?.min ?? 30,
    settings?.max ?? 70,
  ]);
  const [period, setPeriod] = useState(settings?.period ?? 14);

  const matchedPreset = useMemo(() => {
    const match = (k) => {
      const p = PRESETS[k];
      const sameLevels = p.min === rsiValues[0] && p.max === rsiValues[1];
      const samePeriod = p.period === period;
      const sameTfs =
        p.intervals.length === selectedTimeframes.length &&
        p.intervals.every((t) => selectedTimeframes.includes(t));
      return sameLevels && samePeriod && sameTfs;
    };
    if (match("aggressive")) return "aggressive";
    if (match("balanced")) return "balanced";
    if (match("defensive")) return "defensive";
    return "custom";
  }, [rsiValues, period, selectedTimeframes]);

  useEffect(() => {
    setSettings({
      period,
      max: rsiValues[1],
      min: rsiValues[0],
      intervals: selectedTimeframes,
    });
  }, [period, rsiValues, selectedTimeframes, setSettings]);

  function applyPreset(k) {
    const p = PRESETS[k];
    setPreset(k);
    setRsiValues([p.min, p.max]);
    setPeriod(p.period);
    setSelectedTimeframes(p.intervals);
  }

  function toggleTimeframe(tf) {
    setSelectedTimeframes((cur) => {
      const exists = cur.includes(tf);
      const next = exists ? cur.filter((t) => t !== tf) : [...cur, tf];
      return next.length ? next : cur; // keep at least one
    });
  }

  function selectAll() {
    setSelectedTimeframes([...ALL_TIMEFRAMES]);
  }
  function selectNone() {
    setSelectedTimeframes(["1m"]); // keep at least one
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Configure RSI</h2>
          <p className="text-white/60 text-sm">
            Tune thresholds, period, and analysis intervals
          </p>
        </div>

        {/* Enable switch */}
        <button
          onClick={() => setEnabled?.(!enabled)}
          className={`group inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors
          ${
            enabled
              ? "border-[#e3b8ff]/40 bg-[#e3b8ff]/10 text-[#e3b8ff]"
              : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
          }`}
          aria-pressed={enabled}
          aria-expanded={enabled}
          aria-controls="rsi-sections"
        >
          <span
            className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${
              enabled ? "bg-[#e3b8ff]" : "bg-white/20"
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-black transition-transform ${
                enabled ? "translate-x-3.5" : "translate-x-0"
              }`}
            />
          </span>
          {enabled ? "Enabled" : "Disabled"}
        </button>
      </div>

      {/* Collapsible sections */}
      <div
        id="rsi-sections"
        className={`transition-all duration-300 ease-out ${
          enabled
            ? "max-h-[4000px] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-1 pointer-events-none select-none"
        } overflow-hidden space-y-8`}
      >
        {/* Preset selector */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Mode</h3>
            <span className="text-xs text-white/50">
              {matchedPreset === "custom"
                ? "Custom"
                : PRESETS[matchedPreset].label}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.keys(PRESETS).map((k) => {
              const p = PRESETS[k];
              const active = matchedPreset === k;
              return (
                <button
                  key={k}
                  onClick={() => applyPreset(k)}
                  className={[
                    "group rounded-xl border p-4 text-left transition-all",
                    active
                      ? "border-[#e3b8ff]/60 bg-[#e3b8ff]/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-semibold ${
                        active ? "text-[#e3b8ff]" : "text-white"
                      }`}
                    >
                      {p.label}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded border border-white/10 text-white/60">
                      RSI {p.min}-{p.max} • {p.period}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-white/60">{p.note}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {p.intervals.map((tf) => (
                      <span
                        key={tf}
                        className={`text-[11px] px-2 py-0.5 rounded border ${
                          active
                            ? "border-[#e3b8ff]/40 text-[#e3b8ff]"
                            : "border-white/10 text-white/60"
                        }`}
                      >
                        {tf}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeframes */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Timeframes</h3>
              <p className="text-white/60 text-sm">Choose analysis intervals</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="text-xs px-3 py-1 rounded border border-white/15 text-white/70 hover:bg-white/10 transition-colors"
              >
                All
              </button>
              <button
                onClick={selectNone}
                className="text-xs px-3 py-1 rounded border border-white/15 text-white/70 hover:bg-white/10 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {ALL_TIMEFRAMES.map((tf) => {
              const on = selectedTimeframes.includes(tf);
              return (
                <button
                  key={tf}
                  onClick={() => toggleTimeframe(tf)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                    on
                      ? "border-[#e3b8ff]/40 bg-[#e3b8ff]/10 text-[#e3b8ff]"
                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  {tf}
                </button>
              );
            })}
          </div>
        </div>

        {/* Levels */}
        <div>
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-white">Levels</h3>
            <p className="text-white/60 text-sm">Set buy/sell signal thresholds</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="mb-6">
              <Slider
                range
                min={0}
                max={100}
                value={rsiValues}
                onChange={(v) => setRsiValues(v)}
                allowCross={false}
                pushable={3}
                trackStyle={[
                  { backgroundColor: "#e3b8ff", height: 6, borderRadius: 3 },
                ]}
                railStyle={{
                  backgroundColor: "rgba(255,255,255,0.12)",
                  height: 6,
                  borderRadius: 3,
                }}
                handleStyle={[
                  {
                    backgroundColor: "#0F1115",
                    borderColor: "#e3b8ff",
                    boxShadow: "none",
                    height: 18,
                    width: 18,
                    marginTop: -6,
                    borderWidth: 2,
                  },
                  {
                    backgroundColor: "#0F1115",
                    borderColor: "#6a2e8e",
                    boxShadow: "none",
                    height: 18,
                    width: 18,
                    marginTop: -6,
                    borderWidth: 2,
                  },
                ]}
                dotStyle={{ display: "none" }}
                activeDotStyle={{ display: "none" }}
                marks={{ 0: "0", 50: "50", 100: "100" }}
              />
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
                    <span className="text-green-300 font-medium">
                      Buy when RSI &lt; {rsiValues[0]}
                    </span>
                  </div>
                </div>
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
                    <span className="text-red-300 font-medium">
                      Sell when RSI &gt; {rsiValues[1]}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Period quick picks */}
            <div>
              <label className="block text-sm text-white/70 mb-2">
                Calculation Period
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[7, 9, 14, 17, 21].map((p) => {
                  const on = period === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`rounded-lg px-3 py-2 text-sm border transition-all ${
                        on
                          ? "border-[#e3b8ff]/40 bg-[#e3b8ff]/10 text-[#e3b8ff]"
                          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                      aria-pressed={on}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-white/50">
                14 is the standard default period.
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-white font-medium mb-4">Current Configuration</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-white/60">Mode:</span>
              <p className="text-white mt-1 font-medium">
                {matchedPreset === "custom"
                  ? "Custom"
                  : PRESETS[matchedPreset].label}
              </p>
            </div>
            <div>
              <span className="text-white/60">Levels:</span>
              <p className="text-white mt-1 font-medium">
                {rsiValues[0]} / {rsiValues[1]}
              </p>
            </div>
            <div>
              <span className="text-white/60">Period & Timeframes:</span>
              <p className="text-white mt-1 font-medium">
                {period} • {selectedTimeframes.join(", ")}
              </p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
