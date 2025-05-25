"use client";
import React, { useState, useEffect } from "react";
import Header from "./Header";

function TypingEffect({ text, speed = 100 }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let idx = 0;
    const ticker = setInterval(() => {
      idx++;
      setDisplayed(text.slice(0, idx)); // take the first idx characters
      if (idx >= text.length) {
        clearInterval(ticker); // stop once we've reached full length
      }
    }, speed);
    return () => clearInterval(ticker);
  }, [text, speed]);

  return <>{displayed}</>;
}

export default function Home() {
  const message = "Invest Wisely";

  return (
    <div>
      <div className="relative w-full h-screen overflow-hidden">
        <div className="w-full z-20">
          <Header />
        </div>
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/owl.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        {/* 2) Blur + dark blend overlay */}
        <div className="absolute inset-0 backdrop-blur-xs pointer-events-none bg-[#0c1b4db2] mix-blend-overlay z-10" />

        {/* 3) Header on top */}

        {/* 4) Centered typing text */}
        <div className="relative z-20 flex items-center justify-center h-full">
          <h1 className="text-white text-6xl font-bold flex">
            <TypingEffect text={message} speed={150} />
            <span className="ml-1 blink">|</span>
          </h1>
        </div>

        {/* 5) Blinking cursor keyframes */}
        <style jsx>{`
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
          .blink {
            animation: blinkAnim 1s step-start infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
