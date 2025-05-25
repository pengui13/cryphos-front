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

  // pastel accents
  const buyAccent = "#5CE1E6";
  const sellAccent = "#FF8C94";
  const accent = data?.side === "buy" || data?.status ? buyAccent : sellAccent;

  // title & message
  const title = data?.side
    ? `${data.side.charAt(0).toUpperCase() + data.side.slice(1)} ${
        data.symbol
      }/USDT`
    : data?.status
    ? "Success"
    : "Failure";
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
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50 w-80 bg-[#1B1F23] border border-[#2E3136] rounded-full overflow-hidden shadow-lg"
        >
          {/* progress bar */}
          <motion.div
            className="h-1 w-full"
            style={{ backgroundColor: accent }}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 2.4, ease: "linear" }}
            transformOrigin="left"
          />

          <div className="flex items-center gap-3 px-4 py-3">
            {/* status dot */}
            <span
              className="flex-shrink-0 w-3 h-3 rounded-full"
              style={{ backgroundColor: accent }}
            />

            {/* text */}
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{title}</p>
              <p className="text-xs text-gray-400">{message}</p>
            </div>

            {/* close button */}
            <button
              onClick={() => setVisible(false)}
              className="flex-shrink-0 p-1 rounded-full hover:bg-[#2E3136]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-gray-400"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
