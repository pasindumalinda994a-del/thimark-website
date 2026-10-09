"use client";

import { useRef } from "react";
import Image from "next/image";
import BrandButton from "@/app/(frontend)/components/BrandButton";
import MaskRevealHeading from "@/app/(frontend)/components/MaskRevealHeading";
import SectionGrid from "@/app/(frontend)/components/SectionGrid";
import {
  Cell,
  Corners,
  Eyebrow,
  Frame,
  MobileEdge,
  type HLine,
  type VLine,
} from "@/app/(frontend)/components/plate";
import { usePlateMotion } from "@/app/(frontend)/components/usePlateMotion";
import { padIndex } from "@/app/(frontend)/homesections/StoryProgress";
import { REVERSE, REVERSE_STEPS } from "./services";

const H: HLine[] = [
  [3, 0, 12],
  [4, 0, 12],
  [10, 0, 12],
  [11, 0, 12],
  [16, 0, 12],
];

const V: VLine[] = [
  [0, 0, 18],
  [12, 0, 18],
  [8, 0, 3],
  [6, 3, 16],
  [8, 16, 18],
];

export default function ReverseEngineeringSection() {
  const ref = useRef<HTMLElement>(null);
  usePlateMotion(ref);

  return (
    <SectionGrid
      ref={ref}
      id="reverse-engineering"
      aria-labelledby="reverse-engineering-heading"
      rows={18}
      tone="page"
      outerV={false}
      className="flex flex-col bg-steel text-cream [--page-bg:var(--steel)] [--page-ink:var(--cream)] scroll-mt-16 md:scroll-mt-0"
    >
      <Frame h={H} v={V} />

      <Cell at={[0, 8, 0, 3]} className="plate-title">
        <MobileEdge open />
        <Eyebrow data-reveal index={REVERSE.index}>
          {REVERSE.eyebrow}
        </Eyebrow>
        <MaskRevealHeading
          id="reverse-engineering-heading"
          className="font-heading text-[clamp(28px,2.5vw,48px)] leading-none font-medium uppercase"
        >
          {REVERSE.heading[0]}
          <span className="block">{REVERSE.heading[1]}</span>
        </MaskRevealHeading>
      </Cell>

      <Cell at={[8, 12, 0, 3]} className="plate-lede">
        <MobileEdge />
        <p
          data-reveal
          className="font-heading text-[clamp(12px,1vw,16px)] leading-[1.1] font-medium uppercase md:text-justify md:[text-align-last:left]"
        >
          {REVERSE.lede}
        </p>
      </Cell>

      <Cell at={[0, 6, 3, 4]} className="ab-head index-tag">
        <MobileEdge open />
        <span className="flex items-center gap-2">
          <span aria-hidden className="ab-marker" />
          {REVERSE.supportLabel}
        </span>
        <span className="tabular-nums">
          [{padIndex(0)}&ndash;{padIndex(REVERSE_STEPS.length - 1)}]
        </span>
      </Cell>

      <Cell at={[0, 6, 4, 10]} className="ov-story">
        <MobileEdge />
        <p
          data-reveal
          className="font-heading text-[clamp(14px,1.15vw,18px)] leading-[1.15] font-medium uppercase"
        >
          {REVERSE.lead}
        </p>
        <div className="ov-story-list">
          {REVERSE_STEPS.map((step, i) => (
            <div key={step.id} data-reveal className="ov-story-item">
              <span className="index-tag tabular-nums" aria-hidden>
                {padIndex(i)}
              </span>
              <div className="flex flex-col gap-1">
                <p className="font-heading text-[clamp(13px,1vw,16px)] leading-none font-medium uppercase">
                  {step.title}
                </p>
                <p className="ab-copy">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Cell>

      <Cell at={[6, 12, 3, 4]} className="ab-head index-tag">
        <MobileEdge open />
        <span>{REVERSE.mediaLabel}</span>
      </Cell>

      <Cell at={[6, 12, 4, 10]} className="ov-media">
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
          <span aria-hidden className="ah-media-scrim" />
          <Corners tone="light" />
          <p aria-hidden className="ah-media-caption index-tag">
            <span>{REVERSE.caption[0]}</span>
            <span>{REVERSE.caption[1]}</span>
          </p>
        </div>
      </Cell>

      <Cell at={[0, 6, 10, 11]} className="ab-head index-tag">
        <MobileEdge open />
        <span className="flex items-center gap-2">
          <span aria-hidden className="ab-marker" />
          {REVERSE.whenLabel}
        </span>
        <span className="tabular-nums">
          [{padIndex(0)}&ndash;{padIndex(REVERSE.when.length - 1)}]
        </span>
      </Cell>

      <Cell at={[0, 6, 11, 16]} className="es-list">
        <MobileEdge />
        <p data-reveal className="ab-copy">
          {REVERSE.whenIntro}
        </p>
        <ol className="vm-legend">
          {REVERSE.when.map((item, i) => (
            <li key={item} data-reveal className="vm-legend-item index-tag">
              <span className="tabular-nums opacity-60">[{padIndex(i)}]</span>
              <span className="vm-legend-rule" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </Cell>

      <Cell at={[6, 12, 10, 11]} className="ab-head index-tag">
        <MobileEdge open />
        <span className="flex items-center gap-2">
          <span aria-hidden className="ab-marker" />
          {REVERSE.provideLabel}
        </span>
        <span className="tabular-nums">
          [{padIndex(0)}&ndash;{padIndex(REVERSE.provide.length - 1)}]
        </span>
      </Cell>

      <Cell at={[6, 12, 11, 16]} className="es-list">
        <MobileEdge />
        <p data-reveal className="ab-copy">
          {REVERSE.provideIntro}
        </p>
        <ol className="vm-legend">
          {REVERSE.provide.map((item, i) => (
            <li key={item} data-reveal className="vm-legend-item index-tag">
              <span className="tabular-nums opacity-60">[{padIndex(i)}]</span>
              <span className="vm-legend-rule" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </Cell>

      <Cell at={[0, 8, 16, 18]} className="plate-statement">
        <MobileEdge open />
        <p data-reveal className="ab-statement">
          {REVERSE.statement[0]}
          <span className="ab-statement-muted">{REVERSE.statement[1]}</span>
        </p>
      </Cell>

      <Cell at={[8, 12, 16, 18]} className="plate-cta">
        <MobileEdge />
        <BrandButton href={REVERSE.cta.href} font="sans" data-reveal>
          {REVERSE.cta.label}
        </BrandButton>
      </Cell>
    </SectionGrid>
  );
}
