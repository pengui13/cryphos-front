"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "../LanguageContext";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="border-t border-white/[0.06] bg-[#080808]">
      <div className="mx-auto max-w-7xl px-6 py-12">

        <div className="flex flex-col items-center justify-between gap-10 sm:flex-row sm:items-start">

          {/* Logo + tagline */}
          <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="Cryphos"
                width={28}
                height={28}
                className="rounded-md opacity-80"
              />
              <Link href="/" className="text-base font-semibold tracking-tight text-white/80 transition hover:text-white">
                Cryphos
              </Link>
            </div>
            <p className="max-w-[260px] text-xs leading-relaxed text-white/30">
              {t?.("footer.tagline") ?? "Automated crypto analytics & trading strategy builder. Backtests, alerts, automation — all in one platform."}
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-10 text-xs">

            <div className="space-y-3">
              <h4 className="font-medium uppercase tracking-widest text-white/25">
                {t?.("footer.navTitle") ?? "Navigation"}
              </h4>
              <ul className="space-y-2.5 text-white/40">
                {[
                  { href: "/",       label: t?.("footer.home")       ?? "Home"        },
                  { href: "/bots",   label: t?.("footer.bots")       ?? "Bots"        },
                  { href: "/lab",    label: t?.("footer.lab")        ?? "Bot Factory" },
                  { href: "/pricing",label: t?.("footer.pricing")    ?? "Pricing"     },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="transition hover:text-white/80">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium uppercase tracking-widest text-white/25">
                {t?.("footer.legalTitle") ?? "Legal"}
              </h4>
              <ul className="space-y-2.5 text-white/40">
                {[
                  { href: "/impressum", label: t?.("footer.legalNotice") ?? "Legal Notice" },
                  { href: "/privacy",   label: t?.("footer.privacy")     ?? "Privacy"      },
                  { href: "/terms",     label: t?.("footer.terms")       ?? "Terms"        },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="transition hover:text-white/80">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        <div className="mt-10 border-t border-white/[0.06] pt-6 text-center">
          <p className="text-[11px] text-white/20">
            © {new Date().getFullYear()} Cryphos. {t?.("footer.rights") ?? "All rights reserved."}
          </p>
        </div>

      </div>
    </footer>
  );
}