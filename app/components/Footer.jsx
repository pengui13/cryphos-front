"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Top Section */}
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:items-start">
          {/* Logo + Description */}
          <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Cryphos"
                width={40}
                height={40}
                className="rounded-lg opacity-90"
              />
              <Link href="/" className="text-xl font-bold tracking-tight text-white transition hover:text-white/80">
                Cryphos
              </Link>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-white/50">
              Automated crypto analytics & trading strategy builder.
              Backtests, alerts, automation — all in one platform.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-12 text-sm">
            {/* Navigation */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Navigation</h4>
              <ul className="space-y-2 text-white/50">
                <li>
                  <Link href="/" className="transition hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/bots" className="transition hover:text-white">
                    Bots
                  </Link>
                </li>
                <li>
                  <Link href="/lab" className="transition hover:text-white">
                    Bot Factory
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="transition hover:text-white">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Legal</h4>
              <ul className="space-y-2 text-white/50">
                <li>
                  <Link href="/impressum" className="transition hover:text-white">
                    Legal Notice
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="transition hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="transition hover:text-white">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Cryphos. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}