"use client";

import { useRowLabel } from "@payloadcms/ui";

export function SectionRowLabel() {
  const { data, rowNumber } = useRowLabel<{ heading?: string }>();
  const index = String((rowNumber ?? 0) + 1).padStart(2, "0");
  return (
    <span className="tm-row-label">
      <span className="tm-row-label__index">[{index}]</span>
      {data?.heading || "Untitled section"}
    </span>
  );
}
