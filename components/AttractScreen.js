"use client";

import { Plane, Hand } from "lucide-react";
import { BRAND_PREFIX, BRAND_SUFFIX } from "@/lib/config";
import { t } from "@/lib/i18n";

/**
 * Full-page attract screen (kiosk idle mode). Shown on start and after an idle
 * delay. A single tap anywhere dismisses it and starts a clean session.
 *
 * @param {{ onStart: () => void }} props
 */
export default function AttractScreen({ onStart }) {
  return (
    <button
      type="button"
      onClick={onStart}
      aria-label={t("attract.cta")}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 bg-flash-black text-center"
    >
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-flash-yellow">
          <Plane className="h-9 w-9 text-flash-black" strokeWidth={2.5} />
        </span>
        <h1 className="text-6xl font-black tracking-tight md:text-7xl">
          <span className="text-white">{BRAND_PREFIX}</span>
          <span className="text-flash-yellow">{BRAND_SUFFIX}</span>
        </h1>
      </div>

      <p className="max-w-2xl text-2xl font-semibold text-white/70 md:text-3xl">
        {t("attract.subtitle")}
      </p>

      <span className="mt-4 flex animate-pulse items-center gap-3 rounded-full bg-flash-yellow px-8 py-4 text-xl font-black uppercase tracking-wide text-flash-black">
        <Hand className="h-6 w-6" />
        {t("attract.cta")}
      </span>
    </button>
  );
}
