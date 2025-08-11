import { useEffect, useState } from "react";
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

  const filteredSymbols = symbols.filter((symbol) =>
    symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedSymbols.length >= MAX_SELECTION) {
      setSelectedSymbols([]);
    } else {
      setSelectedSymbols(symbols.slice(0, MAX_SELECTION));
    }
  };

  const toggleSymbol = (symbol) => {
    const isSelected = selectedSymbols.includes(symbol);
    if (isSelected) {
      setSelectedSymbols(selectedSymbols.filter((s) => s !== symbol));
    } else if (selectedSymbols.length < MAX_SELECTION) {
      setSelectedSymbols([...selectedSymbols, symbol]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Select Assets</h2>
        <p className="text-white/60 text-sm mb-4">
          Choose up to {MAX_SELECTION} cryptocurrencies
        </p>
        <div className="text-[#e3b8ff] font-medium text-sm">
          {selectedSymbols.length}/{MAX_SELECTION} selected
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <input
          type="text"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#e3b8ff]/50 transition-colors"
          placeholder="Search cryptocurrencies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center gap-3">
        <button
          onClick={handleSelectAll}
          className="px-6 py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 rounded-lg transition-colors"
        >
          {selectedSymbols.length >= MAX_SELECTION ? "Clear All" : "Top 10"}
        </button>
      </div>

      {/* Assets Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#e3b8ff]/30 border-t-[#e3b8ff] rounded-full animate-spin mx-auto"></div>
            <p className="text-white/60 text-sm">Loading assets...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 rounded-xl border border-white/10 p-4">
          <div className="max-h-80 overflow-y-auto">
            <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-3">
              {filteredSymbols.length > 0 ? (
                filteredSymbols.map((symbol) => {
                  const isSelected = selectedSymbols.includes(symbol);
                  const isAtLimit =
                    !isSelected && selectedSymbols.length >= MAX_SELECTION;

                  return (
                    <div
                      key={symbol}
                      onClick={() => !isAtLimit && toggleSymbol(symbol)}
                      className={`
                        relative cursor-pointer rounded-lg p-3 transition-all duration-200
                        ${
                          isSelected
                            ? "bg-[#e3b8ff]/20 border border-[#e3b8ff]/40"
                            : "bg-white/5 border border-white/10 hover:bg-white/10"
                        }
                        ${isAtLimit ? "opacity-30 cursor-not-allowed" : ""}
                      `}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-white/10">
                          <Image
                            width={24}
                            height={24}
                            src={`/assets/${symbol.toLowerCase()}.png`}
                            alt={symbol}
                            className="w-6 h-6"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                          <div className="hidden w-6 h-6 bg-[#e3b8ff]/30 rounded text-[#e3b8ff] text-xs font-bold flex items-center justify-center">
                            {symbol.charAt(0)}
                          </div>
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            isSelected ? "text-[#e3b8ff]" : "text-white/80"
                          }`}
                        >
                          {symbol}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-white/40 text-sm">No assets found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Selected Summary */}
      {selectedSymbols.length > 0 && (
        <div className="bg-white/5 rounded-xl border border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium text-sm">
                Selected Assets
              </h3>
              <p className="text-white/60 text-xs">
                {selectedSymbols.length} cryptocurrencies
              </p>
            </div>
            <div className="flex flex-wrap gap-1 max-w-xs">
              {selectedSymbols.slice(0, 5).map((symbol) => (
                <span
                  key={symbol}
                  className="px-2 py-1 bg-[#e3b8ff]/20 text-[#e3b8ff] text-xs rounded border border-[#e3b8ff]/30"
                >
                  {symbol}
                </span>
              ))}
              {selectedSymbols.length > 5 && (
                <span className="px-2 py-1 bg-white/10 text-white/60 text-xs rounded">
                  +{selectedSymbols.length - 5}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Continue Button */}
      {selectedSymbols.length > 0 && (
        <div className="text-center pt-2">
          <button
            onClick={() => setStep(step + 1)}
            className="px-8 py-3 bg-gradient-to-r from-[#e3b8ff] to-[#6a2e8e] text-black font-medium rounded-lg hover:scale-105 transition-transform"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
