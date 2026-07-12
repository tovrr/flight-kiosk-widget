"use client";

import { useEffect } from "react";

/**
 * Registers the kiosk service worker in production only (avoids dev caching
 * surprises). Silent and non-blocking — a failure never affects the kiosk.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

    // The effect already runs after hydration (page loaded), so register now —
    // waiting on a `load` event that has usually already fired would no-op.
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  return null;
}
