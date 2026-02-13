"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, FlaskConical, Bot, Settings as SettingsIcon, LogOut, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function NavItem({ href, label, icon: Icon, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
        active
          ? "text-white"
          : "text-white/60 hover:text-white hover:bg-white/5"
      }`}
    >
      {Icon && (
        <Icon className={`h-4 w-4 ${active ? "text-white" : "text-white/50"}`} />
      )}
      {label}
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 -z-10 rounded-xl bg-white/10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </Link>
  );
}

export default function Header({ ping }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const nav = [
    { href: "/lab", label: "Lab", icon: FlaskConical },
    { href: "/bots", label: "Bots", icon: Bot },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: SettingsIcon },
  ];

  const handleLogout = () => {
    document.cookie = "access=; path=/; max-age=0;";
    document.cookie = "refresh=; path=/; max-age=0;";
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo.png"
            width={32}
            height={32}
            alt="Cryphos"
            className="rounded-lg transition-transform group-hover:scale-105"
            priority
          />
          <span className="text-lg font-bold tracking-tight text-white">
            Cryphos
          </span>
        </Link>

        {/* Desktop Nav */}
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

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {!ping ? (
            <>
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-white/60 transition hover:text-white"
              >
                Log in
              </Link>
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Sign Up
                </motion.button>
              </Link>
            </>
          ) : !logoutConfirm ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setLogoutConfirm(true)}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </motion.button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/50">Sure?</span>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="rounded-xl bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 ring-1 ring-red-500/20 transition hover:bg-red-500/20"
              >
                Yes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLogoutConfirm(false)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
              >
                Cancel
              </motion.button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white/70 transition hover:bg-white/5 hover:text-white md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-white/10 bg-black/95 backdrop-blur-xl md:hidden"
          >
            <div className="space-y-1 p-4">
              {nav.map((n) => (
                <NavItem
                  key={n.href}
                  href={n.href}
                  label={n.label}
                  icon={n.icon}
                  active={pathname === n.href}
                  onClick={() => setMobileOpen(false)}
                />
              ))}

              <div className="my-3 h-px bg-white/10" />

              {!ping ? (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white/60 transition hover:text-white"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex w-full items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : !logoutConfirm ? (
                <button
                  onClick={() => setLogoutConfirm(true)}
                  className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="px-2 text-sm text-white/50">Are you sure?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      className="flex-1 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 ring-1 ring-red-500/20"
                    >
                      Yes, log out
                    </button>
                    <button
                      onClick={() => setLogoutConfirm(false)}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}