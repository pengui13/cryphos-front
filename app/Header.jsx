"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header({ ping }) {
  const [confirming, setConfirming] = useState(false);

  const handleLogout = () => {
    // Delete cookies
    document.cookie = "access=; path=/; max-age=0; secure; samesite=strict";
    document.cookie = "refresh=; path=/; max-age=0; secure; samesite=strict";
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0f1115]/70 backdrop-blur supports-[backdrop-filter]:bg-[#0f1115]/60">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/logo.png"
            width={36}
            height={36}
            alt="Cryphos"
            priority
            className="rounded-md"
          />
          <span className="text-lg font-semibold tracking-tight text-white group-hover:text-[#e3b8ff] transition-colors">
            Cryphos
          </span>
        </Link>

        {/* Right side */}
        <nav className="flex items-center gap-4">
          <Link
            href="/lab"
            className="text-sm font-semibold text-white/80 hover:text-[#e3b8ff] transition-colors"
          >
            Lab
          </Link>

          {!ping ? (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-white/90 hover:text-[#e3b8ff] transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center rounded-xl bg-[#e3b8ff] px-4 py-2 text-sm font-semibold text-black shadow-[0_10px_28px_-14px_rgba(227,184,255,0.7)] transition-[transform,box-shadow,background-color] hover:-translate-y-0.5 hover:bg-[#d7a8ff] focus-visible:outline-none focus-visible:ring focus-visible:ring-[#e3b8ff]/50 active:translate-y-0"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {!confirming ? (
                <button
                  onClick={() => setConfirming(true)}
                  className="inline-flex items-center rounded-xl bg-[#6a2e8e] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_28px_-14px_rgba(106,46,142,0.7)] transition-[transform,box-shadow,background-color] hover:-translate-y-0.5 hover:bg-[#5a237d] focus-visible:outline-none focus-visible:ring focus-visible:ring-[#e3b8ff]/50 active:translate-y-0"
                >
                  Log Out
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-sm font-semibold rounded-lg bg-[#e3b8ff] text-black hover:bg-[#d7a8ff] transition"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setConfirming(false)}
                    className="px-3 py-2 text-sm font-medium rounded-lg border border-white/20 text-white hover:bg-white/10 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
