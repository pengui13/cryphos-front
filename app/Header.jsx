"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, FlaskConical, Bot, Settings as SettingsIcon, LogOut, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "./LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

function NavItem({ href, label, icon: Icon, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
        active ? "text-white" : "text-white/60 hover:text-white hover:bg-white/5"
      }`}
    >
      {Icon && <Icon className={`h-4 w-4 ${active ? "text-white" : "text-white/50"}`} />}
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
  const { t } = useLang();

  const nav = [
    { href: "/lab", label: t("nav.lab"), icon: FlaskConical },
    { href: "/bots", label: t("nav.bots"), icon: Bot },
    { href: "/analytics", label: t("nav.analytics"), icon: BarChart3 },
    { href: "/settings", label: t("nav.settings"), icon: SettingsIcon },
  ];

  const handleLogout = () => {
    document.cookie = "access=; path=/; max-age=0;";
    document.cookie = "refresh=; path=/; max-age=0;";
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <Image
            src="/logo.png"
            width={32}
            height={32}
            alt="Cryphos"
            className="rounded-lg transition-transform group-hover:scale-105"
            priority
          />
          <span className="text-lg font-bold tracking-tight text-white">Cryphos</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => (
            <NavItem key={n.href} href={n.href} label={n.label} icon={n.icon} active={pathname === n.href} />
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher />

          {!ping ? (
            <>
              <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-white/60 transition hover:text-white">
                {t("auth.login")}
              </Link>
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  {t("auth.signup")}
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
              {t("auth.logout")}
            </motion.button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/50">{t("auth.logoutConfirm")}</span>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="rounded-xl bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 ring-1 ring-red-500/20 transition hover:bg-red-500/20"
              >
                {t("auth.logoutYes").replace("Так, вийти", "Так").replace("Да, выйти", "Да").replace("Ja, abmelden", "Ja").replace("Sí, salir", "Sí").replace("Yes, log out", "Yes")}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLogoutConfirm(false)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
              >
                {t("auth.cancel")}
              </motion.button>
            </div>
          )}
        </div>

        {/* Mobile: lang switcher + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
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
                    {t("auth.login")}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex w-full items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black"
                  >
                    {t("auth.signup")}
                  </Link>
                </div>
              ) : !logoutConfirm ? (
                <button
                  onClick={() => setLogoutConfirm(true)}
                  className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80"
                >
                  <LogOut className="h-4 w-4" />
                  {t("auth.logout")}
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="px-2 text-sm text-white/50">{t("auth.logoutConfirmLong")}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="flex-1 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 ring-1 ring-red-500/20"
                    >
                      {t("auth.logoutYes")}
                    </button>
                    <button
                      onClick={() => setLogoutConfirm(false)}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80"
                    >
                      {t("auth.cancel")}
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