import { describe, it, expect } from "vitest";
import { sanitizeRef, buildMarker, DEFAULT_REF } from "@/lib/config";

describe("sanitizeRef", () => {
  it("lowercases and slugifies", () => {
    expect(sanitizeRef("Cafe Central")).toBe("cafe-central");
  });

  it("turns dots into dashes (avoids sub-marker collision)", () => {
    expect(sanitizeRef("My.Shop")).toBe("my-shop");
  });

  it("collapses and trims separators", () => {
    expect(sanitizeRef("  Hello--World!!  ")).toBe("hello-world");
  });

  it("caps length to 40 chars", () => {
    expect(sanitizeRef("a".repeat(60)).length).toBeLessThanOrEqual(40);
  });

  it("falls back to DEFAULT_REF when nothing usable remains", () => {
    expect(sanitizeRef("")).toBe(DEFAULT_REF);
    expect(sanitizeRef("!!!")).toBe(DEFAULT_REF);
    expect(sanitizeRef(null)).toBe(DEFAULT_REF);
  });
});

describe("buildMarker", () => {
  it("joins the base marker and the sanitised shop with a dot", () => {
    // No env set in tests → placeholder marker "000000".
    expect(buildMarker("My.Shop")).toBe("000000.my-shop");
  });

  it("uses DEFAULT_REF when no ref is given", () => {
    expect(buildMarker("")).toBe(`000000.${DEFAULT_REF}`);
  });
});
