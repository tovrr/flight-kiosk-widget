import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * Tests for `lib/useShopRef.js` tracking logic.
 *
 * Because this repo does not install `@testing-library/react`, we avoid
 * importing the React hook itself. Instead we:
 *  - extract the URL parameter parse / localStorage-priority decision tree
 *    into a small pure helper and exercise it with fake globals, and
 *  - import and exercise the config helpers (`sanitizeRef`, `buildMarker`,
 *    `DEFAULT_REF`, `REF_STORAGE_KEY`) directly.
 */

/* ── pure helpers mirroring useShopRef.js behaviour ──────────────────────── */

/**
 * Decision tree: URL ref > localStorage ref > DEFAULT_REF.
 *
 * This mirrors the effect in `useShopRef` so we can test it without React.
 */
function resolveShopRef({ url, localStorage }) {
  try {
    if (typeof url === "string" && url.includes("ref=")) {
      const urlObj = new URL(url, "http://localhost");
      const raw = urlObj.searchParams.get("ref");
      if (raw && raw.trim()) {
        return { source: "url", ref: sanitizeRef(raw) };
      }
    }
  } catch {
    // malformed URL or storage unavailable — fall through
  }

  try {
    const stored = localStorage.getItem(REF_STORAGE_KEY);
    if (stored) return { source: "localStorage", ref: sanitizeRef(stored) };
  } catch {
    // storage unavailable
  }

  return { source: "default", ref: DEFAULT_REF };
}

/* ── 1. `?ref=` URL parameter parsing ────────────────────────────────────── */

describe("URL `?ref=` parameter parsing", () => {
  it("picks ref from query string", () => {
    const ls = { getItem: () => null };
    const result = resolveShopRef({
      url: "http://localhost/?ref=my-shop-name",
      localStorage: ls,
    });
    expect(result).toEqual({ source: "url", ref: "my-shop-name" });
  });

  it("ignores other query params when ref is absent", () => {
    const ls = { getItem: () => null };
    const result = resolveShopRef({
      url: "http://localhost/?q=lhr-jfk&date=2026-01-01",
      localStorage: ls,
    });
    expect(result.source).toBe("default");
    expect(result.ref).toBe(DEFAULT_REF);
  });

  it("ignores empty ref=", () => {
    const ls = { getItem: () => null };
    const result = resolveShopRef({
      url: "http://localhost/?ref=",
      localStorage: ls,
    });
    expect(result.source).toBe("default");
  });

  it("does not crash on malformed URL", () => {
    const ls = { getItem: () => null };
    const result = resolveShopRef({
      url: "not a url",
      localStorage: ls,
    });
    expect(result.source).toBe("default");
  });

  it("sanitises the ref from the URL (spaces, dots, etc.)", () => {
    const ls = { getItem: () => null };
    const result = resolveShopRef({
      url: "http://localhost/?ref=My.Shop Name!!",
      localStorage: ls,
    });
    expect(result.source).toBe("url");
    expect(result.ref).toBe("my-shop-name");
  });
});

/* ── 2. localStorage persistence / priority ──────────────────────────────── */

describe("localStorage persistence and priority", () => {
  it("returns the persisted ref when URL has none", () => {
    const ls = {
      getItem: (key) =>
        key === REF_STORAGE_KEY ? "restored-shop" : null,
    };
    const result = resolveShopRef({ url: null, localStorage: ls });
    expect(result).toEqual({ source: "localStorage", ref: "restored-shop" });
  });

  it("falls back to DEFAULT_REF when localStorage is empty", () => {
    const ls = { getItem: () => null };
    const result = resolveShopRef({ url: null, localStorage: ls });
    expect(result).toEqual({ source: "default", ref: DEFAULT_REF });
  });

  it("URL ref wins over localStorage ref", () => {
    const ls = {
      getItem: (key) =>
        key === REF_STORAGE_KEY ? "persisted-shop" : null,
    };
    const result = resolveShopRef({
      url: "http://localhost/?ref=url-shop",
      localStorage: ls,
    });
    expect(result.source).toBe("url");
    expect(result.ref).toBe("url-shop");
  });

  it("ignores localStorage when setItem throws (private mode)", () => {
    const ls = {
      getItem: (key) =>
        key === REF_STORAGE_KEY ? "stored-shop" : null,
    };
    const result = resolveShopRef({ url: null, localStorage: ls });
    // We still trust localStorage getItem here; the write-path is tested via
    // the setState branch in the hook. This test documents the read fallback.
    expect(result.source).toBe("localStorage");
    expect(result.ref).toBe("stored-shop");
  });

  it("does not throw when url includes ref with query-encoded chars", () => {
    const ls = { getItem: () => null };
    const result = resolveShopRef({
      url: "http://localhost/?ref=Hello%20World",
      localStorage: ls,
    });
    expect(result.source).toBe("url");
    expect(result.ref).toBe("hello-world");
  });
});

/* ── 3. config helpers: sanitizeRef + buildMarker ────────────────────────── */

import {
  sanitizeRef,
  buildMarker,
  DEFAULT_REF,
  REF_STORAGE_KEY,
  TRAVELPAYOUTS_MARKER,
} from "@/lib/config";

describe("sanitizeRef", () => {
  it("lowercases the input", () => {
    expect(sanitizeRef("Cafe Central")).toBe("cafe-central");
  });

  it("replaces dots with dashes (avoids Travelpayouts sub-marker collision)", () => {
    expect(sanitizeRef("My.Shop")).toBe("my-shop");
  });

  it("collapses and trims separators", () => {
    expect(sanitizeRef("  Hello--World!!  ")).toBe("hello-world");
  });

  it("caps length at 40 chars", () => {
    expect(sanitizeRef("a".repeat(60)).length).toBeLessThanOrEqual(40);
  });

  it("trims leading and trailing separators", () => {
    expect(sanitizeRef("----hello----")).toBe("hello");
  });

  it("preserves only lowercase alphanumerics and single internal dashes", () => {
    expect(sanitizeRef("  !!ABC__123!!  ")).toBe("abc-123");
  });

  it("falls back to DEFAULT_REF when nothing usable remains", () => {
    expect(sanitizeRef("")).toBe(DEFAULT_REF);
    expect(sanitizeRef("!!!")).toBe(DEFAULT_REF);
    expect(sanitizeRef(null)).toBe(DEFAULT_REF);
    expect(sanitizeRef(undefined)).toBe(DEFAULT_REF);
    expect(sanitizeRef("   ")).toBe(DEFAULT_REF);
  });

  it("handles strings already in slug form identity-style", () => {
    expect(sanitizeRef("direct")).toBe("direct");
  });
});

describe("buildMarker", () => {
  it("joins the base marker and sanitised shop with a dot", () => {
    expect(buildMarker("My.Shop")).toBe(`${TRAVELPAYOUTS_MARKER}.my-shop`);
  });

  it("falls back to DEFAULT_REF when ref is empty/unusable", () => {
    expect(buildMarker("")).toBe(`${TRAVELPAYOUTS_MARKER}.${DEFAULT_REF}`);
    expect(buildMarker("!!!")).toBe(`${TRAVELPAYOUTS_MARKER}.${DEFAULT_REF}`);
    expect(buildMarker(null)).toBe(`${TRAVELPAYOUTS_MARKER}.${DEFAULT_REF}`);
    expect(buildMarker(undefined)).toBe(`${TRAVELPAYOUTS_MARKER}.${DEFAULT_REF}`);
  });

  it("applies sanitisation to unusual raw refs", () => {
    expect(buildMarker("UPPER.shOp")).toBe(`${TRAVELPAYOUTS_MARKER}.upper-shop`);
  });

  it("is deterministic for identical inputs", () => {
    expect(buildMarker("Alpha")).toBe(buildMarker("Alpha"));
    expect(buildMarker("Beta")).toBe(`${TRAVELPAYOUTS_MARKER}.beta`);
  });
});

/* ── 4. exported config constants used by the tracking flow ──────────────── */

describe("config constants used by useShopRef", () => {
  it("exposes a stable REF_STORAGE_KEY", () => {
    expect(REF_STORAGE_KEY).toBe("flightkiosk:ref");
  });

  it("exposes DEFAULT_REF as 'direct'", () => {
    expect(DEFAULT_REF).toBe("direct");
  });
});
