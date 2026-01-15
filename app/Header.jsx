"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, FlaskConical, Bot, Settings, LogOut, ChevronRight } from "lucide-react";

const cx = (...a) => a.filter(Boolean).join(" ");

function NavItem({ href, label, icon: Icon, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cx(
        "group relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
        active
          ? "text-white bg-white/[0.08]"
          : "text-white/60 hover:text-white hover:bg-white/[0.05]"
      )}
    >
      {Icon && (
        <Icon
          className={cx(
            "h-4 w-4 transition-colors",
            active ? "text-violet-400" : "text-white/40 group-hover:text-white/60"
          )}
        />
      )}
      {label}

      {active && (
        <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
      )}
    </Link>
  );
}

function PrimaryBtn({ children, href, onClick }) {
  const common =
    "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold " +
    "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white " +
    "hover:from-violet-400 hover:to-fuchsia-400 " +
    "shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 " +
    "hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200";

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

function GhostBtn({ children, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium",
        "border transition-all duration-200",
        danger
          ? "border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/50"
          : "border-white/[0.1] text-white/80 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.15]"
      )}
    >
      {children}
    </button>
  );
}

export default function Header({ ping }) {
  const pathname = usePathname();
  const [confirming, setConfirming] = useState(false);
  const [open, setOpen] = useState(false);

  const nav = useMemo(
    () => [
      { href: "/lab", label: "Lab", icon: FlaskConical },
      { href: "/bots", label: "Bots", icon: Bot },
      { href: "/settings", label: "Settings", icon: Settings },
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
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-5 sm:px-6 h-16">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <Image
              src="/logo.png"
              width={32}
              height={32}
              alt="Cryphos"
              className="rounded-lg transition-transform duration-200 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Cryphos
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => (
            <NavItem
              key={n.href}
              href={n.href}
              label={n.label}
              icon={n.icon}
              active={pathname === n.href}
            />
          ))}
        </nav>

        {/* DESKTOP AUTH */}
        <div className="hidden md:flex items-center gap-3">
          {!ping ? (
            <>
              <Link
                href="/login"
                className="px-3 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <PrimaryBtn href="/register">
                Sign Up
                <ChevronRight className="h-4 w-4" />
              </PrimaryBtn>
            </>
          ) : !confirming ? (
            <GhostBtn onClick={() => setConfirming(true)}>
              <LogOut className="h-4 w-4" />
              Log Out
            </GhostBtn>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/50 mr-1">Sure?</span>
              <GhostBtn danger onClick={handleLogout}>Yes, log out</GhostBtn>
              <GhostBtn onClick={() => setConfirming(false)}>Cancel</GhostBtn>
            </div>
          )}
        </div>

        {/* MOBILE: Hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden flex items-center justify-center h-10 w-10 rounded-xl 
                     text-white/70 hover:text-white hover:bg-white/[0.06] 
                     transition-all duration-200"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={cx(
          "md:hidden overflow-hidden border-t border-white/[0.06]",
          "bg-[#0a0a0f]/95 backdrop-blur-xl transition-all duration-300 ease-out",
          open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="flex flex-col gap-1 p-4">

          {nav.map((n) => (
            <NavItem
              key={n.href}
              href={n.href}
              label={n.label}
              icon={n.icon}
              active={pathname === n.href}
              onClick={closeAnd()}
            />
          ))}

          <div className="h-px bg-white/[0.06] my-3" />

          {/* mobile auth */}
          {!ping ? (
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={closeAnd()}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <PrimaryBtn href="/register" onClick={closeAnd()}>
                Sign Up
                <ChevronRight className="h-4 w-4" />
              </PrimaryBtn>
            </div>
          ) : !confirming ? (
            <GhostBtn onClick={closeAnd(() => setConfirming(true))}>
              <LogOut className="h-4 w-4" />
              Log Out
            </GhostBtn>
          ) : (
            <div className="flex flex-col gap-2">
              <span className="text-sm text-white/50 px-1">Are you sure?</span>
              <div className="flex gap-2">
                <GhostBtn danger onClick={closeAnd(handleLogout)}>Yes, log out</GhostBtn>
                <GhostBtn onClick={closeAnd(() => setConfirming(false))}>Cancel</GhostBtn>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}