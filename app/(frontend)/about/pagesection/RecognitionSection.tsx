"use client";

import Copy from "@/app/(frontend)/components/Copy";
import { useRef } from "react";
import Image from "next/image";
import H2Heading from "@/app/(frontend)/components/H2Heading";
import H3Heading from "@/app/(frontend)/components/H3Heading";
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
import AwardSeal from "./AwardSeal";
import { AWARDS, RECOGNITION } from "./about";
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

const GRID_H: HLine[] = [
  [0, 0, 12],
  [6, 0, 12],
  [12, 0, 12],
];
const GRID_V: VLine[] = [
  [0, 0, 15],
  [12, 0, 15],
  [3, 0, 15],
  [6, 0, 12],
  [9, 0, 12],
];
const GRID_JOINS: Join[] = [
  [0, 0, { up: true }],
  [6, 0, { up: true }],
  [12, 0, { up: true }],
];

export default function RecognitionSection() {
  const ref = useRef<HTMLElement>(null);
  usePlateMotion(ref, { image: "rise", phoneNotes: true });

  const { band } = RECOGNITION;

  return (
    <SectionGrid
      ref={ref}
      id="recognition"
      aria-labelledby="recognition-heading"
      rows={16}
      tone="page"
      outerV={false}
      className="plate-auto flex flex-col bg-steel text-cream [--page-bg:var(--steel)] [--page-ink:var(--cream)] scroll-mt-16 xl:scroll-mt-0"
    >
      <PlateBlock rows={3}>
        <Frame h={HEAD_H} v={HEAD_V} joins={HEAD_JOINS} />

        <Cell at={[0, 8, 0, 3]} className="plate-title">
          <MobileEdge open />
          <Eyebrow data-reveal index={RECOGNITION.index}>
            {RECOGNITION.eyebrow}
          </Eyebrow>
          <H2Heading id="recognition-heading">
            {RECOGNITION.heading[0]}
            <span className="ab-statement-muted">{RECOGNITION.heading[1]}</span>
          </H2Heading>
        </Cell>

        <Cell at={[8, 12, 0, 3]} className="plate-lede">
          <MobileEdge />
          <Copy
            data-reveal
            variant="lede"
          >
            {RECOGNITION.intro}
          </Copy>
        </Cell>
      </PlateBlock>

      <div className="solutions-sheet dr-bands">
        <article
          data-image="right"
          data-drift-band=""
          aria-label={band.label}
          className="solutions-band"
        >
          <BandRails foot={false} />

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
                {band.label}
              </p>
              <Copy variant="lead">{band.body}</Copy>
              <ol className="vm-legend rc-legend">
                {AWARDS.map((award) => (
                  <li key={award.id} className="vm-legend-item index-tag">
                    <span className="tabular-nums opacity-60">[{award.year}]</span>
                    <span className="vm-legend-rule" aria-hidden />
                    <span>{award.name}</span>
                  </li>
                ))}
              </ol>
            </div>
            <p aria-hidden className="dr-note-foot index-tag">
              <span>
                {AWARDS.reduce((sum, award) => sum + award.distinctions.length, 0)} Distinctions
              </span>
              <span className="tabular-nums">
                {AWARDS[AWARDS.length - 1]?.year}&ndash;{AWARDS[0]?.year}
              </span>
            </p>
            <BandMobileRails />
          </div>
        </article>
      </div>

      <PlateBlock rows={15}>
        <Frame h={GRID_H} v={GRID_V} joins={GRID_JOINS} />

        {AWARDS.map((award, i) => {
          const c = (i % 2) * 6;
          const r = Math.floor(i / 2) * 6;
          return (
            <div key={award.id} className="rc-row md:contents">
              <MobileEdge />
              <Cell at={[c, c + 3, r, r + 6]} className="rc-seal-cell" data-redraw="">
                <div data-draw className="rc-seal dot-field-soft">
                  <Corners />
                  <AwardSeal
                    label={award.seal.label}
                    solid={award.seal.solid}
                    ring={award.ring}
                    year={award.year}
                    className="rc-seal-mark"
                  />
                </div>
              </Cell>
              <Cell
                at={[c + 3, c + 6, r, r + 6]}
                as="article"
                className="rc-award"
                aria-labelledby={`award-${award.id}`}
              >
                <div data-reveal className="rc-award-title">
                  <p className="index-tag flex items-center justify-between gap-3 opacity-80">
                    <span>{award.org}</span>
                    <span className="tabular-nums">[{padIndex(i)}]</span>
                  </p>
                  <H3Heading id={`award-${award.id}`} variant="title">
                    {award.name}
                    <span className="sr-only">, {award.year}</span>
                  </H3Heading>
                </div>
                <ul data-reveal className="rc-distinctions">
                  {award.distinctions.map((line) => (
                    <li key={line}>
                      <span aria-hidden className="ab-marker" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <span aria-hidden className="rc-award-year ab-outline">
                  {award.year}
                </span>
              </Cell>
            </div>
          );
        })}

        <Cell at={[0, 3, 12, 15]} className="plate-lede rc-close-label">
          <MobileEdge open />
          <p data-reveal className="index-tag flex items-center gap-2">
            <span aria-hidden className="ab-marker" />
            {RECOGNITION.closingLabel}
          </p>
        </Cell>

        <Cell at={[3, 12, 12, 15]} as="blockquote" className="st-closing m-0">
          <MobileEdge />
          <Copy data-reveal variant="statement">{RECOGNITION.closing}</Copy>
        </Cell>
      </PlateBlock>
    </SectionGrid>
  );
}
