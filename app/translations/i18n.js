import { en } from "./en.js" 
import { uk } from "./uk.js" 
import { ru } from "./ru.js" 
import { es } from "./es.js" 
import { de } from "./de.js" 



export const LANGUAGES = [
  { code: "en", label: "English"},
  { code: "uk", label: "Українська"},
  { code: "ru", label: "Русский"},
  { code: "de", label: "Deutsch"},
  { code: "es", label: "Español"},
];

export const translations = {
  en:en,
  uk:uk,
  ru:ru,
  de:de,
  es:es
}

export function t(lang, path) {
  const keys = path.split(".");
  let val = translations[lang] ?? translations["en"];
  for (const k of keys) { val = val?.[k]; if (val === undefined) break; }
  if (val === undefined) {
    let fallback = translations["en"];
    for (const k of keys) { fallback = fallback?.[k]; }
    return fallback ?? path;
  }
  return val;
}