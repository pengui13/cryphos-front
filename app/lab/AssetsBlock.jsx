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

  const MAX_SELECTION = 10;

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
    if (selectedSymbols.length >= MAX_SELECTION) {
      setSelectedSymbols([]);
    } else {
      setSelectedSymbols(symbols.slice(0, MAX_SELECTION));
    }
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
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Select assets</h2>
        <p className="mt-1 text-white/70 text-sm">Choose up to {MAX_SELECTION} cryptocurrencies</p>
        <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#e3b8ff]" />
          {selectedSymbols.length}/{MAX_SELECTION} selected
        </div>
      </div>

      {/* Search + Quick actions */}
      <div className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
        <div className="relative">
          <input
            type="text"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 pl-10 text-white placeholder-white/40 outline-none transition focus:border-[#e3b8ff]/40 focus:ring-2 focus:ring-[#e3b8ff]/30"
            placeholder="Search cryptocurrencies…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
            🔎
          </span>
        </div>

        <button
          onClick={handleSelectAll}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10"
        >
          {selectedSymbols.length >= MAX_SELECTION ? "Clear all" : "Select top 10"}
        </button>
      </div>

      {/* Assets Grid */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#e3b8ff]/30 border-t-[#e3b8ff]" />
              <p className="text-white/60 text-sm">Loading assets…</p>
            </div>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto pr-1">
            {filteredSymbols.length === 0 ? (
              <div className="py-12 text-center text-white/50 text-sm">No assets found</div>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                {filteredSymbols.map((symbol) => {
                  const isSelected = selectedSymbols.includes(symbol);
                  const isBlocked = !isSelected && atLimit;

                  return (
                    <button
                      key={symbol}
                      onClick={() => !isBlocked && toggleSymbol(symbol)}
                      className={[
                        "group relative rounded-xl border p-3 text-center transition-all",
                        isSelected
                          ? "border-[#e3b8ff]/50 bg-[#e3b8ff]/10 shadow-[0_8px_24px_-12px_rgba(227,184,255,0.35)]"
                          : "border-white/10 bg-white/5 hover:bg-white/10",
                        isBlocked ? "cursor-not-allowed opacity-40" : "cursor-pointer",
                      ].join(" ")}
                      aria-pressed={isSelected}
                    >
                      {/* check overlay */}
                      {isSelected && (
                        <span className="absolute right-2 top-2 rounded-full border border-[#e3b8ff]/50 bg-[#e3b8ff]/15 px-1.5 py-0.5 text-[10px] font-medium text-[#e3b8ff]">
                          Selected
                        </span>
                      )}

                      <div className="flex flex-col items-center gap-2">
                        <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-white/10">
                          {!failedImg[symbol] ? (
                            <Image
                              width={24}
                              height={24}
                              src={`/assets/${symbol.toLowerCase()}.png`}
                              alt={symbol}
                              className="h-6 w-6 object-contain"
                              onError={() =>
                                setFailedImg((m) => ({ ...m, [symbol]: true }))
                              }
                            />
                          ) : (
                            <span className="grid h-6 w-6 place-items-center rounded bg-[#e3b8ff]/20 text-[11px] font-bold text-[#e3b8ff]">
                              {symbol.slice(0, 3).toUpperCase()}
                            </span>
                          )}
                        </div>

                        <span
                          className={`truncate text-xs font-medium ${
                            isSelected ? "text-[#e3b8ff]" : "text-white/80"
                          }`}
                          title={symbol}
                        >
                          {symbol}
                        </span>
                      </div>
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
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold">Selected assets</h3>
              <p className="text-xs text-white/60">
                {selectedSymbols.length} of {MAX_SELECTION}
              </p>
            </div>
            <div className="flex max-w-md flex-wrap gap-1">
              {selectedSymbols.slice(0, 8).map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 rounded-full border border-[#e3b8ff]/40 bg-[#e3b8ff]/10 px-2 py-0.5 text-xs text-[#e3b8ff]"
                >
                  {s}
                  <button
                    onClick={() => toggleSymbol(s)}
                    className="ml-1 rounded px-1 text-[10px] text-[#e3b8ff]/80 hover:bg-[#e3b8ff]/10"
                    aria-label={`Remove ${s}`}
                  >
                    ✕
                  </button>
                </span>
              ))}
              {selectedSymbols.length > 8 && (
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">
                  +{selectedSymbols.length - 8}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="pt-2 text-center">
        <button
          onClick={() => setStep(step + 1)}
          disabled={selectedSymbols.length === 0}
          className={`inline-flex items-center justify-center rounded-2xl px-7 py-3 font-semibold transition-[transform,background,box-shadow]
            ${
              selectedSymbols.length > 0
                ? "bg-[#e3b8ff] text-black shadow-[0_12px_30px_-10px_rgba(227,184,255,0.6)] hover:-translate-y-0.5 hover:bg-[#d7a8ff] focus:outline-none focus-visible:ring focus-visible:ring-[#e3b8ff]/40 active:translate-y-0"
                : "cursor-not-allowed bg-white/10 text-white/50"
            }`}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
