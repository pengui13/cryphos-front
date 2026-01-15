import React, { useState, useEffect } from "react";

const ToggleSwitch = ({ isEnabled = false, onToggle = () => {} }) => {
  const [enabled, setEnabled] = useState(isEnabled);

  // Sync with parent prop changes
  useEffect(() => {
    setEnabled(isEnabled);
  }, [isEnabled]);

  const handleToggle = () => {
    const newState = !enabled;
    setEnabled(newState);
    onToggle(newState);
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative w-16 h-8 rounded-full cursor-pointer transition-all duration-300 ease-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-500/30 ${
          enabled
            ? "bg-gradient-to-r from-orange-500 to-yellow-400 shadow-lg shadow-orange-500/30"
            : "bg-white/10 border border-white/20 hover:border-white/40"
        }`}
        onClick={handleToggle}
        role="switch"
        aria-checked={enabled}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        {/* Glow effect when enabled */}
        {enabled && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/50 to-yellow-400/50 blur animate-pulse"></div>
        )}

        {/* Toggle handle */}
        <div
          className={`absolute top-1 w-6 h-6 rounded-full shadow-lg transition-all duration-300 ease-out transform ${
            enabled
              ? "translate-x-8 bg-white scale-110 shadow-orange-500/20"
              : "translate-x-1 bg-white/90 hover:bg-white"
          }`}
        >
          {/* Inner icon/indicator */}
          <div className="w-full h-full rounded-full flex items-center justify-center">
            {enabled ? (
              <svg
                className="w-3 h-3 text-orange-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <div className="w-2 h-2 rounded-full bg-white/60"></div>
            )}
          </div>
        </div>

        {/* Background pattern when enabled */}
        {enabled && (
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div
                className="absolute top-1 left-2 w-1 h-1 bg-white/40 rounded-full animate-ping"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="absolute top-3 right-3 w-1 h-1 bg-white/30 rounded-full animate-ping"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="absolute bottom-2 left-4 w-1 h-1 bg-white/20 rounded-full animate-ping"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Optional label */}
      <div className="mt-2 text-center">
        <span
          className={`text-xs font-medium transition-colors duration-200 ${
            enabled ? "text-orange-400" : "text-white/60"
          }`}
        >
          {enabled ? "ON" : "OFF"}
        </span>
      </div>
    </div>
  );
};

export default ToggleSwitch;
