"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { GetProfile } from "./api/ApiWrapper";
import {
  Menu,
  X,
  FlaskConical,
  Bot,
  Settings as SettingsIcon,
  LogOut,
  BarChart3,
  GraduationCap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "./LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

function NavItem({ href, label, icon: Icon, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative flex items-center gap-2 whitespace-nowrap rounded-xl px-3 lg:px-4 py-2 text-sm font-medium transition-all ${
        active ? "text-white" : "text-white/60 hover:text-white hover:bg-white/5"
      }`}
    >
      {Icon && (
        <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-white/50"}`} />
      )}

      <span className="hidden xl:inline">{label}</span>

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

function AcademyButton({ href, label, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative flex items-center gap-1.5 whitespace-nowrap rounded-xl border px-3.5 py-1.5 text-sm font-medium transition-all ${
        active
          ? "border-purple-500/40 bg-purple-500/15 text-purple-300"
          : "border-purple-500/20 bg-purple-500/[0.07] text-purple-400/80 hover:border-purple-500/35 hover:bg-purple-500/12 hover:text-purple-300"
      }`}
    >
      <GraduationCap className="h-3.5 w-3.5 shrink-0" />
      <span className="hidden xl:inline">{label}</span>

      {active && <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-purple-500/20" />}
    </Link>
  );
}

function Avatar({ profile, size = "h-8 w-8" }) {
  const initial = (profile?.username || "?").charAt(0).toUpperCase();
  return (
    <span className={`${size} shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/10`}>
      {profile?.avatar ? (
        <img src={profile.avatar} alt={profile?.username || "avatar"} className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-white/70">
          {initial}
        </span>
      )}
    </span>
  );
}

export default function Header({ ping }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [profile, setProfile] = useState(null);
  const { t } = useLang();

  useEffect(() => {
    if (!ping) {
      setProfile(null);
      return;
    }
    GetProfile()
      .then(setProfile)
      .catch(() => setProfile(null));
  }, [ping]);

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
      <div className="mx-auto h-16 max-w-7xl px-4 sm:px-6">
        {/* 3-column grid prevents overlap: logo | nav | actions */}
        <div className="grid h-full grid-cols-[auto,1fr,auto] items-center gap-3">
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

          {/* Desktop Nav (scrolls instead of colliding) */}
          <nav className="hidden md:flex min-w-0 items-center justify-center">
            <div
              className={[
                "flex min-w-0 items-center gap-1",
                "overflow-x-auto px-1",
                // hide scrollbar (no plugin needed)
                "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
              ].join(" ")}
            >
              {nav.map((n) => (
                <NavItem
                  key={n.href}
                  href={n.href}
                  label={n.label}
                  icon={n.icon}
                  active={pathname === n.href}
                />
              ))}

              <div className="mx-2 h-4 w-px shrink-0 bg-white/10" />

              <AcademyButton
                href="/academy"
                label={t("nav.academy")}
                active={pathname.startsWith("/academy")}
              />
            </div>
          </nav>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center justify-end gap-2 shrink-0">
            <LanguageSwitcher />

            {!ping ? (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-3 lg:px-4 py-2 text-sm font-medium text-white/60 transition hover:text-white"
                >
                  <span className="hidden lg:inline">{t("auth.login")}</span>
                  <span className="lg:hidden">Login</span>
                </Link>

                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-xl bg-white px-4 lg:px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90 whitespace-nowrap"
                  >
                    <span className="hidden lg:inline">{t("auth.signup")}</span>
                    <span className="lg:hidden">Sign up</span>
                  </motion.button>
                </Link>
              </>
            ) : !logoutConfirm ? (
              <>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-white/5"
                  title={profile?.username || ""}
                >
                  <Avatar profile={profile} />
                  <span className="hidden lg:inline max-w-[120px] truncate text-sm font-medium text-white/80">
                    {profile?.username || ""}
                  </span>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setLogoutConfirm(true)}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 lg:px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 whitespace-nowrap"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden lg:inline">{t("auth.logout")}</span>
                  <span className="lg:hidden">Logout</span>
                </motion.button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="hidden lg:inline text-sm text-white/50">{t("auth.logoutConfirm")}</span>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="rounded-xl bg-red-500/10 px-3 lg:px-4 py-2 text-sm font-medium text-red-400 ring-1 ring-red-500/20 transition hover:bg-red-500/20 whitespace-nowrap"
                >
                  {t("auth.logoutYes")}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setLogoutConfirm(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 lg:px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 whitespace-nowrap"
                >
                  {t("auth.cancel")}
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile: lang switcher + hamburger */}
          <div className="flex items-center justify-end gap-2 md:hidden">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white/70 transition hover:bg-white/5 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
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
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setMobileOpen(false)}
                  className={`group relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    pathname === n.href
                      ? "text-white bg-white/10"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <n.icon className={`h-4 w-4 ${pathname === n.href ? "text-white" : "text-white/50"}`} />
                  {n.label}
                </Link>
              ))}

              <Link
                href="/academy"
                onClick={() => setMobileOpen(false)}
                className={`flex w-full items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                  pathname.startsWith("/academy")
                    ? "border-purple-500/40 bg-purple-500/15 text-purple-300"
                    : "border-purple-500/20 bg-purple-500/[0.07] text-purple-400/80"
                }`}
              >
                <GraduationCap className="h-4 w-4 shrink-0" />
                {t("nav.academy")}
                <span className="ml-auto rounded-full border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-purple-400">
                  NEW
                </span>
              </Link>

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
                <div className="space-y-2">
                  <Link
                    href="/settings"
                    onClick={() => setMobileOpen(false)}
                    className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5"
                  >
                    <Avatar profile={profile} size="h-9 w-9" />
                    <span className="truncate text-sm font-medium text-white">
                      {profile?.username || "Account"}
                    </span>
                  </Link>
                  <button
                    onClick={() => setLogoutConfirm(true)}
                    className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("auth.logout")}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="px-2 text-sm text-white/50">{t("auth.logoutConfirmLong")}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
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