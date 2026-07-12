"use client";

import { useEffect, useRef, useState } from "react";
import { WifiOff, RotateCw } from "lucide-react";
import {
  buildMarker,
  TP_TRS,
  TP_SEARCH_URL,
  SHOW_HOTELS,
  COLOR_PRIMARY,
  COLOR_ACCENT,
  LOCALE,
  CURRENCY,
} from "@/lib/config";
import { t } from "@/lib/i18n";

// Travelpayouts "Flights Search Form" widget.
// - `shmarker` is injected dynamically (buildMarker) so every kiosk carries the
//   shop ref: each booking is traced back to the shop that generated it.
// - "plain" version (no Aviasales banner/logo, no "Powered by").
// - Colours come from config (defaults match the app theme).
const WIDGET_ENDPOINT = "https://tpwidg.com/content";

// promo_id / campaign_id identify the *type* of widget (Flights Search Form)
// generated in Travelpayouts — they are the same for everyone and are not
// account-specific, so they stay as constants.
const WIDGET_TYPE = { promo_id: "7879", campaign_id: "100" };

const WIDGET_PARAMS = {
  currency: CURRENCY,
  trs: TP_TRS,
  show_hotels: SHOW_HOTELS,
  powered_by: "false",
  locale: LOCALE,
  primary_override: COLOR_PRIMARY,
  color_button: COLOR_PRIMARY,
  color_icons: COLOR_PRIMARY,
  dark: "#262626",
  light: "#FFFFFF",
  secondary: "#FFFFFF",
  special: "#C4C4C4",
  color_focused: COLOR_ACCENT,
  border_radius: "8",
  no_labels: "",
  plain: "true",
  ...WIDGET_TYPE,
  // Only set searchUrl when a results host is configured; otherwise the widget
  // opens the Travelpayouts/Aviasales default results page (still tracked).
  ...(TP_SEARCH_URL ? { searchUrl: TP_SEARCH_URL } : {}),
};

// If the widget hasn't rendered within this delay, assume the service is
// unavailable (flaky in-store wifi) and show the fallback.
const LOAD_TIMEOUT_MS = 8000;

/**
 * Loads the Travelpayouts flight-search widget, injecting the `shmarker`
 * derived from the shop ref. Shows a skeleton while it loads and a fallback
 * message if the service fails to load (no network), instead of an empty frame.
 *
 * @param {{ shopRef: string }} props
 */
export default function TravelWidget({ shopRef }) {
  const containerRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  // Bumped by "Retry" to reload the widget.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setFailed(false);
    setLoading(true);
    const marker = buildMarker(shopRef);
    container.innerHTML = "";

    // Flip out of the loading state as soon as the widget injects real DOM
    // (any non-SCRIPT node), which is more responsive than a fixed delay.
    const observer = new MutationObserver((mutations) => {
      const rendered = mutations.some((m) =>
        Array.from(m.addedNodes).some((n) => n.nodeName !== "SCRIPT")
      );
      if (rendered) {
        setLoading(false);
        observer.disconnect();
      }
    });
    observer.observe(container, { childList: true, subtree: true });

    const params = new URLSearchParams({ ...WIDGET_PARAMS, shmarker: marker });

    const script = document.createElement("script");
    script.async = true;
    script.charset = "utf-8";
    script.src = `${WIDGET_ENDPOINT}?${params.toString()}`;
    script.setAttribute("data-marker", marker);
    // Direct network failure (offline, host unreachable).
    script.onerror = () => {
      setFailed(true);
      setLoading(false);
    };
    container.appendChild(script);

    // Safety net: if nothing rendered in time, switch to the fallback message.
    const timer = setTimeout(() => {
      const rendered = Array.from(container.children).some(
        (el) => el.tagName !== "SCRIPT"
      );
      if (!rendered) {
        setFailed(true);
        setLoading(false);
      }
    }, LOAD_TIMEOUT_MS);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      container.innerHTML = "";
    };
  }, [shopRef, attempt]);

  return (
    <div className="relative w-full max-w-5xl">
      <div
        ref={containerRef}
        data-testid="travel-widget"
        className={`min-h-[220px] items-center justify-center ${
          failed ? "hidden" : "flex"
        }`}
      />

      {/* Skeleton placeholder while the third-party widget boots. */}
      {loading && !failed && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-start"
        >
          <div className="w-full animate-pulse rounded-2xl bg-white/95 p-4">
            <div className="flex flex-wrap gap-3">
              <div className="h-16 flex-1 min-w-[150px] rounded-lg bg-black/10" />
              <div className="h-16 flex-1 min-w-[150px] rounded-lg bg-black/10" />
              <div className="h-16 flex-1 min-w-[120px] rounded-lg bg-black/10" />
              <div className="h-16 flex-1 min-w-[120px] rounded-lg bg-black/10" />
              <div className="h-16 w-32 rounded-lg bg-black/20" />
            </div>
          </div>
        </div>
      )}

      {failed && (
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3 rounded-2xl bg-white/95 p-8 text-center text-flash-black">
          <WifiOff className="h-9 w-9" strokeWidth={2} />
          <p className="text-lg font-black">{t("offline.title")}</p>
          <p className="text-sm text-black/60">{t("offline.body")}</p>
          <button
            type="button"
            onClick={() => setAttempt((n) => n + 1)}
            className="mt-1 flex items-center gap-2 rounded-full bg-flash-black px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition active:scale-95"
          >
            <RotateCw className="h-4 w-4" />
            {t("offline.retry")}
          </button>
        </div>
      )}
    </div>
  );
}
