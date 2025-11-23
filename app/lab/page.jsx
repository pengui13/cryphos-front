"use client";

import { useState, useEffect } from "react";
import ConfigureBot from "./ConfigureBot";
import AssetsBlock from "./AssetsBlock";
import ConfigureTg from "./ConfigureTg";
import Snackbar from "../components/Snackbar";
import { CreateBot, GetBillingStatus, CreateStripeCheckoutSession } from "../api/ApiWrapper";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePing } from "../layout";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function BotsFactory() {
  const [snackData, setSnackData] = useState({
    visible: false,
    status: false,
    type: "prime",
    info: "",
  });

  const ping = usePing();

  const [billing, setBilling] = useState({
    loading: true,
    isActive: false,
    status: null,
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

  const [balanceSettings, setBalanceSettings] = useState({
    amount: "",
    tpSlValues: [-50, 100],
  });

  /* ---------------- Subscription: load billing status ---------------- */

  useEffect(() => {
    if (!ping) return; // not logged in -> handled below

    setBilling((prev) => ({ ...prev, loading: true }));

    GetBillingStatus(
      (data) => {
        setBilling({
          loading: false,
          isActive: data.is_active,
          status: data.status,
        });
      },
      (err) => {
        console.error(err);
        setBilling((prev) => ({ ...prev, loading: false }));
        setSnackData({
          visible: true,
          status: false,
          type: "prime",
          info: "Failed to load subscription status",
        });
      }
    );
  }, [ping]);

const handleSubscribe = () => {
  CreateStripeCheckoutSession(
    (data) => {
      if (data && data.url) {
        window.location.href = data.url; // 🔥 just go to Stripe Checkout
      } else {
        setSnackData({
          visible: true,
          status: false,
          type: "prime",
          info: data?.error || "Could not create checkout session",
        });
      }
    },
    (err) => {
      console.error(err);
      setSnackData({
        visible: true,
        status: false,
        type: "prime",
        info: "Could not start Stripe checkout",
      });
    }
  );
};


  function handleStep(nextStep) {
    setError("");
    if (step === 1) {
      if (selectedSymbols.length === 0) {
        setError("Select at least 1 asset");
        return;
      }
    } else if (step === 2) {
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

  useEffect(() => {
    if (error)
      setSnackData({
        visible: true,
        info: error,
        status: false,
        type: "prime",
      });
  }, [error]);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 2500);
    return () => clearTimeout(timer);
  }, [error]);

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

  const totalSteps = 3;
  const stepTitles = {
    1: "Select assets",
    2: "Configure indicators",
    3: "Connect Telegram",
  };
  const clamped = Math.min(Math.max(step, 1), totalSteps);
  const progressPct =
    totalSteps > 1 ? ((clamped - 1) / (totalSteps - 1)) * 100 : 0;
  const segments = Array.from({ length: totalSteps - 1 }, (_, i) => i + 1);

  /* ----------------- RENDERING --------------------------------------- */

  if (!ping) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f1115] text-zinc-100 px-6">
        <div className="flex flex-col items-center gap-6">
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-center">
            You are not authorized
          </h1>
          <p className="text-white/60 text-center max-w-md">
            Please log in to unlock this page and continue using Cryphos.
          </p>
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

  if (billing.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f1115] text-zinc-100">
        <div className="animate-pulse text-white/70">
          Loading your subscription...
        </div>
      </div>
    );
  }

  if (!billing.isActive) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f1115] text-zinc-100 px-6">
        <Snackbar data={snackData} />

        <div className="max-w-lg w-full rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-[0_10px_60px_-20px_rgba(0,0,0,0.6)]">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-center">
            Unlock Cryphos Bot Factory
          </h1>
          <p className="mt-3 text-white/70 text-center">
            Create and run automated trading strategies.
            <br />
            Activate your subscription to start building bots.
          </p>

          {billing.status && (
            <p className="mt-2 text-xs text-center text-white/40">
              Current status:{" "}
              <span className="font-mono">{billing.status}</span>
            </p>
          )}

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleSubscribe}
              className="px-8 py-3 rounded-xl bg-[#e3b8ff] text-black font-semibold hover:bg-[#d7a8ff] hover:-translate-y-0.5 active:translate-y-0 transition shadow-lg"
            >
              Subscribe with Stripe
            </button>
          </div>

          <p className="mt-4 text-xs text-center text-white/40">
            Secure payments powered by Stripe. Cancel anytime.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0f1115] text-zinc-100">
      <Snackbar data={snackData} />

      <div className="mx-auto w/full max-w-6xl px-6 py-10">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {stepTitles[step]}
          </h1>
          <p className="mt-2 text-white/70">
            Build your strategy in three quick steps.
          </p>

          <div className="mx-auto mt-6 w-full max-w-2xl">
            <div
              className="mb-2 grid text-[11px] text-white/70"
              style={{
                gridTemplateColumns: `repeat(${totalSteps}, minmax(0,1fr))`,
              }}
            >
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((n) => (
                <div key={n} className="truncate">
                  {stepTitles[n]}
                </div>
              ))}
            </div>

            <div className="relative h-2 overflow-hidden rounded-full border border-white/10 bg-white/5">
              {segments.map((n) => (
                <span
                  key={n}
                  className="absolute top-0 bottom-0 w-px bg-white/15"
                  style={{ left: `${(n / totalSteps) * 100}%` }}
                  aria-hidden="true"
                />
              ))}
              <div
                className="h-full rounded-full bg-[#e3b8ff] transition-[width] duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="mt-2 text-center text-white/60 text-sm">
              Step {clamped} of {totalSteps}
            </div>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.995 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="rounded-[28px] border border-white/10 bg-white/8 shadow-[0_10px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl overflow-hidden"
        >
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
                  onCreateBot={() =>
                    CreateBot(botSettings, setSuccess, setError)
                  }
                  setTgNickname={setTgNickname}
                />
              )}
            </div>
          </div>

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
  );
}
