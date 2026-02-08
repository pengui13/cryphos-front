"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signIn } from "../api/ApiWrapper";
import SleekSnackbar from "../components/Snackbar";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarData, setSnackbarData] = useState(null);

  const handleLogin = async (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setSnackbarData({
        visible: true,
        status: "error",
        info: "Please enter both email and password",
      });
      return;
    }

    setLoading(true);
    try {
      await signIn({ email, password });
      setSnackbarData({
        visible: true,
        status: "success",
        info: "Login successful! Redirecting…",
      });
      window.location.href = "/lab";
    } catch (err) {
      let errorMessage = "Login failed";
      if (err && err.data && typeof err.data === "object") {
        const messages = Object.entries(err.data)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(" ") : String(msgs)}`)
          .join(" • ");
        errorMessage = messages || errorMessage;
      } else if (err && err.message) {
        errorMessage = err.message;
      }
      setSnackbarData({ visible: true, status: "error", info: errorMessage });
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
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 py-16">
        <div className="grid w-full grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          
          {/* Left side - Marketing */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block"
          >
            <div className="mb-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-white/80">Trading Intelligence</span>
              </div>
              <h1 className="mb-6 bg-gradient-to-br from-white to-white/60 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
                Welcome back to Cryphos
              </h1>
              <p className="text-xl text-white/60">
                Your automated trading signals are waiting. Monitor markets 24/7 with AI-powered insights.
              </p>
            </div>

            {/* Feature cards */}
            <div className="space-y-4">
              {[
                { icon: TrendingUp, title: "Real-time Signals", desc: "Get instant alerts for market opportunities" },
                { icon: Sparkles, title: "Custom Indicators", desc: "Build strategies with RSI, MACD, and more" },
                { icon: ArrowRight, title: "24/7 Monitoring", desc: "Never miss a trading opportunity" },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-xl"
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
          </motion.div>

          {/* Right side - Login Form */}
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
                  <h2 className="mb-2 text-3xl font-bold tracking-tight">Sign in</h2>
                  <p className="text-white/60">
                    New here?{" "}
                    <Link href="/register" className="text-purple-400 transition hover:text-purple-300">
                      Create an account
                    </Link>
                  </p>
                </header>

                <form className="space-y-6" onSubmit={handleLogin} noValidate>
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/80">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-purple-500/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label htmlFor="password" className="block text-sm font-medium text-white/80">
                        Password
                      </label>
                      <button
                        type="button"
                        className="text-xs text-white/50 transition hover:text-white/80"
                        onClick={() => setShowPw((v) => !v)}
                      >
                        {showPw ? "Hide" : "Show"}
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
                        Logging in...
                      </span>
                    ) : (
                      "Log in"
                    )}
                  </motion.button>

                  {/* Footer Links */}
                  <div className="flex items-center justify-between border-t border-white/10 pt-6 text-sm">
                    <Link href="/" className="text-white/60 transition hover:text-white/80">
                      ← Back to website
                    </Link>
                    <Link href="/reset" className="text-purple-400 transition hover:text-purple-300">
                      Forgot password?
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