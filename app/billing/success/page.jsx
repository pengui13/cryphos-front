"use client";
import { useEffect, useState } from "react";

export default function BillingSuccessAnimation() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timeline = [
      { delay: 0, stage: 1 }, // particles burst
      { delay: 400, stage: 2 }, // checkmark scales
      { delay: 800, stage: 3 }, // full reveal
    ];

    timeline.forEach(({ delay, stage: s }) => {
      const timer = setTimeout(() => setStage(s), delay);
      return () => clearTimeout(timer);
    });
  }, []);

  // Animated particles
  const particles = Array.from({ length: 60 }, (_, i) => {
    const angle = (i / 60) * Math.PI * 2;
    const distance = 200;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const duration = 0.8 + Math.random() * 0.4;
    const delay = Math.random() * 0.2;

    return (
      <div
        key={i}
        className="absolute w-2 h-2 rounded-full"
        style={{
          left: "50%",
          top: "50%",
          background: `hsl(${270 + Math.random() * 60}, 100%, ${50 + Math.random() * 20}%)`,
          opacity: stage >= 1 ? 0 : 1,
          transform: stage >= 1 
            ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
            : "translate(-50%, -50%)",
          transition: `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`,
          pointerEvents: "none",
        }}
      />
    );
  });

  // Ripple effect rings
  const ripples = Array.from({ length: 3 }, (_, i) => (
    <div
      key={`ripple-${i}`}
      className="absolute rounded-full"
      style={{
        width: "120px",
        height: "120px",
        left: "50%",
        top: "50%",
        border: "2px solid rgba(16, 185, 129, 0.6)",
        transform: "translate(-50%, -50%)",
        opacity: stage >= 1 ? 0 : 0.8,
        animation: stage >= 1 
          ? `ripple ${0.8 + i * 0.2}s ease-out forwards`
          : "none",
        animationDelay: `${i * 0.15}s`,
      }}
    />
  ));

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#0f1115] via-[#1a1a24] to-[#0f1115] flex items-center justify-center overflow-hidden">
      <style>{`
        @keyframes ripple {
          0% {
            width: 120px;
            height: 120px;
            opacity: 0.8;
          }
          100% {
            width: 400px;
            height: 400px;
            opacity: 0;
          }
        }

        @keyframes scaleInBounce {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.15);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.4),
                        inset 0 0 20px rgba(16, 185, 129, 0.1);
          }
          50% {
            box-shadow: 0 0 40px rgba(16, 185, 129, 0.8),
                        inset 0 0 30px rgba(16, 185, 129, 0.2);
          }
        }

        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translateY(0px);
          }
          100% {
            opacity: 0;
            transform: translateY(-60px);
          }
        }
      `}</style>

      {/* Background glow */}
      <div 
        className="absolute inset-0"
        style={{
          background: stage >= 3 ? "radial-gradient(circle at center, rgba(16, 185, 129, 0.15) 0%, transparent 70%)" : "transparent",
          transition: "all 1s ease-out",
        }}
      />

      {/* Particles container */}
      <div className="absolute inset-0 overflow-hidden">
        {particles}
        {ripples}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6">
        {/* Checkmark circle */}
        <div
          className="relative"
          style={{
            width: "140px",
            height: "140px",
          }}
        >
          {/* Outer glow ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0) 70%)",
              opacity: stage >= 2 ? 1 : 0,
              transition: "opacity 0.6s ease-out",
            }}
          />

          {/* Circle background */}
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-400/50"
            style={{
              opacity: stage >= 2 ? 1 : 0,
              transform: stage >= 2 ? "scale(1)" : "scale(0.3)",
              animation: stage >= 2 ? "glow 2s ease-in-out infinite" : "none",
              transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
              boxShadow: "0 0 60px rgba(16, 185, 129, 0.4)",
            }}
          />

          {/* Checkmark */}
          <svg
            className="absolute inset-0"
            viewBox="0 0 140 140"
            style={{
              opacity: stage >= 2 ? 1 : 0,
            }}
          >
            <path
              d="M40 70 L60 90 L100 50"
              stroke="rgb(16, 185, 129)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: "80px",
                strokeDashoffset: stage >= 2 ? "0px" : "80px",
                transition: "stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s",
              }}
            />
          </svg>
        </div>

        {/* Text content */}
        <div
          className="text-center"
          style={{
            opacity: stage >= 3 ? 1 : 0,
            transform: stage >= 3 ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease-out 0.4s",
          }}
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
            Success!
          </h1>
          <p className="text-white/60 text-lg max-w-md">
            Your subscription is now active and ready to use
          </p>
        </div>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 mt-4"
          style={{
            opacity: stage >= 3 ? 1 : 0,
            transform: stage >= 3 ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease-out 0.5s",
          }}
        >
          <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/50 hover:scale-105 transition active:scale-95">
            Go to Bot Factory
          </button>
          <button className="px-8 py-4 rounded-xl border border-white/20 bg-white/5 text-white font-semibold hover:bg-white/10 transition">
            View Details
          </button>
        </div>

        {/* Floating success messages */}
        {stage >= 2 && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={`float-${i}`}
                className="absolute text-2xl font-bold text-emerald-400"
                style={{
                  left: `${30 + i * 25}%`,
                  top: "50%",
                  animation: `floatUp ${1.5 + i * 0.2}s ease-out forwards`,
                  animationDelay: `${0.6 + i * 0.15}s`,
                }}
              >
                ✨
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}