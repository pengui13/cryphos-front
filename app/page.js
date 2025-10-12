"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

function TypingEffect({ text, speed = 90 }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let idx = 0;
    const id = setInterval(() => {
      idx += 1;
      setDisplayed(text.slice(0, idx));
      if (idx >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return (
    <span className="inline-flex items-center">
      <span>{displayed}</span>
      <span className="ml-1 h-[1.1em] w-[2px] bg-[#e3b8ff] caret-blink" aria-hidden />
    </span>
  );
}

export default function Home() {
  const message = "Trade with clarity";

  const stats = [
    { value: "Signals", label: "Actionable entries & exits" },
    { value: "Telegram", label: "Instant delivery" },
    { value: "24/7", label: "Always monitoring" },
  ];

  const steps = [
    {
      title: "Select assets",
      features: ["Pick the markets you care about", "Flexible lists", "Easy edits anytime"],
    },
    {
      title: "Choose a strategy",
      features: ["Multiple indicators & presets", "Multi-timeframe logic", "Fine-tune risk controls"],
    },
    {
      title: "Get signals",
      features: ["Real-time alerts in Telegram", "Clear reasoning & context", "Ready-to-act messages"],
    },
  ];

  const valueProps = [
    { title: "Multiple indicators", description: "Blend momentum, trend, and volatility tools—no code required.", icon: "🧩" },
    { title: "Smart presets", description: "Aggressive, Balanced, and Defensive modes to match your pace.", icon: "⚡" },
    { title: "Multi-timeframe", description: "Confirm signals across intervals for higher confidence.", icon: "⏱️" },
    { title: "Human-readable alerts", description: "Plain-English notifications with key levels and context.", icon: "💬" },
  ];

  const whatYouGet = [
    { title: "Clear entries & exits", copy: "Signals with levels, not vague opinions." },
    { title: "Noise reduction", copy: "Filters and confirmations to avoid whipsaws." },
    { title: "Simple control", copy: "Toggle strategies, change thresholds, edit assets." },
  ];

  return (
    <div className="min-h-screen bg-[#0f1115] text-zinc-100">
      <div className="mx-auto w-full max-w-6xl px-6">
        {/* Hero */}
        <section className="flex flex-col items-center text-center py-20">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight">
            <TypingEffect text={message} />
          </h1>
          <p className="mt-4 text-lg lg:text-xl text-white/70">Automated market signals delivered to your Telegram</p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {stats.map((s, i) => (
              <div key={i} className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
                <span className="font-semibold text-[#e3b8ff]">{s.value}</span>{" "}
                <span className="text-white/60">· {s.label}</span>
              </div>
            ))}
          </div>

          <Link href="/lab" className="mt-10 inline-flex">
            <button className="rounded-xl bg-[#e3b8ff] px-8 py-3 text-black font-semibold transition-[transform,box-shadow,background] hover:-translate-y-0.5 hover:bg-[#d7a8ff] focus:outline-none focus-visible:ring focus-visible:ring-[#e3b8ff]/50 active:translate-y-0">
              Create Your Bot
            </button>
          </Link>
        </section>

        {/* How it works */}
        <section className="py-14">
          <header className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold">How it works</h2>
            <p className="mt-2 text-white/60">Go live in minutes—no spreadsheets, no code</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <article key={i} className="rounded-xl border border-white/10 bg-white/5 p-6 transition-transform hover:-translate-y-0.5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="grid h-8 w-8 place-items-center rounded-md border border-[#e3b8ff]/40 text-[13px] font-bold text-[#e3b8ff]">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                </div>
                <ul className="text-sm text-white/60 space-y-1.5">
                  {step.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1 h-1 w-1 rounded-full bg-white/40" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Why Cryphos */}
        <section className="py-14">
          <header className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold">Why traders choose Cryphos</h2>
            <p className="mt-2 text-white/60">Designed for clarity, built for speed</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {valueProps.map((f, i) => (
              <article key={i} className="rounded-xl border border-white/10 bg-white/5 p-5 transition-transform hover:-translate-y-0.5">
                <div className="text-2xl mb-2">{f.icon}</div>
                <h3 className="text-base font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-white/60">{f.description}</p>
              </article>
            ))}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-bold mb-4 text-center">What you get</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {whatYouGet.map(({ title, copy }, i) => (
                <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
                  <div className="font-semibold mb-1">{title}</div>
                  <div className="text-sm text-white/60">{copy}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold">Turn signals into decisions</h2>
          <p className="mt-2 text-white/60">Build a strategy that fits you—then let Cryphos handle the monitoring.</p>

          <div className="mt-8 flex justify-center gap-4">
            {stats.map((s, i) => (
              <div key={i} className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm">
                <span className="font-semibold text-[#e3b8ff]">{s.value}</span>{" "}
                <span className="text-white/60">· {s.label}</span>
              </div>
            ))}
          </div>

          <Link href="/lab" className="mt-8 inline-flex">
            <button className="rounded-xl bg-[#e3b8ff] px-7 py-3 text-black font-semibold transition-[transform,background] hover:-translate-y-0.5 hover:bg-[#d7a8ff] focus:outline-none focus-visible:ring focus-visible:ring-[#e3b8ff]/50 active:translate-y-0">
              Get Started Free
            </button>
          </Link>
        </section>
      </div>

      <style jsx>{`
        .caret-blink { animation: caret 1s steps(2, start) infinite; }
        @keyframes caret { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .caret-blink { animation: none; } }
      `}</style>
    </div>
  );
}
