import { useState, useEffect, useMemo } from "react";
// (Optional) keep your ToggleSwitch if you prefer it; otherwise we use a built-in switch below.
// import ToggleSwitch from "./ToggleSwitch";

const ALL_TIMEFRAMES = ["1m", "5m", "15m", "30m", "1h", "1d"];

const PRESETS = {
  fast: {
    label: "Fast",
    period: 9,
    intervals: ["1m", "5m", "15m"],
    note: "Reacts quickly, more signals",
  },
  balanced: {
    label: "Balanced",
    period: 20,
    intervals: ["5m", "15m", "1h"],
    note: "General purpose, steady",
  },
  slow: {
    label: "Slow",
    period: 50,
    intervals: ["30m", "1h", "1d"],
    note: "Filters noise, fewer signals",
  },
};

export default function MaSettings({ enabled, setEnabled, settings, setSettings }) {
  const [preset, setPreset] = useState(null);
  const [selectedTimeframes, setSelectedTimeframes] = useState(
    settings?.intervals?.length ? settings.intervals : ["1m"]
  );
  const [period, setPeriod] = useState(settings?.period ?? 20);

  // Determine if current config matches a preset; else "custom"
  const matchedPreset = useMemo(() => {
    const isMatch = (key) => {
      const p = PRESETS[key];
      const samePeriod = p.period === period;
      const sameTfs =
        p.intervals.length === selectedTimeframes.length &&
        p.intervals.every((t) => selectedTimeframes.includes(t));
      return samePeriod && sameTfs;
    };
    if (isMatch("fast")) return "fast";
    if (isMatch("balanced")) return "balanced";
    if (isMatch("slow")) return "slow";
    return "custom";
  }, [period, selectedTimeframes]);

  // Push changes up
  useEffect(() => {
    setSettings({
      period,
      intervals: selectedTimeframes,
      type: "EMA", // helpful hint to backend
    });
  }, [period, selectedTimeframes, setSettings]);

  function applyPreset(key) {
    const p = PRESETS[key];
    setPreset(key);
    setPeriod(p.period);
    setSelectedTimeframes(p.intervals);
  }

  function toggleTimeframe(tf) {
    setSelectedTimeframes((cur) => {
      const exists = cur.includes(tf);
      const next = exists ? cur.filter((t) => t !== tf) : [...cur, tf];
      return next.length ? next : cur; // keep at least one selected
    });
  }

  function selectAll() {
    setSelectedTimeframes([...ALL_TIMEFRAMES]);
  }
  function resetTfs() {
    setSelectedTimeframes(["1m"]);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">EMA</h2>
          <p className="text-white/60 text-sm">Configure your Exponential Moving Average</p>
        </div>

        {/* Built-in switch matching RSI style */}
        <button
          onClick={() => setEnabled?.(!enabled)}
          className={`group inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors
          ${enabled ? "border-[#e3b8ff]/40 bg-[#e3b8ff]/10 text-[#e3b8ff]" : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"}`}
          aria-pressed={enabled}
          aria-expanded={enabled}
          aria-controls="ema-sections"
        >
          <span className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${enabled ? "bg-[#e3b8ff]" : "bg-white/20"}`}>
            <span className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-black transition-transform ${enabled ? "translate-x-3.5" : "translate-x-0"}`} />
          </span>
          {enabled ? "Enabled" : "Disabled"}
        </button>

        {/* If you prefer your ToggleSwitch: 
        <ToggleSwitch isEnabled={enabled} onToggle={() => setEnabled(!enabled)} />
        */}
      </div>

      {/* Collapsible content (only when enabled) */}
      <div
        id="ema-sections"
        className={`transition-all duration-300 ease-out ${
          enabled
            ? "max-h-[4000px] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-1 pointer-events-none select-none"
        } overflow-hidden space-y-8`}
      >
        {/* Presets */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Mode</h3>
            <span className="text-xs text-white/50">
              {matchedPreset === "custom" ? "Custom" : PRESETS[matchedPreset].label}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.keys(PRESETS).map((key) => {
              const p = PRESETS[key];
              const active = matchedPreset === key;
              return (
                <button
                  key={key}
                  onClick={() => applyPreset(key)}
                  className={[
                    "group rounded-xl border p-4 text-left transition-all",
                    active ? "border-[#e3b8ff]/60 bg-[#e3b8ff]/10" : "border-white/10 bg-white/5 hover:bg-white/10",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${active ? "text-[#e3b8ff]" : "text-white"}`}>
                      {p.label}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded border border-white/10 text-white/60">
                      {p.period} • {p.intervals.join(", ")}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-white/60">{p.note}</p>
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
                onClick={resetTfs}
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
                    on ? "border-[#e3b8ff]/40 bg-[#e3b8ff]/10 text-[#e3b8ff]" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  {tf}
                </button>
              );
            })}
          </div>
        </div>

        {/* Period quick picks */}
        <div>
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-white">Period</h3>
            <p className="text-white/60 text-sm">Choose EMA lookback</p>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {[9, 20, 50, 100, 200].map((p) => {
              const on = period === p;
              return (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`rounded-lg px-3 py-2 text-sm border transition-all ${
                    on ? "border-[#e3b8ff]/40 bg-[#e3b8ff]/10 text-[#e3b8ff]" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                  aria-pressed={on}
                >
                  {p}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-white/50">
            Tip: 9–20 works well for momentum; 50–200 for trend direction.
          </p>
        </div>

        {/* Summary */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-white font-medium mb-4">Current Configuration</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-white/60">Mode:</span>
              <p className="text-white mt-1 font-medium">
                {matchedPreset === "custom" ? "Custom" : PRESETS[matchedPreset].label}
              </p>
            </div>
            <div>
              <span className="text-white/60">Period:</span>
              <p className="text-white mt-1 font-medium">{period}</p>
            </div>
            <div>
              <span className="text-white/60">Timeframes:</span>
              <p className="text-white mt-1 font-medium">{selectedTimeframes.join(", ")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
