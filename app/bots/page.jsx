"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import CreateTile from "../components/Tile";
import { GetBots, DeleteBots } from "../api/ApiWrapper";

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
  X,
} from "lucide-react";

export default function Bots() {
  const router = useRouter();

  const [bots, setBots] = useState([]);
  const [loadingBots, setLoadingBots] = useState(true);

  const [selectedId, setSelectedId] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [deleting, setDeleting] = useState({});

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

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

  // HEADER SUBTITLE
  const headerSubtitle = useMemo(() => {
    if (loadingBots) return "Loading your bots…";
    if (bots.length === 0) return "Create your first strategy bot to get started.";
    return `${bots.length} ${bots.length === 1 ? "bot" : "bots"} in your workspace.`;
  }, [bots, loadingBots]);

  return (
    <div className="min-h-screen bg-[#0B0B12] text-slate-100">

      {/* HEADER */}
      <header className="sticky top-0 z-10 border-b border-white/[0.06] bg-[#0B0B12]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 ring-1 ring-white/[0.08] grid place-items-center">
            <Cpu className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Bots</h1>
            <p className="text-[13px] text-slate-500">{headerSubtitle}</p>
          </div>
        </div>
      </header>

      {/* SELECTED TOOLBAR */}
      {selectedId && bots.some((b) => b.id === selectedId) && (
        <div className="sticky top-[68px] z-10 bg-[#0B0B12]/90 backdrop-blur-lg border-b border-white/[0.06]">
          <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">

            <div className="text-[13px] text-slate-400">
              Selected: <span className="text-slate-200 font-medium">Bot #{selectedId}</span>
            </div>

            <button
              onClick={() => setSelectedId(null)}
              className="flex items-center gap-2 px-3 py-1.5 text-[13px] rounded-lg 
                         bg-white/[0.04] hover:bg-white/[0.08] ring-1 ring-white/[0.08] 
                         text-slate-300 transition-all duration-200"
            >
              <X className="h-3.5 w-3.5" /> Clear
            </button>

          </div>
        </div>
      )}

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* EMPTY STATE */}
        {!loadingBots && bots.length === 0 && (
          <div className="p-12 text-center rounded-2xl border border-white/[0.06] bg-white/[0.02]">

            <div className="h-14 w-14 rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.06] grid place-items-center mx-auto mb-5">
              <Bot className="h-7 w-7 text-slate-400" />
            </div>

            <h2 className="text-base font-medium text-slate-200">No bots yet</h2>
            <p className="text-sm text-slate-500 mt-1.5 max-w-xs mx-auto">
              Deploy your first RSI or SR strategy and monitor it here.
            </p>

            <button
              onClick={() => router.push("/lab")}
              className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl 
                         bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 
                         hover:bg-indigo-500/25 hover:border-indigo-500/40
                         transition-all duration-200"
            >
              Create Bot <ArrowRight className="h-4 w-4" />
            </button>

          </div>
        )}

        {/* LOADING STATE */}
        {loadingBots && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-8 w-8 rounded-full bg-white/[0.06] animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-white/[0.06] rounded animate-pulse" />
                    <div className="h-3 w-32 bg-white/[0.04] rounded mt-2 animate-pulse" />
                  </div>
                </div>
                <div className="h-20 bg-white/[0.04] rounded-xl animate-pulse mb-4" />
                <div className="h-9 bg-white/[0.04] rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* BOT GRID */}
        {!loadingBots && bots.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

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
                  style={{
                    transform: selected ? 'scale(0.995)' : undefined,
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  className={`group rounded-2xl border p-5 
                    bg-gradient-to-b from-white/[0.03] to-transparent
                    hover:from-white/[0.05] hover:to-white/[0.01]
                    hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20
                    transition-all duration-250
                    ${selected 
                      ? "border-indigo-500/40 ring-1 ring-indigo-500/20" 
                      : "border-white/[0.06] hover:border-white/[0.12]"
                    }`}
                >
                  {/* TOP ROW */}
                  <div className="flex items-start gap-3">

                    {/* SELECT */}
                    <button
                      onClick={() => setSelectedId(selected ? null : bot.id)}
                      className={`h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full border 
                        transition-all duration-200
                        ${selected 
                          ? "bg-indigo-500/20 border-indigo-400/50 text-indigo-300"
                          : "bg-white/[0.04] border-white/[0.1] text-slate-500 hover:bg-white/[0.08] hover:border-white/[0.15] hover:text-slate-300"
                        }`}
                    >
                      {selected 
                        ? <CheckCircle2 className="h-4 w-4" /> 
                        : <Circle className="h-4 w-4" />
                      }
                    </button>

                    {/* TITLE */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[15px] font-semibold text-slate-100 truncate">
                          Bot #{bot.id}
                        </h3>
                        {selected && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md 
                                           bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/25">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-slate-600 mt-0.5">
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
                      className="p-2 rounded-lg text-slate-600 
                                 hover:text-rose-400 hover:bg-rose-500/10
                                 transition-all duration-200 disabled:opacity-40"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>

                  </div>

                  {/* INDICATORS */}
                  <div className="mt-5">
                    <p className="text-[11px] font-medium text-slate-500 flex items-center gap-2 mb-2 uppercase tracking-wide">
                      <Activity className="h-3.5 w-3.5 text-slate-600" /> Indicators
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {indicators.length > 0 ? (
                        indicators.map((i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-md bg-white/[0.04] ring-1 ring-white/[0.08] 
                                       text-[12px] text-slate-300"
                          >
                            {i}
                          </span>
                        ))
                      ) : (
                        <span className="text-[12px] text-slate-600">—</span>
                      )}
                    </div>
                  </div>

                  {/* ASSETS */}
                  <div className="mt-4">
                    <p className="text-[11px] font-medium text-slate-500 flex items-center gap-2 mb-2 uppercase tracking-wide">
                      <LineChart className="h-3.5 w-3.5 text-slate-600" /> Cryptos
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {bot?.bot_assets?.length > 0 ? (
                        bot.bot_assets.map((a) => (
                          <span
                            key={a}
                            className="px-2.5 py-1 rounded-md bg-white/[0.04] ring-1 ring-white/[0.08] 
                                       text-[12px] text-slate-300"
                          >
                            {a}
                          </span>
                        ))
                      ) : (
                        <span className="text-[12px] text-slate-600">—</span>
                      )}
                    </div>
                  </div>

                  {/* DETAILS SECTION */}
                  <div className="mt-5 pt-4 border-t border-white/[0.06]">
                    <button
                      onClick={() =>
                        setExpanded((prev) => ({ ...prev, [bot.id]: !prev[bot.id] }))
                      }
                      className="text-[12px] flex items-center gap-1.5 text-slate-500 
                                 hover:text-slate-300 transition-colors duration-200"
                    >
                      {open ? (
                        <>Hide details <ChevronUp className="h-3.5 w-3.5" /></>
                      ) : (
                        <>View details <ChevronDown className="h-3.5 w-3.5" /></>
                      )}
                    </button>

                    {open && (
                      <div className="mt-4 text-[13px] text-slate-400 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                        {bot?.rsi && (
                          <div className="p-3 rounded-lg bg-white/[0.02] ring-1 ring-white/[0.06]">
                            <div className="font-medium text-slate-300 mb-2">RSI Settings</div>
                            <div className="flex flex-wrap gap-x-5 gap-y-1 text-[12px]">
                              <span className="text-slate-500">Period: <span className="text-slate-300">{bot.rsi.period ?? "—"}</span></span>
                              <span className="text-slate-500">Min: <span className="text-slate-300">{bot.rsi.min ?? "—"}</span></span>
                              <span className="text-slate-500">Max: <span className="text-slate-300">{bot.rsi.max ?? "—"}</span></span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* FOOTER */}
                  <div className="mt-4 pt-4 border-t border-white/[0.06]">
                    <button
                      onClick={() => setSelectedId(bot.id)}
                      className={`flex items-center gap-2 px-3 py-2 text-[12px] font-medium rounded-lg 
                          ring-1 transition-all duration-200
                          ${
                            selected
                              ? "bg-indigo-500/15 text-indigo-300 ring-indigo-500/30"
                              : "bg-white/[0.03] text-slate-400 ring-white/[0.08] hover:bg-white/[0.06] hover:text-slate-200"
                          }`}
                    >
                      {selected ? "Selected" : "Select"}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                </article>
              );
            })}

            {/* CREATE TILE */}
            <CreateTile
              locked={bots.length >= 1}
              onCreate={() => router.push("/lab")}
            />
          </div>
        )}
      </main>

      {/* DELETE MODAL */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setShowDeleteDialog(false)}
          />

          <div
            className="relative w-full max-w-sm rounded-2xl border border-white/[0.1]
                        bg-[#12121a] shadow-2xl shadow-black/50
                        p-6 animate-in fade-in zoom-in-95 duration-200"
          >
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              Delete Bot
            </h2>

            <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="text-slate-200 font-medium">Bot #{deleteTarget}</span>?
              <br />This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/[0.1] 
                           text-slate-400 text-[14px] font-medium
                           hover:bg-white/[0.04] hover:text-slate-200
                           transition-all duration-200"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl 
                           bg-rose-500/15 border border-rose-500/30 
                           text-rose-400 text-[14px] font-medium
                           hover:bg-rose-500/25 hover:border-rose-500/50
                           transition-all duration-200"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}