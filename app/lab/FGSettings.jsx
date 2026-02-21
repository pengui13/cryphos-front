"use client";
import { useEffect, useMemo, useState } from "react";
import CryphosFearGreedGauge from "../components/Fng";

const PRESETS = {
  cautious:  { label: "Cautious",  lower: 20, upper: 80, period: 3, note: "Filters extremes, safer entries" },
  balanced:  { label: "Balanced",  lower: 25, upper: 75, period: 2, note: "General purpose thresholds" },
  aggressive:{ label: "Aggressive",lower: 15, upper: 85, period: 1, note: "More signals, less filtering" },
};

const FG_URL = "https://api.alternative.me/fng/?limit=1";

export default function FGSettings({ enabled, setEnabled, settings, setSettings }) {
  const [preset, setPreset] = useState(null);
  const [lower, setLower] = useState(settings?.lower ?? 20);
  const [upper, setUpper] = useState(settings?.upper ?? 80);
  const [period, setperiod] = useState(settings?.period ?? 2);

  const [fgValue, setFgValue] = useState(null);
  const [loading, setLoading] = useState(false);

  // Match preset or “custom”
  const matchedPreset = useMemo(() => {
    const isMatch = (k) => {
      const p = PRESETS[k];
      return p.lower === lower && p.upper === upper && p.period === period;
    };
    if (isMatch("cautious")) return "cautious";
    if (isMatch("balanced")) return "balanced";
    if (isMatch("aggressive")) return "aggressive";
    return "custom";
  }, [lower, upper, period]);

  // Push up (no intervals)
  useEffect(() => {
    setSettings({
      type: "FG",
      lower,
      upper,
      period, // maps to API ?limit=
    });
  }, [lower, upper, period, setSettings]);

  // Preview fetch (latest)
  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(FG_URL)
      .then((r) => r.json())
      .then((d) => {
        const v = Number(d?.data?.[0]?.value ?? NaN);
        if (alive) setFgValue(Number.isFinite(v) ? v : null);
      })
      .catch(() => alive && setFgValue(null))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  function applyPreset(key) {
    const p = PRESETS[key];
    setPreset(key);
    setLower(p.lower);
    setUpper(p.upper);
    setperiod(p.period);
  }

  const zone =
    fgValue == null ? "—" :
    fgValue < 20 ? "Extreme Fear" :
    fgValue < 40 ? "Fear" :
    fgValue < 60 ? "Neutral" :
    fgValue < 80 ? "Greed" : "Extreme Greed";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Fear & Greed</h2>
          <p className="text-white/60 text-sm">Daily index (0–100). Configure bounds and period (API limit).</p>
        </div>

        <button
          onClick={() => setEnabled?.(!enabled)}
          className={`group inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors
          ${enabled ? "border-[#e3b8ff]/40 bg-[#e3b8ff]/10 text-[#e3b8ff]" : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"}`}
          aria-pressed={enabled}
          aria-expanded={enabled}
          aria-controls="fg-sections"
        >
          <span className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${enabled ? "bg-[#e3b8ff]" : "bg-white/20"}`}>
            <span className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-black transition-transform ${enabled ? "translate-x-3.5" : "translate-x-0"}`} />
          </span>
          {enabled ? "Enabled" : "Disabled"}
        </button>
      </div>

      {/* Collapsible */}
      <div
        id="fg-sections"
        className={`transition-all duration-300 ease-out ${
          enabled ? "max-h-[4000px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-1 pointer-events-none select-none"
        } overflow-hidden space-y-8`}
      >
        {/* Live preview */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              <CryphosFearGreedGauge
                value={50 ?? 50}
                size={160}
                thickness={12}
                gapDeg={4}
                sectionColors={["#2a0134", "#6a2e8e", "#2a7d2e"]}
                progressColor="#ffffff"
                showLabel={false}
              />
            </div>
            <div className="select-none">
              <div className="text-[28px] font-semibold text-white leading-none">{loading ? "…" : fgValue ?? "—"}</div>
              <div className="text-[13px] text-white/65">{zone}</div>
              <div className="mt-2 text-xs text-white/50">
                Bounds: <span className="text-white">{lower}</span>–<span className="text-white">{upper}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Presets */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Mode</h3>
            <span className="text-xs text-white/50">
              {matchedPreset === "custom" ? "Custom" : PRESETS[matchedPreset].label}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.entries(PRESETS).map(([key, p]) => {
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
                      {p.lower}–{p.upper} • L{p.period}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-white/60">{p.note}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-white">Bounds & period</h3>
            <p className="text-white/60 text-sm">Set thresholds and how many recent days to consider.</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[["Lower", lower, setLower], ["Upper", upper, setUpper]].map(([label, val, setter]) => (
              <div key={label}>
                <label className="block text-xs text-white/60 mb-1">{label}</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={val}
                  onChange={(e) => setter(Math.max(0, Math.min(100, Number(e.target.value))))}
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#e3b8ff]/60"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs text-white/60 mb-1">period (days)</label>
              <input
                type="number"
                min={1}
                max={30}
                value={period}
                onChange={(e) => setperiod(Math.max(1, Math.min(30, Number(e.target.value))))}
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#e3b8ff]/60"
              />
            </div>
          </div>

          <p className="mt-2 text-xs text-white/50">
            <code>?limit=</code> equals period. You can use the latest only (L1) or average the last N values on the backend.
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
              <span className="text-white/60">Bounds:</span>
              <p className="text-white mt-1 font-medium">{lower} – {upper}</p>
            </div>
            <div>
              <span className="text-white/60">period:</span>
              <p className="text-white mt-1 font-medium">L{period}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
