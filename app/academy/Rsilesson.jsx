"use client";

import { useState, useRef } from "react";
import { useLang } from "../LanguageContext";

const fmt = (n) => n.toFixed(2);
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);


function Tag({ children, color = "white" }) {
  const colors = {
    white:  "border-white/10 bg-white/5 text-white/70",
    green:  "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    red:    "border-red-500/20 bg-red-500/10 text-red-400",
    yellow: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
    purple: "border-purple-500/20 bg-purple-500/10 text-purple-400",
    blue:   "border-blue-500/20 bg-blue-500/10 text-blue-400",
  };
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
}

function StepBadge({ n }) {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
      {n}
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

function Code({ children }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-white/[0.07] bg-black/40 p-4 text-xs leading-relaxed text-white/80 sm:text-sm">
      <code>{children}</code>
    </pre>
  );
}

// ─── RSI Gauge ────────────────────────────────────────────────────────────────

function RsiGauge({ value }) {
  const angle = -135 + (value / 100) * 270;
  const color =
    value >= 70 ? "#f87171" :
    value <= 30 ? "#34d399" :
    "#a78bfa";

  const zones = [
    { start: -135, end: -135 + 30 * 2.7,   color: "#34d399", label: "Oversold" },
    { start: -135 + 30 * 2.7, end: -135 + 70 * 2.7, color: "#a78bfa", label: "Neutral" },
    { start: -135 + 70 * 2.7, end: 135,    color: "#f87171", label: "Overbought" },
  ];

  function arcPath(startDeg, endDeg, r = 48) {
    const s = (startDeg * Math.PI) / 180;
    const e = (endDeg   * Math.PI) / 180;
    const x1 = 60 + r * Math.cos(s);
    const y1 = 60 + r * Math.sin(s);
    const x2 = 60 + r * Math.cos(e);
    const y2 = 60 + r * Math.sin(e);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  }

  const needleRad = (angle * Math.PI) / 180;
  const nx = 60 + 36 * Math.cos(needleRad);
  const ny = 60 + 36 * Math.sin(needleRad);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 80" className="w-48">
        {/* Background arc */}
        <path d={arcPath(-135, 135)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" strokeLinecap="round" />
        {/* Zone arcs */}
        {zones.map((z, i) => (
          <path key={i} d={arcPath(z.start, z.end)} fill="none" stroke={z.color}
            strokeWidth="10" strokeLinecap="butt" opacity="0.35" />
        ))}
        {/* Active fill up to current value */}
        <path d={arcPath(-135, angle)} fill="none" stroke={color}
          strokeWidth="10" strokeLinecap="round" opacity="0.9" />
        {/* Needle */}
        <line x1="60" y1="60" x2={nx} y2={ny} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="60" cy="60" r="4" fill={color} />
        {/* Value text */}
        <text x="60" y="75" textAnchor="middle" fontSize="13" fontWeight="700" fill="white">{Math.round(value)}</text>
      </svg>
      <div className="mt-1 text-xs font-semibold" style={{ color }}>
        {value >= 70 ? "Overbought" : value <= 30 ? "Oversold" : "Neutral"}
      </div>
    </div>
  );
}

// ─── RSI Simulator ────────────────────────────────────────────────────────────

// Generate a simple price series and compute RSI (Wilder smoothing)
function computeRSI(prices, period = 14) {
  if (prices.length < period + 1) return [];
  const results = [];
  let avgGain = 0;
  let avgLoss = 0;

  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff > 0) avgGain += diff;
    else avgLoss += Math.abs(diff);
  }
  avgGain /= period;
  avgLoss /= period;

  const rs0 = avgLoss === 0 ? 100 : avgGain / avgLoss;
  results.push({ i: period, rsi: avgLoss === 0 ? 100 : 100 - 100 / (1 + rs0) });

  for (let i = period + 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? Math.abs(diff) : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    results.push({ i, rsi: avgLoss === 0 ? 100 : 100 - 100 / (1 + rs) });
  }
  return results;
}

function generatePriceSeries(seed = 100, length = 60, volatility = 1.5, trend = 0) {
  const prices = [seed];
  let p = seed;
  for (let i = 1; i < length; i++) {
    // deterministic pseudo-random from seed
    const r = Math.sin(seed * 9301 + i * 49297 + 233720) * 0.5 + 0.5;
    p = p + (r - 0.5) * volatility * 2 + trend * 0.1;
    p = Math.max(p, 1);
    prices.push(p);
  }
  return prices;
}

function Simulator() {
  const [period, setPeriod]     = useState(14);
  const [overbought, setOverbought] = useState(70);
  const [oversold, setOversold]   = useState(30);
  const [volatility, setVolatility] = useState(1.5);
  const [trend, setTrend]       = useState(0);
  const [seed, setSeed]         = useState(42);

  const prices = generatePriceSeries(seed, 60, volatility, trend);
  const rsiPoints = computeRSI(prices, period);
  const currentRsi = rsiPoints.length ? rsiPoints[rsiPoints.length - 1].rsi : 50;

  // Chart dimensions
  const W = 560, H = 100;
  const rsiH = 80;

  const pMin = Math.min(...prices);
  const pMax = Math.max(...prices);
  const pRange = pMax - pMin || 1;

  const pricePoints = prices.map((p, i) => ({
    x: (i / (prices.length - 1)) * W,
    y: H - ((p - pMin) / pRange) * H,
  }));

  const rsiMin = 0, rsiMax = 100;
  const rsiChartPoints = rsiPoints.map(({ i, rsi }) => ({
    x: (i / (prices.length - 1)) * W,
    y: rsiH - ((rsi - rsiMin) / (rsiMax - rsiMin)) * rsiH,
  }));

  const toPolyline = (pts) => pts.map((p) => `${p.x},${p.y}`).join(" ");

  const obY = rsiH - ((overbought - rsiMin) / (rsiMax - rsiMin)) * rsiH;
  const osY = rsiH - ((oversold  - rsiMin) / (rsiMax - rsiMin)) * rsiH;

  // Signal detection
  let signal = null;
  if (rsiPoints.length >= 2) {
    const prev = rsiPoints[rsiPoints.length - 2].rsi;
    const curr = rsiPoints[rsiPoints.length - 1].rsi;
    if (prev <= oversold && curr > oversold)   signal = "LONG";
    if (prev >= overbought && curr < overbought) signal = "SHORT";
    if (curr >= overbought) signal = signal || "OVERBOUGHT";
    if (curr <= oversold)   signal = signal || "OVERSOLD";
  }

  const controls = [
    { label: "RSI Period", val: period, set: setPeriod, min: 2, max: 50, step: 1 },
    { label: "Overbought", val: overbought, set: setOverbought, min: 51, max: 95, step: 1 },
    { label: "Oversold",   val: oversold,   set: setOversold,   min: 5,  max: 49, step: 1 },
    { label: "Volatility", val: volatility, set: setVolatility, min: 0.3, max: 5, step: 0.1 },
  ];

  return (
    <div className="space-y-6">
      {/* Gauge */}
      <div className="flex flex-col items-center gap-2">
        <RsiGauge value={currentRsi} />
        <div className="text-xs text-white/30">Current RSI: {fmt(currentRsi)}</div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {controls.map(({ label, val, set, min, max, step }) => (
          <div key={label}>
            <div className="mb-1.5 text-xs text-white/50">{label}</div>
            <input
              type="number" min={min} max={max} step={step} value={val}
              onChange={(e) => set(parseFloat(e.target.value) || min)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/20"
            />
          </div>
        ))}
      </div>

      {/* Trend / Seed controls */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-white/50">Trend:</span>
        {[[-1, "↓ Down"], [0, "— Flat"], [1, "↑ Up"]].map(([v, label]) => (
          <button key={v} onClick={() => setTrend(v)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              trend === v ? "bg-white text-black" : "bg-white/5 text-white/50 hover:bg-white/10"
            }`}>{label}</button>
        ))}
        <button onClick={() => setSeed(s => s + 1)}
          className="ml-auto rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/40 hover:text-white/60 transition-all">
          New series ↺
        </button>
      </div>

      {/* Price chart */}
      <div>
        <div className="mb-1 text-[10px] text-white/30 uppercase tracking-wider">Price</div>
        <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-black/30 p-3">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: 80 }}>
            <polyline points={toPolyline(pricePoints)} fill="none" stroke="#a78bfa" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* RSI chart */}
      <div>
        <div className="mb-1 text-[10px] text-white/30 uppercase tracking-wider">RSI ({period})</div>
        <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-black/30 p-3">
          <svg viewBox={`0 0 ${W} ${rsiH}`} className="w-full" preserveAspectRatio="none" style={{ height: 80 }}>
            {/* Overbought zone fill */}
            <rect x="0" y="0" width={W} height={obY} fill="rgba(248,113,113,0.05)" />
            {/* Oversold zone fill */}
            <rect x="0" y={osY} width={W} height={rsiH - osY} fill="rgba(52,211,153,0.05)" />
            {/* Overbought line */}
            <line x1="0" y1={obY} x2={W} y2={obY} stroke="#f87171" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
            {/* Oversold line */}
            <line x1="0" y1={osY} x2={W} y2={osY} stroke="#34d399" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
            {/* Midline */}
            <line x1="0" y1={rsiH * 0.5} x2={W} y2={rsiH * 0.5} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            {/* RSI line */}
            {rsiChartPoints.length > 1 && (
              <polyline points={toPolyline(rsiChartPoints)} fill="none" stroke="#a78bfa" strokeWidth="1.8" />
            )}
            {/* Current RSI dot */}
            {rsiChartPoints.length > 0 && (() => {
              const last = rsiChartPoints[rsiChartPoints.length - 1];
              const col = currentRsi >= overbought ? "#f87171" : currentRsi <= oversold ? "#34d399" : "#a78bfa";
              return <circle cx={last.x} cy={last.y} r="3.5" fill={col} />;
            })()}
          </svg>
          {/* Labels */}
          <div className="absolute right-4 top-2 text-[9px] text-red-400/60">{overbought}</div>
          <div className="absolute right-4 bottom-2 text-[9px] text-emerald-400/60">{oversold}</div>
        </div>
      </div>

      {/* Signal result */}
      <div className={`flex items-center justify-between rounded-xl border px-5 py-4 ${
        signal === "LONG"        ? "border-emerald-500/20 bg-emerald-500/10" :
        signal === "SHORT"       ? "border-red-500/20 bg-red-500/10" :
        signal === "OVERBOUGHT"  ? "border-red-500/10 bg-red-500/5" :
        signal === "OVERSOLD"    ? "border-emerald-500/10 bg-emerald-500/5" :
        "border-white/10 bg-white/[0.03]"
      }`}>
        <div>
          <div className="mb-1 text-xs text-white/40">Signal</div>
          <div className={`text-xl font-bold ${
            signal === "LONG" || signal === "OVERSOLD"    ? "text-emerald-400" :
            signal === "SHORT" || signal === "OVERBOUGHT" ? "text-red-400" :
            "text-white/30"
          }`}>
            {signal ?? "No signal"}
          </div>
          <div className="mt-1 text-xs text-white/40">
            {signal === "LONG"       && `RSI crossed above ${oversold} — momentum reversal up`}
            {signal === "SHORT"      && `RSI crossed below ${overbought} — momentum reversal down`}
            {signal === "OVERBOUGHT" && `RSI above ${overbought} — market may be stretched`}
            {signal === "OVERSOLD"   && `RSI below ${oversold} — market may be cheap`}
            {!signal                 && "Waiting for RSI to cross threshold"}
          </div>
        </div>
        <div className="space-y-1 text-right text-xs text-white/30">
          <div>RSI = {fmt(currentRsi)}</div>
          <div>period = {period}</div>
          <div>ob = {overbought} / os = {oversold}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RsiLesson() {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState("concept");

  // Fallback strings so component works even before i18n keys are added
  const tx = (key) => {
    try { const v = t(`indicators.rsiLesson.${key}`); return v || key; }
    catch { return key; }
  };

  const tabs = [
    { id: "concept",   label: "Concept"    },
    { id: "steps",     label: "Algorithm"  },
    { id: "simulator", label: "Simulator"  },
  ];

  return (
    <div className="min-h-screen bg-[#080808] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">

        {/* Header */}
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Tag color="purple">Academy</Tag>
            <Tag>Indicator</Tag>
            <Tag color="blue">Momentum</Tag>
            <Tag>Intermediate</Tag>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            RSI — Relative Strength Index
          </h1>
          <p className="mt-3 text-base leading-relaxed text-white/50">
            The most widely used momentum oscillator. Measures the speed and magnitude of price changes to identify overbought and oversold conditions.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl border border-white/[0.07] bg-white/[0.03] p-1">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                activeTab === tab.id ? "bg-white text-black" : "text-white/50 hover:text-white"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── CONCEPT ── */}
        {activeTab === "concept" && (
          <div className="space-y-5">
            <Card>
              <h2 className="mb-3 text-base font-semibold text-white">What is RSI?</h2>
              <p className="text-sm leading-relaxed text-white/60">
                RSI is a momentum oscillator developed by J. Welles Wilder in 1978. It moves between 0 and 100, measuring how strongly price has been moving up versus down over a defined period — typically 14 candles.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Unlike price itself, RSI is bounded. That bounded nature makes it useful for spotting extremes: when buyers have been so dominant for so long that the market is likely stretched, or vice versa.
              </p>
            </Card>

            <Card>
              <h2 className="mb-4 text-base font-semibold text-white">Key zones</h2>
              <div className="space-y-3">
                {[
                  { range: "70 – 100", color: "red",    label: "Overbought",  desc: "Buyers have dominated for too long. Price may reverse or consolidate. In strong trends, can stay here for extended periods." },
                  { range: "50 – 70",  color: "purple", label: "Bullish zone", desc: "Price is trending up with positive momentum. Pullbacks to 50 are often buying opportunities in an uptrend." },
                  { range: "30 – 50",  color: "purple", label: "Bearish zone", desc: "Price is trending down. Bounces to 50 are often selling opportunities in a downtrend." },
                  { range: "0 – 30",   color: "green",  label: "Oversold",    desc: "Sellers have dominated for too long. Price may reverse upward. Often signals potential long entries." },
                ].map(({ range, color, label, desc }) => (
                  <div key={range} className="flex items-start gap-3">
                    <div className="shrink-0 pt-0.5">
                      <Tag color={color}>{range}</Tag>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white/70 mb-0.5">{label}</div>
                      <p className="text-sm text-white/50">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="mb-4 text-base font-semibold text-white">RSI signals</h2>
              <div className="space-y-3">
                {[
                  { signal: "Cross above 30 ↑", color: "green",  desc: "RSI exits oversold — potential LONG entry. Price was suppressed, now momentum is recovering." },
                  { signal: "Cross below 70 ↓", color: "red",    desc: "RSI exits overbought — potential SHORT entry. Price was stretched, now momentum is fading." },
                  { signal: "Divergence",        color: "yellow", desc: "Price makes a new high but RSI makes a lower high — hidden weakness. One of the most powerful RSI signals." },
                  { signal: "Centerline cross",  color: "purple", desc: "RSI crossing 50 confirms trend direction change. Simple but effective trend filter." },
                ].map(({ signal, color, desc }) => (
                  <div key={signal} className="flex items-start gap-3">
                    <Tag color={color}>{signal}</Tag>
                    <p className="pt-0.5 text-sm text-white/50">{desc}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-purple-500/20 bg-purple-500/[0.04]">
              <h2 className="mb-2 text-base font-semibold text-white">Why Wilder smoothing?</h2>
              <p className="text-sm leading-relaxed text-white/60">
                Wilder used a specific exponential smoothing method — each new average gain/loss is weighted as <code className="text-purple-300 text-xs">(prev × (period−1) + new) / period</code>. This makes RSI respond more slowly than a simple average, reducing noise while still capturing real momentum shifts. Cryphos implements Wilder smoothing exactly as specified in the original formula.
              </p>
            </Card>
          </div>
        )}

        {/* ── ALGORITHM ── */}
        {activeTab === "steps" && (
          <div className="space-y-5">

            <Card>
              <div className="mb-4 flex items-center gap-3">
                <StepBadge n="1" />
                <h2 className="text-base font-semibold text-white">Calculate price changes</h2>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-white/60">
                For each candle, compute the difference between the current close and the previous close. Separate these into gains (positive moves) and losses (negative moves, stored as absolute values).
              </p>
              <Code>{`# For each candle i from 1 to N:
change = close[i] - close[i-1]

gain = change if change > 0 else 0
loss = abs(change) if change < 0 else 0

# Example (period = 14, prices in $k):
# Day 1→2:  +1.2  →  gain=1.2, loss=0
# Day 2→3:  -0.8  →  gain=0,   loss=0.8
# Day 3→4:  +2.1  →  gain=2.1, loss=0
# ...`}</Code>
            </Card>

            <Card>
              <div className="mb-4 flex items-center gap-3">
                <StepBadge n="2" />
                <h2 className="text-base font-semibold text-white">First average (simple)</h2>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-white/60">
                The very first average gain and average loss are computed as simple averages over the initial period. This bootstraps the Wilder smoothing that follows.
              </p>
              <Code>{`period = 14

# Simple average for the first period:
avg_gain = sum(gains[0:period]) / period
avg_loss = sum(losses[0:period]) / period

# Example result:
# avg_gain = 1.45
# avg_loss = 0.83`}</Code>
            </Card>

            <Card>
              <div className="mb-4 flex items-center gap-3">
                <StepBadge n="3" />
                <h2 className="text-base font-semibold text-white">Wilder smoothing (subsequent periods)</h2>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-white/60">
                From candle 15 onward, each average is updated using Wilder's exponential smoothing. The previous average carries most of the weight — this is what makes RSI smooth and lag-resistant.
              </p>
              <Code>{`# For each candle after the initial period:
avg_gain = (avg_gain * (period - 1) + current_gain) / period
avg_loss = (avg_loss * (period - 1) + current_loss) / period

# With period=14:
# New avg_gain = (prev × 13 + today) / 14
# New avg_loss = (prev × 13 + today) / 14

# Example:
# prev avg_gain = 1.45,  today gain = 2.0
# new  avg_gain = (1.45 × 13 + 2.0) / 14 = 1.49`}</Code>
            </Card>

            <Card>
              <div className="mb-4 flex items-center gap-3">
                <StepBadge n="4" />
                <h2 className="text-base font-semibold text-white">Compute RS and RSI</h2>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-white/60">
                Relative Strength (RS) is the ratio of average gain to average loss. RSI transforms this into a 0–100 scale using the classic formula. When there are no losses at all, RSI is defined as 100.
              </p>
              <Code>{`if avg_loss == 0:
    rsi = 100          # no losses at all → pure uptrend
else:
    rs  = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))

# Worked example:
# avg_gain = 1.49,  avg_loss = 0.83
# rs  = 1.49 / 0.83 = 1.795
# rsi = 100 - (100 / 2.795) = 64.2  → bullish zone`}</Code>
            </Card>

            <Card>
              <div className="mb-4 flex items-center gap-3">
                <StepBadge n="5" />
                <h2 className="text-base font-semibold text-white">Signal generation</h2>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-white/60">
                Cryphos generates signals when RSI crosses the configured thresholds — not just when it's inside them. A crossover (prev was below, now above) is the actual trigger event.
              </p>
              <Code>{`# Thresholds from bot config (defaults: 70/30)
overbought = 70
oversold   = 30

prev_rsi = rsi_series[-2]
curr_rsi = rsi_series[-1]

# ── LONG signal ──────────────────────────────────────────
# RSI just crossed UP through oversold threshold
# = price was suppressed, momentum is recovering

if prev_rsi <= oversold and curr_rsi > oversold:
    signal = "LONG"


# ── SHORT signal ─────────────────────────────────────────
# RSI just crossed DOWN through overbought threshold
# = price was stretched, momentum is fading

if prev_rsi >= overbought and curr_rsi < overbought:
    signal = "SHORT"`}</Code>

              <div className="mt-4 rounded-xl border border-white/[0.07] bg-black/20 p-4">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">
                  Example — LONG trigger
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    ["Oversold threshold", "30",    "white"],
                    ["Previous RSI",       "28.4",  "white"],
                    ["Current RSI",        "31.7",  "green"],
                    ["Crossed above 30?",  "Yes ✓", "green"],
                    ["Signal",             "LONG",  "green"],
                  ].map(([k, v, color]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-white/40">{k}</span>
                      <span className={color === "green" ? "text-emerald-400" : "text-white/80"}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="border-white/[0.1]">
              <h2 className="mb-4 text-base font-semibold text-white">Summary</h2>
              <div className="space-y-2">
                {[
                  ["📉", "Calculate gain/loss for each candle close-to-close"],
                  ["📊", "Bootstrap with simple average over the first period"],
                  ["🔁", "Apply Wilder smoothing: (prev × (n−1) + new) / n"],
                  ["⚡", "RS = avg_gain / avg_loss → RSI = 100 − 100 / (1 + RS)"],
                  ["🎯", "Signal fires on crossover of 30 (LONG) or 70 (SHORT)"],
                  ["⚙️",  "Thresholds and period are configurable per bot"],
                ].map(([icon, text], i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl p-2">
                    <span className="text-base">{icon}</span>
                    <span className="text-sm text-white/60">{text}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── SIMULATOR ── */}
        {activeTab === "simulator" && (
          <div className="space-y-5">
            <Card>
              <h2 className="mb-1 text-base font-semibold text-white">RSI Simulator</h2>
              <p className="mb-6 text-sm text-white/50">
                Adjust the period, thresholds, and market conditions. Watch how RSI responds and when signals fire.
              </p>
              <Simulator />
            </Card>

            <Card className="border-yellow-500/20 bg-yellow-500/[0.04]">
              <h2 className="mb-2 text-base font-semibold text-white">Tips for using RSI</h2>
              <ul className="space-y-2 text-sm text-white/60">
                {[
                  "RSI is most reliable in ranging markets. In strong trends it can stay overbought/oversold for a long time.",
                  "Lower periods (9, 7) make RSI more sensitive — more signals, more noise. Higher periods (21, 25) are smoother.",
                  "The 50 level is underrated — price consistently above 50 confirms uptrend; below 50 confirms downtrend.",
                  "Divergence (price makes new high, RSI doesn't) is often a stronger signal than a simple threshold cross.",
                  "Always combine RSI with a trend filter. Taking LONG signals only when price is above its 200-period MA dramatically improves hit rate.",
                  "In Cryphos, RSI thresholds are configurable per bot — aggressive traders use 80/20, conservative traders use 65/35.",
                ].map((tip, i) => (
                  <li key={i}>• {tip}</li>
                ))}
              </ul>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}