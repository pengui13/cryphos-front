"use client";

import {
  Chart,
  CandlestickSeries,
  LineSeries,
} from "lightweight-charts-react-wrapper";

/**
 * candles: backend candles [{ time, open_price, high_price, low_price, close_price, rsi }]
 */
export default function CandleWithRsiClient({ candles = [] }) {
  const ohlc = candles.map((c) => ({
    time: c.time,
    open: Number(c.open_price),
    high: Number(c.high_price),
    low: Number(c.low_price),
    close: Number(c.close_price),
  }));

  const rsi = candles
    .filter((c) => c.rsi != null)
    .map((c) => ({ time: c.time, value: Number(c.rsi) }));

  return (
    <Chart autoWidth height={500}>
      <CandlestickSeries data={ohlc} />
      <LineSeries data={rsi} priceScaleId="rsi" />
      {/* RSI bands */}
      <LineSeries
        data={rsi.map((p) => ({ time: p.time, value: 30 }))}
        priceScaleId="rsi"
      />
      <LineSeries
        data={rsi.map((p) => ({ time: p.time, value: 70 }))}
        priceScaleId="rsi"
      />
    </Chart>
  );
}
