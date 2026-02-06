"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

function GlassmorphicCard({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-100px" }}
      className="group relative"
    >
      <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] blur-xl" />
      <div className="relative rounded-[32px] border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-transparent p-8 backdrop-blur-2xl transition-all duration-500 hover:border-white/[0.15] hover:shadow-[0_8px_32px_rgba(227,184,255,0.1)]">
        {children}
      </div>
    </motion.div>
  );
}

function FloatingOrb({ delay = 0, duration = 20, x = "0%", y = "0%", size = 400, color = "227,184,255" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, delay, ease: "easeOut" }}
      className="pointer-events-none absolute"
      style={{ left: x, top: y }}
    >
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
        style={{ width: size, height: size }}
      >
        <div 
          className="absolute inset-0 rounded-full blur-[120px]"
          style={{ 
            background: `radial-gradient(circle, rgba(${color},0.15) 0%, transparent 70%)`,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const heroY = useTransform(smoothProgress, [0, 0.5], [0, -100]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.3], [1, 0.95]);

  const [typedText, setTypedText] = useState("");
  const fullText = "Trade with absolute clarity";

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      if (idx <= fullText.length) {
        setTypedText(fullText.slice(0, idx));
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Sub-second signal delivery across all timeframes",
      gradient: "from-yellow-500/20 to-orange-500/20",
    },
    {
      icon: "🎯",
      title: "Precision Targeting",
      description: "Multi-indicator confluence for maximum accuracy",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: "🧠",
      title: "Smart Learning",
      description: "Adaptive algorithms that improve over time",
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: "🛡️",
      title: "Risk Shield",
      description: "Advanced position sizing and stop-loss automation",
      gradient: "from-green-500/20 to-emerald-500/20",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Quantitative Trader",
      company: "HedgeFund Capital",
      text: "The signal quality is unlike anything I've seen. Reduced my false positives by 73%.",
      avatar: "SC",
      verified: true,
    },
    {
      name: "Marcus Williams",
      role: "Head of Trading",
      company: "Crypto Ventures",
      text: "Backtesting showed 4.2x improvement over our previous system. Game-changing.",
      avatar: "MW",
      verified: true,
    },
    {
      name: "Dr. Elena Petrov",
      role: "Algorithmic Strategist",
      company: "Independent",
      text: "The multi-timeframe analysis is mathematically elegant. Exactly what I needed.",
      avatar: "EP",
      verified: true,
    },
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden bg-black text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black" />
      
      {/* Floating orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <FloatingOrb delay={0} duration={25} x="10%" y="10%" size={500} color="139,92,246" />
        <FloatingOrb delay={0.3} duration={30} x="80%" y="5%" size={400} color="236,72,153" />
        <FloatingOrb delay={0.6} duration={35} x="50%" y="60%" size={600} color="59,130,246" />
        <FloatingOrb delay={0.9} duration={28} x="20%" y="80%" size={450} color="167,139,250" />
      </div>

      {/* Grain texture overlay */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.015]">
        <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* HERO SECTION */}
        <motion.section 
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative flex min-h-[100vh] items-center justify-center pb-20 pt-32"
        >
          <div className="text-center">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-xl"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500" />
              </span>
              <span className="text-sm font-medium text-white/70">Live Signal Generation</span>
            </motion.div>

            {/* Main headline */}
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative mx-auto max-w-5xl"
            >
              <span className="block bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-7xl font-semibold leading-[1.1] tracking-[-0.02em] text-transparent sm:text-8xl lg:text-[120px]">
                {typedText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                  className="ml-2 inline-block h-[0.9em] w-1 bg-gradient-to-b from-purple-400 to-pink-400"
                />
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-white/60 sm:text-2xl"
            >
              Professional-grade market intelligence. 
              <span className="text-white/90"> Delivered instantly</span> to your Telegram.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-4"
            >
              <Link href="/lab">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative overflow-hidden rounded-2xl bg-white px-10 py-4 text-base font-semibold text-black shadow-[0_20px_60px_-15px_rgba(255,255,255,0.3)] transition-all hover:shadow-[0_20px_80px_-15px_rgba(255,255,255,0.4)]"
                >
                  <span className="relative z-10">Start Free Trial</span>
                  <motion.div
                    className="absolute inset-0 -z-0 bg-gradient-to-r from-purple-100 to-pink-100"
                    initial={{ x: "100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </Link>
              
              <Link href="/demo">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-10 py-4 text-base font-semibold backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.06]"
                >
                  Watch Demo
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-20 flex flex-wrap items-center justify-center gap-12"
            >
              {[
                { value: "99.9%", label: "Uptime" },
                { value: "<100ms", label: "Latency" },
                { value: "24/7", label: "Monitoring" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-white/50">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2"
            >
              <div className="text-xs text-white/40">Scroll to explore</div>
              <div className="h-8 w-px bg-gradient-to-b from-white/20 to-transparent" />
            </motion.div>
          </motion.div>
        </motion.section>

        {/* FEATURES SECTION */}
        <section className="relative py-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-20 text-center"
          >
            <h2 className="bg-gradient-to-br from-white to-white/60 bg-clip-text text-5xl font-semibold leading-tight tracking-tight text-transparent sm:text-6xl lg:text-7xl">
              Built for professionals.
              <br />
              <span className="text-white/40">Designed for everyone.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {features.map((feature, i) => (
              <GlassmorphicCard key={i} delay={i * 0.1}>
                <div className="flex items-start gap-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-3xl backdrop-blur-xl`}
                  >
                    {feature.icon}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-2xl font-semibold">{feature.title}</h3>
                    <p className="leading-relaxed text-white/60">{feature.description}</p>
                  </div>
                </div>
              </GlassmorphicCard>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="relative py-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-20 text-center"
          >
            <h2 className="bg-gradient-to-br from-white to-white/60 bg-clip-text text-5xl font-semibold leading-tight tracking-tight text-transparent sm:text-6xl lg:text-7xl">
              Three steps to
              <br />
              <span className="text-white/40">smarter trading</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-white/10 via-white/5 to-transparent lg:block" />

            <div className="space-y-24">
              {[
                {
                  number: "01",
                  title: "Configure Your Strategy",
                  description: "Select indicators, set thresholds, choose timeframes. Our intuitive interface makes complex strategies simple.",
                  features: ["RSI, MACD, Bollinger Bands", "Multi-timeframe analysis", "Custom alert conditions"],
                },
                {
                  number: "02",
                  title: "Backtest & Validate",
                  description: "See how your strategy would have performed historically. Optimize before going live.",
                  features: ["Historical performance", "Win rate analysis", "Risk metrics"],
                },
                {
                  number: "03",
                  title: "Deploy & Monitor",
                  description: "Activate your bot and receive real-time signals directly to Telegram. Adjust on the fly.",
                  features: ["Instant Telegram alerts", "24/7 monitoring", "Live performance tracking"],
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.2 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`flex flex-col gap-12 lg:flex-row lg:items-center ${
                    i % 2 === 0 ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  <div className="flex-1">
                    <GlassmorphicCard delay={0}>
                      <div className="text-6xl font-bold text-white/5">{step.number}</div>
                      <h3 className="mb-4 mt-4 text-3xl font-semibold">{step.title}</h3>
                      <p className="mb-6 text-lg leading-relaxed text-white/60">{step.description}</p>
                      <ul className="space-y-3">
                        {step.features.map((feat, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3"
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
                            <span className="text-white/80">{feat}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </GlassmorphicCard>
                  </div>
                  
                  <div className="relative flex-1">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
                      <div className="flex h-full items-center justify-center text-6xl opacity-20">
                        {step.number}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="relative py-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-20 text-center"
          >
            <h2 className="bg-gradient-to-br from-white to-white/60 bg-clip-text text-5xl font-semibold leading-tight tracking-tight text-transparent sm:text-6xl lg:text-7xl">
              Trusted by experts
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-white/50">
              Professional traders who demand precision
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <GlassmorphicCard key={i} delay={i * 0.15}>
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-lg font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-semibold">{testimonial.name}</div>
                        {testimonial.verified && (
                          <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="text-sm text-white/50">{testimonial.role}</div>
                      <div className="text-xs text-white/40">{testimonial.company}</div>
                    </div>
                  </div>
                </div>
                <p className="leading-relaxed text-white/70">"{testimonial.text}"</p>
              </GlassmorphicCard>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative py-32">
          <GlassmorphicCard delay={0}>
            <div className="text-center">
              <h2 className="mx-auto max-w-4xl bg-gradient-to-br from-white to-white/60 bg-clip-text text-5xl font-semibold leading-tight tracking-tight text-transparent sm:text-6xl lg:text-7xl">
                Ready to elevate
                <br />
                your trading?
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-xl text-white/60">
                Join thousands of traders using Cryphos to make smarter, faster decisions
              </p>
              
              <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                <Link href="/lab">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-2xl bg-white px-12 py-5 text-lg font-semibold text-black shadow-[0_20px_60px_-15px_rgba(255,255,255,0.3)] transition-all hover:shadow-[0_20px_80px_-15px_rgba(255,255,255,0.4)]"
                  >
                    Start Free Trial
                  </motion.button>
                </Link>
                
                <Link href="/pricing">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-12 py-5 text-lg font-semibold backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.06]"
                  >
                    View Pricing
                  </motion.button>
                </Link>
              </div>

              <p className="mt-8 text-sm text-white/40">
                No credit card required · Cancel anytime
              </p>
            </div>
          </GlassmorphicCard>
        </section>
      </div>
    </div>
  );
}