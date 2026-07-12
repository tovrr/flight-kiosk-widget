import { Suspense } from "react";
import KioskScreen from "@/components/KioskScreen";

// useSearchParams (via useShopRef) requires a Suspense boundary.
export default function Page() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-flash-black" />}>
      <KioskScreen />
    </Suspense>
  );
}
