"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Smartphone } from "lucide-react";
import { DEFAULT_REF, SITE_URL } from "@/lib/config";

/**
 * QR code pointing at the canonical production URL (SITE_URL) while preserving
 * the shop `?ref=`, so the customer can continue booking on their phone without
 * breaking tracking — and without encoding a throwaway preview URL.
 * Falls back to the current origin when SITE_URL is unset.
 *
 * @param {{ shopRef: string }} props
 */
export default function KioskQR({ shopRef }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    // Canonical (prod) base if defined, otherwise the current kiosk origin.
    const base = SITE_URL || window.location.origin;
    const target = new URL(base);
    target.pathname = "/";
    target.searchParams.set("ref", shopRef || DEFAULT_REF);
    setUrl(target.toString());
  }, [shopRef]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-xl bg-white p-3">
        {url ? (
          <QRCode value={url} size={140} level="M" />
        ) : (
          <div className="h-[140px] w-[140px]" />
        )}
      </div>
      <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-flash-yellow">
        <Smartphone className="h-4 w-4" />
        Continue on mobile
      </p>
    </div>
  );
}
