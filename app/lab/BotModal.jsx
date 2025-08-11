import Modal from "react-modal";
import Link from "next/link";
import { useState } from "react";

export default function BotModal({ open, opened }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  return (
    <div>
      <Modal
        isOpen={opened}
        onRequestClose={() => open(false)}
        className="max-w-xl w-full mx-4 outline-none"
        overlayClassName="fixed inset-0 bg-black/90 backdrop-blur-md flex justify-center items-center z-[10004] p-4"
      >
        {/* Modal Content */}
        <div className="relative bg-gradient-to-br from-[#13042c]/95 to-black/95 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
          {/* Main Content */}
          <div className="relative p-8 space-y-6">
            {/* Success Header */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#e3b8ff] to-[#6a2e8e] rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl">🤖</span>
              </div>

              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#e3b8ff] to-[#6a2e8e] bg-clip-text text-transparent mb-2">
                  Bot Created Successfully!
                </h2>
                <p className="text-white/70 text-sm">
                  Your RSI trading bot is ready to start analyzing markets
                </p>
              </div>
            </div>

            {/* Connection Steps */}
            <div className="bg-[#13042c]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>📱</span>
                Connect to Telegram
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#e3b8ff]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#e3b8ff] text-sm font-bold">1</span>
                  </div>
                  <span className="text-white/80 text-sm">
                    Search for our bot on Telegram
                  </span>
                </div>

                {/* Bot Username */}
                <div className="ml-9 bg-[#e3b8ff]/10 border border-[#e3b8ff]/30 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#e3b8ff] font-mono font-bold">
                      @cryphos_bot
                    </span>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText("@cryphos_bot")
                      }
                      className="px-3 py-1 bg-[#e3b8ff]/20 hover:bg-[#e3b8ff]/30 border border-[#e3b8ff]/40 text-[#e3b8ff] text-xs font-medium rounded transition-all"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#e3b8ff]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#e3b8ff] text-sm font-bold">2</span>
                  </div>
                  <span className="text-white/80 text-sm">
                    Start a conversation
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#e3b8ff]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#e3b8ff] text-sm font-bold">3</span>
                  </div>
                  <span className="text-white/80 text-sm">
                    Send{" "}
                    <code className="bg-[#6a2e8e]/20 text-[#e3b8ff] px-2 py-1 rounded font-mono text-xs">
                      /start
                    </code>{" "}
                    command
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#e3b8ff]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#e3b8ff] text-sm font-bold">4</span>
                  </div>
                  <span className="text-white/80 text-sm">
                    Verify account and receive signals
                  </span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-[#13042c]/40 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📊</span>
                  <div>
                    <h4 className="font-semibold text-white text-sm">
                      Real-time Signals
                    </h4>
                    <p className="text-white/60 text-xs">
                      Instant trading alerts
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#13042c]/40 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg">⚡</span>
                  <div>
                    <h4 className="font-semibold text-white text-sm">
                      24/7 Analysis
                    </h4>
                    <p className="text-white/60 text-xs">Never miss moves</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() =>
                  window.open("https://t.me/cryphos_bot", "_blank")
                }
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#e3b8ff] to-[#6a2e8e] text-black font-semibold rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                <span>📱</span>
                <span>Open Telegram Bot</span>
              </button>

              <button
                onClick={() => open(false)}
                className="px-6 py-3 bg-[#13042c]/50 border border-white/20 text-white font-medium rounded-xl hover:bg-[#13042c]/70 transition-colors"
              >
                Continue Later
              </button>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => open(false)}
            className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </Modal>
    </div>
  );
}
