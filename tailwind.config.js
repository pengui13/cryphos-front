/** @type {import('tailwindcss').Config} */

// Brand violet, expressed once so the token below and globals.css agree.
const PRIMARY = "#8B5CF6";
const PRIMARY_HOVER = "#A78BFA";
const PRIMARY_DARK = "#6D28D9";
const PRIMARY_RGB = "139, 92, 246";

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // NOTE: keep the standard Tailwind scale for sm/md/lg/xl/2xl. This file
      // used to redefine `lg` as 1440px and `xl` as 1920px, which meant every
      // `lg:` / `xl:` utility in the app fired hundreds of pixels too late —
      // the header nav labels, for instance, only appeared above 1920px.
      screens: {
        smd: "576px",
        mdlg: "1000px",
        "3xl": "1920px",
      },

      colors: {
        // === SURFACES ===
        bkg: "#08080B",
        "bkg-surface": "#0F0F14",
        "bkg-elevated": "#15151C",
        "bkg-hover": "#1D1D26",

        // Legacy support
        "bkg-68": "#0F0F14",
        darker: "#050507",

        // === BRAND VIOLET ===
        primary: PRIMARY,
        "primary-hover": PRIMARY_HOVER,
        "primary-dark": PRIMARY_DARK,
        "primary-20": `rgba(${PRIMARY_RGB}, 0.2)`,
        "primary-10": `rgba(${PRIMARY_RGB}, 0.1)`,

        // === TRADING STATUS COLORS ===
        success: "#34D399",
        "success-dark": "#059669",
        "success-20": "rgba(52, 211, 153, 0.2)",

        danger: "#F87171",
        "danger-dark": "#DC2626",
        "danger-20": "rgba(248, 113, 113, 0.2)",

        // === PREMIUM & ACCENTS ===
        gold: "#E8C468",
        "gold-dark": "#C79B3B",
        "gold-20": "rgba(232, 196, 104, 0.2)",

        info: "#38BDF8",
        "info-dark": "#0284C7",
        "info-20": "rgba(56, 189, 248, 0.2)",

        // === TEXT HIERARCHY ===
        text: {
          primary: "#FFFFFF",
          secondary: "#E4E4E7",
          muted: "#A1A1AA",
          disabled: "#71717A",
        },

        // Legacy gray support
        gray: {
          100: "#E4E4E7",
          400: "#A1A1AA",
          600: "#71717A",
          800: "#15151C",
          900: "#050507",
        },

        // === SPECIAL EFFECTS ===
        shimmer: "#1D1D26",
        graphite: "#26262F",

        glow: {
          primary: `rgba(${PRIMARY_RGB}, 0.4)`,
          green: "rgba(52, 211, 153, 0.4)",
          red: "rgba(248, 113, 113, 0.4)",
          cyan: "rgba(56, 189, 248, 0.4)",
        },

        error: "#F87171",
      },

      fontFamily: {
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        space: ["var(--font-space)", "var(--font-inter)", "system-ui", "sans-serif"],
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "squares-gradient": "url('/assets/icons/squarebg.png'), bg-opacity-5",
        "banner-gradient": "url('/assets/icons/banner-bg.png')",
        secLow: "url('/assets/icons/secLow.svg')",
        secHigh: "url('/assets/icons/secHigh.svg')",
        secMed: "url('/assets/icons/secMed.svg')",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",

        "primary-gradient": `linear-gradient(135deg, ${PRIMARY_DARK} 0%, ${PRIMARY_HOVER} 100%)`,
        "success-gradient": "linear-gradient(135deg, #059669 0%, #34D399 100%)",
        "danger-gradient": "linear-gradient(135deg, #DC2626 0%, #F87171 100%)",
        "background-gradient":
          "linear-gradient(135deg, #050507 0%, #0F0F14 50%, #15151C 100%)",
      },

      opacity: {
        8: "0.08",
      },

      keyframes: {
        wave: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: `0 0 20px rgba(${PRIMARY_RGB}, 0.3)` },
          "50%": {
            boxShadow: `0 0 40px rgba(${PRIMARY_RGB}, 0.6), 0 0 60px rgba(${PRIMARY_RGB}, 0.2)`,
          },
        },
        "profit-pulse": {
          "0%, 100%": { boxShadow: "0 0 15px rgba(52, 211, 153, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(52, 211, 153, 0.6)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "sheen-sweep": {
          "0%": { transform: "translateX(-120%) skewX(-12deg)" },
          "100%": { transform: "translateX(320%) skewX(-12deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },

      animation: {
        wave: "wave 2s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "profit-pulse": "profit-pulse 1.5s ease-in-out infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
        "sheen-sweep": "sheen-sweep 1.1s ease-out",
        "float-slow": "float-slow 7s ease-in-out infinite",
      },

      boxShadow: {
        "glow-primary": `0 0 20px rgba(${PRIMARY_RGB}, 0.3)`,
        "glow-green": "0 0 20px rgba(52, 211, 153, 0.3)",
        "glow-red": "0 0 20px rgba(248, 113, 113, 0.3)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 32px rgba(0, 0, 0, 0.5)",
        "card-hover": `0 1px 0 0 rgba(255,255,255,0.06) inset, 0 16px 48px rgba(0, 0, 0, 0.6), 0 0 40px rgba(${PRIMARY_RGB}, 0.08)`,
        elevated: "0 24px 64px -12px rgba(0,0,0,0.7)",
      },
    },
  },
  plugins: [],
};
