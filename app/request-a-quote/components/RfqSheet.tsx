import type { CSSProperties, FormEventHandler, ReactNode, Ref } from "react";
import PlusMark, { type PlusArms } from "@/app/components/PlusMark";
import { GridLine } from "@/app/components/SectionGrid";
import SheetLines, { joinLines, type Lines } from "@/app/request-a-quote/components/SheetLines";
import { STEP_LABELS, type StepId } from "@/app/request-a-quote/rfq-schema";

export const SHEET_ROWS = 16;
/** Rows taken by the header band; every body starts here. */
export const BODY_TOP = 5;
export const BODY_ROWS = SHEET_ROWS - BODY_TOP;

const joinLeftEdge: PlusArms = { up: true, down: true, left: false, right: true };
const joinRightEdge: PlusArms = { up: true, down: true, left: true, right: false };
const joinFootLeft: PlusArms = { up: true, down: false, left: false, right: true };
const joinFootRight: PlusArms = { up: true, down: false, left: true, right: false };

function headerLines(rows: number): Lines {
  return {
    h: [
      { y: BODY_TOP, from: 0, to: 12 },
      { y: rows, from: 0, to: 12 },
    ],
    v: [
      { x: 0, from: 0, to: rows },
      { x: 12, from: 0, to: rows },
      { x: 6, from: 0, to: BODY_TOP },
      { x: 8, from: 0, to: BODY_TOP },
      { x: 10, from: 0, to: BODY_TOP },
    ],
  };
}

export function MobileRails({ edge }: { edge: "start" | "mid" | "end" }) {
  const vertical = edge === "start" ? "contact-v-band-start" : "contact-v-band-join";
  const leftArms = edge === "end" ? joinFootLeft : joinLeftEdge;
  const rightArms = edge === "end" ? joinFootRight : joinRightEdge;

  return (
    <>
      <GridLine axis="v" unstyled tone="page" className={`v-g1-0 ${vertical} md:hidden`} />
      <GridLine axis="v" unstyled tone="page" className={`v-g1-12 ${vertical} md:hidden`} />
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
      <PlusMark tone="page" arms={leftArms} className="v-g1-0 at-bottom md:hidden" />
      <PlusMark tone="page" arms={rightArms} className="v-g1-12 at-bottom md:hidden" />
    </>
  );
}

/** A body region of the sheet: left or right half, or the full width, below the header band. */
export function SheetPanel({
  side,
  rows,
  edge,
  className = "",
  onSubmit,
  children,
}: {
  side: "left" | "right" | "full";
  /** CSS grid-template-rows used from md up. */
  rows?: string;
  edge: "mid" | "end";
  className?: string;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
}) {
  const style = rows ? ({ "--rfq-rows": rows } as CSSProperties) : undefined;
  const panelClass = `rfq-panel is-${side} ${className}`;
  return (
    <div className="relative md:contents">
      <MobileRails edge={edge} />
      {onSubmit ? (
        <form
          id="rfq-form"
          className={panelClass}
          style={style}
          noValidate
          onSubmit={onSubmit}
          aria-labelledby="rfq-step-heading"
        >
          {children}
        </form>
      ) : (
        <div className={panelClass} style={style}>
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * The 2-row button band at the foot of the left half. It sits outside the form so it
 * follows the right panel on mobile; submit buttons use `form="rfq-form"`.
 */
export function SheetNav({ even = false, children }: { even?: boolean; children: ReactNode }) {
  return (
    <div className="relative md:contents">
      <MobileRails edge="end" />
      <div className={`rfq-nav${even ? " is-even" : ""}`}>{children}</div>
    </div>
  );
}

/** Row tracks for a panel: `n` single rows, or explicit spans; "fill" takes the remainder. */
export function rowTracks(spans: (number | "fill")[]) {
  return spans
    .map((span) =>
      span === "fill" ? "minmax(0, 1fr)" : span === 1 ? "var(--row)" : `calc(${span} * var(--row))`,
    )
    .join(" ");
}

type StepCell = { value: string };

type RfqSheetProps = {
  ref?: Ref<HTMLElement>;
  step: StepId;
  furthest: StepId;
  done: boolean;
  summaries: Record<StepId, StepCell>;
  onGo: (step: StepId) => void;
  /** Sheet height in grid rows. */
  rows?: number;
  lines: Lines;
  children: ReactNode;
};

export default function RfqSheet({
  ref,
  step,
  furthest,
  done,
  summaries,
  onGo,
  rows = SHEET_ROWS,
  lines,
  children,
}: RfqSheetProps) {
  return (
    <section
      ref={ref}
      id="rfq-sheet"
      aria-labelledby="rfq-heading"
      style={{ "--rfq-sheet-rows": rows } as CSSProperties}
      className="rfq-sheet content-plate relative flex flex-col overflow-x-hidden bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)]"
    >
      <SheetLines lines={joinLines(headerLines(rows), lines)} rows={rows} />

      <div className="relative md:contents">
        <MobileRails edge="start" />
        <header className="rfq-intro">
          <div className="contact-title">
            <p data-rfq-copy className="eyebrow">
              Request a Quote <span className="opacity-60">[RFQ]</span>
            </p>
            <h1
              id="rfq-heading"
              data-rfq-copy
              className="font-heading text-[clamp(40px,5.2vw,64px)] leading-[0.89] font-medium tracking-[-0.01em] uppercase"
            >
              Request a Quote
            </h1>
          </div>
          <p data-rfq-copy className="max-w-md font-heading text-[16px] leading-none font-normal uppercase">
            Tell us what you need.
            <span className="block">We&rsquo;ll engineer the quotation.</span>
          </p>
        </header>
      </div>

      <div className="relative md:contents">
        <MobileRails edge="mid" />
        <ol className="rfq-steps" aria-label="Request steps">
          {([1, 2, 3] as const).map((n) => {
            const current = !done && n === step;
            const complete = done || (n !== step && n <= furthest);
            const reachable = !done && n !== step && n <= furthest;
            const state = current ? "Current" : complete ? "Done" : "Next";
            const inner = (
              <>
                <span className="rfq-step-top index-tag">
                  <span className="opacity-60">{String(n).padStart(2, "0")}</span>
                  <span>{state}</span>
                </span>
                <span className="rfq-step-label">{STEP_LABELS[n]}</span>
                <span className={`rfq-step-value${summaries[n].value ? "" : " is-empty"}`}>
                  {summaries[n].value || "—"}
                </span>
              </>
            );
            return (
              <li
                key={n}
                data-rfq-copy
                className={`rfq-step${current ? " is-current" : ""}${complete ? " is-done" : ""}`}
              >
                {reachable ? (
                  <button type="button" className="rfq-step-inner" onClick={() => onGo(n)}>
                    {inner}
                  </button>
                ) : (
                  <div className="rfq-step-inner" aria-current={current ? "step" : undefined}>
                    {inner}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {children}
    </section>
  );
}
