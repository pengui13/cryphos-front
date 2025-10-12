import Input from "./Input";
import { useState } from "react";
import PropTypes from "prop-types";

// ConfigureTg — full flow (no BotModal), palette-matched (#e3b8ff / #6a2e8e), no gradients
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
      className={`group relative inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-[transform,background,border-color,opacity] focus:outline-none focus-visible:ring focus-visible:ring-[#e3b8ff]/60 border-[#e3b8ff]/30 bg-zinc-900 text-[#e3b8ff] hover:bg-[#e3b8ff]/10 active:scale-[0.98] ${className}`}
      disabled={busy}
    >
      <span className={`absolute inset-0 rounded-md pointer-events-none ${copied ? "" : "hidden"}`}>
        <span className="absolute inset-0 animate-ping rounded-md border border-[#e3b8ff]/50" />
      </span>
      <span className="relative inline-flex h-4 w-4 items-center justify-center">
        <svg className={`h-4 w-4 transition-opacity duration-150 ${copied ? "opacity-0" : "opacity-100"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
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
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Connect Telegram</h2>
        <p className="text-white/60 text-sm">Add your Telegram username for notifications</p>
      </div>

      {/* Main Form */}
      <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-6">
        <div className="space-y-6">
          {/* Input Section */}
          <div>
            <label className="text-white font-medium text-sm mb-3 block">Telegram Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-white/60 text-lg">@</span>
              </div>
              <Input
                type="text"
                value={tgNickname}
                onChange={(e) => setTgNickname(e.target.value)}
                placeholder="Enter your username"
                className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#e3b8ff]/50 transition-colors"
              />
            </div>
            <p className="text-white/60 text-xs mt-2">Don't include the @ symbol — just your username (e.g. "johndoe").</p>
          </div>

          {/* Steps (no modal) */}
          <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-6">
            <h3 className="text-base font-medium mb-4 flex items-center gap-2">
              <span>📱</span>
              Connect to Telegram
            </h3>

            <ol className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#e3b8ff]/40 text-[11px] font-bold text-[#e3b8ff]">1</span>
                <span className="text-sm text-zinc-300">Search for our bot on Telegram</span>
              </li>
              <li className="ml-9">
                <div className="flex items-center justify-between gap-3 rounded-lg border border-[#e3b8ff]/30 bg-zinc-900 px-3 py-2">
                  <span className="font-mono text-sm text-[#e3b8ff]">@cryphos_bot</span>
                  <CopyChip value="@cryphos_bot" />
                </div>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#e3b8ff]/40 text-[11px] font-bold text-[#e3b8ff]">2</span>
                <span className="text-sm text-zinc-300">Send <code className="rounded bg-[#6a2e8e]/20 px-2 py-1 text-[12px] text-[#e3b8ff]">/start</code> command</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#e3b8ff]/40 text-[11px] font-bold text-[#e3b8ff]">3</span>
                <span className="text-sm text-zinc-300">Verify account and receive signals</span>
              </li>
            </ol>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => window.open("https://t.me/cryphos_bot", "_blank")}
                className="flex-1 px-6 py-3 rounded-xl bg-[#e3b8ff] text-black font-semibold transition-[background,transform] hover:translate-y-[-1px] active:translate-y-0 hover:bg-[#d7a8ff] focus:outline-none focus-visible:ring focus-visible:ring-[#e3b8ff]/70"
              >
                <span className="mr-2">📱</span>
                Open Telegram Bot
              </button>
            </div>
          </div>

        </div>
      </div>


      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={() => setStep(step - 1)}
          className="px-6 py-2 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring focus-visible:ring-[#e3b8ff]/50"
        >
          ← Back
        </button>

        <button
          onClick={onCreateBot}
          disabled={!tgNickname}
          className="px-8 py-3 rounded-lg bg-[#e3b8ff] text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d7a8ff] transition-[background,transform] hover:translate-y-[-1px] active:translate-y-0 focus:outline-none focus-visible:ring focus-visible:ring-[#e3b8ff]/60"
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