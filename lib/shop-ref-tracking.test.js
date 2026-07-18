import { describe, it, expect } from "vitest";
import { resolveShopRef } from "@/lib/resolveShopRef";
import { DEFAULT_REF } from "@/lib/config";

/**
 * Tests the real shop-ref resolution logic (`lib/resolveShopRef.js`), the pure
 * core extracted from `useShopRef`. Priority: URL `?ref=` > persisted value >
 * DEFAULT_REF, both sources sanitised. The `sanitizeRef` / `buildMarker`
 * helpers themselves are covered by `config.test.js`.
 */
describe("resolveShopRef — source priority", () => {
  it("uses the URL ref when present and marks it to persist", () => {
    expect(resolveShopRef({ urlRef: "my-shop", storedRef: "old-shop" })).toEqual({
      ref: "my-shop",
      persist: true,
    });
  });

  it("falls back to the stored ref when the URL has none (no persist)", () => {
    expect(resolveShopRef({ urlRef: null, storedRef: "restored-shop" })).toEqual({
      ref: "restored-shop",
      persist: false,
    });
  });

  it("falls back to DEFAULT_REF when neither source is present", () => {
    expect(resolveShopRef({ urlRef: null, storedRef: null })).toEqual({
      ref: DEFAULT_REF,
      persist: false,
    });
    expect(resolveShopRef({})).toEqual({ ref: DEFAULT_REF, persist: false });
  });

  it("treats an empty/whitespace URL ref as absent", () => {
    expect(resolveShopRef({ urlRef: "   ", storedRef: "restored-shop" })).toEqual({
      ref: "restored-shop",
      persist: false,
    });
    expect(resolveShopRef({ urlRef: "", storedRef: null })).toEqual({
      ref: DEFAULT_REF,
      persist: false,
    });
  });
});

describe("resolveShopRef — sanitisation of both sources", () => {
  it("sanitises the URL ref (lowercase, dots → dashes)", () => {
    expect(resolveShopRef({ urlRef: "My.Shop" }).ref).toBe("my-shop");
  });

  it("sanitises the restored stored ref too", () => {
    expect(resolveShopRef({ storedRef: "  Cafe Central!!  " }).ref).toBe("cafe-central");
  });

  it("falls back to DEFAULT_REF when a source sanitises to nothing usable", () => {
    expect(resolveShopRef({ urlRef: "!!!" }).ref).toBe(DEFAULT_REF);
  });
});
