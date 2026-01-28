"use client";

import React, { createContext, useContext } from "react";

const PingContext = createContext(false);
export const usePing = () => useContext(PingContext);
export const PingProvider = ({ value, children }) => (
  <PingContext.Provider value={value}>{children}</PingContext.Provider>
);

const LoadingContext = createContext(null);
export const useLoading = () => {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used within LoadingProvider");
  return ctx;
};
export const LoadingProvider = ({ value, children }) => (
  <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
);
