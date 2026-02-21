"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { signIn } from "../api/ApiWrapper";
import SleekSnackbar from "../components/Snackbar";
import { useLang } from "../LanguageContext";
import { BASE_URL } from "../api/ApiWrapper";

// ── Orb — identical to Login ─────────────────────────────────────────────────
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

export default function Register() {
  const { lang, setLang, t } = useLang();

  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw,          setShowPw]          = useState(false);
  const [showPw2,         setShowPw2]         = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [snackbarData,    setSnackbarData]    = useState(null);

  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v.trim());

  const showError = (err, fallback = t?.("auth.registerFailed") ?? "Registration failed") => {
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

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setSnackbarData({ visible: true, status: "error", info: t?.("auth.fillAll") ?? "Please fill in all fields" });
      return;
    }
    if (!emailOk(email)) {
      setSnackbarData({ visible: true, status: "error", info: t?.("auth.invalidEmail") ?? "Please enter a valid email" });
      return;
    }
    if (password !== confirmPassword) {
      setSnackbarData({ visible: true, status: "error", info: t?.("auth.pwNoMatch") ?? "Passwords do not match" });
      return;
    }
    if (password.length < 6) {
      setSnackbarData({ visible: true, status: "error", info: t?.("auth.pwTooShort") ?? "Password must be at least 6 characters" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          username: email,
          password,
          password2: confirmPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw data || { detail: "Registration failed" };

      document.cookie = `access=${data.access}; path=/; max-age=${60 * 60 * 24 * 7}`;
      document.cookie = `refresh=${data.refresh}; path=/; max-age=${60 * 60 * 24 * 30}`;

      setSnackbarData({ visible: true, status: "success", info: t?.("auth.registerSuccess") ?? "Account created! Redirecting…" });
      setTimeout(() => { window.location.href = "/lab"; }, 800);
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  };


  // Input shared classes
  const inputCls =
    "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-white/20 focus:bg-white/[0.06]";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#080808] text-white">

      {/* Background — identical to login */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(80,40,160,0.25),transparent)]" />
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <Orb x="5%"  y="8%"  size={500} color="100,60,200" />
        <Orb x="75%" y="2%"  size={400} color="180,60,120" />
        <Orb x="40%" y="55%" size={600} color="40,100,200" />
      </div>



      <div className="flex min-h-screen items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          {/* Card */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-sm">

            <header className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight">
                {t?.("auth.createAccount") ?? "Create account"}
              </h1>
              <p className="mt-1.5 text-sm text-white/40">
                {t?.("auth.haveAccount") ?? "Already have an account?"}{" "}
                <Link
                  href="/login"
                  className="text-white/70 underline underline-offset-2 transition hover:text-white"
                >
                  {t?.("auth.login") ?? "Sign in"}
                </Link>
              </p>
            </header>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>

              {/* Email */}
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

              {/* Password */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="block text-xs font-medium uppercase tracking-widest text-white/30">
                    {t?.("auth.password") ?? "Password"}
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

              {/* Confirm password */}
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                  className={inputCls}
                />
                <div className="mt-1.5">
                  <MatchDot password={password} confirm={confirmPassword} />
                </div>
              </div>

              {/* Submit */}
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
                    {t?.("auth.creatingAccount") ?? "Creating account…"}
                  </span>
                ) : (
                  t?.("auth.createAccount") ?? "Create account"
                )}
              </motion.button>

              {/* Terms */}
              <p className="pt-1 text-center text-[11px] leading-relaxed text-white/25">
                {t?.("auth.termsPrefix") ?? "By signing up you agree to our"}{" "}
                <Link href="/terms" className="text-white/40 underline underline-offset-2 transition hover:text-white/60">
                  {t?.("auth.terms") ?? "Terms"}
                </Link>{" "}
                &{" "}
                <Link href="/privacy" className="text-white/40 underline underline-offset-2 transition hover:text-white/60">
                  {t?.("auth.privacy") ?? "Privacy"}
                </Link>
              </p>

            </form>
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