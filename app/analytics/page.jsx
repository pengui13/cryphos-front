"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GetFearAndGreed, GetFundingRates } from "../api/ApiWrapper";
import { usePing } from "../providers";
import { 
  Activity, Gauge, RefreshCw, Percent, Clock, TrendingUp, TrendingDown, 
  Minus, HelpCircle, X, AlertTriangle, Zap, History
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Analytics() {
  const ping = usePing();
  const [fng, setFng] = useState(null);
  const [fundingRates, setFundingRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fundingLoading, setFundingLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFundingInfo, setShowFundingInfo] = useState(false);

  useEffect(() => {
    if (!ping) return;
    fetchFNG();
    fetchFundingRates();
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

  function fetchFundingRates() {
    setFundingLoading(true);
    GetFundingRates(
      (data) => {
        setFundingRates(Array.isArray(data) ? data : []);
        setFundingLoading(false);
      },
      (err) => {
        console.error("Failed to fetch funding rates:", err);
        setFundingLoading(false);
      }
    );
  }

  function handleRefresh() {
    setRefreshing(true);
    fetchFNG();
    fetchFundingRates();
  }

  function getFNGColor(value) {
    if (value <= 24) return { bg: "bg-red-500", text: "text-red-400" };
    if (value <= 49) return { bg: "bg-orange-500", text: "text-orange-400" };
    if (value === 50) return { bg: "bg-yellow-500", text: "text-yellow-400" };
    if (value <= 74) return { bg: "bg-lime-500", text: "text-lime-400" };
    return { bg: "bg-green-500", text: "text-green-400" };
  }

  function getFNGEmoji(value) {
    if (value <= 24) return "😱";
    if (value <= 49) return "😰";
    if (value === 50) return "😐";
    if (value <= 74) return "😀";
    return "🤑";
  }

  function getFundingData(rate) {
    const r = parseFloat(rate) * 100;
    if (r >= 0.075) return { 
      color: "text-red-400", 
      bg: "bg-red-500/10", 
      border: "border-red-500/20",
      label: "Hot",
      icon: TrendingUp
    };
    if (r >= 0.03) return { 
      color: "text-orange-400", 
      bg: "bg-orange-500/10", 
      border: "border-orange-500/20",
      label: "Warm",
      icon: TrendingUp
    };
    if (r <= -0.075) return { 
      color: "text-emerald-400", 
      bg: "bg-emerald-500/10", 
      border: "border-emerald-500/20",
      label: "Cold",
      icon: TrendingDown
    };
    if (r <= -0.03) return { 
      color: "text-cyan-400", 
      bg: "bg-cyan-500/10", 
      border: "border-cyan-500/20",
      label: "Cool",
      icon: TrendingDown
    };
    return { 
      color: "text-white/50", 
      bg: "bg-white/5", 
      border: "border-white/10",
      label: "Neutral",
      icon: Minus
    };
  }

  function getNextFundingTime(lastFundingTimestamp) {
    const EIGHT_HOURS = 8 * 60 * 60 * 1000;
    let next = lastFundingTimestamp;
    const now = Date.now();
    
    while (next <= now) {
      next += EIGHT_HOURS;
    }
    
    return next;
  }

  function getTimeUntilFunding(timestamp) {
    const next = getNextFundingTime(timestamp);
    const now = Date.now();
    const diff = next - now;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  function getTimeSinceLastFunding(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 0) return "just now";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m ago`;
    return `${minutes}m ago`;
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

  // Sort funding rates by absolute value (most extreme first)
  const sortedFundingRates = [...fundingRates].sort(
    (a, b) => Math.abs(parseFloat(b.rate)) - Math.abs(parseFloat(a.rate))
  );

  // Get extreme rates for summary
  const extremePositive = sortedFundingRates.filter(r => parseFloat(r.rate) * 100 >= 0.05);
  const extremeNegative = sortedFundingRates.filter(r => parseFloat(r.rate) * 100 <= -0.05);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black" />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex items-center justify-between"
        >
          <div>
            <h1 className="mb-3 bg-gradient-to-br from-white to-white/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
              Analytics
            </h1>
            <p className="text-lg text-white/50">
              Market sentiment and funding rates
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10"
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
          </motion.button>
        </motion.header>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Fear & Greed Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl"
          >
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
                <Gauge className="h-6 w-6 text-white/60" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Fear & Greed Index</h2>
                <p className="text-sm text-white/40">Market sentiment</p>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            ) : (
              <>
                <div className="mb-8 flex flex-col items-center">
                  <div className="relative mb-6">
                    <div className="h-48 w-48 rounded-full border-8 border-white/10" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-bold">{fngValue}</span>
                      <span className="text-2xl">{getFNGEmoji(fngValue)}</span>
                    </div>
                    <div className={`absolute inset-0 rounded-full ${colors.bg} opacity-10 blur-xl`} />
                  </div>
                  
                  <span className={`rounded-full px-6 py-2 text-lg font-semibold ${colors.bg}/20 ${colors.text}`}>
                    {fngClass}
                  </span>
                </div>

                <div className="mb-6">
                  <div className="relative h-3 overflow-hidden rounded-full bg-white/10">
                    <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-red-500 to-orange-500" />
                    <div className="absolute inset-y-0 left-1/4 w-1/4 bg-gradient-to-r from-orange-500 to-yellow-500" />
                    <div className="absolute inset-y-0 left-2/4 w-1/4 bg-gradient-to-r from-yellow-500 to-lime-500" />
                    <div className="absolute inset-y-0 left-3/4 w-1/4 bg-gradient-to-r from-lime-500 to-green-500" />
                    
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

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-start gap-3">
                    <Activity className="mt-0.5 h-5 w-5 text-white/40" />
                    <div className="text-sm text-white/60">
                      {fngValue <= 24 && (
                        <p>Market is in <strong className="text-red-400">Extreme Fear</strong>. Historically a good buying opportunity.</p>
                      )}
                      {fngValue > 24 && fngValue <= 49 && (
                        <p>Market shows <strong className="text-orange-400">Fear</strong>. Potential buying opportunities exist.</p>
                      )}
                      {fngValue === 50 && (
                        <p>Market is <strong className="text-yellow-400">Neutral</strong>. No strong sentiment.</p>
                      )}
                      {fngValue > 50 && fngValue <= 74 && (
                        <p>Market shows <strong className="text-lime-400">Greed</strong>. Be cautious of overvaluation.</p>
                      )}
                      {fngValue > 74 && (
                        <p>Market is in <strong className="text-green-400">Extreme Greed</strong>. High risk of correction.</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* Funding Rates Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
                  <Percent className="h-6 w-6 text-white/60" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Funding Rates</h2>
                  <p className="text-sm text-white/40">{sortedFundingRates.length} assets</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Quick stats */}
                {!fundingLoading && sortedFundingRates.length > 0 && (
                  <div className="flex gap-2">
                    {extremePositive.length > 0 && (
                      <div className="flex items-center gap-1 rounded-lg bg-red-500/10 px-2 py-1">
                        <TrendingUp className="h-3 w-3 text-red-400" />
                        <span className="text-xs font-medium text-red-400">{extremePositive.length}</span>
                      </div>
                    )}
                    {extremeNegative.length > 0 && (
                      <div className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2 py-1">
                        <TrendingDown className="h-3 w-3 text-emerald-400" />
                        <span className="text-xs font-medium text-emerald-400">{extremeNegative.length}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Info button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFundingInfo(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/40 transition hover:bg-white/10 hover:text-white/60"
                >
                  <HelpCircle className="h-4 w-4" />
                </motion.button>
              </div>
            </div>

            {fundingLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            ) : sortedFundingRates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Percent className="mb-4 h-12 w-12 text-white/20" />
                <p className="text-white/40">No funding rates available</p>
              </div>
            ) : (
              <>
                <div className="max-h-[380px] overflow-y-auto pr-2">
                  <div className="grid gap-2">
                    {sortedFundingRates.map((item) => {
                      const ratePercent = (parseFloat(item.rate) * 100).toFixed(4);
                      const fundingData = getFundingData(item.rate);
                      const IconComponent = fundingData.icon;
                      
                      return (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between rounded-xl border ${fundingData.border} ${fundingData.bg} p-3 transition hover:brightness-110`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white/80">
                              {item.asset}
                            </div>
                            <div className="flex flex-col text-xs">
                              <span className="flex items-center gap-1 text-white/50">
                                <Clock className="h-3 w-3" />
                                {getTimeUntilFunding(item.funding_time)}
                              </span>
                              <span className="flex items-center gap-1 text-white/30">
                                <History className="h-3 w-3" />
                                {getTimeSinceLastFunding(item.funding_time)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className={`text-sm font-semibold tabular-nums ${fundingData.color}`}>
                                {parseFloat(item.rate) >= 0 ? "+" : ""}{ratePercent}%
                              </span>
                              <div className={`text-xs ${fundingData.color} opacity-70`}>
                                {fundingData.label}
                              </div>
                            </div>
                            <IconComponent className={`h-4 w-4 ${fundingData.color}`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-red-400" />
                      <span className="text-white/40">Longs pay</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="text-white/40">Shorts pay</span>
                    </div>
                  </div>
                  <span className="text-xs text-white/30">8h interval</span>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Funding Rates Info Modal */}
      <AnimatePresence>
        {showFundingInfo && (
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
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowFundingInfo(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent p-8 backdrop-blur-2xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                      <Percent className="h-5 w-5 text-white/60" />
                    </div>
                    <h2 className="text-xl font-bold">Understanding Funding Rates</h2>
                  </div>
                  <button
                    onClick={() => setShowFundingInfo(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* What is Funding Rate */}
                <div className="mb-6">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-white/90">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    What is Funding Rate?
                  </h3>
                  <p className="text-sm leading-relaxed text-white/60">
                    Funding rate is a periodic payment between traders holding long and short positions 
                    on perpetual futures. It keeps the futures price close to the spot price.
                  </p>
                </div>

                {/* How it works */}
                <div className="mb-6">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-white/90">
                    <Activity className="h-4 w-4 text-blue-400" />
                    How it Works
                  </h3>
                  <div className="space-y-2 text-sm text-white/60">
                    <div className="flex items-start gap-2 rounded-lg bg-red-500/10 p-3">
                      <TrendingUp className="mt-0.5 h-4 w-4 text-red-400" />
                      <div>
                        <strong className="text-red-400">Positive rate:</strong> Longs pay shorts. 
                        Market is bullish, many traders betting on price going up.
                      </div>
                    </div>
                    <div className="flex items-start gap-2 rounded-lg bg-emerald-500/10 p-3">
                      <TrendingDown className="mt-0.5 h-4 w-4 text-emerald-400" />
                      <div>
                        <strong className="text-emerald-400">Negative rate:</strong> Shorts pay longs. 
                        Market is bearish, many traders betting on price going down.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Color Legend */}
                <div className="mb-6">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-white/90">
                    <AlertTriangle className="h-4 w-4 text-orange-400" />
                    Signal Strength
                  </h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-400" />
                        <span className="text-red-400 font-medium">Hot</span>
                      </div>
                      <span className="text-white/50">≥ +0.075%</span>
                      <span className="text-xs text-white/40">Overheated, reversal likely</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-orange-500/20 bg-orange-500/10 p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-orange-400" />
                        <span className="text-orange-400 font-medium">Warm</span>
                      </div>
                      <span className="text-white/50">≥ +0.03%</span>
                      <span className="text-xs text-white/40">Moderately bullish</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-white/40" />
                        <span className="text-white/50 font-medium">Neutral</span>
                      </div>
                      <span className="text-white/50">-0.03% to +0.03%</span>
                      <span className="text-xs text-white/40">Balanced market</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-cyan-400" />
                        <span className="text-cyan-400 font-medium">Cool</span>
                      </div>
                      <span className="text-white/50">≤ -0.03%</span>
                      <span className="text-xs text-white/40">Moderately bearish</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-emerald-400" />
                        <span className="text-emerald-400 font-medium">Cold</span>
                      </div>
                      <span className="text-white/50">≤ -0.075%</span>
                      <span className="text-xs text-white/40">Oversold, bounce likely</span>
                    </div>
                  </div>
                </div>

                {/* Time indicators */}
                <div className="mb-6">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-white/90">
                    <Clock className="h-4 w-4 text-purple-400" />
                    Time Indicators
                  </h3>
                  <div className="space-y-2 text-sm text-white/60">
                    <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                      <Clock className="h-4 w-4 text-white/40" />
                      <div>
                        <strong className="text-white/70">Next funding:</strong> Time until the next payment
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                      <History className="h-4 w-4 text-white/40" />
                      <div>
                        <strong className="text-white/70">Last funding:</strong> Time since the last payment
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trading tip */}
                <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <Zap className="mt-0.5 h-5 w-5 text-yellow-400" />
                    <div className="text-sm">
                      <strong className="text-yellow-400">Trading Tip:</strong>
                      <p className="mt-1 text-white/60">
                        Extreme funding rates often precede price reversals. High positive rates 
                        may signal a potential dump, while very negative rates may indicate a 
                        short squeeze incoming.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}