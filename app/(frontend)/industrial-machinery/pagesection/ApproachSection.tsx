"use client";

import { useRef, type CSSProperties } from "react";
import IsoGlyph from "@/app/(frontend)/components/IsoGlyph";
import MaskRevealHeading from "@/app/(frontend)/components/MaskRevealHeading";
import SectionGrid from "@/app/(frontend)/components/SectionGrid";
import {
  Cell,
  Corners,
  Eyebrow,
  Frame,
  MobileEdge,
  type HLine,
  type VLine,
} from "@/app/(frontend)/components/plate";
import { usePlateMotion } from "@/app/(frontend)/components/usePlateMotion";
import { padIndex } from "@/app/(frontend)/homesections/StoryProgress";
import { APPROACH, STEPS } from "./machinery";

const H: HLine[] = [
  [3, 0, 12],
  [4, 0, 12],
  [7, 0, 12],
  [8, 0, 12],
];

const V: VLine[] = [
  [0, 0, 14],
  [12, 0, 14],
  [8, 0, 7],
  [3, 8, 14],
  [6, 8, 14],
  [9, 8, 14],
];

export default function ApproachSection() {
  const ref = useRef<HTMLElement>(null);
  usePlateMotion(ref);

  return (
    <SectionGrid
      ref={ref}
      id="approach"
      aria-labelledby="approach-heading"
      rows={14}
      tone="page"
      outerV={false}
      className="flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)] scroll-mt-16 md:scroll-mt-0"
    >
      <Frame h={H} v={V} />

      <Cell at={[0, 8, 0, 3]} className="plate-title">
        <MobileEdge open />
        <Eyebrow data-reveal index={APPROACH.index}>
          {APPROACH.eyebrow}
        </Eyebrow>
        <MaskRevealHeading
          id="approach-heading"
          className="font-heading text-[clamp(28px,2.5vw,48px)] leading-none font-medium uppercase"
        >
          {APPROACH.heading[0]}
          <span className="block">{APPROACH.heading[1]}</span>
        </MaskRevealHeading>
      </Cell>

      <Cell at={[8, 12, 0, 3]} className="plate-lede">
        <MobileEdge />
        <p
          data-reveal
          className="font-heading text-[clamp(12px,1vw,16px)] leading-[1.1] font-medium uppercase md:text-justify md:[text-align-last:left]"
        >
          {APPROACH.lede}
        </p>
      </Cell>

      <Cell at={[0, 12, 3, 4]} className="ab-head index-tag">
        <MobileEdge open />
        <span className="flex items-center gap-2">
          <span aria-hidden className="ab-marker" />
          {APPROACH.railLabel}
        </span>
        <span className="tabular-nums">
          [{padIndex(0)}&ndash;{padIndex(STEPS.length - 1)}]
        </span>
      </Cell>

      <Cell at={[0, 8, 4, 7]} className="vm-plate">
        <MobileEdge open />
        <p data-reveal className="vm-lead im-lead">
          {APPROACH.lead}
        </p>
      </Cell>

      <Cell at={[8, 12, 4, 7]} className="im-paths">
        <MobileEdge />
        <p data-reveal className="index-tag opacity-70">
          {APPROACH.pathsLabel}
        </p>
        <ol className="im-paths-list">
          {APPROACH.paths.map((path) => (
            <li key={path.id} data-reveal className="im-path index-tag">
              <span className="im-path-id">{path.id}</span>
              <span>{path.from}</span>
              <span className="vm-legend-rule" aria-hidden />
              <span aria-hidden>&rarr;</span>
              <span>{path.to}</span>
            </li>
          ))}
        </ol>
      </Cell>

      <Cell at={[0, 12, 7, 8]} className="im-rail hidden md:block" aria-hidden>
        <span className="im-rail-track" />
        <span data-scrub-x className="im-rail-fill" />
        {STEPS.map((step, i) => (
          <span
            key={step.id}
            data-scrub-stop={i / STEPS.length}
            className="im-rail-stop index-tag"
            style={{ "--at": i / STEPS.length } as CSSProperties}
          >
            <span className="im-rail-dot" />
            {padIndex(i)} &middot; {step.short}
          </span>
        ))}
      </Cell>

      {STEPS.map((step, i) => (
        <Cell
          key={step.id}
          at={[i * 3, i * 3 + 3, 8, 14]}
          as="article"
          className="vm-principle im-tile im-tile-invert"
          data-redraw=""
          tabIndex={0}
          aria-labelledby={`step-${step.id}`}
        >
          <MobileEdge />
          <p className="ab-head index-tag vm-principle-head">
            <span>Step</span>
            <span className="tabular-nums">[{padIndex(i)}]</span>
          </p>
          <div data-draw className="vm-principle-glyph dot-field-soft">
            <Corners />
            <IsoGlyph kind={step.icon} className="vm-principle-mark" />
            <span aria-hidden className="im-step-numeral ab-outline">
              {padIndex(i)}
            </span>
          </div>
          <div className="vm-principle-copy">
            <h3
              id={`step-${step.id}`}
              className="font-heading text-[clamp(14px,1.1vw,20px)] leading-none font-medium uppercase"
            >
              {step.title}
            </h3>
            <p className="font-heading text-[clamp(10px,0.85vw,12px)] leading-[1.2] font-normal uppercase">
              {step.body}
            </p>
          </div>
        </Cell>
      ))}
    </SectionGrid>
  );
}
