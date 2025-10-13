"use client";
import Image from "next/image";
import Link from "next/link";
import { GetPing } from "./api/ApiWrapper";
import { useEffect, useState } from "react";

export default function Header() {
  const [ping, setPing] = useState(false);

  useEffect(() => {
    GetPing(setPing);
  }, []);

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
        {!ping && (
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-white/90 hover:text-[#e3b8ff] transition-colors"
            >
              Log in
            </Link>

            {/* Solid (no gradient) CTA */}
            <Link
              href="/register"
              className="inline-flex items-center rounded-xl bg-[#e3b8ff] px-4 py-2 text-sm font-semibold text-black shadow-[0_10px_28px_-14px_rgba(227,184,255,0.7)] transition-[transform,box-shadow,background-color] hover:-translate-y-0.5 hover:bg-[#d7a8ff] focus-visible:outline-none focus-visible:ring focus-visible:ring-[#e3b8ff]/50 active:translate-y-0"
            >
              Sign Up
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
