import ToggleSwitch from "./ToggleSwitch";
import { useState, useEffect } from "react";
const timeframes = ["1m", "5m", "15m", "30m", "1h", "1d"];

export default function MaSettings({
  enabled,
  setEnabled,
  settings,
  setSettings,
}) {
  const [selectedTimeframes, setSelectedTimeframes] = useState(
    settings?.intervals || ["1m"]
  );
  const [period, setPeriod] = useState(settings?.period || 20);

  // Update parent state when local state changes
  useEffect(() => {
    setSettings({
      period: period,
      intervals: selectedTimeframes,
    });
  }, [period, selectedTimeframes, setSettings]);

  const toggleTimeframe = (timeframe) => {
    const newTimeframes = selectedTimeframes.includes(timeframe)
      ? selectedTimeframes.filter((t) => t !== timeframe)
      : [...selectedTimeframes, timeframe];

    // Make sure we always have at least one timeframe selected
    if (newTimeframes.length > 0) {
      setSelectedTimeframes(newTimeframes);
    }
  };

  return (
    <div className="flex flex-col w-full items-center justify-center gap-4">
      <div className="flex items-center justify-between w-full">
        <h2 className="font-semibold text-lg text-bl">MA</h2>
        <div className="flex flex-col items-center">
          <ToggleSwitch
            isEnabled={enabled}
            onToggle={() => setEnabled(!enabled)}
          />
        </div>
      </div>
      {enabled && (
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col w-full gap-[10px]">
            <p className="font-semibold text-bl">Timeframes</p>
            <div className="flex items-center font-semibold text-sm text-gr w-full gap-2">
              {timeframes.map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => toggleTimeframe(timeframe)}
                  className={`${
                    selectedTimeframes.includes(timeframe)
                      ? "bg-root-green text-bkg"
                      : "bg-log-bkg text-gr"
                  } w-full flex py-2 flex-col items-center justify-center rounded-[14px]`}
                >
                  <p>{timeframe}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col w-full gap-[10px]">
            <p className="font-semibold text-bl">Period</p>
            <div className="flex items-center gap-2">
              {[10, 20, 50, 100, 200].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`${
                    period == p
                      ? "bg-root-green text-bkg"
                      : "bg-log-bkg text-gr"
                  } w-full flex py-2 flex-col items-center font-semibold  justify-center rounded-[14px]`}
                >
                  <p>{p}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
