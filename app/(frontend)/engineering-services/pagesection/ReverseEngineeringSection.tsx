"use client";

import Copy from "@/app/(frontend)/components/Copy";
import { useRef } from "react";
import Image from "next/image";
import BrandButton from "@/app/(frontend)/components/BrandButton";
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
import { REVERSE, REVERSE_CAPABILITIES } from "./services";

/* Story block: the About story plate without its closing row. */
const STORY_H: HLine[] = [
  [3, 0, 12],
  [4, 0, 12],
  [11, 0, 12],
];
const STORY_V: VLine[] = [
  [0, 0, 11],
  [12, 0, 11],
  [8, 0, 3],
  [6, 4, 11],
];
const STORY_JOINS: Join[] = [
  [0, 11, { down: true }],
  [12, 11, { down: true }],
];

/* Capability grid: the About principles grid, intro cell plus five tiles. */
const GRID_H: HLine[] = [
  [1, 0, 12],
  [8, 0, 12],
  [15, 0, 12],
];
const GRID_V: VLine[] = [
  [0, 0, 15],
  [12, 0, 15],
  [4, 1, 15],
  [8, 1, 15],
];
const GRID_JOINS: Join[] = [
  [0, 15, { down: true }],
  [8, 15, { down: true }],
  [12, 15, { down: true }],
];

const CLOSE_V: VLine[] = [
  [0, 0, 2],
  [12, 0, 2],
  [8, 0, 2],
];

export default function ReverseEngineeringSection() {
  const ref = useRef<HTMLElement>(null);
  usePlateMotion(ref, { image: "rise" });
  useLetterScrub(ref);

  return (
    <SectionGrid
      ref={ref}
      id="reverse-engineering"
      aria-labelledby="reverse-engineering-heading"
      rows={16}
      tone="page"
      outerV={false}
      className="re-section plate-auto flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)] scroll-mt-16 xl:scroll-mt-0"
    >
      <PlateBlock rows={11}>
        <Frame h={STORY_H} v={STORY_V} joins={STORY_JOINS} />

        <Cell at={[0, 8, 0, 3]} className="plate-title">
          <MobileEdge open />
          <Eyebrow data-reveal index={REVERSE.index}>
            {REVERSE.eyebrow}
          </Eyebrow>
          <H2Heading id="reverse-engineering-heading">
            {REVERSE.heading[0]}
            <span className="ab-statement-muted">{REVERSE.heading[1]}</span>
          </H2Heading>
        </Cell>

        <Cell at={[8, 12, 0, 3]} className="plate-lede">
          <MobileEdge />
          <Copy data-reveal variant="lede" size="sm">
            {REVERSE.lede}
          </Copy>
        </Cell>

        <Cell at={[0, 12, 3, 4]} className="ab-head index-tag">
          <MobileEdge open />
          <span className="flex items-center gap-2">
            <span aria-hidden className="ab-marker" />
            {REVERSE.storyLabel}
          </span>
          <span className="tabular-nums">{REVERSE.storyMeta}</span>
        </Cell>

        <Cell at={[0, 6, 4, 11]} className="st-media">
          <MobileEdge />
          <div data-wipe className="plate-media">
            <Image
              src={REVERSE.media.src}
              alt={REVERSE.media.alt}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
              style={{ objectPosition: REVERSE.media.objectPosition }}
            />
            <Corners tone="light" />
          </div>
        </Cell>

        <Cell at={[6, 12, 4, 11]} className="st-story">
          <MobileEdge />
          {REVERSE.paragraphs.map((paragraph, i) => (
            <div key={paragraph} className="st-story-item">
              <span className="index-tag tabular-nums opacity-60">[{padIndex(i)}]</span>
              <Copy data-letters variant="title">
                {paragraph}
              </Copy>
            </div>
          ))}
        </Cell>
      </PlateBlock>

      <PlateBlock rows={15}>
        <Frame h={GRID_H} v={GRID_V} joins={GRID_JOINS} />

        <Cell at={[0, 12, 0, 1]} className="ab-head index-tag">
          <MobileEdge open />
          <span className="flex items-center gap-2">
            <span aria-hidden className="ab-marker" />
            {REVERSE.capabilitiesLabel}
          </span>
          <span className="tabular-nums">
            [{padIndex(0)}&ndash;{padIndex(REVERSE_CAPABILITIES.length - 1)}]
          </span>
        </Cell>

        <Cell at={[0, 4, 1, 8]} className="dr-principles-intro">
          <MobileEdge />
          <Copy
            data-reveal
            variant="statement"
          >
            {REVERSE.capabilitiesLabel}
          </Copy>
          <span aria-hidden className="dr-principles-count ab-outline">
            {String(REVERSE_CAPABILITIES.length).padStart(2, "0")}
          </span>
        </Cell>

        {REVERSE_CAPABILITIES.map((capability, i) => {
          const slot = i + 1;
          const c = (slot % 3) * 4;
          const r = slot < 3 ? 1 : 8;
          return (
            <Cell
              key={capability.id}
              at={[c, c + 4, r, r + 7]}
              as="article"
              className="vm-principle im-tile-short im-tile-invert re-tile"
              data-redraw=""
              tabIndex={0}
              aria-labelledby={`reverse-${capability.id}`}
            >
              <MobileEdge />
              <p className="ab-head index-tag vm-principle-head">
                <span>Capability</span>
                <span className="tabular-nums">[{padIndex(i)}]</span>
              </p>
              <div data-draw className="vm-principle-glyph dot-field-mark">
                <PlusMark tone="page" className="plus-at-tl z-10" />
                <PlusMark tone="page" className="plus-at-tr z-10" />
                <PlusMark tone="page" className="plus-at-bl z-10" />
                <PlusMark tone="page" className="plus-at-br z-10" />
                <IsoGlyph kind={capability.icon} className="vm-principle-mark" />
              </div>
              <div className="vm-principle-copy">
                <H3Heading id={`reverse-${capability.id}`} data-reveal variant="title" size="sm">
                  {capability.title}
                </H3Heading>
                <Copy data-reveal variant="caption">
                  {capability.body}
                </Copy>
              </div>
            </Cell>
          );
        })}
      </PlateBlock>

      <PlateBlock rows={2}>
        <Frame h={[]} v={CLOSE_V} />

        <Cell at={[0, 8, 0, 2]} as="blockquote" className="st-closing m-0">
          <MobileEdge />
          <Copy data-reveal variant="statement">{REVERSE.closing}</Copy>
        </Cell>

        <Cell at={[8, 12, 0, 2]} className="plate-cta">
          <MobileEdge />
          <BrandButton href={REVERSE.cta.href} tone="steel" data-reveal>
            {REVERSE.cta.label}
          </BrandButton>
        </Cell>
      </PlateBlock>
    </SectionGrid>
  );
}
