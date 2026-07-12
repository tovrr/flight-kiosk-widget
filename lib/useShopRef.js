"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DEFAULT_REF, REF_STORAGE_KEY, sanitizeRef } from "./config";

/**
 * Reads the `?ref=shop_name` URL parameter, persists it, and returns it.
 *
 * The `?ref=` tracking is the core of the affiliate model: this hook
 * centralises how it is read. Priority: URL param > persisted value > DEFAULT_REF.
 */
export function useShopRef() {
  const searchParams = useSearchParams();
  const [ref, setRef] = useState(DEFAULT_REF);

  useEffect(() => {
    const urlRef = searchParams.get("ref");

    if (urlRef && urlRef.trim()) {
      const clean = sanitizeRef(urlRef);
      // SSR-safe: start from DEFAULT_REF and sync the real ref post-hydration.
      // Reading the URL/localStorage during render would risk a hydration
      // mismatch, so the setState-in-effect here is intentional.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRef(clean);
      try {
        window.localStorage.setItem(REF_STORAGE_KEY, clean);
      } catch {
        // storage unavailable (private mode): keep the ref in memory only
      }
      return;
    }

    // No ?ref= in the URL: try to restore the last known shop.
    try {
      const stored = window.localStorage.getItem(REF_STORAGE_KEY);
      if (stored) setRef(sanitizeRef(stored));
    } catch {
      // ignore
    }
  }, [searchParams]);

  return ref;
}
