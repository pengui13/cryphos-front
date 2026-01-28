"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0B0B12]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">

        {/* TOP SECTION */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-10">

          {/* LOGO + TEXT WRAPPER */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 max-w-md text-center sm:text-left">

            {/* CLICKABLE LOGO */}
            <Link href="/" className="shrink-0">
              <Image
                src="/logo.png"
                alt="Cryphos Logo"
                width={60}
                height={60}
                className="opacity-90 hover:opacity-100 transition cursor-pointer"
                priority
              />
            </Link>

            {/* TEXT */}
            <div>
              <Link href="/" className="hover:text-indigo-300 transition cursor-pointer">
                <h3 className="text-lg font-semibold tracking-tight">Cryphos</h3>
              </Link>

              <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                Automated crypto analytics & trading strategy builder.
                <span className="hidden sm:inline"><br /></span>
                <span className="sm:hidden"> </span>
                Backtests, alerts, automation — all in one platform.
              </p>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="grid grid-cols-2 gap-6 sm:gap-8 text-sm w-full sm:w-auto max-w-xs sm:max-w-none">

            <div className="space-y-3">
              <h4 className="text-slate-300 font-medium text-sm tracking-wide">
                Navigation
              </h4>

              <ul className="space-y-2 text-slate-400">
                <li><Link href="/" className="hover:text-indigo-300 transition">Home</Link></li>
                <li><Link href="/bots" className="hover:text-indigo-300 transition">Bots</Link></li>
                <li><Link href="/lab" className="hover:text-indigo-300 transition">Bot Factory</Link></li>
                <li><Link href="/pricing" className="hover:text-indigo-300 transition">Pricing</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-slate-300 font-medium text-sm tracking-wide">
                Legal
              </h4>

              <ul className="space-y-2 text-slate-400">
                <li><Link href="/impressum" className="hover:text-indigo-300 transition">Legal Notice</Link></li>
                <li><Link href="/privacy" className="hover:text-indigo-300 transition">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-indigo-300 transition">Terms</Link></li>
              </ul>
            </div>
          </div>

        </div>

        {/* BOTTOM LINE */}
        <div className="mt-8 sm:mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Cryphos. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}