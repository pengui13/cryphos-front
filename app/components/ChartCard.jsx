// components/ChartCard.jsx
"use client";

import { useRef, useEffect, useMemo } from "react";
import * as LWC from "lightweight-charts";

const THEME = {
  bg: "#0B0B12",
  card: "rgba(16,18,28,0.75)",
  border: "rgba(255,255,255,0.08)",
  grid: "rgba(100,110,140,0.10)",
  gridSoft: "rgba(100,110,140,0.06)",
  cross: "#8B5CF6",
  text: "#E7EAF3",
  subtext: "rgba(231,234,243,0.65)",
  upBody: "rgba(34,197,94,0.85)",
  upWick: "rgba(44,210,110,0.95)",
  downBody: "rgba(239,68,68,0.85)",
  downWick: "rgba(249,112,112,0.95)",
  priceLine: "#8B5CF6",
  rsi: "#C084FC",
  rsiLevel: "rgba(200,210,230,0.45)",
  buy: "#22C55E",
  sell: "#EF4444",
};

function Pill({ children }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px]/none tracking-tight"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: `1px solid ${THEME.border}`,
        color: THEME.text,
      }}
    >
      {children}
    </span>
  );
}

/**
 * result: {
 *   asset: "BTC",
 *   rsi_config: { period, min, max },
 *   total_pnl,
 *   orders: [...],
 *   candles: [{ time, open_price, high_price, low_price, close_price, rsi?, order_open?, order_close? }, ...]
 * }
 */
export default function ChartCard({ result, height = 480, className = "" }) {
  const elRef = useRef(null);

  const symbol = String(result?.asset || "").toUpperCase();
  const rsiCfg = result?.rsi_config || {};
  const candlesRaw = result?.candles || [];

  // Normalize candles for lightweight-charts
  const ohlcCandles = useMemo(
    () =>
      candlesRaw.map((c) => ({
        time: Number(c.time),
        open: Number(c.open_price),
        high: Number(c.high_price),
        low: Number(c.low_price),
        close: Number(c.close_price),
      })),
    [candlesRaw]
  );

  const rsiSeriesData = useMemo(
    () =>
      candlesRaw
        .filter((c) => c.rsi != null)
        .map((c) => ({
          time: Number(c.time),
          value: Number(c.rsi),
        })),
    [candlesRaw]
  );

  const lastClose = useMemo(() => {
    const last = candlesRaw.at(-1);
    return last ? Number(last.close_price) : NaN;
  }, [candlesRaw]);

  const lastRsi = useMemo(() => {
    const last = candlesRaw
      .slice()
      .reverse()
      .find((c) => c.rsi != null);
    return last ? Number(last.rsi) : undefined;
  }, [candlesRaw]);

  useEffect(() => {
    const el = elRef.current;
    if (!el || !ohlcCandles.length) return;

    const last = ohlcCandles.at(-1);
    const decimals =
      last && last.close != null
        ? Math.min(
            8,
            Math.max(
              0,
              String(last.close).split(".")[1]?.length || 2
            )
          )
        : 2;

    const chart = LWC.createChart(el, {
      width: el.clientWidth || 900,
      height,
      layout: { background: { color: THEME.bg }, textColor: THEME.text },
      grid: {
        vertLines: { color: THEME.grid },
        horzLines: { color: THEME.gridSoft },
      },
      crosshair: {
        mode: 0,
        vertLine: {
          color: THEME.cross,
          width: 1,
          labelBackgroundColor: THEME.cross,
        },
        horzLine: {
          color: THEME.cross,
          width: 1,
          labelBackgroundColor: THEME.cross,
        },
      },
      rightPriceScale: { borderVisible: false },
      leftPriceScale: { borderVisible: false },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 6,
      },
      watermark: {
        visible: !!symbol,
        text: symbol,
        color: "rgba(139,92,246,0.08)",
        horzAlign: "left",
        vertAlign: "bottom",
        fontSize: 40,
      },
    });

    // price candles
    const candleSeries = chart.addCandlestickSeries({
      upColor: THEME.upBody,
      downColor: THEME.downBody,
      wickUpColor: THEME.upWick,
      wickDownColor: THEME.downWick,
      borderVisible: false,
      priceLineVisible: true,
      priceLineColor: THEME.priceLine,
      priceFormat: {
        type: "price",
        precision: decimals,
        minMove: Number((1 / 10 ** decimals).toFixed(decimals)),
      },
    });
    candleSeries.setData(ohlcCandles);

    // RSI
    if (rsiSeriesData.length) {
      const rsiSeries = chart.addLineSeries({
        priceScaleId: "left",
        color: THEME.rsi,
        lineWidth: 1.6,
        lastValueVisible: false,
        priceLineVisible: false,
      });
      rsiSeries.setData(rsiSeriesData);

      const rsiMin = Number(rsiCfg.min ?? 30);
      const rsiMax = Number(rsiCfg.max ?? 70);

      rsiSeries.createPriceLine({
        price: rsiMin,
        title: `RSI ${rsiMin}`,
        color: THEME.rsiLevel,
        lineStyle: 2,
        lineWidth: 1,
      });
      rsiSeries.createPriceLine({
        price: rsiMax,
        title: `RSI ${rsiMax}`,
        color: THEME.rsiLevel,
        lineStyle: 2,
        lineWidth: 1,
      });

      chart.priceScale("left").applyOptions({
        scaleMargins: { top: 0.75, bottom: 0.05 },
      });
      chart.priceScale("right").applyOptions({
        scaleMargins: { top: 0.05, bottom: 0.25 },
      });
    }

    // markers from candles (order_open / order_close)
    const markers = [];
    candlesRaw.forEach((c) => {
      if (c.order_open) {
        markers.push({
          time: Number(c.time),
          position: "belowBar",
          color: THEME.buy,
          shape: "arrowUp",
          text: `BUY ${Number(c.order_open.price).toFixed(2)}`,
        });
      }
      if (c.order_close) {
        markers.push({
          time: Number(c.time),
          position: "aboveBar",
          color: THEME.sell,
          shape: "arrowDown",
          text: `SELL ${Number(c.order_close.close_price).toFixed(2)}`,
        });
      }
    });

    if (markers.length) {
      candleSeries.setMarkers(markers);
    }

    // resize
    const onResize = () =>
      chart.applyOptions({ width: el.clientWidth || 900 });
    if (typeof window !== "undefined") {
      window.addEventListener("resize", onResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", onResize);
      }
      chart.remove();
    };
  }, [ohlcCandles, candlesRaw, height, symbol, rsiCfg.min, rsiCfg.max, rsiSeriesData]);

  const rsiLabel = `RSI ${rsiCfg?.period ?? 14}/${rsiCfg?.min ?? 30}–${
    rsiCfg?.max ?? 70
  }`;

  const footerRight = `${candlesRaw.length} candles`;

  return (
    <div
      className={`relative w-full rounded-3xl border backdrop-blur-md ${className}`}
      style={{
        background: THEME.card,
        borderColor: THEME.border,
        boxShadow:
          "0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div className="p-4 sm:p-5">
        {/* header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <div
              className="text-sm font-medium tracking-wide"
              style={{ color: THEME.subtext }}
            >
              {symbol || "—"}
            </div>
            <div
              className="text-xl sm:text-2xl font-semibold"
              style={{ color: THEME.text }}
            >
              {Number.isFinite(lastClose) ? lastClose : "—"}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Pill>{rsiLabel}</Pill>
            <Pill>{(result?.orders?.length || 0) + " trades"}</Pill>
          </div>
        </div>

        {/* chart */}
        <div className="relative">
          <div
            ref={elRef}
            className="w-full mt-3 rounded-2xl"
            style={{
              height,
              background: THEME.bg,
              border: `1px solid ${THEME.border}`,
            }}
          />
        </div>

        {/* footer */}
        <div className="mt-3 flex items-center justify-between text-[12px]">
          <div style={{ color: THEME.subtext }}>
            {typeof lastRsi === "number"
              ? `RSI now: ${lastRsi.toFixed(1)}`
              : "RSI: —"}
          </div>
          <div style={{ color: THEME.subtext }}>{footerRight}</div>
        </div>
      </div>
    </div>
  );
}
