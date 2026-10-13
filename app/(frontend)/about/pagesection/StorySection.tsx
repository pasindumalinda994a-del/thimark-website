"use client";

import Copy from "@/app/(frontend)/components/Copy";
import { useRef } from "react";
import Image from "next/image";
import BrandButton from "@/app/(frontend)/components/BrandButton";
import H2Heading from "@/app/(frontend)/components/H2Heading";
import SectionGrid from "@/app/(frontend)/components/SectionGrid";
import { useLetterScrub } from "@/app/(frontend)/components/useLetterScrub";
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
import { padIndex } from "@/app/(frontend)/homesections/StoryProgress";
import { STORY } from "./about";

const H: HLine[] = [
  [3, 0, 12],
  [4, 0, 12],
  [11, 0, 12],
  [14, 8, 12],
];

const V: VLine[] = [
  [0, 0, 16],
  [12, 0, 16],
  [8, 0, 3],
  [6, 4, 11],
  [8, 11, 16],
];

export default function StorySection() {
  const ref = useRef<HTMLElement>(null);
  usePlateMotion(ref, { image: "rise" });
  useLetterScrub(ref);

  return (
    <SectionGrid
      ref={ref}
      id="story"
      aria-labelledby="story-heading"
      rows={16}
      tone="page"
      outerV={false}
      className="flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)] scroll-mt-16 xl:scroll-mt-0"
    >
      <Frame h={H} v={V} />

      <Cell at={[0, 8, 0, 3]} className="plate-title">
        <MobileEdge open />
        <Eyebrow data-reveal index={STORY.index}>
          {STORY.eyebrow}
        </Eyebrow>
        <H2Heading id="story-heading">
          {STORY.heading[0]}
          <span className="ab-statement-muted">{STORY.heading[1]}</span>
        </H2Heading>
      </Cell>

      <Cell at={[8, 12, 0, 3]} className="plate-lede">
        <MobileEdge />
        <Copy
          data-reveal
          variant="lede"
        >
          {STORY.lede}
        </Copy>
      </Cell>

      <Cell at={[0, 12, 3, 4]} className="ab-head index-tag">
        <MobileEdge open />
        <span className="flex items-center gap-2">
          <span aria-hidden className="ab-marker" />
          {STORY.storyLabel}
        </span>
        <span className="tabular-nums">
          {STORY.since} [{padIndex(0)}&ndash;{padIndex(STORY.paragraphs.length - 1)}]
        </span>
      </Cell>

      <Cell at={[0, 6, 4, 11]} className="st-media">
        <MobileEdge />
        <div data-wipe className="plate-media">
          <Image
            src={STORY.media.src}
            alt={STORY.media.alt}
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
            style={{ objectPosition: STORY.media.objectPosition }}
          />
          <Corners tone="light" />
        </div>
      </Cell>

      <Cell at={[6, 12, 4, 11]} className="st-story">
        <MobileEdge />
        {STORY.paragraphs.map((paragraph, i) => (
          <div key={paragraph} className="st-story-item">
            <span className="index-tag tabular-nums opacity-60">[{padIndex(i)}]</span>
            <Copy data-letters variant="title">
              {paragraph}
            </Copy>
          </div>
        ))}
      </Cell>

      <Cell at={[0, 8, 11, 16]} as="blockquote" className="st-closing m-0">
        <MobileEdge />
        <Copy data-reveal variant="statement">{STORY.closing}</Copy>
      </Cell>

      <Cell at={[8, 12, 11, 14]} className="plate-lede st-scope">
        <MobileEdge open />
        <p data-reveal className="index-tag opacity-70">
          {STORY.scopeLabel}
        </p>
        <ol className="vm-legend">
          {STORY.scope.map((item, i) => (
            <li key={item} data-reveal className="vm-legend-item index-tag">
              <span className="tabular-nums opacity-60">[{padIndex(i)}]</span>
              <span className="vm-legend-rule" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </Cell>

      <Cell at={[8, 12, 14, 16]} className="plate-cta">
        <MobileEdge />
        <BrandButton href={STORY.cta.href} tone="steel" data-reveal>
          {STORY.cta.label}
        </BrandButton>
      </Cell>
    </SectionGrid>
  );
}
