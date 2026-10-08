"use client";

import { useField, useForm } from "@payloadcms/ui";
import { useState } from "react";
import { STATUS_LABELS, type EnquiryStatus } from "./status";
import { useValue } from "./useValue";

const QUICK: { status: EnquiryStatus; label: string }[] = [
  { status: "in-progress", label: "Mark in progress" },
  { status: "replied", label: "Mark replied" },
  { status: "closed", label: "Close" },
  { status: "spam", label: "Mark spam" },
];

export function EnquiryActions() {
  const { submit } = useForm();
  const { value: status, setValue } = useField<EnquiryStatus>({ path: "status" });
  const reference = useValue<string>("reference");
  const name = useValue<string>("name");
  const email = useValue<string>("email");
  const message = useValue<string>("message");
  const [busy, setBusy] = useState<EnquiryStatus | null>(null);

  if (!reference) return null;

  const quoted = (message ?? "")
    .split(/\r?\n/)
    .map((line) => `> ${line}`)
    .join("\n");
  const mailto = `mailto:${email}?subject=${encodeURIComponent(
    `Re: Your enquiry ${reference}`,
  )}&body=${encodeURIComponent(`Dear ${name ?? ""},\n\n\n\n—\nThimark Technocreations\n\n${quoted}`)}`;

  const change = async (next: EnquiryStatus) => {
    if (busy || next === status) return;
    setBusy(next);
    setValue(next);
    try {
      await submit({ overrides: { status: next } });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="tm-actions">
      <a href={mailto} className="tm-btn tm-btn--primary tm-btn--block">
        Reply by email
      </a>
      <div className="tm-actions__grid">
        {QUICK.map((item) => (
          <button
            key={item.status}
            type="button"
            className={`tm-btn tm-btn--small${item.status === "spam" ? " tm-btn--danger" : ""}`}
            disabled={Boolean(busy) || status === item.status}
            aria-pressed={status === item.status}
            onClick={() => change(item.status)}
          >
            {busy === item.status ? "Saving…" : status === item.status ? STATUS_LABELS[item.status] : item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
