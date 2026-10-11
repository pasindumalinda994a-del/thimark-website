"use client";

import { useRef } from "react";
import Image from "next/image";
import MaskRevealHeading from "@/app/(frontend)/components/MaskRevealHeading";
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

const H: HLine[] = [[4, 0, 12]];

const V: VLine[] = [
  [0, 4, 14],
  [12, 4, 14],
];

export default function AboutHero() {
  const ref = useRef<HTMLElement>(null);
  usePlateMotion(ref, { image: "rise" });

  return (
    <SectionGrid
      ref={ref}
      id="about-hero"
      aria-labelledby="about-hero-heading"
      rows={14}
      tone="page"
      outerV={false}
      className="flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)]"
    >
      <Frame h={H} v={V} />

      <Cell at={[0, 8, 0, 4]} className="ah-title">
        <MobileEdge open />
        <p data-reveal className="eyebrow">
          {HERO.eyebrow}
        </p>
        <MaskRevealHeading
          as="h1"
          id="about-hero-heading"
          className="font-heading text-[clamp(40px,4.4vw,80px)] leading-[0.89] font-medium tracking-[-0.01em] uppercase"
        >
          {HERO.heading[0]}
          <span className="ab-statement-muted">{HERO.heading[1]}</span>
        </MaskRevealHeading>
      </Cell>

      <Cell at={[8, 12, 0, 4]} className="ah-copy">
        <MobileEdge />
        <p
          data-reveal
          className="ah-intro font-heading text-[clamp(12px,1vw,16px)] leading-[1.15] font-medium uppercase md:text-justify md:[text-align-last:left]"
        >
          {HERO.intro}
        </p>
      </Cell>

      <Cell at={[0, 12, 4, 14]} className="ah-media">
        <MobileEdge />
        <div data-wipe className="plate-media">
          <Image
            src={HERO.image.src}
            alt={HERO.image.alt}
            fill
            priority
            sizes="(min-width: 768px) calc(100vw - 260px), 100vw"
            className="object-cover"
            style={{ objectPosition: HERO.image.objectPosition }}
          />
          <span aria-hidden className="ah-media-scrim" />
          <Corners tone="light" />
          <p aria-hidden className="ah-media-caption index-tag">
            <span>Fig. 01</span>
            <span>Thimark Technocreations (Pvt) Ltd</span>
          </p>
        </div>
      </Cell>
    </SectionGrid>
  );
}
