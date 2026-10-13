"use client";

import Copy from "@/app/(frontend)/components/Copy";
import { useRef } from "react";
import Image from "next/image";
import IsoGlyph from "@/app/(frontend)/components/IsoGlyph";
import H2Heading from "@/app/(frontend)/components/H2Heading";
import H3Heading from "@/app/(frontend)/components/H3Heading";
import PlusMark from "@/app/(frontend)/components/PlusMark";
import SectionGrid from "@/app/(frontend)/components/SectionGrid";
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
import { DRIVES, PRINCIPLES } from "./about";
import { BandMobileRails, BandRails } from "./bands";

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

const PRINCIPLE_H: HLine[] = [
  [1, 0, 12],
  [8, 0, 12],
];
const PRINCIPLE_V: VLine[] = [
  [0, 0, 15],
  [12, 0, 15],
  [4, 1, 15],
  [8, 1, 15],
];

export default function VisionMissionSection() {
  const ref = useRef<HTMLElement>(null);
  usePlateMotion(ref, { image: "rise", phoneNotes: true });

  return (
    <SectionGrid
      ref={ref}
      id="vision-mission"
      aria-labelledby="vision-mission-heading"
      rows={16}
      tone="page"
      outerV={false}
      className="plate-auto flex flex-col bg-steel text-cream [--page-bg:var(--steel)] [--page-ink:var(--cream)] scroll-mt-16 xl:scroll-mt-0"
    >
      <PlateBlock rows={3}>
        <Frame h={HEAD_H} v={HEAD_V} joins={HEAD_JOINS} />

        <Cell at={[0, 8, 0, 3]} className="plate-title">
          <MobileEdge open />
          <Eyebrow data-reveal index={DRIVES.index}>
            {DRIVES.eyebrow}
          </Eyebrow>
          <H2Heading id="vision-mission-heading">
            {DRIVES.heading[0]}
            <span className="ab-statement-muted">{DRIVES.heading[1]}</span>
          </H2Heading>
        </Cell>

        <Cell at={[8, 12, 0, 3]} className="plate-lede">
          <MobileEdge />
          <Copy
            data-reveal
            variant="lede"
          >
            {DRIVES.intro}
          </Copy>
        </Cell>
      </PlateBlock>

      <div className="solutions-sheet dr-bands">
        {DRIVES.bands.map((band, index) => (
          <article
            key={band.id}
            id={band.id}
            data-image={band.imageSide}
            data-drift-band=""
            aria-labelledby={`${band.id}-title`}
            className="solutions-band scroll-mt-16 xl:scroll-mt-0"
          >
            <BandRails last={index === DRIVES.bands.length - 1} />

            <div className="solutions-plate">
              <div data-wipe className="solutions-plate-shot">
                <Image
                  src={band.media.src}
                  alt={band.media.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: band.media.objectPosition }}
                />
                <p className="solutions-callout index-tag">
                  {band.callout.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
                <Corners tone="light" />
              </div>
              <BandMobileRails />
            </div>

            <div data-drift className="solutions-note dr-note">
              <div className="solutions-note-copy dr-note-copy">
                <p className="solutions-band-kicker index-tag">
                  <span aria-hidden className="solutions-band-mark" />
                  [{padIndex(index)}]
                </p>
                <H3Heading id={`${band.id}-title`} variant="statement">
                  {band.label}
                </H3Heading>
                <Copy variant="lead">{band.lead}</Copy>
                {band.paragraphs.length ? (
                  <div className="ab-copy dr-note-body">
                    {band.paragraphs.map((paragraph) => (
                      <Copy key={paragraph} variant="body">
                        {paragraph}
                      </Copy>
                    ))}
                  </div>
                ) : null}
              </div>
              <p aria-hidden className="dr-note-foot index-tag">
                <span>{band.label}</span>
                <span className="tabular-nums">
                  [{padIndex(index)}/{padIndex(DRIVES.bands.length - 1)}]
                </span>
              </p>
              <BandMobileRails />
            </div>
          </article>
        ))}
      </div>

      <PlateBlock rows={15}>
        <Frame h={PRINCIPLE_H} v={PRINCIPLE_V} />

        <Cell at={[0, 12, 0, 1]} className="ab-head index-tag">
          <MobileEdge open />
          <span className="flex items-center gap-2">
            <span aria-hidden className="ab-marker" />
            {DRIVES.principlesLabel}
          </span>
          <span className="tabular-nums">
            [{padIndex(0)}&ndash;{padIndex(PRINCIPLES.length - 1)}]
          </span>
        </Cell>

        <Cell at={[0, 4, 1, 8]} className="dr-principles-intro">
          <MobileEdge />
          <Copy data-reveal variant="statement">
            {DRIVES.principlesLabel}
          </Copy>
          <span aria-hidden className="dr-principles-count ab-outline">
            {String(PRINCIPLES.length).padStart(2, "0")}
          </span>
        </Cell>

        {PRINCIPLES.map((principle, i) => {
          const slot = i + 1;
          const c = (slot % 3) * 4;
          const r = slot < 3 ? 1 : 8;
          return (
            <Cell
              key={principle.id}
              at={[c, c + 4, r, r + 7]}
              as="article"
              className="vm-principle im-tile-short"
              data-redraw=""
              tabIndex={0}
              aria-labelledby={`principle-${principle.id}`}
            >
              <MobileEdge />
              <p className="ab-head index-tag vm-principle-head">
                <span>Principle</span>
                <span className="tabular-nums">[{padIndex(i)}]</span>
              </p>
              <div data-draw className="vm-principle-glyph dot-field-mark">
                <PlusMark tone="page" className="plus-at-tl z-10" />
                <PlusMark tone="page" className="plus-at-tr z-10" />
                <PlusMark tone="page" className="plus-at-bl z-10" />
                <PlusMark tone="page" className="plus-at-br z-10" />
                <IsoGlyph kind={principle.icon} className="vm-principle-mark" />
              </div>
              <div className="vm-principle-copy">
                <H3Heading id={`principle-${principle.id}`} data-reveal variant="title" size="sm">
                  {principle.title}
                </H3Heading>
                <Copy data-reveal variant="caption">
                  {principle.body}
                </Copy>
              </div>
            </Cell>
          );
        })}
      </PlateBlock>
    </SectionGrid>
  );
}
