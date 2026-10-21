"use client";

import { useRef } from "react";
import Image from "next/image";
import BrandButton from "@/app/(frontend)/components/BrandButton";
import Copy from "@/app/(frontend)/components/Copy";
import H1Heading from "@/app/(frontend)/components/H1Heading";
import PhraseBar from "@/app/(frontend)/components/PhraseBar";
import SectionGrid from "@/app/(frontend)/components/SectionGrid";
import { HERO } from "./about";
import { usePlateMotion } from "@/app/(frontend)/components/usePlateMotion";
import {
  Cell,
  Corners,
  Frame,
  MobileEdge,
  type HLine,
  type VLine,
} from "@/app/(frontend)/components/plate";

export type HeroCopy = {
  eyebrow: string;
  heading: readonly [string, string];
  intro: string;
  /** Optional second paragraph, set lighter under the intro. */
  body?: string;
  supporting: readonly string[];
  cta: { label: string; href: string };
  /** Optional second button; splits the bar row into phrases, secondary and primary. */
  secondary?: { label: string; href: string };
  image: { src: string; alt: string; objectPosition: string };
  caption: readonly [string, string];
};

const H: HLine[] = [
  [4, 0, 12],
  [12, 0, 12],
];

export default function AboutHero({
  id = "about-hero",
  copy = HERO,
  ctaCol = 9,
}: {
  id?: string;
  copy?: HeroCopy;
  /** Column where the phrase bar ends and the CTA cell begins. */
  ctaCol?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  usePlateMotion(ref, { image: "rise" });

  const secondary = copy.secondary;
  // With two buttons the bar gives up columns 6–9 to the secondary CTA (3 cols each).
  const barEnd = secondary ? 6 : ctaCol;
  const primaryCol = secondary ? 9 : ctaCol;

  const V: VLine[] = [
    [0, 4, 14],
    [12, 4, 14],
    [barEnd, 12, 14],
    ...(secondary ? ([[primaryCol, 12, 14]] as VLine[]) : []),
  ];

  return (
    <SectionGrid
      ref={ref}
      id={id}
      aria-labelledby={`${id}-heading`}
      rows={14}
      tone="page"
      outerV={false}
      className="ah-section flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)]"
    >
      <Frame h={H} v={V} />

      <Cell at={[0, 8, 0, 4]} className="ah-title">
        <MobileEdge open />
        <p data-reveal className="eyebrow">
          {copy.eyebrow}
        </p>
        <H1Heading id={`${id}-heading`}>
          {copy.heading[0]}{" "}
          <span className="ab-statement-muted">{copy.heading[1]}</span>
        </H1Heading>
      </Cell>

      <Cell at={[8, 12, 0, 4]} className="ah-copy">
        <MobileEdge />
        <Copy data-reveal variant="lede" size="sm" className="ah-intro">
          {copy.intro}
        </Copy>
        {copy.body ? (
          <Copy data-reveal variant="body" className="ah-intro ah-body ab-copy">
            {copy.body}
          </Copy>
        ) : null}
      </Cell>

      <Cell at={[0, 12, 4, 12]} className="ah-media">
        <MobileEdge />
        <div data-wipe className="plate-media">
          <Image
            src={copy.image.src}
            alt={copy.image.alt}
            fill
            preload
            sizes="(min-width: 1280px) calc(100vw - 260px), 100vw"
            className="object-cover"
            style={{ objectPosition: copy.image.objectPosition }}
          />
          <span aria-hidden className="ah-media-scrim" />
          <Corners tone="light" />
          <p aria-hidden className="ah-media-caption index-tag">
            <span>{copy.caption[0]}</span>
            <span>{copy.caption[1]}</span>
          </p>
        </div>
      </Cell>

      <Cell at={[0, barEnd, 12, 14]} className="ah-bar">
        <MobileEdge />
        <PhraseBar phrases={copy.supporting} />
      </Cell>

      {secondary ? (
        // Phones stack both buttons full-width; from md up each cell keeps its grid seat.
        <div className="ah-ctas relative md:contents">
          <MobileEdge />
          <Cell at={[barEnd, primaryCol, 12, 14]} className="plate-cta">
            <BrandButton
              href={secondary.href}
              direction={secondary.href.startsWith("#") ? "down" : "right"}
              tone="outline"
              data-reveal
            >
              {secondary.label}
            </BrandButton>
          </Cell>
          <Cell at={[primaryCol, 12, 12, 14]} className="plate-cta">
            <BrandButton
              href={copy.cta.href}
              direction={copy.cta.href.startsWith("#") ? "down" : "right"}
              tone="steel"
              font="sans"
              data-reveal
            >
              {copy.cta.label}
            </BrandButton>
          </Cell>
        </div>
      ) : (
        <Cell at={[primaryCol, 12, 12, 14]} className="plate-cta">
          <MobileEdge />
          <BrandButton
            href={copy.cta.href}
            direction={copy.cta.href.startsWith("#") ? "down" : "right"}
            font="sans"
            data-reveal
          >
            {copy.cta.label}
          </BrandButton>
        </Cell>
      )}
    </SectionGrid>
  );
}
