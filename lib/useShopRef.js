"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DEFAULT_REF, REF_STORAGE_KEY } from "./config";
import { resolveShopRef } from "./resolveShopRef";

/**
 * Reads the `?ref=shop_name` URL parameter, persists it, and returns it.
 *
 * The `?ref=` tracking is the core of the affiliate model: this hook
 * centralises how it is read. The decision (URL param > persisted value >
 * DEFAULT_REF) lives in the pure `resolveShopRef` helper so it can be tested.
 */
export function useShopRef() {
  const searchParams = useSearchParams();
  const [ref, setRef] = useState(DEFAULT_REF);

  useEffect(() => {
    const urlRef = searchParams.get("ref");

    let storedRef = null;
    try {
      storedRef = window.localStorage.getItem(REF_STORAGE_KEY);
    } catch {
      // storage unavailable (private mode): fall back to URL / default
    }

    const { ref: resolved, persist } = resolveShopRef({ urlRef, storedRef });

    // SSR-safe: start from DEFAULT_REF and sync the real ref post-hydration.
    // Reading the URL/localStorage during render would risk a hydration
    // mismatch, so the setState-in-effect here is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRef(resolved);

    if (persist) {
      try {
        window.localStorage.setItem(REF_STORAGE_KEY, resolved);
      } catch {
        // storage unavailable: keep the ref in memory only
      }
    }
  }, [searchParams]);

  return ref;
}
