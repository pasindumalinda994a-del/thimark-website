"use client";

import Copy, { copyClass } from "@/app/(frontend)/components/Copy";
import { useRef } from "react";
import Image from "next/image";
import BrandButton from "@/app/(frontend)/components/BrandButton";
import DirectionPulse from "@/app/(frontend)/components/DirectionPulse";
import IsoGlyph from "@/app/(frontend)/components/IsoGlyph";
import H2Heading from "@/app/(frontend)/components/H2Heading";
import H3Heading from "@/app/(frontend)/components/H3Heading";
import PlusMark from "@/app/(frontend)/components/PlusMark";
import SectionGrid from "@/app/(frontend)/components/SectionGrid";
import { useLetterScrub } from "@/app/(frontend)/components/useLetterScrub";
import { usePlateMotion } from "@/app/(frontend)/components/usePlateMotion";
import {
  Cell,
  Corners,
  Eyebrow,
  Frame,
  MobileEdge,
  PlateBlock,
  type HLine,
  type Join,
  type VLine,
} from "@/app/(frontend)/components/plate";
import { padIndex } from "@/app/(frontend)/homesections/StoryProgress";
import { COMPONENTS, PROCESS, RANGE } from "./automotive";

const STORY_H: HLine[] = [
  [3, 0, 12],
  [4, 0, 12],
];

const STORY_V: VLine[] = [
  [0, 0, 11],
  [12, 0, 11],
  [8, 0, 3],
  [6, 4, 11],
];

const RANGE_H: HLine[] = [
  [0, 0, 12],
  [1, 0, 12],
  [8, 0, 12],
  [15, 0, 12],
  [16, 8, 12],
];

const RANGE_V: VLine[] = [
  [0, 0, 18],
  [12, 0, 18],
  [4, 1, 15],
  [8, 1, 15],
  [8, 15, 18],
];

const RANGE_JOINS: Join[] = [
  [0, 0, { up: true }],
  [6, 0, { up: true }],
  [12, 0, { up: true }],
];

export default function RangeSection() {
  const ref = useRef<HTMLElement>(null);
  usePlateMotion(ref, { image: "rise" });
  useLetterScrub(ref);

  return (
    <SectionGrid
      ref={ref}
      id="product-range"
      aria-labelledby="product-range-heading"
      rows={16}
      tone="page"
      outerV={false}
      className="rg-section plate-auto flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)] scroll-mt-16 xl:scroll-mt-0"
    >
      <PlateBlock rows={11}>
        <Frame h={STORY_H} v={STORY_V} />

        <Cell at={[0, 8, 0, 3]} className="plate-title">
          <MobileEdge open />
          <Eyebrow data-reveal index={RANGE.index}>
            {RANGE.eyebrow}
          </Eyebrow>
          <H2Heading id="product-range-heading">
            {RANGE.heading[0]}
            <span className="ab-statement-muted">{RANGE.heading[1]}</span>
          </H2Heading>
        </Cell>

        <Cell at={[8, 12, 0, 3]} className="plate-lede">
          <MobileEdge />
          <Copy
            data-reveal
            variant="lede"
          >
            {RANGE.lede}
          </Copy>
        </Cell>

        <Cell at={[0, 12, 3, 4]} className="ab-head index-tag">
          <MobileEdge open />
          <span className="flex items-center gap-2">
            <span aria-hidden className="ab-marker" />
            {RANGE.headLabel}
          </span>
          <span className="tabular-nums">
            {RANGE.headMeta} [{padIndex(0)}&ndash;{padIndex(RANGE.paragraphs.length - 1)}]
          </span>
        </Cell>

        <Cell at={[0, 6, 4, 11]} className="st-media">
          <MobileEdge />
          <div data-wipe className="plate-media">
            <Image
              src={RANGE.media.src}
              alt={RANGE.media.alt}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
              style={{ objectPosition: RANGE.media.objectPosition }}
            />
            <Corners tone="light" />
          </div>
        </Cell>

        <Cell at={[6, 12, 4, 11]} className="st-story">
          <MobileEdge />
          {RANGE.paragraphs.map((paragraph, i) => (
            <div key={paragraph} className="st-story-item">
              <span className="index-tag tabular-nums opacity-60">[{padIndex(i)}]</span>
              <Copy data-letters variant="title">
                {paragraph}
              </Copy>
            </div>
          ))}
        </Cell>
      </PlateBlock>

      <PlateBlock rows={18}>
        <Frame h={RANGE_H} v={RANGE_V} joins={RANGE_JOINS} />

        <Cell at={[0, 12, 0, 1]} className="ab-head index-tag">
          <MobileEdge open />
          <span className="flex items-center gap-2">
            <span aria-hidden className="ab-marker" />
            {RANGE.rangeLabel}
          </span>
          <span className="tabular-nums">
            [{padIndex(0)}&ndash;{padIndex(COMPONENTS.length - 1)}]
          </span>
        </Cell>

        <Cell at={[0, 4, 1, 8]} className="dr-principles-intro">
          <MobileEdge />
          <Copy
            data-reveal
            variant="statement"
          >
            {RANGE.rangeLabel}
          </Copy>
          <span aria-hidden className="dr-principles-count ab-outline">
            {String(COMPONENTS.length).padStart(2, "0")}
          </span>
        </Cell>

        {COMPONENTS.map((group, i) => {
          const slot = i + 1;
          const c = (slot % 3) * 4;
          const r = slot < 3 ? 1 : 8;
          return (
            <Cell
              key={group.id}
              at={[c, c + 4, r, r + 7]}
              as="article"
              className="vm-principle im-tile-short im-tile-invert rg-tile"
              data-redraw=""
              tabIndex={0}
              aria-labelledby={`range-${group.id}`}
            >
              <MobileEdge />
              <p className="ab-head index-tag vm-principle-head">
                <span>Range</span>
                <span className="tabular-nums">[{padIndex(i)}]</span>
              </p>
              <div data-draw className="vm-principle-glyph dot-field-mark">
                <PlusMark tone="page" className="plus-at-tl z-10" />
                <PlusMark tone="page" className="plus-at-tr z-10" />
                <PlusMark tone="page" className="plus-at-bl z-10" />
                <PlusMark tone="page" className="plus-at-br z-10" />
                <IsoGlyph kind={group.icon} className="vm-principle-mark" />
              </div>
              <div className="vm-principle-copy">
                <H3Heading id={`range-${group.id}`} data-reveal variant="title" size="sm">
                  {group.title}
                </H3Heading>
                <ul data-reveal className={`rc-distinctions rg-list ${copyClass("caption")}`}>
                  {group.items.map((item) => (
                    <li key={item}>
                      <span aria-hidden className="ab-marker" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Cell>
          );
        })}

        <Cell at={[0, 8, 15, 18]} as="blockquote" className="st-closing m-0">
          <MobileEdge />
          <Copy data-reveal variant="statement">{RANGE.closing}</Copy>
        </Cell>

        <Cell at={[8, 12, 15, 16]} className="rg-next index-tag hidden md:flex" aria-hidden>
          <span className="opacity-70">Next [{PROCESS.index}]</span>
          <span className="flex items-center gap-3">
            {PROCESS.eyebrow}
            <DirectionPulse direction="down" />
          </span>
        </Cell>

        <Cell at={[8, 12, 16, 18]} className="plate-cta">
          <MobileEdge />
          <BrandButton href={RANGE.cta.href} direction="down" tone="steel" data-reveal>
            {RANGE.cta.label}
          </BrandButton>
        </Cell>
      </PlateBlock>
    </SectionGrid>
  );
}
