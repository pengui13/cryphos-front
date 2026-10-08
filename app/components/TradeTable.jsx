// components/TradeTable.jsx
"use client";

import { ArrowUpRight, ArrowDownLeft, Clock, Download } from "lucide-react";
import { useState } from "react";
import { formatNumber, formatPrice } from "./backtestFormat";

const THEME = {
  bg: "#0B0B12",
  border: "rgba(255,255,255,0.06)",
};

const STATUS_LABELS = {
  take_profit: "Take profit",
  stop_loss: "Stop loss",
};

// Backend orders: { asset, side: LONG|SHORT, open_time, price, value,
// close_time, close_price, closed, pnl, close_reason }. A trade still open
// when history ends is marked to the last close and has closed = false.
function toRow(o, i) {
  const entryPx = Number(o.price);
  const qty = Number(o.value ?? 0);
  const isLong = o.side !== "SHORT";
  const exitPx = o.close_price != null ? Number(o.close_price) : null;

  const plAbs =
    o.pnl != null
      ? Number(o.pnl)
      : exitPx != null
      ? (exitPx - entryPx) * qty * (isLong ? 1 : -1)
      : 0;
  // Return on the money committed to the trade, not on the unit price.
  const notional = entryPx * qty;
  const plPct = notional > 0 ? (plAbs / notional) * 100 : 0;

  const endTs = o.close_time ?? o.open_time;
  const mins = Math.max(0, Math.round((endTs - o.open_time) / 60));

  return {
    id: i + 1,
    asset: o.asset || "—",
    side: isLong ? "LONG" : "SHORT",
    entryTime: new Date(o.open_time * 1000).toLocaleString(),
    exitTime: o.closed && o.close_time ? new Date(o.close_time * 1000).toLocaleString() : "Open",
    entry: entryPx,
    exit: exitPx,
    size: qty,
    plAbs,
    plPct,
    mins,
    status: o.closed ? STATUS_LABELS[o.close_reason] || "Closed" : "Open",
    closed: !!o.closed,
    green: plAbs >= 0,
  };
}

export default function TradesTable({ orders = [], totalPnl, isMultiAsset = false }) {
  const [expandedRow, setExpandedRow] = useState(null);
  const rows = orders.map(toRow);

  const headers = [
    "Trade #",
    ...(isMultiAsset ? ["Asset"] : []),
    "Side",
    "Entry Time",
    "Exit Time",
    "Size",
    "Entry Price",
    "Exit Price",
    "P/L",
    "Return %",
    "Duration (min)",
    "Status",
  ];

  const exportRows = () =>
    rows.map((r) => [
      r.id,
      ...(isMultiAsset ? [r.asset] : []),
      r.side,
      r.entryTime,
      r.exitTime,
      r.size,
      r.entry,
      r.exit,
      r.plAbs,
      Number(r.plPct.toFixed(4)),
      r.mins,
      r.status,
    ]);

  const exportToCSV = () => {
    const csv = [
      headers.join(","),
      ...exportRows().map((row) =>
        row
          .map((cell) =>
            typeof cell === "string" && cell.includes(",") ? `"${cell}"` : cell
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trades-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToXLSX = async () => {
    try {
      const { utils, writeFile } = await import("xlsx");

      const ws = utils.aoa_to_sheet([headers, ...exportRows()]);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Trades");

      ws["!cols"] = Array(headers.length).fill({ wch: 15 });

      writeFile(wb, `trades-${new Date().toISOString().split("T")[0]}.xlsx`);
    } catch (error) {
      console.error("Error exporting to XLSX:", error);
      alert("Failed to export XLSX. Falling back to CSV.");
      exportToCSV();
    }
  };

  const statusClass = (r) =>
    !r.closed
      ? "bg-yellow-500/15 text-yellow-300 border border-yellow-400/20"
      : r.green
      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-400/20"
      : "bg-rose-500/15 text-rose-300 border border-rose-400/20";

  const sideClass = (r) =>
    r.side === "LONG"
      ? "bg-emerald-500/10 text-emerald-300"
      : "bg-rose-500/10 text-rose-300";

  const colCount = headers.length;

  return (
    <div className="px-5 pb-6 h-full flex flex-col">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="text-xs uppercase tracking-widest text-white/50 font-medium">
            Trade History
          </div>
          <div className="text-xs text-white/30">
            {rows.length} {rows.length === 1 ? "trade" : "trades"}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {totalPnl != null && (
            <div
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${
                totalPnl >= 0
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-400/20"
                  : "bg-rose-500/15 text-rose-300 border border-rose-400/20"
              }`}
            >
              Total PnL: {formatNumber(totalPnl)}
            </div>
          )}
          {rows.length > 0 && (
            <>
              <button
                onClick={exportToCSV}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg ring-1 ring-white/10 bg-white/5 hover:bg-white/10 transition text-white/80 hover:text-white"
                title="Export as CSV"
              >
                <Download className="h-3.5 w-3.5" />
                CSV
              </button>
              <button
                onClick={exportToXLSX}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg ring-1 ring-white/10 bg-white/5 hover:bg-white/10 transition text-white/80 hover:text-white"
                title="Export as Excel"
              >
                <Download className="h-3.5 w-3.5" />
                XLSX
              </button>
            </>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div
        className="hidden lg:block overflow-auto rounded-2xl border flex-1"
        style={{
          borderColor: THEME.border,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
          maxHeight: "500px",
        }}
      >
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                borderBottom: `1px solid ${THEME.border}`,
              }}
            >
              <th className="text-left px-4 py-3 text-xs font-semibold text-white/60 uppercase tracking-wider">
                #
              </th>
              {isMultiAsset && (
                <th className="text-center px-4 py-3 text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Asset
                </th>
              )}
              <th className="text-center px-4 py-3 text-xs font-semibold text-white/60 uppercase tracking-wider">
                Side
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-white/60 uppercase tracking-wider">
                Entry Time
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-white/60 uppercase tracking-wider">
                Exit Time
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-white/60 uppercase tracking-wider">
                Size
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-white/60 uppercase tracking-wider">
                Entry Price
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-white/60 uppercase tracking-wider">
                Exit Price
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-white/60 uppercase tracking-wider">
                P/L
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-white/60 uppercase tracking-wider">
                Return
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-white/60 uppercase tracking-wider">
                Duration
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-white/60 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody style={{ borderColor: THEME.border }}>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="px-4 py-8 text-center text-white/40">
                  <div className="text-sm">No trades executed</div>
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr
                  key={r.id}
                  style={{
                    borderBottom: `1px solid ${THEME.border}`,
                    background:
                      idx % 2 === 0
                        ? "rgba(255,255,255,0.01)"
                        : "rgba(255,255,255,0.005)",
                  }}
                  className="hover:bg-white/[0.08] transition-colors duration-200"
                >
                  <td className="px-4 py-3 text-white/70 font-medium">{r.id}</td>
                  {isMultiAsset && (
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-white/5 text-white/80 font-medium text-xs">
                        {r.asset}
                      </span>
                    </td>
                  )}
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold ${sideClass(r)}`}>
                      {r.side}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-white/80 text-sm font-medium">
                      {r.entryTime.split(",")[0]}
                    </div>
                    <div className="text-white/40 text-xs mt-0.5">
                      {r.entryTime.split(",")[1]}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-white/80 text-sm font-medium">
                      {r.exitTime === "Open" ? (
                        <span className="text-yellow-300">Open</span>
                      ) : (
                        r.exitTime.split(",")[0]
                      )}
                    </div>
                    <div className="text-white/40 text-xs mt-0.5">
                      {r.exitTime !== "Open" && r.exitTime.split(",")[1]}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-white/80 font-medium">{formatNumber(r.size, 6)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-white/80 font-medium">${formatPrice(r.entry)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-white/80 font-medium">${formatPrice(r.exit)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-sm ${
                        r.green
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-rose-500/15 text-rose-300"
                      }`}
                    >
                      {r.green ? (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDownLeft className="h-3.5 w-3.5" />
                      )}
                      {formatNumber(r.plAbs, 2)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm font-semibold ${r.green ? "text-emerald-300" : "text-rose-300"}`}>
                      {r.plPct > 0 ? "+" : ""}
                      {formatNumber(r.plPct, 2)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-white/70">
                      <Clock className="h-3.5 w-3.5 text-white/40" />
                      <span className="text-sm font-medium">{r.mins}m</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold ${statusClass(r)}`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-2.5 flex-1 overflow-y-auto pr-2">
        {rows.length === 0 ? (
          <div className="text-center text-white/40 py-8">
            <div className="text-sm">No trades executed</div>
          </div>
        ) : (
          rows.map((r) => (
            <div
              key={r.id}
              onClick={() => setExpandedRow(expandedRow === r.id ? null : r.id)}
              className="rounded-lg border p-3 cursor-pointer transition-all"
              style={{
                borderColor: THEME.border,
                background:
                  expandedRow === r.id
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.015)",
              }}
            >
              {/* Mobile Card Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-white/60 bg-white/5 px-1.5 py-0.5 rounded">
                      #{r.id}
                    </span>
                    {isMultiAsset && (
                      <span className="text-xs font-semibold bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">
                        {r.asset}
                      </span>
                    )}
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${sideClass(r)}`}>
                      {r.side}
                    </span>
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${statusClass(r)}`}>
                      {r.status}
                    </span>
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-xs text-white/60">
                      Entry: <span className="text-white/90 font-medium">${formatPrice(r.entry)}</span>
                    </div>
                    <div className="text-xs text-white/60">
                      Exit: <span className="text-white/90 font-medium">${formatPrice(r.exit)}</span>
                    </div>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg font-bold text-sm whitespace-nowrap ${
                    r.green
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-rose-500/20 text-rose-300"
                  }`}
                >
                  {r.green ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownLeft className="h-3.5 w-3.5" />
                  )}
                  <span>{formatNumber(r.plAbs, 2)}</span>
                </div>
              </div>

              {/* Mobile Card Expanded */}
              {expandedRow === r.id && (
                <div
                  className="mt-2.5 pt-2.5 border-t space-y-2"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/50 uppercase tracking-wider">Return</span>
                    <span className={`text-xs font-semibold ${r.green ? "text-emerald-300" : "text-rose-300"}`}>
                      {r.plPct > 0 ? "+" : ""}
                      {formatNumber(r.plPct, 2)}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/50 uppercase tracking-wider">Size</span>
                    <span className="text-xs font-medium text-white/80">{formatNumber(r.size, 6)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/50 uppercase tracking-wider">Duration</span>
                    <span className="text-xs font-medium text-white/80">{r.mins}m</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/50 uppercase tracking-wider">Entry Time</span>
                    <span className="text-white/70 text-right">{r.entryTime.split(",")[0]}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/50 uppercase tracking-wider">Exit Time</span>
                    <span className={`text-right ${r.exitTime === "Open" ? "text-yellow-300" : "text-white/70"}`}>
                      {r.exitTime === "Open" ? "Open" : r.exitTime.split(",")[0]}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
