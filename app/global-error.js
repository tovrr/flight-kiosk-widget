"use client";

import { useEffect } from "react";
import { t } from "@/lib/i18n";

// Catches errors in the root layout itself. It replaces the layout entirely, so
// it must render <html>/<body> and can't rely on globals.css → styles inlined.
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    const timer = setTimeout(() => reset(), 10000);
    return () => clearTimeout(timer);
  }, [reset]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          background: "#0A0A0A",
          color: "#fff",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, margin: 0 }}>
          {t("error.title")}
        </h1>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            border: "none",
            borderRadius: "9999px",
            padding: "1rem 2rem",
            fontSize: "1.25rem",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            background: "#FFE800",
            color: "#0A0A0A",
            cursor: "pointer",
          }}
        >
          {t("error.cta")}
        </button>
      </body>
    </html>
  );
}
