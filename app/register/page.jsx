"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, Zap, Shield, ArrowRight } from "lucide-react";
import SleekSnackbar from "../components/Snackbar";
import { BASE_URL } from "../api/ApiWrapper";

function PasswordStrength({ value = "" }) {
  const len = value.length;
  const variety =
    /[a-z]/.test(value) + /[A-Z]/.test(value) + /\d/.test(value) + /[^A-Za-z0-9]/.test(value);
  const score = Math.min(1, (len > 7 ? 0.5 : len / 16) + (variety - 1) * 0.17);
  
  const getColor = () => {
    if (score < 0.3) return "bg-red-500";
    if (score < 0.6) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="mt-2">
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className={`h-full rounded-full transition-colors ${getColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.round(score * 100)}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      {value && (
        <p className="mt-1 text-xs text-white/50">
          {score < 0.3 ? "Weak" : score < 0.6 ? "Medium" : "Strong"} password
        </p>
      )}
    </div>
  );
}

export default function Register() {
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

      document.cookie = `access=${data.access}; path=/; max-age=${60 * 60 * 24 * 7}`;
      document.cookie = `refresh=${data.refresh}; path=/; max-age=${60 * 60 * 24 * 30}`;

      setSnackbarData({ visible: true, status: "success", info: "Account created! Redirecting…" });
      setTimeout(() => {
        window.location.href = "/lab";
      }, 800);
    } catch (err) {
      showError(err, "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black" />
      
      {/* Animated gradient orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-purple-500/20 blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-[120px] animate-pulse delay-500" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-pink-500/20 blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 py-16">
        <div className="grid w-full grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          
          {/* Left side - Marketing */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block space-y-8"
          >
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-white/80">Start Trading Smarter</span>
              </div>
              <h1 className="mb-6 bg-gradient-to-br from-white to-white/60 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
                Join Cryphos Today
              </h1>
              <p className="text-xl text-white/60">
                Build custom trading bots, get real-time signals, and never miss an opportunity.
              </p>
            </div>

            {/* Feature grid */}
            <div className="grid gap-4">
              {[
                { icon: Zap, title: "Instant Signals", desc: "Real-time alerts for every market move" },
                { icon: TrendingUp, title: "Custom Strategies", desc: "Build bots with your favorite indicators" },
                { icon: Shield, title: "24/7 Monitoring", desc: "Automated tracking, even while you sleep" },
                { icon: ArrowRight, title: "Easy Setup", desc: "Start trading in under 5 minutes" },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-xl transition hover:bg-white/[0.04]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5">
                    <feature.icon className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-white/60">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social proof */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-black bg-gradient-to-br from-purple-400 to-pink-400" />
                  ))}
                </div>
                <span className="text-sm text-white/60">+1,200 traders</span>
              </div>
              <p className="text-sm text-white/80">
                "Cryphos helped me catch signals I would've missed. The custom bots are game-changing."
              </p>
              <p className="mt-2 text-xs text-white/50">— Alex M., Pro Trader</p>
            </div>
          </motion.div>

          {/* Right side - Register Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] blur-xl" />
              
              {/* Card */}
              <div className="relative rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent p-8 backdrop-blur-2xl">
                <header className="mb-8">
                  <h2 className="mb-2 text-3xl font-bold tracking-tight">Create your account</h2>
                  <p className="text-white/60">
                    Already have an account?{" "}
                    <Link href="/login" className="text-purple-400 transition hover:text-purple-300">
                      Log in
                    </Link>
                  </p>
                </header>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/80">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-purple-500/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="block text-sm font-medium text-white/80">Password</label>
                      <button
                        type="button"
                        className="text-xs text-white/50 transition hover:text-white/80"
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
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-purple-500/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-purple-500/20"
                    />
                    <PasswordStrength value={password} />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="block text-sm font-medium text-white/80">Confirm password</label>
                      <button
                        type="button"
                        className="text-xs text-white/50 transition hover:text-white/80"
                        onClick={() => setShowPw2((v) => !v)}
                      >
                        {showPw2 ? "Hide" : "Show"}
                      </button>
                    </div>
                    <input
                      type={showPw2 ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-purple-500/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-[0_12px_30px_-10px_rgba(168,85,247,0.4)] transition hover:shadow-[0_12px_30px_-5px_rgba(168,85,247,0.5)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                        Creating account...
                      </span>
                    ) : (
                      "Create account"
                    )}
                  </motion.button>

                  {/* Terms */}
                  <p className="text-center text-xs text-white/50">
                    By signing up you agree to our{" "}
                    <Link href="/terms" className="text-purple-400 hover:text-purple-300">
                      Terms
                    </Link>{" "}
                    &{" "}
                    <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                      Privacy
                    </Link>
                  </p>

                  {/* Back link */}
                  <div className="border-t border-white/10 pt-6 text-center">
                    <Link href="/" className="text-sm text-white/60 transition hover:text-white/80">
                      ← Back to website
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <SleekSnackbar data={snackbarData} onClose={() => setSnackbarData(null)} />
    </div>
  );
}