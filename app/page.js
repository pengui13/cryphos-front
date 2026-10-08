"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLang } from "./LanguageContext";
import StrategiesCarousel from "./StrategiesCarousel";
import TeamSection from "./TeamSection";
import TradingGame from "./TradingGame";
import HiringSection from "./HiringSection";

import {
  Zap, Target, ShieldCheck, BarChart2, Clock, Layers,
  ArrowRight, CheckCircle2, Sliders, LineChart, Send,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

/* ── Primitives ───────────────────────────────────────────────────────────── */

function Card({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
      viewport={{ once: true, margin: "-40px" }}
      className={`surface surface-hover surface-ring group relative overflow-hidden rounded-2xl p-6 sm:p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ children, sub, eyebrow }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      viewport={{ once: true, margin: "-60px" }}
      className="mb-14 text-center sm:mb-20"
    >
      {eyebrow && (
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
          {eyebrow}
        </p>
      )}
      <h2 className="text-display mx-auto max-w-3xl whitespace-pre-line text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.5rem]">
        {children}
      </h2>
      {sub && (
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/45 sm:text-lg">
          {sub}
        </p>
      )}
    </motion.div>
  );
}

function Orb({ x, y, size, color, delay = 0 }) {
  return (
    <div
      className="pointer-events-none absolute animate-float-slow"
      style={{ left: x, top: y, width: size, height: size, animationDelay: `${delay}s` }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(${color},0.20) 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function Home() {
  const containerRef = useRef(null);
  const { t } = useLang();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, -40]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);

  const steps = [
    { icon: Sliders,   n: 1, key: "step1" },
    { icon: LineChart, n: 2, key: "step2" },
    { icon: Send,      n: 3, key: "step3" },
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden bg-bkg text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(139,92,246,0.22),transparent)]" />
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <Orb x="5%"  y="8%"  size={500} color="139,92,246" />
        <Orb x="75%" y="2%"  size={400} color="192,132,252" delay={2} />
        <Orb x="40%" y="55%" size={600} color="56,189,248"  delay={4} />
      </div>
      {/* A very faint grid keeps the empty space from reading as a void */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.55]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 70% 55% at 50% 0%, #000 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 0%, #000 20%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-8 lg:px-12">

        {/* ── HERO ── */}
        <motion.section
          style={{ y: heroY, opacity: heroOpacity }}
          className="flex min-h-[92vh] flex-col items-center justify-center pb-16 text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
            className="text-display mx-auto max-w-4xl text-5xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-7xl lg:text-[5.25rem]"
          >
            {t("home.headline")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/50 sm:mt-8 sm:text-xl"
          >
            {t("home.sub")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="mt-9 flex w-full flex-col items-center gap-3 sm:mt-11 sm:w-auto sm:flex-row sm:gap-4"
          >
            <Link href="/lab" className="w-full sm:w-auto">
              <button className="btn-primary group flex w-full items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold sm:px-10 sm:py-4 sm:text-base">
                {t("home.ctaPrimary")}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </Link>
            <Link href="/bots" className="w-full sm:w-auto">
              <button className="btn-ghost w-full rounded-xl px-8 py-3.5 text-sm font-semibold sm:px-10 sm:py-4 sm:text-base">
                {t("home.ctaSecondary")}
              </button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.42 }}
            className="mt-6 text-xs text-white/30 sm:text-sm"
          >
            {t("home.ctaNote")}
          </motion.p>

          {/* What the product actually does — no invented traction numbers. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
            className="mt-16 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:mt-20"
          >
            {[t("home.chip1"), t("home.chip2"), t("home.chip3"), t("home.chip4")].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/[0.07] bg-white/[0.03] px-3.5 py-1.5 text-xs text-white/45"
              >
                {chip}
              </span>
            ))}
          </motion.div>

        </motion.section>

        {/* ── STRATEGIES CAROUSEL ── */}
        <StrategiesCarousel />

        {/* ── FEATURES GRID ── */}
        <section className="py-16 sm:py-28">
          <SectionHeading eyebrow={t("nav.lab")} sub={t("home.featuresSub")}>
            {t("home.featuresTitle")}
          </SectionHeading>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {[
              { icon: Zap,         key: "feat1" },
              { icon: Target,      key: "feat2" },
              { icon: BarChart2,   key: "feat3" },
              { icon: ShieldCheck, key: "feat4" },
              { icon: Clock,       key: "feat5" },
              { icon: Layers,      key: "feat6" },
            ].map(({ icon: Icon, key }, i) => (
              <Card key={key} delay={i * 0.07}>
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.05] text-white/70 transition-colors duration-300 group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary-hover">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{t(`home.${key}Title`)}</h3>
                <p className="text-sm leading-relaxed text-white/45">{t(`home.${key}Desc`)}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-16 sm:py-28">
          <SectionHeading sub={t("home.stepsSub")}>{t("home.stepsTitle")}</SectionHeading>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
            {steps.map(({ icon: Icon, n, key }, i) => (
              <Card key={key} delay={i * 0.09}>
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.05] text-white/70 transition-colors duration-300 group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary-hover">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="tnum text-4xl font-semibold leading-none text-white/[0.07]">
                    0{n}
                  </span>
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{t(`home.${key}Title`)}</h3>
                <p className="text-sm leading-relaxed text-white/45">{t(`home.${key}Desc`)}</p>

                <ul className="mt-5 space-y-2.5 border-t border-white/[0.06] pt-5">
                  {["p1", "p2", "p3"].map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-white/55">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-hover/70" />
                      {t(`home.${key}${p}`)}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        {/* ── TRADING MINI GAME ── */}
        <TradingGame />

        <HiringSection />

        {/* ── INDICATORS LIST ── */}
        <section className="py-16 sm:py-28">
          <SectionHeading sub={t("home.indicatorsSub")}>
            {t("home.indicatorsTitle")}
          </SectionHeading>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {[
              { key: "ind1",  label: "RSI" },
              { key: "ind2",  label: "MACD" },
              { key: "ind3",  label: "Bollinger Bands" },
              { key: "ind4",  label: "EMA / MA" },
              { key: "ind5",  label: "Fibonacci" },
              { key: "ind6",  label: "Smart Money" },
              { key: "ind7",  label: "Volume" },
              { key: "ind8",  label: "Support & Resistance" },
              { key: "ind9",  label: "Funding Rates" },
              { key: "ind10", label: "Fear & Greed" },
            ].map(({ key, label }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (i % 5) * 0.05, ease: EASE }}
                viewport={{ once: true }}
                className="surface surface-hover flex flex-col gap-1.5 rounded-xl p-4"
              >
                <span className="text-sm font-semibold text-white">{label}</span>
                <span className="text-xs leading-relaxed text-white/40">{t(`home.${key}Desc`)}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── TEAM ── */}
        <TeamSection />

        {/* ── FINAL CTA ── */}
        <section className="py-16 sm:py-28">
          <Card className="!p-0">
            {/* Brand wash so the closing card reads as the loudest thing on the page */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,rgba(139,92,246,0.16),transparent)]" />
            <div className="relative px-6 py-14 text-center sm:px-12 sm:py-20">
              <h2 className="text-display mx-auto max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                {t("home.ctaTitle")}
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-base text-white/45 sm:text-lg">
                {t("home.ctaSub")}
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:mt-11 sm:flex-row sm:gap-4">
                <Link href="/lab" className="w-full sm:w-auto">
                  <button className="btn-primary group flex w-full items-center justify-center gap-2 rounded-xl px-10 py-4 text-base font-semibold sm:px-12">
                    {t("home.ctaPrimary")}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                </Link>
                <Link href="/pricing" className="w-full sm:w-auto">
                  <button className="btn-ghost w-full rounded-xl px-10 py-4 text-base font-semibold sm:px-12">
                    {t("home.viewPricing")}
                  </button>
                </Link>
              </div>

              <p className="mt-7 text-xs text-white/30 sm:text-sm">{t("home.ctaNote")}</p>
            </div>
          </Card>
        </section>

      </div>
    </div>
  );
}
