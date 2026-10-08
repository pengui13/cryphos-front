"use client";

import { useCallback, useRef, useState } from "react";
import { RunBacktest } from "../api/ApiWrapper";
import BacktestModal from "./BacktestModal";
import BacktestSettingsModal from "./BacktestSettingsModal";
import { backtestErrorMessage } from "./backtestFormat";

// The settings → run → results flow for a bot's backtest.
// `start(botId)` opens the settings; render `elements` once on the page.
export default function useBacktest() {
  const [botId, setBotId] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [lastParams, setLastParams] = useState({});
  // Ignores a response that arrives after the modal was closed or re-run.
  const requestId = useRef(0);

  const start = useCallback((id) => {
    setBotId(id);
    setSettingsOpen(true);
  }, []);

  const run = (params) => {
    const id = ++requestId.current;
    setLastParams(params);
    setSettingsOpen(false);
    setResultOpen(true);
    setLoading(true);
    setResult(null);
    setError(null);

    RunBacktest(
      botId,
      params,
      (json) => {
        if (id !== requestId.current) return;
        setResult(json);
        setLoading(false);
      },
      (err) => {
        if (id !== requestId.current) return;
        setError(backtestErrorMessage(err));
        setLoading(false);
      }
    );
  };

  const closeResult = useCallback(() => {
    requestId.current += 1;
    setResultOpen(false);
    setLoading(false);
  }, []);

  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const elements = (
    <>
      <BacktestSettingsModal
        open={settingsOpen}
        onClose={closeSettings}
        onRun={run}
        defaultValues={lastParams}
      />
      <BacktestModal
        open={resultOpen}
        onClose={closeResult}
        loading={loading}
        result={result}
        error={error}
        selectedId={botId}
      />
    </>
  );

  return { start, running: loading, activeBotId: botId, elements };
}
