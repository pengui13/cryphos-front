"use client";

import Cookies from "universal-cookie";
import platform from "platform";
const IntervalsMapping = {
  "1m": "1MIN",
  "5m": "5MIN",
  "15m": "15MIN",
  "30m": "30MIN",
  "1h": "1HRS",
  "1d": "1DAY",
};
const cookies = new Cookies();

export const BASE_URL = "https://cryphos.com/api/";
export const MEDIA_URL = "https://cryphos.com/";
export const WEBSOCKET_URL = "https://cryphos.com/ws/";
export const BASE_FRONT = "https://cryphos.com/";


function getCookieValue(name) {
  return cookies.get(name);
}

function setCookieValue(name, value) {
  cookies.set(name, value, { path: "/", sameSite: "lax" });
}

async function refreshToken() {
  const refresh = getCookieValue("refresh");
  if (!refresh) return null;

  try {
    const res = await fetch(`${BASE_URL}auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) throw new Error("Refresh failed");
    const { access, refresh: newRefresh } = await res.json();
    setCookieValue("access", access);
    setCookieValue("refresh", newRefresh);
    return access;
  } catch {
    return null;
  }
}

async function apiRequest({
  endpoint,
  method = "GET",
  headers = {},
  body = null,
  onSuccess = () => {},
  onError = (e) => console.error(e),
  skipAuth = false,
}) {
  try {
    const defaultHeaders = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    if (!skipAuth) {
      const token = getCookieValue("access");
      if (token) defaultHeaders.Authorization = `Bearer ${token}`;
    }
    const merged = { ...defaultHeaders, ...headers };

    // if FormData, drop content-type
    if (body instanceof FormData) delete merged["Content-Type"];

    let res = await fetch(endpoint, {
      method,
      headers: merged,
      body:
        body instanceof FormData ? body : body ? JSON.stringify(body) : null,
    });

    // try refresh + retry on 401
    if (res.status === 401 && !skipAuth) {
      const newToken = await refreshToken();
      if (newToken) {
        merged.Authorization = `Bearer ${newToken}`;
        res = await fetch(endpoint, {
          method,
          headers: merged,
          body:
            body instanceof FormData
              ? body
              : body
              ? JSON.stringify(body)
              : null,
        });
      }
    }

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    if (!res.ok) {
      onError({ status: res.status, data });
      return;
    }
    onSuccess(data);
  } catch (err) {
    onError(err);
  }
}

// --- Auth functions ---

/**
 * Register a new user.
 * @param {{ username, email, password, password2 }} creds
 * @returns Promise resolving to DRF response or rejecting with error object
 */
export function signUp(creds) {
  return new Promise((resolve, reject) => {
    apiRequest({
      endpoint: `${BASE_URL}auth/register/`,
      method: "POST",
      skipAuth: true,
      body: creds,
      onSuccess: (data) => resolve(data),
      onError: (err) => reject(err),
    });
  });
}

/**
 * Log in existing user.
 * Stores access & refresh tokens in cookies.
 * @param {{ username, password }} creds
 */
export function signIn(creds) {
  const platformInfo = {
    device: platform.name || "Browser",
    os: platform.os?.family || "Unknown",
  };

  return new Promise((resolve, reject) => {
    apiRequest({
      endpoint: `${BASE_URL}auth/login/`,
      method: "POST",
      skipAuth: true,
      headers: { "HTTP-USER-DATA": JSON.stringify(platformInfo) },
      body: creds,
      onSuccess: ({ access, refresh }) => {
        setCookieValue("access", access);
        setCookieValue("refresh", refresh);
        resolve({ access, refresh });
      },
      onError: (err) => reject(err),
    });
  });
}
export async function GetAllSymbolsNonStable(setSymbols) {
  apiRequest({
    endpoint: `${BASE_URL}assets/assets/`,
    skipAuth: true,
    onSuccess: (jsonData) => setSymbols(jsonData.assets),
    onError: (error) => console.error("Fetching user profile failed", error),
  });
}
export async function CreateBot(data, setSuccess, setError) {
  // Create a deep copy of the data to avoid mutating the original
  const formattedData = JSON.parse(JSON.stringify(data));

  // Convert top-level interval if it exists
  if (formattedData.interval && IntervalsMapping[formattedData.interval]) {
    formattedData.interval = IntervalsMapping[formattedData.interval];
  }

  // Process intervals inside indicators
const indicators = [
    "rsi",
    "macd",
    "ma",
    "bb",
    "bollinger",
    "bollinger_bands",
    "obv",
    "atr",
    "sr",  
];

  indicators.forEach((indicator) => {
    if (
      formattedData[indicator] &&
      typeof formattedData[indicator] === "object"
    ) {
      // If the indicator has an intervals array, convert each interval
      if (Array.isArray(formattedData[indicator].intervals)) {
        formattedData[indicator].intervals = formattedData[
          indicator
        ].intervals.map((interval) => IntervalsMapping[interval] || interval);
      }
    }
  });

  apiRequest({
    method: "POST",
    endpoint: `${BASE_URL}bots/create_bot/`,
    body: formattedData,
    onSuccess: (jsonData) => setSuccess(true),
    onError: (error) => setError(error.data.error),
  });
}
export async function GetMyBots(setMyBots) {
  apiRequest({
    endpoint: `${BASE_URL}bots/get_bots/`,
    onSuccess: (jsonData) => setMyBots(jsonData),
    onError: (error) => console.error("Fetching user profile failed", error),
  });
}
export async function GetPing(setPing) {
  apiRequest({
    endpoint: `${BASE_URL}bots/ping/`,
    onSuccess: (jsonData) => setPing(jsonData.ping),
    onError: (error) => setPing(false),
  });
}
export async function GetAllBots(setMyBots) {
  apiRequest({
    endpoint: `${BASE_URL}bots/get_all_bots/`,
    onSuccess: (jsonData) => setMyBots(jsonData),
    onError: (error) => console.error("Fetching user profile failed", error),
  });
}
export async function GetBotInfo(id, setInfo) {
  apiRequest({
    endpoint: `${BASE_URL}bots/get_info/${id}/`,
    onSuccess: (jsonData) => setInfo(jsonData),
    onError: (error) => console.error("Fetching user profile failed", error),
  });
}
export async function GetBotSubscribers(id, setInfo) {
  apiRequest({
    endpoint: `${BASE_URL}bots/get_bot_subscribers/${id}/`,
    onSuccess: (jsonData) => setInfo(jsonData),
    onError: (error) => console.error("Fetching user profile failed", error),
  });
}
export async function TransferInOutBot(
  id,
  transferIn,
  amount,
  setInfo,
  open,
  setError
) {
  apiRequest({
    method: "POST",
    endpoint: `${BASE_URL}bots/transfer_in_out/`,
    body: {
      amount: amount,
      id: id,
      transfer_in: transferIn,
    },
    onSuccess: (jsonData) => {
      GetBotInfo(id, setInfo);
      open(false);
    },
    onError: (error) => setError(error.data.error),
  });
}
export async function GetRoiPnlBot(id, setRoiPnl) {
  apiRequest({
    endpoint: `${BASE_URL}bots/bots_roi_pnl/${id}/`,
    onSuccess: (jsonData) => {
      setRoiPnl(jsonData);
    },
    onError: (error) => console.error("Fetching user profile failed", error),
  });
}
export async function GetAvailableBal(setAvailable) {
  apiRequest({
    endpoint: `${BASE_URL}bots/available_amount/`,
    onSuccess: (jsonData) => setAvailable(jsonData.quantity),
    onError: (error) => console.error("Fetching user profile failed", error),
  });
}
export function signOut() {
  cookies.remove("access", { path: "/" });
  cookies.remove("refresh", { path: "/" });
}

export async function RequestBotVerification(botId) {
  return new Promise((resolve, reject) => {
    apiRequest({
      endpoint: `${BASE_URL}bots/toggle_verification/${botId}/`,
      method: "POST",
      onSuccess: (data) => resolve(data),
      onError: (err) => reject(err),
    });
  });
}
export async function AddTelegram(nickname) {
  return new Promise((resolve, reject) => {
    apiRequest({
      endpoint: `${BASE_URL}bots/add_telegram/`,
      method: "POST",
      body: { nickname },
      onSuccess: (data) => resolve(data),
      onError: (err) => reject(err),
    });
  });
}
export async function GetTelegramInfo() {
  return new Promise((resolve, reject) => {
    apiRequest({
      endpoint: `${BASE_URL}auth/get_user_tg/`,
      method: "GET",
      onSuccess: (data) => resolve(data),
      onError: (err) => reject(err),
    });
  });
}

export async function TogglePublishing(botId, setInfo) {
  apiRequest({
    endpoint: `${BASE_URL}bots/toggle_publishing/${botId}/`,
    method: "POST",
    onSuccess: (jsonData) => setInfo(jsonData),
    onError: (error) => console.error("Toggle publishing failed", error),
  });
}

export function GetRiskSettings(onSuccess, onError) {
  return apiRequest({
    method: "GET",
    endpoint: `${BASE_URL}bots/risk-settings/`,
    onSuccess: (json) => onSuccess?.(json),
    onError: (err) => onError?.(err),
  });
}

export function UpdateRiskSettings(data, onSuccess, onError) {
  return apiRequest({
    method: "PATCH",
    endpoint: `${BASE_URL}bots/risk-settings/`,
    body: data,
    onSuccess: (json) => onSuccess?.(json),
    onError: (err) => onError?.(err),
  });
}

export function GetBacktestData(botId, params, onSuccess) {
  return apiRequest({
    method: "POST",
    endpoint: `${BASE_URL}bots/backtest/${botId}/`,
    body: {
      usdt_value: params.usdt_value,
      take_profit: params.take_profit,
      stop_loss: params.stop_loss,
    },
    onSuccess: (json) => onSuccess?.(json),
    onError: (err) => {
      console.error("GetBacktestData failed:", err);
      onSuccess?.(null);
    },
  });
}

export function GetBillingStatus(onSuccess, onError) {
  return apiRequest({
    endpoint: `${BASE_URL}auth/billing/me/`,
    method: "GET",
    onSuccess: (json) => {
      if (onSuccess) onSuccess(json);
    },
    onError: (err) => {
      console.error("GetBillingStatus failed:", err);
      if (onError) onError(err);
    },
  });
}

export function CreateStripeCheckoutSession(onSuccess, onError) {
  return apiRequest({
    endpoint: `${BASE_URL}auth/billing/create-checkout-session/`,
    method: "POST",
    onSuccess: (json) => {
      if (onSuccess) onSuccess(json); // json.url from backend
    },
    onError: (err) => {
      console.error("CreateStripeCheckoutSession failed:", err);
      if (onError) onError(err);
    },
  });
}



export async function GetBots(setBots) {
  apiRequest({
    endpoint: `${BASE_URL}bots/bots_list/`,
    onSuccess: (jsonData) => setBots(jsonData),
    onError: (error) => console.error("Fetching user profile failed", error),
  });
}

export async function DeleteBots(id) {
  return apiRequest({
    endpoint: `${BASE_URL}bots/delete_bot/${id}/`,
    method: "DELETE",
    onSuccess: (jsonData) => console.log("Bot deleted", jsonData),
    onError: (error) => {
      console.error("Delete bot failed", error);
      throw error; 
    },
  });
}

export async function GetSignals(botId, onSuccess, onError) {
  return apiRequest({
    endpoint: `${BASE_URL}bots/get_signals/${botId}/`,
    method: "GET",
    onSuccess: (json) => {
      if (onSuccess) onSuccess(json);
    },
    onError: (err) => {
      console.error("GetSignals failed:", err);
      if (onError) onError(err);
    },
  });
}