"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Snackbar from "../components/Snackbar";
import { usePing } from "../providers";
import {
  GetTelegramInfo,
  AddTelegram,
  GetProfile,
  UpdateUsername,
  UpdateWallet,
  ChangePassword,
  UpdateAvatar,
} from "../api/ApiWrapper";
import AuthScreen from "../components/AuthScreen.jsx";
import { DONATION_WALLET, DONATION_NETWORK } from "../constants";

// ============ ICONS ============
function TelegramIcon({ className }) {
  return (
    <svg className={className || "h-5 w-5"} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.98 1.26-5.6 3.7-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.75 3.99-1.74 6.65-2.89 7.98-3.45 3.8-1.59 4.59-1.87 5.1-1.87.11 0 .36.03.52.16.14.11.17.26.19.37.01.08.03.29.01.45z"/>
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg className={className || "h-4 w-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CopyIcon({ className }) {
  return (
    <svg className={className || "h-4 w-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function ExternalLinkIcon({ className }) {
  return (
    <svg className={className || "h-4 w-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function UserIcon({ className }) {
  return (
    <svg className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

// ============ COPY BUTTON ============
function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs font-medium text-white/60 transition hover:bg-white/10 hover:text-white/80"
    >
      {copied ? (
        <>
          <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <CopyIcon className="h-3.5 w-3.5" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

// ============ ACCOUNT CARD ============
function AccountCard({ setSnack }) {
  const fileRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarSaving, setAvatarSaving] = useState(false);

  const [usernameInput, setUsernameInput] = useState("");
  const [usernameSaving, setUsernameSaving] = useState(false);

  const [walletInput, setWalletInput] = useState("");
  const [walletSaving, setWalletSaving] = useState(false);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    GetProfile()
      .then((data) => {
        setProfile(data);
        setUsernameInput(data?.username || "");
        setWalletInput(data?.usdt_trc20_wallet || "");
      })
      .catch((err) => console.error("Failed to load profile:", err));
  }, []);

  const usernameChanged =
    usernameInput.trim() && usernameInput.trim() !== profile?.username;

  const walletTrimmed = walletInput.trim();
  const walletChanged = walletTrimmed !== (profile?.usdt_trc20_wallet || "");
  // Light client-side shape check; backend does full base58 + checksum.
  const walletLooksValid =
    walletTrimmed === "" || /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(walletTrimmed);

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setSnack({ visible: true, status: false, type: "prime", info: "Use a JPEG, PNG or WEBP image" });
      return;
    }
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarSaving(true);
    try {
      const data = await UpdateAvatar(file);
      setProfile(data);
      setSnack({ visible: true, status: true, type: "prime", info: "Profile photo updated" });
    } catch (err) {
      setAvatarPreview(null);
      setSnack({ visible: true, status: false, type: "prime", info: err?.data?.detail || "Failed to upload photo" });
    } finally {
      setAvatarSaving(false);
    }
  }

  async function handleSaveUsername() {
    setUsernameSaving(true);
    try {
      const data = await UpdateUsername(usernameInput.trim());
      setProfile(data);
      setUsernameInput(data.username);
      setSnack({ visible: true, status: true, type: "prime", info: "Username updated" });
    } catch (err) {
      setSnack({ visible: true, status: false, type: "prime", info: err?.data?.detail || "Failed to update username" });
    } finally {
      setUsernameSaving(false);
    }
  }

  async function handleSaveWallet() {
    if (!walletLooksValid) {
      setSnack({ visible: true, status: false, type: "prime", info: "That doesn't look like a TRC20 wallet address" });
      return;
    }
    setWalletSaving(true);
    try {
      const data = await UpdateWallet(walletTrimmed);
      setProfile(data);
      setWalletInput(data.usdt_trc20_wallet || "");
      setSnack({ visible: true, status: true, type: "prime", info: walletTrimmed ? "Wallet saved" : "Wallet removed" });
    } catch (err) {
      setSnack({ visible: true, status: false, type: "prime", info: err?.data?.detail || "Failed to save wallet" });
    } finally {
      setWalletSaving(false);
    }
  }

  async function handleChangePassword() {
    if (newPw !== newPw2) {
      setSnack({ visible: true, status: false, type: "prime", info: "New passwords do not match" });
      return;
    }
    setPwSaving(true);
    try {
      await ChangePassword(currentPw, newPw, newPw2);
      setCurrentPw("");
      setNewPw("");
      setNewPw2("");
      setSnack({ visible: true, status: true, type: "prime", info: "Password updated" });
    } catch (err) {
      setSnack({ visible: true, status: false, type: "prime", info: err?.data?.detail || "Failed to update password" });
    } finally {
      setPwSaving(false);
    }
  }

  const avatarSrc = avatarPreview || profile?.avatar || null;
  const initial = (profile?.username || "?").charAt(0).toUpperCase();
  const canChangePw = currentPw && newPw && newPw2;

  return (
    <div className="rounded-xl sm:rounded-2xl border border-white/5 bg-white/[0.02] p-4 sm:p-6">
      {/* Card Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
          <UserIcon className="h-5 w-5 text-white/60" />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-medium text-white">Account</h2>
          <p className="text-xs text-white/40">Manage your profile and password</p>
        </div>
      </div>

      {/* Avatar + username summary */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => fileRef.current?.click()}
          className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5"
          title="Change photo"
        >
          {avatarSrc ? (
            <img src={avatarSrc} alt="avatar" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xl font-semibold text-white/70">
              {initial}
            </span>
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-[10px] font-medium text-white opacity-0 transition group-hover:opacity-100">
            {avatarSaving ? "..." : "Change"}
          </span>
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{profile?.username || "—"}</p>
          <p className="truncate text-xs text-white/40">{profile?.email || ""}</p>
          <button
            onClick={() => fileRef.current?.click()}
            className="mt-1 text-xs text-white/50 transition hover:text-white/80"
          >
            Upload new photo
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>

      {/* Username */}
      <div className="mb-6">
        <label className="mb-2 block text-xs sm:text-sm text-white/60">Username</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="username"
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-white/20"
          />
          <button
            onClick={handleSaveUsername}
            disabled={usernameSaving || !usernameChanged}
            className="rounded-xl bg-white px-4 sm:px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {usernameSaving ? "..." : "Save"}
          </button>
        </div>
      </div>

      {/* TRC20 USDT wallet */}
      <div className="mb-6">
        <label className="mb-2 block text-xs sm:text-sm text-white/60">
          USDT wallet <span className="text-white/30">(TRC20)</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={walletInput}
            onChange={(e) => setWalletInput(e.target.value)}
            placeholder="T..."
            spellCheck={false}
            autoComplete="off"
            className={`w-full rounded-xl border bg-white/5 py-2.5 px-3 font-mono text-sm text-white placeholder-white/20 outline-none transition focus:border-white/20 ${
              walletLooksValid ? "border-white/10" : "border-red-500/40"
            }`}
          />
          <button
            onClick={handleSaveWallet}
            disabled={walletSaving || !walletChanged || !walletLooksValid}
            className="rounded-xl bg-white px-4 sm:px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {walletSaving ? "..." : "Save"}
          </button>
        </div>
        <p className="mt-1.5 text-[11px] text-white/30">
          {walletLooksValid
            ? "Used for crypto payments to access your account (coming soon)."
            : "TRC20 addresses start with “T” and are 34 characters long."}
        </p>
      </div>

      {/* Password */}
      <div>
        <label className="mb-2 block text-xs sm:text-sm text-white/60">Change password</label>
        <div className="space-y-2">
          <input
            type="password"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            placeholder="Current password"
            autoComplete="current-password"
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-white/20"
          />
          <input
            type="password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            placeholder="New password"
            autoComplete="new-password"
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-white/20"
          />
          <input
            type="password"
            value={newPw2}
            onChange={(e) => setNewPw2(e.target.value)}
            placeholder="Confirm new password"
            autoComplete="new-password"
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-white/20"
          />
          <button
            onClick={handleChangePassword}
            disabled={pwSaving || !canChangePw}
            className="w-full rounded-xl bg-white/10 py-2.5 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pwSaving ? "Updating..." : "Update password"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ ACCESS / PAYMENT NOTICE ============
function AccessNoticeCard() {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-amber-400/15 bg-amber-400/[0.04] p-4 sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10">
          <svg className="h-5 w-5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <rect x="4" y="10" width="16" height="10" rx="2" />
            <path strokeLinecap="round" d="M8 10V7a4 4 0 118 0v3" />
          </svg>
        </div>
        <div>
          <h2 className="flex items-center gap-2 text-sm sm:text-base font-medium text-white">
            Access
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
              Free now
            </span>
          </h2>
          <p className="text-xs text-white/40">How paid access will work</p>
        </div>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-white/60">
        Cryphos is completely free to use right now. A little later, continued
        access will require a payment in USDT — you&apos;ll send it to the wallet
        below. We&apos;ll let you know before anything changes.
      </p>

      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        {DONATION_NETWORK}
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2.5">
        <code className="min-w-0 break-all font-mono text-xs text-white/70 sm:text-sm">
          {DONATION_WALLET}
        </code>
        <CopyButton value={DONATION_WALLET} />
      </div>

      <p className="mt-2 text-[11px] text-white/30">
        Only send USDT on the TRC20 (Tron) network to this address.
      </p>
    </div>
  );
}

// ============ MAIN COMPONENT ============
export default function SettingsPage() {
  const ping = usePing();

  const [snackData, setSnackData] = useState({
    visible: false,
    status: false,
    type: "prime",
    info: "",
  });

  const [tgNickname, setTgNickname] = useState("");
  const [tgInput, setTgInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!ping) return;

    const loadTgInfo = async () => {
      try {
        const data = await GetTelegramInfo();
        const nickname = data?.tg_nickname || "";
        setTgNickname(nickname);
        setTgInput(nickname);
      } catch (err) {
        console.error("Failed to load TG info:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTgInfo();
  }, [ping]);

  const isConnected = Boolean(tgNickname);
  const nicknameChanged = tgInput.trim().replace(/^@/, "") !== tgNickname;

  const handleSaveNickname = async () => {
    const nickname = tgInput.trim().replace(/^@/, "");
    if (!nickname) {
      setSnackData({
        visible: true,
        status: false,
        type: "prime",
        info: "Please enter your Telegram username",
      });
      return;
    }

    setSaving(true);
    try {
      await AddTelegram(nickname);
      setTgNickname(nickname);
      setTgInput(nickname);
      setSnackData({
        visible: true,
        status: true,
        type: "prime",
        info: "Telegram nickname saved!",
      });
    } catch (err) {
      setSnackData({
        visible: true,
        status: false,
        type: "prime",
        info: err?.data?.error || "Failed to save nickname",
      });
    } finally {
      setSaving(false);
    }
  };

  // Auth check
  if (!ping) {
    return <AuthScreen />;
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 py-4 sm:p-6">
      <Snackbar data={snackData} />
      
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-white">Settings</h1>
          <p className="text-xs sm:text-sm text-white/40">Manage your account and integrations</p>
        </header>

        <div className="space-y-4">
          {/* Telegram Integration Card */}
          <div className="rounded-xl sm:rounded-2xl border border-white/5 bg-white/[0.02] p-4 sm:p-6">
            {/* Card Header */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                  <TelegramIcon className="h-5 w-5 text-white/60" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-medium text-white">Telegram</h2>
                  <p className="text-xs text-white/40">Receive trading signals</p>
                </div>
              </div>

              {/* Status */}
              <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                isConnected 
                  ? "bg-emerald-500/10 text-emerald-400" 
                  : "bg-white/5 text-white/40"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-emerald-400" : "bg-white/30"}`} />
                {isConnected ? "Connected" : "Not connected"}
              </div>
            </div>

            {/* Connected Banner */}
            {isConnected && (
              <div className="mb-5 flex items-center gap-3 rounded-xl bg-emerald-500/10 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
                  <CheckIcon className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-400">Connected as @{tgNickname}</p>
                  <p className="text-xs text-white/50">You'll receive signals via Telegram</p>
                </div>
              </div>
            )}

            {/* Setup Steps */}
            <div className="space-y-4">
              {/* Step 1: Username */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white/60">1</span>
                  <span className="text-xs sm:text-sm text-white/60">Enter your Telegram username</span>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">@</span>
                    <input
                      type="text"
                      value={tgInput}
                      onChange={(e) => setTgInput(e.target.value.replace(/^@/, ""))}
                      placeholder="username"
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-7 pr-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-white/20"
                    />
                  </div>
                  <button
                    onClick={handleSaveNickname}
                    disabled={saving || !nicknameChanged}
                    className="rounded-xl bg-white px-4 sm:px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {saving ? "..." : "Save"}
                  </button>
                </div>
              </div>

              {/* Step 2: Bot Link */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white/60">2</span>
                  <span className="text-xs sm:text-sm text-white/60">Open our Telegram bot</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                  <code className="text-sm text-white/70">@cryphos_bot</code>
                  <CopyButton value="cryphos_bot" />
                </div>
              </div>

              {/* Step 3: Start */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white/60">3</span>
                  <span className="text-xs sm:text-sm text-white/60">
                    Send <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">/start</code> to connect
                  </span>
                </div>
              </div>

              {/* Open Bot Button */}
              <button
                onClick={() => window.open("https://t.me/cryphos_bot", "_blank")}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
              >
                Open Telegram Bot
                <ExternalLinkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Account Card */}
          <AccountCard setSnack={setSnackData} />

          {/* Access / payment notice */}
          <AccessNoticeCard />
        </div>
      </div>
    </div>
  );
}