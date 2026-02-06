"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X, Sparkles, Zap, Crown, ArrowRight } from "lucide-react";

function PricingCard({ tier, isPopular = false, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative"
    >
      {isPopular && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: delay + 0.2 }}
          viewport={{ once: true }}
          className="absolute -top-5 left-1/2 z-10 -translate-x-1/2"
        >
          <div className="flex items-center gap-2 rounded-full border border-purple-500/50 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-1.5 backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span className="text-xs font-semibold text-white">Most Popular</span>
          </div>
        </motion.div>
      )}

      <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] blur-xl" />
      
      <div className={`relative overflow-hidden rounded-[32px] border backdrop-blur-2xl transition-all duration-500 ${
        isPopular 
          ? 'border-purple-500/30 bg-gradient-to-br from-purple-500/[0.08] to-pink-500/[0.04] shadow-[0_8px_32px_rgba(168,85,247,0.15)] hover:border-purple-500/50' 
          : 'border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-transparent hover:border-white/[0.15]'
      } hover:shadow-[0_8px_32px_rgba(227,184,255,0.1)]`}>
        <div className="p-8">
          {/* Icon */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${
              tier.gradient || "bg-white/5"
            }`}
          >
            {tier.icon}
          </motion.div>

          {/* Tier Name */}
          <h3 className="mb-2 text-2xl font-semibold">{tier.name}</h3>
          <p className="mb-6 text-sm text-white/60">{tier.description}</p>

          {/* Price */}
          <div className="mb-8">
            {tier.price === "Custom" ? (
              <div className="text-4xl font-bold">Custom</div>
            ) : tier.price === 0 ? (
              <div className="text-4xl font-bold">Free</div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
                  ${tier.price}
                </span>
                <span className="text-white/50">/month</span>
              </div>
            )}
            {tier.price !== "Custom" && tier.price !== 0 && (
              <p className="mt-2 text-xs text-white/40">Billed monthly</p>
            )}
          </div>

          {/* CTA Button */}
          <Link href={tier.ctaLink}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`mb-8 w-full rounded-2xl px-6 py-3.5 font-semibold transition-all ${
                isPopular
                  ? "bg-white text-black shadow-[0_8px_24px_rgba(255,255,255,0.2)] hover:shadow-[0_12px_32px_rgba(255,255,255,0.3)]"
                  : "border border-white/10 bg-white/[0.03] text-white hover:border-white/20 hover:bg-white/[0.06]"
              }`}
            >
              {tier.cta}
            </motion.button>
          </Link>

          {/* Features */}
          <div className="space-y-3">
            {tier.features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.1 + i * 0.05 }}
                viewport={{ once: true }}
                className="flex items-start gap-3"
              >
                {feature.included ? (
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-purple-400" />
                ) : (
                  <X className="mt-0.5 h-5 w-5 shrink-0 text-white/20" />
                )}
                <span className={feature.included ? "text-sm text-white/80" : "text-sm text-white/30 line-through"}>
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FAQItem({ question, answer, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-transparent p-6 text-left backdrop-blur-2xl transition-all hover:border-white/[0.15]"
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="pr-8 font-semibold text-white">{question}</h3>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="shrink-0"
          >
            <svg className="h-5 w-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="mt-4 text-sm leading-relaxed text-white/60">{answer}</p>
        </motion.div>
      </button>
    </motion.div>
  );
}

export default function Pricing() {
  const tiers = [
    {
      name: "Free",
      description: "Perfect for getting started",
      price: 0,
      icon: "🎯",
      gradient: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
      cta: "Start Free",
      ctaLink: "/register",
      features: [
        { text: "1 Trading Bot", included: true },
        { text: "RSI Indicator Only", included: true },
        { text: "10 Alerts per Day", included: true },
        { text: "Top 10 Trading Pairs", included: true },
        { text: "Email Support", included: true },
        { text: "Basic Analytics", included: true },
        { text: "Advanced Indicators", included: false },
        { text: "Backtesting", included: false },
        { text: "Unlimited Alerts", included: false },
      ],
    },
    {
      name: "Starter",
      description: "For serious traders",
      price: 19,
      icon: "⚡",
      gradient: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
      cta: "Start Free Trial",
      ctaLink: "/register?plan=starter",
      features: [
        { text: "3 Trading Bots", included: true },
        { text: "5 Indicators (RSI, MACD, BB, EMA, Volume)", included: true },
        { text: "Unlimited Alerts", included: true },
        { text: "All Trading Pairs", included: true },
        { text: "Priority Email Support", included: true },
        { text: "Basic Backtesting", included: true },
        { text: "Performance Analytics", included: true },
        { text: "Multi-indicator Logic", included: false },
        { text: "Webhook Integration", included: false },
      ],
    },
    {
      name: "Pro",
      description: "Maximum performance & features",
      price: 49,
      icon: "👑",
      gradient: "bg-gradient-to-br from-yellow-500/20 to-orange-500/20",
      cta: "Start Free Trial",
      ctaLink: "/register?plan=pro",
      features: [
        { text: "10 Trading Bots", included: true },
        { text: "All Indicators + Custom Logic", included: true },
        { text: "Unlimited Alerts", included: true },
        { text: "All Trading Pairs", included: true },
        { text: "Priority Support + Discord", included: true },
        { text: "Advanced Backtesting", included: true },
        { text: "Full Performance Analytics", included: true },
        { text: "Multi-indicator Logic Builder", included: true },
        { text: "Webhook Integration", included: true },
      ],
    },
  ];

  const faqs = [
    {
      question: "Can I cancel anytime?",
      answer: "Yes! You can cancel your subscription at any time from your account settings. You'll retain access until the end of your billing period.",
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! Starter and Pro plans come with a 7-day free trial. No credit card required to start the Free plan.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express) processed securely through Stripe.",
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Absolutely! You can change your plan at any time. Upgrades take effect immediately, downgrades at the end of your billing cycle.",
    },
    {
      question: "How does backtesting work?",
      answer: "Our backtesting engine simulates your strategy against historical market data, showing you how it would have performed with metrics like win rate, profit/loss, and drawdown.",
    },
    {
      question: "What exchanges do you support?",
      answer: "We currently support Binance, Coinbase Pro, Kraken, and Bybit. More exchanges are being added regularly.",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black" />
      
      {/* Floating orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[10%] top-[10%] h-[500px] w-[500px] rounded-full bg-purple-500/15 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[10%] top-[5%] h-[400px] w-[400px] rounded-full bg-pink-500/15 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] left-[50%] h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[120px]"
        />
      </div>

      {/* Grain texture */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.015]">
        <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">


        {/* HERO */}
        <section className="py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-white/70">Simple, transparent pricing</span>
            </div>
            
            <h1 className="mx-auto max-w-4xl bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-6xl font-semibold leading-[1.1] tracking-tight text-transparent sm:text-7xl lg:text-8xl">
              Choose your plan
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-xl text-white/60">
              Start free, scale as you grow. All plans include 7-day free trial.
            </p>
          </motion.div>
        </section>

        {/* PRICING CARDS */}
        <section className="pb-24">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {tiers.map((tier, i) => (
              <PricingCard
                key={tier.name}
                tier={tier}
                isPopular={tier.name === "Starter"}
                delay={i * 0.1}
              />
            ))}
          </div>

          {/* Enterprise CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <div className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-transparent p-12 backdrop-blur-2xl">
              <div className="relative z-10 text-center">
                <Crown className="mx-auto mb-4 h-12 w-12 text-yellow-500/80" />
                <h3 className="mb-2 text-3xl font-semibold">Enterprise</h3>
                <p className="mx-auto mb-6 max-w-2xl text-white/60">
                  Custom solutions for institutions. Unlimited bots, dedicated support, white-label options, and more.
                </p>
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-3 font-semibold transition-all hover:border-white/20 hover:bg-white/[0.06]"
                  >
                    Contact Sales
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="pb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="bg-gradient-to-br from-white to-white/60 bg-clip-text text-5xl font-semibold leading-tight text-transparent">
              Compare features
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/60">
              See what's included in each plan
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-[32px] border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-2xl"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="p-6 text-left text-sm font-semibold text-white/80">Feature</th>
                    <th className="p-6 text-center text-sm font-semibold text-white/80">Free</th>
                    <th className="p-6 text-center text-sm font-semibold text-white/80">Starter</th>
                    <th className="p-6 text-center text-sm font-semibold text-white/80">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Trading Bots", free: "1", starter: "3", pro: "10" },
                    { feature: "Indicators", free: "RSI", starter: "5 Total", pro: "All + Custom" },
                    { feature: "Daily Alerts", free: "10", starter: "Unlimited", pro: "Unlimited" },
                    { feature: "Backtesting", free: false, starter: "Basic", pro: "Advanced" },
                    { feature: "Analytics", free: "Basic", starter: "Advanced", pro: "Full Suite" },
                    { feature: "Webhook Integration", free: false, starter: false, pro: true },
                    { feature: "Support", free: "Email", starter: "Priority", pro: "Priority + Discord" },
                  ].map((row, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      viewport={{ once: true }}
                      className="border-b border-white/[0.05] last:border-0"
                    >
                      <td className="p-6 text-sm text-white/80">{row.feature}</td>
                      <td className="p-6 text-center text-sm text-white/60">
                        {typeof row.free === "boolean" ? (
                          row.free ? <Check className="mx-auto h-5 w-5 text-purple-400" /> : <X className="mx-auto h-5 w-5 text-white/20" />
                        ) : (
                          row.free
                        )}
                      </td>
                      <td className="p-6 text-center text-sm text-white/60">
                        {typeof row.starter === "boolean" ? (
                          row.starter ? <Check className="mx-auto h-5 w-5 text-purple-400" /> : <X className="mx-auto h-5 w-5 text-white/20" />
                        ) : (
                          row.starter
                        )}
                      </td>
                      <td className="p-6 text-center text-sm text-white/60">
                        {typeof row.pro === "boolean" ? (
                          row.pro ? <Check className="mx-auto h-5 w-5 text-purple-400" /> : <X className="mx-auto h-5 w-5 text-white/20" />
                        ) : (
                          row.pro
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>

        {/* FAQ */}
        <section className="pb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="bg-gradient-to-br from-white to-white/60 bg-clip-text text-5xl font-semibold leading-tight text-transparent">
              Questions? We've got answers.
            </h2>
          </motion.div>

          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="pb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-transparent p-16 text-center backdrop-blur-2xl"
          >
            <h2 className="mb-4 bg-gradient-to-br from-white to-white/60 bg-clip-text text-4xl font-semibold text-transparent sm:text-5xl">
              Ready to start trading smarter?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-white/60">
              Join thousands of traders using Cryphos. Start your free trial today.
            </p>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-10 py-4 text-lg font-semibold text-black shadow-[0_20px_60px_-15px_rgba(255,255,255,0.3)] transition-all hover:shadow-[0_20px_80px_-15px_rgba(255,255,255,0.4)]"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </Link>
            <p className="mt-6 text-sm text-white/40">No credit card required</p>
          </motion.div>
        </section>
      </div>
    </div>
  );
}