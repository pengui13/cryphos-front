"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GetFearAndGreed, GetFundingRates, subscribeLiquidations } from "../api/ApiWrapper";
import { usePing } from "../providers";
import AuthScreen from "../components/AuthScreen.jsx";

/* ===================== HELPERS ===================== */
function formatUSD(value) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return "$0";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function timeAgo(timestamp) {
  try {
    const t = new Date(timestamp).getTime();
    const diff = Math.floor((Date.now() - t) / 1000);
    if (!Number.isFinite(diff) || diff < 0) return "now";
    if (diff < 5) return "now";
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    return `${Math.floor(diff / 3600)}h`;
  } catch {
    return "now";
  }
}

/* ===================== ICONS ===================== */
function Gauge({ className }) {
  return (
    <svg className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
    </svg>
  );
}

function Percent({ className }) {
  return (
    <svg className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l16 16m-3-16a3 3 0 110 6 3 3 0 010-6zm-10 10a3 3 0 110 6 3 3 0 010-6z" />
    </svg>
  );
}

function Flame({ className }) {
  return (
    <svg className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
    </svg>
  );
}

function ArrowUp() {
  return (
    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
    </svg>
  );
}

function WifiOffIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.5 16.5l1.5 1.5 1.5-1.5M8.288 15.038a5.25 5.25 0 014.245-1.5M5.106 11.856a10.003 10.003 0 015.654-2.74M1.924 8.674a14.001 14.001 0 016.072-2.816" />
    </svg>
  );
}

function HelpCircle({ className }) {
  return (
    <svg className={className || "h-4 w-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  );
}

function XIcon({ className }) {
  return (
    <svg className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function Zap({ className }) {
  return (
    <svg className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 0 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function TrendingUp({ className }) {
  return (
    <svg className={className || "h-4 w-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  );
}

function TrendingDown({ className }) {
  return (
    <svg className={className || "h-4 w-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
    </svg>
  );
}

/* ===================== SMALL UI COMPONENTS ===================== */
function AssetLogo({ symbol, size = 20 }) {
  const [hasError, setHasError] = useState(false);
  const assetName = (symbol || "").replace("USDT", "").toLowerCase();
  const displayText = assetName.toUpperCase().slice(0, 2) || "?";

  if (hasError || !assetName) {
    return (
      <div
        className="flex items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white/60"
        style={{ width: size, height: size, minWidth: size, minHeight: size }}
      >
        {displayText}
      </div>
    );
  }

  return (
    <img
      src={`/assets/${assetName}.png`}
      alt={assetName}
      width={size}
      height={size}
      className="rounded-full object-cover"
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
      onError={() => setHasError(true)}
    />
  );
}

function LiquidationRow({ liq, isNew, tick }) {
  if (!liq) return null;

  const isLong = liq.type === "long";
  const isBig = (liq.usd || 0) >= 100_000;
  const symbol = (liq.symbol || "???").replace("USDT", "");

  return (
    <div className={`flex items-center justify-between py-3 border-b border-white/5 transition-colors duration-300 ${isNew ? "bg-white/[0.05]" : ""}`}>
      <div className="flex items-center gap-2.5">
        <AssetLogo symbol={liq.symbol} size={24} />
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-white text-sm">{symbol}</span>
          {isBig && <span className="text-[8px] text-yellow-500">●</span>}
        </div>
        <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium px-1.5 py-0.5 rounded ${isLong ? "text-red-400 bg-red-500/10" : "text-emerald-400 bg-emerald-500/10"}`}>
          {isLong ? <ArrowDown /> : <ArrowUp />}
          {isLong ? "L" : "S"}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className={`text-sm font-medium tabular-nums ${isLong ? "text-red-400" : "text-emerald-400"}`}>
          {formatUSD(liq.usd || 0)}
        </span>
        <span className="text-xs text-white/30 tabular-nums w-8 text-right">{timeAgo(liq.ts)}</span>
      </div>
    </div>
  );
}

function FundingRow({ item, getFundingColor }) {
  if (!item) return null;
  const rate = parseFloat(item.rate) || 0;

  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        <AssetLogo symbol={(item.asset || "") + "USDT"} size={18} />
        <span className="text-sm text-white/60">{item.asset || "?"}</span>
      </div>
      <span className={`text-sm font-medium tabular-nums ${getFundingColor(item.rate)}`}>
        {rate >= 0 ? "+" : ""}
        {(rate * 100).toFixed(3)}%
      </span>
    </div>
  );
}

/* ===================== SOCKET HOOK (iOS SAFE) ===================== */
function useLiquidationsSocket({ enabled, onLiq, onStatus }) {
  const unsubRef = useRef(null);
  const disposedRef = useRef(false);
  const retryRef = useRef(null);
  const attemptsRef = useRef(0);

  const cleanup = useCallback(() => {
    if (retryRef.current) {
      clearTimeout(retryRef.current);
      retryRef.current = null;
    }
    if (unsubRef.current) {
      try {
        unsubRef.current();
      } catch {}
      unsubRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (!enabled || disposedRef.current) return;

    cleanup();
    onStatus?.(false);

    try {
      unsubRef.current = subscribeLiquidations(
        (data) => {
          if (disposedRef.current) return;
          attemptsRef.current = 0;
          onStatus?.(true);
          if (data) onLiq?.(data);
        },
        () => {
          if (disposedRef.current) return;
          onStatus?.(false);
        },
        () => {
          if (disposedRef.current) return;
          onStatus?.(false);

          cleanup();
          attemptsRef.current = Math.min(attemptsRef.current + 1, 6);
          const delays = [1000, 2000, 3000, 5000, 8000, 8000, 8000];
          const delay = delays[attemptsRef.current] || 3000;

          retryRef.current = setTimeout(() => connect(), delay);
        }
      );
    } catch (e) {
      console.error("subscribeLiquidations failed:", e);
      onStatus?.(false);

      attemptsRef.current = Math.min(attemptsRef.current + 1, 6);
      const delays = [1000, 2000, 3000, 5000, 8000, 8000, 8000];
      const delay = delays[attemptsRef.current] || 3000;
      retryRef.current = setTimeout(() => connect(), delay);
    }
  }, [enabled, cleanup, onLiq, onStatus]);

  useEffect(() => {
    disposedRef.current = false;

    if (!enabled) {
      cleanup();
      onStatus?.(false);
      return () => {};
    }

    connect();

    const onVis = () => {
      if (document.visibilityState === "visible") connect();
    };
    const onOnline = () => connect();
    const onPageShow = () => connect();

    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("online", onOnline);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      disposedRef.current = true;
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("pageshow", onPageShow);
      cleanup();
    };
  }, [enabled, connect, cleanup, onStatus]);
}

/* ===================== MAIN ===================== */
export default function Analytics() {
  const ping = usePing();
  const authed = Boolean(ping);

  const [fng, setFng] = useState(null);
  const [loading, setLoading] = useState(true);

  const [fundingRates, setFundingRates] = useState([]);
  const [fundingLoading, setFundingLoading] = useState(true);
  const [showFundingInfo, setShowFundingInfo] = useState(false);

  const [liquidations, setLiquidations] = useState([]);
  const [liqStats, setLiqStats] = useState({ long_usd: 0, short_usd: 0, long_count: 0, short_count: 0 });
  const [connected, setConnected] = useState(false);
  const [newestId, setNewestId] = useState(null);

  const [tick, setTick] = useState(0);

  const soundEnabledRef = useRef(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!authed) return;

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
  }, [authed]);

  const onLiq = useCallback((data) => {
    const liqId = `${data.ts || Date.now()}-${data.symbol || "unknown"}-${data.usd || 0}`;

    setLiquidations((prev) => [{ ...data, id: liqId }, ...prev].slice(0, 50));
    setLiqStats((prev) => ({
      ...prev,
      [`${data.type}_usd`]: (prev[`${data.type}_usd`] || 0) + (data.usd || 0),
      [`${data.type}_count`]: (prev[`${data.type}_count`] || 0) + 1,
    }));

    setNewestId(liqId);
    setTimeout(() => setNewestId(null), 500);

    if ((data.usd || 0) >= 50_000 && soundEnabledRef.current && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  useLiquidationsSocket({
    enabled: authed,
    onLiq,
    onStatus: setConnected,
  });

  const getFNGColor = useCallback((value) => {
    if (value <= 24) return "text-red-400";
    if (value <= 49) return "text-orange-400";
    if (value === 50) return "text-yellow-400";
    if (value <= 74) return "text-lime-400";
    return "text-green-400";
  }, []);

  const getFundingColor = useCallback((rate) => {
    const r = (parseFloat(rate) || 0) * 100;
    if (r >= 0.05) return "text-red-400";
    if (r <= -0.05) return "text-emerald-400";
    return "text-white/50";
  }, []);

  // ✅ ALWAYS called (no conditional returns before this)
  const sortedFunding = useMemo(() => {
    return [...fundingRates]
      .filter((item) => item && item.rate !== undefined)
      .sort((a, b) => Math.abs(parseFloat(b.rate) || 0) - Math.abs(parseFloat(a.rate) || 0));
  }, [fundingRates]);

  const fngValue = fng?.value || 0;
  const fngClass = fng?.class || "Unknown";

  const totalLiqUSD = (liqStats.long_usd || 0) + (liqStats.short_usd || 0);
  const longRatio = totalLiqUSD > 0 ? ((liqStats.long_usd || 0) / totalLiqUSD) * 100 : 50;

  // ✅ NO EARLY RETURN: keep hook order stable forever
  if (!authed) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 py-4 sm:p-6">
      <audio ref={audioRef} src="/liquidation.mp3" preload="auto" />

      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-white">Analytics</h1>
            <p className="text-xs sm:text-sm text-white/40">Market data & liquidations</p>
          </div>

          <div
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
              connected ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
            }`}
          >
            {connected ? <WifiIcon /> : <WifiOffIcon />}
            <span className="hidden sm:inline">{connected ? "Live" : "Offline"}</span>
            {connected && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
            )}
          </div>
        </header>

        <div className="mb-4 sm:mb-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
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
                  <div className={`text-3xl sm:text-4xl font-bold tabular-nums ${getFNGColor(fngValue)}`}>{fngValue}</div>
                  <div className="text-xs sm:text-sm text-white/40">{fngClass}</div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="h-1.5 sm:h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" />
                  </div>
                  <div className="relative h-3">
                    <div className="absolute top-0 w-0.5 h-2.5 bg-white rounded-full transition-all duration-500" style={{ left: `${fngValue}%`, transform: "translateX(-50%)" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl sm:rounded-2xl border border-white/5 bg-white/[0.02] p-4 sm:p-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/40">
                <Percent className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm font-medium">Funding Rates</span>
              </div>

              <button onClick={() => setShowFundingInfo(true)} className="p-1 rounded-lg text-white/30 hover:text-white/50 hover:bg-white/5 transition">
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
                {sortedFunding.slice(0, 6).map((item, index) => (
                  <FundingRow key={item.id || item.asset || index} item={item} getFundingColor={getFundingColor} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl sm:rounded-2xl border border-white/5 bg-white/[0.02] p-4 sm:p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-white/40">
                <Flame className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm font-medium">Liquidations</span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-white/30">L</span>
                <span className="font-medium text-red-400">{formatUSD(liqStats.long_usd || 0)}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-white/30">S</span>
                <span className="font-medium text-emerald-400">{formatUSD(liqStats.short_usd || 0)}</span>
              </div>
              <div className="flex-1 max-w-24 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-red-500/80 transition-all duration-300" style={{ width: `${longRatio}%` }} />
              </div>
            </div>
          </div>

          <div className="max-h-[50vh] sm:max-h-[400px] overflow-y-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            {liquidations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Zap className="mb-2 h-6 w-6 sm:h-8 sm:w-8 text-white/20" />
                <p className="text-xs sm:text-sm text-white/40">Waiting for liquidations...</p>
              </div>
            ) : (
              <div>
                {liquidations.map((liq, index) => (
                  <LiquidationRow key={liq.id || index} liq={liq} isNew={liq.id === newestId} tick={tick} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFundingInfo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowFundingInfo(false)} />

            <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="relative w-full sm:max-w-md">
              <div className="rounded-t-2xl sm:rounded-2xl border border-white/10 bg-neutral-900 p-5 sm:p-6">
                <div className="sm:hidden w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />

                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-semibold">Funding Rates</h2>
                  <button onClick={() => setShowFundingInfo(false)} className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition">
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-white/60">
                  <p>Funding rates are periodic payments between long and short traders on perpetual futures.</p>

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
