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
import { usePing } from "../providers";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useLang } from "../LanguageContext";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function ResultModal({ isOpen, onClose, success, message }) {
  const router = useRouter();
  const { t } = useLang();

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative z-10 w-full max-w-md"
          >
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] blur-xl" />
            <div className="relative rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
              <div className="flex justify-center mb-6">
                {success ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 grid place-items-center border border-green-500/20"
                  >
                    <svg className="h-8 w-8 sm:h-10 sm:w-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 grid place-items-center border border-red-500/20"
                  >
                    <svg className="h-8 w-8 sm:h-10 sm:w-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.div>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-center text-white mb-3">
                {success ? t("bots.botCreated") : t("bots.creationFailed")}
              </h2>
              <p className="text-white/60 text-center text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
                {success ? t("bots.botActive") : message || t("bots.somethingWrong")}
              </p>

              <div className="flex gap-3">
                {success ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push("/bots")}
                      className="flex-1 rounded-2xl bg-white px-4 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-black shadow-[0_8px_24px_rgba(255,255,255,0.2)] transition"
                    >
                      {t("bots.viewMyBots")}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onClose}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 sm:px-6 py-3 sm:py-3.5 text-sm font-medium text-white/70 transition hover:bg-white/10"
                    >
                      {t("bots.close")}
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-white/70 transition hover:bg-white/10"
                  >
                    {t("bots.tryAgain")}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function BotsFactory() {
  const ping = usePing();
  const { t } = useLang();

  const [snackData, setSnackData] = useState({ visible: false, status: false, type: "prime", info: "" });
  const [billing, setBilling] = useState({ loading: true, isActive: false, status: null, bots_count: 0 });
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [step, setStep] = useState(1);
  const [botSettings, setBotSettings] = useState({});
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const titles = {
    1: t("bots.selectAssets"),
    2: t("bots.configureIndicators"),
  };

  useEffect(() => {
    if (!ping) return;
    setBilling((p) => ({ ...p, loading: true }));
    GetBillingStatus(
      (data) => setBilling({ loading: false, isActive: data.is_active, status: data.status, bots_count: data.bots_count ?? 0 }),
      (err) => {
        console.error(err);
        setBilling((p) => ({ ...p, loading: false }));
        setSnackData({ visible: true, status: false, type: "prime", info: t("bots.loadingStatus") });
      }
    );
  }, [ping]);

  const handleSubscribe = () => {
    CreateStripeCheckoutSession(
      (data) => {
        if (data?.url) window.location.href = data.url;
        else setSnackData({ visible: true, status: false, type: "prime", info: data?.error || "Could not create checkout session" });
      },
      (err) => {
        console.error(err);
        setSnackData({ visible: true, status: false, type: "prime", info: "Could not start Stripe checkout" });
      }
    );
  };

  function handleStep(nextStep) {
    setError("");
    if (step === 1 && selectedSymbols.length === 0) { setError(t("bots.atLeastOneAsset")); return; }
    if (step === 2) {
      const noIndicators = !botSettings.rsi && !botSettings.bb && !botSettings.sr;
      if (noIndicators) { setError(t("bots.atLeastOneIndicator")); return; }
    }
    setStep(nextStep);
  }

  useEffect(() => {
    if (error) setSnackData({ visible: true, info: error, status: false, type: "prime" });
  }, [error]);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 2500);
    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    setBotSettings((prev) => ({ ...prev, bot_assets: selectedSymbols }));
  }, [selectedSymbols]);

  const totalSteps = 2;
  const progressPct = totalSteps > 1 ? ((step - 1) / (totalSteps - 1)) * 100 : 0;

  if (!ping) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-6 text-white">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/20 blur-[120px]" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative text-center">
          <Image src="/padlock.png" alt="Locked" width={140} height={140} className="mx-auto mb-6 drop-shadow-[0_0_40px_rgba(168,85,247,0.4)]" />
          <h1 className="mb-3 bg-gradient-to-br from-white to-white/60 bg-clip-text text-3xl sm:text-4xl font-bold tracking-tight text-transparent">
            {t("bots.authRequired")}
          </h1>
          <p className="mx-auto max-w-md text-white/60 text-sm sm:text-base">{t("bots.loginToAccess")}</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/login">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="rounded-2xl bg-white px-6 sm:px-8 py-3 font-semibold text-black shadow-[0_8px_24px_rgba(255,255,255,0.2)] transition">
                {t("auth.login")}
              </motion.button>
            </Link>
            <Link href="/register">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="rounded-2xl border border-white/10 bg-white/5 px-6 sm:px-8 py-3 font-semibold transition hover:bg-white/10">
                {t("auth.signup")}
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (billing.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white/70">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-purple-500" />
          <div>{t("bots.loadingStatus")}</div>
        </div>
      </div>
    );
  }

  if (false) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-6 text-white">
        <Snackbar data={snackData} />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/20 blur-[120px]" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-lg">
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] blur-xl" />
          <div className="relative rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent p-8 sm:p-10 backdrop-blur-2xl shadow-2xl">
            <h1 className="mb-3 text-center text-2xl sm:text-3xl font-bold">{t("bots.unlockFactory")}</h1>
            <p className="mb-8 text-center text-white/60 text-sm sm:text-base">{t("bots.subscribeToCreate")}</p>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubscribe} className="w-full rounded-2xl bg-white px-8 py-4 font-semibold text-black shadow-[0_8px_24px_rgba(255,255,255,0.2)] transition">
              {t("bots.subscribeStripe")}
            </motion.button>
            <p className="mt-4 text-center text-xs text-white/40">{t("bots.securePayments")}</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (billing.bots_count > 0) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-6 text-white">
        <Snackbar data={snackData} />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/20 blur-[120px]" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-lg text-center">
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] blur-xl" />
          <div className="relative rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent p-8 sm:p-10 backdrop-blur-2xl shadow-2xl">
            <h1 className="mb-3 text-2xl sm:text-3xl font-bold">{t("bots.botLimitReached")}</h1>
            <p className="mb-2 text-white/60 text-sm sm:text-base">
              {t("bots.planAllows")} <strong className="text-white">{t("bots.oneBot")}</strong>
            </p>
            <p className="mb-8 text-sm text-white/50">{t("bots.alreadyActive")}</p>
            <Link href="/bots">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="rounded-2xl bg-white px-8 py-3 font-semibold text-black shadow-[0_8px_24px_rgba(255,255,255,0.2)] transition">
                {t("bots.viewMyBots")}
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black" />
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div animate={{ x: [0, 30, 0], y: [0, -30, 0] }} transition={{ duration: 25, repeat: Infinity }}
          className="absolute left-[10%] top-[10%] h-[250px] w-[250px] sm:h-[400px] sm:w-[400px] rounded-full bg-purple-500/15 blur-[100px] sm:blur-[120px]" />
        <motion.div animate={{ x: [0, -30, 0], y: [0, 30, 0] }} transition={{ duration: 30, repeat: Infinity }}
          className="absolute right-[10%] bottom-[10%] h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-pink-500/10 blur-[100px] sm:blur-[120px]" />
      </div>

      <Snackbar data={snackData} />
      <ResultModal isOpen={modalOpen} onClose={() => setModalOpen(false)} success={modalSuccess} message={modalMessage} />

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-16">
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 sm:mb-12 w-full text-center">
          <h1 className="mb-3 bg-gradient-to-br from-white to-white/60 bg-clip-text text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-transparent">
            {titles[step]}
          </h1>
          <p className="text-sm sm:text-lg text-white/60">{t("bots.buildStrategy")}</p>

          <div className="mx-auto mt-8 sm:mt-10 w-full max-w-3xl">
            <div className="mb-4 sm:mb-6 flex justify-between gap-2 sm:gap-4">
              {Object.entries(titles).map(([stepNum, title], i) => {
                const isActive = parseInt(stepNum) === step;
                const isCompleted = parseInt(stepNum) < step;
                return (
                  <div key={i} className="flex flex-1 flex-col items-center text-center">
                    <div className={`mb-2 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all ${
                      isCompleted ? "bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                      : isActive ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-[0_0_30px_rgba(168,85,247,0.6)]"
                      : "border border-white/10 bg-white/5 text-white/40"
                    }`}>
                      {isCompleted ? "✓" : stepNum}
                    </div>
                    <div className={`text-xs sm:text-sm font-medium transition-colors leading-tight ${isActive ? "text-white" : "text-white/40"}`}>
                      {title}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="relative h-1.5 sm:h-2 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="absolute bottom-0 left-0 top-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.header>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-4xl">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-[32px] border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-2xl shadow-2xl">
            <div className="min-h-[500px] sm:min-h-[600px] p-4 sm:p-8">
              {step === 1 ? (
                <AssetsBlock
                  step={step}
                  setStep={handleStep}
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
                  onCreateBot={() => new Promise((resolve, reject) => {
                    CreateBot(
                      botSettings,
                      () => { setModalSuccess(true); setModalMessage(""); setModalOpen(true); resolve(); },
                      (err) => { setModalSuccess(false); setModalMessage(err || "Failed to create bot"); setModalOpen(true); reject(err); }
                    );
                  })}
                />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}