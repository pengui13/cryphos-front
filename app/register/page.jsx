"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signUp } from "../api/ApiWrapper";
import { motion, AnimatePresence } from "framer-motion";
import SleekSnackbar from "../components/Snackbar";
export default function Register() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarData, setSnackbarData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setSnackbarData({
        visible: true,
        status: "error",
        info: "Passwords do not match",
      });
      return;
    }

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setSnackbarData({
        visible: true,
        status: "error",
        info: "Please fill in all fields",
      });
      return;
    }

    setLoading(true);

    try {
      await signUp({
        username: fullName,
        email,
        password,
        password2: confirmPassword,
      });

      setSnackbarData({
        visible: true,
        status: "success",
        info: "Account created successfully! Redirecting to login...",
      });

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      let errorMessage = "Registration failed";

      if (err.data && typeof err.data === "object") {
        const messages = Object.entries(err.data)
          .map(([f, msgs]) => `${f}: ${msgs.join(" ")}`)
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

  const handleKeyPress = (e, isLastField = false) => {
    if (e.key === "Enter") {
      if (isLastField) {
        handleSubmit(e);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-[#0d0019] to-black text-gray-100 overflow-hidden">
      {/* Cosmic Background */}
      <div className="planet planet-1" />
      <div className="planet planet-2" />
      <div className="planet planet-3" />
      <div className="blur-background" />

      <div className="relative z-10 w-full max-w-md mx-auto pt-8">
        <div className="mt-12 bg-log-bkg/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            Create Account
          </h2>
          <p className="text-white/60 text-sm mb-6 text-center">
            Start your professional trading journey
          </p>

          <div className="space-y-4">
            {[
              {
                label: "Full Name",
                value: fullName,
                setter: setFullName,
                type: "text",
                placeholder: "John Doe",
              },
              {
                label: "Email",
                value: email,
                setter: setEmail,
                type: "email",
                placeholder: "you@example.com",
              },
              {
                label: "Password",
                value: password,
                setter: setPassword,
                type: "password",
                placeholder: "••••••••",
              },
              {
                label: "Confirm Password",
                value: confirmPassword,
                setter: setConfirmPassword,
                type: "password",
                placeholder: "••••••••",
                isLast: true,
              },
            ].map(({ label, value, setter, type, placeholder, isLast }) => (
              <div key={label} className="space-y-1">
                <label className="text-white/80 text-sm font-medium">
                  {label}
                </label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, isLast)}
                  placeholder={placeholder}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-[#e3b8ff]/30 focus:border-[#e3b8ff]/50 transition"
                />
              </div>
            ))}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 mt-2 font-bold rounded-2xl bg-gradient-to-r from-[#e3b8ff] to-[#6a2e8e] text-black hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>

          <p className="mt-6 text-center text-white/60 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-[#e3b8ff] hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>

      {/* Snackbar */}
      <SleekSnackbar data={snackbarData} onClose={handleSnackbarClose} />

      <style jsx>{`
        .planet {
          position: absolute;
          border-radius: 50%;
          opacity: 0.6;
          z-index: 0;
          animation: drift 6s ease-in-out infinite;
        }
        .planet-1 {
          width: 100px;
          height: 100px;
          top: 10%;
          left: 5%;
          background: radial-gradient(circle, #310447, #53266e);
        }
        .planet-2 {
          width: 150px;
          height: 150px;
          top: 60%;
          left: 75%;
          background: radial-gradient(circle, #e3b8ff, #6a2e8e);
        }
        .planet-3 {
          width: 80px;
          height: 80px;
          top: 75%;
          left: 45%;
          background: radial-gradient(circle, #411664, #350952);
        }
        .blur-background {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
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
