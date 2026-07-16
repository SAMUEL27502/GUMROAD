"use client";

import { useEffect } from "react";

/** Registers the TradeBib service worker for PWA install / offline shell. */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* ignore registration errors in unsupported browsers */
    });
  }, []);

  return null;
}
