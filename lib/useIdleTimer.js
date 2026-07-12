"use client";

import { useEffect, useRef } from "react";

const ACTIVITY_EVENTS = [
  "pointerdown",
  "touchstart",
  "mousedown",
  "keydown",
  "wheel",
];

/**
 * Fires `onIdle` after `timeoutMs` with no user interaction. Every interaction
 * (tap, click, key, scroll) re-arms the timer.
 *
 * Kiosk use: reset the screen between two customers.
 *
 * @param {number} timeoutMs Idle delay in milliseconds.
 * @param {() => void} onIdle Callback run on expiry.
 * @param {boolean} [enabled=true] Disable the timer if false.
 */
export function useIdleTimer(timeoutMs, onIdle, enabled = true) {
  const onIdleRef = useRef(onIdle);
  onIdleRef.current = onIdle;

  useEffect(() => {
    if (!enabled) return;

    let timer;
    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(() => onIdleRef.current?.(), timeoutMs);
    };

    for (const evt of ACTIVITY_EVENTS) {
      window.addEventListener(evt, arm, { passive: true });
    }
    arm();

    return () => {
      clearTimeout(timer);
      for (const evt of ACTIVITY_EVENTS) {
        window.removeEventListener(evt, arm);
      }
    };
  }, [timeoutMs, enabled]);
}
