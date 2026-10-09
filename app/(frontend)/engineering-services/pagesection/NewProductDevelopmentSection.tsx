"use client";

import { useRef, type CSSProperties } from "react";
import BrandButton from "@/app/(frontend)/components/BrandButton";
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
import { NPD, NPD_STEPS } from "./services";

const H: HLine[] = [
  [3, 0, 12],
  [4, 0, 12],
  [7, 0, 12],
  [8, 0, 12],
  [14, 0, 12],
];

const V: VLine[] = [
  [0, 0, 16],
  [12, 0, 16],
  [8, 0, 3],
  [6, 4, 7],
  [3, 8, 14],
  [6, 8, 14],
  [9, 8, 14],
  [8, 14, 16],
];

export default function NewProductDevelopmentSection() {
  const ref = useRef<HTMLElement>(null);
  usePlateMotion(ref);

  return (
    <SectionGrid
      ref={ref}
      id="new-product-development"
      aria-labelledby="new-product-development-heading"
      rows={16}
      tone="page"
      outerV={false}
      className="flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)] scroll-mt-16 md:scroll-mt-0"
    >
      <Frame h={H} v={V} />

      <Cell at={[0, 8, 0, 3]} className="plate-title">
        <MobileEdge open />
        <Eyebrow data-reveal index={NPD.index}>
          {NPD.eyebrow}
        </Eyebrow>
        <MaskRevealHeading
          id="new-product-development-heading"
          className="font-heading text-[clamp(28px,2.5vw,48px)] leading-none font-medium uppercase"
        >
          {NPD.heading[0]}
          <span className="block">{NPD.heading[1]}</span>
        </MaskRevealHeading>
      </Cell>

      <Cell at={[8, 12, 0, 3]} className="plate-lede">
        <MobileEdge />
        <p
          data-reveal
          className="font-heading text-[clamp(12px,1vw,16px)] leading-[1.1] font-medium uppercase md:text-justify md:[text-align-last:left]"
        >
          {NPD.lede}
        </p>
      </Cell>

      <Cell at={[0, 12, 3, 4]} className="ab-head index-tag">
        <MobileEdge open />
        <span className="flex items-center gap-2">
          <span aria-hidden className="ab-marker" />
          {NPD.railLabel}
        </span>
        <span className="tabular-nums">
          [{padIndex(0)}&ndash;{padIndex(NPD_STEPS.length - 1)}]
        </span>
      </Cell>

      <Cell at={[0, 6, 4, 7]} className="vm-plate">
        <MobileEdge open />
        <p data-reveal className="vm-lead im-lead">
          {NPD.lead}
        </p>
        <p data-reveal className="ab-copy">
          {NPD.support}
        </p>
      </Cell>

      <Cell at={[6, 12, 4, 7]} className="im-paths">
        <MobileEdge />
        <p data-reveal className="index-tag flex items-center gap-2">
          <span aria-hidden className="ab-marker" />
          {NPD.bringLabel}
        </p>
        <ol className="vm-legend">
          {NPD.bring.map((item, i) => (
            <li key={item} data-reveal className="vm-legend-item index-tag">
              <span className="tabular-nums opacity-60">[{padIndex(i)}]</span>
              <span className="vm-legend-rule" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </Cell>

      <Cell at={[0, 12, 7, 8]} className="im-rail hidden md:block" aria-hidden>
        <span className="im-rail-track" />
        <span data-scrub-x className="im-rail-fill" />
        {NPD_STEPS.map((step, i) => (
          <span
            key={step.id}
            data-scrub-stop={i / NPD_STEPS.length}
            className="im-rail-stop index-tag"
            style={{ "--at": i / NPD_STEPS.length } as CSSProperties}
          >
            <span className="im-rail-dot" />
            {padIndex(i)} &middot; {step.short}
          </span>
        ))}
      </Cell>

      {NPD_STEPS.map((step, i) => (
        <Cell
          key={step.id}
          at={[i * 3, i * 3 + 3, 8, 14]}
          as="article"
          className="vm-principle im-tile im-tile-invert"
          data-redraw=""
          tabIndex={0}
          aria-labelledby={`npd-${step.id}`}
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
              id={`npd-${step.id}`}
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

      <Cell at={[0, 8, 14, 16]} className="plate-statement">
        <MobileEdge open />
        <p data-reveal className="ab-statement">
          {NPD.statement[0]}
          <span className="ab-statement-muted">{NPD.statement[1]}</span>
        </p>
      </Cell>

      <Cell at={[8, 12, 14, 16]} className="plate-cta">
        <MobileEdge />
        <BrandButton href={NPD.cta.href} tone="steel" data-reveal>
          {NPD.cta.label}
        </BrandButton>
      </Cell>
    </SectionGrid>
  );
}
