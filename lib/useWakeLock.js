"use client";

import { useEffect } from "react";

/**
 * Keeps the kiosk screen awake using the Screen Wake Lock API.
 * Re-acquires the lock when the tab becomes visible again (the browser releases
 * it on tab switch / device sleep). No-op and silent where unsupported — it must
 * never break the kiosk.
 *
 * @param {boolean} [enabled=true]
 */
export function useWakeLock(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    if (typeof navigator === "undefined" || !("wakeLock" in navigator)) return;

    let sentinel = null;
    let released = false;

    const acquire = async () => {
      try {
        sentinel = await navigator.wakeLock.request("screen");
      } catch {
        // denied / unsupported / not visible — ignore, the kiosk still works
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible" && !released) acquire();
    };

    acquire();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      released = true;
      document.removeEventListener("visibilitychange", onVisibility);
      sentinel?.release?.().catch(() => {});
    };
  }, [enabled]);
}
