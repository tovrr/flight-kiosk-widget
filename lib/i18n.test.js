import { describe, it, expect } from "vitest";
import { t } from "@/lib/i18n";

describe("i18n t()", () => {
  it("returns the string for the default locale (en)", () => {
    // No NEXT_PUBLIC_LOCALE set in tests → English.
    expect(t("attract.cta")).toBe("Touch to start");
    expect(t("popular.flights")).toBe("Popular flights");
  });

  it("falls back to the key when it is unknown", () => {
    expect(t("does.not.exist")).toBe("does.not.exist");
  });

  it("has every key defined for the active locale", () => {
    // A missing key would surface as the raw key (contains a dot) rather than text.
    for (const key of ["attract.cta", "main.heading", "offline.title", "error.cta"]) {
      expect(t(key)).not.toBe(key);
    }
  });
});
