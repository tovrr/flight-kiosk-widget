"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { sanitizeRef } from "@/lib/config";
import TravelWidget from "./TravelWidget";

/**
 * Standalone flight-search widget for embedding on a third-party website via an
 * <iframe> (see `public/embed.js`). No kiosk chrome — just the search form,
 * transparent background to blend into the host page, and it reports its height
 * to the parent frame so the iframe can size itself.
 *
 * The shop is read from `?ref=` (same tracking model as the kiosk).
 */
export default function EmbedWidget() {
  const params = useSearchParams();
  const shopRef = sanitizeRef(params.get("ref") || "");
  const rootRef = useRef(null);

  useEffect(() => {
    // Blend into the host page (the root layout paints a black kiosk bg).
    document.documentElement.style.background = "transparent";
    document.body.style.background = "transparent";
    document.body.style.overflow = "visible";

    const el = rootRef.current;
    if (!el) return;

    // Report content height to the embedding page for auto-resize.
    const post = () => {
      const height = Math.ceil(el.getBoundingClientRect().height);
      window.parent?.postMessage({ type: "flightkiosk:height", height }, "*");
    };
    post();
    const observer = new ResizeObserver(post);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="flex justify-center p-2">
      <TravelWidget shopRef={shopRef} />
    </div>
  );
}
