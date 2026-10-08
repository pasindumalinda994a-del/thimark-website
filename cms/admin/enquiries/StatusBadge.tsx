"use client";

import type { DefaultCellComponentProps } from "payload";
import { STATUS_LABELS, isEnquiryStatus } from "./status";

export function StatusBadge({ status }: { status: unknown }) {
  if (!isEnquiryStatus(status)) return <span className="tm-muted">—</span>;
  return (
    <span className={`tm-badge tm-badge--${status}`}>
      <span className="tm-badge__dot" aria-hidden />
      {STATUS_LABELS[status]}
    </span>
  );
}

export function StatusCell({ cellData }: DefaultCellComponentProps) {
  return <StatusBadge status={cellData} />;
}
