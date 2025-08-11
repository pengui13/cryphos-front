// app/layout.js
"use client";
import { Orbitron, Inter } from "next/font/google";
import "./globals.css";
import Header from "./Header";
import { useState, useEffect, createContext, useContext } from "react";

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

// Loading Context
const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within RootLayout");
  }
  return context;
};

// Logo Spinner Component
const LogoSpinner = ({ size = 100, logoSrc = "/logo.png" }) => {
  return (
    <>
      <style jsx global>{`
        @keyframes logoGlow {
          0%,
          100% {
            filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 35px rgba(255, 255, 255, 0.8))
              drop-shadow(0 0 50px rgba(147, 112, 219, 0.6));
          }
        }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            #0f0620 0%,
            #1a0d2e 50%,
            #0f0620 100%
          );
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          font-family: var(--font-inter), system-ui, sans-serif;
        }

        .spinner-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }

        .spinner {
          width: ${size}px;
          height: ${size}px;
          position: relative;
          animation: logoGlow 2s ease-in-out infinite;
        }

        .spinner img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.6));
        }

        .main-content {
          transition: opacity 0.3s ease;
        }

        @media (max-width: 768px) {
          .loading-text {
            font-size: 16px !important;
            letter-spacing: 1px !important;
          }
          .spinner {
            width: ${size * 0.8}px !important;
            height: ${size * 0.8}px !important;
          }
          .orb {
            width: ${size * 0.8 + 40}px !important;
            height: ${size * 0.8 + 40}px !important;
          }
          .orb-inner {
            width: ${size * 0.8 + 20}px !important;
            height: ${size * 0.8 + 20}px !important;
          }
        }
      `}</style>

      <div className="loading-overlay">
        <div className="spinner-wrapper">
          <div className="spinner">
            <div className="orb"></div>
            <div className="orb-inner"></div>
            <img
              src={logoSrc}
              alt="Loading"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default function RootLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Handle initial loading
    const handleLoad = () => {
      // Minimum loading time of 1.5 seconds for better UX
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  // Provide loading context to children
  const loadingContextValue = {
    isLoading,
    setIsLoading,
    showLoading: () => setIsLoading(true),
    hideLoading: () => setIsLoading(false),
  };

  return (
    <html lang="en">
      <body className={`${orbitron.variable} ${inter.variable} antialiased`}>
        <LoadingContext.Provider value={loadingContextValue}>
          {isLoading && <LogoSpinner size={100} logoSrc="/logo.png" />}

          <div
            className="main-content"
            style={{
              opacity: isLoading ? 0 : 1,
              pointerEvents: isLoading ? "none" : "auto",
            }}
          >
            <Header />
            {children}
          </div>
        </LoadingContext.Provider>
      </body>
    </html>
  );
}
