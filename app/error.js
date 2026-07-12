"use client";

import { useEffect } from "react";
import { RotateCw } from "lucide-react";
import { t } from "@/lib/i18n";

/**
 * Route-level error boundary. On a kiosk there's nobody to click "reload", so
 * besides a big tap-to-restart target we auto-recover after a short delay.
 */
export default function Error({ error, reset }) {
  useEffect(() => {
    // Auto-recover so an unattended kiosk heals itself.
    const timer = setTimeout(() => reset(), 10000);
    return () => clearTimeout(timer);
  }, [reset]);

  return (
    <button
      type="button"
      onClick={() => reset()}
      aria-label={t("error.cta")}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-flash-black text-center"
    >
      <h1 className="text-4xl font-black tracking-tight md:text-5xl">
        <span className="text-white">{t("error.title")}</span>
      </h1>
      <span className="flex animate-pulse items-center gap-3 rounded-full bg-flash-yellow px-8 py-4 text-xl font-black uppercase tracking-wide text-flash-black">
        <RotateCw className="h-6 w-6" />
        {t("error.cta")}
      </span>
    </button>
  );
}
