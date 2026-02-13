"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GetFearAndGreed } from "../api/ApiWrapper";
import { usePing } from "../providers";
import { Activity, TrendingUp, TrendingDown, Gauge, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Analytics() {
  const ping = usePing();
  const [fng, setFng] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!ping) return;
    fetchFNG();
  }, [ping]);

  function fetchFNG() {
    setLoading(true);
    GetFearAndGreed(
      (data) => {
        setFng(data);
        setLoading(false);
        setRefreshing(false);
      },
      (err) => {
        console.error("Failed to fetch FNG:", err);
        setLoading(false);
        setRefreshing(false);
      }
    );
  }

  function handleRefresh() {
    setRefreshing(true);
    fetchFNG();
  }

  function getFNGColor(value) {
    if (value <= 24) return { bg: "bg-red-500", text: "text-red-400", glow: "shadow-red-500/20" };
    if (value <= 49) return { bg: "bg-orange-500", text: "text-orange-400", glow: "shadow-orange-500/20" };
    if (value === 50) return { bg: "bg-yellow-500", text: "text-yellow-400", glow: "shadow-yellow-500/20" };
    if (value <= 74) return { bg: "bg-lime-500", text: "text-lime-400", glow: "shadow-lime-500/20" };
    return { bg: "bg-green-500", text: "text-green-400", glow: "shadow-green-500/20" };
  }

  function getFNGEmoji(value) {
    if (value <= 24) return "😱";
    if (value <= 49) return "😰";
    if (value === 50) return "😐";
    if (value <= 74) return "😀";
    return "🤑";
  }

  // Authentication check
  if (!ping) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-6 text-white">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/20 blur-[150px]" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center"
        >
          <Image
            src="/padlock.png"
            alt="Locked"
            width={180}
            height={180}
            className="mx-auto mb-8 drop-shadow-[0_0_40px_rgba(168,85,247,0.4)]"
          />
          <h1 className="mb-3 bg-gradient-to-br from-white to-white/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
            Authentication Required
          </h1>
          <p className="mx-auto max-w-md text-white/60">
            Please log in to view analytics
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl bg-white px-8 py-3 font-semibold text-black shadow-[0_8px_24px_rgba(255,255,255,0.2)] transition"
              >
                Log in
              </motion.button>
            </Link>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl border border-white/10 bg-white/5 px-8 py-3 font-semibold transition hover:bg-white/10"
              >
                Register
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const fngValue = fng?.value || 0;
  const fngClass = fng?.class || "Unknown";
  const colors = getFNGColor(fngValue);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black" />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="mb-3 bg-gradient-to-br from-white to-white/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
            Analytics
          </h1>
          <p className="text-lg text-white/50">
            Market sentiment and indicators
          </p>
        </motion.header>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Fear & Greed Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
                  <Gauge className="h-6 w-6 text-white/60" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Fear & Greed Index</h2>
                  <p className="text-sm text-white/40">Market sentiment indicator</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              </motion.button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                <p className="mt-4 text-white/40">Loading...</p>
              </div>
            ) : (
              <>
                {/* Gauge Display */}
                <div className="mb-8 flex flex-col items-center">
                  <div className="relative mb-6">
                    {/* Background ring */}
                    <div className="h-48 w-48 rounded-full border-8 border-white/10" />
                    
                    {/* Value display */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-bold">{fngValue}</span>
                      <span className="text-2xl">{getFNGEmoji(fngValue)}</span>
                    </div>
                    
                    {/* Glow effect */}
                    <div className={`absolute inset-0 rounded-full ${colors.bg} opacity-10 blur-xl`} />
                  </div>
                  
                  <span className={`rounded-full px-6 py-2 text-lg font-semibold ${colors.bg}/20 ${colors.text}`}>
                    {fngClass}
                  </span>
                </div>

                {/* Scale */}
                <div className="mb-6">
                  <div className="relative h-3 overflow-hidden rounded-full bg-white/10">
                    <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-red-500 to-orange-500" />
                    <div className="absolute inset-y-0 left-1/4 w-1/4 bg-gradient-to-r from-orange-500 to-yellow-500" />
                    <div className="absolute inset-y-0 left-2/4 w-1/4 bg-gradient-to-r from-yellow-500 to-lime-500" />
                    <div className="absolute inset-y-0 left-3/4 w-1/4 bg-gradient-to-r from-lime-500 to-green-500" />
                    
                    {/* Indicator */}
                    <motion.div
                      initial={{ left: 0 }}
                      animate={{ left: `${fngValue}%` }}
                      transition={{ type: "spring", stiffness: 100 }}
                      className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-white shadow-lg"
                    />
                  </div>
                  
                  <div className="mt-2 flex justify-between text-xs text-white/40">
                    <span>Extreme Fear</span>
                    <span>Fear</span>
                    <span>Neutral</span>
                    <span>Greed</span>
                    <span>Extreme Greed</span>
                  </div>
                </div>

                {/* Info */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-start gap-3">
                    <Activity className="mt-0.5 h-5 w-5 text-white/40" />
                    <div className="text-sm text-white/60">
                      {fngValue <= 24 && (
                        <p>Market is in <strong className="text-red-400">Extreme Fear</strong>. Historically a good time to buy as investors are overly worried.</p>
                      )}
                      {fngValue > 24 && fngValue <= 49 && (
                        <p>Market shows <strong className="text-orange-400">Fear</strong>. Investors are cautious, potential buying opportunities may exist.</p>
                      )}
                      {fngValue === 50 && (
                        <p>Market is <strong className="text-yellow-400">Neutral</strong>. No strong sentiment in either direction.</p>
                      )}
                      {fngValue > 50 && fngValue <= 74 && (
                        <p>Market shows <strong className="text-lime-400">Greed</strong>. Investors are optimistic, be cautious of overvaluation.</p>
                      )}
                      {fngValue > 74 && (
                        <p>Market is in <strong className="text-green-400">Extreme Greed</strong>. High risk of correction, consider taking profits.</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* Coming Soon Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            {/* Placeholder Card 1 */}
            <div className="flex-1 rounded-[32px] border border-dashed border-white/20 bg-white/[0.02] p-8">
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                  <TrendingUp className="h-8 w-8 text-white/20" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white/60">Market Dominance</h3>
                <p className="text-sm text-white/40">Coming soon</p>
              </div>
            </div>

            {/* Placeholder Card 2 */}
            <div className="flex-1 rounded-[32px] border border-dashed border-white/20 bg-white/[0.02] p-8">
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                  <TrendingDown className="h-8 w-8 text-white/20" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white/60">Volume Analysis</h3>
                <p className="text-sm text-white/40">Coming soon</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}