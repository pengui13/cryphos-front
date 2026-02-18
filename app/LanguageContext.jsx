"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "./translations/i18n";

const LanguageContext = createContext(null);

const COOKIE_KEY = "cryphos_lang";
const DEFAULT_LANG = "en";

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(DEFAULT_LANG);

  useEffect(() => {
    const saved = getCookie(COOKIE_KEY);
    if (saved && translations[saved]) {
      setLangState(saved);
    }
  }, []);

  function setLang(code) {
    if (!translations[code]) return;
    setLangState(code);
    setCookie(COOKIE_KEY, code);
  }

  // t("bots.createBot") helper
  function t(path) {
    const keys = path.split(".");
    let val = translations[lang];
    for (const k of keys) {
      val = val?.[k];
      if (val === undefined) break;
    }
    if (val === undefined) {
      let fallback = translations[DEFAULT_LANG];
      for (const k of keys) fallback = fallback?.[k];
      return fallback ?? path;
    }
    return val;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}