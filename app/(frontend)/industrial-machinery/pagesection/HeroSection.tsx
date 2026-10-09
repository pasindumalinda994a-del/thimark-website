"use client";

import { useRef } from "react";
import Image from "next/image";
import BrandButton from "@/app/(frontend)/components/BrandButton";
import DirectionPulse from "@/app/(frontend)/components/DirectionPulse";
import MaskRevealHeading from "@/app/(frontend)/components/MaskRevealHeading";
import SectionGrid from "@/app/(frontend)/components/SectionGrid";
import {
  Cell,
  Corners,
  Frame,
  MobileEdge,
  type HLine,
  type VLine,
} from "@/app/(frontend)/components/plate";
import { usePlateMotion } from "@/app/(frontend)/components/usePlateMotion";
import { padIndex } from "@/app/(frontend)/homesections/StoryProgress";
import { HERO } from "./machinery";

const H: HLine[] = [
  [4, 0, 12],
  [12, 0, 12],
];

const V: VLine[] = [
  [0, 4, 14],
  [12, 4, 14],
  [9, 4, 14],
  [6, 12, 14],
];

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  usePlateMotion(ref);

  return (
    <SectionGrid
      ref={ref}
      id="hero"
      aria-labelledby="hero-heading"
      rows={14}
      tone="page"
      outerV={false}
      className="flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)] scroll-mt-16 md:scroll-mt-0"
    >
      <Frame h={H} v={V} />

      <Cell at={[0, 8, 0, 4]} className="ah-title">
        <MobileEdge open />
        <p data-reveal className="eyebrow">
          {HERO.eyebrow}
        </p>
        <MaskRevealHeading
          as="h1"
          id="hero-heading"
          className="font-heading text-[clamp(36px,3.5vw,64px)] leading-[0.89] font-medium tracking-[-0.01em] uppercase"
        >
          {HERO.heading[0]}
          <span className="block">{HERO.heading[1]}</span>
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

      <Cell at={[0, 9, 4, 12]} className="ah-media">
        <MobileEdge />
        <div data-wipe className="plate-media">
          <Image
            src={HERO.media.src}
            alt={HERO.media.alt}
            fill
            priority
            sizes="(min-width: 768px) 60vw, 100vw"
            className="object-cover"
            style={{ objectPosition: HERO.media.objectPosition }}
          />
          <span aria-hidden className="ah-media-scrim" />
          <Corners tone="light" />
          <p aria-hidden className="ah-media-caption index-tag">
            <span>{HERO.caption[0]}</span>
            <span>{HERO.caption[1]}</span>
          </p>
        </div>
      </Cell>

      <Cell at={[9, 12, 4, 12]} className="im-hero-aside">
        <MobileEdge />
        <p data-reveal className="ab-copy">
          {HERO.body}
        </p>
        <div className="im-hero-index">
          <p data-reveal className="index-tag flex items-center gap-2">
            <span aria-hidden className="ab-marker" />
            {HERO.disciplinesLabel}
          </p>
          <ol className="vm-legend">
            {HERO.disciplines.map((item, i) => (
              <li key={item} data-reveal className="vm-legend-item index-tag">
                <span className="tabular-nums opacity-60">[{padIndex(i)}]</span>
                <span className="vm-legend-rule" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </Cell>

      <Cell at={[0, 6, 12, 14]} className="plate-cta">
        <MobileEdge open />
        <BrandButton href={HERO.primary.href} font="sans" data-reveal>
          {HERO.primary.label}
        </BrandButton>
      </Cell>

      <Cell at={[6, 9, 12, 14]} className="plate-cta">
        <MobileEdge />
        <BrandButton href={HERO.secondary.href} tone="steel" data-reveal>
          {HERO.secondary.label}
        </BrandButton>
      </Cell>

      <Cell at={[9, 12, 12, 14]} className="im-hero-next hidden md:flex" aria-hidden>
        <span className="index-tag opacity-70">Next [{HERO.next.index}]</span>
        <span className="flex items-center justify-between gap-3">
          <span className="index-tag">{HERO.next.label}</span>
          <DirectionPulse direction="down" stack="trio" />
        </span>
      </Cell>
    </SectionGrid>
  );
}
