import { BRAND_NAME, COLOR_PRIMARY, COLOR_ACCENT } from "@/lib/config";

// Dynamic web app manifest (served at /manifest.webmanifest) — reads the brand
// from env so a fork's installed/standalone kiosk shows its own name and colours.
export default function manifest() {
  return {
    name: BRAND_NAME,
    short_name: BRAND_NAME,
    description: "Self-service flight booking kiosk",
    start_url: "/",
    display: "standalone",
    orientation: "any",
    background_color: COLOR_PRIMARY,
    theme_color: COLOR_ACCENT,
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
