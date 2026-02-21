"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { signIn } from "../api/ApiWrapper";
import SleekSnackbar from "../components/Snackbar";
import { useLang } from "../LanguageContext";

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

// ── Cookie helpers ────────────────────────────────────────────────────────────
function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1]
    .split("")
    .map((c, i, a) => (i === 0 ? decodeURIComponent(a.join("")) : ""))[0]
    ?? decodeURIComponent(
        (document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1] ?? "")
      );
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

const COOKIE_EMAIL    = "cryphos_remembered_email";
const COOKIE_PASSWORD = "cryphos_remembered_pw";
const COOKIE_DAYS     = 30;

export default function Login() {
  const { lang, setLang, t } = useLang();

  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [showPw,     setShowPw]     = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [snackbarData, setSnackbarData] = useState(null);

  // Load remembered credentials on mount
  useEffect(() => {
    const savedEmail = getCookie(COOKIE_EMAIL);
    const savedPw    = getCookie(COOKIE_PASSWORD);
    if (savedEmail) { setEmail(savedEmail); setRememberMe(true); }
    if (savedPw)    setPassword(savedPw);
  }, []);

  const handleLogin = async (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setSnackbarData({ visible: true, status: "error", info: t("auth.fillBoth") });
      return;
    }
    setLoading(true);
    try {
      await signIn({ email, password });

      if (rememberMe) {
        setCookie(COOKIE_EMAIL,    email,    COOKIE_DAYS);
        setCookie(COOKIE_PASSWORD, password, COOKIE_DAYS);
      } else {
        deleteCookie(COOKIE_EMAIL);
        deleteCookie(COOKIE_PASSWORD);
      }

      setSnackbarData({ visible: true, status: "success", info: t("auth.loginSuccess") });
      window.location.href = "/lab";
    } catch (err) {
      let msg = t("auth.loginFailed");
      if (err?.data && typeof err.data === "object") {
        msg = Object.entries(err.data)
          .map(([f, m]) => `${f}: ${Array.isArray(m) ? m.join(" ") : String(m)}`)
          .join(" • ") || msg;
      } else if (err?.message) {
        msg = err.message;
      }
      setSnackbarData({ visible: true, status: "error", info: msg });
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#080808] text-white">

      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(80,40,160,0.25),transparent)]" />
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <Orb x="5%"  y="8%"  size={500} color="100,60,200" />
        <Orb x="75%" y="2%"  size={400} color="180,60,120" />
        <Orb x="40%" y="55%" size={600} color="40,100,200" />
      </div>

   
      <div className="flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          {/* Card */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-sm">

            <header className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight">{t("auth.login")}</h1>
              <p className="mt-1.5 text-sm text-white/40">
                {t("auth.noAccount")}{" "}
                <Link href="/register" className="text-white/70 underline underline-offset-2 transition hover:text-white">
                  {t("auth.signup")}
                </Link>
              </p>
            </header>

            <form className="space-y-5" onSubmit={handleLogin} noValidate>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-white/30">
                  {t("auth.email")}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-white/20 focus:bg-white/[0.06]"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-medium uppercase tracking-widest text-white/30">
                    {t("auth.password")}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="text-xs text-white/30 transition hover:text-white/60"
                  >
                    {showPw ? t("auth.hide") : t("auth.show")}
                  </button>
                </div>
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-white/20 focus:bg-white/[0.06]"
                />
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2.5 select-none">
                  <div
                    onClick={() => setRememberMe((v) => !v)}
                    className={`relative h-4 w-4 shrink-0 rounded cursor-pointer border transition-all ${
                      rememberMe
                        ? "border-white/40 bg-white/20"
                        : "border-white/[0.12] bg-white/[0.04]"
                    }`}
                  >
                    {rememberMe && (
                      <svg
                        className="absolute inset-0 m-auto h-2.5 w-2.5 text-white"
                        fill="none"
                        viewBox="0 0 10 10"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <polyline points="1.5,5 4,7.5 8.5,2" />
                      </svg>
                    )}
                  </div>
                  <span
                    onClick={() => setRememberMe((v) => !v)}
                    className="text-xs text-white/40 transition hover:text-white/60"
                  >
                    {t("auth.rememberMe")}
                  </span>
                </label>

                <Link
                  href="/reset"
                  className="text-xs text-white/30 underline underline-offset-2 transition hover:text-white/60"
                >
                  {t("auth.forgotPassword")}
                </Link>
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
                    {t("auth.loggingIn")}
                  </span>
                ) : (
                  t("auth.login")
                )}
              </motion.button>

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