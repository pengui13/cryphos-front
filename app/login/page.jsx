"use client";
import React from "react";
import Image from "next/image";

export default function Login() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#04090D]">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/owl.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* dark + blur overlay */}
      <div className="absolute inset-0 bg-[#0c1b4db2] backdrop-blur-xs mix-blend-overlay pointer-events-none" />

      {/* login card */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg text-white">
          {/* logo */}
          <div className="flex justify-center mb-6">
            <Image src="/logo.png" width={48} height={48} alt="Cryphos logo" />
          </div>

          <h2 className="text-3xl font-semibold text-center mb-8">
            Sign in to Cryphos
          </h2>

          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 bg-transparent border border-gray-400 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-root-green focus:border-transparent"
              />
            </div>

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
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-transparent border border-gray-400 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-root-green focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-root-green focus:ring-root-green rounded"
                />
                <span>Remember me</span>
              </label>
              <a
                href="/forgot-password"
                className="text-root-green hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-root-green rounded-md font-semibold hover:bg-green-600 transition"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-300">
            Don’t have an account?{" "}
            <a href="/register" className="text-root-green hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
