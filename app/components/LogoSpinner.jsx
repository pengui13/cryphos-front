// components/LogoSpinner.jsx
import React from "react";

/**
 * Minimal, pro spinner:
 * - Thin rotating arc + tiny orbit dot (SVG, GPU-friendly)
 * - Subtle central logo, no glow
 * - Smooth fade-out when `fadingOut` is true
 * - Respects prefers-reduced-motion
 *
 * API compatible with your current usage:
 *   <LogoSpinner size={100} logoSrc="/logo.png" fadingOut={isFadingOut} />
 */
export default function LogoSpinner({ size = 100, logoSrc = "/logo.png", fadingOut = false }) {
  const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "#0f0f12", // minimal solid backdrop
    display: "grid",
    placeItems: "center",
    zIndex: 9999,
    willChange: "opacity",
    opacity: fadingOut ? 0 : 1,
    transition: "opacity 220ms ease",
  };

  const wrapStyle = {
    position: "relative",
    width: size,
    height: size,
  };

  const logoBox = {
    position: "absolute",
    inset: 0,
    display: "grid",
    placeItems: "center",
  };

  const logoStyle = {
    width: Math.round(size * 0.66),
    height: Math.round(size * 0.66),
    objectFit: "contain",
    display: "block",
    transform: "translateZ(0)",
  };

  // Sizes for the SVG ring
  const ringSize = size;
  const viewBox = 100;
  const r = 42; // radius for arc
  const stroke = 3;

  return (
    <>
      {/* a11y hint for screen readers */}
      <div style={overlayStyle} role="status" aria-live="polite" aria-label="Loading">
        <div style={wrapStyle}>
          {/* Spinner */}
          <svg
            viewBox={`0 0 ${viewBox} ${viewBox}`}
            width={ringSize}
            height={ringSize}
            aria-hidden="true"
            style={{ position: "absolute", inset: 0 }}
          >
            {/* Track */}
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={stroke}
            />

            {/* Rotating arc (clean + minimal) */}
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="#e3b8ff"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray="90 300"
              transform="rotate(0 50 50)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="1.05s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Small orbit dot (tasteful, not flashy) */}
            <g>
              <circle cx="50" cy={50 - r} r="1.8" fill="#e3b8ff" />
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="1.05s"
                repeatCount="indefinite"
              />
            </g>
          </svg>

          {/* Logo */}
          <div style={logoBox}>
            <img src={logoSrc} alt="Cryphos" style={logoStyle} width={Math.round(size * 0.66)} height={Math.round(size * 0.66)} />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          svg animateTransform {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
