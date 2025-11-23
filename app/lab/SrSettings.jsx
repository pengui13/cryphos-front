"use client";

import { useState, useEffect, useMemo } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const ALL_TIMEFRAMES = ["1m", "5m", "15m", "30m", "1h", "1d"];

const DEFAULTS = {
  mode: "both",                 // "rolling" | "pivots" | "both"
  intervals: ["5m", "15m", "1h"],
  // Rolling High/Low
  lookback: 50,                 // n for rolling hh/ll
  levels_count: 5,              // how many last levels to keep
  // Zones
  zone_mode: "atr",             // "atr" | "fixed"
  atr_period: 14,
  atr_mult: 0.75,               // width = atr_mult * ATR(atr_period)
  fixed_width: 0.002,           // as fraction (0.2% of price)
  merge_dist_atr: 0.5,          // merge levels closer than 0.5*ATR
  // Pivots
  pivot_type: "classic",        // "classic" | "fibo" | "woodie" | "camarilla"
  pivot_tf: "daily",            // "daily" | "weekly" | "monthly"
  // VWAP filter (optional)
  vwap_enabled: true,
  vwap_bands: 1,                // std deviations: 0 (center only)–3
};

const PRESETS = {
  aggressive: {
    label: "Aggressive",
    mode: "both",
    intervals: ["1m", "5m", "15m"],
    lookback: 20,
    levels_count: 8,
    zone_mode: "atr",
    atr_period: 14,
    atr_mult: 0.6,
    fixed_width: 0.0015,
    merge_dist_atr: 0.4,
    pivot_type: "classic",
    pivot_tf: "daily",
    vwap_enabled: true,
    vwap_bands: 1,
    note: "Больше уровней, чаще сигналы",
  },
  balanced: {
    label: "Balanced",
    mode: "both",
    intervals: ["5m", "15m", "1h"],
    lookback: 50,
    levels_count: 6,
    zone_mode: "atr",
    atr_period: 14,
    atr_mult: 0.75,
    fixed_width: 0.002,
    merge_dist_atr: 0.5,
    pivot_type: "classic",
    pivot_tf: "daily",
    vwap_enabled: true,
    vwap_bands: 1,
    note: "Стандартный набор для большинства рынков",
  },
  defensive: {
    label: "Defensive",
    mode: "both",
    intervals: ["15m", "30m", "1h", "1d"],
    lookback: 100,
    levels_count: 4,
    zone_mode: "atr",
    atr_period: 21,
    atr_mult: 1.0,
    fixed_width: 0.003,
    merge_dist_atr: 0.75,
    pivot_type: "classic",
    pivot_tf: "weekly",
    vwap_enabled: false,
    vwap_bands: 1,
    note: "Меньше шума, сильнее зоны",
  },
};

export default function SrSettings({
  enabled,
  setEnabled,
  settings,
  setSettings,
}) {
  // state
  const [preset, setPreset] = useState(null);
  const [intervals, setIntervals] = useState(settings?.intervals ?? DEFAULTS.intervals);
  const [mode, setMode] = useState(settings?.mode ?? DEFAULTS.mode);
  const [lookback, setLookback] = useState(settings?.lookback ?? DEFAULTS.lookback);
  const [levelsCount, setLevelsCount] = useState(settings?.levels_count ?? DEFAULTS.levels_count);

  const [zoneMode, setZoneMode] = useState(settings?.zone_mode ?? DEFAULTS.zone_mode);
  const [atrPeriod, setAtrPeriod] = useState(settings?.atr_period ?? DEFAULTS.atr_period);
  const [atrMult, setAtrMult] = useState(settings?.atr_mult ?? DEFAULTS.atr_mult);
  const [fixedWidth, setFixedWidth] = useState(settings?.fixed_width ?? DEFAULTS.fixed_width);
  const [mergeDistAtr, setMergeDistAtr] = useState(settings?.merge_dist_atr ?? DEFAULTS.merge_dist_atr);

  const [pivotType, setPivotType] = useState(settings?.pivot_type ?? DEFAULTS.pivot_type);
  const [pivotTf, setPivotTf] = useState(settings?.pivot_tf ?? DEFAULTS.pivot_tf);

  const [vwapEnabled, setVwapEnabled] = useState(settings?.vwap_enabled ?? DEFAULTS.vwap_enabled);
  const [vwapBands, setVwapBands] = useState(settings?.vwap_bands ?? DEFAULTS.vwap_bands);

  // derive matched preset label
  const matchedPreset = useMemo(() => {
    const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    const probe = (p) => {
      const x = PRESETS[p];
      return (
        x.mode === mode &&
        eq(x.intervals, intervals) &&
        x.lookback === lookback &&
        x.levels_count === levelsCount &&
        x.zone_mode === zoneMode &&
        x.atr_period === atrPeriod &&
        Number(x.atr_mult).toFixed(3) === Number(atrMult).toFixed(3) &&
        Number(x.fixed_width).toFixed(4) === Number(fixedWidth).toFixed(4) &&
        Number(x.merge_dist_atr).toFixed(3) === Number(mergeDistAtr).toFixed(3) &&
        x.pivot_type === pivotType &&
        x.pivot_tf === pivotTf &&
        x.vwap_enabled === vwapEnabled &&
        x.vwap_bands === vwapBands
      );
    };
    if (probe("aggressive")) return "aggressive";
    if (probe("balanced")) return "balanced";
    if (probe("defensive")) return "defensive";
    return "custom";
  }, [
    mode, intervals, lookback, levelsCount,
    zoneMode, atrPeriod, atrMult, fixedWidth, mergeDistAtr,
    pivotType, pivotTf, vwapEnabled, vwapBands
  ]);

  // persist upwards
  useEffect(() => {
    setSettings?.({
      mode,
      intervals,
      lookback,
      levels_count: levelsCount,
      zone_mode: zoneMode,
      atr_period: atrPeriod,
      atr_mult: atrMult,
      fixed_width: fixedWidth,
      merge_dist_atr: mergeDistAtr,
      pivot_type: pivotType,
      pivot_tf: pivotTf,
      vwap_enabled: vwapEnabled,
      vwap_bands: vwapBands,
    });
  }, [
    mode, intervals, lookback, levelsCount, zoneMode, atrPeriod, atrMult,
    fixedWidth, mergeDistAtr, pivotType, pivotTf, vwapEnabled, vwapBands, setSettings
  ]);

  function applyPreset(k) {
    const p = PRESETS[k];
    setPreset(k);
    setMode(p.mode);
    setIntervals(p.intervals);
    setLookback(p.lookback);
    setLevelsCount(p.levels_count);
    setZoneMode(p.zone_mode);
    setAtrPeriod(p.atr_period);
    setAtrMult(p.atr_mult);
    setFixedWidth(p.fixed_width);
    setMergeDistAtr(p.merge_dist_atr);
    setPivotType(p.pivot_type);
    setPivotTf(p.pivot_tf);
    setVwapEnabled(p.vwap_enabled);
    setVwapBands(p.vwap_bands);
  }

  function toggleTf(tf) {
    setIntervals((cur) => {
      const on = cur.includes(tf);
      const next = on ? cur.filter((x) => x !== tf) : [...cur, tf];
      return next.length ? next : cur;
    });
  }

  const chips = [];
  chips.push(mode === "both" ? "Rolling+Pivots" : mode === "rolling" ? "Rolling" : "Pivots");
  chips.push(`${levelsCount} lvls`);
  chips.push(zoneMode === "atr" ? `Zone: ${atrMult}×ATR(${atrPeriod})` : `Zone: ${(fixedWidth*100).toFixed(2)}%`);
  chips.push(`Merge < ${mergeDistAtr}×ATR`);
  chips.push(`Pivots: ${pivotTf} ${pivotType}`);
  if (vwapEnabled) chips.push(`VWAP ±${vwapBands}σ`);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Support/Resistance</h2>
        </div>
        <button
          onClick={() => setEnabled?.(!enabled)}
          className={`group inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors
          ${enabled ? "border-[#e3b8ff]/40 bg-[#e3b8ff]/10 text-[#e3b8ff]"
                    : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"}`}
          aria-pressed={enabled}
          aria-expanded={enabled}
          aria-controls="sr-sections"
        >
          <span className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${enabled ? "bg-[#e3b8ff]" : "bg-white/20"}`}>
            <span className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-black transition-transform ${enabled ? "translate-x-3.5" : "translate-x-0"}`} />
          </span>
          {enabled ? "Enabled" : "Disabled"}
        </button>
      </div>

      <div
        id="sr-sections"
        className={`transition-all duration-300 ease-out ${
          enabled ? "max-h-[4000px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-1 pointer-events-none select-none"
        } overflow-hidden space-y-8`}
      >
        {/* Presets */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Mode / Presets</h3>
            <span className="text-xs text-white/50">
              {matchedPreset === "custom" ? "Custom" : PRESETS[matchedPreset].label}
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
                    active ? "border-[#e3b8ff]/60 bg-[#e3b8ff]/10"
                           : "border-white/10 bg-white/5 hover:bg-white/10",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${active ? "text-[#e3b8ff]" : "text-white"}`}>{p.label}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded border border-white/10 text-white/60">
                      {p.mode} • n={p.lookback}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-white/60">{p.note}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {p.intervals.map((tf) => (
                      <span key={tf} className={`text-[11px] px-2 py-0.5 rounded border ${active ? "border-[#e3b8ff]/40 text-[#e3b8ff]" : "border-white/10 text-white/60"}`}>
                        {tf}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeframes + Mode */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-white">Timeframes</h3>
              <p className="text-white/60 text-sm">Интервалы анализа</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {ALL_TIMEFRAMES.map((tf) => {
                const on = intervals.includes(tf);
                return (
                  <button
                    key={tf}
                    onClick={() => toggleTf(tf)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                      on ? "border-[#e3b8ff]/40 bg-[#e3b8ff]/10 text-[#e3b8ff]"
                         : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {tf}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-white">Source</h3>
              <p className="text-white/60 text-sm">Что строим как уровни</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["rolling","pivots","both"].map((m) => {
                const on = mode === m;
                return (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`rounded-lg px-3 py-2 text-sm border transition-all ${
                      on ? "border-[#e3b8ff]/40 bg-[#e3b8ff]/10 text-[#e3b8ff]"
                         : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rolling params */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-white font-medium mb-4">Rolling High/Low</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm text-white/70 mb-2">Lookback (n)</label>
              <div className="grid grid-cols-5 gap-2">
                {[20, 50, 100, 150, 200].map((n) => {
                  const on = lookback === n;
                  return (
                    <button
                      key={n}
                      onClick={() => setLookback(n)}
                      className={`rounded-lg px-3 py-2 text-sm border transition-all ${
                        on ? "border-[#e3b8ff]/40 bg-[#e3b8ff]/10 text-[#e3b8ff]"
                           : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-white/50">n=50 — сбалансировано для свинга.</p>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Levels kept</label>
              <input
                type="number"
                min={1}
                max={20}
                value={levelsCount}
                onChange={(e) => setLevelsCount(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
                className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm text-white"
              />
              <p className="mt-2 text-xs text-white/50">Сколько последних уровней показывать/использовать.</p>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Merge distance (×ATR)</label>
              <Slider
                min={0.2}
                max={1.5}
                step={0.05}
                value={mergeDistAtr}
                onChange={(v) => setMergeDistAtr(v)}
                trackStyle={[{ height: 6, borderRadius: 3 }]}
                railStyle={{ height: 6, borderRadius: 3 }}
                handleStyle={[{ height: 18, width: 18, marginTop: -6 }]}
              />
              <div className="mt-2 text-xs text-white/60">{mergeDistAtr.toFixed(2)} × ATR</div>
            </div>
          </div>
        </div>

        {/* Zones */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-white font-medium mb-4">Zone Width</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="mb-2 text-sm text-white/70">Mode</div>
              <div className="grid grid-cols-2 gap-2">
                {["atr","fixed"].map((z) => {
                  const on = zoneMode === z;
                  return (
                    <button
                      key={z}
                      onClick={() => setZoneMode(z)}
                      className={`rounded-lg px-3 py-2 text-sm border transition-all ${
                        on ? "border-[#e3b8ff]/40 bg-[#e3b8ff]/10 text-[#e3b8ff]"
                           : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      {z.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            {zoneMode === "atr" ? (
              <div className="grid gap-3">
                <div>
                  <label className="block text-sm text-white/70 mb-2">ATR period</label>
                  <div className="grid grid-cols-5 gap-2">
                    {[7, 10, 14, 21, 28].map((p) => {
                      const on = atrPeriod === p;
                      return (
                        <button
                          key={p}
                          onClick={() => setAtrPeriod(p)}
                          className={`rounded-lg px-3 py-2 text-sm border transition-all ${
                            on ? "border-[#e3b8ff]/40 bg-[#e3b8ff]/10 text-[#e3b8ff]"
                               : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Width = k × ATR</label>
                  <Slider
                    min={0.25}
                    max={2.0}
                    step={0.05}
                    value={atrMult}
                    onChange={(v) => setAtrMult(v)}
                    trackStyle={[{ height: 6, borderRadius: 3 }]}
                    railStyle={{ height: 6, borderRadius: 3 }}
                    handleStyle={[{ height: 18, width: 18, marginTop: -6 }]}
                  />
                  <div className="mt-2 text-xs text-white/60">{atrMult.toFixed(2)} × ATR({atrPeriod})</div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm text-white/70 mb-2">Fixed width (% of price)</label>
                <Slider
                  min={0.0005}
                  max={0.01}
                  step={0.0005}
                  value={fixedWidth}
                  onChange={(v) => setFixedWidth(v)}
                  trackStyle={[{ height: 6, borderRadius: 3 }]}
                  railStyle={{ height: 6, borderRadius: 3 }}
                  handleStyle={[{ height: 18, width: 18, marginTop: -6 }]}
                />
                <div className="mt-2 text-xs text-white/60">{(fixedWidth*100).toFixed(2)}%</div>
              </div>
            )}
          </div>
        </div>

        {/* Pivots */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-white font-medium mb-4">Pivot Points</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="mb-2 text-sm text-white/70">Type</div>
              <div className="grid grid-cols-4 gap-2">
                {["classic","fibo","woodie","camarilla"].map((t) => {
                  const on = pivotType === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setPivotType(t)}
                      className={`rounded-lg px-3 py-2 text-sm border transition-all ${
                        on ? "border-[#e3b8ff]/40 bg-[#e3b8ff]/10 text-[#e3b8ff]"
                           : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="mb-2 text-sm text-white/70">Period</div>
              <div className="grid grid-cols-3 gap-2">
                {["daily","weekly","monthly"].map((tf) => {
                  const on = pivotTf === tf;
                  return (
                    <button
                      key={tf}
                      onClick={() => setPivotTf(tf)}
                      className={`rounded-lg px-3 py-2 text-sm border transition-all ${
                        on ? "border-[#e3b8ff]/40 bg-[#e3b8ff]/10 text-[#e3b8ff]"
                           : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      {tf}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-white/50">Интрадей — daily; свинг — weekly/monthly.</p>
            </div>
          </div>
        </div>

        {/* VWAP filter */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">VWAP filter</h3>
            <button
              onClick={() => setVwapEnabled((v) => !v)}
              className={`rounded-lg px-3 py-1.5 text-sm border transition-all ${
                vwapEnabled ? "border-[#e3b8ff]/40 bg-[#e3b8ff]/10 text-[#e3b8ff]"
                            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {vwapEnabled ? "On" : "Off"}
            </button>
          </div>
          <div className={`mt-4 ${vwapEnabled ? "opacity-100" : "opacity-40"}`}>
            <label className="block text-sm text-white/70 mb-2">Bands (σ)</label>
            <div className="grid grid-cols-5 gap-2">
              {[0,1,2,3].map((k) => {
                const on = vwapBands === k;
                return (
                  <button
                    key={k}
                    onClick={() => setVwapBands(k)}
                    className={`rounded-lg px-3 py-2 text-sm border transition-all ${
                      on ? "border-[#e3b8ff]/40 bg-[#e3b8ff]/10 text-[#e3b8ff]"
                         : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    ±{k}σ
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-white/50">Торговать только при близости к VWAP/полосам.</p>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-white font-medium mb-3">Current Configuration</h3>
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <span key={c} className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/80">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#e3b8ff]" />
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
