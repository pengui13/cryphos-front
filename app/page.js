"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

function GlassmorphicCard({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative"
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] blur-xl" />
      <div className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 sm:p-8">
        {children}
      </div>
    </motion.div>
  );
}

function FloatingOrb({ x = "0%", y = "0%", size = 400, color = "139,92,246" }) {
  return (
    <div
      className="pointer-events-none absolute opacity-40"
      style={{ left: x, top: y, width: size, height: size }}
    >
      <div 
        className="absolute inset-0 rounded-full blur-[100px]"
        style={{ 
          background: `radial-gradient(circle, rgba(${color},0.2) 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const features = [
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Sub-second signal delivery across all timeframes",
    },
    {
      icon: "🎯",
      title: "Precision Targeting",
      description: "Multi-indicator confluence for maximum accuracy",
    },
    {
      icon: "🧠",
      title: "Smart Learning",
      description: "Adaptive algorithms that improve over time",
    },
    {
      icon: "🛡️",
      title: "Risk Shield",
      description: "Advanced position sizing and automation",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Quantitative Trader",
      company: "HedgeFund Capital",
      text: "The signal quality is unlike anything I've seen. Reduced my false positives by 73%.",
      avatar: "SC",
    },
    {
      name: "Marcus Williams",
      role: "Head of Trading",
      company: "Crypto Ventures",
      text: "Backtesting showed 4.2x improvement over our previous system. Game-changing.",
      avatar: "MW",
    },
    {
      name: "Dr. Elena Petrov",
      role: "Algorithmic Strategist",
      company: "Independent",
      text: "The multi-timeframe analysis is mathematically elegant. Exactly what I needed.",
      avatar: "EP",
    },
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden bg-black text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black" />
      
      {/* Floating orbs - static for better mobile performance */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <FloatingOrb x="10%" y="10%" size={400} color="139,92,246" />
        <FloatingOrb x="80%" y="5%" size={350} color="236,72,153" />
        <FloatingOrb x="50%" y="60%" size={500} color="59,130,246" />
        <FloatingOrb x="20%" y="80%" size={400} color="167,139,250" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* HERO SECTION */}
        <motion.section 
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative flex min-h-screen items-center justify-center pb-16 pt-24 sm:pb-20 sm:pt-32"
        >
          <div className="text-center">
            {/* Live indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-xl sm:mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500" />
              </span>
              <span className="text-xs font-medium text-white/70 sm:text-sm">Live Signal Generation</span>
            </motion.div>

            {/* Main headline - no typing effect */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mx-auto max-w-5xl px-4"
            >
              <span className="block bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-5xl font-semibold leading-[1.1] tracking-tight text-transparent sm:text-7xl lg:text-8xl">
                Trade with absolute clarity
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl px-4 text-base leading-relaxed text-white/60 sm:mt-8 sm:text-xl lg:text-2xl"
            >
              Professional-grade market intelligence. 
              <span className="text-white/90"> Delivered instantly</span> to your Telegram.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col items-center justify-center gap-3 px-4 sm:mt-12 sm:flex-row sm:gap-4"
            >
              <Link href="/lab" className="w-full sm:w-auto">
                <button className="w-full rounded-2xl bg-white px-8 py-3.5 text-sm font-semibold text-black transition-all hover:bg-white/90 sm:px-10 sm:py-4 sm:text-base">
                  Start Free Trial
                </button>
              </Link>
              
              <Link href="/demo" className="w-full sm:w-auto">
                <button className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-3.5 text-sm font-semibold backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.06] sm:px-10 sm:py-4 sm:text-base">
                  Watch Demo
                </button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-8 px-4 sm:mt-20 sm:gap-12"
            >
              {[
                { value: "99.9%", label: "Uptime" },
                { value: "<100ms", label: "Latency" },
                { value: "24/7", label: "Monitoring" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="bg-gradient-to-br from-white to-white/60 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs text-white/50 sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* FEATURES SECTION */}
        <section className="relative py-16 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-50px" }}
            className="mb-12 text-center sm:mb-20"
          >
            <h2 className="bg-gradient-to-br from-white to-white/60 bg-clip-text px-4 text-4xl font-semibold leading-tight tracking-tight text-transparent sm:text-5xl lg:text-6xl">
              Built for professionals.
              <br />
              <span className="text-white/40">Designed for everyone.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            {features.map((feature, i) => (
              <GlassmorphicCard key={i} delay={i * 0.1}>
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-2xl sm:h-16 sm:w-16 sm:rounded-2xl sm:text-3xl">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold sm:text-2xl">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-white/60 sm:text-base">{feature.description}</p>
                  </div>
                </div>
              </GlassmorphicCard>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="relative py-16 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-50px" }}
            className="mb-12 text-center sm:mb-20"
          >
            <h2 className="bg-gradient-to-br from-white to-white/60 bg-clip-text px-4 text-4xl font-semibold leading-tight tracking-tight text-transparent sm:text-5xl lg:text-6xl">
              Three steps to
              <br />
              <span className="text-white/40">smarter trading</span>
            </h2>
          </motion.div>

          <div className="space-y-12 sm:space-y-24">
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <GlassmorphicCard delay={0}>
                  <div className="text-5xl font-bold text-white/5 sm:text-6xl">{step.number}</div>
                  <h3 className="mb-3 mt-4 text-2xl font-semibold sm:mb-4 sm:text-3xl">{step.title}</h3>
                  <p className="mb-4 text-base leading-relaxed text-white/60 sm:mb-6 sm:text-lg">{step.description}</p>
                  <ul className="space-y-2 sm:space-y-3">
                    {step.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
                        <span className="text-sm text-white/80 sm:text-base">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="relative py-16 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-50px" }}
            className="mb-12 text-center sm:mb-20"
          >
            <h2 className="bg-gradient-to-br from-white to-white/60 bg-clip-text px-4 text-4xl font-semibold leading-tight tracking-tight text-transparent sm:text-5xl lg:text-6xl">
              Trusted by experts
            </h2>
            <p className="mx-auto mt-4 max-w-2xl px-4 text-base text-white/50 sm:mt-6 sm:text-xl">
              Professional traders who demand precision
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <GlassmorphicCard key={i} delay={i * 0.1}>
                <div className="mb-4 flex items-start gap-3 sm:mb-6 sm:gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-sm font-bold sm:h-14 sm:w-14 sm:rounded-2xl sm:text-lg">
                    {testimonial.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-sm font-semibold sm:text-base">{testimonial.name}</div>
                      <svg className="h-4 w-4 shrink-0 text-blue-400 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="mt-0.5 truncate text-xs text-white/50 sm:text-sm">{testimonial.role}</div>
                    <div className="truncate text-xs text-white/40">{testimonial.company}</div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-white/70 sm:text-base">"{testimonial.text}"</p>
              </GlassmorphicCard>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative py-16 sm:py-32">
          <GlassmorphicCard delay={0}>
            <div className="text-center">
              <h2 className="mx-auto max-w-4xl bg-gradient-to-br from-white to-white/60 bg-clip-text px-4 text-4xl font-semibold leading-tight tracking-tight text-transparent sm:text-5xl lg:text-6xl">
                Ready to elevate
                <br />
                your trading?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl px-4 text-base text-white/60 sm:mt-6 sm:text-xl">
                Join thousands of traders using Cryphos to make smarter, faster decisions
              </p>
              
              <div className="mt-8 flex flex-col items-center justify-center gap-3 px-4 sm:mt-12 sm:flex-row sm:gap-4">
                <Link href="/lab" className="w-full sm:w-auto">
                  <button className="w-full rounded-2xl bg-white px-10 py-4 text-base font-semibold text-black transition-all hover:bg-white/90 sm:px-12 sm:py-5 sm:text-lg">
                    Start Free Trial
                  </button>
                </Link>
                
                <Link href="/pricing" className="w-full sm:w-auto">
                  <button className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-10 py-4 text-base font-semibold backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.06] sm:px-12 sm:py-5 sm:text-lg">
                    View Pricing
                  </button>
                </Link>
              </div>

              <p className="mt-6 px-4 text-xs text-white/40 sm:mt-8 sm:text-sm">
                No credit card required · Cancel anytime
              </p>
            </div>
          </GlassmorphicCard>
        </section>
      </div>
    </div>
  );
}