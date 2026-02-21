"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, ArrowLeft, ShieldCheck } from "lucide-react";
import SleekSnackbar from "../components/Snackbar";
import { BASE_URL } from "../api/ApiWrapper";
import { useLang } from "../LanguageContext";

// ── Orb — identical to Login / Register ──────────────────────────────────────
function Orb({ x, y, size, color }) {
  return (
    <div className="pointer-events-none absolute" style={{ left: x, top: y, width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(${color},0.18) 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />
    </div>
  );
}

// ── Password strength bar ─────────────────────────────────────────────────────
function PasswordStrength({ value = "", t }) {
  if (!value) return null;
  const len = value.length;
  const variety =
    /[a-z]/.test(value) + /[A-Z]/.test(value) + /\d/.test(value) + /[^A-Za-z0-9]/.test(value);
  const score = Math.min(1, (len > 7 ? 0.5 : len / 16) + (variety - 1) * 0.17);
  const label = score < 0.3 ? (t?.("auth.pwWeak") ?? "Weak") : score < 0.6 ? (t?.("auth.pwMedium") ?? "Medium") : (t?.("auth.pwStrong") ?? "Strong");
  const color = score < 0.3 ? "bg-red-500" : score < 0.6 ? "bg-yellow-400" : "bg-emerald-400";
  return (
    <div className="mt-2 space-y-1">
      <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.round(score * 100)}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
      <p className="text-[11px] text-white/30">{label}</p>
    </div>
  );
}

// ── Match indicator ───────────────────────────────────────────────────────────
function MatchDot({ password, confirm }) {
  if (!confirm) return null;
  const ok = password === confirm;
  return (
    <span className={`text-[11px] ${ok ? "text-emerald-400" : "text-red-400"}`}>
      {ok ? "✓ Passwords match" : "✗ Doesn't match"}
    </span>
  );
}

export default function Reset() {
  const router = useRouter();
  const { lang, setLang, t } = useLang();

  const [step,         setStep]         = useState("start");   // "start" | "verify"
  const [email,        setEmail]        = useState("");
  const [code,         setCode]         = useState("");
  const [password,     setPassword]     = useState("");
  const [confirm,      setConfirm]      = useState("");
  const [showPw,       setShowPw]       = useState(false);
  const [showPw2,      setShowPw2]      = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [snackbarData, setSnackbarData] = useState(null);

  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v.trim());

  const showError = (err, fallback = t?.("auth.resetFailed") ?? "Something went wrong") => {
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
      setSnackbarData({ visible: true, status: "error", info: t?.("auth.invalidEmail") ?? "Enter a valid email" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}auth/reset/start/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw data || { detail: "Failed to send reset code" };
      setStep("verify");
      setSnackbarData({ visible: true, status: "success", info: t?.("auth.resetCodeSent") ?? "Reset code sent to your Telegram" });
    } catch (err) {
      showError(err, t?.("auth.resetSendFailed") ?? "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code.trim())) {
      setSnackbarData({ visible: true, status: "error", info: t?.("auth.resetCodeInvalid") ?? "Code should be 6 digits" });
      return;
    }
    if (password !== confirm) {
      setSnackbarData({ visible: true, status: "error", info: t?.("auth.pwNoMatch") ?? "Passwords do not match" });
      return;
    }
    if (password.length < 6) {
      setSnackbarData({ visible: true, status: "error", info: t?.("auth.pwTooShort") ?? "Password must be at least 6 characters" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}auth/reset/verify/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: code.trim(), password, password2: confirm }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw data || { detail: "Reset failed" };
      setSnackbarData({ visible: true, status: "success", info: t?.("auth.resetSuccess") ?? "Password reset! Redirecting…" });
      setTimeout(() => router.push("/login"), 1200);
    } catch (err) {
      showError(err, t?.("auth.resetVerifyFailed") ?? "Invalid code or password");
    } finally {
      setLoading(false);
    }
  };

  const LANGS = [
    { code: "en", flag: "🇬🇧" },
    { code: "uk", flag: "🇺🇦" },
    { code: "ru", flag: "🇷🇺" },
    { code: "de", flag: "🇩🇪" },
    { code: "es", flag: "🇪🇸" },
  ];

  const inputCls =
    "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-white/20 focus:bg-white/[0.06]";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#080808] text-white">

      {/* Background — identical to login/register */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(80,40,160,0.25),transparent)]" />
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <Orb x="5%"  y="8%"  size={500} color="100,60,200" />
        <Orb x="75%" y="2%"  size={400} color="180,60,120" />
        <Orb x="40%" y="55%" size={600} color="40,100,200" />
      </div>

      {/* Language picker */}
      <div className="fixed right-6 top-6 z-50 flex items-center gap-1">
        {LANGS.map(({ code, flag }) => (
          <button
            key={code}
            onClick={() => setLang(code)}
            className={`rounded-lg px-2 py-1 text-base transition-all ${
              lang === code ? "bg-white/10 ring-1 ring-white/20" : "opacity-40 hover:opacity-80"
            }`}
          >
            {flag}
          </button>
        ))}
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-sm">

            <AnimatePresence mode="wait">

              {/* ── STEP 1: Email ─────────────────────────────────────────── */}
              {step === "start" && (
                <motion.div
                  key="start"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.3 }}
                >
                  <header className="mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight">
                      {t?.("auth.resetTitle") ?? "Reset password"}
                    </h1>
                    <p className="mt-1.5 text-sm text-white/40">
                      {t?.("auth.resetSub") ?? "Enter your email — we'll send a code to your Telegram."}
                    </p>
                  </header>

                  <form className="space-y-4" onSubmit={handleStart} noValidate>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-white/30">
                        {t?.("auth.email") ?? "Email"}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        className={inputCls}
                      />
                    </div>

                    {/* Telegram note */}
                    <div className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                      <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-white/30" />
                      <p className="text-xs leading-relaxed text-white/40">
                        {t?.("auth.resetTelegramNote") ?? "Make sure Telegram is connected to your account in Settings."}
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={loading}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                          {t?.("auth.resetSending") ?? "Sending…"}
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          {t?.("auth.resetSendCode") ?? "Send reset code"}
                        </>
                      )}
                    </motion.button>

                    <p className="pt-1 text-center text-xs text-white/25">
                      {t?.("auth.resetRemembered") ?? "Remembered your password?"}{" "}
                      <Link href="/login" className="text-white/40 underline underline-offset-2 transition hover:text-white/60">
                        {t?.("auth.login") ?? "Sign in"}
                      </Link>
                    </p>

                  </form>
                </motion.div>
              )}

              {/* ── STEP 2: Code + new password ───────────────────────────── */}
              {step === "verify" && (
                <motion.div
                  key="verify"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.3 }}
                >
                  <header className="mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight">
                      {t?.("auth.resetNewTitle") ?? "Set new password"}
                    </h1>
                    <p className="mt-1.5 text-sm text-white/40">
                      {t?.("auth.resetNewSub") ?? "Enter the code from your Telegram and choose a new password."}
                    </p>
                  </header>

                  <form className="space-y-4" onSubmit={handleVerify} noValidate>

                    {/* Telegram hint */}
                    <div className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-white/30" />
                      <p className="text-xs leading-relaxed text-white/40">
                        {t?.("auth.resetBotHint") ?? "Check Telegram for a message from @cryphos_bot"}
                      </p>
                    </div>

                    {/* Code */}
                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-white/30">
                        {t?.("auth.resetCode") ?? "6-digit code"}
                      </label>
                      <input
                        inputMode="numeric"
                        pattern="\d{6}"
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/[^\d]/g, "").slice(0, 6))}
                        placeholder="123456"
                        className={`${inputCls} text-center tracking-[0.3em]`}
                      />
                    </div>

                    {/* New password */}
                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <label className="block text-xs font-medium uppercase tracking-widest text-white/30">
                          {t?.("auth.resetNewPassword") ?? "New password"}
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowPw((v) => !v)}
                          className="text-xs text-white/30 transition hover:text-white/60"
                        >
                          {showPw ? (t?.("auth.hide") ?? "Hide") : (t?.("auth.show") ?? "Show")}
                        </button>
                      </div>
                      <input
                        type={showPw ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className={inputCls}
                      />
                      <PasswordStrength value={password} t={t} />
                    </div>

                    {/* Confirm */}
                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <label className="block text-xs font-medium uppercase tracking-widest text-white/30">
                          {t?.("auth.confirmPassword") ?? "Confirm password"}
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowPw2((v) => !v)}
                          className="text-xs text-white/30 transition hover:text-white/60"
                        >
                          {showPw2 ? (t?.("auth.hide") ?? "Hide") : (t?.("auth.show") ?? "Show")}
                        </button>
                      </div>
                      <input
                        type={showPw2 ? "text" : "password"}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className={inputCls}
                      />
                      <div className="mt-1.5">
                        <MatchDot password={password} confirm={confirm} />
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={loading}
                      className="mt-2 w-full rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                          {t?.("auth.resetResetting") ?? "Resetting…"}
                        </span>
                      ) : (
                        t?.("auth.resetConfirm") ?? "Reset password"
                      )}
                    </motion.button>

                    <p className="pt-1 text-center text-xs text-white/25">
                      {t?.("auth.resetWrongEmail") ?? "Wrong email?"}{" "}
                      <button
                        type="button"
                        onClick={() => { setStep("start"); setCode(""); }}
                        className="inline-flex items-center gap-1 text-white/40 underline underline-offset-2 transition hover:text-white/60"
                      >
                        <ArrowLeft className="h-3 w-3" />
                        {t?.("auth.resetGoBack") ?? "Go back"}
                      </button>
                    </p>

                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          <p className="mt-6 text-center text-xs text-white/20">
            © {new Date().getFullYear()} Cryphos
          </p>
        </motion.div>
      </div>

      <SleekSnackbar data={snackbarData} onClose={() => setSnackbarData(null)} />
    </div>
  );
}