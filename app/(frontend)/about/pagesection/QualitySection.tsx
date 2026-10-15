"use client";

import Copy from "@/app/(frontend)/components/Copy";
import { useRef } from "react";
import Image from "next/image";
import H2Heading from "@/app/(frontend)/components/H2Heading";
import PlusMark, { type PlusArms } from "@/app/(frontend)/components/PlusMark";
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
  type VLine,
} from "@/app/(frontend)/components/plate";
import { padIndex } from "@/app/(frontend)/homesections/StoryProgress";
import { QUALITY } from "./about";

const joinStubDown: PlusArms = { up: false, down: true, left: false, right: false };
const joinStubUp: PlusArms = { up: true, down: false, left: false, right: false };

const H: HLine[] = [
  [3, 0, 12],
  [4, 0, 12],
];

const V: VLine[] = [
  [0, 0, 11],
  [12, 0, 11],
  [8, 0, 3],
  [6, 4, 11],
];

/** Bracketed certification lockup, as on the homepage quality plate. */
export function QualityCred({
  org,
  code,
  sub,
}: {
  org: string;
  code: string;
  sub: string;
}) {
  return (
    <article className="quality-cred">
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
        <p className="quality-cred-org">{org}</p>
        <div className="quality-cred-copy">
          <Copy variant="lead" className="quality-cred-code tabular-nums tracking-[0.06em]">{code}</Copy>
          <p className="quality-cred-sub">{sub}</p>
        </div>
      </div>
    </article>
  );
}

export type QualityCopy = {
  index: string;
  eyebrow: string;
  heading: readonly [string, string];
  lede: string;
  headLabel: string;
  paragraphs: readonly string[];
  media: { src: string; alt: string; objectPosition: string };
  cred: { org: string; code: string; sub: string };
};

export default function QualitySection({
  id = "quality",
  copy = QUALITY,
}: {
  id?: string;
  copy?: QualityCopy;
}) {
  const ref = useRef<HTMLElement>(null);
  usePlateMotion(ref, { image: "rise" });
  useLetterScrub(ref);

  return (
    <SectionGrid
      ref={ref}
      id={id}
      aria-labelledby={`${id}-heading`}
      rows={14}
      tone="page"
      outerV={false}
      className="plate-auto flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)] scroll-mt-16 xl:scroll-mt-0"
    >
      <PlateBlock rows={11}>
        <Frame h={H} v={V} />

        <Cell at={[0, 8, 0, 3]} className="plate-title">
          <MobileEdge open />
          <Eyebrow data-reveal index={copy.index}>
            {copy.eyebrow}
          </Eyebrow>
          <H2Heading id={`${id}-heading`}>
            {copy.heading[0]}{" "}
            <span className="ab-statement-muted">{copy.heading[1]}</span>
          </H2Heading>
        </Cell>

        <Cell at={[8, 12, 0, 3]} className="plate-lede">
          <MobileEdge />
          <Copy
            data-reveal
            variant="lede"
          >
            {copy.lede}
          </Copy>
        </Cell>

        <Cell at={[0, 12, 3, 4]} className="ab-head index-tag">
          <MobileEdge open />
          <span className="flex items-center gap-2">
            <span aria-hidden className="ab-marker" />
            {copy.headLabel}
          </span>
          <span className="tabular-nums">
            {copy.cred.org} {copy.cred.code}
          </span>
        </Cell>

        <Cell at={[0, 6, 4, 11]} className="st-media">
          <MobileEdge />
          <div data-wipe className="plate-media">
            <Image
              src={copy.media.src}
              alt={copy.media.alt}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
              style={{ objectPosition: copy.media.objectPosition }}
            />
            <Corners tone="light" />
          </div>
        </Cell>

        <Cell at={[6, 12, 4, 11]} className="st-story">
          <MobileEdge />
          {copy.paragraphs.map((paragraph, i) => (
            <div key={paragraph} className="st-story-item">
              <span className="index-tag tabular-nums opacity-60">[{padIndex(i)}]</span>
              <Copy data-letters variant="title">
                {paragraph}
              </Copy>
            </div>
          ))}
        </Cell>
      </PlateBlock>
    </SectionGrid>
  );
}
