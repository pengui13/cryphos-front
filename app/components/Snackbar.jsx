"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SleekSnackbar({ data, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (data?.visible) {
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, 2400);
      return () => clearTimeout(t);
    }
  }, [data, onClose]);

  // Minimalistic professional colors
  const buyAccent = "#6366f1"; // Indigo
  const sellAccent = "#ec4899"; // Pink
  const successAccent = "#10b981"; // Emerald
  const neutralAccent = "#8b5cf6"; // Purple - matching your theme

  const accent =
    data?.side === "buy"
      ? buyAccent
      : data?.side === "sell"
      ? sellAccent
      : data?.status
      ? successAccent
      : neutralAccent;

  // title & message
  const title = data?.side
    ? `${data.side.charAt(0).toUpperCase() + data.side.slice(1)} ${
        data.symbol
      }/USDT`
    : data?.status
    ? "Success"
    : null; // No title for generic notifications

  const message =
    data?.info ??
    (data?.side
      ? `Price: ${data.price} · Amount: ${data.amount}`
      : "Operation completed");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
          className="fixed bottom-6 right-6 z-50 w-80"
        >
          <div className="bg-[#1a0d2e] border border-[#2d1b4e]/50 rounded-lg overflow-hidden shadow-lg backdrop-blur-sm">
            {/* Clean progress bar */}
            <motion.div
              className="h-0.5 w-full"
              style={{ backgroundColor: accent }}
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 2.4, ease: "linear" }}
              transformOrigin="left"
            />

            <div className="flex items-center gap-3 px-4 py-3.5">
              <span
                className="flex-shrink-0 w-2 h-2 rounded-full"
                style={{ backgroundColor: accent }}
              />

              <div className="flex-1">
                <p className=" text-white font-medium mt-0.5">{message}</p>
              </div>

              <button
                onClick={() => setVisible(false)}
                className="flex-shrink-0 p-1.5 rounded-md hover:bg-white/5 transition-colors duration-150"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5 text-white/50 hover:text-white/80"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
