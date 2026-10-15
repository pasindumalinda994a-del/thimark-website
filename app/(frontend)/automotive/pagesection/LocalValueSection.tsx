"use client";

import { useRef } from "react";
import Copy from "@/app/(frontend)/components/Copy";
import H2Heading from "@/app/(frontend)/components/H2Heading";
import SectionGrid from "@/app/(frontend)/components/SectionGrid";
import { usePlateMotion } from "@/app/(frontend)/components/usePlateMotion";
import {
  Cell,
  Eyebrow,
  Frame,
  MobileEdge,
  PlateBlock,
  type HLine,
  type Join,
  type VLine,
} from "@/app/(frontend)/components/plate";
import { padIndex } from "@/app/(frontend)/homesections/StoryProgress";
import { VALUE } from "./automotive";

const HEAD_H: HLine[] = [[3, 0, 12]];
const HEAD_V: VLine[] = [
  [0, 0, 3],
  [12, 0, 3],
  [8, 0, 3],
];
const HEAD_JOINS: Join[] = [
  [0, 3, { down: true }],
  [6, 3, { down: true }],
  [12, 3, { down: true }],
];

const BODY_H: HLine[] = [
  [0, 0, 12],
  [5, 0, 12],
];
const BODY_V: VLine[] = [
  [0, 0, 5],
  [4, 0, 5],
  [12, 0, 5],
];
const BODY_JOINS: Join[] = [
  [0, 0, { up: true }],
  [6, 0, { up: true }],
  [12, 0, { up: true }],
];

export default function LocalValueSection() {
  const ref = useRef<HTMLElement>(null);
  usePlateMotion(ref);

  return (
    <SectionGrid
      ref={ref}
      id="local-value-addition"
      aria-labelledby="lva-heading"
      rows={16}
      tone="page"
      outerV={false}
      className="lva-section plate-auto flex flex-col bg-steel text-cream [--page-bg:var(--steel)] [--page-ink:var(--cream)] scroll-mt-16 xl:scroll-mt-0"
    >
      <PlateBlock rows={3}>
        <Frame h={HEAD_H} v={HEAD_V} joins={HEAD_JOINS} />

        <Cell at={[0, 8, 0, 3]} className="plate-title">
          <MobileEdge open />
          <Eyebrow data-reveal index={VALUE.index}>
            {VALUE.eyebrow}
          </Eyebrow>
          <H2Heading id="lva-heading">
            {VALUE.heading[0]}{" "}
            <span className="ab-statement-muted">{VALUE.heading[1]}</span>
          </H2Heading>
        </Cell>

        <Cell at={[8, 12, 0, 3]} className="plate-lede">
          <MobileEdge />
          <Copy data-reveal variant="lede">
            {VALUE.lede}
          </Copy>
        </Cell>
      </PlateBlock>

      <PlateBlock rows={5}>
        <Frame h={BODY_H} v={BODY_V} joins={BODY_JOINS} />

        <Cell at={[0, 4, 0, 5]} className="lva-figure">
          <MobileEdge open />
          <p data-reveal className="lva-figure-value m-0">
            {VALUE.figure}
          </p>
          <p data-reveal className="index-tag m-0">
            {VALUE.figureLabel}
          </p>
        </Cell>

        <Cell at={[4, 12, 0, 5]} className="lva-lines">
          <MobileEdge />
          <ol className="vm-legend">
            {VALUE.lines.map((line, i) => (
              <li key={line} data-reveal className="vm-legend-item index-tag">
                <span className="tabular-nums opacity-60">[{padIndex(i)}]</span>
                <span className="vm-legend-rule" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </Cell>
      </PlateBlock>
    </SectionGrid>
  );
}
