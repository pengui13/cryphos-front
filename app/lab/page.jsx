"use client";

import { useState, useEffect } from "react";
import ConfigureBot from "./ConfigureBot";
import AssetsBlock from "./AssetsBlock";
import ConfigureTg from "./ConfigureTg";
import Snackbar from "../components/Snackbar";
import {
  CreateBot,
  GetBillingStatus,
  CreateStripeCheckoutSession,
} from "../api/ApiWrapper";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePing } from "../layout";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function BotsFactory() {
  const ping = usePing();

  const [snackData, setSnackData] = useState({
    visible: false,
    status: false,
    type: "prime",
    info: "",
  });

  const [billing, setBilling] = useState({
    loading: true,
    isActive: false,
    status: null,
    bots_count: 0,
  });

  // wizard state
  const [name, setName] = useState("");
  const [tgNickname, setTgNickname] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [step, setStep] = useState(1);
  const [botSettings, setBotSettings] = useState({});
  const [error, setError] = useState("");

  const [balanceSettings, setBalanceSettings] = useState({
    amount: "",
    tpSlValues: [-50, 100],
  });

  /* -----------------------------------------------------------
     LOAD BILLING (WITH bots_count)
  ----------------------------------------------------------- */
  useEffect(() => {
    if (!ping) return;

    setBilling((p) => ({ ...p, loading: true }));

    GetBillingStatus(
      (data) => {
        setBilling({
          loading: false,
          isActive: data.is_active,
          status: data.status,
          bots_count: data.bots_count ?? 0,
        });
      },
      (err) => {
        console.error(err);
        setBilling((p) => ({ ...p, loading: false }));
        setSnackData({
          visible: true,
          status: false,
          type: "prime",
          info: "Failed to load subscription status",
        });
      }
    );
  }, [ping]);

  /* -----------------------------------------------------------
     HANDLE SUBSCRIPTION
  ----------------------------------------------------------- */
  const handleSubscribe = () => {
    CreateStripeCheckoutSession(
      (data) => {
        if (data?.url) {
          window.location.href = data.url;
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

  /* -----------------------------------------------------------
     WIZARD STEP VALIDATION
  ----------------------------------------------------------- */
  function handleStep(nextStep) {
    setError("");

    if (step === 1 && selectedSymbols.length === 0) {
      setError("Select at least 1 asset");
      return;
    }

    if (step === 2) {
      const noIndicators =
        !botSettings.rsi &&
        !botSettings.ma &&
        !botSettings.fg &&
        !botSettings.obv &&
        !botSettings.art &&
        !botSettings.macd &&
        !botSettings.bb;

      if (noIndicators) {
        setError("Select at least one indicator");
        return;
      }
    }

    setStep(nextStep);
  }

  /* -----------------------------------------------------------
     ERROR → SNACK
  ----------------------------------------------------------- */
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
    const t = setTimeout(() => setError(""), 2500);
    return () => clearTimeout(t);
  }, [error]);

  /* -----------------------------------------------------------
     UPDATE FINAL BOT SETTINGS STRUCTURE
  ----------------------------------------------------------- */
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

  /* -----------------------------------------------------------
     UI ELEMENTS CONFIG
  ----------------------------------------------------------- */
  const totalSteps = 3;
  const titles = {
    1: "Select assets",
    2: "Configure indicators",
    3: "Connect Telegram",
  };

  const progressPct =
    totalSteps > 1 ? ((step - 1) / (totalSteps - 1)) * 100 : 0;

  /* -----------------------------------------------------------
     RENDERING LOGIC
  ----------------------------------------------------------- */

  // Not logged in
  if (!ping) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f1115] text-zinc-100 px-6">
        <Image
          src="/padlock.png"
          alt="Locked"
          width={220}
          height={220}
          className="drop-shadow-[0_0_25px_rgba(227,184,255,0.25)]"
        />

        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-6">
          You are not authorized
        </h1>
        <p className="text-white/60 text-center max-w-md mt-2">
          Please log in to unlock this page.
        </p>

        <div className="flex gap-3 mt-5">
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl bg-[#e3b8ff] text-black font-semibold hover:bg-[#d7a8ff] transition"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl border border-white/15 bg-white/5 text-white hover:bg-white/10 transition"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  // Loading state
  if (billing.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f1115] text-white/70 animate-pulse">
        Loading your subscription...
      </div>
    );
  }

  // No subscription → Paywall
  if (!billing.isActive) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f1115] text-zinc-100 px-6">
        <Snackbar data={snackData} />

        <div className="max-w-lg w-full rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-lg">
          <h1 className="text-3xl font-extrabold text-center">
            Unlock Cryphos Bot Factory
          </h1>

          <p className="mt-3 text-white/70 text-center">
            Create and run automated crypto strategies.
          </p>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleSubscribe}
              className="px-8 py-3 rounded-xl bg-[#e3b8ff] text-black font-semibold hover:bg-[#d7a8ff] transition"
            >
              Subscribe with Stripe
            </button>
          </div>

          <p className="mt-4 text-xs text-center text-white/40">
            Secure payments powered by Stripe.
          </p>
        </div>
      </div>
    );
  }

  /* -----------------------------------------------------------
     🚫 USER ALREADY HAS 1 BOT
  ----------------------------------------------------------- */
  if (billing.bots_count > 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f1115] text-zinc-100 px-6">
        <Snackbar data={snackData} />

        <div className="max-w-lg w-full rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-lg text-center">
          <h1 className="text-3xl font-extrabold">Bot Limit Reached</h1>

          <p className="mt-3 text-white/70">
            Your current subscription allows <strong>1 bot</strong> per user.
          </p>

          <p className="mt-1 text-white/50 text-sm">
            You already have an active bot running.
          </p>

          <div className="mt-6">
            <Link
              href="/bots"
              className="px-6 py-3 rounded-xl bg-[#e3b8ff] text-black font-semibold hover:bg-[#d7a8ff] transition"
            >
              Go to My Bot
            </Link>
          </div>

        </div>
      </div>
    );
  }

  /* -----------------------------------------------------------
     ✅ USER CAN CREATE A BOT (0 bots)
  ----------------------------------------------------------- */
  return (
    <div className="relative min-h-screen bg-[#0f1115] text-zinc-100">
      <Snackbar data={snackData} />

      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        {/* HEADER */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">
            {titles[step]}
          </h1>
          <p className="mt-2 text-white/70">Build your strategy in 3 steps.</p>

          {/* Progress bar */}
          <div className="mx-auto mt-6 w-full max-w-2xl">
            <div className="flex justify-between text-[11px] text-white/70 mb-2">
              {Object.values(titles).map((t, i) => (
                <span key={i}>{t}</span>
              ))}
            </div>

            <div className="relative h-2 overflow-hidden rounded-full border border-white/10 bg-white/5">
              <div
                className="absolute top-0 bottom-0 bg-[#e3b8ff] rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="text-center text-white/60 text-sm mt-2">
              Step {step} of {totalSteps}
            </div>
          </div>
        </header>

        {/* MAIN WIZARD */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-[28px] overflow-hidden border border-white/10 bg-white/8 backdrop-blur-xl shadow-xl"
        >
          <div className="p-6 md:p-10 min-h-[500px]">
            {step === 1 ? (
              <AssetsBlock
                step={step}
                setStep={setStep}
                selectedSymbols={selectedSymbols}
                setSelectedSymbols={setSelectedSymbols}
                botSettings={botSettings}
                setBotSettings={setBotSettings}
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
                step={step}
                setStep={setStep}
                tgNickname={tgNickname}
                setTgNickname={setTgNickname}
                onCreateBot={() => CreateBot(botSettings, () => {}, setError)}
              />
            )}
          </div>

          <div className="px-6 md:px-10 py-5 border-t border-white/10 bg-white/5">
            <div className="text-center text-white/60 text-sm">
              Step {step} of {totalSteps}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
