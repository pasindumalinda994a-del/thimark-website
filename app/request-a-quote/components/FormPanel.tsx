"use client";

import type { FormEventHandler, ReactNode, Ref } from "react";
import RfqField from "@/app/request-a-quote/components/RfqField";
import { BODY_TOP, SHEET_ROWS, SheetPanel, rowTracks } from "@/app/request-a-quote/components/RfqSheet";
import type { HLine, Lines, VLine } from "@/app/request-a-quote/components/SheetLines";
import type { SheetForm } from "@/app/request-a-quote/rfq-schema";

const NAV_ROWS = 2;

export function formLines(form: SheetForm): Lines {
  const h: HLine[] = [];
  const v: VLine[] = [
    { x: 6, from: BODY_TOP, to: SHEET_ROWS },
    { x: 2, from: SHEET_ROWS - NAV_ROWS, to: SHEET_ROWS },
  ];
  let y = BODY_TOP + 1;
  h.push({ y, from: 0, to: 6 });
  for (const row of form.rows) {
    const span = row.span ?? 1;
    if (row.fields.length === 2) v.push({ x: row.split === "third" ? 2 : 3, from: y, to: y + span });
    y += span;
    h.push({ y, from: 0, to: 6 });
  }
  y = SHEET_ROWS - NAV_ROWS - (form.consent ? 1 : 0);
  h.push({ y, from: 0, to: 6 });
  if (form.consent) h.push({ y: y + 1, from: 0, to: 6 });
  return { h, v };
}

function formTracks(form: SheetForm) {
  return rowTracks([1, ...form.rows.map((row) => row.span ?? 1), "fill", ...(form.consent ? [1] : [])]);
}

type FormPanelProps = {
  form: SheetForm;
  heading: string;
  headingRef?: Ref<HTMLHeadingElement>;
  meta: ReactNode;
  status: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export default function FormPanel({ form, heading, headingRef, meta, status, onSubmit }: FormPanelProps) {
  return (
    <SheetPanel
      side="left"
      edge="mid"
      rows={formTracks(form)}
      className="is-above-nav"
      onSubmit={onSubmit}
    >
      <div className="rfq-form-title" data-rfq-copy>
        <h2 id="rfq-step-heading" ref={headingRef} tabIndex={-1} className="rfq-form-heading">
          {heading}
        </h2>
        {status ? (
          <p className="rfq-form-meta index-tag is-error" aria-hidden>
            {status}
          </p>
        ) : (
          <div className="rfq-form-meta index-tag">{meta}</div>
        )}
        <p className="sr-only" role="status">
          {status}
        </p>
      </div>

      {form.rows.map((row) => (
        <div
          key={row.fields.map((field) => field.key).join("-")}
          data-rfq-copy
          className={`rfq-row${row.fields.length === 2 ? ` is-split is-${row.split ?? "half"}` : ""}`}
        >
          {row.fields.map((field) => (
            <RfqField key={field.key} field={field} />
          ))}
        </div>
      ))}

      <div data-rfq-copy className="rfq-row is-message">
        <RfqField field={form.message} />
      </div>

      {form.consent ? (
        <div data-rfq-copy className="rfq-row">
          <RfqField field={form.consent} />
        </div>
      ) : null}
    </SheetPanel>
  );
}
