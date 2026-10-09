"use client";

import { useRef } from "react";
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
import { POWDER, POWDER_OFFERINGS } from "./services";

const H: HLine[] = [
  [3, 0, 12],
  [9, 0, 12],
  [10, 0, 12],
  [14, 0, 12],
];

const V: VLine[] = [
  [0, 0, 16],
  [12, 0, 16],
  [8, 0, 3],
  [4, 3, 9],
  [8, 3, 9],
  [6, 9, 14],
  [8, 14, 16],
];

export default function PowderCoatingSection() {
  const ref = useRef<HTMLElement>(null);
  usePlateMotion(ref);

  return (
    <SectionGrid
      ref={ref}
      id="powder-coating"
      aria-labelledby="powder-coating-heading"
      rows={16}
      tone="page"
      outerV={false}
      className="flex flex-col bg-steel text-cream [--page-bg:var(--steel)] [--page-ink:var(--cream)] scroll-mt-16 md:scroll-mt-0"
    >
      <Frame h={H} v={V} />

      <Cell at={[0, 8, 0, 3]} className="plate-title">
        <MobileEdge open />
        <Eyebrow data-reveal index={POWDER.index}>
          {POWDER.eyebrow}
        </Eyebrow>
        <MaskRevealHeading
          id="powder-coating-heading"
          className="font-heading text-[clamp(28px,2.5vw,48px)] leading-none font-medium uppercase"
        >
          {POWDER.heading[0]}
          <span className="block">{POWDER.heading[1]}</span>
        </MaskRevealHeading>
      </Cell>

      <Cell at={[8, 12, 0, 3]} className="plate-lede">
        <MobileEdge />
        <p
          data-reveal
          className="font-heading text-[clamp(12px,1vw,16px)] leading-[1.1] font-medium uppercase md:text-justify md:[text-align-last:left]"
        >
          {POWDER.lede}
        </p>
      </Cell>

      {POWDER_OFFERINGS.map((offering, i) => (
        <Cell
          key={offering.id}
          at={[i * 4, i * 4 + 4, 3, 9]}
          as="article"
          className="vm-principle im-tile-short"
          data-redraw=""
          tabIndex={0}
          aria-labelledby={`powder-${offering.id}`}
        >
          <MobileEdge />
          <p className="ab-head index-tag vm-principle-head">
            <span>Service</span>
            <span className="tabular-nums">[{padIndex(i)}]</span>
          </p>
          <div data-draw className="vm-principle-glyph dot-field-soft">
            <Corners />
            <IsoGlyph kind={offering.icon} className="vm-principle-mark" />
          </div>
          <div className="vm-principle-copy">
            <h3
              id={`powder-${offering.id}`}
              className="font-heading text-[clamp(16px,1.25vw,22px)] leading-none font-medium uppercase"
            >
              {offering.title}
            </h3>
            <p className="font-heading text-[clamp(10px,0.85vw,12px)] leading-[1.2] font-normal uppercase">
              {offering.body}
            </p>
          </div>
        </Cell>
      ))}

      <Cell at={[0, 6, 9, 10]} className="ab-head index-tag">
        <MobileEdge open />
        <span className="flex items-center gap-2">
          <span aria-hidden className="ab-marker" />
          {POWDER.whoLabel}
        </span>
        <span className="tabular-nums">
          [{padIndex(0)}&ndash;{padIndex(POWDER.who.length - 1)}]
        </span>
      </Cell>

      <Cell at={[0, 6, 10, 14]} className="es-list">
        <MobileEdge />
        <p data-reveal className="ab-copy">
          {POWDER.whoIntro}
        </p>
        <ol className="vm-legend">
          {POWDER.who.map((item, i) => (
            <li key={item} data-reveal className="vm-legend-item index-tag">
              <span className="tabular-nums opacity-60">[{padIndex(i)}]</span>
              <span className="vm-legend-rule" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </Cell>

      <Cell at={[6, 12, 9, 10]} className="ab-head index-tag">
        <MobileEdge open />
        <span className="flex items-center gap-2">
          <span aria-hidden className="ab-marker" />
          {POWDER.howLabel}
        </span>
        <span className="tabular-nums">
          [{padIndex(0)}&ndash;{padIndex(POWDER.how.length - 1)}]
        </span>
      </Cell>

      <Cell at={[6, 12, 10, 14]} className="es-list">
        <MobileEdge />
        <p data-reveal className="ab-copy">
          {POWDER.howIntro}
        </p>
        <ol className="vm-legend">
          {POWDER.how.map((item, i) => (
            <li key={item} data-reveal className="vm-legend-item index-tag">
              <span className="tabular-nums opacity-60">[{padIndex(i)}]</span>
              <span className="vm-legend-rule" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </Cell>

      <Cell at={[0, 8, 14, 16]} className="plate-statement">
        <MobileEdge open />
        <p data-reveal className="ab-statement">
          {POWDER.statement[0]}
          <span className="ab-statement-muted">{POWDER.statement[1]}</span>
        </p>
      </Cell>

      <Cell at={[8, 12, 14, 16]} className="plate-cta">
        <MobileEdge />
        <BrandButton href={POWDER.cta.href} font="sans" data-reveal>
          {POWDER.cta.label}
        </BrandButton>
      </Cell>
    </SectionGrid>
  );
}
