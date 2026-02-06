"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Snackbar from "../components/Snackbar";
import { usePing } from "../providers";
import { GetTelegramInfo, AddTelegram } from "../api/ApiWrapper";

function CopyChip({ value, label = value }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="group relative inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10"
    >
      {copied ? (
        <>
          <svg className="h-3.5 w-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          {label}
        </>
      )}
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

  if (!ping) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-6 text-white">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/20 blur-[150px]" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center"
        >
          <Image
            src="/padlock.png"
            alt="Locked"
            width={180}
            height={180}
            className="mx-auto mb-8 drop-shadow-[0_0_40px_rgba(168,85,247,0.4)]"
          />

          <h1 className="mb-3 bg-gradient-to-br from-white to-white/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
            Authentication Required
          </h1>
          <p className="mx-auto max-w-md text-white/60">
            Please log in to access settings
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl bg-white px-8 py-3 font-semibold text-black transition"
              >
                Log in
              </motion.button>
            </Link>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl border border-white/10 bg-white/5 px-8 py-3 font-semibold transition hover:bg-white/10"
              >
                Register
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white/70">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-white" />
          <div>Loading settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black" />

      <Snackbar data={snackData} />

      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="mb-3 bg-gradient-to-br from-white to-white/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
            Settings
          </h1>
          <p className="text-lg text-white/50">
            Manage your account and integrations
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Telegram Section */}
          <div className="rounded-[32px] border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.98 1.26-5.6 3.7-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.75 3.99-1.74 6.65-2.89 7.98-3.45 3.8-1.59 4.59-1.87 5.1-1.87.11 0 .36.03.52.16.14.11.17.26.19.37.01.08.03.29.01.45z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Telegram Integration</h2>
                  <p className="text-sm text-white/50">Connect to receive signals</p>
                </div>
              </div>

              {/* Status badge */}
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-400' : hasNicknameSaved ? 'bg-yellow-400' : 'bg-white/30'}`} />
                <span className="text-sm text-white/60">
                  {isConnected ? 'Connected' : hasNicknameSaved ? 'Pending' : 'Not connected'}
                </span>
              </div>
            </div>

            {/* Connected state */}
            {isConnected && (
              <div className="mb-6 rounded-2xl bg-green-500/10 p-4 ring-1 ring-green-500/20">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                    <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-green-400">Successfully connected</p>
                    <p className="text-sm text-white/60">@{tgNickname} • Receiving signals</p>
                  </div>
                </div>
              </div>
            )}

            {/* Steps */}
            <div className="space-y-6">
              {/* Step 1 */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
                    1
                  </div>
                  <span className="text-sm font-medium text-white/80">
                    Enter your Telegram username
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">@</span>
                    <input
                      type="text"
                      value={tgInput}
                      onChange={(e) => setTgInput(e.target.value.replace(/^@/, ""))}
                      placeholder="your_username"
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-8 pr-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveNickname}
                    disabled={saving || !nicknameChanged}
                    className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </motion.button>
                </div>
              </div>

              {/* Step 2 */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
                    2
                  </div>
                  <span className="text-sm font-medium text-white/80">
                    Open our bot on Telegram
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <code className="font-mono text-sm text-white/80">@cryphos_bot</code>
                  <CopyChip value="cryphos_bot" label="Copy" />
                </div>
              </div>

              {/* Step 3 */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
                    3
                  </div>
                  <span className="text-sm font-medium text-white/80">
                    Send <code className="rounded bg-white/10 px-2 py-0.5 text-xs text-white">/start</code> to connect
                  </span>
                </div>
              </div>

              {/* Open Bot Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open("https://t.me/cryphos_bot", "_blank")}
                className="w-full rounded-2xl bg-white px-6 py-4 font-semibold text-black transition hover:bg-white/90"
              >
                Open Telegram Bot →
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}