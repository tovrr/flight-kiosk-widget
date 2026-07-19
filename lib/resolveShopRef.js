import { DEFAULT_REF, sanitizeRef } from "./config";

/**
 * Pure resolution of the shop ref from its two possible sources — the single
 * source of truth for the `?ref=` tracking decision, so it can be unit-tested
 * without a React renderer.
 *
 * Priority: URL `?ref=` > persisted value > DEFAULT_REF. Both sources are
 * sanitised. `persist` tells the caller whether the value should be (re)written
 * to storage (only a fresh URL ref is persisted).
 *
 * @param {{ urlRef?: string|null, storedRef?: string|null }} sources
 * @returns {{ ref: string, persist: boolean }}
 */
export function resolveShopRef({ urlRef, storedRef } = {}) {
  if (urlRef && String(urlRef).trim()) {
    return { ref: sanitizeRef(urlRef), persist: true };
  }
  if (storedRef && String(storedRef).trim()) {
    return { ref: sanitizeRef(storedRef), persist: false };
  }
  return { ref: DEFAULT_REF, persist: false };
}
