"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "../LanguageContext";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="relative border-t border-white/[0.06] bg-bkg">
      {/* A single bright hairline at the very top edge separates the footer
          from the page without adding another heavy border. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16">

        <div className="flex flex-col items-center justify-between gap-10 sm:flex-row sm:items-start">

          {/* Logo + tagline */}
          <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="Cryphos"
                width={28}
                height={28}
                className="rounded-md opacity-90"
              />
              <Link href="/" className="text-base font-semibold tracking-tight text-white/80 transition hover:text-white">
                Cryphos
              </Link>
            </div>
            <p className="max-w-[280px] text-xs leading-relaxed text-white/35">
              {t?.("footer.tagline") ?? "Automated crypto analytics & trading strategy builder. Backtests, alerts, automation — all in one platform."}
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-10 text-xs">

            <div className="space-y-3">
              <h4 className="font-medium uppercase tracking-widest text-white/25">
                {t?.("footer.navTitle") ?? "Navigation"}
              </h4>
              <ul className="space-y-2.5 text-white/45">
                {[
                  { href: "/",       label: t?.("footer.home")       ?? "Home"        },
                  { href: "/bots",   label: t?.("footer.bots")       ?? "Bots"        },
                  { href: "/lab",    label: t?.("footer.lab")        ?? "Bot Factory" },
                  { href: "/pricing",label: t?.("footer.pricing")    ?? "Pricing"     },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="transition-colors hover:text-white">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium uppercase tracking-widest text-white/25">
                {t?.("footer.legalTitle") ?? "Legal"}
              </h4>
              <ul className="space-y-2.5 text-white/45">
                {[
                  { href: "/impressum", label: t?.("footer.legalNotice") ?? "Legal Notice" },
                  { href: "/privacy",   label: t?.("footer.privacy")     ?? "Privacy"      },
                  { href: "/terms",     label: t?.("footer.terms")       ?? "Terms"        },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="transition-colors hover:text-white">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        <div className="mt-12 border-t border-white/[0.06] pt-6 text-center">
          <p className="text-[11px] text-white/25">
            © {new Date().getFullYear()} Cryphos. {t?.("footer.rights") ?? "All rights reserved."}
          </p>
        </div>

      </div>
    </footer>
  );
}