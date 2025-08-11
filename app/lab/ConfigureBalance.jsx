import { useEffect, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function ConfigureBalance({
  balanceSettings,
  setBalanceSettings,
}) {
  const [available] = useState(500); // Demo balance of $500 USDT
  const [amount, setAmount] = useState(balanceSettings.amount || "");
  const [tpSlValues, setTpSlValues] = useState(
    balanceSettings.tpSlValues || [-50, 100]
  );

  // Update parent state when local state changes
  useEffect(() => {
    setBalanceSettings({
      amount,
      tpSlValues,
    });
  }, [amount, tpSlValues, setBalanceSettings]);

  const handleSliderChange = (values) => {
    let [sl, tp] = values;

    // Enforce constraints: SL must be negative, TP must be positive
    if (sl > -5) sl = -5;
    if (tp < 5) tp = 5;

    setTpSlValues([sl, tp]);
  };

  const handlePercentageClick = (percentage) => {
    const calculatedAmount = (available * percentage).toFixed(2);
    setAmount(calculatedAmount);
  };

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black text-white">
          Configure Trading Parameters
        </h2>
        <p className="text-white/70 text-lg">
          Set your demo balance allocation and risk management settings
        </p>
      </div>

      {/* Demo Balance Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
            <span className="text-orange-400 text-sm">💰</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Demo Balance Allocation
          </h3>
        </div>

        {/* Available Balance Display */}
        <div className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Available Demo Balance</p>
              <p className="text-2xl font-bold text-green-400">
                ${available} USDT
              </p>
            </div>
            <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center">
              <span className="text-green-400 text-2xl">💳</span>
            </div>
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-4">
          <label className="block text-white font-semibold">
            Portfolio Volume (USDT)
          </label>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-400/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to trade with"
              className="relative w-full px-6 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 text-lg font-medium focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm hover:border-white/30 hover:bg-white/8"
              max={available}
              min="0"
              step="0.01"
            />

            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 font-medium">
              USDT
            </div>
          </div>
        </div>

        {/* Percentage Buttons */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "25%", value: 0.25 },
            { label: "50%", value: 0.5 },
            { label: "75%", value: 0.75 },
            { label: "Max", value: 1 },
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={() => handlePercentageClick(btn.value)}
              className="px-4 py-3 border-2 border-orange-500/50 text-orange-400 font-semibold rounded-xl hover:border-orange-500 hover:bg-orange-500/10 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-500/20"
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Amount Summary */}
        {amount && (
          <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Trading with:</span>
              <span className="text-orange-400 font-bold">${amount} USDT</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-white/60">Remaining balance:</span>
              <span className="text-white font-medium">
                ${(available - parseFloat(amount || 0)).toFixed(2)} USDT
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Risk Management Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
            <span className="text-orange-400 text-sm">⚡</span>
          </div>
          <h3 className="text-xl font-bold text-white">Risk Management</h3>
        </div>

        <p className="text-white/60 pl-11">
          Set your stop loss and take profit levels to manage risk automatically
        </p>

        {/* Current Settings Display */}
        <div className="pl-11 space-y-4">
          <div className="flex justify-center gap-6 mb-8">
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-red-400 font-bold">Stop Loss</span>
              </div>
              <p className="text-white text-lg font-bold">{tpSlValues[0]}%</p>
              <p className="text-white/60 text-xs">Cut losses early</p>
            </div>

            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-green-400 font-bold">Take Profit</span>
              </div>
              <p className="text-white text-lg font-bold">+{tpSlValues[1]}%</p>
              <p className="text-white/60 text-xs">Secure gains</p>
            </div>
          </div>

          {/* Enhanced Slider */}
          <div className="relative p-6 bg-white/5 border border-white/10 rounded-2xl">
            <div className="mb-8">
              <Slider
                range
                min={-100}
                max={200}
                value={tpSlValues}
                onChange={handleSliderChange}
                allowCross={false}
                pushable={10}
                className="premium-tp-sl-slider"
                trackStyle={[
                  { backgroundColor: "#10b981", height: 8 },
                  { backgroundColor: "#ef4444", height: 8 },
                ]}
                railStyle={{ backgroundColor: "#374151", height: 8 }}
                handleStyle={[
                  {
                    backgroundColor: "#ef4444",
                    borderColor: "#ef4444",
                    height: 36,
                    width: 36,
                    marginTop: -14,
                    opacity: 1,
                    boxShadow:
                      "0 0 0 4px rgba(239, 68, 68, 0.2), 0 6px 16px rgba(0, 0, 0, 0.3)",
                    border: "4px solid white",
                  },
                  {
                    backgroundColor: "#10b981",
                    borderColor: "#10b981",
                    height: 36,
                    width: 36,
                    marginTop: -14,
                    opacity: 1,
                    boxShadow:
                      "0 0 0 4px rgba(16, 185, 129, 0.2), 0 6px 16px rgba(0, 0, 0, 0.3)",
                    border: "4px solid white",
                  },
                ]}
              />

              {/* Slider Labels */}
              <div className="flex justify-between mt-4 text-sm text-white/60">
                <span>-100% (Max Loss)</span>
                <span>0% (Break Even)</span>
                <span>+200% (Max Gain)</span>
              </div>
            </div>

            {/* Risk Explanation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                <h4 className="text-red-400 font-bold mb-2 flex items-center">
                  <span className="mr-2">🛡️</span>
                  Stop Loss Protection
                </h4>
                <p className="text-white/80 text-sm">
                  Automatically closes losing positions at {tpSlValues[0]}% to
                  limit your downside risk.
                </p>
              </div>

              <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                <h4 className="text-green-400 font-bold mb-2 flex items-center">
                  <span className="mr-2">🎯</span>
                  Take Profit Target
                </h4>
                <p className="text-white/80 text-sm">
                  Automatically closes winning positions at +{tpSlValues[1]}% to
                  secure your profits.
                </p>
              </div>
            </div>
          </div>

          {/* Risk Summary */}
          {amount && (
            <div className="mt-6 p-6 bg-gradient-to-br from-orange-500/10 to-yellow-400/10 border border-orange-500/20 rounded-2xl">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center mt-1">
                  <span className="text-orange-400">📊</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white mb-3">Risk Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-white/60">Trading Amount:</span>
                      <p className="text-white font-bold">${amount} USDT</p>
                    </div>
                    <div>
                      <span className="text-white/60">Max Loss:</span>
                      <p className="text-red-400 font-bold">
                        $
                        {(
                          (parseFloat(amount || 0) * Math.abs(tpSlValues[0])) /
                          100
                        ).toFixed(2)}{" "}
                        USDT
                      </p>
                    </div>
                    <div>
                      <span className="text-white/60">Max Gain:</span>
                      <p className="text-green-400 font-bold">
                        $
                        {(
                          (parseFloat(amount || 0) * tpSlValues[1]) /
                          100
                        ).toFixed(2)}{" "}
                        USDT
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .premium-tp-sl-slider .rc-slider-rail {
          background: #374151 !important;
          height: 8px !important;
          border-radius: 4px !important;
        }

        .premium-tp-sl-slider .rc-slider-track {
          height: 8px !important;
          border-radius: 4px !important;
        }

        .premium-tp-sl-slider .rc-slider-handle {
          border: 4px solid white !important;
          transition: all 0.3s ease !important;
        }

        .premium-tp-sl-slider .rc-slider-handle:hover,
        .premium-tp-sl-slider .rc-slider-handle:active,
        .premium-tp-sl-slider .rc-slider-handle:focus {
          transform: scale(1.1) !important;
        }
      `}</style>
    </div>
  );
}
