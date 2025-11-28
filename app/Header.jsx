"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const cx = (...a) => a.filter(Boolean).join(" ");

function NavItem({ href, label, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cx(
        "relative px-1 text-sm font-medium transition-colors",
        active ? "text-white" : "text-white/70 hover:text-white"
      )}
    >
      {label}

      {/** underline */}
      <span
        className={cx(
          "absolute left-0 -bottom-1 h-[2px] w-full rounded-full transition-all duration-200",
          active ? "bg-white opacity-80" : "bg-white/40 scale-x-0 group-hover:scale-x-100"
        )}
      />
    </Link>
  );
}

/* ---------- BUTTONS ---------- */

function PrimaryBtn({ children, href, onClick }) {
  const common =
    "inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold shadow " +
    "bg-gradient-to-br from-[#d9a8ff] to-[#b084ff] text-black " +
    "hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0 transition";

  return href ? (
    <Link href={href} onClick={onClick} className={common}>
      {children}
    </Link>
  ) : (
    <button onClick={onClick} className={common}>
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold 
                 border border-white/15 text-white hover:bg-white/10 transition"
    >
      {children}
    </button>
  );
}

/* ---------------------------------------------------------------- */

export default function Header({ ping }) {
  const pathname = usePathname();
  const [confirming, setConfirming] = useState(false);
  const [open, setOpen] = useState(false);

  const nav = useMemo(
    () => [
      { href: "/lab", label: "Lab" },
      { href: "/bots", label: "Bots" },
    ],
    []
  );

  const closeAnd = (fn) => () => {
    setOpen(false);
    if (typeof fn === "function") fn();
  };

  const handleLogout = () => {
    document.cookie = "access=; path=/; max-age=0;";
    document.cookie = "refresh=; path=/; max-age=0;";
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 
                      bg-[#0f1115]/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 py-3">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/logo.png"
            width={28}
            height={28}
            alt="Cryphos"
            className="rounded-md opacity-95 hover:opacity-100 transition"
            priority
          />
          <span className="text-lg font-semibold tracking-tight text-white">
            Cryphos
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8">
          {nav.map((n) => (
            <div key={n.href} className="group relative">
              <NavItem
                href={n.href}
                label={n.label}
                active={pathname === n.href}
              />
            </div>
          ))}
        </nav>

        {/* DESKTOP AUTH */}
        <div className="hidden md:flex items-center gap-4">
          {!ping ? (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-white/80 hover:text-white transition"
              >
                Log in
              </Link>
              <PrimaryBtn href="/register">Sign Up</PrimaryBtn>
            </>
          ) : !confirming ? (
            <GhostBtn onClick={() => setConfirming(true)}>Log Out</GhostBtn>
          ) : (
            <div className="flex items-center gap-2">
              <PrimaryBtn onClick={handleLogout}>Yes</PrimaryBtn>
              <GhostBtn onClick={() => setConfirming(false)}>Cancel</GhostBtn>
            </div>
          )}
        </div>

        {/* MOBILE: Hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden rounded-xl p-2 text-white/80 hover:text-white hover:bg-white/10 transition"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={cx(
          "md:hidden overflow-hidden border-t border-white/10 " +
            "bg-[#0f1115]/90 backdrop-blur-xl transition-all duration-300",
          open ? "max-h-96 opacity-100 py-4 px-4" : "max-h-0 opacity-0 py-0 px-4"
        )}
      >
        <div className="flex flex-col gap-4">

          {nav.map((n) => (
            <NavItem
              key={n.href}
              href={n.href}
              label={n.label}
              active={pathname === n.href}
              onClick={closeAnd()}
            />
          ))}

          <div className="h-px bg-white/10" />

          {/* mobile auth */}
          {!ping ? (
            <div className="flex flex-col gap-4">
              <Link
                href="/login"
                onClick={closeAnd()}
                className="text-sm font-medium text-white/80 hover:text-white"
              >
                Log in
              </Link>
              <PrimaryBtn href="/register" onClick={closeAnd()}>
                Sign Up
              </PrimaryBtn>
            </div>
          ) : !confirming ? (
            <GhostBtn onClick={closeAnd(() => setConfirming(true))}>
              Log Out
            </GhostBtn>
          ) : (
            <div className="flex gap-3">
              <PrimaryBtn onClick={closeAnd(handleLogout)}>Yes</PrimaryBtn>
              <GhostBtn onClick={closeAnd(() => setConfirming(false))}>
                Cancel
              </GhostBtn>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
