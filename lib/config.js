import { resolveIdleTimeout } from "./resolveIdleTimeout.js";

// Central configuration — everything is driven by environment variables so you
// can fork this repo, set your own Travelpayouts IDs and brand, and deploy
// without editing any code. See `.env.example` for the full list.

// ── Travelpayouts ──────────────────────────────────────────────────────────
// Your partner marker (a.k.a. Partner ID). The default "000000" is an obvious
// placeholder: with it, the widget still renders but bookings are NOT
// attributed — so a fork that forgets to set it never credits someone else.
export const TRAVELPAYOUTS_MARKER =
  process.env.NEXT_PUBLIC_TRAVELPAYOUTS_MARKER || "000000";

// Tracking source id of the search widget you generated in Travelpayouts.
export const TP_TRS = process.env.NEXT_PUBLIC_TP_TRS || "";

// Optional Travelpayouts "Drive" domain-verification / tracking script URL.
// Left empty → the script is simply not injected.
export const TP_DRIVE_SRC = process.env.NEXT_PUBLIC_TP_DRIVE_SRC || "";

// Optional: host (no protocol) where the widget opens its results — e.g. your
// White Label domain "flights.example.com". Empty → results open on the
// Travelpayouts / Aviasales default page (still tracked by your marker).
export const TP_SEARCH_URL = process.env.NEXT_PUBLIC_TP_SEARCH_URL || "";

// Show the "also search hotels" checkbox inside the flight widget. Off by
// default: it opens an extra hotels (Booking) results tab, which we'd rather
// handle with a dedicated hotel search than an in-form checkbox.
export const SHOW_HOTELS = process.env.NEXT_PUBLIC_SHOW_HOTELS || "false";

// ── Brand ──────────────────────────────────────────────────────────────────
// The name is rendered in two tones: PREFIX (foreground) + SUFFIX (accent).
export const BRAND_PREFIX = process.env.NEXT_PUBLIC_BRAND_PREFIX || "Flight";
export const BRAND_SUFFIX = process.env.NEXT_PUBLIC_BRAND_SUFFIX || "Kiosk";
export const BRAND_NAME = `${BRAND_PREFIX}${BRAND_SUFFIX}`;

// Brand colours for the Travelpayouts widget. To also restyle the app chrome,
// edit the matching values in `app/globals.css` (Tailwind v4 @theme is static).
export const COLOR_PRIMARY = process.env.NEXT_PUBLIC_COLOR_PRIMARY || "#0A0A0A";
export const COLOR_ACCENT = process.env.NEXT_PUBLIC_COLOR_ACCENT || "#FFE800";

// ── Behaviour ──────────────────────────────────────────────────────────────
// Shop reference used when no ?ref= is present in the URL.
export const DEFAULT_REF = "direct";

// Canonical production URL for the "continue on mobile" QR code. Falls back to
// the current origin if unset (so previews still produce a working QR).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

// Optional full URL for the "Popular flights" button. Hidden if empty.
export const RESULTS_URL = process.env.NEXT_PUBLIC_RESULTS_URL || "";

export const LOCALE = process.env.NEXT_PUBLIC_LOCALE || "en";
export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY || "usd";

// localStorage key persisting the shop ref across a kiosk reload.
export const REF_STORAGE_KEY = "flightkiosk:ref";

// Idle delay before the kiosk resets to the attract screen (ms).
export const IDLE_TIMEOUT_MS = resolveIdleTimeout(
  process.env.NEXT_PUBLIC_IDLE_TIMEOUT_MS
);

/**
 * Normalise a raw `?ref=` value into a safe shop slug:
 * lowercase, non-alphanumerics collapsed to single dashes, trimmed, capped.
 * Crucially strips dots — a dot would collide with the `MARKER.ref` separator
 * of the Travelpayouts sub-marker and corrupt attribution.
 *
 * @param {string} raw
 * @returns {string} a slug, or DEFAULT_REF if nothing usable remains
 */
export function sanitizeRef(raw) {
  const slug = String(raw ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
  return slug || DEFAULT_REF;
}

/**
 * Build the Travelpayouts marker from the base marker and the shop ref.
 * Format: <marker>.<shop> — lets you trace which shop generated each booking.
 */
export function buildMarker(ref) {
  return `${TRAVELPAYOUTS_MARKER}.${sanitizeRef(ref)}`;
}

// Dev-only nudge when the affiliate config is incomplete: with the placeholder
// marker or an empty tracking source, the widget loads but bookings aren't
// attributed. Silent in production so it never reaches shoppers.
if (
  process.env.NODE_ENV !== "production" &&
  typeof window !== "undefined" &&
  (TRAVELPAYOUTS_MARKER === "000000" || !TP_TRS)
) {
  console.warn(
    "[flight-kiosk] Travelpayouts config incomplete: set " +
      "NEXT_PUBLIC_TRAVELPAYOUTS_MARKER and NEXT_PUBLIC_TP_TRS to attribute bookings."
  );
}
