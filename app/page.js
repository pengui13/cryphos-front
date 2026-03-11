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
  TrendingUp, Bell, Settings2, ArrowRight, CheckCircle2
} from "lucide-react";

function Card({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-40px" }}
      className={`group relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm transition-colors duration-300 hover:border-white/[0.14] sm:p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ children, sub }) {
  return (
    <div className="mb-14 sm:mb-20 text-center">
      <h2 className="mx-auto max-w-3xl bg-gradient-to-b from-white to-white/50 bg-clip-text text-4xl font-semibold leading-[1.15] tracking-tight text-transparent sm:text-5xl lg:text-6xl">
        {children}
      </h2>
      {sub && <p className="mx-auto mt-4 max-w-xl text-base text-white/50 sm:text-lg">{sub}</p>}
    </div>
  );
}

function Orb({ x, y, size, color }) {
  return (
    <div className="pointer-events-none absolute" style={{ left: x, top: y, width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: `radial-gradient(circle, rgba(${color},0.18) 0%, transparent 70%)`, filter: "blur(80px)" }}
      />
    </div>
  );
}

export default function Home() {
  const containerRef = useRef(null);
  const { t } = useLang();

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, -40]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden bg-[#080808] text-white">
      {/* Fixed background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(80,40,160,0.25),transparent)]" />
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <Orb x="5%" y="8%" size={500} color="100,60,200" />
        <Orb x="75%" y="2%" size={400} color="180,60,120" />
        <Orb x="40%" y="55%" size={600} color="40,100,200" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-8 lg:px-12">

        {/* ── HERO ── */}
        <motion.section
          style={{ y: heroY, opacity: heroOpacity }}
          className="flex min-h-screen flex-col items-center justify-center pb-16 text-center sm:pt-36"
        >
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-4xl bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-5xl font-semibold leading-[1.08] tracking-tight text-transparent sm:text-7xl lg:text-8xl"
          >
            {t("home.headline")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/55 sm:mt-8 sm:text-xl"
          >
            {t("home.sub")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:gap-4"
          >
            <Link href="/lab" className="w-full sm:w-auto">
              <button className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-black transition-all hover:bg-white/90 sm:px-10 sm:py-4 sm:text-base">
                {t("home.ctaPrimary")}
              </button>
            </Link>
          </motion.div>
        </motion.section>

        {/* ── STRATEGIES CAROUSEL ── */}
        <StrategiesCarousel />

        {/* ── FEATURES GRID ── */}
        <section className="py-16 sm:py-28">
          <SectionHeading sub={t("home.featuresSub")}>
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
              <Card key={i} delay={i * 0.07}>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <Icon className="h-5 w-5 text-white/70" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{t(`home.${key}Title`)}</h3>
                <p className="text-sm leading-relaxed text-white/50">{t(`home.${key}Desc`)}</p>
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

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-4">
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
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                viewport={{ once: true }}
                className="flex flex-col gap-1.5 rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 hover:border-white/[0.12] transition-colors"
              >
                <span className="text-sm font-semibold text-white">{label}</span>
                <span className="text-xs text-white/40">{t(`home.${key}Desc`)}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── TEAM ── */}
        <TeamSection />

        {/* ── FINAL CTA ── */}
        <section className="py-16 sm:py-28">
          <Card>
            <div className="text-center">
              <h2 className="mx-auto max-w-2xl bg-gradient-to-b from-white to-white/50 bg-clip-text text-4xl font-semibold leading-tight tracking-tight text-transparent sm:text-5xl lg:text-6xl">
                {t("home.ctaTitle")}
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-base text-white/50 sm:mt-5 sm:text-lg">
                {t("home.ctaSub")}
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
                <Link href="/lab" className="w-full sm:w-auto">
                  <button className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-10 py-4 text-base font-semibold text-black transition-all hover:bg-white/90 sm:px-12 sm:py-4">
                    {t("home.ctaPrimary")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </Link>
                <Link href="/pricing" className="w-full sm:w-auto">
                  <button className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-10 py-4 text-base font-semibold transition-all hover:border-white/20 hover:bg-white/[0.07] sm:px-12">
                    {t("home.viewPricing")}
                  </button>
                </Link>
              </div>

              <p className="mt-6 text-xs text-white/30 sm:text-sm">{t("home.ctaNote")}</p>
            </div>
          </Card>
        </section>

      </div>
    </div>
  );
}