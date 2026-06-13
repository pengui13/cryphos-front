"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Copy, Check } from "lucide-react";
import { DONATION_WALLET, DONATION_NETWORK } from "./constants";

export default function DonationSection() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(DONATION_WALLET);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }

  return (
    <section className="py-16 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, margin: "-40px" }}
        className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 text-center backdrop-blur-sm sm:p-12"
      >
        {/* Glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(180,60,120,0.25),transparent_70%)] blur-2xl" />

        <div className="relative">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <Heart className="h-6 w-6 text-pink-400" />
          </div>

          <h2 className="mx-auto max-w-md bg-gradient-to-b from-white to-white/50 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl">
            Support Cryphos
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/50 sm:text-base">
            Cryphos is free to use. If it helps your trading, you can support
            development with a USDT donation — it keeps the signals running.
          </p>

          {/* Network badge */}
          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {DONATION_NETWORK}
          </div>

          {/* Address + copy */}
          <button
            onClick={copy}
            className="group mx-auto mt-4 flex w-full max-w-lg items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-left transition hover:border-white/20 hover:bg-black/40"
          >
            <code className="min-w-0 break-all font-mono text-xs text-white/80 sm:text-sm">
              {DONATION_WALLET}
            </code>
            <span
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                copied
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-white/5 text-white/60 group-hover:bg-white/10 group-hover:text-white/80"
              }`}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </span>
          </button>

          <p className="mt-4 text-xs text-white/30">
            Only send <span className="text-white/50">USDT on the TRC20 (Tron)</span> network to this address.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
