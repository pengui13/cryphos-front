"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Snackbar from "../components/Snackbar";
import { usePing } from "../providers";
import { GetTelegramInfo, AddTelegram } from "../api/ApiWrapper";

/** Small reusable copy chip (brand tinted) */
function CopyChip({ value, label = value, className = "" }) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleCopy() {
    if (busy) return;
    try {
      setBusy(true);
      await navigator.clipboard.writeText(value);
      setCopied(true);
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

export default function SettingsPage() {
  const ping = usePing();

  const [snackData, setSnackData] = useState({
    visible: false,
    status: false,
    type: "prime",
    info: "",
  });

  const [tgNickname, setTgNickname] = useState("");
  const [tgInput, setTgInput] = useState("");
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!ping) return;

    const loadTgInfo = async () => {
      try {
        const data = await GetTelegramInfo();
        setTgNickname(data.tg || "");
        setTgInput(data.tg || "");
        setChatId(data.chat_id || null);
      } catch (err) {
        console.error("Failed to load TG info:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTgInfo();
  }, [ping]);

  const isConnected = Boolean(chatId);
  const nicknameChanged = tgInput.trim().replace(/^@/, "") !== tgNickname;
  const hasNicknameSaved = Boolean(tgNickname);

  const handleSaveNickname = async () => {
    const nickname = tgInput.trim().replace(/^@/, "");
    if (!nickname) {
      setSnackData({
        visible: true,
        status: false,
        type: "prime",
        info: "Please enter your Telegram username",
      });
      return;
    }

    setSaving(true);
    try {
      await AddTelegram(nickname);
      setTgNickname(nickname);
      setTgInput(nickname);
      setSnackData({
        visible: true,
        status: true,
        type: "prime",
        info: "Telegram nickname saved! Now send /start to the bot.",
      });
    } catch (err) {
      setSnackData({
        visible: true,
        status: false,
        type: "prime",
        info: err?.data?.error || "Failed to save nickname",
      });
    } finally {
      setSaving(false);
    }
  };

  // Not logged in
  if (!ping) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f1115] text-zinc-100 px-6">
        <Image
          src="/padlock.png"
          alt="Locked"
          width={220}
          height={220}
          className="drop-shadow-[0_0_25px_rgba(227,184,255,0.25)]"
        />

        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-6">
          You are not authorized
        </h1>
        <p className="text-white/60 text-center max-w-md mt-2">
          Please log in to access settings.
        </p>

        <div className="flex gap-3 mt-5">
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl bg-[#e3b8ff] text-black font-semibold hover:bg-[#d7a8ff] transition"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl border border-white/15 bg-white/5 text-white hover:bg-white/10 transition"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f1115] text-white/70 animate-pulse">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1115] text-zinc-100">
      <Snackbar data={snackData} />

      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
          <p className="mt-2 text-white/70">Manage your account and integrations.</p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* Telegram Section */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span>📱</span> Telegram Integration
              </h2>

              {/* Status badge */}
              {isConnected ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/20 border border-green-500/30 px-3 py-1 text-xs font-medium text-green-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  Connected
                </span>
              ) : hasNicknameSaved ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 px-3 py-1 text-xs font-medium text-yellow-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                  Pending
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs font-medium text-white/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
                  Not connected
                </span>
              )}
            </div>

            {/* Connected state */}
            {isConnected && (
              <div className="mb-6 rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-green-400">Telegram connected</p>
                    <p className="text-sm text-white/60">@{tgNickname} • Signals enabled</p>
                  </div>
                </div>
              </div>
            )}

            {/* Connection steps */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="mb-4 text-base font-semibold">
                {isConnected ? "Update Telegram" : "How to connect"}
              </h3>

              <ol className="space-y-4">
                {/* Step 1: Enter nickname */}
                <li className="flex items-start gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#e3b8ff]/40 text-[11px] font-bold text-[#e3b8ff]">
                    1
                  </span>
                  <div className="flex-1">
                    <span className="text-sm text-zinc-300">Enter your Telegram username</span>
                    <div className="mt-2 flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">@</span>
                        <input
                          type="text"
                          value={tgInput}
                          onChange={(e) => setTgInput(e.target.value.replace(/^@/, ""))}
                          placeholder="your_username"
                          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-8 pr-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#e3b8ff]/50 focus:ring-1 focus:ring-[#e3b8ff]/30"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSaveNickname}
                        disabled={saving || !nicknameChanged}
                        className="rounded-xl bg-[#e3b8ff] px-4 py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#d7a8ff] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </li>

                {/* Step 2: Open bot */}
                <li className="flex items-start gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#e3b8ff]/40 text-[11px] font-bold text-[#e3b8ff]">
                    2
                  </span>
                  <div className="flex-1">
                    <span className="text-sm text-zinc-300">Open our bot on Telegram</span>
                    <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-[#e3b8ff]/30 bg-white/5 px-3 py-2">
                      <span className="font-mono text-sm text-[#e3b8ff]">@cryphos_bot</span>
                      <CopyChip value="cryphos_bot" label="Copy" />
                    </div>
                  </div>
                </li>

                {/* Step 3: Send /start */}
                <li className="flex items-center gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#e3b8ff]/40 text-[11px] font-bold text-[#e3b8ff]">
                    3
                  </span>
                  <span className="text-sm text-zinc-300">
                    Send{" "}
                    <code className="rounded bg-[#6a2e8e]/20 px-2 py-0.5 text-[12px] text-[#e3b8ff]">
                      /start
                    </code>{" "}
                    to connect your account
                  </span>
                </li>
              </ol>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => window.open("https://t.me/cryphos_bot", "_blank")}
                  className="w-full rounded-2xl bg-[#e3b8ff] px-6 py-3 font-semibold text-black transition-[transform,background,box-shadow] shadow-[0_12px_30px_-10px_rgba(227,184,255,0.6)] hover:-translate-y-0.5 hover:bg-[#d7a8ff] focus:outline-none focus-visible:ring focus-visible:ring-[#e3b8ff]/50 active:translate-y-0"
                >
                  Open Telegram Bot
                </button>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}