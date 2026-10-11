"use client";

import { useRef } from "react";
import MaskRevealHeading from "@/app/(frontend)/components/MaskRevealHeading";
import PlusMark, { type PlusArms } from "@/app/(frontend)/components/PlusMark";
import SectionGrid from "@/app/(frontend)/components/SectionGrid";
import AwardSeal from "./AwardSeal";
import { AWARDS, CREDENTIALS, RECOGNITION } from "./about";
import { usePlateMotion } from "@/app/(frontend)/components/usePlateMotion";
import {
  Cell,
  Corners,
  Eyebrow,
  Frame,
  MobileEdge,
  type HLine,
  type VLine,
} from "@/app/(frontend)/components/plate";

const joinStubDown: PlusArms = { up: false, down: true, left: false, right: false };
const joinStubUp: PlusArms = { up: true, down: false, left: false, right: false };

const H: HLine[] = [
  [3, 0, 12],
  [4, 0, 12],
  [11, 0, 12],
  [13, 0, 12],
];

const V: VLine[] = [
  [0, 0, 16],
  [12, 0, 16],
  [8, 0, 3],
  [6, 3, 13],
  [3, 4, 11],
  [9, 4, 11],
  [8, 13, 16],
];

export default function RecognitionSection() {
  const ref = useRef<HTMLElement>(null);
  usePlateMotion(ref);

  return (
    <SectionGrid
      ref={ref}
      id="recognition"
      aria-labelledby="recognition-heading"
      rows={16}
      tone="page"
      outerV={false}
      className="flex flex-col bg-steel text-cream [--page-bg:var(--steel)] [--page-ink:var(--cream)]"
    >
      <Frame h={H} v={V} />

      <Cell at={[0, 8, 0, 3]} className="plate-title">
        <MobileEdge open />
        <Eyebrow data-reveal index={RECOGNITION.index}>
          {RECOGNITION.eyebrow}
        </Eyebrow>
        <MaskRevealHeading
          id="recognition-heading"
          className="font-heading text-[clamp(28px,2.5vw,48px)] leading-none font-medium uppercase"
        >
          {RECOGNITION.heading[0]}
          <span className="ab-statement-muted">{RECOGNITION.heading[1]}</span>
        </MaskRevealHeading>
      </Cell>

      <Cell at={[8, 12, 0, 3]} className="plate-lede">
        <MobileEdge />
        <p
          data-reveal
          className="font-heading text-[clamp(12px,1vw,16px)] leading-[1.1] font-medium uppercase md:text-justify md:[text-align-last:left]"
        >
          {RECOGNITION.intro}
        </p>
      </Cell>

      {AWARDS.map((award, i) => {
        const c = i * 6;
        return [
          <Cell key={`${award.id}-head`} at={[c, c + 6, 3, 4]} className="ab-head index-tag">
            <MobileEdge open />
            <span className="flex items-center gap-2">
              <span aria-hidden className="ab-marker" />
              {award.name}
            </span>
            <span className="tabular-nums">[{award.year}]</span>
          </Cell>,
          <Cell
            key={`${award.id}-seal`}
            at={[c, c + 3, 4, 11]}
            className="rc-seal-cell"
            data-redraw=""
          >
            <MobileEdge open />
            <div data-draw className="rc-seal dot-field-soft">
              <Corners />
              <AwardSeal
                tier={award.tier}
                ring={award.ring}
                year={award.year}
                className="rc-seal-mark"
              />
            </div>
          </Cell>,
          <Cell
            key={`${award.id}-copy`}
            at={[c + 3, c + 6, 4, 11]}
            as="article"
            className="rc-award"
            aria-labelledby={`award-${award.id}`}
          >
            <MobileEdge />
            <div data-reveal className="rc-award-title">
              <h3
                id={`award-${award.id}`}
                className="font-heading text-[clamp(22px,2vw,36px)] leading-none font-medium uppercase"
              >
                {award.title}
                <span className="sr-only">, {award.name} {award.year}</span>
              </h3>
              <p className="index-tag leading-[1.2] opacity-80">{award.sector}</p>
            </div>
            <span aria-hidden className="rc-award-year ab-outline">
              {award.year}
            </span>
            <p data-reveal className="ab-copy">
              {award.body}
            </p>
          </Cell>,
        ];
      })}

      {CREDENTIALS.map((cred, i) => (
        <Cell key={cred.id} at={[i * 6, i * 6 + 6, 11, 13]} className="rc-cred">
          <MobileEdge />
          <article data-reveal className="quality-cred">
            <span className="quality-cred-bracket" aria-hidden>
              <PlusMark tone="page" arms={joinStubDown} className="top-0 left-0" />
              <span className="quality-cred-rail">
                <svg width="1" height="100%" className="h-full w-px">
                  <line
                    x1="0.5"
                    x2="0.5"
                    y1="0"
                    y2="100%"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="8 8"
                  />
                </svg>
              </span>
              <PlusMark tone="page" arms={joinStubUp} className="top-full left-0" />
            </span>
            <div className="quality-cred-body">
              <p className="quality-cred-org">{cred.org}</p>
              <div className="quality-cred-copy">
                <p className="quality-cred-code">{cred.code}</p>
                <p className="quality-cred-sub">{cred.sub}</p>
              </div>
            </div>
          </article>
          <span className="rc-cred-tag index-tag">
            {i === 0 ? "Certified" : "Accredited"}
          </span>
        </Cell>
      ))}

      <Cell at={[0, 8, 13, 16]} className="plate-statement">
        <MobileEdge open />
        <p data-reveal className="ab-statement">
          {RECOGNITION.statement[0]}
          <span className="ab-statement-muted">{RECOGNITION.statement[1]}</span>
        </p>
      </Cell>

      <Cell at={[8, 12, 13, 16]} className="plate-lede">
        <MobileEdge />
        {RECOGNITION.aside.map((line, i) => (
          <p
            key={line}
            data-reveal
            className={`font-heading text-[clamp(12px,1vw,16px)] leading-[1.1] uppercase ${i === 0 ? "font-medium" : "font-normal opacity-80"}`}
          >
            {line}
          </p>
        ))}
      </Cell>
    </SectionGrid>
  );
}
