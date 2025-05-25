"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // or 'next/router' if you’re on pages/
import { signUp } from "../api/ApiWrapper";

export default function Register() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
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
      router.push("/login");
    } catch (err) {
      // handle DRF error shape { field: [msgs...] }
      if (err.data && typeof err.data === "object") {
        const messages = Object.entries(err.data)
          .map(([field, msgs]) => `${field}: ${msgs.join(" ")}`)
          .join(" • ");
        setError(messages);
      } else {
        setError(err.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full items-start pt-[200px] justify-center h-screen bg-gradient-to-r from-[#0a1620] to-black overflow-hidden">
      {/* Left: Mascot & Text */}
      <div className="relative w-[500px] flex items-center justify-center p-8">
        <div className="max-w-sm text-white text-center md:text-left">
          <h1 className="text-4xl font-bold mb-4">Join Cryphos</h1>
          <p className="mb-6 text-white font-semibold">
            Become part of our crypto bot & news community! Access advanced
            trading tools, real-time news, and exclusive academy tutorials.
          </p>
          <Image
            src="/mascot-logo.png"
            alt="Cryphos Mascot"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>
      </div>

      {/* Right: Registration Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg text-white">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Create an Account
          </h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium mb-1"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full px-4 py-2 bg-transparent border border-gray-400 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-root-green focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2 bg-transparent border border-gray-400 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-root-green focus:border-transparent"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 bg-transparent border border-gray-400 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-root-green focus:border-transparent"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 bg-transparent border border-gray-400 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-root-green focus:border-transparent"
              />
            </div>

            {/* Error Message */}
            {error && <p className="text-sm text-red-400">{error}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-root-green rounded-md font-semibold hover:bg-green-600 transition disabled:opacity-50"
            >
              {loading ? "Signing Up…" : "Sign Up"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-300">
            Already have an account?{" "}
            <a href="/login" className="text-root-green hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
