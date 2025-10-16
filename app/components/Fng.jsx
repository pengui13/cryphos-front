"use client";

import React, { useMemo } from "react";

// ---- Core math (same as the fixed gauge) ----
const INK = "#0f1115";
const TRACK = "#1b1f26";

function clamp(n, a, b) { return Math.min(b, Math.max(a, n)); }
function toRad(deg) { return (deg * Math.PI) / 180; }
function pt(cx, cy, r, deg) { const rad = toRad(deg); return [cx + r*Math.cos(rad), cy - r*Math.sin(rad)]; }
function arcPath(cx, cy, r, startDeg, endDeg) {
  const [x1, y1] = pt(cx, cy, r, startDeg);
  const [x2, y2] = pt(cx, cy, r, endDeg);
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  const sweep = 1; // clockwise across top
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} ${sweep} ${x2} ${y2}`;
}

// ---- Compact half-donut used inside the inline card ----
function MiniGauge({
  value = 72,
  min = 0,
  max = 100,
  size = 140,
  thickness = 10,
  gapDeg = 4,
  progressColor = "#ffffff",
  sectionColors = ["#2a0134", "#6a2e8e", "#2a7d2e"], // Fear / Neutral / Greed
  trackColor = TRACK,
}) {
  const v = clamp(value ?? 0, min, max);
  const pct = (v - min) / (max - min);

  const cx = size / 2;
  const cy = size / 2;
  const r = Math.max(1, cx - thickness * 1.1);

  const START = 180, END = 0;
  const progDeg = START + (END - START) * pct;

  const dTrack = useMemo(() => arcPath(cx, cy, r, START, END), [cx, cy, r]);
  const dProg = useMemo(() => arcPath(cx, cy, r, START, progDeg), [cx, cy, r, progDeg]);
  const [px, py] = pt(cx, cy, r, progDeg);

  // three sections with micro-gaps
  const sections = useMemo(() => {
    const count = 3;
    const span = (START - END) / count;
    const halfGap = gapDeg / 2;
    return Array.from({ length: count }, (_, i) => {
      const s0 = START - i * span;
      const e0 = s0 - span;
      return arcPath(cx, cy, r, s0 - halfGap, e0 + halfGap);
    });
  }, [cx, cy, r, gapDeg]);

  const activeIdx = Math.min(2, Math.max(0, Math.floor(pct * 3)));
  const clipH = Math.round(size / 2 + thickness);

  return (
    <svg
      width={size}
      height={clipH}
      viewBox={`0 0 ${size} ${size}`}
      preserveAspectRatio="xMidYMid meet"
      shapeRendering="geometricPrecision"
    >
      <defs>
        <clipPath id="fg-top-half-inline">
          <rect x="0" y="0" width={size} height={clipH} />
        </clipPath>
      </defs>

      <g clipPath="url(#fg-top-half-inline)">
        <path d={dTrack} fill="none" stroke={trackColor} strokeWidth={thickness} strokeLinecap="round" />
        {sections.map((d, idx) => (
          <path
            key={idx}
            d={d}
            fill="none"
            stroke={sectionColors[idx] || trackColor}
            strokeOpacity={idx === activeIdx ? 0.32 : 0.18}
            strokeWidth={thickness}
            strokeLinecap="round"
          />
        ))}
        <path d={dProg} fill="none" stroke={progressColor} strokeWidth={thickness} strokeLinecap="round" />
        <circle cx={px} cy={py} r={thickness * 0.6} fill={INK} />
        <circle cx={px} cy={py} r={thickness * 0.6} fill="none" stroke={progressColor} strokeWidth={2.5} />
      </g>
    </svg>
  );
}

// ---- Inline composition: gauge left, text right ----
export default function CryphosFearGreedGauge({
  value = 34,
  title,                       // optional small title above the number
  gaugeSize = 140,
  thickness = 10,
  progressColor = "#ffffff",
  sectionColors = ["#2a0134", "#6a2e8e", "#2a7d2e"],
  className = "",
}) {
  const label =
    value < 20 ? "Extreme Fear" :
    value < 40 ? "Fear" :
    value < 60 ? "Neutral" :
    value < 80 ? "Greed" : "Extreme Greed";

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="shrink-0">
        <MiniGauge
          value={value}
          size={gaugeSize}
          thickness={thickness}
          gapDeg={4}
          progressColor={progressColor}
          sectionColors={sectionColors}
        />
      </div>

      <div className="min-w-[96px] select-none">
        {title && (
          <div className="text-[11px] uppercase tracking-[0.08em] text-white/45 mb-1">
            {title}
          </div>
        )}
        <div className="text-[28px] leading-none font-semibold text-white">
          {Math.round(value)}
        </div>
        <div className="text-[13px] text-white/65">{label}</div>
      </div>
    </div>
  );
}
