"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SleekSnackbar from "../components/Snackbar";
import {BASE_URL} from '../api/ApiWrapper'
const slides = [
  { src: "/hero-1.jpg", caption: "Capture alpha, not noise." },
  { src: "/hero-2.png", caption: "Clarity in every trend." },
  { src: "/hero-3.png", caption: "Signals, simplified." },
  { src: "/hero-4.png", caption: "Build your edge." },
];

function Carousel({ interval = 4500 }) {
  const [idx, setIdx] = useState(0);
  
  React.useEffect(() => {
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
          exit={{ opacity: 0.0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image src={slides[idx].src} alt="" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-[#b65fcf] mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115]/70 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-xl md:text-2xl font-semibold tracking-tight">{slides[idx].caption}</p>
            <div className="mt-3 flex gap-2">
              {slides.map((_, i) => (
                <span key={i} className={`h-1 w-8 rounded-full transition ${i === idx ? "bg-white/80" : "bg-white/25"}`} />
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
        style={{ width: `${Math.round(score * 100)}%`, background: "rgba(227,184,255,.9)" }}
      />
    </div>
  );
}

export default function Register() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [snackbarData, setSnackbarData] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v.trim());

  const showError = (err, fallback = "Something went wrong") => {
    let msg = fallback;
    console.error(err);
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
    setSnackbarData({ visible: true, status: "error", info: "Please fill in all fields" });
    return;
  }
  if (!emailOk(email)) {
    setSnackbarData({ visible: true, status: "error", info: "Please enter a valid email" });
    return;
  }
  if (password !== confirmPassword) {
    setSnackbarData({ visible: true, status: "error", info: "Passwords do not match" });
    return;
  }
  if (password.length < 6) {
    setSnackbarData({ visible: true, status: "error", info: "Password must be at least 6 characters" });
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
    
    if (!res.ok) {
      throw data || { detail: "Registration failed" };
    }

    // Set cookies and redirect
    document.cookie = `access=${data.access}; path=/; max-age=${60 * 60 * 24 * 7}`;
    document.cookie = `refresh=${data.refresh}; path=/; max-age=${60 * 60 * 24 * 30}`;

    setSnackbarData({ visible: true, status: "success", info: "Account created! Redirecting…" });
    setTimeout(() => {
      window.location.href = "/lab";  // or wherever you want
    }, 800);
  } catch (err) {
    showError(err, "Registration failed");
  } finally {
    setLoading(false);
  }
};

  const handleKeyDown = (e, isLast = false) => {
    if (e.key === "Enter" && isLast) {
      handleSubmit(e);
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
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h2 className="text-[22px] font-semibold tracking-tight">Trade with clarity</h2>
              <p className="mt-2 text-white/70">
                Build a strategy that fits you—then let Cryphos monitor markets 24/7 and deliver human-readable alerts.
              </p>
            </div>
          </div>

          {/* Right */}
          <motion.section
            initial={{ opacity: 0, y: 10, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="relative rounded-[28px] border border-white/10 bg-white/8 p-12 shadow-[0_10px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          >
            <header className="mb-8">
              <h1 className="text-[36px] font-extrabold tracking-tight">
                Create an account
              </h1>
              <p className="mt-1 text-white/70">
                Already have an account?{" "}
                <Link href="/login" className="text-[#e3b8ff] underline-offset-4 hover:underline">
                  Log in
                </Link>
              </p>
            </header>

            <form className="grid gap-7" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label className="mb-1 block text-sm text-white/70">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-[#e3b8ff]/40 focus:ring-2 focus:ring-[#e3b8ff]/30"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="block text-sm text-white/70">Password</label>
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
                  onKeyDown={(e) => handleKeyDown(e)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-[#e3b8ff]/40 focus:ring-2 focus:ring-[#e3b8ff]/30"
                />
                <Strength value={password} />
              </div>

              {/* Confirm Password */}
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, true)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-[#e3b8ff]/40 focus:ring-2 focus:ring-[#e3b8ff]/30"
                />
              </div>

              {/* CTA */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-[#e3b8ff] px-6 py-3 font-semibold text-black shadow-[0_12px_30px_-10px_rgba(227,184,255,0.6)] transition-[transform,background,box-shadow] hover:-translate-y-0.5 hover:bg-[#d7a8ff] focus:outline-none focus-visible:ring focus-visible:ring-[#e3b8ff]/50 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account…" : "Create account"}
              </button>

              {/* Terms row */}
              <div className="text-sm text-white/50 text-center">
                By signing up you agree to our{" "}
                <Link href="/terms" className="text-[#e3b8ff] hover:underline">Terms</Link>{" "}
                &{" "}
                <Link href="/privacy" className="text-[#e3b8ff] hover:underline">Privacy</Link>.
              </div>
            </form>
          </motion.section>
        </div>
      </div>

      <SleekSnackbar data={snackbarData} onClose={() => setSnackbarData(null)} />
    </div>
  );
}