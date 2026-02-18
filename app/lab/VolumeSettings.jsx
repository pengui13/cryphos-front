import { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const ALL_TIMEFRAMES = ["1m", "5m", "15m", "30m", "1h", "1d"];

const SIGNALS = [
  { id: "spike", label: "Volume Spike", desc: "Sudden volume surge above threshold" },
  { id: "divergence", label: "Price Divergence", desc: "Price moves without volume confirmation" },
  { id: "vwap", label: "VWAP Cross", desc: "Price crosses volume-weighted average" },
  { id: "obv", label: "OBV Trend", desc: "On-Balance Volume momentum" },
];

export default function VolumeSettings({
  enabled,
  setEnabled,
  settings,
  setSettings,
}) {
  const [selectedTimeframes, setSelectedTimeframes] = useState(
    settings?.intervals?.length ? settings.intervals : ["1h"]
  );
  const [spikeThreshold, setSpikeThreshold] = useState(settings?.spike_threshold ?? 2);
  const [maPeriod, setMaPeriod] = useState(settings?.ma_period ?? 20);
  const [selectedSignals, setSelectedSignals] = useState(
    settings?.signals?.length ? settings.signals : ["spike", "vwap"]
  );

  useEffect(() => {
    setSettings({
      intervals: selectedTimeframes,
      spike_threshold: spikeThreshold,
      ma_period: maPeriod,
      signals: selectedSignals,
    });
  }, [selectedTimeframes, spikeThreshold, maPeriod, selectedSignals, setSettings]);

  function toggleTimeframe(tf) {
    setSelectedTimeframes((cur) => {
      const next = cur.includes(tf) ? cur.filter((t) => t !== tf) : [...cur, tf];
      return next.length ? next : cur;
    });
  }

  function toggleSignal(id) {
    setSelectedSignals((cur) => {
      const next = cur.includes(id) ? cur.filter((s) => s !== id) : [...cur, id];
      return next.length ? next : cur;
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-white">Volume</h3>
          <p className="mt-1 text-sm text-white/50">Volume Analysis & Confirmation</p>
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

        {/* Spike threshold */}
        <div>
          <label className="mb-4 block text-sm font-medium text-white/70">
            Spike Threshold
          </label>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="mb-6 px-1 sm:px-2">
              <Slider
                min={1.2}
                max={5}
                step={0.1}
                value={spikeThreshold}
                onChange={(v) => setSpikeThreshold(v)}
                trackStyle={{ backgroundColor: "#fff", height: 4, borderRadius: 2 }}
                railStyle={{ backgroundColor: "rgba(255,255,255,0.1)", height: 4, borderRadius: 2 }}
                handleStyle={{
                  backgroundColor: "#fff",
                  border: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  height: 16,
                  width: 16,
                  marginTop: -6,
                }}
                marks={{
                  1.2: { style: { color: "#ffffff40", fontSize: "11px" }, label: "1.2x" },
                  3: { style: { color: "#ffffff40", fontSize: "11px" }, label: "3x" },
                  5: { style: { color: "#ffffff40", fontSize: "11px" }, label: "5x" },
                }}
              />
            </div>
            <div className="rounded-xl bg-blue-500/10 p-3 ring-1 ring-blue-500/20 text-center">
              <div className="mb-1 text-xs font-medium text-blue-300">Trigger when volume is</div>
              <div className="text-lg font-bold text-blue-400">
                {spikeThreshold.toFixed(1)}× average
              </div>
            </div>
          </div>
        </div>

        {/* MA Period */}
        <div>
          <label className="mb-3 block text-sm font-medium text-white/70">
            Average Period (candles)
          </label>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {[10, 14, 20, 30, 50].map((p) => {
              const on = maPeriod === p;
              return (
                <button
                  key={p}
                  onClick={() => setMaPeriod(p)}
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
            20 is the standard default
          </p>
        </div>

        {/* Signal types */}
        <div>
          <label className="mb-3 block text-sm font-medium text-white/70">
            Signal Types
          </label>
          <div className="space-y-2">
            {SIGNALS.map(({ id, label, desc }) => {
              const on = selectedSignals.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => toggleSignal(id)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                    on
                      ? "border-white/20 bg-white/10"
                      : "border-white/5 bg-white/[0.02] hover:bg-white/5"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm font-semibold truncate ${on ? "text-white" : "text-white/40"}`}>
                      {label}
                    </div>
                    <div className="text-xs text-white/30 mt-0.5 truncate">{desc}</div>
                  </div>
                  <div
                    className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      on ? "border-white bg-white" : "border-white/20"
                    }`}
                  >
                    {on && <div className="h-2 w-2 rounded-full bg-black" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}