// Shared number formatting for the backtest views.

// Enough decimals to show a price's movement whatever its magnitude:
// 2 for BTC, 4 for a $1 coin, up to 8 for sub-cent tokens.
export function priceDecimals(value) {
  const abs = Math.abs(Number(value));
  if (!Number.isFinite(abs) || abs === 0) return 2;
  if (abs >= 100) return 2;
  if (abs >= 1) return 4;
  return Math.min(8, Math.ceil(-Math.log10(abs)) + 3);
}

export function formatPrice(value) {
  const n = Number(value);
  if (value == null || !Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: priceDecimals(n),
  }).format(n);
}

export function formatNumber(value, decimals = 2) {
  const n = Number(value);
  if (value == null || !Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: decimals,
  }).format(n);
}

export function signed(value, decimals = 2) {
  const n = Number(value);
  if (value == null || !Number.isFinite(n)) return "—";
  return `${n > 0 ? "+" : ""}${formatNumber(n, decimals)}`;
}

export const TIMEFRAME_LABELS = {
  "1MIN": "1m",
  "5MIN": "5m",
  "15MIN": "15m",
  "30MIN": "30m",
  "1HRS": "1h",
  "1DAY": "1d",
};

export const timeframeLabel = (tf) => TIMEFRAME_LABELS[tf] || tf;

// Turns a failed apiRequest ({status, data} or an Error) into one sentence.
export function backtestErrorMessage(err) {
  const data = err?.data;
  if (data?.error) return data.error;
  if (data?.detail) return data.detail;
  if (data && typeof data === "object") {
    const [field, messages] = Object.entries(data)[0] || [];
    if (field) {
      const text = Array.isArray(messages) ? messages[0] : messages;
      return `${field}: ${text}`;
    }
  }
  if (err?.status === 404) return "Bot not found.";
  return "The backtest could not be run. Please try again.";
}
