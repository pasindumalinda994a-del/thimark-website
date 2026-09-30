"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import CapabilityGlyph from "@/app/components/CapabilityGlyph";
import { COMPANY } from "@/app/components/site";
import type { Lines } from "@/app/request-a-quote/components/SheetLines";
import type { ServiceDef, StepId, Values } from "@/app/request-a-quote/rfq-schema";

gsap.registerPlugin(useGSAP, DrawSVGPlugin);

export const TITLE_BLOCK_ROWS = 6;

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: COMPANY.timeZone,
});

export function sheetDate(date: Date) {
  return DATE_FORMAT.format(date).toUpperCase();
}

function isoDate(raw: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (!match) return raw;
  return sheetDate(new Date(Date.UTC(+match[1], +match[2] - 1, +match[3], 12)));
}

export function summarise(service: ServiceDef, values: Values) {
  const text = (key: string) => (values[key] ?? "").trim();
  const qty = text("quantity");
  let subject: string;
  switch (service.id) {
    case "automotive":
      subject = [text("partName"), text("manufacturer"), text("model")].filter(Boolean).join(" · ");
      break;
    case "industrial":
      subject = text("machine") || text("industry");
      break;
    case "powder-coating":
      subject = text("coatingItems");
      break;
    default:
      subject = text("industry") || text("description").slice(0, 48);
  }
  return {
    client: text("company") || text("fullName"),
    subject,
    quantity: qty && service.id !== "general" ? `${qty} pcs` : qty,
    requiredBy: isoDate(text("requiredBy")),
  };
}

/** Rules for a title block whose first row starts at grid row `top` in the right half. */
export function titleBlockLines(top: number): Lines {
  return {
    h: Array.from({ length: TITLE_BLOCK_ROWS }, (_, i) => ({ y: top + i + 1, from: 6, to: 12 })),
    v: [
      { x: 9, from: top, to: top + 1 },
      { x: 8, from: top + 4, to: top + 6 },
      { x: 10, from: top + 4, to: top + 6 },
    ],
  };
}

function Cell({ label, value, span, mono = false }: { label: string; value: string; span: 2 | 3 | 6; mono?: boolean }) {
  return (
    <div className={`rfq-tb-cell span-${span}`}>
      <dt className="index-tag opacity-60">{label}</dt>
      <dd className={`rfq-tb-value${value ? "" : " is-empty"}${mono ? " is-mono" : ""}`}>{value || "—"}</dd>
    </div>
  );
}

type TitleBlockProps = {
  service: ServiceDef;
  values: Values;
  step: StepId;
  fileCount: number;
  reference: string | null;
  issuedAt: Date;
};

export default function TitleBlock({ service, values, step, fileCount, reference, issuedAt }: TitleBlockProps) {
  const summary = summarise(service, values);
  const issued = Boolean(reference);
  const later = values.sendFilesLater === "yes";
  const files = fileCount ? `${fileCount} attached` : later ? "To follow" : "";

  return (
    <dl className="rfq-tb" aria-label="Request summary" data-rfq-copy>
      <div className="rfq-tb-cell span-3 rfq-tb-brand">
        <dt className="sr-only">Issued by</dt>
        <dd>
          <span className="rfq-tb-mark">Thimark</span>
          <span className="index-tag opacity-60">Technocreations</span>
        </dd>
      </div>
      <Cell label="Drg no." value={reference ?? "TH-RFQ-····-····"} span={3} mono />
      <Cell label="Service" value={service.label} span={6} />
      <Cell label="Client" value={summary.client} span={6} />
      <Cell label="Subject" value={summary.subject} span={6} />
      <Cell label="Qty" value={summary.quantity} span={2} />
      <Cell label="Required by" value={summary.requiredBy} span={2} />
      <Cell label="Files" value={files} span={2} />
      <div className="rfq-tb-cell span-2">
        <dt className="index-tag opacity-60">Status</dt>
        <dd className={`rfq-tb-value rfq-tb-status${issued ? " is-issued" : ""}`}>
          <span aria-hidden className="rfq-tb-dot" />
          {issued ? "Issued" : "Draft"}
        </dd>
      </div>
      <Cell label="Sheet" value={`${String(step).padStart(2, "0")} / 03`} span={2} mono />
      <div className="rfq-tb-cell span-2">
        <dt className="index-tag opacity-60">Date</dt>
        <dd className="rfq-tb-value is-mono" suppressHydrationWarning>
          {sheetDate(issuedAt)}
        </dd>
      </div>
    </dl>
  );
}

export function SheetFigure({ service }: { service: ServiceDef }) {
  const figureRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = figureRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          root.querySelectorAll('[data-glyph-stroke="visible"]'),
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 1, ease: "power2.inOut", stagger: 0.03 },
        );
      });
      return () => mm.revert();
    },
    { scope: figureRef, dependencies: [service.id], revertOnUpdate: true },
  );

  return (
    <figure ref={figureRef} className="rfq-figure">
      <CapabilityGlyph kind={service.glyph} className="rfq-figure-glyph" />
      <figcaption className="rfq-figure-caption index-tag">
        <span>Fig. {service.index}</span>
        <span>{service.figure} · Iso view</span>
      </figcaption>
    </figure>
  );
}
