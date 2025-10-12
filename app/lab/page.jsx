"use client";
import ConfigureBalance from "./ConfigureBalance";
import { useState, useEffect } from "react";
import ConfigureBot from "./ConfigureBot";
import Basic from "./Basic";
import AssetsBlock from "./AssetsBlock";
import ConfigureTg from "./ConfigureTg";
import Snackbar from "../components/Snackbar";
import { CreateBot } from "../api/ApiWrapper";

export default function BotsFactory() {
  const [snackData, setSnackData] = useState({
    visible: false,
    status: false,
    type: "prime",
    info: "",
  });
  const [name, setName] = useState("");
  const [tgNickname, setTgNickname] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [step, setStep] = useState(1);
  const [botSettings, setBotSettings] = useState({});
  const [rsiEnabled, setRsiEnabled] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [coverImage, setCoverImage] = useState(null);

  const [balanceSettings, setBalanceSettings] = useState({
    amount: "",
    tpSlValues: [-50, 100], // [Stop Loss, Take Profit]
  });

  function handleStep(nextStep) {
    setError("");
    if (step == 1) {
      if (selectedSymbols.length == 0) {
        setError("Select at least 1 asset");
        return;
      }
    } else if (step == 2) {
      if (
        !botSettings.rsi &&
        !botSettings.ma &&
        !botSettings.obv &&
        !botSettings.art &&
        !botSettings.macd &&
        !botSettings.bb
      ) {
        setError("Select at least one indicator");
        return;
      }
    }
    setStep(nextStep);
  }

  const [rsiSettings, setRsiSettings] = useState({
    period: 14,
    max: 70,
    min: 30,
    intervals: ["1m"],
  });

  useEffect(() => {
    if (error) {
      setSnackData({ visible: true, info: error, status: false });
    }
  }, [error]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    setBotSettings((prevSettings) => {
      const newSettings = { ...prevSettings };
      newSettings.name = name;
      newSettings.description = description;
      newSettings.bot_assets = selectedSymbols;
      newSettings.tg_nickname = tgNickname;
      // Include balance settings
      newSettings.portfolio_volume = balanceSettings.amount;
      newSettings.stop_loss = balanceSettings.tpSlValues[0];
      newSettings.take_profit = balanceSettings.tpSlValues[1];
      return newSettings;
    });
  }, [name, description, selectedSymbols, balanceSettings, tgNickname]);

  const totalSteps = 3;

  const stepTitles = {
    1: "Select Assets",
    2: "Configure RSI",
    3: "Add your telegram nickname",
  };

  // Progress (0% at step 1, 100% at last step)
  const clamped = Math.min(Math.max(step, 1), totalSteps);
  const progressPct =
    totalSteps > 1 ? ((clamped - 1) / (totalSteps - 1)) * 100 : 0;

  // Create even segment markers for the bar (no circles)
  const segments = Array.from({ length: totalSteps - 1 }, (_, i) => i + 1);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-[#0d0019] to-black text-gray-100 flex flex-col items-center">
      {/* Animated Planets & Space Elements (kept as-is) */}
      <div className="planet planet-1" />
      <div className="planet planet-2" />
      <div className="planet planet-3" />
      <div className="planet planet-4" />
      <div className="blur-background" />

      <Snackbar data={snackData} />

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pt-16 pb-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <p className="text-white text-2xl mb-4">{stepTitles[step]}</p>

          {/* PROGRESS BAR (no circles) */}
          <div className="mx-auto w-full max-w-xl">
            {/* Labels */}
            <div className="mb-2 grid" style={{ gridTemplateColumns: `repeat(${totalSteps}, minmax(0,1fr))` }}>
              {[1, 2, 3].slice(0, totalSteps).map((n) => (
                <div key={n} className="text-[11px] text-white/70 text-center truncate">
                  {stepTitles[n]}
                </div>
              ))}
            </div>

            {/* Track + Fill */}
            <div className="relative h-2 rounded bg-white/10">
              {/* Segments (thin vertical dividers) */}
              {segments.map((n) => (
                <span
                  key={n}
                  className="absolute top-0 bottom-0 w-px bg-white/15"
                  style={{ left: `${(n / totalSteps) * 100}%` }}
                  aria-hidden="true"
                />
              ))}
              {/* Fill */}
              <div
                className="h-2 rounded bg-[#e3b8ff] transition-[width] duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Step text */}
            <div className="mt-2 text-center text-white/60 text-sm">
              Step {clamped} of {totalSteps}
            </div>

            {/* a11y */}
            <div
              className="sr-only"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={totalSteps}
              aria-valuenow={clamped}
              aria-label="Step progress"
            />
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
          {/* Content Area */}
          <div className="p-8 md:p-12">
            <div className="min-h-[500px]">
              {/* Step Content */}
              {step === 1 ? (
                <AssetsBlock
                  setStep={setStep}
                  step={step}
                  selectedSymbols={selectedSymbols}
                  setSelectedSymbols={setSelectedSymbols}
                  setBotSettings={setBotSettings}
                  botSettings={botSettings}
                />
              ) : step === 2 ? (
                <ConfigureBot
                  step={step}
                  setStep={setStep}
                  botSettings={botSettings}
                  setBotSettings={setBotSettings}
                />
              ) : (
                <ConfigureTg
                  tgNickname={tgNickname}
                  step={step}
                  setStep={setStep}
                  onCreateBot={() =>
                    CreateBot(botSettings, setSuccess, setError)
                  }
                  setTgNickname={setTgNickname}
                />
              )}
            </div>
          </div>

          <div className="px-8 md:px-12 py-6 border-t border-white/10 bg-white/5">
            <div className="flex items-center justify-between">
              <div className="flex-1 text-center">
                <div className="text-white/60 text-sm">
                  Step {step} of {totalSteps}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Original styles (kept) */}
      <style jsx>{`
        .planet {
          position: absolute;
          border-radius: 50%;
          z-index: 0;
          animation: drift 6s ease-in-out infinite;
        }
        .planet-1 {
          width: 120px;
          height: 120px;
          top: 15%;
          left: 8%;
          background: radial-gradient(circle, #310447, #53266e);
          animation-delay: 0s;
        }
        .planet-2 {
          width: 180px;
          height: 180px;
          top: 65%;
          right: 10%;
          background: radial-gradient(circle, #e3b8ff, #6a2e8e);
          animation-delay: 2s;
        }
        .planet-3 {
          width: 90px;
          height: 90px;
          top: 80%;
          left: 15%;
          background: radial-gradient(circle, #411664, #350952);
          animation-delay: 4s;
        }
        .planet-4 {
          width: 60px;
          height: 60px;
          top: 25%;
          right: 25%;
          background: radial-gradient(circle, #2a1038, #4a1f5c);
          animation-delay: 1s;
        }
        .blur-background {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 1;
        }
        @keyframes drift {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          33% {
            transform: translateY(-15px) rotate(120deg);
          }
          66% {
            transform: translateY(10px) rotate(240deg);
          }
        }
      `}</style>
    </div>
  );
}
