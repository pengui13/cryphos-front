"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SleekSnackbar from "../components/Snackbar";

const slides = [
  { src: "/hero-1.jpg", caption: "Reset and get back on track." },
  { src: "/hero-2.png", caption: "Your security, simplified." },
  { src: "/hero-3.png", caption: "Clarity when you need it most." },
  { src: "/hero-4.png", caption: "Back in control, instantly." },
];

function Carousel({ interval = 4500 }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % slides.length), interval);
    return () => clearInterval(id);
  }, [interval]);
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image src={slides[idx].src} alt="" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-[#b65fcf] mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115]/70 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-xl md:text-2xl font-semibold tracking-tight">
              {slides[idx].caption}
            </p>
            <div className="mt-3 flex gap-2">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 w-8 rounded-full transition ${
                    i === idx ? "bg-white/80" : "bg-white/25"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute left-4 top-4">
        <Link
          href="/"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-sm backdrop-blur hover:bg-black/40"
        >
          <span>Back to website</span>
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}

function Strength({ value = "" }) {
  const len = value.length;
  const variety =
    /[a-z]/.test(value) + /[A-Z]/.test(value) + /\d/.test(value) + /[^A-Za-z0-9]/.test(value);
  const score = Math.min(1, (len > 7 ? 0.5 : len / 16) + (variety - 1) * 0.17);
  return (
    <div className="mt-1 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
      <div
        className="h-full rounded-full transition-[width]"
        style={{
          width: `${Math.round(score * 100)}%`,
          background: "rgba(227,184,255,.9)",
        }}
      />
    </div>
  );
}

export default function Reset() {
  const router = useRouter();
  const [step, setStep] = useState("start");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarData, setSnackbarData] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v.trim());

  const showError = (err, fallback = "Something went wrong") => {
    let msg = fallback;
    if (err?.detail) msg = String(err.detail);
    else if (typeof err === "string") msg = err;
    else if (err && typeof err === "object") {
      msg =
        Object.entries(err)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(" ") : String(v)}`)
          .join(" • ") || fallback;
    }
    setSnackbarData({ visible: true, status: "error", info: msg });
  };

  const handleStart = async (e) => {
    e.preventDefault();
    if (!emailOk(email)) {
      setSnackbarData({ visible: true, status: "error", info: "Enter a valid email" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/reset/start/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        throw data || { detail: "Failed to send reset code" };
      }
      
      setStep("verify");
      setSnackbarData({ visible: true, status: "success", info: "Reset code sent to your Telegram" });
    } catch (err) {
      showError(err, "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setSnackbarData({ visible: true, status: "error", info: "Passwords do not match" });
      return;
    }
    if (!/^\d{6}$/.test(code.trim())) {
      setSnackbarData({ visible: true, status: "error", info: "Code should be 6 digits" });
      return;
    }
    if (password.length < 6) {
      setSnackbarData({ visible: true, status: "error", info: "Password must be at least 6 characters" });
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/reset/verify/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          code: code.trim(), 
          password, 
          password2: confirm 
        }),
      });
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        throw data || { detail: "Reset failed" };
      }
      
      setSnackbarData({ visible: true, status: "success", info: "Password reset! Redirecting to login…" });
      setTimeout(() => router.push("/login"), 1200);
    } catch (err) {
      showError(err, "Invalid code or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0f1115] text-zinc-100">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left */}
          <div className="flex flex-col gap-6">
            <div className="h-[470px]">
              <Carousel />
            </div>
          </div>

          {/* Right */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="relative rounded-[28px] border border-white/10 bg-white/8 p-12 shadow-[0_10px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          >
            <header className="mb-8">
              <h1 className="text-[36px] font-extrabold tracking-tight">
                {step === "start" ? "Reset your password" : "Set new password"}
              </h1>
              <p className="mt-1 text-white/70">
                {step === "start"
                  ? "Enter your email — we'll send a code to your Telegram."
                  : "Check your Telegram for the 6-digit code."}
              </p>
            </header>

            {step === "start" ? (
              <form className="grid gap-7" onSubmit={handleStart}>
                <div>
                  <label className="mb-1 block text-sm text-white/70">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-[#e3b8ff]/40 focus:ring-2 focus:ring-[#e3b8ff]/30"
                  />
                </div>

                {/* Info box */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">📱</span>
                    <div>
                      <p className="text-sm text-white/80">Reset code via Telegram</p>
                      <p className="text-xs text-white/50 mt-1">
                        Make sure you have Telegram connected to your account in Settings.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-[#e3b8ff] px-6 py-3 font-semibold text-black shadow-[0_12px_30px_-10px_rgba(227,184,255,0.6)] hover:-translate-y-0.5 hover:bg-[#d7a8ff] transition disabled:opacity-60"
                >
                  {loading ? "Sending…" : "Send reset code"}
                </button>
                
                <p className="text-sm text-white/60">
                  Remembered?{" "}
                  <Link href="/login" className="text-[#e3b8ff] hover:underline">
                    Log in
                  </Link>
                </p>
              </form>
            ) : (
              <form className="grid gap-6" onSubmit={handleVerify}>
                {/* Telegram hint */}
                <div className="rounded-xl border border-[#e3b8ff]/20 bg-[#e3b8ff]/5 p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">✨</span>
                    <p className="text-sm text-[#e3b8ff]">
                      Check your Telegram for a message from @cryphos_bot
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm text-white/70">Verification code</label>
                  <input
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/[^\d]/g, "").slice(0, 6))}
                    placeholder="123456"
                    className="w-full text-center tracking-[0.25em] text-xl rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-white placeholder-white/40 outline-none focus:border-[#e3b8ff]/40 focus:ring-2 focus:ring-[#e3b8ff]/30"
                  />
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="block text-sm text-white/70">New password</label>
                    <button
                      type="button"
                      className="text-xs text-white/60 hover:text-white/80"
                      onClick={() => setShowPw((v) => !v)}
                    >
                      {showPw ? "Hide" : "Show"}
                    </button>
                  </div>
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-white outline-none focus:border-[#e3b8ff]/40 focus:ring-2 focus:ring-[#e3b8ff]/30"
                  />
                  <Strength value={password} />
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="block text-sm text-white/70">Confirm password</label>
                    <button
                      type="button"
                      className="text-xs text-white/60 hover:text-white/80"
                      onClick={() => setShowPw2((v) => !v)}
                    >
                      {showPw2 ? "Hide" : "Show"}
                    </button>
                  </div>
                  <input
                    type={showPw2 ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-white outline-none focus:border-[#e3b8ff]/40 focus:ring-2 focus:ring-[#e3b8ff]/30"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-[#e3b8ff] px-6 py-3 font-semibold text-black shadow-[0_12px_30px_-10px_rgba(227,184,255,0.6)] hover:-translate-y-0.5 hover:bg-[#d7a8ff] transition disabled:opacity-60"
                >
                  {loading ? "Resetting…" : "Reset password"}
                </button>

                <p className="text-sm text-white/60">
                  Wrong email?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setStep("start");
                      setCode("");
                    }}
                    className="text-[#e3b8ff] hover:underline"
                  >
                    Go back
                  </button>
                </p>
              </form>
            )}
          </motion.section>
        </div>
      </div>

      <SleekSnackbar data={snackbarData} onClose={() => setSnackbarData(null)} />
    </div>
  );
}