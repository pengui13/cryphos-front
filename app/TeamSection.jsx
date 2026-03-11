"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const TEAM = [
  {
    initials: "AK",
    name: "Alex K.",
    role: "Backend Lead",
    tag: "backend",
    color: "#7c3aed",
    skills: ["Django", "PostgreSQL", "Redis"],
    bio: "8 years building exchange infrastructure. Obsessed with sub-ms latency.",
  },
  {
    initials: "DM",
    name: "Daria M.",
    role: "HFT Engineer",
    tag: "hft",
    color: "#0891b2",
    skills: ["Rust", "C++", "Order Books"],
    bio: "Former prop trader turned engineer. Built matching engines at Tier-1 exchanges.",
  },
  {
    initials: "VR",
    name: "Viktor R.",
    role: "Quant Dev",
    tag: "quant",
    color: "#059669",
    skills: ["Python", "GARCH", "ML"],
    bio: "Regime volatility models, VaR prediction, and signal generation pipelines.",
  },
  {
    initials: "SL",
    name: "Sasha L.",
    role: "Backend Engineer",
    tag: "backend",
    color: "#9333ea",
    skills: ["Celery", "WebSockets", "Docker"],
    bio: "Real-time data pipelines and bot execution infrastructure.",
  },
  {
    initials: "NP",
    name: "Niko P.",
    role: "HFT / Infra",
    tag: "hft",
    color: "#b45309",
    skills: ["Rust", "Linux", "FPGA"],
    bio: "Kernel bypass networking and co-location specialist.",
  },
  {
    initials: "EP",
    name: "Elena P.",
    role: "Quant Researcher",
    tag: "quant",
    color: "#be185d",
    skills: ["Statistics", "Backtesting", "R"],
    bio: "Strategy research and performance attribution across 50+ indicators.",
  },
  {
    initials: "MK",
    name: "Mila K.",
    role: "Designer",
    tag: "design",
    color: "#d97706",
    skills: ["Figma", "Motion", "Systems"],
    bio: "Makes complex trading tools feel effortless. The one who makes this beautiful.",
  },
];

const TAG_COLORS = {
  backend: { bg: "rgba(124,58,237,0.12)", border: "rgba(124,58,237,0.3)", text: "#a78bfa" },
  hft:     { bg: "rgba(8,145,178,0.12)",  border: "rgba(8,145,178,0.3)",  text: "#67e8f9" },
  quant:   { bg: "rgba(5,150,105,0.12)",  border: "rgba(5,150,105,0.3)",  text: "#6ee7b7" },
  design:  { bg: "rgba(217,119,6,0.12)",  border: "rgba(217,119,6,0.3)",  text: "#fcd34d" },
};

function MemberCard({ member, i }) {
  const [hovered, setHovered] = useState(false);
  const tagStyle = TAG_COLORS[member.tag];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-30px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 cursor-default overflow-hidden transition-colors duration-300"
      style={{ borderColor: hovered ? member.color + "40" : undefined }}
    >
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{ background: `radial-gradient(circle at 30% 30%, ${member.color}18, transparent 70%)` }}
      />
      <div className="flex items-start justify-between mb-4">
        <div
          className="h-11 w-11 rounded-xl flex items-center justify-center text-sm font-bold"
          style={{ background: member.color + "22", border: `1px solid ${member.color}44`, color: member.color }}
        >
          {member.initials}
        </div>
        <span
          className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase"
          style={{ background: tagStyle.bg, border: `1px solid ${tagStyle.border}`, color: tagStyle.text }}
        >
          {member.tag}
        </span>
      </div>
      <div className="mb-3">
        <div className="text-sm font-semibold text-white">{member.name}</div>
        <div className="text-xs text-white/40 mt-0.5">{member.role}</div>
      </div>
      <p className="text-xs text-white/50 leading-relaxed mb-4">{member.bio}</p>
      <div className="flex flex-wrap gap-1.5">
        {member.skills.map((s) => (
          <span key={s} className="rounded-md px-2 py-0.5 text-[10px] font-medium bg-white/[0.05] text-white/40 border border-white/[0.06]">
            {s}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function TeamSection() {
  return (
    <section className="py-16 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        className="mb-14 sm:mb-20 text-center"
      >
        <h2 className="mx-auto max-w-3xl bg-gradient-to-b from-white to-white/50 bg-clip-text text-4xl font-semibold leading-[1.15] tracking-tight text-transparent sm:text-5xl lg:text-6xl">
          Built by obsessives
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/50 sm:text-lg">
          6 engineers from quant, HFT, and backend — and one designer who ties it all together.
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-6"
        >
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs text-white/50 hover:border-emerald-500/30 hover:text-white/70 hover:bg-emerald-500/[0.06] transition-all"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            We're hiring — see open roles
          </Link>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TEAM.map((member, i) => (
          <MemberCard key={member.name} member={member} i={i} />
        ))}
      </div>

      {/* Bottom nudge */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
        className="mt-10 text-center"
      >
        <Link href="/careers">
          <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm text-white/60 hover:border-white/20 hover:text-white/80 hover:bg-white/[0.07] transition-all">
            Think you belong here?
            <span className="text-white/30">→</span>
          </button>
        </Link>
      </motion.div>
    </section>
  );
}