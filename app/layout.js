"use client";
import '../polyfills.js'
import React, { useState, useEffect, useRef } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

import Footer from "./components/Footer";
import Header from "./Header";
import LogoSpinner from "./components/LogoSpinner";
import { GetPing } from "./api/ApiWrapper";

import { PingProvider, LoadingProvider } from "./providers";

const space = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }) {
  const MIN_SHOW_MS = 600;
  const MAX_CAP_MS = 2500;
  const FADE_MS = 220;

  const [isShowingOverlay, setIsShowingOverlay] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const startRef = useRef(Date.now());

  const [ping, setPing] = useState(false);

  useEffect(() => {
    GetPing(setPing);
  }, []);

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

    const img = new Image();
    img.src = "/logo.png";
    (img.decode ? img.decode() : Promise.resolve()).then(finish).catch(finish);

    const cap = setTimeout(finish, MAX_CAP_MS);
    const onLoad = () => finish();
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", onLoad, { once: true });

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
        <title>Cryphos</title>
        <link rel="preload" as="image" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        <style>{`html,body{height:100%} body{margin:0;}`}</style>
      </head>
      <body className={`${inter.variable} ${space.variable} antialiased`}>
        <LoadingProvider value={loadingContextValue}>
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
            <PingProvider value={ping}>
              <Header ping={ping} />
              {children}
              <Footer />
            </PingProvider>
          </div>
        </LoadingProvider>
      </body>
    </html>
  );
}
