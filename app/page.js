"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

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
      {/* background spotlight + subtle vignette */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-30%] h-[1200px] w-[1200px] -translate-x-1/2 rounded-full bg-[#6a2e8e]/20 blur-3xl" />
        <div className="absolute right-[-20%] top-[10%] h-[800px] w-[800px] rounded-full bg-[#e3b8ff]/10 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6">
        {/* HERO */}
        <section className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 pt-16 lg:pt-24 pb-10 lg:pb-20">
          {/* LEFT: headline */}
          <div className="lg:col-span-6">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
              <TypingEffect text={message} />
            </h1>
            <p className="mt-5 max-w-xl text-lg sm:text-xl text-white/70">
              Automated market signals delivered to your Telegram—crafted to cut noise and highlight only what matters.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur"
                >
                  <span className="font-semibold text-[#e3b8ff]">{s.value}</span>
                  <span className="text-white/60"> · {s.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/lab" className="inline-flex">
                <button className="rounded-2xl bg-[#e3b8ff] px-7 py-3 text-black font-semibold shadow-[0_18px_40px_-18px_rgba(227,184,255,0.65)] transition-[transform,background,box-shadow] hover:-translate-y-0.5 hover:bg-[#d7a8ff] focus:outline-none focus-visible:ring focus-visible:ring-[#e3b8ff]/50 active:translate-y-0">
                  Get Started Free
                </button>
              </Link>
              <Link href="/learn" className="inline-flex">
                <button className="rounded-2xl border border-white/15 bg-white/5 px-7 py-3 font-semibold text-white/90 backdrop-blur transition hover:bg-white/10">
                  Learn More
                </button>
              </Link>
            </div>
          </div>

          {/* RIGHT: planet art */}
          <div className="relative lg:col-span-6 order-first lg:order-last">
            {/* big glow behind the planet */}
            <div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-[#2a0134]/80 blur-[70px]" />
            {/* planet image (use your purple planet .gif/.png) */}
            <div className="relative ml-auto w-[85%] max-w-[560px] aspect-square">
              <Image
                src="/planet.png" // <-- replace with your asset path
                alt="Cryphos planet"
                fill
                className="object-contain select-none"
                priority
              />
              {/* purple mix-blend overlay for brand cohesion */}
              {/* soft edge shadow */}

              {/* tiny satellites */}
              <span className="sat s1" />
              <span className="sat s2" />
              <span className="sat s3" />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-14">
          <header className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold">How it works</h2>
            <p className="mt-2 text-white/60">Go live in minutes—no spreadsheets, no code</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <article key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-transform hover:-translate-y-0.5">
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

        {/* WHY */}
        <section className="py-14">
          <header className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold">Why traders choose Cryphos</h2>
            <p className="mt-2 text-white/60">Designed for clarity, built for speed</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {valueProps.map((f, i) => (
              <article key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition-transform hover:-translate-y-0.5">
                <div className="text-2xl mb-2">{f.icon}</div>
                <h3 className="text-base font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-white/60">{f.description}</p>
              </article>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h3 className="text-xl font-bold mb-4 text-center">What you get</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {whatYouGet.map(({ title, copy }, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                  <div className="font-semibold mb-1">{title}</div>
                  <div className="text-sm text-white/60">{copy}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-16 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold">Turn signals into decisions</h2>
          <p className="mt-2 text-white/60">Build a strategy that fits you—then let Cryphos handle the monitoring.</p>

          <div className="mt-8 flex justify-center gap-4">
            {stats.map((s, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur">
                <span className="font-semibold text-[#e3b8ff]">{s.value}</span>
                <span className="text-white/60"> · {s.label}</span>
              </div>
            ))}
          </div>

          <Link href="/lab" className="mt-8 inline-flex">
            <button className="rounded-2xl bg-[#e3b8ff] px-7 py-3 text-black font-semibold transition-[transform,background] hover:-translate-y-0.5 hover:bg-[#d7a8ff] focus:outline-none focus-visible:ring focus-visible:ring-[#e3b8ff]/50 active:translate-y-0">
              Get Started Free
            </button>
          </Link>
        </section>
      </div>

      <style jsx>{`
        .caret-blink { animation: caret 1s steps(2, start) infinite; }
        @keyframes caret { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }

        /* gentle floating sats */
        .sat {
          position: absolute;
          display: block;
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: #e3b8ff;
          box-shadow: 0 0 18px rgba(227,184,255,0.7);
          opacity: 0.9;
        }
        .s1 { right: 14%; top: 18%; animation: float1 6s ease-in-out infinite; }
        .s2 { right: 28%; bottom: 20%; width: 10px; height: 10px; animation: float2 7.5s ease-in-out infinite; }
        .s3 { right: 6%; bottom: 10%; width: 8px; height: 8px; animation: float3 5.5s ease-in-out infinite; }

        @keyframes float1 {
          0%,100% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(6px,-8px,0); }
        }
        @keyframes float2 {
          0%,100% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(-8px,6px,0); }
        }
        @keyframes float3 {
          0%,100% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(5px,5px,0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .caret-blink, .s1, .s2, .s3 { animation: none; }
        }
      `}</style>
    </div>
  );
}
