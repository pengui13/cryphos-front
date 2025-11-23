"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

/* ---------- utils ---------- */
const cx = (...a) => a.filter(Boolean).join(" ");

/* ---------- nav link with solid underline ---------- */
function FancyNavLink({ href, label, onClick, active = false }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cx(
        "relative inline-flex items-center text-sm font-semibold",
        active ? "text-white" : "text-white/80 hover:text-white"
      )}
    >
      {label}
      {/* solid underline that grows from left */}
      <span
        className={cx(
          "pointer-events-none absolute -bottom-[6px] left-0 h-[2px] w-full origin-left scale-x-0 transform transition-transform duration-200 ease-out",
          "bg-white/70",
          active ? "scale-x-100" : "group-hover:scale-x-100"
        )}
      />
    </Link>
  );
}

export default function Header({ ping }) {
  const pathname = usePathname();
  const [confirming, setConfirming] = useState(false);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    document.cookie = "access=; path=/; max-age=0; secure; samesite=strict";
    document.cookie = "refresh=; path=/; max-age=0; secure; samesite=strict";
    window.location.href = "/login";
  };

  const closeAnd = (fn) => () => {
    setOpen(false);
    if (typeof fn === "function") fn();
  };

  const nav = useMemo(
    () => [
      { href: "/lab", label: "Lab" },
      { href: "/bots", label: "Bots" },
    ],
    []
  );

  const DesktopAuth = () =>
    !ping ? (
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-sm font-semibold text-white/90 hover:text-white"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Sign Up
        </Link>
      </div>
    ) : !confirming ? (
      <button
        onClick={() => setConfirming(true)}
        className="inline-flex items-center rounded-lg bg-[#222228] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0"
      >
        Log Out
      </button>
    ) : (
      <div className="flex items-center gap-2">
        <button
          onClick={handleLogout}
          className="px-3 py-2 text-sm font-semibold rounded-lg bg-white text-black hover:bg-white/90 transition"
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
    );

  const MobileAuth = () =>
    !ping ? (
      <div className="flex flex-col gap-3">
        <Link
          href="/login"
          onClick={closeAnd()}
          className="text-sm font-semibold text-white/90 hover:text-white"
        >
          Log in
        </Link>
        <Link
          href="/register"
          onClick={closeAnd()}
          className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Sign Up
        </Link>
      </div>
    ) : !confirming ? (
      <button
        onClick={closeAnd(() => setConfirming(true))}
        className="inline-flex w-full items-center justify-center rounded-lg bg-[#222228] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0"
      >
        Log Out
      </button>
    ) : (
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={closeAnd(handleLogout)}
          className="flex-1 px-3 py-2 text-sm font-semibold rounded-lg bg-white text-black hover:bg-white/90 transition"
        >
          Yes
        </button>
        <button
          onClick={closeAnd(() => setConfirming(false))}
          className="flex-1 px-3 py-2 text-sm font-medium rounded-lg border border-white/20 text-white hover:bg-white/10 transition"
        >
          Cancel
        </button>
      </div>
    );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0f1115]/70 backdrop-blur supports-[backdrop-filter]:bg-[#0f1115]/60">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6 py-3">
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
          <span className="text-lg font-semibold tracking-tight text-white">
            Cryphos
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {nav.map((n) => (
            <div key={n.href} className="group">
              <FancyNavLink
                href={n.href}
                label={n.label}
                active={pathname === n.href}
              />
            </div>
          ))}
        </nav>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-4">
          <DesktopAuth />
        </div>

        {/* Mobile: hamburger */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-white/85 hover:text-white hover:bg-white/10 transition"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile sheet */}
      <div
        className={cx(
          "md:hidden border-t border-white/10 bg-[#0f1115]/90 backdrop-blur px-4 sm:px-6 overflow-hidden transition-[max-height,opacity] duration-250 ease-out",
          open ? "max-h-96 opacity-100 py-3" : "max-h-0 opacity-0 py-0"
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col gap-4">
          {nav.map((n) => (
            <FancyNavLink
              key={n.href}
              href={n.href}
              label={n.label}
              onClick={closeAnd()}
              active={pathname === n.href}
            />
          ))}
          <div className="h-px w-full bg-white/10" />
          <MobileAuth />
        </div>
      </div>
    </header>
  );
}
