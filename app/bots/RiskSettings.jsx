"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, TrendingUp, TrendingDown, Save, RotateCcw, AlertCircle } from "lucide-react";

// API functions - add these to your ApiWrapper.js
// export function GetRiskSettings(onSuccess, onError) {
//   return apiRequest({
//     method: "GET",
//     endpoint: `${BASE_URL}risk-settings/`,
//     onSuccess: (json) => onSuccess?.(json),
//     onError: (err) => onError?.(err),
//   });
// }
//
// export function UpdateRiskSettings(data, onSuccess, onError) {
//   return apiRequest({
//     method: "PATCH",
//     endpoint: `${BASE_URL}risk-settings/`,
//     body: data,
//     onSuccess: (json) => onSuccess?.(json),
//     onError: (err) => onError?.(err),
//   });
// }

export default function RiskSettings({ onSettingsChange }) {
  const [settings, setSettings] = useState({
    take_profit: "",
    stop_loss: "",
  });
  const [originalSettings, setOriginalSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = () => {
    setLoading(true);
    // Replace with your actual API call
    // GetRiskSettings(
    //   (data) => {
    //     const loaded = {
    //       take_profit: data.take_profit || "",
    //       stop_loss: data.stop_loss || "",
    //     };
    //     setSettings(loaded);
    //     setOriginalSettings(loaded);
    //     setLoading(false);
    //   },
    //   (err) => {
    //     setError("Failed to load settings");
    //     setLoading(false);
    //   }
    // );

    // Mock for demo
    setTimeout(() => {
      const loaded = { take_profit: "5.00", stop_loss: "3.00" };
      setSettings(loaded);
      setOriginalSettings(loaded);
      setLoading(false);
    }, 500);
  };

  const handleChange = (field, value) => {
    // Allow empty, or valid decimal numbers
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      const numValue = parseFloat(value);
      if (value === "" || (numValue >= 0 && numValue <= 100)) {
        setSettings((prev) => ({ ...prev, [field]: value }));
        setError(null);
        setSuccess(false);
      }
    }
  };

  const handleSave = async () => {
    // Validation
    const tp = parseFloat(settings.take_profit);
    const sl = parseFloat(settings.stop_loss);

    if (settings.take_profit && (isNaN(tp) || tp <= 0 || tp > 100)) {
      setError("Take profit must be between 0.01% and 100%");
      return;
    }
    if (settings.stop_loss && (isNaN(sl) || sl <= 0 || sl > 100)) {
      setError("Stop loss must be between 0.01% and 100%");
      return;
    }

    setSaving(true);
    setError(null);

    // Replace with your actual API call
    // UpdateRiskSettings(
    //   {
    //     take_profit: settings.take_profit || null,
    //     stop_loss: settings.stop_loss || null,
    //   },
    //   (data) => {
    //     setOriginalSettings(settings);
    //     setSuccess(true);
    //     setSaving(false);
    //     onSettingsChange?.(data);
    //     setTimeout(() => setSuccess(false), 3000);
    //   },
    //   (err) => {
    //     setError("Failed to save settings");
    //     setSaving(false);
    //   }
    // );

    // Mock for demo
    setTimeout(() => {
      setOriginalSettings(settings);
      setSuccess(true);
      setSaving(false);
      onSettingsChange?.(settings);
      setTimeout(() => setSuccess(false), 3000);
    }, 500);
  };

  const handleReset = () => {
    if (originalSettings) {
      setSettings(originalSettings);
      setError(null);
      setSuccess(false);
    }
  };

  const hasChanges =
    originalSettings &&
    (settings.take_profit !== originalSettings.take_profit ||
      settings.stop_loss !== originalSettings.stop_loss);

  if (loading) {
    return (
      <div className="rounded-[32px] border border-white/10 bg-white/[0.02] p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-white/10" />
          <div className="h-6 w-32 animate-pulse rounded-lg bg-white/10" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="h-20 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-20 animate-pulse rounded-2xl bg-white/5" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[32px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
            <Shield className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold">Risk Management</h3>
            <p className="text-sm text-white/50">Set your trading limits</p>
          </div>
        </div>

        {hasChanges && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </motion.button>
        )}
      </div>

      {/* Input Fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Take Profit */}
        <div className="group rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition focus-within:border-green-500/30 focus-within:bg-green-500/[0.02]">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <label className="text-sm font-medium text-white/80">Take Profit</label>
          </div>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={settings.take_profit}
              onChange={(e) => handleChange("take_profit", e.target.value)}
              placeholder="5.00"
              className="w-full bg-transparent text-2xl font-semibold text-white outline-none placeholder:text-white/20"
            />
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-lg text-white/40">%</span>
          </div>
          <p className="mt-2 text-xs text-white/40">
            Close position when profit reaches this %
          </p>
        </div>

        {/* Stop Loss */}
        <div className="group rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition focus-within:border-red-500/30 focus-within:bg-red-500/[0.02]">
          <div className="mb-3 flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-400" />
            <label className="text-sm font-medium text-white/80">Stop Loss</label>
          </div>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={settings.stop_loss}
              onChange={(e) => handleChange("stop_loss", e.target.value)}
              placeholder="3.00"
              className="w-full bg-transparent text-2xl font-semibold text-white outline-none placeholder:text-white/20"
            />
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-lg text-white/40">%</span>
          </div>
          <p className="mt-2 text-xs text-white/40">
            Close position when loss reaches this %
          </p>
        </div>
      </div>

      {/* Preview */}
      {(settings.take_profit || settings.stop_loss) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 rounded-xl bg-white/5 p-4"
        >
          <div className="text-xs font-medium text-white/60 mb-2">Preview for $1,000 position</div>
          <div className="flex gap-6 text-sm">
            {settings.take_profit && (
              <div>
                <span className="text-white/50">TP at: </span>
                <span className="text-green-400 font-medium">
                  +${(10 * parseFloat(settings.take_profit || 0)).toFixed(2)}
                </span>
              </div>
            )}
            {settings.stop_loss && (
              <div>
                <span className="text-white/50">SL at: </span>
                <span className="text-red-400 font-medium">
                  -${(10 * parseFloat(settings.stop_loss || 0)).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 flex items-center gap-2 rounded-xl bg-red-500/10 p-3 text-sm text-red-400"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 flex items-center gap-2 rounded-xl bg-green-500/10 p-3 text-sm text-green-400"
          >
            <Shield className="h-4 w-4 flex-shrink-0" />
            Settings saved successfully
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        disabled={saving || !hasChanges}
        className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 font-medium transition ${
          hasChanges
            ? "bg-white text-black hover:bg-white/90"
            : "cursor-not-allowed bg-white/10 text-white/40"
        }`}
      >
        {saving ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            <span>{hasChanges ? "Save Changes" : "No Changes"}</span>
          </>
        )}
      </motion.button>
    </motion.div>
  );
}