import { Suspense } from "react";
import EmbedWidget from "@/components/EmbedWidget";

// Embed fragment — not a standalone page to be indexed.
export const metadata = {
  title: "Flight search",
  robots: { index: false, follow: false },
};

// useSearchParams (in EmbedWidget) requires a Suspense boundary.
export default function EmbedPage() {
  return (
    <Suspense fallback={null}>
      <EmbedWidget />
    </Suspense>
  );
}
