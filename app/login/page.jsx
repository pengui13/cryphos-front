"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "../api/ApiWrapper";
import SleekSnackbar from "../components/Snackbar";
import Header from "../Header";

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

  const handleSnackbarClose = () => setSnackbarData(null);

  return (
    <div className="relative min-h-screen bg-[#0f1115] text-zinc-100">
      {/* Header */}


      <main className="mx-auto flex w-full max-w-6xl items-center justify-center px-6 py-14">
        <section className="w-full max-w-md">
          <div className="rounded-[28px] border border-white/10 bg-white/8 p-8 shadow-[0_10px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl">
            <header className="mb-8 text-center">
              <h1 className="text-[32px] font-extrabold tracking-tight">Sign in</h1>
              <p className="mt-1 text-white/70">
                New here?{" "}
                <Link href="/register" className="text-[#e3b8ff] underline-offset-4 hover:underline">
                  Create an account
                </Link>
              </p>
            </header>

            <form className="grid gap-5" onSubmit={handleLogin} noValidate>
              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1 block text-sm text-white/70">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-[#e3b8ff]/40 focus:ring-2 focus:ring-[#e3b8ff]/30"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm text-white/70">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs text-white/60 hover:text-white/80"
                    aria-label={showPw ? "Hide password" : "Show password"}
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
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-[#e3b8ff]/40 focus:ring-2 focus:ring-[#e3b8ff]/30"
                />
              </div>

              {/* CTA — solid (no gradient) */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-[#e3b8ff] px-6 py-3 font-semibold text-black shadow-[0_12px_30px_-10px_rgba(227,184,255,0.6)] transition-[transform,background,box-shadow] hover:-translate-y-0.5 hover:bg-[#d7a8ff] focus:outline-none focus-visible:ring focus-visible:ring-[#e3b8ff]/50 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in…" : "Log in"}
              </button>

              {/* Footer row (links) */}
              <div className="flex items-center justify-between text-sm pt-1">
                <Link href="/" className="text-white/60 hover:text-white/80">
                  Back to website
                </Link>
                <Link href="/reset" className="text-[#e3b8ff] hover:underline">
                  Forgot password?
                </Link>
              </div>
            </form>
          </div>
        </section>
      </main>

      <SleekSnackbar data={snackbarData} onClose={handleSnackbarClose} />
    </div>
  );
}
