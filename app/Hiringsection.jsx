"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ─── Canvas dimensions ────────────────────────────────────────────────────────
const W = 900;
const H = 460;
const LX = W * 0.5;
const LY = H * 0.91;
const LIGHT_Y = LY - 80;
const BEAM_LEN = Math.max(W, H) * 1.6;
const BEAM_WIDTH = 0.16;

// ─── Candidates ───────────────────────────────────────────────────────────────
const CANDIDATES = [
  { initials: "RS", name: "Ryan S.",   role: "Rust Engineer",     color: "#0891b2", angle: -70, dist: 0.78 },
  { initials: "BE", name: "Boris E.",  role: "Backend Dev",       color: "#7c3aed", angle: -35, dist: 0.60 },
  { initials: "QR", name: "Quinn R.",  role: "Quant Researcher",  color: "#be185d", angle:   5, dist: 0.82 },
  { initials: "MK", name: "Maya K.",   role: "Growth Lead",       color: "#059669", angle:  42, dist: 0.65 },
  { initials: "HF", name: "Hugo F.",   role: "HFT Engineer",      color: "#d97706", angle:  78, dist: 0.78 },
  { initials: "SD", name: "Sara D.",   role: "Solana Dev",        color: "#9333ea", angle: -105,dist: 0.70 },
  { initials: "DX", name: "Dan X.",    role: "Designer",          color: "#e11d48", angle:  115, dist: 0.72 },
];

function candidatePos(angle, dist) {
  const rad = (angle * Math.PI) / 180;
  const maxR = Math.min(W, H) * 0.40;
  const r = dist * maxR;
  // positions relative to canvas, spread around upper half
  const cx = LX + Math.sin(rad) * r * 1.3;
  const cy = LIGHT_Y - Math.cos(rad) * r * 0.75;
  return { cx, cy };
}

// ─── Candidate Card (DOM) ─────────────────────────────────────────────────────
function CandidateCard({ initials, name, role, color, angle, dist, beamAngleRef }) {
  const [brightness, setBrightness] = useState(0.08);
  const { cx, cy } = candidatePos(angle, dist);

  useAnimationFrame(() => {
    const beamAngle = beamAngleRef.current;
    const dx = cx - LX;
    const dy = cy - LIGHT_Y;
    const candAngle = Math.atan2(dy, dx);

    let diff = candAngle - beamAngle;
    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;

    const isLit = Math.abs(diff) < BEAM_WIDTH + 0.06;
    const nearLit = Math.abs(diff) < BEAM_WIDTH + 0.28;
    const b = isLit ? 1 : nearLit ? 0.38 : 0.08;
    setBrightness(b);
  });

  const isLit = brightness > 0.9;
  const isNear = brightness > 0.3;

  // Position as % of container (canvas is 900x460 internally)
  const leftPct = (cx / W) * 100;
  const topPct  = (cy / H) * 100;

  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        left: `${leftPct}%`,
        top: `${topPct}%`,
        transform: "translate(-50%, -50%)",
        transition: "opacity 0.06s linear",
        opacity: brightness,
        zIndex: isLit ? 20 : 10,
      }}
    >
      <div
        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
        style={{
          background: isLit ? "rgba(8,4,22,0.95)" : "rgba(4,2,12,0.85)",
          border: `1px solid ${isLit ? color + "70" : "rgba(255,255,255,0.06)"}`,
          boxShadow: isLit
            ? `0 0 20px ${color}30, 0 0 6px ${color}20, inset 0 1px 0 rgba(255,255,255,0.05)`
            : "none",
          minWidth: "148px",
          backdropFilter: "blur(8px)",
          transition: "border-color 0.08s, box-shadow 0.08s",
        }}
      >
        {/* Avatar */}
        <div
          className="h-9 w-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 leading-none"
          style={{
            background: isLit ? color + "22" : "rgba(255,255,255,0.04)",
            border: `1px solid ${isLit ? color + "50" : "rgba(255,255,255,0.06)"}`,
            color: isLit ? color : "rgba(255,255,255,0.25)",
            transition: "all 0.08s",
          }}
        >
          {initials}
        </div>

        {/* Text */}
        <div className="flex flex-col gap-0.5 min-w-0">
          <div
            className="text-xs font-semibold leading-none truncate"
            style={{
              color: isLit ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.2)",
              transition: "color 0.08s",
            }}
          >
            {name}
          </div>
          <div
            className="text-[11px] leading-none truncate"
            style={{
              color: isLit ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.1)",
              transition: "color 0.08s",
            }}
          >
            {role}
          </div>
        </div>

        {/* Pulse dot */}
        <div className="shrink-0 relative flex h-2 w-2 ml-auto">
          {isLit && (
            <span
              className="absolute inline-flex h-full w-full rounded-full animate-ping opacity-75"
              style={{ background: color }}
            />
          )}
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{
              background: isLit ? color : "rgba(255,255,255,0.1)",
              transition: "background 0.08s",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Lighthouse canvas ─────────────────────────────────────────────────────────
function LighthouseCanvas({ beamAngleRef }) {
  const canvasRef = useRef(null);

  // Pre-generate stable star positions
  const stars = useRef(
    Array.from({ length: 80 }, (_, i) => ({
      x: ((i * 137.508 * 9) % W),
      y: ((i * 97.32 * 13) % (H * 0.78)),
      r: 0.5 + (i % 3) * 0.4,
      phase: i * 0.618,
    }))
  );

  useAnimationFrame((timestamp) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const time = timestamp / 1000;

    // Advance beam
    beamAngleRef.current = (time * 0.55) % (2 * Math.PI) - Math.PI * 0.5;
    const beamAngle = beamAngleRef.current;

    ctx.clearRect(0, 0, W, H);

    // ── Sky ──
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#020208");
    sky.addColorStop(0.75, "#080618");
    sky.addColorStop(1, "#0d0920");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // ── Stars ──
    stars.current.forEach(({ x, y, r, phase }) => {
      const br = 0.25 + 0.35 * Math.abs(Math.sin(time * 0.8 + phase));
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(210,200,255,${br})`;
      ctx.fill();
    });

    // ── Distant island silhouette ──
    ctx.fillStyle = "#060414";
    ctx.beginPath();
    ctx.moveTo(0, H * 0.78);
    ctx.bezierCurveTo(W * 0.1, H * 0.74, W * 0.25, H * 0.76, W * 0.5, H * 0.75);
    ctx.bezierCurveTo(W * 0.75, H * 0.74, W * 0.9, H * 0.77, W, H * 0.78);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    // ── Water ──
    const water = ctx.createLinearGradient(0, H * 0.78, 0, H);
    water.addColorStop(0, "#07051a");
    water.addColorStop(1, "#040310");
    ctx.fillStyle = water;
    ctx.fillRect(0, H * 0.78, W, H * 0.22);

    // Water ripples
    for (let i = 0; i < 8; i++) {
      const wy = H * 0.82 + i * 8 + Math.sin(time * 1.4 + i * 0.9) * 2.5;
      const alpha = 0.04 + Math.abs(Math.sin(time * 1.8 + i)) * 0.04;
      ctx.beginPath();
      ctx.moveTo(0, wy);
      ctx.lineTo(W, wy);
      ctx.strokeStyle = `rgba(100,70,220,${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Beam reflection in water
    const refAngle = -beamAngle; // mirror vertically
    const refLen = H * 0.4;
    const rx1 = LX + Math.cos(refAngle - BEAM_WIDTH) * refLen;
    const ry1 = LY + Math.abs(Math.sin(refAngle - BEAM_WIDTH)) * refLen * 0.3;
    const rx2 = LX + Math.cos(refAngle + BEAM_WIDTH) * refLen;
    const ry2 = LY + Math.abs(Math.sin(refAngle + BEAM_WIDTH)) * refLen * 0.3;
    const refGrad = ctx.createRadialGradient(LX, LY, 0, LX, LY, refLen);
    refGrad.addColorStop(0, "rgba(167,139,250,0.12)");
    refGrad.addColorStop(1, "rgba(167,139,250,0)");
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(LX, LY);
    ctx.lineTo(rx1, ry1);
    ctx.lineTo(rx2, ry2);
    ctx.closePath();
    ctx.fillStyle = refGrad;
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.restore();

    // ── Lighthouse tower ──
    // Main tower body
    const towerGrad = ctx.createLinearGradient(LX - 22, 0, LX + 22, 0);
    towerGrad.addColorStop(0, "#120d35");
    towerGrad.addColorStop(0.5, "#1e1650");
    towerGrad.addColorStop(1, "#0e0a28");
    ctx.fillStyle = towerGrad;
    ctx.beginPath();
    ctx.moveTo(LX - 22, LY + 15);
    ctx.lineTo(LX + 22, LY + 15);
    ctx.lineTo(LX + 14, LIGHT_Y - 4);
    ctx.lineTo(LX - 14, LIGHT_Y - 4);
    ctx.closePath();
    ctx.fill();

    // Tower outline
    ctx.strokeStyle = "rgba(109,40,217,0.35)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Decorative bands
    [0.25, 0.52, 0.78].forEach((t) => {
      const by = LY + 15 - t * (LY + 15 - (LIGHT_Y - 4));
      const bHalf = 22 - t * 8;
      ctx.fillStyle = "rgba(124,58,237,0.2)";
      ctx.fillRect(LX - bHalf, by - 3, bHalf * 2, 5);
      ctx.fillStyle = "rgba(167,139,250,0.1)";
      ctx.fillRect(LX - bHalf, by - 1, bHalf * 2, 2);
    });

    // Platform ledge
    ctx.fillStyle = "#2a1d6e";
    ctx.fillRect(LX - 18, LIGHT_Y - 6, 36, 8);
    ctx.fillStyle = "rgba(167,139,250,0.15)";
    ctx.fillRect(LX - 18, LIGHT_Y - 6, 36, 2);

    // ── BEAM ──
    const bx1 = LX + Math.cos(beamAngle - BEAM_WIDTH) * BEAM_LEN;
    const by1 = LIGHT_Y + Math.sin(beamAngle - BEAM_WIDTH) * BEAM_LEN;
    const bx2 = LX + Math.cos(beamAngle + BEAM_WIDTH) * BEAM_LEN;
    const by2 = LIGHT_Y + Math.sin(beamAngle + BEAM_WIDTH) * BEAM_LEN;

    const beamGrad = ctx.createRadialGradient(LX, LIGHT_Y, 8, LX, LIGHT_Y, BEAM_LEN);
    beamGrad.addColorStop(0,    "rgba(240,220,255,0.60)");
    beamGrad.addColorStop(0.08, "rgba(200,170,255,0.28)");
    beamGrad.addColorStop(0.25, "rgba(160,120,255,0.12)");
    beamGrad.addColorStop(0.6,  "rgba(120,80,220,0.04)");
    beamGrad.addColorStop(1,    "rgba(100,60,200,0)");

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(LX, LIGHT_Y);
    ctx.lineTo(bx1, by1);
    ctx.lineTo(bx2, by2);
    ctx.closePath();
    ctx.fillStyle = beamGrad;
    ctx.fill();
    ctx.restore();

    // Beam center line glow
    const centerX = LX + Math.cos(beamAngle) * BEAM_LEN * 0.65;
    const centerY = LIGHT_Y + Math.sin(beamAngle) * BEAM_LEN * 0.65;
    const centerLine = ctx.createLinearGradient(LX, LIGHT_Y, centerX, centerY);
    centerLine.addColorStop(0, "rgba(255,245,255,0.5)");
    centerLine.addColorStop(1, "rgba(255,245,255,0)");
    ctx.beginPath();
    ctx.moveTo(LX, LIGHT_Y);
    ctx.lineTo(centerX, centerY);
    ctx.strokeStyle = centerLine;
    ctx.lineWidth = 2;
    ctx.stroke();

    // ── Lantern housing ──
    ctx.fillStyle = "#100b2e";
    ctx.beginPath();
    ctx.arc(LX, LIGHT_Y, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#5b21b6";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Lantern cage lines
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      ctx.beginPath();
      ctx.moveTo(LX + Math.cos(a) * 10, LIGHT_Y + Math.sin(a) * 10);
      ctx.lineTo(LX + Math.cos(a) * 14, LIGHT_Y + Math.sin(a) * 14);
      ctx.strokeStyle = "rgba(109,40,217,0.4)";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Roof cone
    ctx.fillStyle = "#6d28d9";
    ctx.beginPath();
    ctx.moveTo(LX - 16, LIGHT_Y);
    ctx.lineTo(LX + 16, LIGHT_Y);
    ctx.lineTo(LX, LIGHT_Y - 20);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#a78bfa";
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // ── Bulb glow ──
    const pulse = 0.88 + 0.12 * Math.sin(time * 3.5);
    const bulb = ctx.createRadialGradient(LX, LIGHT_Y, 0, LX, LIGHT_Y, 26 * pulse);
    bulb.addColorStop(0,    "rgba(255,252,220,1)");
    bulb.addColorStop(0.2,  "rgba(255,230,180,0.7)");
    bulb.addColorStop(0.5,  "rgba(200,160,255,0.3)");
    bulb.addColorStop(1,    "rgba(124,58,237,0)");
    ctx.beginPath();
    ctx.arc(LX, LIGHT_Y, 26 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = bulb;
    ctx.fill();

    // Core
    ctx.beginPath();
    ctx.arc(LX, LIGHT_Y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,252,230,0.98)";
    ctx.fill();
  });

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function HiringSection() {
  const beamAngleRef = useRef(-Math.PI / 2);

  return (
    <section className="py-16 sm:py-24 overflow-hidden">
      <div
        className="relative rounded-2xl border border-white/[0.08] overflow-hidden bg-[#030208]"
        style={{ aspectRatio: `${W}/${H}` }}
      >
        {/* Canvas layer */}
        <div className="absolute inset-0">
          <LighthouseCanvas beamAngleRef={beamAngleRef} />
        </div>

        {/* DOM candidate cards */}
        <div className="absolute inset-0">
          {CANDIDATES.map((c) => (
            <CandidateCard key={c.initials} {...c} beamAngleRef={beamAngleRef} />
          ))}
        </div>

        {/* Left text overlay */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          {/* Left gradient fade so text is legible */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to right, rgba(3,2,8,0.92) 0%, rgba(3,2,8,0.7) 28%, transparent 55%)",
            }}
          />
          <div className="relative h-full flex flex-col justify-center pl-8 sm:pl-12 lg:pl-14 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="max-w-[300px]"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/[0.1] px-3.5 py-1.5 text-xs text-violet-300/80 mb-6">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-400" />
                </span>
                Now hiring · 4 roles
              </div>

              <h2 className="bg-gradient-to-b from-white to-white/50 bg-clip-text text-3xl sm:text-4xl font-semibold leading-[1.12] tracking-tight text-transparent mb-3">
                We're scanning<br />for the best.
              </h2>

              <p className="text-sm text-white/40 leading-relaxed mb-6">
                Backend, Rust, quant, growth.<br />Small team. Big infra. Equity day one.
              </p>

              <div className="flex flex-wrap gap-1.5 mb-7">
                {[
                  { label: "Backend", color: "#7c3aed" },
                  { label: "Rust",    color: "#0891b2" },
                  { label: "Quant",   color: "#be185d" },
                  { label: "Growth",  color: "#059669" },
                ].map(({ label, color }) => (
                  <span
                    key={label}
                    className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                    style={{
                      background: color + "18",
                      border: `1px solid ${color}35`,
                      color: color + "cc",
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              <Link href="/careers">
                <button className="group flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90 transition-all">
                  See open roles
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}