"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const CustomCursor = dynamic(() => import("@/app/(frontend)/components/CustomCursor"), {
  ssr: false,
});

const FINE_POINTER = "(hover: hover) and (pointer: fine)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(FINE_POINTER);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Touch devices never download the cursor chunk. */
export default function CustomCursorLoader() {
  const fine = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(FINE_POINTER).matches,
    () => false,
  );
  return fine ? <CustomCursor /> : null;
}
