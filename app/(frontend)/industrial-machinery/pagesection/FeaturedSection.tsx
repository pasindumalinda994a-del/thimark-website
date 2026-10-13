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
import { FEATURED } from "./machinery";

const H: HLine[] = [
  [3, 0, 12],
  [4, 0, 12],
  [11, 0, 12],
  [16, 8, 12],
];

const V: VLine[] = [
  [0, 0, 18],
  [12, 0, 18],
  [8, 0, 3],
  [6, 4, 11],
  [8, 11, 18],
];

export default function FeaturedSection() {
  const ref = useRef<HTMLElement>(null);
  usePlateMotion(ref, { image: "rise" });
  useLetterScrub(ref);

  return (
    <SectionGrid
      ref={ref}
      id="kilgarrah"
      aria-labelledby="kilgarrah-heading"
      rows={18}
      tone="page"
      outerV={false}
      className="flex flex-col bg-steel text-cream [--page-bg:var(--steel)] [--page-ink:var(--cream)] scroll-mt-16 xl:scroll-mt-0"
    >
      <Frame h={H} v={V} />

      <Cell at={[0, 8, 0, 3]} className="plate-title">
        <MobileEdge open />
        <Eyebrow data-reveal index={FEATURED.index}>
          {FEATURED.eyebrow}
        </Eyebrow>
        <H2Heading id="kilgarrah-heading">
          {FEATURED.heading[0]}
          <span className="ab-statement-muted">{FEATURED.heading[1]}</span>
        </H2Heading>
      </Cell>

      <Cell at={[8, 12, 0, 3]} className="plate-lede">
        <MobileEdge />
        <Copy
          data-reveal
          variant="lede"
        >
          {FEATURED.lede}
        </Copy>
      </Cell>

      <Cell at={[0, 12, 3, 4]} className="ab-head index-tag">
        <MobileEdge open />
        <span className="flex items-center gap-2">
          <span aria-hidden className="ab-marker" />
          {FEATURED.storyLabel}
        </span>
        <span className="tabular-nums">
          [{padIndex(0)}&ndash;{padIndex(FEATURED.paragraphs.length - 1)}]
        </span>
      </Cell>

      <Cell at={[0, 6, 4, 11]} className="st-media">
        <MobileEdge />
        <div data-wipe className="plate-media">
          <Image
            src={FEATURED.media.src}
            alt={FEATURED.media.alt}
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
            style={{ objectPosition: FEATURED.media.objectPosition }}
          />
          <Corners tone="light" />
          <p aria-hidden className="ah-media-caption index-tag">
            <span>{FEATURED.caption[0]}</span>
            <span>{FEATURED.caption[1]}</span>
          </p>
        </div>
      </Cell>

      <Cell at={[6, 12, 4, 11]} className="st-story">
        <MobileEdge />
        {FEATURED.paragraphs.map((paragraph, i) => (
          <div key={paragraph} className="st-story-item">
            <span className="index-tag tabular-nums opacity-60">[{padIndex(i)}]</span>
            <Copy data-letters variant="title">
              {paragraph}
            </Copy>
          </div>
        ))}
      </Cell>

      <Cell at={[0, 8, 11, 18]} as="blockquote" className="st-closing m-0">
        <MobileEdge />
        <Copy data-reveal variant="statement">{FEATURED.closing}</Copy>
      </Cell>

      <Cell at={[8, 12, 11, 16]} className="plate-lede st-scope im-glance">
        <MobileEdge open />
        <p data-reveal className="index-tag opacity-70">
          {FEATURED.glanceLabel}
        </p>
        <ol className="vm-legend">
          {FEATURED.glance.map((fact, i) => (
            <li key={fact.label} data-reveal className="vm-legend-item index-tag">
              <span className="tabular-nums opacity-60">[{padIndex(i)}]</span>
              <span className="vm-legend-rule" aria-hidden />
              <span className="im-glance-fact">
                <span className="opacity-60">{fact.label}</span>{" "}
                <span className="im-glance-value">{fact.value}</span>
              </span>
            </li>
          ))}
        </ol>
      </Cell>

      <Cell at={[8, 12, 16, 18]} className="plate-cta">
        <MobileEdge />
        <BrandButton href={FEATURED.cta.href} font="sans" data-reveal>
          {FEATURED.cta.label}
        </BrandButton>
      </Cell>
    </SectionGrid>
  );
}
