import { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const timeframes = ["1m", "5m", "15m", "30m", "1h", "1d"];

export default function RsiSettings({
  enabled,
  setEnabled,
  step,
  setStep,
  settings,
  setSettings,
}) {
  const [selectedTimeframes, setSelectedTimeframes] = useState(
    settings?.intervals || ["1m"]
  );
  const [rsiValues, setRsiValues] = useState([
    settings?.min || 30,
    settings?.max || 70,
  ]);
  const [period, setPeriod] = useState(settings?.period || 14);

  // Update parent state when local state changes
  useEffect(() => {
    setSettings({
      period: period,
      max: rsiValues[1],
      min: rsiValues[0],
      intervals: selectedTimeframes,
    });
  }, [period, rsiValues, selectedTimeframes, setSettings]);

  const toggleTimeframe = (timeframe) => {
    const newTimeframes = selectedTimeframes.includes(timeframe)
      ? selectedTimeframes.filter((t) => t !== timeframe)
      : [...selectedTimeframes, timeframe];

    if (newTimeframes.length > 0) {
      setSelectedTimeframes(newTimeframes);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Configure RSI</h2>
        <p className="text-white/60 text-sm">
          Set up your trading strategy parameters
        </p>
      </div>

      {/* Timeframes Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Timeframes</h3>
          <p className="text-white/60 text-sm mb-4">
            Select analysis intervals
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {timeframes.map((timeframe) => {
            const isSelected = selectedTimeframes.includes(timeframe);
            return (
              <button
                key={timeframe}
                onClick={() => toggleTimeframe(timeframe)}
                className={`
                  py-2 px-4 rounded-lg text-sm font-medium transition-colors
                  ${
                    isSelected
                      ? "bg-[#e3b8ff]/20 border border-[#e3b8ff]/40 text-[#e3b8ff]"
                      : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
                  }
                `}
              >
                {timeframe}
              </button>
            );
          })}
        </div>
      </div>

      {/* RSI Levels Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Trading Levels
          </h3>
          <p className="text-white/60 text-sm mb-4">
            Set buy/sell signal thresholds
          </p>
        </div>

        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="mb-8">
            <Slider
              range
              min={0}
              max={100}
              value={rsiValues}
              onChange={setRsiValues}
              allowCross={false}
              pushable={5}
              trackStyle={[
                {
                  backgroundColor: "#e3b8ff",
                  height: 6,
                  borderRadius: 3,
                },
              ]}
              railStyle={{
                backgroundColor: "#374151",
                height: 6,
                borderRadius: 3,
              }}
              handleStyle={[
                {
                  backgroundColor: "#10b981",
                  borderColor: "#10b981",
                  height: 20,
                  width: 20,
                  marginTop: -7,
                  opacity: 1,
                  border: "2px solid white",
                  borderRadius: "50%",
                },
                {
                  backgroundColor: "#ef4444",
                  borderColor: "#ef4444",
                  height: 20,
                  width: 20,
                  marginTop: -7,
                  opacity: 1,
                  border: "2px solid white",
                  borderRadius: "50%",
                },
              ]}
            />

            <div className="flex justify-between mt-4 text-xs text-white/60">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-400 font-medium text-sm">
                  Buy Signal
                </span>
              </div>
              <p className="text-white/80 text-sm">
                When RSI &lt;{" "}
                <span className="font-bold text-green-400">{rsiValues[0]}</span>
              </p>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-red-400 font-medium text-sm">
                  Sell Signal
                </span>
              </div>
              <p className="text-white/80 text-sm">
                When RSI &gt;{" "}
                <span className="font-bold text-red-400">{rsiValues[1]}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Period Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Calculation Period
          </h3>
          <p className="text-white/60 text-sm mb-4">
            Number of periods for RSI calculation
          </p>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {[7, 9, 14, 17, 21].map((p) => {
            const isSelected = period === p;
            const isDefault = p === 14;
            return (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`
                  relative py-3 px-4 rounded-lg font-medium transition-colors
                  ${
                    isSelected
                      ? "bg-[#e3b8ff]/20 border border-[#e3b8ff]/40 text-[#e3b8ff]"
                      : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
                  }
                `}
              >
                {p}
                {isDefault && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-black text-xs">★</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <p className="text-white/50 text-xs text-center">
          ★ 14 is the standard default period
        </p>
      </div>

      {/* Configuration Summary */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-6">
        <h3 className="text-white font-medium mb-4">Current Configuration</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-white/60">Timeframes:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedTimeframes.map((tf) => (
                <span
                  key={tf}
                  className="px-2 py-1 bg-[#e3b8ff]/20 text-[#e3b8ff] text-xs rounded"
                >
                  {tf}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-white/60">Levels:</span>
            <p className="text-white font-medium mt-1">
              {rsiValues[0]} / {rsiValues[1]}
            </p>
          </div>

          <div>
            <span className="text-white/60">Period:</span>
            <p className="text-white font-medium mt-1">{period} candles</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={() => setStep(step - 1)}
          className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors"
        >
          ← Back
        </button>

        <button
          onClick={() => setStep(step + 1)}
          className="px-8 py-3 bg-gradient-to-r from-[#e3b8ff] to-[#6a2e8e] text-black font-medium rounded-lg hover:scale-105 transition-transform"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
