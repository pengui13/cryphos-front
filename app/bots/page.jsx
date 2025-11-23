// app/bots/Bots.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import CreateTile from "../components/Tile";
import BacktestModal from "../components/BacktestModal";
import { GetBots, DeleteBots, GetBacktestData } from "../api/ApiWrapper";
import {
  Cpu,
  LineChart,
  Activity,
  ArrowRight,
  Trash2,
  ChevronDown,
  ChevronUp,
  Robot,
  Loader2,
  Circle,
  CheckCircle2,
  FlaskConical,
  X,
} from "lucide-react";

const arr = (x) => (Array.isArray(x) ? x : []);

export default function Bots() {
  const [bots, setBots] = useState([]);
  const [loadingBots, setLoadingBots] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [deleting, setDeleting] = useState({});
  const [selectedId, setSelectedId] = useState(null);

  // backtest state
  const [btOpen, setBtOpen] = useState(false);
  const [btLoading, setBtLoading] = useState(false);
  const [btResult, setBtResult] = useState(null);
  const [showBacktestDialog, setShowBacktestDialog] = useState(false);
  const [backTestParams, setBackTestParams] = useState({
    usdt_value: "1000",
    take_profit: "10",
    stop_loss: "5",
  });

  useEffect(() => {
    GetBots((res) => {
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : [];
      setBots(list || []);
      setLoadingBots(false);
    });
  }, []);

  async function handleDelete(id) {
    if (!id) return;
    const snapshot = bots;

    setDeleting((p) => ({ ...p, [id]: true }));
    setBots((p) => p.filter((b) => b.id !== id));

    try {
      await DeleteBots(id);
      if (selectedId === id) setSelectedId(null);
    } catch (e) {
      console.error("delete bot failed", e);
      setBots(snapshot);
    } finally {
      setDeleting((p) => {
        const cp = { ...p };
        delete cp[id];
        return cp;
      });
    }
  }

  const openBacktestDialog = () => {
    setShowBacktestDialog(true);
  };

  const runBacktest = async () => {
    if (!selectedId || !backTestParams.usdt_value) return;

    // Validate inputs
    const usdt = parseFloat(backTestParams.usdt_value);
    const tp = parseFloat(backTestParams.take_profit);
    const sl = parseFloat(backTestParams.stop_loss);

    if (isNaN(usdt) || usdt <= 0) {
      alert("Please enter a valid USDT amount");
      return;
    }

    if (isNaN(tp) || tp <= 0) {
      alert("Please enter a valid Take Profit %");
      return;
    }

    if (isNaN(sl) || sl <= 0) {
      alert("Please enter a valid Stop Loss %");
      return;
    }

    setShowBacktestDialog(false);
    setBtOpen(true);
    setBtLoading(true);
    setBtResult(null);

    try {
      // Send all parameters in request body
      await GetBacktestData(selectedId, {
        usdt_value: usdt,
        take_profit: tp,
        stop_loss: sl,
      }, (data) => {
        setBtResult(data || null);
      });
    } catch (e) {
      console.error("Backtest error:", e);
      setBtResult(null);
    } finally {
      setBtLoading(false);
    }
  };

  const headerSubtitle = useMemo(() => {
    if (loadingBots) return "Loading your bots…";
    if ((bots || []).length === 0)
      return "Create your first strategy bot to get started.";
    return `${bots.length} ${bots.length === 1 ? "bot" : "bots"} in your workspace.`;
  }, [bots, loadingBots]);

  return (
    <div className="min-h-screen bg-[#0B0B12] text-slate-100">
      {/* header */}
      <header className="sticky top-0 z-10 border-b border-white/5 bg-[#0B0B12]/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 ring-1 ring-white/10 grid place-items-center">
              <Cpu className="h-4 w-4 text-indigo-300" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Bots</h1>
              <p className="text-xs text-slate-400">{headerSubtitle}</p>
            </div>
          </div>
        </div>
      </header>

      {/* selected toolbar */}
      {selectedId && (
        <div className="sticky top-[56px] z-10 border-b border-white/5 bg-[#0B0B12]/80 backdrop-blur">
          <div className="mx-auto max-w-7xl px-5 py-3 flex items-center justify-between">
            <div className="text-xs text-slate-300">
              Selected:&nbsp;
              <span className="font-medium">Bot #{selectedId}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={openBacktestDialog}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs ring-1 ring-indigo-400/30 bg-indigo-500/10 hover:bg-indigo-500/15 text-indigo-200 transition"
              >
                <FlaskConical className="h-4 w-4" />
                Backtest
              </button>
              <button
                onClick={() => setSelectedId(null)}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs ring-1 ring-white/10 bg-white/5 hover:bg-white/10 transition"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-5 py-8">
        {/* empty state */}
        {!loadingBots && (!bots || bots.length === 0) && (
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-10 text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-white/5 grid place-items-center">
              <Robot className="h-6 w-6 text-slate-300" />
            </div>
            <h2 className="text-base font-medium">No bots yet</h2>
            <p className="mt-1 text-sm text-slate-400">
              Deploy your first RSI or SR strategy and monitor it here.
            </p>
          </div>
        )}

        {/* skeleton */}
        {loadingBots && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 animate-pulse"
              >
                <div className="h-5 w-40 bg-white/5 rounded mb-4" />
                <div className="h-24 bg-white/5 rounded mb-4" />
                <div className="h-8 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* cards */}
        {!loadingBots && bots && bots.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {bots.map((bot) => {
              const isDeleting = !!deleting[bot.id];
              const isOpen = !!expanded[bot.id];
              const selected = selectedId === bot.id;

              const indicators =
                Array.isArray(bot?.indicators) && bot.indicators.length
                  ? bot.indicators
                  : [
                      ...(bot?.rsi ? ["RSI"] : []),
                      ...(bot?.sr ? ["SR"] : []),
                    ];

              return (
                <article
                  key={bot.id}
                  className={[
                    "group relative rounded-2xl border border-white/5",
                    "bg-gradient-to-b from-white/[0.03] to-white/[0.015] p-4 backdrop-blur",
                    "transition-all hover:border-white/10 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]",
                    selected
                      ? "ring-2 ring-indigo-400/50 translate-y-0.5 scale-[0.997]"
                      : "translate-y-0",
                  ].join(" ")}
                >
                  {/* header row */}
                  <div className="grid grid-cols-[auto_1fr_auto] items-start gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedId(selected ? null : bot.id)
                      }
                      aria-pressed={selected}
                      className={[
                        "mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full border transition",
                        selected
                          ? "bg-indigo-500/20 border-indigo-400/40 text-indigo-200"
                          : "bg-white/10 border-white/15 text-slate-200 hover:bg-white/14",
                      ].join(" ")}
                    >
                      {selected ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold tracking-tight flex items-center gap-2">
                        <span className="truncate">Bot #{bot.id}</span>
                        {selected && (
                          <span className="rounded-full bg-indigo-500/15 text-indigo-200 ring-1 ring-indigo-400/20 px-2 py-0.5 text-[10px]">
                            Selected
                          </span>
                        )}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {bot?.created_at
                          ? new Date(bot.created_at).toLocaleString()
                          : "—"}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(bot.id)}
                      disabled={isDeleting}
                      className="rounded-lg p-2 text-slate-300 hover:text-rose-200 hover:bg-rose-500/10 ring-1 ring-transparent hover:ring-rose-400/20 transition disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* sections */}
                  <div className="mt-4 space-y-4">
                    {/* indicators */}
                    <section>
                      <p className="mb-2 flex items-center gap-2 text-[11px] text-slate-400">
                        <Activity className="h-3.5 w-3.5" />
                        Indicators
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {(indicators.length ? indicators : ["—"]).map(
                          (name) => (
                            <span
                              key={name}
                              className="px-2 py-0.5 rounded-lg bg-white/5 text-[11px] text-slate-200 ring-1 ring-white/10"
                            >
                              {name}
                            </span>
                          )
                        )}
                      </div>
                    </section>

                    {/* assets */}
                    <section>
                      <p className="mb-2 flex items-center gap-2 text-[11px] text-slate-400">
                        <LineChart className="h-3.5 w-3.5" />
                        Cryptos
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {(bot?.bot_assets || []).length ? (
                          bot.bot_assets.map((sym) => (
                            <span
                              key={sym}
                              className="px-2 py-0.5 rounded-lg bg-white/5 text-[11px] text-slate-200 ring-1 ring-white/10"
                            >
                              {sym}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-500">
                            —
                          </span>
                        )}
                      </div>
                    </section>

                    {/* details */}
                    <div className="border-t border-white/5 pt-3">
                      <button
                        onClick={() =>
                          setExpanded((p) => ({
                            ...p,
                            [bot.id]: !p[bot.id],
                          }))
                        }
                        className="inline-flex items-center gap-2 text-[11px] text-slate-300 hover:text-slate-200"
                      >
                        {isOpen ? (
                          <>
                            Hide details{" "}
                            <ChevronUp className="h-3.5 w-3.5" />
                          </>
                        ) : (
                          <>
                            View details{" "}
                            <ChevronDown className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>

                      {isOpen && (
                        <div className="mt-3 space-y-3 text-[12px] text-slate-300">
                          {/* RSI block */}
                          {bot?.rsi && (
                            <div className="space-y-1.5">
                              <div className="font-medium text-slate-200">
                                RSI
                              </div>
                              <div className="flex flex-wrap gap-x-4 gap-y-1">
                                <span className="text-slate-500">
                                  period:
                                </span>
                                <span>{bot.rsi.period ?? "—"}</span>
                                <span className="text-slate-500">
                                  min:
                                </span>
                                <span>{bot.rsi.min ?? "—"}</span>
                                <span className="text-slate-500">
                                  max:
                                </span>
                                <span>{bot.rsi.max ?? "—"}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* footer button */}
                  <div className="mt-4 border-t border-white/5 pt-3">
                    <button
                      onClick={() => setSelectedId(bot.id)}
                      className={[
                        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] ring-1 transition",
                        selected
                          ? "bg-indigo-500/15 ring-indigo-400/30 text-indigo-200"
                          : "bg-white/[0.02] hover:bg-white/[0.06] ring-white/10 text-slate-200",
                      ].join(" ")}
                    >
                      {selected ? "Selected" : "Select"}{" "}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}

            <CreateTile locked={(bots?.length || 0) >= 1} onCreate={() => {}} />
          </div>
        )}
      </main>

      {/* Backtest Parameters Dialog */}
      {showBacktestDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowBacktestDialog(false)}
          />

          <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-slate-100 mb-1">
              Backtest Parameters
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Configure trade parameters for your backtest
            </p>

            <div className="space-y-4 mb-6">
              {/* USDT Value */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Trade Value (USDT)
                </label>
                <input
                  type="number"
                  value={backTestParams.usdt_value}
                  onChange={(e) =>
                    setBackTestParams({
                      ...backTestParams,
                      usdt_value: e.target.value,
                    })
                  }
                  placeholder="1000"
                  min="0"
                  step="100"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-400/50 focus:ring-1 focus:ring-indigo-400/30 transition"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Amount per trade
                </p>
              </div>

              {/* Take Profit */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Take Profit (%)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={backTestParams.take_profit}
                    onChange={(e) =>
                      setBackTestParams({
                        ...backTestParams,
                        take_profit: e.target.value,
                      })
                    }
                    placeholder="10"
                    min="0"
                    step="0.5"
                    className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/30 transition"
                  />
                  <div className="px-3 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-medium">
                    Close +{backTestParams.take_profit || "0"}%
                  </div>
                </div>
              </div>

              {/* Stop Loss */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Stop Loss (%)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={backTestParams.stop_loss}
                    onChange={(e) =>
                      setBackTestParams({
                        ...backTestParams,
                        stop_loss: e.target.value,
                      })
                    }
                    placeholder="5"
                    min="0"
                    step="0.5"
                    className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-400/50 focus:ring-1 focus:ring-rose-400/30 transition"
                  />
                  <div className="px-3 py-2.5 rounded-lg bg-rose-500/10 border border-rose-400/20 text-rose-300 text-xs font-medium">
                    Close -{backTestParams.stop_loss || "0"}%
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="mb-6 p-3 rounded-lg bg-white/[0.03] border border-white/5">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Trades will automatically close when they reach your{" "}
                <span className="text-emerald-300 font-medium">take profit</span>
                {" "}or{" "}
                <span className="text-rose-300 font-medium">stop loss</span>
                {" "}targets.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBacktestDialog(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 transition text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={runBacktest}
                className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 hover:bg-indigo-500/30 transition text-sm font-medium flex items-center justify-center gap-2"
              >
                <FlaskConical className="h-4 w-4" />
                Run Backtest
              </button>
            </div>
          </div>
        </div>
      )}

      <BacktestModal
        open={btOpen}
        onClose={() => setBtOpen(false)}
        loading={btLoading}
        result={btResult}
        selectedId={selectedId}
      />
    </div>
  );
}