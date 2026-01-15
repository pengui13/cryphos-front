"use client";

import { useEffect, useMemo, useState } from "react";
import { GetAllSymbolsNonStable } from "../api/ApiWrapper";
import Image from "next/image";

export default function AssetsBlock({
  selectedSymbols,
  setSelectedSymbols,
  setStep,
  step,
}) {
  const [symbols, setSymbols] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [failedImg, setFailedImg] = useState({});

  const MAX_SELECTION = 50;

  useEffect(() => {
    const fetchSymbols = async () => {
      setIsLoading(true);
      try {
        await GetAllSymbolsNonStable(setSymbols);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSymbols();
  }, []);

  const filteredSymbols = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return symbols;
    return symbols.filter((s) => s.toLowerCase().includes(q));
  }, [symbols, searchQuery]);

  const handleSelectAll = () => {
    const available = filteredSymbols.length > 0 ? filteredSymbols : symbols;
    setSelectedSymbols(available.slice(0, MAX_SELECTION));
  };

  const handleDeselectAll = () => {
    setSelectedSymbols([]);
  };

  const handleSelectTop10 = () => {
    setSelectedSymbols(symbols.slice(0, 10));
  };

  const toggleSymbol = (symbol) => {
    const on = selectedSymbols.includes(symbol);
    if (on) {
      setSelectedSymbols(selectedSymbols.filter((s) => s !== symbol));
    } else if (selectedSymbols.length < MAX_SELECTION) {
      setSelectedSymbols([...selectedSymbols, symbol]);
    }
  };

  const atLimit = selectedSymbols.length >= MAX_SELECTION;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Select assets</h2>
        <p className="mt-1 text-white/50 text-sm">Choose up to {MAX_SELECTION} cryptocurrencies</p>
      </div>

      {/* Search + Quick actions */}
      <div className="mx-auto w-full max-w-3xl space-y-3">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 pl-10 text-white placeholder-white/30 outline-none transition focus:border-white/20 focus:bg-white/[0.06]"
            placeholder="Search…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/70 transition hover:bg-white/[0.08] hover:text-white"
            >
              Select All
            </button>
            <button
              onClick={handleDeselectAll}
              disabled={selectedSymbols.length === 0}
              className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/70 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Deselect
            </button>
            <button
              onClick={handleSelectTop10}
              className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/70 transition hover:bg-white/[0.08] hover:text-white"
            >
              Top 10
            </button>
          </div>

          <div className="text-xs text-white/40">
            {selectedSymbols.length}/{MAX_SELECTION} selected
          </div>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="mx-auto w-full max-w-3xl rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-white/60" />
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {filteredSymbols.length === 0 ? (
              <div className="py-16 text-center text-white/40 text-sm">No assets found</div>
            ) : (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-6">
                {filteredSymbols.map((symbol) => {
                  const isSelected = selectedSymbols.includes(symbol);
                  const isBlocked = !isSelected && atLimit;

                  return (
                    <button
                      key={symbol}
                      onClick={() => !isBlocked && toggleSymbol(symbol)}
                      className={[
                        "group relative flex flex-col items-center gap-2 rounded-xl border p-3 transition-all",
                        isSelected
                          ? "border-[#e3b8ff]/40 bg-[#e3b8ff]/10"
                          : "border-transparent bg-white/[0.03] hover:bg-white/[0.06]",
                        isBlocked ? "cursor-not-allowed opacity-30" : "cursor-pointer",
                      ].join(" ")}
                    >
                      {/* Icon container - round and bigger */}
                      <div
                        className={[
                          "grid h-12 w-12 place-items-center rounded-full transition-colors",
                          isSelected ? "bg-[#e3b8ff]/20" : "bg-white/[0.06]",
                        ].join(" ")}
                      >
                        {!failedImg[symbol] ? (
                          <Image
                            width={28}
                            height={28}
                            src={`/assets/${symbol.toLowerCase()}.png`}
                            alt={symbol}
                            className="h-7 w-7 object-contain"
                            onError={() =>
                              setFailedImg((m) => ({ ...m, [symbol]: true }))
                            }
                          />
                        ) : (
                          <span
                            className={[
                              "text-xs font-bold",
                              isSelected ? "text-[#e3b8ff]" : "text-white/50",
                            ].join(" ")}
                          >
                            {symbol.slice(0, 3)}
                          </span>
                        )}
                      </div>

                      {/* Symbol text */}
                      <span
                        className={[
                          "text-xs font-medium truncate max-w-full",
                          isSelected ? "text-[#e3b8ff]" : "text-white/60",
                        ].join(" ")}
                      >
                        {symbol}
                      </span>

                      {/* Selected indicator */}
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#e3b8ff] grid place-items-center">
                          <svg className="h-2.5 w-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Summary */}
      {selectedSymbols.length > 0 && (
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex flex-wrap items-center gap-1.5">
            {selectedSymbols.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] pl-2.5 pr-1 py-1 text-xs text-white/70"
              >
                {s}
                <button
                  onClick={() => toggleSymbol(s)}
                  className="grid h-4 w-4 place-items-center rounded-full hover:bg-white/10 text-white/40 hover:text-white/70 transition"
                >
                  <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="pt-4 text-center">
        <button
          onClick={() => setStep(step + 1)}
          disabled={selectedSymbols.length === 0}
          className={[
            "inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all",
            selectedSymbols.length > 0
              ? "bg-[#e3b8ff] text-black hover:bg-[#d7a8ff] hover:-translate-y-0.5 active:translate-y-0"
              : "bg-white/[0.06] text-white/30 cursor-not-allowed",
          ].join(" ")}
        >
          Continue
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}