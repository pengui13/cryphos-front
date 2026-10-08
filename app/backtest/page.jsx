"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FlaskConical, Plus } from "lucide-react";
import { GetBots } from "../api/ApiWrapper";
import { usePing } from "../providers";
import AuthScreen from "../components/AuthScreen.jsx";
import useBacktest from "../components/useBacktest";

// Bot fields the serializer returns, in the order they are shown.
const INDICATORS = [
  ["rsi", "RSI"],
  ["bb", "BB"],
  ["sr", "S/R"],
  ["ema", "EMA"],
  ["ma", "MA"],
  ["fib", "Fibo"],
  ["macd", "MACD"],
  ["obv", "OBV"],
  ["volume", "Volume"],
  ["smc", "SMC"],
  ["atr", "ATR"],
  ["funding", "Funding"],
  ["fng", "Fear & Greed"],
];

export default function BacktestPage() {
  const router = useRouter();
  const ping = usePing();
  const backtest = useBacktest();
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ping) return;
    GetBots((res) => {
      const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      setBots(list);
      setLoading(false);
    });
  }, [ping]);

  if (!ping) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 px-4 pb-16 pt-24 text-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 ring-1 ring-indigo-400/20">
            <FlaskConical className="h-5 w-5 text-indigo-200" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Backtest</h1>
            <p className="text-sm text-white/40">
              Replay a bot&apos;s strategy over stored history before you trust it with signals.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-36 animate-pulse rounded-2xl border border-white/5 bg-white/[0.02]" />
            ))}
          </div>
        ) : bots.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
            <p className="text-sm text-white/60">You have no bots to backtest yet.</p>
            <button
              onClick={() => router.push("/lab")}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90"
            >
              <Plus className="h-4 w-4" />
              Create a bot
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {bots.map((bot) => {
              const enabled = INDICATORS.filter(([key]) => bot?.[key]);
              const assets = bot?.bot_assets || [];
              return (
                <div
                  key={bot.id}
                  className="flex flex-col rounded-2xl border border-white/5 bg-white/[0.02] p-4"
                >
                  <div className="mb-3 flex items-baseline justify-between gap-2">
                    <h2 className="truncate text-sm font-medium">
                      {bot.name || `Bot #${bot.id}`}
                    </h2>
                    <span className="shrink-0 text-[11px] text-white/30">#{bot.id}</span>
                  </div>

                  {enabled.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {enabled.map(([key, label]) => (
                        <span key={key} className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-white/60">
                          {label}
                        </span>
                      ))}
                    </div>
                  )}

                  {assets.length > 0 && (
                    <div className="mb-4 text-[11px] text-white/40">
                      {assets.slice(0, 6).join(" · ")}
                      {assets.length > 6 ? ` +${assets.length - 6}` : ""}
                    </div>
                  )}

                  <button
                    onClick={() => backtest.start(bot.id)}
                    className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-500/10 py-2.5 text-xs font-medium text-indigo-200 ring-1 ring-indigo-400/20 transition hover:bg-indigo-500/20"
                  >
                    <FlaskConical className="h-3.5 w-3.5" />
                    Run backtest
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {backtest.elements}
    </div>
  );
}
