import Script from "next/script";
import "./globals.css";
import { BRAND_NAME, TP_DRIVE_SRC, LOCALE } from "@/lib/config";

export const metadata = {
  title: BRAND_NAME,
  description: "Self-service flight booking kiosk",
};

// Lock the viewport for tablet kiosk use (no user zoom).
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0A0A0A",
};

export default function RootLayout({ children }) {
  return (
    <html lang={LOCALE}>
      <body>{children}</body>
      {/* Optional Travelpayouts "Drive" script (domain verification + tracking).
          Runs on every page: `beforeInteractive` preloads it in the initial
          server <head> and runs it before hydration. Injected only when
          NEXT_PUBLIC_TP_DRIVE_SRC is set. */}
      {TP_DRIVE_SRC && (
        <Script id="tp-drive" src={TP_DRIVE_SRC} strategy="beforeInteractive" />
      )}
    </html>
  );
}
