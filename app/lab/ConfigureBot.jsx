import RsiSettings from "./RsiSettings";
import { useEffect, useState } from "react";
// import MaSettings from "./MaSettings";
// import BollingerBands from "./BollingerBands";
export default function ConfigureBot({
  botSettings,
  setBotSettings,
  step,
  setStep,
}) {
  // RSI state
  const [rsiEnabled, setRsiEnabled] = useState(
    botSettings?.rsi?.enabled || true
  );
  const [rsiSettings, setRsiSettings] = useState({
    period: botSettings?.rsi?.period || 14,
    max: botSettings?.rsi?.max || 70,
    min: botSettings?.rsi?.min || 30,
    intervals: botSettings?.rsi?.intervals || ["1m"],
  });
  const [maEnabled, setMaEnabled] = useState(botSettings?.ma?.enabled || false);
  const [maSettings, setMaSettings] = useState({
    period: botSettings?.ma?.period || 20,
    intervals: botSettings?.ma?.intervals || ["1m"],
  });
  const [bbEnabled, setBbEnabled] = useState(botSettings?.bb?.enabled || false);
  const [bbSettings, setBbSettings] = useState({
    period: botSettings?.bb?.period || 20,
    std_dev: botSettings?.bb?.std_dev || 2.0,
    intervals: botSettings?.bb?.intervals || ["1m"],
  });

  // Update botSettings when RSI settings change
  useEffect(() => {
    setBotSettings((prevSettings) => {
      // Create a new settings object to avoid mutating the previous state
      const newSettings = { ...prevSettings };

      // Handle RSI settings
      if (rsiEnabled) {
        newSettings.rsi = {
          ...rsiSettings,
          enabled: true,
        };
      } else {
        // Remove RSI completely when disabled
        if (newSettings.rsi) {
          delete newSettings.rsi;
        }
      }
      if (bbEnabled) {
        newSettings.bb = {
          ...bbSettings,
          enabled: true,
        };
      } else {
        // Remove BB completely when disabled
        if (newSettings.bb) {
          delete newSettings.bb;
        }
      }
      // Handle MA settings
      if (maEnabled) {
        newSettings.ma = {
          ...maSettings,
          enabled: true,
        };
      } else {
        // Remove MA completely when disabled
        if (newSettings.ma) {
          delete newSettings.ma;
        }
      }
      return newSettings;
    });
  }, [
    rsiEnabled,
    rsiSettings,
    maEnabled,
    maSettings,
    bbEnabled,
    bbSettings,
    setBotSettings,
  ]);

  return (
    <div className="flex flex-col w-full gap-5">
      <RsiSettings
        step={step}
        setStep={setStep}
        enabled={rsiEnabled}
        setEnabled={setRsiEnabled}
        settings={rsiSettings}
        setSettings={setRsiSettings}
      />
      {/* <MaSettings
        enabled={maEnabled}
        setEnabled={setMaEnabled}
        settings={maSettings}
        setSettings={setMaSettings}
      />
      <BollingerBands
        enabled={bbEnabled}
        setEnabled={setBbEnabled}
        settings={bbSettings}
        setSettings={setBbSettings}
      /> */}
    </div>
  );
}
