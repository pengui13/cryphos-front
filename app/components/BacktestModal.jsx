// components/BacktestModal.jsx
"use client";

import { useEffect, useState } from "react";
import {
  FlaskConical,
  X,
  Loader2,
  BarChart3,
  Target,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import ChartCard from "./ChartCard";
import TradesTable from "./TradeTable";
import { formatNumber, timeframeLabel } from "./backtestFormat";

const INDICATOR_NAMES = { funding: "Funding Rates", fng: "Fear & Greed" };

const THEME = {
  bg: "#0B0B12",
  border: "rgba(255,255,255,0.08)",
};

export default function BacktestModal({
  open,
  onClose,
  loading,
  result,
  error,
  selectedId,
}) {
  const [selectedAsset, setSelectedAsset] = useState(null);

  // ESC close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Init asset when result changes
  useEffect(() => {
    if (!result) {
      setSelectedAsset(null);
      return;
    }

    if (result.asset === "MULTI" && result.by_asset) {
      const assets = Object.keys(result.by_asset);
      setSelectedAsset(assets[0] || null);
    } else if (result.asset && result.asset !== "MULTI") {
      setSelectedAsset(result.asset);
    } else {
      setSelectedAsset(null);
    }
  }, [result]);

  if (!open) return null;

  const isMultiAsset = result?.asset === "MULTI";
  const assets = isMultiAsset ? Object.keys(result?.by_asset || {}) : [];

  // Current asset data (multi) or whole result (single)
  let currentAssetData = null;
  if (isMultiAsset) {
    currentAssetData = selectedAsset
      ? result?.by_asset?.[selectedAsset] || null
      : null;
  } else {
    currentAssetData = result || null;
  }

  const assetSymbol = isMultiAsset
    ? selectedAsset || "—"
    : String(result?.asset || "BTC").toUpperCase();

  const rsiCfg = result?.rsi_config || {};
  const params = result?.parameters || {};

  // Finest first; the candles are on timeframes[0].
  const timeframes = (result?.timeframes || []).map(timeframeLabel);
  const displayCandles = currentAssetData?.candles || [];

  const hasData = !!result && displayCandles.length > 0;
  // Reported by the backend when there is no stored history to replay.
  const emptyReason = error || result?.error || null;
  const unsupported = result?.unsupported_indicators || [];
  const ruined = result?.ruined_assets || [];

  // All orders across all assets
  const allOrders = result?.orders || [];
  const ordersCount = allOrders.length;

  // Global PnL / ROI (header pills)
  const totalPnlGlobal =
    result?.total_pnl != null ? Number(result.total_pnl) : null;
  const roi = result?.roi != null ? Number(result.roi) : null;

  // Stats & per-view PnL. Each asset is funded with its own stake, so an
  // asset's return is its final balance against that stake.
  const stats = isMultiAsset ? currentAssetData?.stats : result?.stats;
  const viewTotalPnl = isMultiAsset
    ? Number(currentAssetData?.total_pnl ?? 0)
    : totalPnlGlobal ?? 0;
  const stake = Number(params.usdt_value);
  const viewRoi =
    isMultiAsset && currentAssetData?.final_equity != null && stake > 0
      ? ((Number(currentAssetData.final_equity) - stake) / stake) * 100
      : roi;

  return (
    <div
      className="fixed inset-0 z-40"
      role="dialog"
      aria-modal="true"
      aria-label={`Backtest for Bot #${selectedId ?? ""}`}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* shell */}
      <div className="absolute max-h-[90vh] mt-[10vh] inset-0 flex items-center justify-center px-4 sm:px-6">
        <div
          className="relative w-full max-w-[1200px] rounded-3xl border overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
            borderColor: THEME.border,
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
            maxHeight: "90vh",
          }}
        >
          {/* header */}
          <div
            className="sticky top-0 z-10"
            style={{
              background:
                "linear-gradient(180deg, rgba(20,22,32,0.85), rgba(20,22,32,0.75))",
              backdropFilter: "blur(10px)",
              borderBottom: `1px solid ${THEME.border}`,
            }}
          >
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-2xl grid place-items-center bg-indigo-500/15 ring-1 ring-indigo-400/25">
                  <FlaskConical className="h-4 w-4 text-indigo-200" />
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-tight text-slate-100">
                    Backtest • Bot #{selectedId ?? "—"}
                    {isMultiAsset ? " • Multi-Asset" : ` • ${assetSymbol}`}
                    {timeframes.length > 0 ? ` • ${timeframes.join(" + ")}` : ""}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {loading
                      ? "Replaying your strategy over stored history…"
                      : hasData
                      ? `${ordersCount} trade${
                          ordersCount === 1 ? "" : "s"
                        } • TP ${params.take_profit ?? "—"}% / SL ${
                          params.stop_loss ?? "—"
                        }% • ${params.usdt_value ?? "—"} USDT${
                          isMultiAsset ? " per asset" : ""
                        }`
                      : "No data returned"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {hasData && !loading && roi != null && (
                  <div
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      roi >= 0
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-rose-500/10 text-rose-300"
                    }`}
                  >
                    ROI: {roi >= 0 ? "+" : ""}
                    {roi.toFixed(2)}%
                  </div>
                )}
                {hasData && !loading && totalPnlGlobal != null && (
                  <div
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      totalPnlGlobal >= 0
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-rose-500/10 text-rose-300"
                    }`}
                  >
                    PnL: {totalPnlGlobal >= 0 ? "+" : ""}
                    {totalPnlGlobal.toFixed(2)}
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs ring-1 ring-white/10 bg-white/5 hover:bg-white/10 transition text-slate-100"
                >
                  <X className="h-4 w-4" />
                  Close
                </button>
              </div>
            </div>

            {/* Asset selector for multi-asset */}
            {isMultiAsset && assets.length > 0 && (
              <div
                className="px-5 py-3 flex gap-2 border-t flex-wrap"
                style={{ borderColor: THEME.border }}
              >
                {assets.map((asset) => (
                  <button
                    key={asset}
                    onClick={() => setSelectedAsset(asset)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      selectedAsset === asset
                        ? "bg-indigo-500/20 ring-1 ring-indigo-400/30 text-indigo-200"
                        : "bg-white/5 ring-1 ring-white/10 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {asset}
                    {ruined.includes(asset) && (
                      <span className="ml-1 text-rose-300" title="Balance ran out">
                        ✕
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Timeframes the simulation read */}
            {timeframes.length > 0 && (
              <div
                className="px-5 py-3 flex flex-wrap items-center gap-2 border-t"
                style={{ borderColor: THEME.border }}
              >
                <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                  Timeframes:
                </span>
                {timeframes.map((tf, i) => (
                  <span
                    key={tf}
                    className="px-2.5 py-1 rounded-lg bg-blue-500/15 ring-1 ring-blue-400/20 text-blue-300 text-xs font-medium"
                  >
                    {tf}
                    {i === 0 && timeframes.length > 1 ? " · chart" : ""}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* content */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "calc(90vh - 64px)" }}
          >
            {loading ? (
              <div className="px-6 py-16 text-center text-slate-300">
                <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
                Running backtest…
              </div>
            ) : !hasData ? (
              <div className="px-6 py-16 text-center text-slate-400">
                {emptyReason || "No data."}
              </div>
            ) : (
              <div className="py-6 px-5 space-y-5">
                {unsupported.length > 0 && (
                  <Notice>
                    {unsupported
                      .map((u) => INDICATOR_NAMES[u.indicator] || u.indicator)
                      .join(" and ")}{" "}
                    {unsupported.length === 1 ? "has" : "have"} no stored history,
                    so {unsupported.length === 1 ? "it was" : "they were"} left
                    out of this simulation. The live bot still applies{" "}
                    {unsupported.length === 1 ? "it" : "them"}, so expect fewer
                    trades than shown here.
                  </Notice>
                )}
                {ruined.length > 0 && (
                  <Notice>
                    The balance ran out on {ruined.join(", ")}; no further trades
                    were taken there.
                  </Notice>
                )}

                {/* stats section (per current asset or global single-asset) */}
                {stats?.total_trades > 0 ? (
                  <StatsSection
                    stats={stats}
                    roi={viewRoi}
                    totalPnl={viewTotalPnl}
                  />
                ) : (
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-4 text-sm text-slate-400">
                    The strategy&apos;s conditions never lined up on{" "}
                    {isMultiAsset ? assetSymbol : "this history"}, so no trades
                    were opened.
                  </div>
                )}

                {/* chart - show current asset */}
                {currentAssetData && (
                  <ChartCard
                    result={{
                      asset: assetSymbol,
                      rsi_config: rsiCfg,
                      parameters: params,
                      orders: currentAssetData.orders || [],
                      candles: displayCandles,
                    }}
                    height={420}
                  />
                )}

                {/* trades table - all orders from all assets */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.02]">
                  <TradesTable
                    orders={allOrders}
                    totalPnl={totalPnlGlobal}
                    isMultiAsset={isMultiAsset}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Notice({ children }) {
  return (
    <div className="flex items-start gap-2.5 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] px-4 py-3 text-xs leading-relaxed text-amber-200/90">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
      <div>{children}</div>
    </div>
  );
}

function StatsSection({ stats, roi, totalPnl }) {
  const winRate = Number(stats.win_rate) || 0;
  const meanPnl = Number(stats.mean_pnl) || 0;
  const maxPnl = Number(stats.max_pnl) || 0;
  const minPnl = Number(stats.min_pnl) || 0;
  const drawdownPct = Number(stats.max_drawdown_pct) || 0;
  const profitFactor = Number(stats.profit_factor) || 0;

  return (
    <div className="space-y-4">
      {/* main metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* total pnl & win rate */}
        <div
          className="rounded-2xl border p-5 backdrop-blur-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(99,102,241,0.06))",
            borderColor: "rgba(99,102,241,0.2)",
            boxShadow:
              "0 8px 24px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">
                Performance
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-3xl font-bold text-blue-300">
                    {stats.total_trades}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Total Trades
                  </div>
                </div>
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 ring-1 ring-blue-400/20 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-blue-300" />
            </div>
          </div>
          <div className="pt-3 border-t border-white/5 flex gap-4">
            <div>
              <div className="text-emerald-300 font-semibold text-sm">
                {stats.profitable_trades}
              </div>
              <div className="text-[11px] text-slate-500">Wins</div>
            </div>
            <div>
              <div className="text-rose-300 font-semibold text-sm">
                {stats.non_profitable_trades}
              </div>
              <div className="text-[11px] text-slate-500">Losses</div>
            </div>
          </div>
        </div>

        {/* win rate */}
        <div
          className="rounded-2xl border p-5 backdrop-blur-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.04))",
            borderColor: "rgba(34,197,94,0.15)",
            boxShadow:
              "0 8px 24px rgba(34,197,94,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">
                Win Rate
              </div>
              <div className="text-4xl font-bold text-emerald-300 leading-tight">
                {winRate.toFixed(1)}%
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-400/20 flex items-center justify-center">
              <Target className="h-5 w-5 text-emerald-300" />
            </div>
          </div>
          <div className="pt-3 border-t border-white/5">
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${winRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* ROI - highlighted */}
        <div
          className="rounded-2xl border p-5 backdrop-blur-xl"
          style={{
            background: `linear-gradient(135deg, ${
              roi >= 0
                ? "rgba(34,197,94,0.12), rgba(34,197,94,0.06)"
                : "rgba(244,63,94,0.12), rgba(244,63,94,0.06)"
            })`,
            borderColor:
              roi >= 0 ? "rgba(34,197,94,0.2)" : "rgba(244,63,94,0.2)",
            boxShadow: `0 8px 24px ${
              roi >= 0 ? "rgba(34,197,94,0.12)" : "rgba(244,63,94,0.12)"
            }, inset 0 1px 0 rgba(255,255,255,0.05)`,
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">
                Return on Investment
              </div>
              <div
                className={`text-4xl font-bold leading-tight ${
                  roi >= 0 ? "text-emerald-300" : "text-rose-300"
                }`}
              >
                {roi >= 0 ? "+" : ""}
                {roi?.toFixed(2) ?? "0"}%
              </div>
            </div>
            <div
              className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                roi >= 0
                  ? "bg-emerald-500/10 ring-1 ring-emerald-400/20"
                  : "bg-rose-500/10 ring-1 ring-rose-400/20"
              }`}
            >
              <TrendingUp
                className={`h-5 w-5 ${
                  roi >= 0 ? "text-emerald-300" : "text-rose-300"
                }`}
              />
            </div>
          </div>
          <div className="pt-3 border-t border-white/5 text-xs text-slate-400">
            <span>Total PnL: </span>
            <span className={roi >= 0 ? "text-emerald-300" : "text-rose-300"}>
              {totalPnl >= 0 ? "+" : ""}
              {totalPnl?.toFixed(2) ?? "0"}
            </span>
          </div>
        </div>
      </div>

      {/* secondary metrics row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          className="rounded-2xl border p-4 backdrop-blur-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(168,85,247,0.06), rgba(139,92,246,0.04))",
            borderColor: "rgba(168,85,247,0.15)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <div className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">
            Avg Duration
          </div>
          <div className="text-2xl font-bold text-purple-300">
            {stats.mean_duration_minutes?.toFixed(0) ?? "—"}
            <span className="text-sm font-normal text-slate-500 ml-1.5">
              min
            </span>
          </div>
        </div>

        <div
          className="rounded-2xl border p-4 backdrop-blur-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.06), rgba(99,102,241,0.04))",
            borderColor: "rgba(139,92,246,0.15)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <div className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">
            Mean PnL
          </div>
          <div
            className={`text-2xl font-bold ${
              meanPnl >= 0 ? "text-emerald-300" : "text-rose-300"
            }`}
          >
            {meanPnl >= 0 ? "+" : ""}
            {meanPnl.toFixed(2)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            best {formatNumber(maxPnl)} · worst {formatNumber(minPnl)}
          </div>
        </div>

        <div
          className="rounded-2xl border p-4 backdrop-blur-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(244,63,94,0.06), rgba(244,63,94,0.03))",
            borderColor: "rgba(244,63,94,0.15)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <div className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">
            Max Drawdown
          </div>
          <div className="text-2xl font-bold text-rose-300">
            {formatNumber(drawdownPct)}%
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {formatNumber(stats.max_drawdown)} USDT from peak
          </div>
        </div>

        <div
          className="rounded-2xl border p-4 backdrop-blur-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(59,130,246,0.06), rgba(59,130,246,0.03))",
            borderColor: "rgba(59,130,246,0.15)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <div className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">
            Profit Factor
          </div>
          <div
            className={`text-2xl font-bold ${
              profitFactor >= 1 ? "text-emerald-300" : "text-rose-300"
            }`}
          >
            {/* 0 from the backend means there were no losing trades. */}
            {profitFactor > 0 ? formatNumber(profitFactor) : stats.profitable_trades > 0 ? "∞" : "0"}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">gross profit ÷ gross loss</div>
        </div>
      </div>
    </div>
  );
}
