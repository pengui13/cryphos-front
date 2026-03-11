"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Code2, TrendingUp,
  Megaphone, Zap, Globe, Clock, Users, Heart, ChevronDown, X, Send
} from "lucide-react";

// ─── Role-specific application questions ──────────────────────────────────────

const ROLE_QUESTIONS = {
  backend: [
    { id: "stack", label: "What's your primary Python/Django stack?", placeholder: "e.g. Django 4.2, DRF, Celery, Redis, PostgreSQL, Docker..." },
    { id: "scale", label: "Describe the largest system you've built or maintained.", placeholder: "Traffic, data volume, team size, architecture decisions..." },
    { id: "async", label: "How do you handle async task failures and retries in production?", placeholder: "Your approach to dead-letter queues, monitoring, alerting..." },
    { id: "crypto", label: "Any experience with crypto exchange APIs or WebSocket market feeds?", placeholder: "Exchanges, what you built, any pain points you solved..." },
    { id: "rust", label: "Where are you with Rust? (Optional — honest answer only)", placeholder: "Never touched it / learning / wrote production code / shipped it..." },
  ],
  rust: [
    { id: "projects", label: "What's the most performance-critical Rust system you've built?", placeholder: "Context, constraints, what you optimized for..." },
    { id: "latency", label: "Walk us through how you'd profile a latency spike in a Tokio service.", placeholder: "Tools, methodology, what you look for first..." },
    { id: "financial", label: "Have you worked with financial data structures — orderbooks, OHLCV, tick data?", placeholder: "Context and what you built..." },
    { id: "solana", label: "Any Solana, EVM, or MEV experience? (Optional)", placeholder: "Protocols, programs, MEV strategies you've worked on..." },
    { id: "why", label: "Why Rust over C++ for low-latency financial systems?", placeholder: "Your honest take — tradeoffs, where it wins, where it doesn't..." },
  ],
  marketing: [
    { id: "audience", label: "Describe a campaign or piece of content that worked exceptionally well for a technical/crypto audience.", placeholder: "What was it, why did it work, what did you learn..." },
    { id: "community", label: "How would you build a Cryphos community from scratch in 90 days?", placeholder: "Channels, tactics, early metrics you'd track..." },
    { id: "persona", label: "How would you describe the ideal Cryphos user in 3 sentences?", placeholder: "Be specific — their goals, fears, how they discover tools..." },
    { id: "data", label: "What growth metrics do you obsess over, and which ones do you think are vanity?", placeholder: "Your framework for what actually matters..." },
    { id: "portfolio", label: "Link to your best work — content, campaigns, community you've grown.", placeholder: "Twitter/X, blog, Substack, Discord, anything you're proud of..." },
  ],
  quant: [
    { id: "research", label: "Describe a trading strategy you've researched and backtested.", placeholder: "Logic, data sources, how you validated it, results..." },
    { id: "lookahead", label: "What's the most common lookahead bias mistake you've seen in backtests?", placeholder: "How does it happen, how do you catch it..." },
    { id: "regime", label: "How would you detect volatility regime changes in real-time?", placeholder: "Models you'd use, data inputs, implementation approach..." },
    { id: "indicators", label: "Which indicator do most retail traders misuse, and why?", placeholder: "Your opinionated take — show us you know the edge cases..." },
    { id: "live", label: "Have you ever taken a model from research to live trading? What happened?", placeholder: "Success, failure, what you'd do differently..." },
  ],
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const ROLES = [
  {
    id: "backend",
    title: "Backend Engineer",
    tag: "Engineering",
    tagColor: "#7c3aed",
    tagBg: "rgba(124,58,237,0.12)",
    tagBorder: "rgba(124,58,237,0.25)",
    location: "Remote · Europe preferred",
    type: "Full-time",
    icon: Code2,
    summary: "Own the infrastructure that powers thousands of live trading bots.",
    description: `We're building the engine room of Cryphos — the systems that execute trades, manage WebSocket feeds from 10+ exchanges, process signals in real-time, and keep everything running without downtime. You'll work on our Django/DRF core, Celery task queues, Redis pub-sub pipelines, and PostgreSQL schemas that handle millions of rows of market data.\n\nThis isn't a ticket-factory job. You'll make architectural decisions that matter, ship fast, and have direct impact on the product from day one.`,
    requirements: [
      "3+ years with Python and Django in production",
      "Strong PostgreSQL — ORM, raw SQL, indexing, migrations",
      "Redis: caching, pub/sub, pipelines",
      "Celery or equivalent async task queues",
      "Docker, basic CI/CD, comfortable with Linux",
    ],
    nice: ["Crypto exchange APIs or WebSocket feeds", "Rust (we're moving parts of the stack)", "DeFi or CEX integration experience"],
    perks: ["Equity from day one", "Async-first culture", "Real financial infrastructure"],
  },
  {
    id: "rust",
    title: "Rust Engineer",
    tag: "Engineering",
    tagColor: "#0891b2",
    tagBg: "rgba(8,145,178,0.12)",
    tagBorder: "rgba(8,145,178,0.25)",
    location: "Remote · Anywhere",
    type: "Full-time",
    icon: Zap,
    summary: "Build the low-latency core. Microseconds matter here.",
    description: `We're migrating performance-critical parts of Cryphos to Rust — signal execution paths, order routing, real-time orderbook processing, and market data normalization. This is work where you spend a day shaving 200μs off a hot path and it actually matters.\n\nYou'll work closely with our HFT engineers to define architecture and implement components that replace Python bottlenecks. No bureaucracy. Just you, the compiler, and a performance target.`,
    requirements: [
      "Strong Rust — ownership, lifetimes, async/await (Tokio)",
      "Low-latency systems mindset",
      "Network programming: TCP, WebSockets",
      "Financial data structures: orderbooks, OHLCV",
      "Ability to profile and benchmark systematically",
    ],
    nice: ["MEV / arbitrage background", "Solana/Anchor experience", "FPGA or kernel bypass networking"],
    perks: ["Greenfield Rust work", "Direct HFT collaboration", "Equity + performance bonus"],
  },
  {
    id: "marketing",
    title: "Growth & Marketing Lead",
    tag: "Growth",
    tagColor: "#059669",
    tagBg: "rgba(5,150,105,0.12)",
    tagBorder: "rgba(5,150,105,0.25)",
    location: "Remote · Anywhere",
    type: "Full-time",
    icon: Megaphone,
    summary: "Make traders find us before they find our competitors.",
    description: `Cryphos is a technically excellent product with a lean marketing presence. That's your opportunity. We need someone who understands the crypto-native audience — traders who are skeptical of hype, respect data, and share things that help them make money.\n\nYou'll own everything from content strategy and community building to paid acquisition and partnerships. Work directly with founders, move fast, real budget authority.`,
    requirements: [
      "3+ years in growth, content, or marketing in crypto or fintech",
      "Deep understanding of the crypto trader persona",
      "Strong written voice — no corporate fluff",
      "Community building: Twitter/X, Discord, Telegram",
      "Data-driven: you track what works and cut what doesn't",
    ],
    nice: ["Existing audience or network in crypto", "SEO for fintech", "Video/short-form content"],
    perks: ["Own the entire marketing function", "Real budget authority", "Equity + revenue share"],
  },
  {
    id: "quant",
    title: "Quantitative Researcher",
    tag: "Research",
    tagColor: "#be185d",
    tagBg: "rgba(190,24,93,0.12)",
    tagBorder: "rgba(190,24,93,0.25)",
    location: "Remote · Europe preferred",
    type: "Full-time",
    icon: TrendingUp,
    summary: "Design the signals. Build the edge. Make bots actually profitable.",
    description: `We build the infrastructure — but the alpha comes from research. You'll design and backtest trading strategies, develop new technical indicators, build regime detection models, and translate academic research into production signals that users deploy.\n\nAccess to full tick data across 50+ assets, a solid backtesting framework, and a team that understands what you're building. You'll ship models that go live.`,
    requirements: [
      "Strong statistics and time-series analysis",
      "Python: pandas, numpy, statsmodels, scipy",
      "Rigorous backtesting (no lookahead bias)",
      "Technical indicators and market microstructure",
      "Communicate findings clearly to engineers",
    ],
    nice: ["GARCH/HMM/ML for regime detection", "Options pricing or derivatives", "Crypto-specific: funding rates, liquidations"],
    perks: ["Full market data access", "Direct path to live deployment", "Equity + performance bonus"],
  },
];

const QUIZ = [
  { q: "It's 2am. A major exchange just changed their WebSocket API. Your bot is down.", yes: "Fix deployed before morning standup", no: "Wait for someone to file a ticket" },
  { q: "Someone sends a meme about a new trading strategy.", yes: "Backtest it by end of day", no: "React with 😂 and keep scrolling" },
  { q: "The codebase has no tests for the critical path.", yes: "Write them before any new feature", no: "Ship fast, fix bugs in prod" },
  { q: "You see a 50ms latency spike in signal execution.", yes: "Drop everything. Profile immediately.", no: "Log it for next sprint" },
  { q: "A user says their bot missed a signal.", yes: "Reproduce it, root cause, post-mortem", no: "Markets are unpredictable 🤷" },
];

// ─── Application Form Modal ────────────────────────────────────────────────────

function ApplicationForm({ role, onClose }) {
  const questions = ROLE_QUESTIONS[role.id] || [];
  const [form, setForm] = useState({
    name: "", email: "", github: "", salary: "", currency: "USD",
    years: "", ...Object.fromEntries(questions.map((q) => [q.id, ""])),
  });
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(0); // 0=basics, 1=roleqs

  const updateField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => setSubmitted(true);

  const inputCls = "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all resize-none";
  const labelCls = "block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col rounded-t-2xl sm:rounded-2xl border border-white/[0.08] bg-[#0d0d0d] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{ background: role.tagBg, border: `1px solid ${role.tagBorder}` }}>
              <role.icon className="h-4 w-4" style={{ color: role.tagColor }} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{role.title}</div>
              <div className="text-[11px] text-white/35">{role.location}</div>
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-white/40 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress tabs */}
        {!submitted && (
          <div className="flex border-b border-white/[0.06] shrink-0">
            {["Your details", "Role questions"].map((label, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className="relative flex-1 py-3 text-xs font-medium transition-colors"
                style={{ color: step === i ? "white" : "rgba(255,255,255,0.3)" }}
              >
                {label}
                {step === i && (
                  <motion.div layoutId="tab-line" className="absolute bottom-0 left-0 right-0 h-[2px]"
                    style={{ background: role.tagColor }} />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">
          <AnimatePresence mode="wait" initial={false}>

            {/* Submitted */}
            {submitted && (
              <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-16 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                  className="h-16 w-16 rounded-full flex items-center justify-center mb-5"
                  style={{ background: role.tagColor + "22", border: `1px solid ${role.tagColor}44` }}
                >
                  <CheckCircle2 className="h-8 w-8" style={{ color: role.tagColor }} />
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-2">Application sent.</h3>
                <p className="text-sm text-white/45 max-w-xs leading-relaxed mb-6">
                  We read every application personally. If there's a fit, you'll hear from us within a week.
                </p>
                <button onClick={onClose} className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-2.5 text-sm text-white/50 hover:border-white/20 hover:text-white/70 transition-all">
                  Close
                </button>
              </motion.div>
            )}

            {/* Step 0 — basics */}
            {!submitted && step === 0 && (
              <motion.div key="basics" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.22 }}>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Full name *</label>
                      <input className={inputCls} placeholder="Alex Kovač" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Email *</label>
                      <input className={inputCls} type="email" placeholder="you@example.com" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>GitHub / LinkedIn / Portfolio</label>
                    <input className={inputCls} placeholder="github.com/you or linkedin.com/in/you" value={form.github} onChange={(e) => updateField("github", e.target.value)} />
                  </div>

                  <div>
                    <label className={labelCls}>Years of relevant experience *</label>
                    <select
                      className={inputCls + " cursor-pointer"}
                      value={form.years}
                      onChange={(e) => updateField("years", e.target.value)}
                      style={{ appearance: "none" }}
                    >
                      <option value="" disabled className="bg-[#111]">Select...</option>
                      {["< 1 year", "1–2 years", "2–4 years", "4–7 years", "7+ years"].map((o) => (
                        <option key={o} value={o} className="bg-[#111]">{o}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelCls}>Expected salary</label>
                    <div className="flex gap-3">
                      <select
                        className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-3 text-sm text-white outline-none focus:border-white/20 transition-all cursor-pointer w-24 shrink-0"
                        value={form.currency}
                        onChange={(e) => updateField("currency", e.target.value)}
                        style={{ appearance: "none" }}
                      >
                        {["USD", "EUR", "GBP", "CHF"].map((c) => (
                          <option key={c} value={c} className="bg-[#111]">{c}</option>
                        ))}
                      </select>
                      <input
                        className={inputCls}
                        placeholder="e.g. 90,000 / year or 6,000 / month"
                        value={form.salary}
                        onChange={(e) => updateField("salary", e.target.value)}
                      />
                    </div>
                    <p className="text-[11px] text-white/25 mt-1.5">Be honest. We don't penalize ambition.</p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setStep(1)}
                      disabled={!form.name || !form.email || !form.years}
                      className="flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-semibold text-black transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{ background: "white" }}
                    >
                      Continue to role questions
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 1 — role questions */}
            {!submitted && step === 1 && (
              <motion.div key="roleqs" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
                <div className="space-y-5">
                  <p className="text-xs text-white/35 leading-relaxed pb-1">
                    These are the questions we actually care about. Take your time — quality over speed.
                  </p>

                  {questions.map((q, idx) => (
                    <div key={q.id}>
                      <label className={labelCls}>
                        <span className="text-white/20 mr-1.5 font-mono">{String(idx + 1).padStart(2, "0")}</span>
                        {q.label}
                      </label>
                      <textarea
                        className={inputCls + " min-h-[90px]"}
                        placeholder={q.placeholder}
                        value={form[q.id]}
                        onChange={(e) => updateField(q.id, e.target.value)}
                        rows={3}
                      />
                    </div>
                  ))}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => setStep(0)}
                      className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/40 hover:text-white/60 hover:border-white/20 transition-all"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-semibold text-black transition-all hover:opacity-90"
                      style={{ background: "white" }}
                    >
                      <Send className="h-3.5 w-3.5" />
                      Submit application
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

function FitQuiz() {
  const [step, setStep] = useState(0);
  const [yesCount, setYesCount] = useState(0);
  const answer = (isYes) => { if (isYes) setYesCount((c) => c + 1); setStep((s) => s + 1); };
  const restart = () => { setStep(0); setYesCount(0); };
  const score = yesCount;
  const result = score >= 4
    ? { label: "You're one of us.", sub: "Seriously — stop reading and apply.", color: "#34d399", emoji: "🔥" }
    : score >= 2
    ? { label: "Maybe. Let's find out.", sub: "There's something here. We figure it out together.", color: "#fbbf24", emoji: "🤔" }
    : { label: "Probably not. Apply anyway.", sub: "We've been wrong before. Tell us why.", color: "#f87171", emoji: "💀" };
  const variants = { enter: { opacity: 0, y: 16 }, center: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -16 } };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
      {step >= 1 && step <= 5 && (
        <div className="h-[2px] bg-white/[0.04]">
          <motion.div className="h-full" style={{ background: "linear-gradient(90deg,#7c3aed,#a855f7)" }}
            animate={{ width: `${(step / 5) * 100}%` }} transition={{ duration: 0.4, ease: "easeOut" }} />
        </div>
      )}
      <div className="p-8 sm:p-10 min-h-[240px] flex flex-col justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {step === 0 && (
            <motion.div key="intro" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="text-6xl select-none">🎲</div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-2xl font-semibold text-white mb-2">Is this your team?</h3>
                  <p className="text-sm text-white/45 leading-relaxed mb-6 max-w-md">5 quick scenarios. Answer honestly.</p>
                  <button onClick={() => setStep(1)} className="rounded-xl bg-white px-8 py-3 text-sm font-semibold text-black hover:bg-white/90 transition-all">
                    Let's find out →
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          {step >= 1 && step <= 5 && (
            <motion.div key={`q${step}`} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
              <div className="text-[10px] text-white/20 uppercase tracking-[0.2em] mb-4 font-medium">Scenario {step} / 5</div>
              <p className="text-lg sm:text-xl font-medium text-white leading-relaxed mb-8 max-w-lg">{QUIZ[step - 1].q}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button onClick={() => answer(true)} className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] p-4 text-left hover:bg-emerald-500/[0.14] transition-all">
                  <div className="text-[9px] text-emerald-500/50 uppercase tracking-widest mb-2 font-bold">Yes →</div>
                  <div className="text-sm text-emerald-400 leading-relaxed">{QUIZ[step - 1].yes}</div>
                </button>
                <button onClick={() => answer(false)} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left hover:bg-white/[0.05] transition-all">
                  <div className="text-[9px] text-white/20 uppercase tracking-widest mb-2 font-bold">No →</div>
                  <div className="text-sm text-white/35 leading-relaxed">{QUIZ[step - 1].no}</div>
                </button>
              </div>
            </motion.div>
          )}
          {step === 6 && (
            <motion.div key="result" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="relative shrink-0 h-24 w-24">
                  <svg viewBox="0 0 96 96" className="rotate-[-90deg] h-24 w-24">
                    <circle cx="48" cy="48" r="38" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
                    <motion.circle cx="48" cy="48" r="38" fill="none" stroke={result.color} strokeWidth="7" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 38}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 38 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 38 * (1 - score / 5) }}
                      transition={{ duration: 1.2, ease: "easeOut" }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold leading-none" style={{ color: result.color }}>{score}/5</span>
                    <span className="text-base mt-0.5">{result.emoji}</span>
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">{result.label}</h3>
                  <p className="text-sm text-white/45 leading-relaxed mb-6 max-w-sm">{result.sub}</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={restart} className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/[0.03] px-6 py-2.5 text-sm text-white/40 hover:text-white/60 hover:border-white/20 transition-all">
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Role card ────────────────────────────────────────────────────────────────

function RoleCard({ role, i }) {
  const [open, setOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const Icon = role.icon;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, margin: "-20px" }}
        className="rounded-2xl border border-white/[0.08] bg-white/[0.025] overflow-hidden transition-colors duration-300 hover:border-white/[0.12]"
      >
        <button onClick={() => setOpen((o) => !o)} className="w-full text-left">
          <div className="flex items-center gap-5 p-5 sm:p-6">
            <div className="shrink-0 h-12 w-12 rounded-xl flex items-center justify-center"
              style={{ background: role.tagBg, border: `1px solid ${role.tagBorder}` }}>
              <Icon className="h-5 w-5" style={{ color: role.tagColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className="text-base font-semibold text-white">{role.title}</span>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide"
                  style={{ background: role.tagBg, color: role.tagColor, border: `1px solid ${role.tagBorder}` }}>
                  {role.tag}
                </span>
              </div>
              <div className="text-xs text-white/30 mb-1.5">{role.location} · {role.type}</div>
              <p className="text-sm text-white/45 line-clamp-1">{role.summary}</p>
            </div>
            <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="shrink-0 text-white/25">
              <ChevronDown className="h-5 w-5" />
            </motion.div>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="border-t border-white/[0.05]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.05]">
                  {/* Left */}
                  <div className="p-5 sm:p-7 space-y-6">
                    <div>
                      {role.description.split("\n\n").map((para, i) => (
                        <p key={i} className="text-sm text-white/50 leading-relaxed mb-3 last:mb-0">{para}</p>
                      ))}
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">What we need</div>
                      <ul className="space-y-2.5">
                        {role.requirements.map((r, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm text-white/55">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: role.tagColor + "99" }} />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="p-5 sm:p-7 flex flex-col gap-6">
                    <div>
                      <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-3">Nice to have</div>
                      <ul className="space-y-2">
                        {role.nice.map((r, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm text-white/35">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/20" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-3">Perks</div>
                      <div className="flex flex-wrap gap-2">
                        {role.perks.map((p) => (
                          <span key={p} className="rounded-lg px-3 py-1.5 text-xs text-white/40 border border-white/[0.07] bg-white/[0.03]">{p}</span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-auto pt-2">
                      <button
                        onClick={() => setApplying(true)}
                        className="flex items-center justify-center gap-2 w-full rounded-xl py-3.5 text-sm font-semibold text-black transition-all hover:opacity-90 active:scale-[0.98]"
                        style={{ background: "white" }}
                      >
                        Apply for this role
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Application modal */}
      <AnimatePresence>
        {applying && <ApplicationForm role={role} onClose={() => setApplying(false)} />}
      </AnimatePresence>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "7", label: "team members" },
  { value: "4", label: "open roles" },
  { value: "100%", label: "remote" },
  { value: "∞", label: "upside" },
];

const CULTURE = [
  { icon: Globe, text: "Fully remote" },
  { icon: Clock, text: "Async-first" },
  { icon: Users, text: "Team of 7" },
  { icon: Heart, text: "Equity for everyone" },
];

export default function CareersPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#080808] text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_100%_60%_at_50%_-5%,rgba(80,40,160,0.22),transparent)]" />
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -left-20 top-0 h-[600px] w-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 65%)", filter: "blur(100px)" }} />
        <div className="absolute right-0 top-40 h-[500px] w-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(8,145,178,0.08) 0%, transparent 65%)", filter: "blur(100px)" }} />
        <div className="absolute left-1/3 bottom-0 h-[400px] w-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(190,24,93,0.07) 0%, transparent 65%)", filter: "blur(100px)" }} />
      </div>


      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">

        {/* Hero */}
        <div className="pt-20 sm:pt-28 pb-16 sm:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-end">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/[0.07] px-3.5 py-1.5 text-xs text-violet-300/70 mb-7">
                <Zap className="h-3 w-3" />
                We're building something real
              </div>
              <h1 className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-6xl sm:text-7xl lg:text-8xl font-semibold leading-[1.0] tracking-tight text-transparent mb-6">
                Come build<br />the edge.
              </h1>
              <p className="text-base sm:text-lg text-white/45 leading-relaxed max-w-lg mb-8">
                A small team obsessed with performance, correctness, and making something traders actually want. No politics. No sprints. Just good work.
              </p>
              <div className="flex flex-wrap gap-2">
                {CULTURE.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] px-3.5 py-1.5 text-xs text-white/40">
                    <Icon className="h-3 w-3" />{text}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }} className="grid grid-cols-2 gap-3">
              {STATS.map(({ value, label }, i) => (
                <motion.div key={label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8">
                  <div className="text-4xl sm:text-5xl font-semibold text-white mb-1.5 tracking-tight">{value}</div>
                  <div className="text-xs text-white/35 uppercase tracking-widest font-medium">{label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-16 sm:mb-24" />

        {/* Quiz */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} viewport={{ once: true }} className="mb-16 sm:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16 items-start">
            <div className="lg:sticky lg:top-8">
              <div className="text-[10px] text-white/25 uppercase tracking-[0.2em] font-medium mb-3">Before you apply</div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white leading-tight mb-4">Quick<br />vibe check.</h2>
              <p className="text-sm text-white/40 leading-relaxed">5 scenarios. No wrong answers.<br />(Well, a few wrong answers.)</p>
            </div>
            <div className="lg:col-span-2"><FitQuiz /></div>
          </div>
        </motion.div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-16 sm:mb-24" />

        {/* Roles */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="mb-16 sm:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16 items-start">
            <div className="lg:sticky lg:top-8">
              <div className="text-[10px] text-white/25 uppercase tracking-[0.2em] font-medium mb-3">Now hiring</div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white leading-tight mb-4">Open<br />roles.</h2>
              <p className="text-sm text-white/40 leading-relaxed">Expand any role to read the full description and apply.</p>
            </div>
            <div className="lg:col-span-2 space-y-3">
              {ROLES.map((role, i) => <RoleCard key={role.id} role={role} i={i} />)}
            </div>
          </div>
        </motion.div>

        {/* Wildcard */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="mb-24 sm:mb-32">
          <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.025] p-8 sm:p-12 overflow-hidden">
            <div className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{ background: "radial-gradient(ellipse at 0% 100%, rgba(124,58,237,0.08) 0%, transparent 60%)" }} />
            <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-3">Don't see<br />your role?</h3>
                <p className="text-sm text-white/45 leading-relaxed max-w-sm">
                  If you're exceptionally good at something we need — reach out. We've hired people before there was a job posting.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:items-end">
                <a href="mailto:careers@cryphos.io?subject=Wildcard application" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-black hover:bg-white/90 transition-all">
                    Send us a message <ArrowRight className="h-4 w-4" />
                  </button>
                </a>
                <p className="text-xs text-white/25 text-center sm:text-right">We read every email.</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}