"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GetBots, DeleteBots } from "../api/ApiWrapper";
import { Trash2, Plus, TrendingUp } from "lucide-react";

export default function Bots() {
  const router = useRouter();

  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    GetBots((res) => {
      const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      setBots(list || []);
      setLoading(false);
    });
  }, []);

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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black" />

      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="mb-3 bg-gradient-to-br from-white to-white/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
            Your Bots
          </h1>
          <p className="text-lg text-white/50">
            {loading
              ? "Loading..."
              : bots.length === 0
              ? "Create your first trading bot"
              : `${bots.length} active ${bots.length === 1 ? "bot" : "bots"}`}
          </p>
        </motion.header>

        {/* Empty State */}
        {!loading && bots.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-[32px] border border-white/10 bg-white/[0.02] p-16 text-center"
          >
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5">
              <TrendingUp className="h-10 w-10 text-white/40" />
            </div>
            <h2 className="mb-2 text-2xl font-semibold">No bots yet</h2>
            <p className="mb-8 max-w-md text-white/50">
              Create your first automated trading bot with custom indicators
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/lab")}
              className="flex items-center gap-2 rounded-2xl bg-white px-8 py-3 font-semibold text-black transition hover:bg-white/90"
            >
              <Plus className="h-5 w-5" />
              Create Bot
            </motion.button>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-[32px] border border-white/10 bg-white/[0.02]"
              />
            ))}
          </div>
        )}

        {/* Bots Grid */}
        {!loading && bots.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {bots.map((bot, index) => {
                const indicators = [
                  ...(bot?.rsi ? ["RSI"] : []),
                  ...(bot?.bb ? ["Bollinger"] : []),
                  ...(bot?.sr ? ["S/R"] : []),
                ];

                return (
                  <motion.article
                    key={bot.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition-all hover:border-white/20"
                  >
                    {/* Delete Button */}
                    <button
                      onClick={() => setDeleteTarget(bot.id)}
                      disabled={deleting[bot.id]}
                      className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 opacity-0 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                    >
                      {deleting[bot.id] ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>

                    {/* Content */}
                    <div className="mb-6">
                      <div className="mb-4 text-xs text-white/40">
                        {bot.created_at
                          ? new Date(bot.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Recently created"}
                      </div>

                      <h3 className="mb-2 text-xl font-semibold">Trading Bot</h3>

                      {/* Indicators */}
                      <div className="mb-4 flex flex-wrap gap-2">
                        {indicators.map((ind) => (
                          <span
                            key={ind}
                            className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80"
                          >
                            {ind}
                          </span>
                        ))}
                      </div>

                      {/* Assets */}
                      {bot?.bot_assets?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {bot.bot_assets.slice(0, 3).map((asset) => (
                            <span
                              key={asset}
                              className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-white/60"
                            >
                              {asset}
                            </span>
                          ))}
                          {bot.bot_assets.length > 3 && (
                            <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-white/60">
                              +{bot.bot_assets.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
                      <div>
                        <div className="text-xs text-white/40">ROI</div>
                        <div className="text-lg font-semibold">
                          {bot.roi ? `${parseFloat(bot.roi).toFixed(2)}%` : "—"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-white/40">Status</div>
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              bot.is_active ? "bg-green-400" : "bg-white/30"
                            }`}
                          />
                          <span className="text-sm text-white/80">
                            {bot.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}

              {/* Create New Bot Card */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: bots.length * 0.05 }}
                whileHover={{ y: -4 }}
                onClick={() => router.push("/lab")}
                className="group flex min-h-[16rem] flex-col items-center justify-center rounded-[32px] border border-dashed border-white/20 bg-white/[0.02] p-6 text-center transition-all hover:border-white/40 hover:bg-white/[0.04]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 transition group-hover:bg-white/10">
                  <Plus className="h-6 w-6 text-white/60" />
                </div>
                <div className="text-sm font-medium text-white/80">Create New Bot</div>
                <div className="mt-1 text-xs text-white/40">Start trading automatically</div>
              </motion.button>
            </AnimatePresence>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setDeleteTarget(null)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md"
            >
              <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] blur-xl" />
              <div className="relative rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent p-8 backdrop-blur-2xl">
                <h2 className="mb-2 text-2xl font-bold">Delete Bot?</h2>
                <p className="mb-8 text-white/60">
                  This action cannot be undone. Your bot and all its data will be permanently deleted.
                </p>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDeleteTarget(null)}
                    className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-medium transition hover:bg-white/10"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDelete(deleteTarget)}
                    className="flex-1 rounded-2xl bg-red-500/10 px-6 py-3 font-medium text-red-400 ring-1 ring-red-500/20 transition hover:bg-red-500/20"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}