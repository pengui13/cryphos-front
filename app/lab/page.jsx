"use client";

import { useState, useEffect } from "react";
import ConfigureBot from "./ConfigureBot";
import AssetsBlock from "./AssetsBlock";
import ConfigureTg from "./ConfigureTg";
import Snackbar from "../components/Snackbar";
import { CreateBot } from "../api/ApiWrapper";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePing } from "../layout";

export default function BotsFactory() {
  const [snackData, setSnackData] = useState({
    visible: false,
    status: false,
    type: "prime",
    info: "",
  }); 

    const ping = usePing();

  // Core state
  const [name, setName] = useState("");
  const [tgNickname, setTgNickname] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [step, setStep] = useState(1);
  const [botSettings, setBotSettings] = useState({});
  const [rsiEnabled, setRsiEnabled] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Balance block (if you show it elsewhere, it’s already wired here)
  const [balanceSettings, setBalanceSettings] = useState({
    amount: "",
    tpSlValues: [-50, 100], // [SL, TP]
  });

  function handleStep(nextStep) {
    setError("");
    if (step === 1) {
      if (selectedSymbols.length === 0) {
        setError("Select at least 1 asset");
        return;
      }
    } else if (step === 2) {
      // include FG in the “any indicator” check
      if (
        !botSettings.rsi &&
        !botSettings.ma &&
        !botSettings.fg &&
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

  // RSI defaults (kept for compatibility)
  const [rsiSettings, setRsiSettings] = useState({
    period: 14,
    max: 70,
    min: 30,
    intervals: ["1m"],
  });

  // Snackbar + transient errors
  useEffect(() => {
    if (error) setSnackData({ visible: true, info: error, status: false });
  }, [error]);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 2500);
    return () => clearTimeout(timer);
  }, [error]);

  // Sync general settings into botSettings
  useEffect(() => {
    setBotSettings((prev) => ({
      ...prev,
      name,
      description,
      bot_assets: selectedSymbols,
      tg_nickname: tgNickname,
      portfolio_volume: balanceSettings.amount,
      stop_loss: balanceSettings.tpSlValues[0],
      take_profit: balanceSettings.tpSlValues[1],
    }));
  }, [name, description, selectedSymbols, balanceSettings, tgNickname]);

  // Steps
  const totalSteps = 3;
  const stepTitles = {
    1: "Select assets",
    2: "Configure indicators",
    3: "Connect Telegram",
  };
  const clamped = Math.min(Math.max(step, 1), totalSteps);
  const progressPct = totalSteps > 1 ? ((clamped - 1) / (totalSteps - 1)) * 100 : 0;
  const segments = Array.from({ length: totalSteps - 1 }, (_, i) => i + 1);

  return (ping ?

    <div className="relative min-h-screen bg-[#0f1115] text-zinc-100">
  
      <Snackbar data={snackData} />

      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        {/* Header + progress */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{stepTitles[step]}</h1>
          <p className="mt-2 text-white/70">
            Build your strategy in three quick steps.
          </p>

          <div className="mx-auto mt-6 w-full max-w-2xl">
            {/* labels row */}
            <div
              className="mb-2 grid text-[11px] text-white/70"
              style={{ gridTemplateColumns: `repeat(${totalSteps}, minmax(0,1fr))` }}
            >
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((n) => (
                <div key={n} className="truncate">{stepTitles[n]}</div>
              ))}
            </div>

            {/* progress bar */}
            <div className="relative h-2 overflow-hidden rounded-full border border-white/10 bg-white/5">
              {/* segment ticks */}
              {segments.map((n) => (
                <span
                  key={n}
                  className="absolute top-0 bottom-0 w-px bg-white/15"
                  style={{ left: `${(n / totalSteps) * 100}%` }}
                  aria-hidden="true"
                />
              ))}
              {/* fill */}
              <div
                className="h-full rounded-full bg-[#e3b8ff] transition-[width] duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="mt-2 text-center text-white/60 text-sm">
              Step {clamped} of {totalSteps}
            </div>

            <div
              className="sr-only"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={totalSteps}
              aria-valuenow={clamped}
              aria-label="Step progress"
            />
          </div>
        </header>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.995 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="rounded-[28px] border border-white/10 bg-white/8 shadow-[0_10px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl overflow-hidden"
        >
          {/* Content area */}
          <div className="p-6 md:p-10">
            <div className="min-h-[500px]">
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
                  onCreateBot={() => CreateBot(botSettings, setSuccess, setError)}
                  setTgNickname={setTgNickname}
                />
              )}
            </div>
          </div>

          {/* Footer stripe */}
          <div className="px-6 md:px-10 py-5 border-t border-white/10 bg-white/5">
            <div className="flex items-center justify-center">
              <div className="text-white/60 text-sm">
                Step {step} of {totalSteps}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    :
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f1115] text-zinc-100 px-6">
      <div className="flex flex-col items-center gap-6">
        {/* Lock icon */}
        <div className="relative">
          <Image
            src="/padlock.png"
            alt="Locked"
            width={220}
            height={220}
            className="drop-shadow-[0_0_25px_rgba(227,184,255,0.25)]"
            priority
          />
        </div>

        {/* Message */}
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-center">
          You are not authorized
        </h1>
        <p className="text-white/60 text-center max-w-md">
          Please log in to unlock this page and continue using Cryphos.
        </p>

        {/* CTA */}
        <div className="flex gap-3 mt-4">
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl bg-[#e3b8ff] text-black font-semibold transition hover:bg-[#d7a8ff] hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring focus-visible:ring-[#e3b8ff]/60"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl border border-white/15 bg-white/5 text-white font-medium hover:bg-white/10 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
