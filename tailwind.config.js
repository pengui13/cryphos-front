/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // This is the key change
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        smd: "576px",
        md: "768px",
        mdlg: "1000px",
        lg: "1440px",
        xl: "1920px",
      },
      colors: {
        // === KRAKEN-INSPIRED BACKGROUNDS ===
        // Deep space backgrounds (like Kraken's dark mode)
        bkg: "black",
        "bkg-surface": "#131823", // Card/panel background
        "bkg-elevated": "#1A1F2E", // Elevated elements
        "bkg-hover": "#252B3A", // Hover states

        // Legacy support
        "bkg-68": "#131823",
        darker: "#0A0E16",

        // === SIGNATURE OWL ORANGE (Your Kraken Purple) ===
        // Electric orange as primary brand color
        primary: "#FF6B35", // Bright energetic orange
        "primary-hover": "#FF8A65", // Lighter orange for hovers
        "primary-dark": "#E64A19", // Darker orange for pressed states
        "primary-20": "rgba(255, 107, 53, 0.2)", // Transparent glow
        "primary-10": "rgba(255, 107, 53, 0.1)", // Subtle background

        // === TRADING STATUS COLORS ===
        // Crypto-standard green/red
        success: "#00E676", // Bright profit green
        "success-dark": "#00C853", // Darker green
        "success-20": "rgba(0, 230, 118, 0.2)",

        danger: "#FF1744", // Alert red
        "danger-dark": "#D50000", // Darker red
        "danger-20": "rgba(255, 23, 68, 0.2)",

        // === PREMIUM & ACCENTS ===
        // Gold for premium features
        gold: "#FFD700", // Pure gold
        "gold-dark": "#FFA000", // Darker gold
        "gold-20": "rgba(255, 215, 0, 0.2)",

        // Info/secondary accent
        info: "#00D4FF", // Electric cyan
        "info-dark": "#0091EA", // Darker cyan
        "info-20": "rgba(0, 212, 255, 0.2)",

        // === TEXT HIERARCHY ===
        text: {
          primary: "#FFFFFF", // Pure white for headers
          secondary: "#E2E8F0", // Light gray for body
          muted: "#94A3B8", // Medium gray for captions
          disabled: "#64748B", // Dark gray for disabled
        },

        // Legacy gray support
        gray: {
          100: "#E2E8F0", // Light text
          400: "#94A3B8", // Muted text
          600: "#64748B", // Disabled text
          800: "#1A1F2E", // Dark surfaces
          900: "#0A0E16", // Darkest
        },

        // === SPECIAL EFFECTS ===
        shimmer: "#252B3A", // For loading animations
        graphite: "#2A3441", // Borders and dividers

        // Glow effects for buttons/highlights
        glow: {
          orange: "rgba(255, 107, 53, 0.4)",
          green: "rgba(0, 230, 118, 0.4)",
          red: "rgba(255, 23, 68, 0.4)",
          cyan: "rgba(0, 212, 255, 0.4)",
        },

        // Legacy (deprecated - use new colors above)
        error: "#FF1744",
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

        // Kraken-inspired gradients
        "primary-gradient": "linear-gradient(135deg, #FF6B35 0%, #FF8A65 100%)",
        "success-gradient": "linear-gradient(135deg, #00E676 0%, #26C6DA 100%)",
        "danger-gradient": "linear-gradient(135deg, #FF1744 0%, #FF6B9D 100%)",
        "background-gradient":
          "linear-gradient(135deg, #0A0E16 0%, #131823 50%, #1A1F2E 100%)",
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
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(255, 107, 53, 0.3)",
          },
          "50%": {
            boxShadow:
              "0 0 40px rgba(255, 107, 53, 0.6), 0 0 60px rgba(255, 107, 53, 0.2)",
          },
        },
        "profit-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 15px rgba(0, 230, 118, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(0, 230, 118, 0.6)",
          },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },

      animation: {
        wave: "wave 2s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "profit-pulse": "profit-pulse 1.5s ease-in-out infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
      },

      // Box shadows for depth and glow effects
      boxShadow: {
        "glow-orange": "0 0 20px rgba(255, 107, 53, 0.3)",
        "glow-green": "0 0 20px rgba(0, 230, 118, 0.3)",
        "glow-red": "0 0 20px rgba(255, 23, 68, 0.3)",
        card: "0 8px 32px rgba(0, 0, 0, 0.4)",
        "card-hover":
          "0 12px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 107, 53, 0.1)",
      },
    },
  },
    plugins: [],
};
