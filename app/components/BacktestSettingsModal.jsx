"use client";

import { useEffect, useState } from "react";
import { X, SlidersHorizontal } from "lucide-react";

const THEME = {
  bg: "#0B0B12",
  border: "rgba(255,255,255,0.08)",
};

export default function BacktestSettingsModal({
  open,
  onClose,
  onRun,
  defaultValues = {},
}) {
  const [usdt, setUsdt] = useState(defaultValues.usdt_value || 1000);
  const [tp, setTp] = useState(defaultValues.take_profit || 10);
  const [sl, setSl] = useState(defaultValues.stop_loss || 5);

  // Reset when opened
  useEffect(() => {
    if (open) {
      setUsdt(defaultValues.usdt_value || 1000);
      setTp(defaultValues.take_profit || 10);
      setSl(defaultValues.stop_loss || 5);
    }
  }, [open, defaultValues]);

  // ESC close
  useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const submit = () => {
    if (!Number(usdt) || usdt <= 0) return alert("Enter valid USDT value");
    if (!Number(tp) || tp <= 0) return alert("Enter valid Take Profit (%)");
    if (!Number(sl) || sl <= 0) return alert("Enter valid Stop Loss (%)");

    onRun({
      usdt_value: Number(usdt),
      take_profit: Number(tp),
      stop_loss: Number(sl),
    });
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div
          className="relative w-full max-w-md rounded-2xl p-6 border shadow-xl"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
            borderColor: THEME.border,
            boxShadow:
              "0 25px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 grid place-items-center rounded-xl bg-indigo-500/15 ring-1 ring-indigo-400/20">
                <SlidersHorizontal className="h-4 w-4 text-indigo-200" />
              </div>
              <p className="text-sm font-semibold text-slate-100 tracking-tight">
                Backtest Settings
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            {/* USDT Value */}
            <div>
              <label className="text-xs text-slate-300">USDT Value</label>
              <input
                type="number"
                value={usdt}
                onChange={(e) => setUsdt(e.target.value)}
                className="mt-1 w-full rounded-xl px-3 py-2 bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                placeholder="1000"
              />
            </div>

            {/* Take Profit */}
            <div>
              <label className="text-xs text-slate-300">Take Profit (%)</label>
              <input
                type="number"
                value={tp}
                onChange={(e) => setTp(e.target.value)}
                className="mt-1 w-full rounded-xl px-3 py-2 bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                placeholder="10"
              />
            </div>

            {/* Stop Loss */}
            <div>
              <label className="text-xs text-slate-300">Stop Loss (%)</label>
              <input
                type="number"
                value={sl}
                onChange={(e) => setSl(e.target.value)}
                className="mt-1 w-full rounded-xl px-3 py-2 bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                placeholder="5"
              />
            </div>
          </div>

          {/* Run button */}
          <button
            onClick={submit}
            className="mt-6 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition ring-1 ring-indigo-400/30"
          >
            Run Backtest
          </button>
        </div>
      </div>
    </div>
  );
}
