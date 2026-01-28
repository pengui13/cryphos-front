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
    <div className="w-full min-w-[320px] max-w-[820px] mx-auto">
      {/* Search row */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-0">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-10 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:border-[#e3b8ff]/50"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-white/30 hover:text-white/60 hover:bg-white/5 transition"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <div className={`
          flex-shrink-0 px-4 py-3 rounded-xl text-sm font-medium tabular-nums border transition-colors
          ${atLimit 
            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
            : selectedSymbols.length > 0
              ? 'bg-[#e3b8ff]/10 text-[#e3b8ff] border-[#e3b8ff]/30'
              : 'bg-white/5 text-white/60 border-white/10'
          }
        `}>
          {selectedSymbols.length}/{MAX_SELECTION}
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={handleSelectTop10}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white active:scale-95"
        >
          Top 10
        </button>
        <button
          onClick={handleSelectAll}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white active:scale-95"
        >
          Select all
        </button>
        {selectedSymbols.length > 0 && (
          <button
            onClick={handleDeselectAll}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white active:scale-95"
          >
            Clear
          </button>
        )}
        
        {searchQuery && (
          <span className="ml-auto text-sm text-white/40">
            {filteredSymbols.length} found
          </span>
        )}
      </div>

      {/* Assets Grid */}
      <div className="rounded-2xl border border-white/10 w-full bg-white/[0.02] p-3 mb-6 h-[420px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#e3b8ff]" />
          </div>
        ) : filteredSymbols.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-white/40 mb-2">No assets found</p>
            <button 
              onClick={() => setSearchQuery("")}
              className="text-sm text-[#e3b8ff]/70 hover:text-[#e3b8ff] transition"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="h-full overflow-y-auto pr-1">
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2">
              {filteredSymbols.map((symbol) => {
                const isSelected = selectedSymbols.includes(symbol);
                const isBlocked = !isSelected && atLimit;

                return (
                  <button
                    key={symbol}
                    onClick={() => !isBlocked && toggleSymbol(symbol)}
                    disabled={isBlocked}
                    className={`
                      relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all
                      ${isSelected 
                        ? "bg-[#e3b8ff]/10 border-[#e3b8ff]/40" 
                        : "bg-white/[0.02] border-transparent hover:bg-white/[0.05] hover:border-white/10"
                      }
                      ${isBlocked ? "opacity-30 cursor-not-allowed" : "cursor-pointer active:scale-95"}
                    `}
                  >
                    <div className={`
                      h-11 w-11 grid place-items-center rounded-full transition-colors
                      ${isSelected ? "bg-[#e3b8ff]/20" : "bg-white/[0.05]"}
                    `}>
                      {!failedImg[symbol] ? (
                        <Image
                          width={28}
                          height={28}
                          src={`/assets/${symbol.toLowerCase()}.png`}
                          alt={symbol}
                          className="h-6 w-6 object-contain"
                          onError={() => setFailedImg((p) => ({ ...p, [symbol]: true }))}
                        />
                      ) : (
                        <span className={`text-xs font-bold ${isSelected ? "text-[#e3b8ff]" : "text-white/40"}`}>
                          {symbol.slice(0, 2)}
                        </span>
                      )}
                    </div>

                    <span className={`text-[11px] font-medium truncate w-full text-center transition-colors ${isSelected ? "text-[#e3b8ff]" : "text-white/60"}`}>
                      {symbol}
                    </span>

                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-[#e3b8ff] grid place-items-center">
                        <svg className="h-2.5 w-2.5 text-black" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Continue */}
      <button
        onClick={() => setStep(step + 1)}
        disabled={selectedSymbols.length === 0}
        className={`
          w-full sm:w-auto flex items-center justify-center gap-2 
          rounded-xl px-8 py-3.5 text-sm font-semibold transition-all
          ${selectedSymbols.length > 0
            ? "bg-[#e3b8ff] text-black hover:bg-[#d4a8ff] active:scale-[0.98]"
            : "bg-white/5 text-white/30 cursor-not-allowed"
          }
        `}
      >
        {selectedSymbols.length === 0 ? (
          "Select assets to continue"
        ) : (
          <>
            Continue with {selectedSymbols.length} asset{selectedSymbols.length !== 1 ? 's' : ''}
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}