"use client";

import { useState } from "react";
import { useLang } from "../LanguageContext";

const fmt = (n) => n.toFixed(2);

function Tag({ children, color = "white" }) {
  const colors = {
    white:  "border-white/10 bg-white/5 text-white/70",
    green:  "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    red:    "border-red-500/20 bg-red-500/10 text-red-400",
    yellow: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
    purple: "border-purple-500/20 bg-purple-500/10 text-purple-400",
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

const ALL_LEVELS = [
  { ratio: 0.0,   label: "0%",    key: false },
  { ratio: 0.236, label: "23.6%", key: false },
  { ratio: 0.382, label: "38.2%", key: true  },
  { ratio: 0.5,   label: "50%",   key: true  },
  { ratio: 0.618, label: "61.8%", key: true  },
  { ratio: 0.786, label: "78.6%", key: false },
  { ratio: 1.0,   label: "100%",  key: false },
];

function Simulator({ tx }) {
  const [swingHigh, setSwingHigh] = useState(100);
  const [swingLow,  setSwingLow]  = useState(80);
  const [prev,  setPrev]  = useState(87.5);
  const [price, setPrice] = useState(87.9);
  const [trend, setTrend] = useState("up");

  const diff = swingHigh - swingLow;
  const tol  = diff * 0.003;

  const levels = ALL_LEVELS.map(({ ratio, label, key }) => ({
    ratio, label, key,
    value: swingHigh - diff * ratio,
  }));

  let signal = null;
  let hitLevel = null;
  for (const { ratio, value, key } of levels) {
    if (!key) continue;
    if (prev <= value + tol && price > value + tol) { signal = "LONG";  hitLevel = ratio; break; }
    if (prev >= value - tol && price < value - tol) { signal = "SHORT"; hitLevel = ratio; break; }
  }

  const chartMin   = swingLow  - diff * 0.15;
  const chartMax   = swingHigh + diff * 0.15;
  const chartRange = chartMax  - chartMin;
  const pct = (v) => `${((v - chartMin) / chartRange) * 100}%`;
  const levelColors = { 0.382: "#34d399", 0.5: "#a78bfa", 0.618: "#f472b6" };

  const controls = [
    { key: "swingHigh", val: swingHigh, set: setSwingHigh, min: swingLow + 1, max: 200,        step: 1   },
    { key: "swingLow",  val: swingLow,  set: setSwingLow,  min: 1,            max: swingHigh - 1, step: 1 },
    { key: "prevClose", val: prev,      set: setPrev,       min: swingLow - 5, max: swingHigh + 5, step: 0.1 },
    { key: "curClose",  val: price,     set: setPrice,      min: swingLow - 5, max: swingHigh + 5, step: 0.1 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {controls.map(({ key, val, set, min, max, step }) => (
          <div key={key}>
            <div className="mb-1.5 text-xs text-white/50">{tx.simLabels[key]}</div>
            <input
              type="number" min={min} max={max} step={step} value={val}
              onChange={(e) => set(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/20"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-white/50">{tx.trend}:</span>
        {["up", "down"].map((t) => (
          <button
            key={t}
            onClick={() => setTrend(t)}
            className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-all ${
              trend === t ? "bg-white text-black" : "bg-white/5 text-white/50 hover:bg-white/10"
            }`}
          >
            {t === "up" ? tx.uptrend2 : tx.downtrend2}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="relative h-64 overflow-hidden rounded-2xl border border-white/[0.07] bg-black/30">
        {levels.map(({ ratio, label, value, key }) => (
          <div
            key={ratio}
            className="absolute left-0 right-0 flex items-center"
            style={{ bottom: pct(value), transform: "translateY(50%)" }}
          >
            <div className="h-px flex-1 opacity-40"
              style={{ backgroundColor: key ? (levelColors[ratio] || "#fff") : "#ffffff30" }} />
            <span className="ml-2 mr-3 text-[10px] font-medium"
              style={{ color: key ? (levelColors[ratio] || "#fff") : "#ffffff40" }}>
              {label}{key && " ⭐"}
            </span>
            <span className="mr-3 text-[10px] text-white/30">{fmt(value)}</span>
          </div>
        ))}

        <div className="absolute left-[35%] flex flex-col items-center"
          style={{ bottom: pct(Math.min(prev, swingHigh)), transform: "translateX(-50%)" }}>
          <div className="w-5 rounded-sm border border-white/30 bg-white/10"
            style={{ height: `${(Math.abs(prev - (swingLow + diff * 0.4)) / chartRange) * 100 * 2.56}px`, minHeight: 8 }} />
          <div className="mt-1 text-[9px] text-white/40">prev<br/>{fmt(prev)}</div>
        </div>

        <div className="absolute left-[55%] flex flex-col items-center"
          style={{ bottom: pct(Math.min(price, swingHigh)), transform: "translateX(-50%)" }}>
          <div className={`w-5 rounded-sm border ${
            signal === "LONG"  ? "border-emerald-400/60 bg-emerald-500/20" :
            signal === "SHORT" ? "border-red-400/60 bg-red-500/20" :
            "border-white/30 bg-white/10"
          }`} style={{ height: `${(Math.abs(price - (swingLow + diff * 0.4)) / chartRange) * 100 * 2.56}px`, minHeight: 8 }} />
          <div className="mt-1 text-[9px] text-white/40">now<br/>{fmt(price)}</div>
        </div>
      </div>

      {/* Result */}
      <div className={`flex items-center justify-between rounded-xl border px-5 py-4 ${
        signal === "LONG"  ? "border-emerald-500/20 bg-emerald-500/10" :
        signal === "SHORT" ? "border-red-500/20 bg-red-500/10" :
        "border-white/10 bg-white/[0.03]"
      }`}>
        <div>
          <div className="mb-1 text-xs text-white/40">{tx.signalResult}</div>
          <div className={`text-xl font-bold ${
            signal === "LONG" ? "text-emerald-400" : signal === "SHORT" ? "text-red-400" : "text-white/30"
          }`}>
            {signal ?? tx.noSignal}
          </div>
          {hitLevel && (
            <div className="mt-1 text-xs text-white/40">
              {tx.atLevel} {(hitLevel * 100).toFixed(1)}% {tx.fibLevel} · {fmt(swingHigh - diff * hitLevel)}
            </div>
          )}
        </div>
        <div className="space-y-1 text-right text-xs text-white/30">
          <div>diff = {fmt(diff)}</div>
          <div>tolerance = {fmt(tol)}</div>
          <div>trend = {trend}</div>
        </div>
      </div>
    </div>
  );
}

export default function FibonacciLesson() {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState("concept");

  // shortcut helper for this lesson's namespace
  const tx = (key) => t(`indicators.fibLesson.${key}`);
  const txObj = (key) => t(`indicators.fibLesson.${key}`);  // returns object when key points to one

  const tabs = [
    { id: "concept",   label: tx("tabs.concept")   },
    { id: "steps",     label: tx("tabs.algorithm") },
    { id: "simulator", label: tx("tabs.simulator") },
  ];

  const levelDescs = [
    { label: "0%",    color: "white",  descKey: "l0"   },
    { label: "23.6%", color: "white",  descKey: "l236" },
    { label: "38.2%", color: "green",  descKey: "l382" },
    { label: "50%",   color: "purple", descKey: "l50"  },
    { label: "61.8%", color: "yellow", descKey: "l618" },
    { label: "78.6%", color: "white",  descKey: "l786" },
    { label: "100%",  color: "white",  descKey: "l100" },
  ];

  const summarySteps = t("indicators.fibLesson.summarySteps");
  const tips         = t("indicators.fibLesson.tips");
  const simLabels    = t("indicators.fibLesson.simLabels");
  const exampleRows  = t("indicators.fibLesson.exampleRows");
  const exampleVals  = t("indicators.fibLesson.exampleValues");

  // tx object passed down to Simulator
  const simTx = {
    simLabels,
    trend:      tx("trend"),
    uptrend2:   tx("uptrend2"),
    downtrend2: tx("downtrend2"),
    signalResult: tx("signalResult"),
    noSignal:   tx("noSignal"),
    atLevel:    tx("atLevel"),
    fibLevel:   tx("fibLevel"),
  };

  return (
    <div className="min-h-screen bg-[#080808] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">

        {/* Header */}
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Tag color="purple">{tx("tags.academy")}</Tag>
            <Tag>{tx("tags.indicator")}</Tag>
            <Tag>{tx("tags.level")}</Tag>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{tx("title")}</h1>
          <p className="mt-3 text-base leading-relaxed text-white/50">{tx("subtitle")}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl border border-white/[0.07] bg-white/[0.03] p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                activeTab === tab.id ? "bg-white text-black" : "text-white/50 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── CONCEPT ── */}
        {activeTab === "concept" && (
          <div className="space-y-5">
            <Card>
              <h2 className="mb-3 text-base font-semibold text-white">{tx("conceptTitle")}</h2>
              <p className="text-sm leading-relaxed text-white/60">{tx("conceptP1")}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{tx("conceptP2")}</p>
            </Card>

            <Card>
              <h2 className="mb-4 text-base font-semibold text-white">{tx("keyLevelsTitle")}</h2>
              <div className="space-y-3">
                {levelDescs.map(({ label, color, descKey }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Tag color={color}>{label}</Tag>
                    <p className="pt-0.5 text-sm text-white/50">{tx(`levels.${descKey}`)}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-purple-500/20 bg-purple-500/[0.04]">
              <h2 className="mb-2 text-base font-semibold text-white">{tx("whyTitle")}</h2>
              <p className="text-sm leading-relaxed text-white/60">{tx("whyDesc")}</p>
            </Card>
          </div>
        )}

        {/* ── ALGORITHM ── */}
        {activeTab === "steps" && (
          <div className="space-y-5">

            <Card>
              <div className="mb-4 flex items-center gap-3">
                <StepBadge n="1" />
                <h2 className="text-base font-semibold text-white">{tx("step1Title")}</h2>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-white/60">{tx("step1Desc")}</p>
              <Code>{`lookback = 50  # candles to look back

swing_high = max(candle.high for last 50 candles)
swing_low  = min(candle.low  for last 50 candles)

# Example:
# swing_high = 100  (BTC hit $100k in the last 50 candles)
# swing_low  = 80   (BTC bottomed at $80k in the last 50 candles)`}</Code>
            </Card>

            <Card>
              <div className="mb-4 flex items-center gap-3">
                <StepBadge n="2" />
                <h2 className="text-base font-semibold text-white">{tx("step2Title")}</h2>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-white/60">{tx("step2Desc")}</p>
              <Code>{`high_index = index of swing_high in last 50 candles
low_index  = index of swing_low  in last 50 candles

if high_index > low_index:
    trend = "up"    # price went up last → now pulling back down
else:
    trend = "down"  # price went down last → now bouncing up`}</Code>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <div className="mb-1 text-xs font-semibold text-emerald-400">{tx("uptrend")}</div>
                  <p className="text-xs text-white/50">{tx("uptrendDesc")}</p>
                </div>
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                  <div className="mb-1 text-xs font-semibold text-red-400">{tx("downtrend")}</div>
                  <p className="text-xs text-white/50">{tx("downtrendDesc")}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="mb-4 flex items-center gap-3">
                <StepBadge n="3" />
                <h2 className="text-base font-semibold text-white">{tx("step3Title")}</h2>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-white/60">{tx("step3Desc")}</p>
              <Code>{`diff = swing_high - swing_low   # 100 - 80 = 20

levels = {
  0.0:   100.00,   # 100 - 20 * 0.0   = 100.00  (swing high)
  0.236: 95.28,    # 100 - 20 * 0.236 =  95.28
  0.382: 92.36,    # 100 - 20 * 0.382 =  92.36  ⭐ key
  0.5:   90.00,    # 100 - 20 * 0.5   =  90.00  ⭐ key
  0.618: 87.64,    # 100 - 20 * 0.618 =  87.64  ⭐ key
  0.786: 84.28,    # 100 - 20 * 0.786 =  84.28
  1.0:   80.00,    # 100 - 20 * 1.0   =  80.00  (swing low)
}`}</Code>
            </Card>

            <Card>
              <div className="mb-4 flex items-center gap-3">
                <StepBadge n="4" />
                <h2 className="text-base font-semibold text-white">{tx("step4Title")}</h2>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-white/60">{tx("step4Desc1")}</p>
              <p className="mb-4 text-sm leading-relaxed text-white/60">{tx("step4Desc2")}</p>
              <Code>{`tolerance = diff * 0.003   # 20 * 0.003 = 0.06

# For each key level (38.2%, 50%, 61.8%):

# ── LONG signal ──────────────────────────────────────────
# prev closed BELOW the level, current closed ABOVE it
# = price bounced up through the level → potential long

if prev  <= level + tolerance   # was below
and price > level + tolerance:  # now above
    signal = "LONG"


# ── SHORT signal ─────────────────────────────────────────
# prev closed ABOVE the level, current closed BELOW it
# = price broke down through the level → potential short

if prev  >= level - tolerance   # was above
and price < level - tolerance:  # now below
    signal = "SHORT"`}</Code>

              <div className="mt-4 rounded-xl border border-white/[0.07] bg-black/20 p-4">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">
                  {tx("exampleTitle")}
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    [exampleRows.level,     "87.64",               "white" ],
                    [exampleRows.tolerance, "0.06",                "white" ],
                    [exampleRows.boundary,  "87.70",               "yellow"],
                    [exampleRows.prevClose, exampleVals.prevClose, "white" ],
                    [exampleRows.curClose,  exampleVals.curClose,  "green" ],
                    [exampleRows.result,    exampleVals.result,    "green" ],
                  ].map(([k, v, color]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-white/40">{k}</span>
                      <span className={
                        color === "green"  ? "text-emerald-400" :
                        color === "yellow" ? "text-yellow-400"  : "text-white/80"
                      }>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="border-white/[0.1]">
              <h2 className="mb-4 text-base font-semibold text-white">{tx("summaryTitle")}</h2>
              <div className="space-y-2">
                {["📐","🧭","📊","🎯","🕯️","📡"].map((icon, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl p-2">
                    <span className="text-base">{icon}</span>
                    <span className="text-sm text-white/60">
                      {Array.isArray(summarySteps) ? summarySteps[i] : ""}
                    </span>
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
              <h2 className="mb-1 text-base font-semibold text-white">{tx("simTitle")}</h2>
              <p className="mb-6 text-sm text-white/50">{tx("simDesc")}</p>
              <Simulator tx={simTx} />
            </Card>

            <Card className="border-yellow-500/20 bg-yellow-500/[0.04]">
              <h2 className="mb-2 text-base font-semibold text-white">{tx("tipsTitle")}</h2>
              <ul className="space-y-2 text-sm text-white/60">
                {Array.isArray(tips) && tips.map((tip, i) => (
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