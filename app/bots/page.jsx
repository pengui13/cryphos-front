"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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
  Bot,
  Loader2,
  Circle,
  CheckCircle2,
  FlaskConical,
  X,
} from "lucide-react";

export default function Bots() {
  const router = useRouter();

  const [bots, setBots] = useState([]);
  const [loadingBots, setLoadingBots] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [deleting, setDeleting] = useState({});

  // delete modal
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // backtest modal
  const [btOpen, setBtOpen] = useState(false);
  const [btLoading, setBtLoading] = useState(false);
  const [btResult, setBtResult] = useState(null);

  // backtest input
  const [backTestParams, setBackTestParams] = useState({
    usdt_value: "1000",
    take_profit: "10",
    stop_loss: "5",
  });

  // LOAD BOTS
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

  // CLEAR SELECTION if bots disappear
  useEffect(() => {
    if (!loadingBots && bots.length === 0) {
      setSelectedId(null);
    }
  }, [bots, loadingBots]);

  // DELETE BOT
  async function handleDeleteConfirm() {
    if (!deleteTarget) return;

    const id = deleteTarget;
    setShowDeleteDialog(false);

    const snapshot = bots;

    setDeleting((prev) => ({ ...prev, [id]: true }));
    setBots((prev) => prev.filter((b) => b.id !== id));

    try {
      await DeleteBots(id);
      if (selectedId === id) setSelectedId(null);
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

  // RUN BACKTEST
  const runBacktest = async () => {
    if (!selectedId) return;

    const usdt = Number(backTestParams.usdt_value);
    const tp = Number(backTestParams.take_profit);
    const sl = Number(backTestParams.stop_loss);

    if (!usdt || usdt <= 0) return alert("Invalid USDT");
    if (!tp || tp <= 0) return alert("Invalid TP");
    if (!sl || sl <= 0) return alert("Invalid SL");

    setBtOpen(true);
    setBtLoading(true);

    try {
      await GetBacktestData(
        selectedId,
        { usdt_value: usdt, take_profit: tp, stop_loss: sl },
        (data) => setBtResult(data || null)
      );
    } catch (err) {
      console.error("Backtest error", err);
    } finally {
      setBtLoading(false);
    }
  };

  const headerSubtitle = useMemo(() => {
    if (loadingBots) return "Loading your bots…";
    if (bots.length === 0) return "Create your first strategy bot to get started.";
    return `${bots.length} ${bots.length === 1 ? "bot" : "bots"} in your workspace.`;
  }, [bots, loadingBots]);

  return (
    <div className="min-h-screen bg-[#0B0B12] text-slate-100">

      {/* HEADER */}
      <header className="sticky top-0 z-10 border-b border-white/5 bg-[#0B0B12]/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-5 py-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 ring-1 ring-white/10 grid place-items-center">
            <Cpu className="h-4 w-4 text-indigo-300" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Bots</h1>
            <p className="text-xs text-slate-400">{headerSubtitle}</p>
          </div>
        </div>
      </header>

      {/* SELECTED TOOLBAR */}
      {selectedId && bots.some((b) => b.id === selectedId) && (
        <div className="sticky top-[56px] z-10 bg-[#0B0B12]/80 backdrop-blur border-b border-white/5">
          <div className="mx-auto max-w-7xl px-5 py-3 flex items-center justify-between">

            <div className="text-xs text-slate-300">
              Selected: <span className="font-medium">Bot #{selectedId}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={runBacktest}
                className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 ring-1 ring-indigo-400/30 text-indigo-200"
              >
                <FlaskConical className="h-4 w-4" /> Backtest
              </button>

              <button
                onClick={() => setSelectedId(null)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10"
              >
                <X className="h-4 w-4" /> Clear
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-5 py-8">

        {/* EMPTY STATE */}
        {!loadingBots && bots.length === 0 && (
          <div className="p-10 text-center rounded-2xl border border-white/5 bg-white/[0.02]">

            <div className="h-12 w-12 rounded-2xl bg-white/5 grid place-items-center mx-auto mb-4">
              <Bot className="h-6 w-6 text-slate-300" />
            </div>

            <h2 className="text-base font-medium">No bots yet</h2>
            <p className="text-sm text-slate-400 mt-1">
              Deploy your first RSI or SR strategy and monitor it here.
            </p>

            <button
              onClick={() => router.push("/lab")}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg 
                         bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 
                         hover:bg-indigo-500/30 transition"
            >
              Create Bot <ArrowRight className="h-4 w-4" />
            </button>

          </div>
        )}

        {/* LOADING */}
        {loadingBots && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] animate-pulse">
                <div className="h-5 w-40 bg-white/5 mb-4 rounded" />
                <div className="h-24 bg-white/5 mb-4 rounded" />
                <div className="h-8 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* BOT GRID */}
        {!loadingBots && bots.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {bots.map((bot) => {
              const open = expanded[bot.id];
              const isDeleting = deleting[bot.id];
              const selected = selectedId === bot.id;

              const indicators = bot?.indicators?.length
                ? bot.indicators
                : [...(bot?.rsi ? ["RSI"] : []), ...(bot?.sr ? ["SR"] : [])];

              return (
                <article
                  key={bot.id}
                  className={`rounded-2xl border p-4 backdrop-blur
                    bg-gradient-to-b from-white/[0.03] to-white/[0.015]
                    ${selected ? "ring-2 ring-indigo-400/50 scale-[0.997]" : "hover:border-white/10"}`}
                >
                  {/* TOP ROW */}
                  <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-start">

                    {/* SELECT */}
                    <button
                      onClick={() => setSelectedId(selected ? null : bot.id)}
                      className={`h-7 w-7 flex items-center justify-center rounded-full border transition
                        ${selected ? "bg-indigo-500/20 border-indigo-400/40 text-indigo-200"
                                   : "bg-white/10 border-white/15 hover:bg-white/14"}`}
                    >
                      {selected ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                    </button>

                    {/* TITLE */}
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold flex gap-2">
                        <span className="truncate">Bot #{bot.id}</span>
                        {selected && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/15
                                           text-indigo-200 ring-1 ring-indigo-400/20">
                            Selected
                          </span>
                        )}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {bot.created_at ? new Date(bot.created_at).toLocaleString() : "—"}
                      </p>
                    </div>

                    {/* DELETE */}
                    <button
                      onClick={() => {
                        setDeleteTarget(bot.id);
                        setShowDeleteDialog(true);
                      }}
                      disabled={isDeleting}
                      className="p-2 rounded-lg text-slate-300 hover:text-rose-200 hover:bg-rose-500/10
                                 transition disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>

                  </div>

                  {/* INDICATORS */}
                  <div className="mt-4">
                    <p className="text-[11px] text-slate-400 flex items-center gap-2 mb-2">
                      <Activity className="h-3.5 w-3.5" /> Indicators
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {indicators.length > 0 ? (
                        indicators.map((i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-white/5 ring-1 ring-white/10 text-[11px]">
                            {i}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-500">—</span>
                      )}
                    </div>
                  </div>

                  {/* ASSETS */}
                  <div className="mt-4">
                    <p className="text-[11px] text-slate-400 flex items-center gap-2 mb-2">
                      <LineChart className="h-3.5 w-3.5" /> Cryptos
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {bot?.bot_assets?.length > 0 ? (
                        bot.bot_assets.map((a) => (
                          <span key={a} className="px-2 py-0.5 rounded bg-white/5 ring-1 ring-white/10 text-[11px]">
                            {a}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-500">—</span>
                      )}
                    </div>
                  </div>

                  {/* DETAILS SECTION */}
                  <div className="mt-4 border-t border-white/5 pt-3">
                    <button
                      onClick={() => setExpanded((prev) => ({ ...prev, [bot.id]: !prev[bot.id] }))}
                      className="text-[11px] flex items-center gap-2 text-slate-300 hover:text-slate-200"
                    >
                      {open ? (
                        <>Hide details <ChevronUp className="h-3 w-3" /></>
                      ) : (
                        <>View details <ChevronDown className="h-3 w-3" /></>
                      )}
                    </button>

                    {open && (
                      <div className="mt-3 text-[12px] text-slate-300 space-y-3">
                        {bot?.rsi && (
                          <div>
                            <div className="font-medium text-slate-200">RSI</div>
                            <div className="flex flex-wrap gap-3 mt-1 text-slate-400">
                              <span>period:</span> <span>{bot.rsi.period ?? "—"}</span>
                              <span>min:</span> <span>{bot.rsi.min ?? "—"}</span>
                              <span>max:</span> <span>{bot.rsi.max ?? "—"}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                  {/* FOOTER */}
                  <div className="mt-4 border-t border-white/5 pt-3">
                    <button
                      onClick={() => setSelectedId(bot.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] rounded-lg ring-1 transition
                        ${selected ? "bg-indigo-500/15 text-indigo-200 ring-indigo-400/30"
                                   : "bg-white/[0.02] hover:bg-white/[0.06] ring-white/10"}`}
                    >
                      {selected ? "Selected" : "Select"}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                </article>
              );
            })}

            {/* CREATE TILE → redirect to lab */}
            <CreateTile locked={bots.length >= 1} onCreate={() => router.push("/lab")} />

          </div>
        )}
      </main>

      {/* DELETE MODAL */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteDialog(false)}
          />

          <div className="relative w-full max-w-sm rounded-2xl border border-white/10
                          bg-gradient-to-b from-white/[0.08] to-white/[0.02]
                          p-6 backdrop-blur-xl">

            <h2 className="text-lg font-semibold text-slate-100 mb-2">Delete Bot</h2>

            <p className="text-sm text-slate-400 mb-6">
              Are you sure you want to delete{" "}
              <span className="text-white font-semibold">Bot #{deleteTarget}</span>?
              <br />This action is irreversible.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 
                           text-slate-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-lg bg-rose-500/20 border border-rose-400/30 
                           text-rose-200 hover:bg-rose-500/30 transition"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}

      {/* BACKTEST MODAL */}
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
