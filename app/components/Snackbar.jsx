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
      }, 2600); // shorter, crisp
      return () => clearTimeout(t);
    }
  }, [data, onClose]);

  // Cryphos palette
  const buyAccent = "#6366f1"; // Indigo
  const sellAccent = "#ec4899"; // Pink
  const successAccent = "#10b981"; // Emerald
  const neutralAccent = "#b48efc"; // Lilac

  const accent =
    data?.side === "buy"
      ? buyAccent
      : data?.side === "sell"
      ? sellAccent
      : data?.status
      ? successAccent
      : neutralAccent;

  const message =
    data?.info ??
    (data?.side
      ? `${data.side === "buy" ? "Bought" : "Sold"} ${data.amount} ${data.symbol} @ ${data.price}`
      : "Operation completed");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 24, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 24, opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="fixed bottom-7 right-7 z-50 w-[320px]"
        >
          <div className="relative overflow-hidden rounded-xl border border-white/10 shadow-lg backdrop-blur-md bg-[#121216]/80">
            {/* Accent bar (subtle, 2px) */}
            <motion.div
              className="h-[2px] w-full"
              style={{ backgroundColor: accent }}
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 2.4, ease: "linear" }}
              transformOrigin="left"
            />

            {/* Content */}
            <div className="flex items-center gap-3 px-4 py-3.5">
              <span
                className="flex-shrink-0 w-2 h-2 rounded-full"
                style={{ backgroundColor: accent }}
              />

              <div className="flex-1">
                <p className="text-white text-sm font-medium tracking-tight leading-snug">
                  {message}
                </p>
              </div>

              {/* Close button (super minimal) */}
              <button
                onClick={() => setVisible(false)}
                className="flex-shrink-0 p-1 rounded hover:bg-white/5 transition"
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
