"use client";
import ProgressSteps from "./ProgressSteps";
import { useState, useEffect } from "react";
import BotModal from "./BotModal";
import Basic from "./Basic";
import AssetsBlock from "./AssetsBlock";
import Snackbar from "../components/Snackbar";
export default function BotsFactory() {
  const [snackData, setSnackData] = useState({
    visible: false,
    status: false,
    type: "prime",
    info: "",
  });
  const [name, setName] = useState("");
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
      if (!name.trim()) {
        setError("Name is missing");
        return;
      } else if (!description.trim()) {
        setError("Description is missing");
        return;
      }
    } else if (step == 2) {
      if (selectedSymbols.length == 0) {
        setError("Select at least 1 asset");
        return;
      }
    } else if (step == 3) {
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

      // Include balance settings
      newSettings.portfolio_volume = balanceSettings.amount;
      newSettings.stop_loss = balanceSettings.tpSlValues[0];
      newSettings.take_profit = balanceSettings.tpSlValues[1];

      return newSettings;
    });
  }, [name, description, selectedSymbols, balanceSettings]);

  const totalSteps = 4;

  return (
    <div className="flex flex-col md:flex-row w-full items-start  pt-[200px]   justify-center h-screen bg-gradient-to-r from-[#0a1620] to-black overflow-hidden">
      <Snackbar data={snackData} />

      <div className="flex w-full px-4 max-w-[1400px] flex-col gap-5">
        <div className="flex  lg:items-start items-center justify-center gap-5 w-full">
          <div
            className="relative w-full max-w-md rounded-2xl p-8 shadow-lg"
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <ProgressSteps currentStep={step} totalSteps={totalSteps} />
            <BotModal opened={success} open={setSuccess} />
            {step === 1 ? (
              <Basic
                name={name}
                coverImage={coverImage}
                setCoverImage={setCoverImage}
                setName={setName}
                description={description}
                setDescription={setDescription}
                setBotSettings={setBotSettings}
                botSettings={botSettings}
              />
            ) : step === 2 ? (
              <AssetsBlock
                selectedSymbols={selectedSymbols}
                setSelectedSymbols={setSelectedSymbols}
                setBotSettings={setBotSettings}
                botSettings={botSettings}
              />
            ) : step === 3 ? (
              <ConfigureBot
                botSettings={botSettings}
                setBotSettings={setBotSettings}
              />
            ) : (
              <ConfigureBalance
                balanceSettings={balanceSettings}
                setBalanceSettings={setBalanceSettings}
              />
            )}
            <div className="flex items-center gap-[10px]">
              {step !== 1 && (
                <button transparent={true} onClick={() => setStep(step - 1)}>
                  {"back"}
                </button>
              )}

              <button
                onClick={() =>
                  step == totalSteps
                    ? CreateBot(botSettings, setSuccess, setError)
                    : handleStep((prev) => Math.min(prev + 1, totalSteps))
                }
                disabled={step === totalSteps && !botSettings.portfolio_volume}
              >
                {step === totalSteps ? "createBot" : "nextStep"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
