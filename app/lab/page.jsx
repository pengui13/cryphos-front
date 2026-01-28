"use client";

import { useState, useEffect } from "react";
import ConfigureBot from "./ConfigureBot";
import AssetsBlock from "./AssetsBlock";
import Snackbar from "../components/Snackbar";
import {
  CreateBot,
  GetBillingStatus,
  CreateStripeCheckoutSession,
} from "../api/ApiWrapper";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePing } from "../layout";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

// Result Modal Component
function ResultModal({ isOpen, onClose, success, message }) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#16161f] p-6 shadow-2xl"
          >
            {/* Icon */}
            <div className="flex justify-center mb-4">
              {success ? (
                <div className="h-16 w-16 rounded-full bg-green-500/10 grid place-items-center">
                  <svg
                    className="h-8 w-8 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              ) : (
                <div className="h-16 w-16 rounded-full bg-red-500/10 grid place-items-center">
                  <svg
                    className="h-8 w-8 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-center text-white mb-2">
              {success ? "Bot Created Successfully!" : "Creation Failed"}
            </h2>

            {/* Message */}
            <p className="text-white/60 text-center text-sm mb-6">
              {success
                ? "Your trading bot is now active and ready to analyze the market."
                : message || "Something went wrong. Please try again."}
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              {success ? (
                <>
                  <button
                    onClick={() => router.push("/bots")}
                    className="flex-1 rounded-xl bg-[#e3b8ff] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#d4a8ff]"
                  >
                    View My Bot
                  </button>
                  <button
                    onClick={onClose}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10"
                  >
                    Close
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10"
                >
                  Try Again
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

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
  const [description, setDescription] = useState("");
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [step, setStep] = useState(1);
  const [botSettings, setBotSettings] = useState({});
  const [error, setError] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [balanceSettings, setBalanceSettings] = useState({
    amount: "",
    tpSlValues: [-50, 100],
  });

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

  useEffect(() => {
    setBotSettings((prev) => ({
      ...prev,
      name,
      description,
      bot_assets: selectedSymbols,
      portfolio_volume: balanceSettings.amount,
      stop_loss: balanceSettings.tpSlValues[0],
      take_profit: balanceSettings.tpSlValues[1],
    }));
  }, [name, description, selectedSymbols, balanceSettings]);

  const totalSteps = 2;
  const titles = {
    1: "Select assets",
    2: "Configure indicators",
  };

  const progressPct =
    totalSteps > 1 ? ((step - 1) / (totalSteps - 1)) * 100 : 0;

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

  if (billing.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f1115] text-white/70 animate-pulse">
        Loading your subscription...
      </div>
    );
  }

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

  return (
    <div className="relative min-h-screen bg-[#0f1115] text-zinc-100">
      <Snackbar data={snackData} />
      
      {/* Result Modal */}
      <ResultModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        success={modalSuccess}
        message={modalMessage}
      />

      <div className="mx-auto w-full max-w-6xl flex flex-col items-center justify-center px-6 py-10">
        {/* HEADER */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">
            {titles[step]}
          </h1>
          <p className="mt-2 text-white/70">Build your strategy in 2 steps.</p>

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

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-[28px] overflow-hidden border w-full max-w-[900px] border-white/10 bg-white/[0.08] backdrop-blur-xl shadow-xl"
        >
          <div className="p-6 min-h-[500px] w-full">
            {step === 1 ? (
              <AssetsBlock
                step={step}
                setStep={setStep}
                selectedSymbols={selectedSymbols}
                setSelectedSymbols={setSelectedSymbols}
                botSettings={botSettings}
                setBotSettings={setBotSettings}
              />
            ) : (
              <ConfigureBot
                step={step}
                setStep={setStep}
                botSettings={botSettings}
                setBotSettings={setBotSettings}
                onCreateBot={() => {
                  return new Promise((resolve, reject) => {
                    CreateBot(
                      botSettings,
                      () => {
                        setModalSuccess(true);
                        setModalMessage("");
                        setModalOpen(true);
                        resolve();
                      },
                      (err) => {
                        setModalSuccess(false);
                        setModalMessage(err || "Failed to create bot");
                        setModalOpen(true);
                        reject(err);
                      }
                    );
                  });
                }}
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