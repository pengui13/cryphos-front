"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// --- Typing Effect ---
function TypingEffect({ text, speed = 150 }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let idx = 0;
    const ticker = setInterval(() => {
      setDisplayed(text.slice(0, ++idx));
      if (idx >= text.length) clearInterval(ticker);
    }, speed);
    return () => clearInterval(ticker);
  }, [text, speed]);
  return <span>{displayed}</span>;
}

export default function Home() {
  const message = "Invest wisely";

  const stats = [
    { value: "RSI", label: "Technical Analysis" },
    { value: "Telegram", label: "Signal Delivery" },
    { value: "24/7", label: "Market Monitoring" },
  ];

  const steps = [
    {
      title: "Select Assets",
      features: [
        "Choose cryptocurrencies",
        "Up to 10 trading pairs",
        "Portfolio diversification",
      ],
    },
    {
      title: "Configure RSI",
      features: [
        "Set RSI parameters",
        "Multiple timeframes",
        "Custom buy/sell levels",
      ],
    },
    {
      title: "Connect Telegram",
      features: [
        "Real-time notifications",
        "Signal explanations",
        "Trading recommendations",
      ],
    },
  ];

  const rsiFeatures = [
    {
      title: "RSI Formula",
      description:
        "RSI = 100 - (100 / (1 + RS)), calculated over 14 periods typically",
      icon: "📊",
    },
    {
      title: "Overbought (>70)",
      description: "Potential sell signal when RSI exceeds 70",
      icon: "📈",
    },
    {
      title: "Oversold (<30)",
      description: "Potential buy signal when RSI drops below 30",
      icon: "📉",
    },
    {
      title: "Multiple Timeframes",
      description: "Apply RSI across different intervals for better accuracy",
      icon: "⏰",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-[#0d0019] to-black text-gray-100 flex flex-col items-center">
      {/* Animated Planets */}
      <div className="planet planet-1" />
      <div className="planet planet-2" />
      <div className="planet planet-3" />
      <div className="blur-background" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center py-20">
          <h1 className="text-6xl lg:text-8xl font-black mb-4">
            <span className="text-neon">
              <TypingEffect text={message} />
            </span>
            <span className="ml-2 text-neon blink">|</span>
          </h1>
          <p className="text-2xl lg:text-3xl text-white/90 font-medium mb-8">
            RSI Trading Signals via Telegram
          </p>

          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-[#e3b8ff] mb-2">
                  {s.value}
                </div>
                <div className="text-lg text-white/60">{s.label}</div>
              </div>
            ))}
          </div>

          <Link href="/lab" className="inline-block group">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl blur opacity-60 group-hover:opacity-80 transition bg-gradient-to-r from-[#e3b8ff] to-[#6a2e8e]"></div>
              <button className="relative bg-gradient-to-r from-[#e3b8ff] to-[#6a2e8e] text-white font-bold text-xl px-12 py-6 rounded-2xl hover:scale-105 transition-transform duration-200 shadow-2xl">
                Create RSI Bot
              </button>
            </div>
          </Link>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Set up your automated RSI trading bot in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div
                key={i}
                className="bg-white/5 rounded-xl border border-white/10 p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-[#e3b8ff] rounded-lg flex items-center justify-center text-black font-bold mr-3">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                </div>
                <ul className="text-white/60 space-y-1">
                  {step.features.map((feature, idx) => (
                    <li key={idx} className="text-sm">
                      • {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* RSI Signals */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              RSI Trading Signals
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Understand when to buy and sell based on RSI levels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-green-400 text-xl">↗</span>
                </div>
                <h3 className="text-xl font-bold text-green-400">BUY Signal</h3>
              </div>
              <p className="text-white/90 mb-3">
                When RSI drops below 30, indicating oversold conditions
              </p>
              <ul className="text-white/60 text-sm space-y-1">
                <li>• Asset potentially undervalued</li>
                <li>• Possible upward reversal</li>
                <li>• Good entry opportunity</li>
              </ul>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-red-400 text-xl">↘</span>
                </div>
                <h3 className="text-xl font-bold text-red-400">SELL Signal</h3>
              </div>
              <p className="text-white/90 mb-3">
                When RSI rises above 70, indicating overbought conditions
              </p>
              <ul className="text-white/60 text-sm space-y-1">
                <li>• Asset potentially overvalued</li>
                <li>• Possible downward correction</li>
                <li>• Good exit opportunity</li>
              </ul>
            </div>
          </div>
        </section>

        {/* RSI Information */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Understanding RSI
            </h2>
            <p className="text-white/70 max-w-3xl mx-auto">
              RSI (Relative Strength Index) is a momentum oscillator that
              measures the speed and change of price movements, helping identify
              overbought and oversold conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {rsiFeatures.map((feature, i) => (
              <div
                key={i}
                className="bg-white/5 rounded-xl border border-white/10 p-6"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/60 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/5 rounded-xl border border-white/10 p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">RSI Ranges</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="text-red-400 font-bold mb-2">RSI &gt; 70</div>
                <div className="text-sm text-white/60">Overbought Zone</div>
              </div>
              <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="text-yellow-400 font-bold mb-2">RSI 30-70</div>
                <div className="text-sm text-white/60">Neutral Zone</div>
              </div>
              <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="text-green-400 font-bold mb-2">RSI &lt; 30</div>
                <div className="text-sm text-white/60">Oversold Zone</div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center py-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Create your automated RSI trading bot and start receiving
            professional trading signals directly to your Telegram.
          </p>

          <div className="flex justify-center gap-6 mb-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-[#e3b8ff]">
                  {s.value}
                </div>
                <div className="text-sm text-white/60">{s.label}</div>
              </div>
            ))}
          </div>

          <Link href="/lab" className="inline-block group">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl blur opacity-60 group-hover:opacity-80 transition bg-gradient-to-r from-[#e3b8ff] to-[#6a2e8e]"></div>
              <button className="relative bg-gradient-to-r from-[#e3b8ff] to-[#6a2e8e] text-white font-bold text-xl px-12 py-4 rounded-2xl hover:scale-105 transition-transform">
                Create RSI Bot
              </button>
            </div>
          </Link>
        </section>
      </div>

      {/* Styles */}
      <style jsx>{`
        .planet {
          position: absolute;
          border-radius: 50%;
          z-index: 0;
          animation: drift 6s ease-in-out infinite;
        }
        .planet-1 {
          width: 100px;
          height: 100px;
          top: 20%;
          left: 10%;
          background: radial-gradient(circle, #310447, #53266e);
        }
        .planet-2 {
          width: 150px;
          height: 150px;
          top: 60%;
          left: 70%;
          background: radial-gradient(circle, #e3b8ff, #6a2e8e);
        }
        .planet-3 {
          width: 80px;
          height: 80px;
          top: 75%;
          left: 50%;
          background: radial-gradient(circle, #411664, #350952);
        }
        .blur-background {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 1;
        }
        .text-neon {
          color: #fff;
          text-shadow: 0 0 2px #fff, 0 0 4px #ff00ff, 0 0 8px #ff00ff;
        }
        @keyframes drift {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .blink {
          animation: blinkAnim 1s step-start infinite;
        }
        @keyframes blinkAnim {
          0%,
          49% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
