"use client";

import { useCallback, useState } from "react";
import { Plane, MapPin, Sparkles } from "lucide-react";
import { useShopRef } from "@/lib/useShopRef";
import { useIdleTimer } from "@/lib/useIdleTimer";
import { useWakeLock } from "@/lib/useWakeLock";
import {
  DEFAULT_REF,
  IDLE_TIMEOUT_MS,
  BRAND_PREFIX,
  BRAND_SUFFIX,
  BRAND_NAME,
  RESULTS_URL,
} from "@/lib/config";
import { t } from "@/lib/i18n";
import TravelWidget from "./TravelWidget";
import KioskQR from "./KioskQR";
import AttractScreen from "./AttractScreen";

/**
 * Full-page kiosk screen. Orchestrates:
 *  - reading the shop ref (tracking),
 *  - the marked Travelpayouts widget,
 *  - the mobile-continuity QR code,
 *  - the attract screen + idle reset between two customers.
 */
export default function KioskScreen() {
  const shopRef = useShopRef();
  const isTracked = shopRef && shopRef !== DEFAULT_REF;

  // Attract screen shown on start and after inactivity.
  const [attract, setAttract] = useState(true);
  // Changes on each reset to remount the widget (clean session).
  const [sessionKey, setSessionKey] = useState(0);

  // Keep the screen awake for the life of the kiosk page (no-op if unsupported).
  useWakeLock();

  const resetKiosk = useCallback(() => {
    setSessionKey((k) => k + 1);
    setAttract(true);
  }, []);

  // Back to attract + purge the previous search after inactivity.
  // Disabled while the attract screen is shown (nothing to reset).
  useIdleTimer(IDLE_TIMEOUT_MS, resetKiosk, !attract);

  if (attract) {
    return <AttractScreen onStart={() => setAttract(false)} />;
  }

  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-flash-black">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b-4 border-flash-yellow px-8 py-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-flash-yellow">
            <Plane className="h-6 w-6 text-flash-black" strokeWidth={2.5} />
          </span>
          <h1 className="text-3xl font-black tracking-tight">
            <span className="text-white">{BRAND_PREFIX}</span>
            <span className="text-flash-yellow">{BRAND_SUFFIX}</span>
          </h1>
        </div>

        {isTracked && (
          <span className="flex items-center gap-2 rounded-full bg-flash-yellow/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-flash-yellow">
            <MapPin className="h-4 w-4" />
            {shopRef}
          </span>
        )}
      </header>

      {/* Body: widget + continuity QR. Internally scrollable so the widget is
          never clipped on small screens (hotels checkbox / Search button).
          The kiosk tablet has room, a phone can scroll. */}
      <section className="flex min-h-0 flex-1 flex-col items-center justify-start gap-8 overflow-y-auto px-4 py-6 lg:flex-row lg:justify-center lg:gap-12 lg:px-8">
        <div className="flex w-full max-w-4xl flex-col items-center gap-5">
          <div className="text-center">
            <h2 className="text-3xl font-black leading-tight md:text-5xl">
              {t("main.heading")}
              <span className="text-flash-yellow"> {t("main.headingAccent")}</span>
            </h2>
            <p className="mt-2 hidden text-base text-white/60 sm:block md:mt-3 md:text-lg">
              {t("main.subtitle")}
            </p>
          </div>

          <TravelWidget key={sessionKey} shopRef={shopRef} />

          {/* Popular flights: opens the results page, carrying the shop as
              sub_id for tracking. Same-tab on purpose — new tabs trap the
              customer and are blocked by kiosk browsers; the results page
              (RESULTS_URL) should offer a way back. Hidden if not configured. */}
          {RESULTS_URL && (
            <a
              href={`${RESULTS_URL}${
                RESULTS_URL.includes("?") ? "&" : "?"
              }sub_id=${encodeURIComponent(shopRef || DEFAULT_REF)}`}
              className="flex items-center gap-2 rounded-full bg-flash-yellow px-6 py-3 text-sm font-black uppercase tracking-wide text-flash-black transition active:scale-95 md:text-base"
            >
              <Sparkles className="h-5 w-5" strokeWidth={2.5} />
              {t("popular.flights")}
            </a>
          )}
        </div>

        <aside className="hidden shrink-0 flex-col items-center gap-4 sm:flex">
          <KioskQR shopRef={shopRef} />
        </aside>
      </section>

      {/* Minimal footer */}
      <footer className="shrink-0 px-8 py-4 text-center text-xs uppercase tracking-widest text-white/30">
        {BRAND_NAME} · {t("footer.tagline")}
      </footer>
    </main>
  );
}
