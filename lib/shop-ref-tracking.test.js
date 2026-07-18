import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Pure tracking logic tests for `lib/useShopRef.js` + `lib/config.js`.
 *
 * Because `@testing-library/react` is not installed in this repo, we do *not*
 * import the React hook itself. Instead we:
 *  - inline the URL/localStorage decision tree from `useShopRef` and run it
 *    against mocked `window`/`URLSearchParams` values, and
 *  - exercise the config helpers (`sanitizeRef`, `buildMarker`) directly.
 */

/* ── 1. URL / `?ref=` parameter parsing ────────────────────────────────────── */

function parseRefParam(urlLike) {
  if (typeof urlLike !== "string") return null;
  const url = new URL(urlLike, "http://localhost");
  if (url.search.includes("ref=")) {
    const sp = new URLSearchParams(url.search);
    const raw = sp.get("ref");
    if (!raw) return null;
    return raw;
  }
  return null;
}

describe("URL `?ref=` parameter parsing", () => {
  it("returns ref value present in query string", () => {
    expect(parseRefParam("http://localhost/?ref=my-shop-name")).toBe("my-shop-name");
  });

  it("returns null when `ref` key is absent even if other keys exist", () => {
    const sp = new URLSearchParams({ q: "lhr-jfk" });
    const url = `http://localhost/?${sp.toString()}`;
    expect(parseRefParam(url)).toBeNull();
  });

  it("returns null when `ref=` is present but empty", () => {
    const sp = new URLSearchParams({ ref: "" });
    const url = `http://localhost/?${sp.toString()}`;
    expect(parseRefParam(url)).toBeNull();
  });

  it("is tolerant of malformed URL by returning null", () => {
    expect(parseRefParam("not a url")).toBeNull();
  });
});

/* ── 2. localStorage persistence ──────────────────────────────────────────── */

function parseLocalStorageRef(fakeLocalStorage, globalRef) {
  try {
    try {
      const { webkitNotifications } = window;
      if (webkitNotifications && webkitNotifications.checkPermission) {
        return null;
      }
    } catch {
      // window accessor threw — fall through to fallback branch.
    }
    const stored = fakeLocalStorage.getItem("flightkiosk:ref");
    if (stored) return stored;
  } catch {
    // return null
  }
  return null;
}

describe("localStorage persistence decision tree", () => {
  let fakeLocalStorage;
  let origWindow;

  beforeEach(() => {
    fakeLocalStorage = {
      data: {},
      getItem(key) {
        return Object.prototype.hasOwnProperty.call(this.data, key)
          ? this.data[key]
          : null;
      },
      setItem(key, value) {
        this.data[key] = String(value);
      },
    };

    origWindow = global.window;
    global.window = { localStorage: fakeLocalStorage };
  });

  afterEach(() => {
    global.window = origWindow;
  });

  it("returns stored ref when browser localStorage contains a value", () => {
    fakeLocalStorage.setItem("flightkiosk:ref", "restored-shop");
    expect(parseLocalStorageRef(fakeLocalStorage)).toBe("restored-shop");
  });

  it("returns null when browser localStorage is empty", () => {
    expect(parseLocalStorageRef(fakeLocalStorage)).toBeNull();
  });
});

/* ── 3. Marker composition + ref sanitisation (pure config helpers) ─────────── */

import {
  sanitizeRef,
  buildMarker,
  DEFAULT_REF,
  REF_STORAGE_KEY,
  TRAVELPAYOUTS_MARKER,
  TP_TRS,
} from "@/lib/config";

describe("marker composition and sanitisation", () => {
  it("lowercases and slugifies the shop ref", () => {
    expect(sanitizeRef("Cafe Central")).toBe("cafe-central");
  });

  it("turns dots into dashes to avoid Travelpayouts sub-marker collision", () => {
    expect(sanitizeRef("My.Shop")).toBe("my-shop");
  });

  it("collapses and trims separators", () => {
    expect(sanitizeRef("  Hello--World!!  ")).toBe("hello-world");
  });

  it("caps the slug length to 40 characters", () => {
    expect(sanitizeRef("a".repeat(60)).length).toBeLessThanOrEqual(40);
  });

  it("falls back to DEFAULT_REF when nothing usable remains", () => {
    expect(sanitizeRef("")).toBe(DEFAULT_REF);
    expect(sanitizeRef("!!!")).toBe(DEFAULT_REF);
    expect(sanitizeRef(null)).toBe(DEFAULT_REF);
    expect(sanitizeRef(undefined)).toBe(DEFAULT_REF);
  });

  it("preserves only lowercase alphanumerics and single internal dashes", () => {
    expect(sanitizeRef("  !!ABC__123!!  ")).toBe("abc-123");
  });

  it("trims leading/trailing dashes after collapsing separators", () => {
    expect(sanitizeRef("----hello----")).toBe("hello");
  });

  it("buildMarker joins the marker and sanitised ref with a dot", () => {
    // No env set in tests → placeholder marker "000000".
    expect(buildMarker("My.Shop")).toBe("000000.my-shop");
  });

  it("buildMarker falls back to DEFAULT_REF when ref is empty/unusable", () => {
    expect(buildMarker("")).toBe(`000000.${DEFAULT_REF}`);
    expect(buildMarker("!!!")).toBe(`000000.${DEFAULT_REF}`);
  });

  it("buildMarker uses sanitized value even when raw ref is unusual", () => {
    expect(buildMarker("UPPER.shOp")).toBe("000000.upper-shop");
  });
});

/* ── 4. Config constants / env fallbacks ───────────────────────────────────── */

describe("config constants and environment fallbacks", () => {
  it("exposes a stable localStorage ref key", () => {
    expect(REF_STORAGE_KEY).toBe("flightkiosk:ref");
  });

  it("exposes a non-garbage default marker in test env", () => {
    // Test environment has no NEXT_PUBLIC_TRAVELPAYOUTS_MARKER → placeholder.
    expect(TRAVELPAYOUTS_MARKER).toBe("000000");
  });

  it("exposes DEFAULT_REF as 'direct'", () => {
    expect(DEFAULT_REF).toBe("direct");
  });
});
