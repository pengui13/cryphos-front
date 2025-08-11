"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "../api/ApiWrapper";
import "../globals.css";
import SleekSnackbar from "../components/Snackbar";
import Header from "../Header";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarData, setSnackbarData] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
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
        info: "Login successful! Redirecting...",
      });
      setTimeout(() => {
        router.push("/lab");
      }, 1000);
    } catch (err) {
      let errorMessage = "Login failed";

      if (err.data && typeof err.data === "object") {
        const messages = Object.entries(err.data)
          .map(([field, msgs]) => `${field}: ${msgs.join(" ")}`)
          .join(" • ");
        errorMessage = messages;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setSnackbarData({
        visible: true,
        status: "error",
        info: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarData(null);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-[#0d0019] to-black text-gray-100 flex flex-col items-center">
      {/* Animated Planets & Blur Background */}
      <div className="planet planet-1" />
      <div className="planet planet-2" />
      <div className="planet planet-3" />
      <div className="blur-background" />

      <div className="relative z-10 w-full max-w-md mx-auto px-6 pt-16">
        <div className="mt-12 bg-log-bkg/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Sign In
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-white/80 text-sm font-medium">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-[#e3b8ff]/50 focus:ring-1 focus:ring-[#e3b8ff]/20 focus:bg-white/10 transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-white/80 text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyPress={(e) => e.key === "Enter" && handleLogin(e)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-[#e3b8ff]/50 focus:ring-1 focus:ring-[#e3b8ff]/20 focus:bg-white/10 transition"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r bg-primary text-log-bkg hover:scale-105 transition disabled:opacity-50"
            >
              {loading ? "Logging In..." : "Log In"}
            </button>
          </div>

          <p className="mt-6 text-center text-white/60 text-sm">
            New here?{" "}
            <a href="/register" className="text-[#e3b8ff] hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </div>

      {/* Snackbar */}
      <SleekSnackbar data={snackbarData} onClose={handleSnackbarClose} />

      {/* Planet & Blur styles */}
      <style jsx>{`
        .planet {
          position: absolute;
          border-radius: 50%;
          z-index: 0;
          animation: drift 6s ease-in-out infinite;
        }
        .planet-1 {
          width: 100px;
          height: 100px;
          top: 20%;
          left: 10%;
          background: radial-gradient(circle, #310447, #53266e);
        }
        .planet-2 {
          width: 150px;
          height: 150px;
          top: 60%;
          left: 70%;
          background: radial-gradient(circle, #e3b8ff, #6a2e8e);
        }
        .planet-3 {
          width: 80px;
          height: 80px;
          top: 75%;
          left: 50%;
          background: radial-gradient(circle, #411664, #350952);
        }
        .blur-background {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 1;
        }
        @keyframes drift {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
