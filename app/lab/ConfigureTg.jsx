"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import Input from "./Input";

/** Small reusable copy chip (brand tinted) */
export function CopyChip({ value, label = value, className = "", onCopy }) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleCopy() {
    if (busy) return;
    try {
      setBusy(true);
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopy && onCopy();
      setTimeout(() => setCopied(false), 1200);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-live="polite"
      aria-label={copied ? "Copied" : `Copy ${label}`}
      className={`group relative inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-[transform,background,border-color,opacity] focus:outline-none focus-visible:ring focus-visible:ring-[#e3b8ff]/60 border-[#e3b8ff]/30 bg-white/5 text-[#e3b8ff] hover:bg-[#e3b8ff]/10 active:scale-[0.98] ${className}`}
      disabled={busy}
    >
      <span className={`absolute inset-0 rounded-xl pointer-events-none ${copied ? "" : "hidden"}`}>
        <span className="absolute inset-0 animate-ping rounded-xl border border-[#e3b8ff]/50" />
      </span>
      <span className="relative inline-flex h-4 w-4 items-center justify-center">
        {/* copy icon */}
        <svg className={`h-4 w-4 transition-opacity duration-150 ${copied ? "opacity-0" : "opacity-100"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        {/* check icon */}
        <svg className={`absolute h-4 w-4 transition-opacity duration-150 ${copied ? "opacity-100" : "opacity-0"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <span className="font-mono">{label}</span>
      <span className={`ml-1 text-xs text-[#e3b8ff] transition-opacity ${copied ? "opacity-100" : "opacity-0"}`}>Copied</span>
    </button>
  );
}

CopyChip.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
  onCopy: PropTypes.func,
};

export default function ConfigureTg({ tgNickname, setTgNickname, step, setStep, onCreateBot }) {
  const valid = tgNickname && tgNickname.trim().length > 0 && !tgNickname.startsWith("@");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Connect Telegram</h2>
        <p className="mt-1 text-white/70 text-sm">Add your Telegram username to receive alerts.</p>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-7 backdrop-blur">
        <div className="space-y-6">
          {/* Username input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">Telegram username</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 grid w-8 place-items-center text-white/50">@</span>
              <Input
                type="text"
                value={tgNickname}
                onChange={(e) => setTgNickname(e.target.value)}
                placeholder="e.g. johndoe"
                className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 pl-8 text-white placeholder-white/40 outline-none transition focus:border-[#e3b8ff]/40 focus:ring-2 focus:ring-[#e3b8ff]/30"
              />
            </div>
            <div className="mt-1.5 text-xs text-white/60">
              Don’t include the <span className="text-white">@</span> — just your handle.
            </div>
          </div>

          {/* Steps card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold">
              <span>📱</span> Connect to Telegram
            </h3>

            <ol className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#e3b8ff]/40 text-[11px] font-bold text-[#e3b8ff]">1</span>
                <span className="text-sm text-zinc-300">Search for our bot on Telegram</span>
              </li>

              <li className="ml-9">
                <div className="flex items-center justify-between gap-3 rounded-xl border border-[#e3b8ff]/30 bg-white/5 px-3 py-2">
                  <span className="font-mono text-sm text-[#e3b8ff]">@cryphos_bot</span>
                  <CopyChip value="@cryphos_bot" />
                </div>
              </li>

              <li className="flex items-center gap-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#e3b8ff]/40 text-[11px] font-bold text-[#e3b8ff]">2</span>
                <span className="text-sm text-zinc-300">
                  Send <code className="rounded bg-[#6a2e8e]/20 px-2 py-0.5 text-[12px] text-[#e3b8ff]">/start</code>
                </span>
              </li>

              <li className="flex items-center gap-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#e3b8ff]/40 text-[11px] font-bold text-[#e3b8ff]">3</span>
                <span className="text-sm text-zinc-300">Verify and start receiving signals</span>
              </li>
            </ol>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => window.open("https://t.me/cryphos_bot", "_blank")}
                className="flex-1 rounded-2xl bg-[#e3b8ff] px-6 py-3 font-semibold text-black transition-[transform,background,box-shadow] shadow-[0_12px_30px_-10px_rgba(227,184,255,0.6)] hover:-translate-y-0.5 hover:bg-[#d7a8ff] focus:outline-none focus-visible:ring focus-visible:ring-[#e3b8ff]/50 active:translate-y-0"
              >
                Open Telegram Bot
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer nav */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setStep(step - 1)}
          className="rounded-2xl border border-white/15 bg-white/5 px-5 py-2.5 text-white transition hover:bg-white/10"
        >
          ← Back
        </button>

        <button
          onClick={onCreateBot}
          disabled={!valid}
          className={`rounded-2xl px-6 py-2.5 font-semibold transition-[transform,background,box-shadow]
            ${
              valid
                ? "bg-[#e3b8ff] text-black shadow-[0_12px_30px_-10px_rgba(227,184,255,0.6)] hover:-translate-y-0.5 hover:bg-[#d7a8ff] focus:outline-none focus-visible:ring focus-visible:ring-[#e3b8ff]/50 active:translate-y-0"
                : "cursor-not-allowed bg-white/10 text-white/50"
            }`}
        >
          Create Bot →
        </button>
      </div>
    </div>
  );
}

ConfigureTg.propTypes = {
  tgNickname: PropTypes.string,
  setTgNickname: PropTypes.func.isRequired,
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  onCreateBot: PropTypes.func.isRequired,
};
