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

  const maxSelection = symbols.length;

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

  const unselectedSymbols = useMemo(() => {
    return filteredSymbols.filter((s) => !selectedSymbols.includes(s));
  }, [filteredSymbols, selectedSymbols]);

  const handleSelectAll = () => {
    setSelectedSymbols([...symbols]);
  };

  const handleDeselectAll = () => setSelectedSymbols([]);

  const handleSelectTop10 = () => setSelectedSymbols(symbols.slice(0, 10));

  const addSymbol = (symbol) => {
    if (!selectedSymbols.includes(symbol)) {
      setSelectedSymbols([...selectedSymbols, symbol]);
    }
  };

  const removeSymbol = (symbol) => {
    setSelectedSymbols(selectedSymbols.filter((s) => s !== symbol));
  };

  const CoinIcon = ({ symbol, size = 32, selected = false }) => (
    <div
      className={`
        relative rounded-full flex items-center justify-center overflow-hidden flex-shrink-0
        ${selected ? "bg-[#e3b8ff]/20" : "bg-white/[0.06]"}
      `}
      style={{ width: size, height: size }}
    >
      {!failedImg[symbol] ? (
        <Image
          width={size * 0.7}
          height={size * 0.7}
          src={`/assets/${symbol.toLowerCase()}.png`}
          alt={symbol}
          className="object-contain rounded-full"
          onError={() => setFailedImg((p) => ({ ...p, [symbol]: true }))}
        />
      ) : (
        <span className={`text-[10px] font-bold ${selected ? "text-[#e3b8ff]" : "text-white/40"}`}>
          {symbol.slice(0, 2)}
        </span>
      )}
    </div>
  );

  // Mobile list item component
  const MobileListItem = ({ symbol, selected, onClick }) => (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 transition-all
        ${selected 
          ? "bg-[#e3b8ff]/10 hover:bg-red-500/10" 
          : "hover:bg-white/[0.04]"
        }
      `}
    >
      <CoinIcon symbol={symbol} size={28} selected={selected} />
      <span className={`text-sm font-medium ${selected ? "text-[#e3b8ff]" : "text-white/80"}`}>
        {symbol}
      </span>
      <svg
        className={`ml-auto h-4 w-4 ${selected ? "text-red-400/60" : "text-white/20"}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {selected ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        )}
      </svg>
    </button>
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-0">
      {/* Search and quick actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] pl-11 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-[#e3b8ff]/30 focus:bg-white/[0.05]"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSelectTop10}
            className="flex-1 sm:flex-none px-4 py-3 rounded-xl text-sm text-white/60 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:text-white transition-all"
          >
            Top 10
          </button>
          <button
            onClick={handleSelectAll}
            className="flex-1 sm:flex-none px-4 py-3 rounded-xl text-sm text-white/60 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:text-white transition-all"
          >
            Select all
          </button>
        </div>
      </div>

      {/* MOBILE: Two stacked vertical lists */}
      <div className="sm:hidden space-y-4">
        {/* Selected list */}
        {selectedSymbols.length > 0 && (
          <div className="rounded-2xl border border-[#e3b8ff]/20 bg-[#e3b8ff]/[0.04] overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#e3b8ff]/10">
              <span className="text-xs font-medium text-[#e3b8ff]">
                Selected ({selectedSymbols.length})
              </span>
              <button
                onClick={handleDeselectAll}
                className="text-xs text-white/40 hover:text-white transition"
              >
                Clear
              </button>
            </div>
            <div className="max-h-[200px] overflow-y-auto divide-y divide-[#e3b8ff]/10">
              {selectedSymbols.map((symbol) => (
                <MobileListItem
                  key={symbol}
                  symbol={symbol}
                  selected
                  onClick={() => removeSymbol(symbol)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Available list */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-3 py-2 border-b border-white/[0.06]">
            <span className="text-xs font-medium text-white/40">
              Available ({unselectedSymbols.length})
            </span>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-[#e3b8ff]" />
            </div>
          ) : unselectedSymbols.length === 0 ? (
            <div className="py-8 text-center text-white/40 text-sm">
              {selectedSymbols.length > 0 ? "All selected" : "No assets found"}
            </div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto divide-y divide-white/[0.04]">
              {unselectedSymbols.map((symbol) => (
                <MobileListItem
                  key={symbol}
                  symbol={symbol}
                  selected={false}
                  onClick={() => addSymbol(symbol)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DESKTOP: Original layout */}
      <div className="hidden sm:block">
        {/* Selected assets bar */}
        {selectedSymbols.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-[#e3b8ff]/[0.06] border border-[#e3b8ff]/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#e3b8ff]">
                {selectedSymbols.length} selected
                <span className="text-white/30 ml-1">/ {maxSelection}</span>
              </span>
              <button
                onClick={handleDeselectAll}
                className="text-xs text-white/40 hover:text-white transition px-2 py-1 rounded-lg hover:bg-white/[0.05]"
              >
                Clear all
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {selectedSymbols.map((symbol) => (
                <button
                  key={symbol}
                  onClick={() => removeSymbol(symbol)}
                  className="group flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-[#e3b8ff]/10 hover:bg-red-500/20 border border-[#e3b8ff]/30 hover:border-red-500/40 transition-all"
                >
                  <CoinIcon symbol={symbol} size={24} selected />
                  <span className="text-sm text-[#e3b8ff] group-hover:text-red-400 transition-colors">
                    {symbol}
                  </span>
                  <svg
                    className="h-3.5 w-3.5 text-[#e3b8ff]/50 group-hover:text-red-400 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Available assets */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#e3b8ff]" />
            </div>
          ) : unselectedSymbols.length === 0 && selectedSymbols.length > 0 ? (
            <div className="py-12 text-center text-white/40">
              All assets selected
            </div>
          ) : unselectedSymbols.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-white/40 mb-2">No assets found</p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-sm text-[#e3b8ff]/60 hover:text-[#e3b8ff]"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              {unselectedSymbols.map((symbol, i) => (
                <button
                  key={symbol}
                  onClick={() => addSymbol(symbol)}
                  className={`
                    w-full flex items-center gap-4 px-4 py-3 transition-all
                    ${i !== 0 ? "border-t border-white/[0.04]" : ""}
                    hover:bg-white/[0.04] active:bg-white/[0.06]
                  `}
                >
                  <CoinIcon symbol={symbol} size={36} />
                  <span className="text-sm font-medium text-white/80">{symbol}</span>
                  <svg
                    className="ml-auto h-5 w-5 text-white/20"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Continue */}
      <button
        onClick={() => setStep(step + 1)}
        disabled={selectedSymbols.length === 0}
        className={`
          mt-6 w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-base font-semibold transition-all
          ${selectedSymbols.length > 0
            ? "bg-[#e3b8ff] text-black hover:bg-[#d4a8ff] active:scale-[0.99]"
            : "bg-white/[0.04] text-white/30 cursor-not-allowed"
          }
        `}
      >
        {selectedSymbols.length === 0 ? (
          "Select assets to continue"
        ) : (
          <>
            Continue
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}