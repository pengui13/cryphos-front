"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GetBots, DeleteBots, GetSignals, GetFearAndGreed } from "../api/ApiWrapper";
import { usePing } from "../providers";
import RiskSettings from "./RiskSettings";
import AuthScreen from "../components/AuthScreen.jsx";

// ============ ICONS ============
function TrashIcon({ className }) {
  return (
    <svg className={className || "h-4 w-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}

function PlusIcon({ className }) {
  return (
    <svg className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function TrendingUpIcon({ className }) {
  return (
    <svg className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  );
}

function TrendingDownIcon({ className }) {
  return (
    <svg className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
    </svg>
  );
}

function ZapIcon({ className }) {
  return (
    <svg className={className || "h-4 w-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function ActivityIcon({ className }) {
  return (
    <svg className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h4l3-9 4 18 3-9h4" />
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

function BotIcon({ className }) {
  return (
    <svg className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  );
}

// ============ SIGNAL STATS HELPERS ============
function signalPnlPct(s) {
  if (s?.close_price == null || s?.open_price == null) return null;
  const open = parseFloat(s.open_price);
  const close = parseFloat(s.close_price);
  if (!open) return null;
  return s.is_long
    ? ((close - open) / open) * 100
    : ((open - close) / open) * 100;
}

function computeStats(signals) {
  const list = Array.isArray(signals) ? signals : [];
  let open = 0;
  let closed = 0;
  let wins = 0;
  let realized = 0;
  for (const s of list) {
    if (s.is_open) {
      open += 1;
      continue;
    }
    closed += 1;
    const pnl = signalPnlPct(s);
    if (pnl == null) continue;
    realized += pnl;
    if (pnl > 0) wins += 1;
  }
  return {
    total: list.length,
    open,
    closed,
    wins,
    winRate: closed > 0 ? Math.round((wins / closed) * 100) : null,
    realized,
  };
}

function timeAgo(dateStr) {
  if (!dateStr) return "—";
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then)) return "—";
  const secs = Math.floor((Date.now() - then) / 1000);
  if (secs < 45) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Fear & Greed color by numeric value (0-100)
function fngColor(value) {
  if (value == null || Number.isNaN(value)) return "text-white/60";
  if (value < 25) return "text-red-400";
  if (value < 45) return "text-orange-400";
  if (value < 55) return "text-yellow-400";
  if (value < 75) return "text-lime-400";
  return "text-emerald-400";
}

// ============ MAIN COMPONENT ============
export default function Bots() {
  const router = useRouter();
  const ping = usePing();

  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedBot, setSelectedBot] = useState(null);
  const [signals, setSignals] = useState({});
  const [loadingSignals, setLoadingSignals] = useState({});
  const [signalCounts, setSignalCounts] = useState({});
  const [signalStats, setSignalStats] = useState({});
  const [signalFilter, setSignalFilter] = useState("all");
  const [fng, setFng] = useState(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("newest");

  useEffect(() => {
    if (!ping) return;

    GetFearAndGreed(
      (data) => {
        const value = parseInt(data?.fng, 10);
        setFng({
          value: Number.isNaN(value) ? null : value,
          label: data?.fng_class || "",
        });
      },
      (err) => console.error("Failed to fetch Fear & Greed:", err)
    );

    GetBots((res) => {
      const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      setBots(list || []);
      setLoading(false);
      
      list.forEach(bot => {
        fetchSignalCount(bot.id);
      });
    });
  }, [ping]);

  function fetchSignalCount(botId) {
    GetSignals(
      botId,
      (data) => {
        const list = Array.isArray(data) ? data : [];
        setSignalCounts((prev) => ({ ...prev, [botId]: list.length }));
        setSignalStats((prev) => ({ ...prev, [botId]: computeStats(list) }));
      },
      (err) => {
        console.error(`Failed to fetch signal count for bot ${botId}:`, err);
      }
    );
  }

  function fetchSignals(botId, e) {
    if (e) e.stopPropagation();

    setSignalFilter("all");

    if (signals[botId]) {
      setSelectedBot(botId);
      return;
    }

    setLoadingSignals((prev) => ({ ...prev, [botId]: true }));

    GetSignals(
      botId,
      (data) => {
        const list = Array.isArray(data) ? data : [];
        setSignals((prev) => ({ ...prev, [botId]: list }));
        setSignalStats((prev) => ({ ...prev, [botId]: computeStats(list) }));
        setSelectedBot(botId);
        setLoadingSignals((prev) => ({ ...prev, [botId]: false }));
      },
      (err) => {
        console.error("Error fetching signals:", err);
        setLoadingSignals((prev) => ({ ...prev, [botId]: false }));
      }
    );
  }

  async function handleDelete(id) {
    setDeleteTarget(null);
    const snapshot = bots;
    setDeleting((prev) => ({ ...prev, [id]: true }));
    setBots((prev) => prev.filter((b) => b.id !== id));

    try {
      await DeleteBots(id);
    } catch (err) {
      console.error("Delete error", err);
      setBots(snapshot);
    } finally {
      setDeleting((prev) => {
        const cp = { ...prev };
        delete cp[id];
        return cp;
      });
    }
  }

  const displayedBots = (() => {
    const q = search.trim().toLowerCase();
    let list = bots;
    if (q) {
      list = bots.filter((b) =>
        (b.bot_assets || []).some((a) => String(a).toLowerCase().includes(q))
      );
    }
    const sorted = [...list];
    sorted.sort((a, b) => {
      if (sortKey === "roi") return parseFloat(b.roi || 0) - parseFloat(a.roi || 0);
      if (sortKey === "winRate") {
        const wa = signalStats[a.id]?.winRate ?? -1;
        const wb = signalStats[b.id]?.winRate ?? -1;
        return wb - wa;
      }
      if (sortKey === "signals") {
        return (signalCounts[b.id] || 0) - (signalCounts[a.id] || 0);
      }
      // newest
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });
    return sorted;
  })();

  const selectedBotSignals = selectedBot ? signals[selectedBot] || [] : [];
  const selectedBotStats = selectedBot ? signalStats[selectedBot] : null;
  const filteredSignals = (selectedBotSignals || []).filter((s) => {
    if (signalFilter === "open") return s.is_open;
    if (signalFilter === "closed") return !s.is_open;
    return true;
  });

  // Auth check
  if (!ping) {
    return <AuthScreen />;
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 py-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-white">Your Bots</h1>
            <p className="text-xs sm:text-sm text-white/40">
              {bots.length === 0
                ? "Create your first trading bot"
                : `${bots.length} active ${bots.length === 1 ? "bot" : "bots"}`}
            </p>
          </div>

          {/* Fear & Greed badge */}
          {fng && (
            <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2">
              <ActivityIcon className="h-4 w-4 text-white/30" />
              <div className="leading-tight">
                <div className="text-[10px] uppercase text-white/30">Fear &amp; Greed</div>
                <div className="text-sm font-semibold">
                  <span className={fngColor(fng.value)}>{fng.value ?? "—"}</span>
                  {fng.label && <span className="ml-1 text-xs font-normal text-white/40">{fng.label}</span>}
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Risk Settings */}
        <RiskSettings onSettingsChange={(settings) => console.log("Updated:", settings)} />

        {/* Empty State */}
        {bots.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border border-white/5 bg-white/[0.02] p-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
              <BotIcon className="h-7 w-7 text-white/30" />
            </div>
            <h2 className="mb-2 text-lg font-medium">No bots yet</h2>
            <p className="mb-6 max-w-sm text-sm text-white/40">
              Create your first automated trading bot with custom indicators
            </p>
            <button
              onClick={() => router.push("/lab")}
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
            >
              <PlusIcon className="h-4 w-4" />
              Create Bot
            </button>
          </div>
        )}

        {/* Search + Sort toolbar */}
        {bots.length > 1 && (
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by asset (e.g. BTC)"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-3 pr-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-white/20"
              />
            </div>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 py-2.5 px-3 text-sm text-white outline-none transition focus:border-white/20"
            >
              <option value="newest">Newest</option>
              <option value="roi">ROI</option>
              <option value="winRate">Win rate</option>
              <option value="signals">Most signals</option>
            </select>
          </div>
        )}

        {/* No search results */}
        {bots.length > 0 && displayedBots.length === 0 && (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-8 text-center text-sm text-white/40">
            No bots match “{search}”.
          </div>
        )}

        {/* Bots Grid */}
        {bots.length > 0 && (
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayedBots.map((bot) => {
              const indicators = [
                ...(bot?.rsi ? ["RSI"] : []),
                ...(bot?.bb ? ["BB"] : []),
                ...(bot?.sr ? ["S/R"] : []),
              ];
              const signalCount = signalCounts[bot.id] || 0;
              const stats = signalStats[bot.id];

              return (
                <div
                  key={bot.id}
                  className="relative rounded-xl sm:rounded-2xl border border-white/5 bg-white/[0.02] p-4 sm:p-5"
                >
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                        <BotIcon className="h-5 w-5 text-white/50" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white">Trading Bot</h3>
                        <p
                          className="text-xs text-white/40"
                          title={bot.created_at ? new Date(bot.created_at).toLocaleString() : ""}
                        >
                          {bot.created_at ? `Created ${timeAgo(bot.created_at)}` : "Recently created"}
                        </p>
                      </div>
                    </div>

                    {/* Delete Button - Always visible */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(bot.id);
                      }}
                      disabled={deleting[bot.id]}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/40 transition hover:bg-red-500/10 hover:text-red-400"
                    >
                      {deleting[bot.id] ? (
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      ) : (
                        <TrashIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Indicators */}
                  {indicators.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {indicators.map((ind) => (
                        <span
                          key={ind}
                          className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-white/60"
                        >
                          {ind}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Assets */}
                  {bot?.bot_assets?.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1">
                      {bot.bot_assets.slice(0, 4).map((asset) => (
                        <span
                          key={asset}
                          className="rounded bg-white/5 px-1.5 py-0.5 text-[11px] text-white/40"
                        >
                          {asset}
                        </span>
                      ))}
                      {bot.bot_assets.length > 4 && (
                        <span className="rounded bg-white/5 px-1.5 py-0.5 text-[11px] text-white/40">
                          +{bot.bot_assets.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 mb-4 py-3 border-t border-white/5">
                    <div>
                      <div className="text-[10px] text-white/30 uppercase">ROI</div>
                      <div className="text-sm font-medium">
                        {bot.roi ? `${parseFloat(bot.roi).toFixed(2)}%` : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-white/30 uppercase">Status</div>
                      <div className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${bot.is_active ? "bg-emerald-400" : "bg-white/30"}`} />
                        <span className="text-xs text-white/60">
                          {bot.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Performance summary (from signal history) */}
                  {stats && stats.total > 0 && (
                    <div className="mb-3 flex items-center gap-3 text-[11px] text-white/50">
                      <span className="flex items-center gap-1">
                        <span className="text-white/30">Win</span>
                        <span className="font-medium text-white/80">
                          {stats.winRate != null ? `${stats.winRate}%` : "—"}
                        </span>
                      </span>
                      <span className="h-3 w-px bg-white/10" />
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                        {stats.open} open
                      </span>
                      <span className="h-3 w-px bg-white/10" />
                      <span
                        className={`font-medium ${
                          stats.realized > 0
                            ? "text-emerald-400"
                            : stats.realized < 0
                            ? "text-red-400"
                            : "text-white/60"
                        }`}
                      >
                        {stats.realized > 0 ? "+" : ""}
                        {stats.realized.toFixed(1)}%
                      </span>
                    </div>
                  )}

                  {/* Signals Button */}
                  <button
                    onClick={(e) => fetchSignals(bot.id, e)}
                    disabled={loadingSignals[bot.id]}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-2.5 text-xs font-medium text-white/70 transition hover:bg-white/10"
                  >
                    {loadingSignals[bot.id] ? (
                      <>
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <ZapIcon className="h-3.5 w-3.5 text-blue-400" />
                        <span>
                          {signalCount > 0 ? `${signalCount} Signal${signalCount !== 1 ? 's' : ''}` : 'No Signals'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}

            {/* Create New Bot Card */}
            <button
              onClick={() => router.push("/lab")}
              className="flex min-h-[200px] flex-col items-center justify-center rounded-xl sm:rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-6 text-center transition hover:border-white/20 hover:bg-white/[0.02]"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                <PlusIcon className="h-5 w-5 text-white/40" />
              </div>
              <div className="text-sm font-medium text-white/60">Create New Bot</div>
              <div className="mt-1 text-xs text-white/30">Start trading automatically</div>
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setDeleteTarget(null)}
            />

            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="relative w-full sm:max-w-md"
            >
              <div className="rounded-t-2xl sm:rounded-2xl border border-white/10 bg-neutral-900 p-5 sm:p-6">
                <div className="sm:hidden w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
                
                <h2 className="text-lg font-semibold mb-2">Delete Bot?</h2>
                <p className="text-sm text-white/50 mb-6">
                  This action cannot be undone. Your bot and all its data will be permanently deleted.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium transition hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteTarget)}
                    className="flex-1 rounded-xl bg-red-500/10 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signals Modal */}
      <AnimatePresence>
        {selectedBot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedBot(null)}
            />

            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="relative w-full sm:max-w-2xl max-h-[85vh] sm:max-h-[80vh]"
            >
              <div className="rounded-t-2xl sm:rounded-2xl border border-white/10 bg-neutral-900 overflow-hidden">
                {/* Modal Header */}
                <div className="border-b border-white/5 p-4 sm:p-5">
                  <div className="sm:hidden w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />

                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold">Trading Signals</h2>
                      <p className="text-xs text-white/40">
                        {selectedBotSignals?.length || 0} total signals
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedBot(null)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/40 transition hover:bg-white/10"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Stat chips */}
                  {selectedBotStats && selectedBotStats.total > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-xl bg-white/[0.03] px-3 py-2">
                        <div className="text-[10px] uppercase text-white/30">Win rate</div>
                        <div className="text-sm font-semibold">
                          {selectedBotStats.winRate != null ? `${selectedBotStats.winRate}%` : "—"}
                        </div>
                      </div>
                      <div className="rounded-xl bg-white/[0.03] px-3 py-2">
                        <div className="text-[10px] uppercase text-white/30">Open</div>
                        <div className="text-sm font-semibold">{selectedBotStats.open}</div>
                      </div>
                      <div className="rounded-xl bg-white/[0.03] px-3 py-2">
                        <div className="text-[10px] uppercase text-white/30">Realized P&L</div>
                        <div
                          className={`text-sm font-semibold ${
                            selectedBotStats.realized > 0
                              ? "text-emerald-400"
                              : selectedBotStats.realized < 0
                              ? "text-red-400"
                              : ""
                          }`}
                        >
                          {selectedBotStats.realized > 0 ? "+" : ""}
                          {selectedBotStats.realized.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Filter tabs */}
                  {selectedBotSignals?.length > 0 && (
                    <div className="mt-3 flex gap-1.5">
                      {[
                        { id: "all", label: "All" },
                        { id: "open", label: "Open" },
                        { id: "closed", label: "Closed" },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setSignalFilter(tab.id)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                            signalFilter === tab.id
                              ? "bg-white text-black"
                              : "bg-white/5 text-white/50 hover:bg-white/10"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Signals List */}
                <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5">
                  {!filteredSignals || filteredSignals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <ActivityIcon className="mb-3 h-8 w-8 text-white/20" />
                      <p className="text-sm text-white/50">
                        {selectedBotSignals?.length > 0 ? "No signals in this filter" : "No signals yet"}
                      </p>
                      <p className="text-xs text-white/30">
                        {selectedBotSignals?.length > 0
                          ? "Try a different filter"
                          : "Signals will appear when your bot generates them"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredSignals.map((signal) => {
                        const pnl = signalPnlPct(signal);

                        return (
                          <div
                            key={signal.id}
                            className="rounded-xl border border-white/5 bg-white/[0.02] p-3 sm:p-4"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                {/* Signal Header */}
                                <div className="mb-2 flex items-center gap-2 flex-wrap">
                                  <span className="text-sm font-medium">{signal.asset?.symbol || signal.asset}</span>
                                  <span
                                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                                      signal.is_long
                                        ? "bg-emerald-500/10 text-emerald-400"
                                        : "bg-red-500/10 text-red-400"
                                    }`}
                                  >
                                    {signal.is_long ? "LONG" : "SHORT"}
                                  </span>
                                  <span
                                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                                      signal.is_open
                                        ? "bg-blue-500/10 text-blue-400"
                                        : "bg-white/5 text-white/40"
                                    }`}
                                  >
                                    {signal.is_open ? "OPEN" : "CLOSED"}
                                  </span>
                                </div>

                                {/* Signal Stats */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                  <div>
                                    <div className="text-[10px] text-white/30">Open</div>
                                    <div className="font-medium">${parseFloat(signal.open_price).toFixed(2)}</div>
                                  </div>
                                  {signal.close_price && (
                                    <div>
                                      <div className="text-[10px] text-white/30">Close</div>
                                      <div className="font-medium">${parseFloat(signal.close_price).toFixed(2)}</div>
                                    </div>
                                  )}
                                  {pnl !== null && (
                                    <div>
                                      <div className="text-[10px] text-white/30">P&L</div>
                                      <div className={`font-medium ${pnl > 0 ? "text-emerald-400" : pnl < 0 ? "text-red-400" : ""}`}>
                                        {pnl > 0 ? "+" : ""}{pnl.toFixed(2)}%
                                      </div>
                                    </div>
                                  )}
                                  <div>
                                    <div className="text-[10px] text-white/30">When</div>
                                    <div
                                      className="font-medium"
                                      title={
                                        signal.created_at
                                          ? new Date(signal.created_at).toLocaleString()
                                          : ""
                                      }
                                    >
                                      {timeAgo(signal.created_at)}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Direction Icon */}
                              <div className={`ml-3 ${signal.is_long ? "text-emerald-400/50" : "text-red-400/50"}`}>
                                {signal.is_long ? (
                                  <TrendingUpIcon className="h-5 w-5" />
                                ) : (
                                  <TrendingDownIcon className="h-5 w-5" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}