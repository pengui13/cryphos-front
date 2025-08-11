import React, { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

// Toggle Switch Component
function ToggleSwitch({ isEnabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        isEnabled
          ? "bg-gradient-to-r from-[#e3b8ff] to-[#6a2e8e]"
          : "bg-white/20"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isEnabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

const timeframes = ["1m", "5m", "15m", "30m", "1h", "1d"];

export default function BollingerBands({
  enabled = false,
  setEnabled = () => {},
  settings = {},
  setSettings = () => {},
}) {
  const [selectedTimeframes, setSelectedTimeframes] = useState(
    settings?.intervals || ["1m"]
  );
  const [period, setPeriod] = useState(settings?.period || 20);
  const [stdDev, setStdDev] = useState(settings?.stdDev || 2);

  // Update parent state when local state changes
  useEffect(() => {
    setSettings({
      period: period,
      std_dev: stdDev,
      intervals: selectedTimeframes,
    });
  }, [period, stdDev, selectedTimeframes, setSettings]);

  const toggleTimeframe = (timeframe) => {
    const newTimeframes = selectedTimeframes.includes(timeframe)
      ? selectedTimeframes.filter((t) => t !== timeframe)
      : [...selectedTimeframes, timeframe];

    // Make sure we always have at least one timeframe selected
    if (newTimeframes.length > 0) {
      setSelectedTimeframes(newTimeframes);
    }
  };

  // Convert stdDev to steps for the slider (1.0 = 0, 1.5 = 1, 2.0 = 2, etc.)
  const stdDevToStep = (value) => (value - 1.0) * 2;
  const stepToStdDev = (step) => 1.0 + step * 0.5;

  const handleStdDevChange = (step) => {
    setStdDev(stepToStdDev(step));
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-[#0d0019] to-black text-gray-100">
      {/* Animated Planets */}
      <div className="planet planet-1" />
      <div className="planet planet-2" />
      <div className="planet planet-3" />
      <div className="blur-background" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        {/* Main Container */}
        <div className="relative group">
          <div className="absolute -inset-1 rounded-3xl blur opacity-30 group-hover:opacity-50 transition bg-gradient-to-br from-[#e3b8ff] to-[#6a2e8e]"></div>
          <div className="relative bg-[#13042c]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#e3b8ff] to-[#6a2e8e] rounded-2xl flex items-center justify-center text-3xl mr-6">
                  📊
                </div>
                <h2 className="text-4xl font-bold text-white">
                  Bollinger Bands
                </h2>
              </div>
              <ToggleSwitch
                isEnabled={enabled}
                onToggle={() => setEnabled(!enabled)}
              />
            </div>

            {enabled && (
              <div className="space-y-12">
                {/* Timeframes Section */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-br from-[#6a2e8e] to-[#310447] rounded-lg flex items-center justify-center text-sm mr-3">
                      ⏱️
                    </span>
                    Timeframes
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                    {timeframes.map((timeframe) => (
                      <button
                        key={timeframe}
                        onClick={() => toggleTimeframe(timeframe)}
                        className={`relative group/btn transition-all duration-300 ${
                          selectedTimeframes.includes(timeframe)
                            ? "transform scale-105"
                            : "hover:scale-102"
                        }`}
                      >
                        <div
                          className={`absolute -inset-0.5 rounded-2xl blur opacity-30 transition ${
                            selectedTimeframes.includes(timeframe)
                              ? "bg-gradient-to-r from-[#e3b8ff] to-[#6a2e8e]"
                              : "bg-white/20 group-hover/btn:opacity-50"
                          }`}
                        ></div>
                        <div
                          className={`relative py-4 px-6 rounded-2xl font-bold text-lg transition ${
                            selectedTimeframes.includes(timeframe)
                              ? "bg-gradient-to-r from-[#e3b8ff] to-[#6a2e8e] text-black"
                              : "bg-[#13042c]/70 text-white/70 hover:text-white"
                          }`}
                        >
                          {timeframe}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Period Section */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-br from-[#53266e] to-[#310447] rounded-lg flex items-center justify-center text-sm mr-3">
                      🎯
                    </span>
                    Period
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {[10, 20, 50, 100, 200].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`relative group/btn transition-all duration-300 ${
                          period === p
                            ? "transform scale-105"
                            : "hover:scale-102"
                        }`}
                      >
                        <div
                          className={`absolute -inset-0.5 rounded-2xl blur opacity-30 transition ${
                            period === p
                              ? "bg-gradient-to-r from-[#e3b8ff] to-[#6a2e8e]"
                              : "bg-white/20 group-hover/btn:opacity-50"
                          }`}
                        ></div>
                        <div
                          className={`relative py-4 px-6 rounded-2xl font-bold text-lg transition ${
                            period === p
                              ? "bg-gradient-to-r from-[#e3b8ff] to-[#6a2e8e] text-black"
                              : "bg-[#13042c]/70 text-white/70 hover:text-white"
                          }`}
                        >
                          {p}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Standard Deviation Section */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-br from-[#411664] to-[#350952] rounded-lg flex items-center justify-center text-sm mr-3">
                      📈
                    </span>
                    Standard Deviation
                  </h3>

                  <div className="relative group/slider">
                    <div className="absolute -inset-1 rounded-2xl blur opacity-20 bg-gradient-to-r from-[#e3b8ff] to-[#6a2e8e]"></div>
                    <div className="relative bg-[#13042c]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex-1 mr-8">
                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-white/60 mb-2">
                              <span>1.0</span>
                              <span>1.5</span>
                              <span>2.0</span>
                              <span>2.5</span>
                              <span>3.0</span>
                            </div>
                          </div>

                          <Slider
                            value={stdDevToStep(stdDev)}
                            min={0}
                            max={4}
                            step={1}
                            onChange={handleStdDevChange}
                            trackStyle={{
                              background:
                                "linear-gradient(90deg, #e3b8ff 0%, #6a2e8e 100%)",
                              height: 8,
                              borderRadius: 4,
                            }}
                            railStyle={{
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              height: 8,
                              borderRadius: 4,
                            }}
                            handleStyle={{
                              backgroundColor: "#e3b8ff",
                              border: "3px solid #6a2e8e",
                              width: 24,
                              height: 24,
                              marginTop: -8,
                              boxShadow: "0 4px 12px rgba(227, 184, 255, 0.3)",
                            }}
                            dotStyle={{
                              backgroundColor: "rgba(255, 255, 255, 0.3)",
                              border: "2px solid rgba(255, 255, 255, 0.5)",
                              width: 12,
                              height: 12,
                              marginTop: -2,
                            }}
                            activeDotStyle={{
                              backgroundColor: "#e3b8ff",
                              border: "2px solid #6a2e8e",
                            }}
                            marks={{
                              0: "",
                              1: "",
                              2: "",
                              3: "",
                              4: "",
                            }}
                          />
                        </div>

                        {/* Value Display */}
                        <div className="relative group/value">
                          <div className="absolute -inset-1 rounded-2xl blur opacity-50 bg-gradient-to-r from-[#e3b8ff] to-[#6a2e8e]"></div>
                          <div className="relative bg-gradient-to-r from-[#e3b8ff] to-[#6a2e8e] rounded-2xl py-4 px-8">
                            <span className="text-black text-2xl font-bold">
                              {stdDev.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Info Text */}
                      <div className="text-center text-white/70">
                        <p className="text-sm leading-relaxed">
                          Standard deviation controls the width of the Bollinger
                          Bands. Higher values create wider bands, lower values
                          create tighter bands.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="relative group/summary">
                  <div className="absolute -inset-1 rounded-2xl blur opacity-20 bg-gradient-to-r from-green-500 to-emerald-400"></div>
                  <div className="relative bg-[#13042c]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <span className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-400 rounded-lg flex items-center justify-center text-sm mr-3">
                        ✅
                      </span>
                      Configuration Summary
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                      <div>
                        <div className="text-2xl font-bold text-[#e3b8ff] mb-1">
                          {selectedTimeframes.join(", ")}
                        </div>
                        <div className="text-sm text-white/60">Timeframes</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[#e3b8ff] mb-1">
                          {period}
                        </div>
                        <div className="text-sm text-white/60">Period</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[#e3b8ff] mb-1">
                          {stdDev.toFixed(1)}
                        </div>
                        <div className="text-sm text-white/60">Std Dev</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .planet {
          position: absolute;
          border-radius: 50%;
          z-index: 0;
          animation: drift 6s ease-in-out infinite;
        }
        .planet-1 {
          width: 100px;
          height: 100px;
          top: 20%;
          left: 10%;
          background: radial-gradient(circle, #310447, #53266e);
        }
        .planet-2 {
          width: 150px;
          height: 150px;
          top: 60%;
          left: 70%;
          background: radial-gradient(circle, #e3b8ff, #6a2e8e);
        }
        .planet-3 {
          width: 80px;
          height: 80px;
          top: 75%;
          left: 50%;
          background: radial-gradient(circle, #411664, #350952);
        }
        .blur-background {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 1;
        }
        @keyframes drift {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
