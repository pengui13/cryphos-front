// /api/ApiWrapper.jsx
"use client";

import Cookies from "universal-cookie";
import platform from "platform";

const cookies = new Cookies();

export const BASE_URL = "http://127.0.0.1:8000/api/";
export const MEDIA_URL = "http://127.0.0.1:8000";
export const WEBSOCKET_URL = "ws://127.0.0.1:8000/ws/";
export const BASE_FRONT = "http://localhost:3000";

// Helpers
function getCookieValue(name) {
  return cookies.get(name);
}
function setCookieValue(name, value) {
  cookies.set(name, value, { path: "/", sameSite: "lax" });
}

// Try to refresh JWT
async function refreshToken() {
  const refresh = getCookieValue("refresh");
  if (!refresh) return null;

  try {
    const res = await fetch(`${BASE_URL}auth/token/refresh/`, {
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

/**
 * Log out: clear tokens.
 */
export function signOut() {
  cookies.remove("access", { path: "/" });
  cookies.remove("refresh", { path: "/" });
}

// Export the generic request for other endpoints
export { apiRequest };
