"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import * as LWC from "lightweight-charts";

/* ========================= THEME ========================= */
const THEME = {
  // surfaces
  bg: "#0A0A12",
  panel: "rgba(18,18,28,0.85)",
  border: "rgba(255,255,255,0.06)",
  // text
  text: "#E7EAF3",
  textDim: "#9AA0AE",
  // grid / crosshair
  grid: "rgba(100,110,140,0.12)",
  gridSoft: "rgba(100,110,140,0.06)",
  cross: "#8B5CF6",
  // candles
  upBody: "rgba(34,197,94,0.85)",
  upWick: "rgba(44,210,110,0.95)",
  downBody: "rgba(239,68,68,0.85)",
  downWick: "rgba(249,112,112,0.95)",
  // indicators
  rsi: "#C084FC",
  rsiLevel: "rgba(200,210,230,0.45)",
  priceLine: "#8B5CF6",
  // trades
  buy: "#22C55E",
  sell: "#EF4444",
  tpLine: "rgba(34,197,94,0.30)",
  // accents
  badge: "rgba(139,92,246,0.15)",
};

/* ========================= HELPERS ========================= */
const toSec = (t) => (t > 1e12 ? Math.floor(t / 1000) : t);

const uniqueAsc = (arr) => {
  const byTime = new Map();
  for (const x of arr) byTime.set(x.time, x);
  const a = Array.from(byTime.values()).sort((p, q) => p.time - q.time);
  return a.filter((x, i) => i === 0 || x.time > a[i - 1].time);
};

/* Snap each open to the previous close + ensure high/low bounds.
   Adds tiny widening for doji so the bar remains visible & crisp. */
function fixKlinesGaps(candles, useEpsWiden = true) {
  if (!candles.length) return candles;
  const out = [];
  for (let i = 0; i < candles.length; i++) {
    const prev = out[i - 1];
    let { time, open, high, low, close, volume } = candles[i];

    if (i > 0 && Number.isFinite(prev?.close)) open = prev.close;

    const maxOC = Math.max(open, close);
    const minOC = Math.min(open, close);
    if (high < maxOC) high = maxOC;
    if (low > minOC) low = minOC;

    if (useEpsWiden && high === low) {
      const eps = Math.max(1e-8, Math.abs(close) * 1e-6);
      high = close + eps;
      low = close - eps;
      open = close;
    }

    out.push({ time, open, high, low, close, volume: volume ?? null });
  }
  return out;
}

/* RSI fallback */
function rsiFromCandles(candles, period = 14) {
  if (candles.length < period + 1) return [];
  const closes = candles.map((c) => ({ t: c.time, v: c.close }));
  let g = 0,
    l = 0;
  for (let i = 1; i <= period; i++) {
    const d = closes[i].v - closes[i - 1].v;
    if (d >= 0) g += d;
    else l -= d;
  }
  let ag = g / period,
    al = l / period;
  const out = [];
  const i0 = period;
  const rs0 = al === 0 ? 100 : ag / al;
  const r0 = al === 0 ? 100 : 100 - 100 / (1 + rs0);
  out.push({ time: closes[i0].t, value: Number(r0.toFixed(2)) });
  for (let i = period + 1; i < closes.length; i++) {
    const d = closes[i].v - closes[i - 1].v;
    const G = d > 0 ? d : 0,
      L = d < 0 ? -d : 0;
    ag = (ag * (period - 1) + G) / period;
    al = (al * (period - 1) + L) / period;
    const rs = al === 0 ? 100 : ag / al;
    const r = al === 0 ? 100 : 100 - 100 / (1 + rs);
    out.push({ time: closes[i].t, value: Number(r.toFixed(2)) });
  }
  return out;
}

/* Payload normalizer (incl. gap fix) */
function normalizeAssetPayload(asset) {
  const raw = uniqueAsc(
    (asset.candles || []).map((c) => ({
      time: toSec(Number(c.time)),
      open: Number(c.open),
      high: Number(c.high),
      low: Number(c.low),
      close: Number(c.close),
      volume: c.volume == null ? null : Number(c.volume),
    }))
  );
  const candles = fixKlinesGaps(raw, true);

  const rsi = uniqueAsc(
    (asset.rsi || []).map((p) => ({
      time: toSec(Number(p.time)),
      value: Number(p.value),
    }))
  );

  const trades = (asset.trades || []).map((t) => ({
    side: t.side || "BUY",
    entry_time: toSec(Number(t.entry_time)),
    entry_price: Number(t.entry_price),
    target_price: Number(t.target_price),
    exit_time: t.exit_time ? toSec(Number(t.exit_time)) : null,
    exit_price: t.exit_price != null ? Number(t.exit_price) : null,
    achieved: !!t.achieved,
  }));

  return { symbol: asset.symbol, candles, rsi, trades };
}

/* Price formatting + spacing */
function priceFormatFromSample(price) {
  const decimals = Math.min(
    8,
    Math.max(0, String(price).split(".")[1]?.length || 2)
  );
  const minMove = Number((1 / Math.pow(10, decimals)).toFixed(decimals));
  return { precision: decimals, minMove };
}
function autoBarSpacing(w, n) {
  if (!w || !n) return 8;
  const target = Math.max(80, Math.min(180, n)); // target density
  return Math.max(2, Math.min(14, Math.floor((w / target) * 0.9)));
}

/* ========================= CHART CARD ========================= */
function ChartCard({ asset, theme = THEME, height = 560 }) {
  const canvasRef = useRef(null);
  const hudRef = useRef(null);

  const { symbol, candles } = asset;
  const rsi = asset.rsi?.length ? asset.rsi : rsiFromCandles(candles, 14);
  const trades = asset.trades || [];

  /* ---- PnL table rows ---- */
  const pnlRows = useMemo(() => {
    if (!trades.length || !candles.length) return [];
    const lastClose = candles[candles.length - 1].close;
    const nf2 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
    const dt = (s) => new Date(s * 1000);

    return trades.map((t, i) => {
      const hasExit = !!t.exit_time;
      const exitPrice = hasExit ? t.exit_price : lastClose;
      const plAbs = (exitPrice - t.entry_price) * (t.side === "BUY" ? 1 : -1);
      const plPct = (plAbs / t.entry_price) * 100;
      const durationMs =
        (hasExit ? t.exit_time : candles[candles.length - 1].time) * 1000 -
        t.entry_time * 1000;
      return {
        id: i + 1,
        entryTime: dt(t.entry_time).toLocaleString(),
        exitTime: hasExit ? dt(t.exit_time).toLocaleString() : "Open",
        entry: nf2.format(t.entry_price),
        exit: nf2.format(exitPrice),
        target: nf2.format(t.target_price),
        plAbs: nf2.format(plAbs),
        plPct: `${nf2.format(plPct)}%`,
        mins: Math.max(0, Math.round(durationMs / 60000)),
        status: hasExit ? (t.achieved ? "Closed (TP)" : "Closed") : "Open",
        green: plAbs >= 0,
      };
    });
  }, [trades, candles]);

  /* ---- Chart render ---- */
  useEffect(() => {
    const root = canvasRef.current;
    if (!root || !candles.length) return;

    const last = candles[candles.length - 1];
    const { precision, minMove } = priceFormatFromSample(last.close);

    const chart = LWC.createChart(root, {
      width: root.clientWidth || 900,
      height,
      layout: { background: { color: theme.bg }, textColor: theme.text },
      grid: {
        vertLines: { color: theme.grid, style: 1 },
        horzLines: { color: theme.gridSoft, style: 1 },
      },
      crosshair: {
        mode: 0,
        vertLine: {
          color: theme.cross,
          width: 1,
          style: 1,
          labelBackgroundColor: theme.cross,
        },
        horzLine: {
          color: theme.cross,
          width: 1,
          style: 1,
          labelBackgroundColor: theme.cross,
        },
      },
      rightPriceScale: { borderVisible: false, visible: true },
      leftPriceScale: { borderVisible: false, visible: true },
      timeScale: {
        borderVisible: false,
        rightOffset: 6,
        barSpacing: autoBarSpacing(root.clientWidth, candles.length),
        timeVisible: true,
        secondsVisible: false,
      },
      watermark: {
        visible: !!symbol,
        text: String(symbol || "").toUpperCase(),
        color: "rgba(139,92,246,0.08)",
        horzAlign: "left",
        vertAlign: "bottom",
        fontSize: 40,
      },
    });

    // Candles with softened look
    const candleSeries = chart.addCandlestickSeries({
      upColor: theme.upBody,
      downColor: theme.downBody,
      wickUpColor: theme.upWick,
      wickDownColor: theme.downWick,
      borderVisible: false,
      priceLineVisible: true,
      priceLineColor: theme.priceLine,
      lastValueVisible: true,
      priceFormat: { type: "price", precision, minMove },
    });
    candleSeries.setData(candles);

    // RSI as a thin, crisp line
    const rsiSeries = chart.addLineSeries({
      priceScaleId: "left",
      color: theme.rsi,
      lineWidth: 1.75,
      lastValueVisible: false,
      priceLineVisible: false,
    });
    if (rsi.length) {
      rsiSeries.setData(rsi);
      // Anchor 0..100 on left
      const t0 = rsi[0].time,
        t1 = rsi[rsi.length - 1].time;
      const anchor = chart.addLineSeries({
        priceScaleId: "left",
        color: "rgba(0,0,0,0)",
        lineWidth: 0,
        lastValueVisible: false,
        priceLineVisible: false,
      });
      anchor.setData([
        { time: t0, value: 0 },
        { time: t1, value: 100 },
      ]);
      // Guide levels
      const dashed = { lineStyle: 2, lineWidth: 1, color: theme.rsiLevel, axisLabelVisible: true };
      rsiSeries.createPriceLine({ price: 30, title: "RSI 30", ...dashed });
      rsiSeries.createPriceLine({ price: 70, title: "RSI 70", ...dashed });
    }

    // Reserve bottom space for RSI
    chart.priceScale("left").applyOptions({
      scaleMargins: { top: 0.76, bottom: 0.04 },
      borderVisible: false,
    });
    chart.priceScale("right").applyOptions({
      scaleMargins: { top: 0.06, bottom: 0.24 },
      borderVisible: false,
    });

    // Trade markers & TP segments
    if (trades.length) {
      const nf2 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
      const markers = [];
      trades.forEach((t) => {
        markers.push({
          time: t.entry_time,
          position: "belowBar",
          color: theme.buy,
          shape: "arrowUp",
          text: `BUY ${nf2.format(t.entry_price)}`,
        });
        if (t.exit_time) {
          markers.push({
            time: t.exit_time,
            position: "aboveBar",
            color: theme.sell,
            shape: "arrowDown",
            text: `SELL ${nf2.format(t.exit_price)}`,
          });
        }
        // Take-profit line
        const seg = chart.addLineSeries({
          priceScaleId: "right",
          color: theme.tpLine,
          lineWidth: 2,
          lastValueVisible: false,
          priceLineVisible: false,
        });
        const tEnd = t.exit_time || candles[candles.length - 1].time;
        seg.setData([
          { time: t.entry_time, value: t.target_price },
          { time: tEnd, value: t.target_price },
        ]);
      });
      candleSeries.setMarkers(markers);
    }

    /* ----- Floating HUD (legend) ----- */
    const hud = hudRef.current;
    const fmt2 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
    const fmt4 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 });

    function setHUD(param) {
      if (!hud) return;
      const tp = param?.time;
      const cs = param?.seriesPrices?.get?.(candleSeries);
      const rs = param?.seriesPrices?.get?.(rsiSeries);
      if (!tp || !cs) {
        const lastC = candles[candles.length - 1];
        const lastR = rsi[rsi.length - 1]?.value;
        hud.innerHTML = `
          <div class="flex items-center gap-3">
            <span class="px-2 py-0.5 rounded bg-[${THEME.badge}] text-[${THEME.text}] text-[11px] tracking-wide">${(symbol || "").toUpperCase()}</span>
            <span class="text-[${THEME.text}]">O ${fmt4.format(lastC.open)}</span>
            <span class="text-[${THEME.text}]">H ${fmt4.format(lastC.high)}</span>
            <span class="text-[${THEME.text}]">L ${fmt4.format(lastC.low)}</span>
            <span class="text-[${THEME.text}]">C ${fmt4.format(lastC.close)}</span>
            <span class="text-[${THEME.textDim}]">RSI ${lastR != null ? fmt2.format(lastR) : "—"}</span>
          </div>`;
        return;
      }
      const o = cs?.open,
        h = cs?.high,
        l = cs?.low,
        c = cs?.close;
      const r = rs ?? null;
      hud.innerHTML = `
        <div class="flex flex-wrap items-center gap-3">
          <span class="px-2 py-0.5 rounded bg-[${THEME.badge}] text-[${THEME.text}] text-[11px] tracking-wide">${(symbol || "").toUpperCase()}</span>
          <span class="text-[${THEME.text}]">O ${fmt4.format(o)}</span>
          <span class="text-[${THEME.text}]">H ${fmt4.format(h)}</span>
          <span class="text-[${THEME.text}]">L ${fmt4.format(l)}</span>
          <span class="text-[${THEME.text}]">C ${fmt4.format(c)}</span>
          <span class="text-[${THEME.textDim}]">RSI ${r != null ? fmt2.format(r) : "—"}</span>
        </div>`;
    }

    chart.subscribeCrosshairMove(setHUD);
    setHUD(); // initial fill

    // Resize
    const ro = new ResizeObserver(([entry]) => {
      const w = entry?.contentRect?.width || 0;
      if (w > 0) {
        chart.applyOptions({
          width: w,
          timeScale: { barSpacing: autoBarSpacing(w, candles.length) },
        });
      }
    });
    ro.observe(root);

    return () => {
      ro.disconnect();
      chart.unsubscribeCrosshairMove(setHUD);
      chart.remove();
    };
  }, [symbol, candles, rsi, trades, theme, height]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Card container */}
      <div
        className="w-[92%] md:w-[86%] lg:w-[80%] rounded-2xl"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
          border: `1px solid ${THEME.border}`,
          boxShadow:
            "0 20px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-xl"
              style={{
                background:
                  "conic-gradient(from 180deg at 50% 50%, #8B5CF6, #22C55E, #8B5CF6)",
                opacity: 0.9,
              }}
            />
            <div className="leading-tight">
              <div className="text-sm tracking-wide text-white/90">
                {(symbol || "").toUpperCase()}
              </div>
              <div className="text-[11px] text-white/50">Backtest preview</div>
            </div>
          </div>
          <div
            ref={hudRef}
            className="text-[12px] font-medium text-white/90"
          />
        </div>

        {/* Chart */}
        <div
          ref={canvasRef}
          className="w-full"
          style={{
            height,
            borderTop: `1px solid ${THEME.border}`,
            borderBottom: `1px solid ${THEME.border}`,
          }}
        />

        {/* Table */}
        <div className="px-5 py-4">
          <div className="mb-2 text-xs uppercase tracking-widest text-white/50">
            Trades & Profit
          </div>
          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: THEME.border }}>
            <table className="min-w-full text-sm">
              <thead className="bg-white/5 text-white/60">
                <tr>
                  <th className="text-left px-4 py-2">#</th>
                  <th className="text-left px-4 py-2">Buy time</th>
                  <th className="text-left px-4 py-2">Sell time</th>
                  <th className="text-right px-4 py-2">Entry</th>
                  <th className="text-right px-4 py-2">Exit/Last</th>
                  <th className="text-right px-4 py-2">Target</th>
                  <th className="text-right px-4 py-2">P/L</th>
                  <th className="text-right px-4 py-2">P/L %</th>
                  <th className="text-right px-4 py-2">Duration</th>
                  <th className="text-left px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: THEME.border }}>
                {pnlRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-6 text-center text-white/50"
                    >
                      No trades.
                    </td>
                  </tr>
                ) : (
                  pnlRows.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-white/[0.04] transition-colors"
                    >
                      <td className="px-4 py-2">{r.id}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{r.entryTime}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{r.exitTime}</td>
                      <td className="px-4 py-2 text-right">{r.entry}</td>
                      <td className="px-4 py-2 text-right">{r.exit}</td>
                      <td className="px-4 py-2 text-right">{r.target}</td>
                      <td
                        className={`px-4 py-2 text-right ${
                          r.green ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {r.plAbs}
                      </td>
                      <td
                        className={`px-4 py-2 text-right ${
                          r.green ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {r.plPct}
                      </td>
                      <td className="px-4 py-2 text-right">{r.mins} min</td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs ${
                            r.status.startsWith("Closed")
                              ? "bg-emerald-500/10 text-emerald-300"
                              : "bg-yellow-500/10 text-yellow-300"
                          }`}
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
        </div>
      </div>

      {/* spacing */}
      <div style={{ height: 40 }} />
    </div>
  );
}

/* ========================= PAGE (multi-asset) =========================
   Backtesting is not yet wired on the backend. Until the engine ships we
   render a "Coming soon" placeholder instead of the (currently broken)
   multi-asset chart view. The chart components above are kept intact so
   this can be restored by swapping the default export back. */
export default function BacktestMultiAssetPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
          <svg className="h-7 w-7 text-amber-300/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" d="M12 7v5l3 2" />
          </svg>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300/90">
          Soon
        </span>
        <h1 className="mt-4 text-xl font-semibold text-white">Backtesting is coming soon</h1>
        <p className="mt-2 text-sm text-white/40">
          We&apos;re building an engine to simulate your strategy against historical
          market data. It will land here shortly.
        </p>
        <a
          href="/bots"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
        >
          Back to your bots
        </a>
      </div>
    </div>
  );
}
