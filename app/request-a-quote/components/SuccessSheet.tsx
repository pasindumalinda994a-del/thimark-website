"use client";

import type { Ref } from "react";
import BrandButton from "@/app/components/BrandButton";
import Stamp from "@/app/components/Stamp";
import {
  BODY_TOP,
  SHEET_ROWS,
  SheetNav,
  SheetPanel,
  rowTracks,
} from "@/app/request-a-quote/components/RfqSheet";
import { joinLines, type Lines } from "@/app/request-a-quote/components/SheetLines";
import TitleBlock, { sheetDate, titleBlockLines, TITLE_BLOCK_ROWS } from "@/app/request-a-quote/components/TitleBlock";
import type { RfqRecord, ServiceDef, Values } from "@/app/request-a-quote/rfq-schema";

const NEXT_STEPS = [
  { title: "Received", body: "We log your requirement and files." },
  { title: "Review", body: "Engineers assess the requirement." },
  { title: "Clarify", body: "We call if anything needs detail." },
  { title: "Quote", body: "You receive the quotation or proposal." },
];

const TB_TOP = SHEET_ROWS - TITLE_BLOCK_ROWS;

export const SUCCESS_LINES: Lines = joinLines(
  {
    h: [
      { y: BODY_TOP + 1, from: 0, to: 12 },
      { y: BODY_TOP + 4, from: 0, to: 6 },
      { y: BODY_TOP + 6, from: 0, to: 6 },
      { y: SHEET_ROWS - 2, from: 0, to: 6 },
      ...NEXT_STEPS.map((_, i) => ({ y: BODY_TOP + 2 + i, from: 6, to: 12 })),
    ],
    v: [
      { x: 6, from: BODY_TOP, to: SHEET_ROWS },
      { x: 3, from: SHEET_ROWS - 2, to: SHEET_ROWS },
      { x: 7, from: BODY_TOP + 1, to: TB_TOP },
    ],
  },
  titleBlockLines(TB_TOP),
);

type SuccessSheetProps = {
  record: RfqRecord;
  service: ServiceDef;
  values: Values;
  headingRef?: Ref<HTMLHeadingElement>;
  onReset: () => void;
};

export default function SuccessSheet({ record, service, values, headingRef, onReset }: SuccessSheetProps) {
  const issued = new Date(record.submittedAt);
  const files = record.files.length
    ? `${record.files.length} file${record.files.length === 1 ? "" : "s"} attached`
    : record.sendFilesLater
      ? "Files to follow"
      : "No files attached";

  return (
    <>
      <SheetPanel side="left" edge="mid" rows={rowTracks([1, 3, 2, "fill"])} className="is-above-nav">
        <div className="rfq-form-title" data-rfq-copy>
          <p className="rfq-form-heading">
            <span className="text-brand">■</span> Submitted
          </p>
          <p className="rfq-form-meta index-tag">{record.intent}</p>
        </div>
        <div className="rfq-success-head" data-rfq-copy>
          <h2 id="rfq-step-heading" ref={headingRef} tabIndex={-1} className="rfq-success-title">
            Thanks — we&rsquo;ve got your requirement.
          </h2>
        </div>
        <div className="rfq-success-ref" data-rfq-copy>
          <div>
            <p className="index-tag opacity-60">Reference</p>
            <p className="rfq-success-code">{record.reference}</p>
          </div>
          <div data-rfq-stamp className="rfq-success-stamp">
            <Stamp strong="Received" sub={sheetDate(issued)} />
          </div>
        </div>
        <p className="rfq-success-note" data-rfq-copy>
          We&rsquo;ll reply to <span className="text-brand">{record.contact.email}</span>. {files}.
        </p>
      </SheetPanel>

      <SheetPanel side="right" edge="mid" rows={rowTracks([1, NEXT_STEPS.length, TITLE_BLOCK_ROWS])}>
        <div className="rfq-panel-head" data-rfq-copy>
          <p className="rfq-panel-title">What happens next</p>
        </div>
        <ol className="rfq-next">
          {NEXT_STEPS.map((item, index) => (
            <li key={item.title} className="rfq-next-row" data-rfq-copy>
              <span className="rfq-next-num">{String(index + 1).padStart(2, "0")}</span>
              <span className="rfq-next-copy">
                <span className="rfq-next-title">{item.title}</span>
                <span className="rfq-next-body">{item.body}</span>
              </span>
            </li>
          ))}
        </ol>
        <TitleBlock
          service={service}
          values={values}
          step={3}
          fileCount={record.files.length}
          reference={record.reference}
          issuedAt={issued}
        />
      </SheetPanel>

      <SheetNav even>
        <BrandButton tone="steel" type="button" className="contact-submit" onClick={onReset}>
          Submit another
        </BrandButton>
        <BrandButton href="/" className="contact-submit">
          Back to Thimark
        </BrandButton>
      </SheetNav>
    </>
  );
}
