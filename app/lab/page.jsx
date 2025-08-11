"use client";
import ConfigureBalance from "./ConfigureBalance";
import { useState, useEffect } from "react";
import BotModal from "./BotModal";
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
    // Reset any existing error
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

    // All good — advance the step
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

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-[#0d0019] to-black text-gray-100 flex flex-col items-center">
      {/* Animated Planets & Space Elements */}
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
          <p className="text-white text-2xl mb-6">{stepTitles[step]} </p>

          {/* Step Progress Indicator */}
          <div className="flex items-center justify-center space-x-2 mb-2">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    step >= stepNum
                      ? "bg-gradient-to-r from-[#e3b8ff] to-[#6a2e8e] text-black"
                      : "bg-white/10 text-white/60 border border-white/20"
                  }`}
                >
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div
                    className={`w-8 h-0.5 mx-2 transition-all duration-300 ${
                      step > stepNum
                        ? "bg-gradient-to-r from-[#e3b8ff] to-[#6a2e8e]"
                        : "bg-white/20"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
          {/* Content Area */}
          <div className="p-8 md:p-12">
            <div className="min-h-[500px]">
              <BotModal opened={success} open={setSuccess} />

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
