// app/layout.js
"use client";

import { Orbitron, Inter } from "next/font/google";
import "./globals.css";
import Header from "./Header";
import { useState, useEffect, useRef, createContext, useContext } from "react";
import LogoSpinner from "./components/LogoSpinner";
const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700"],
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

const LoadingContext = createContext(null);
export const useLoading = () => {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used within RootLayout");
  return ctx;
};


export default function RootLayout({ children }) {
  const MIN_SHOW_MS = 600;   // avoid blink
  const MAX_CAP_MS  = 2500;  // never hang
  const FADE_MS     = 220;

  const [isShowingOverlay, setIsShowingOverlay] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const startRef = useRef(Date.now());

  useEffect(() => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      const elapsed = Date.now() - startRef.current;
      const wait = Math.max(0, MIN_SHOW_MS - elapsed);
      setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => setIsShowingOverlay(false), FADE_MS);
      }, wait);
    };

    // Preload + decode logo (so we can finish ASAP)
    const img = new Image();
    img.src = "/logo.png";
    (img.decode ? img.decode() : Promise.resolve()).then(finish).catch(finish);

    // Hard cap
    const cap = setTimeout(finish, MAX_CAP_MS);

    // Also finish on window load if earlier
    const onLoad = () => finish();
    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      clearTimeout(cap);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  const loadingContextValue = {
    isLoading: isShowingOverlay,
    setIsLoading: (v) => {
      if (v) {
        startRef.current = Date.now();
        setIsFadingOut(false);
        setIsShowingOverlay(true);
      } else {
        setIsFadingOut(true);
        setTimeout(() => setIsShowingOverlay(false), FADE_MS);
      }
    },
    showLoading: () => {
      startRef.current = Date.now();
      setIsFadingOut(false);
      setIsShowingOverlay(true);
    },
    hideLoading: () => {
      setIsFadingOut(true);
      setTimeout(() => setIsShowingOverlay(false), FADE_MS);
    },
  };

  return (
    <html lang="en">
      <head>
        {/* Preload the logo so decode finishes quickly */}
        <link rel="preload" as="image" href="/logo.png" />
        {/* Prevent body flash scrollbars while overlay is visible */}
        <style>{`html,body{height:100%} body{margin:0;}`}</style>
      </head>
      <body className={`${orbitron.variable} ${inter.variable} antialiased`}>
        <LoadingContext.Provider value={loadingContextValue}>
          {isShowingOverlay && (
            <LogoSpinner size={100} logoSrc="/logo.png" fadingOut={isFadingOut} />
          )}

          <div
            className="main-content"
            style={{
              opacity: isShowingOverlay ? 0 : 1,
              pointerEvents: isShowingOverlay ? "none" : "auto",
              transition: "opacity 220ms ease",
            }}
            aria-busy={isShowingOverlay}
          >
            <Header />
            {children}
          </div>
        </LoadingContext.Provider>
      </body>
    </html>
  );
}
