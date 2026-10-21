"use client";

import { useField, useForm } from "@payloadcms/ui";
import { useEffect, useRef, useState } from "react";
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
  const email = useValue<string>("email");
  const [busy, setBusy] = useState<EnquiryStatus | null>(null);
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
    };
  }, []);

  if (!reference || !email) return null;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

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
      <button type="button" className="tm-btn tm-btn--primary tm-btn--block" onClick={copyEmail}>
        {copied ? "Email copied" : "Copy email"}
      </button>
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
