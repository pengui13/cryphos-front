"use client";

import { useEffect, useState, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GetFearAndGreed, GetFundingRates, subscribeLiquidations } from "../api/ApiWrapper";
import { usePing } from "../providers";
import AuthScreen from "../components/AuthScreen.jsx";

// ============ HELPERS ============
function formatUSD(value) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

function formatPrice(price) {
  if (price >= 1000) return price.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (price >= 1) return price.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return price.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

function timeAgo(timestamp) {
  const diff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  if (diff < 5) return "now";
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  return `${Math.floor(diff / 3600)}h`;
}

// ============ ICONS (memoized) ============
const Gauge = memo(({ className }) => (
  <svg className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
  </svg>
));

const Percent = memo(({ className }) => (
  <svg className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l16 16m-3-16a3 3 0 110 6 3 3 0 010-6zm-10 10a3 3 0 110 6 3 3 0 010-6z" />
  </svg>
));

const Flame = memo(({ className }) => (
  <svg className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
  </svg>
));

const ArrowUp = memo(() => (
  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
  </svg>
));

const ArrowDown = memo(() => (
  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
));

const Wifi = memo(() => (
  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
  </svg>
));

const WifiOff = memo(() => (
  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.5 16.5l1.5 1.5 1.5-1.5M8.288 15.038a5.25 5.25 0 014.245-1.5M5.106 11.856a10.003 10.003 0 015.654-2.74M1.924 8.674a14.001 14.001 0 016.072-2.816" />
  </svg>
));

const HelpCircle = memo(({ className }) => (
  <svg className={className || "h-4 w-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
));

const X = memo(({ className }) => (
  <svg className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
));

const Zap = memo(({ className }) => (
  <svg className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
));

const TrendingUp = memo(({ className }) => (
  <svg className={className || "h-4 w-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
));

const TrendingDown = memo(({ className }) => (
  <svg className={className || "h-4 w-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
  </svg>
));

// ============ MEMOIZED LIQUIDATION ROW (Mobile Card) ============
const LiquidationRow = memo(({ liq, isNew }) => {
  const isLong = liq.type === "long";
  const isBig = liq.usd >= 100_000;
  const symbol = liq.symbol?.replace("USDT", "") || "???";

  return (
    <div 
      className={`flex items-center justify-between py-3 border-b border-white/5 transition-colors duration-300 ${isNew ? "bg-white/[0.05]" : ""}`}
    >
      {/* Left: Symbol + Side */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-white text-sm">{symbol}</span>
          {isBig && <span className="text-[8px] text-yellow-500">●</span>}
        </div>
        <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium px-1.5 py-0.5 rounded ${isLong ? "text-red-400 bg-red-500/10" : "text-emerald-400 bg-emerald-500/10"}`}>
          {isLong ? <ArrowDown /> : <ArrowUp />}
          {isLong ? "L" : "S"}
        </span>
      </div>

      {/* Right: Size + Time */}
      <div className="flex items-center gap-3">
        <span className={`text-sm font-medium tabular-nums ${isLong ? "text-red-400" : "text-emerald-400"}`}>
          {formatUSD(liq.usd)}
        </span>
        <span className="text-xs text-white/30 tabular-nums w-8 text-right">
          {timeAgo(liq.ts)}
        </span>
      </div>
    </div>
  );
});

LiquidationRow.displayName = "LiquidationRow";

// ============ MEMOIZED FUNDING RATE ROW ============
const FundingRow = memo(({ item, getFundingColor }) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-sm text-white/60">{item.asset}</span>
    <span className={`text-sm font-medium tabular-nums ${getFundingColor(item.rate)}`}>
      {parseFloat(item.rate) >= 0 ? "+" : ""}{(parseFloat(item.rate) * 100).toFixed(3)}%
    </span>
  </div>
));

FundingRow.displayName = "FundingRow";

// ============ MAIN COMPONENT ============
export default function Analytics() {
  const ping = usePing();

  // FNG State
  const [fng, setFng] = useState(null);
  const [loading, setLoading] = useState(true);

  // Funding Rates State
  const [fundingRates, setFundingRates] = useState([]);
  const [fundingLoading, setFundingLoading] = useState(true);
  const [showFundingInfo, setShowFundingInfo] = useState(false);

  // Liquidations State
  const [liquidations, setLiquidations] = useState([]);
  const [liqStats, setLiqStats] = useState({ long_usd: 0, short_usd: 0, long_count: 0, short_count: 0 });
  const [connected, setConnected] = useState(false);
  const [newestId, setNewestId] = useState(null);
  
  const soundEnabledRef = useRef(false);
  const unsubscribeRef = useRef(null);
  const audioRef = useRef(null);

  // ============ DATA FETCHING ============
  useEffect(() => {
    if (!ping) return;
    fetchFNG();
    fetchFundingRates();
    connectLiquidations();

    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, [ping]);

  function fetchFNG() {
    setLoading(true);
    GetFearAndGreed(
      (data) => {
        setFng(data);
        setLoading(false);
      },
      (err) => {
        console.error("Failed to fetch FNG:", err);
        setLoading(false);
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

  function connectLiquidations() {
    const connect = () => {
      unsubscribeRef.current = subscribeLiquidations(
        (data) => {
          setConnected(true);
          handleLiquidation(data);
        },
        () => setConnected(false),
        () => {
          setConnected(false);
          setTimeout(connect, 3000);
        }
      );
    };
    connect();
  }

  const handleLiquidation = useCallback((liq) => {
    const liqId = `${liq.ts}-${liq.symbol}-${liq.usd}`;
    
    setLiquidations((prev) => {
      const newLiq = { ...liq, id: liqId };
      return [newLiq, ...prev].slice(0, 50);
    });
    
    setLiqStats((prev) => ({
      ...prev,
      [`${liq.type}_usd`]: (prev[`${liq.type}_usd`] || 0) + liq.usd,
      [`${liq.type}_count`]: (prev[`${liq.type}_count`] || 0) + 1,
    }));

    setNewestId(liqId);
    setTimeout(() => setNewestId(null), 500);

    if (liq.usd >= 50_000 && soundEnabledRef.current && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  // ============ HELPERS ============
  const getFNGColor = useCallback((value) => {
    if (value <= 24) return "text-red-400";
    if (value <= 49) return "text-orange-400";
    if (value === 50) return "text-yellow-400";
    if (value <= 74) return "text-lime-400";
    return "text-green-400";
  }, []);

  const getFundingColor = useCallback((rate) => {
    const r = parseFloat(rate) * 100;
    if (r >= 0.05) return "text-red-400";
    if (r <= -0.05) return "text-emerald-400";
    return "text-white/50";
  }, []);

  // ============ AUTH CHECK ============
  if (!ping) {
    return <AuthScreen />;
  }

  // ============ COMPUTED VALUES ============
  const fngValue = fng?.value || 0;
  const fngClass = fng?.class || "Unknown";
  const sortedFunding = [...fundingRates].sort((a, b) => Math.abs(parseFloat(b.rate)) - Math.abs(parseFloat(a.rate)));
  const totalLiqUSD = liqStats.long_usd + liqStats.short_usd;
  const longRatio = totalLiqUSD > 0 ? (liqStats.long_usd / totalLiqUSD) * 100 : 50;

  // ============ RENDER ============
  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 py-4 sm:p-6">
      <audio ref={audioRef} src="/liquidation.mp3" preload="auto" />
      
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-white">Analytics</h1>
            <p className="text-xs sm:text-sm text-white/40">Market data & liquidations</p>
          </div>
          <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${connected ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
            {connected ? <Wifi /> : <WifiOff />}
            <span className="hidden xs:inline">{connected ? "Live" : "Offline"}</span>
            {connected && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
            )}
          </div>
        </header>

        {/* Top Row: FNG + Funding - Stack on mobile */}
        <div className="mb-4 sm:mb-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          
          {/* Fear & Greed */}
          <div className="rounded-xl sm:rounded-2xl border border-white/5 bg-white/[0.02] p-4 sm:p-6">
            <div className="mb-3 flex items-center gap-2 text-white/40">
              <Gauge className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm font-medium">Fear & Greed</span>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  <div className={`text-3xl sm:text-4xl font-bold tabular-nums ${getFNGColor(fngValue)}`}>
                    {fngValue}
                  </div>
                  <div className="text-xs sm:text-sm text-white/40">{fngClass}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="h-1.5 sm:h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" />
                  </div>
                  <div className="relative h-3">
                    <div
                      className="absolute top-0 w-0.5 h-2.5 bg-white rounded-full transition-all duration-500"
                      style={{ left: `${fngValue}%`, transform: "translateX(-50%)" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Funding Rates */}
          <div className="rounded-xl sm:rounded-2xl border border-white/5 bg-white/[0.02] p-4 sm:p-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/40">
                <Percent className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm font-medium">Funding Rates</span>
              </div>
              <button
                onClick={() => setShowFundingInfo(true)}
                className="p-1 rounded-lg text-white/30 hover:text-white/50 hover:bg-white/5 transition"
              >
                <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
            {fundingLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            ) : sortedFunding.length === 0 ? (
              <p className="text-xs sm:text-sm text-white/30 text-center py-6">No data</p>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6">
                {sortedFunding.slice(0, 6).map((item) => (
                  <FundingRow key={item.id} item={item} getFundingColor={getFundingColor} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Liquidations */}
        <div className="rounded-xl sm:rounded-2xl border border-white/5 bg-white/[0.02] p-4 sm:p-6">
          {/* Header + Stats */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-white/40">
                <Flame className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm font-medium">Liquidations</span>
              </div>
            </div>

            {/* Stats Row - Responsive */}
            <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-white/30">L</span>
                <span className="font-medium text-red-400">{formatUSD(liqStats.long_usd)}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-white/30">S</span>
                <span className="font-medium text-emerald-400">{formatUSD(liqStats.short_usd)}</span>
              </div>
              <div className="flex-1 max-w-24 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-red-500/80 transition-all duration-300"
                  style={{ width: `${longRatio}%` }}
                />
              </div>
            </div>
          </div>

          {/* Feed - Card style for mobile */}
          <div className="max-h-[50vh] sm:max-h-[400px] overflow-y-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            {liquidations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Zap className="mb-2 h-6 w-6 sm:h-8 sm:w-8 text-white/20" />
                <p className="text-xs sm:text-sm text-white/40">Waiting for liquidations...</p>
              </div>
            ) : (
              <div>
                {liquidations.map((liq) => (
                  <LiquidationRow 
                    key={liq.id} 
                    liq={liq} 
                    isNew={liq.id === newestId}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Funding Info Modal */}
      <AnimatePresence>
        {showFundingInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowFundingInfo(false)} />

            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="relative w-full sm:max-w-md"
            >
              <div className="rounded-t-2xl sm:rounded-2xl border border-white/10 bg-neutral-900 p-5 sm:p-6">
                {/* Drag handle on mobile */}
                <div className="sm:hidden w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
                
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-semibold">Funding Rates</h2>
                  <button
                    onClick={() => setShowFundingInfo(false)}
                    className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-white/60">
                  <p>
                    Funding rates are periodic payments between long and short traders on perpetual futures.
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2 rounded-lg bg-red-500/10 p-2.5 sm:p-3">
                      <TrendingUp className="mt-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400 shrink-0" />
                      <div>
                        <strong className="text-red-400">Positive:</strong> Longs pay shorts
                      </div>
                    </div>
                    <div className="flex items-start gap-2 rounded-lg bg-emerald-500/10 p-2.5 sm:p-3">
                      <TrendingDown className="mt-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 shrink-0" />
                      <div>
                        <strong className="text-emerald-400">Negative:</strong> Shorts pay longs
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-yellow-500/10 p-2.5 sm:p-3 text-yellow-400/80">
                    <strong className="text-yellow-400">Tip:</strong> Extreme rates often precede reversals.
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