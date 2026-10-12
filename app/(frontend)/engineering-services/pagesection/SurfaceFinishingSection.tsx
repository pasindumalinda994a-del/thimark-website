"use client";

import Copy from "@/app/(frontend)/components/Copy";
import { useRef } from "react";
import Image from "next/image";
import BrandButton from "@/app/(frontend)/components/BrandButton";
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
import { BandMobileRails, BandRails } from "@/app/(frontend)/about/pagesection/bands";
import { ENVIRONMENT, FINISHES, FINISHING, PRETREATMENT } from "./services";

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

const PROCESS_H: HLine[] = [
  [1, 0, 12],
  [8, 0, 12],
];
const PROCESS_V: VLine[] = [
  [0, 0, 10],
  [12, 0, 10],
  [6, 1, 8],
  [8, 8, 10],
];

export default function SurfaceFinishingSection() {
  const ref = useRef<HTMLElement>(null);
  usePlateMotion(ref, { image: "rise" });

  return (
    <SectionGrid
      ref={ref}
      id="surface-finishing"
      aria-labelledby="surface-finishing-heading"
      rows={16}
      tone="page"
      outerV={false}
      className="plate-auto flex flex-col bg-steel text-cream [--page-bg:var(--steel)] [--page-ink:var(--cream)] scroll-mt-16 md:scroll-mt-0"
    >
      <PlateBlock rows={3}>
        <Frame h={HEAD_H} v={HEAD_V} joins={HEAD_JOINS} />

        <Cell at={[0, 8, 0, 3]} className="plate-title">
          <MobileEdge open />
          <Eyebrow data-reveal index={FINISHING.index}>
            {FINISHING.eyebrow}
          </Eyebrow>
          <H2Heading id="surface-finishing-heading">
            {FINISHING.heading[0]}
            <span className="ab-statement-muted">{FINISHING.heading[1]}</span>
          </H2Heading>
        </Cell>

        <Cell at={[8, 12, 0, 3]} className="plate-lede">
          <MobileEdge />
          {FINISHING.lede.map((paragraph, i) => (
            <Copy
              key={paragraph}
              data-reveal
              variant="lede" size="sm" weight={i === 0 ? "medium" : "normal"}
            >
              {paragraph}
            </Copy>
          ))}
        </Cell>
      </PlateBlock>

      <div className="solutions-sheet dr-bands" aria-label={FINISHING.servicesLabel}>
        {FINISHES.map((finish, index) => (
          <article
            key={finish.id}
            id={finish.id}
            data-image={finish.imageSide}
            data-drift-band=""
            aria-labelledby={`${finish.id}-title`}
            className="solutions-band scroll-mt-16 md:scroll-mt-0"
          >
            <BandRails last={index === FINISHES.length - 1} />

            <div className="solutions-plate">
              <div data-wipe className="solutions-plate-shot">
                <Image
                  src={finish.media.src}
                  alt={finish.media.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: finish.media.objectPosition }}
                />
                <p className="solutions-callout index-tag">
                  {finish.callout.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
                <Corners tone="brand" />
              </div>
              <BandMobileRails />
            </div>

            <div data-drift className="solutions-note dr-note">
              <div className="solutions-note-copy dr-note-copy">
                <p className="solutions-band-kicker index-tag">
                  <span aria-hidden className="solutions-band-mark" />
                  [{padIndex(index)}]
                </p>
                <H3Heading id={`${finish.id}-title`} variant="statement">
                  {finish.label}
                </H3Heading>
                <Copy variant="lead">{finish.lead}</Copy>
              </div>
              <p aria-hidden className="dr-note-foot index-tag">
                <span>{FINISHING.servicesLabel}</span>
                <span className="tabular-nums">
                  [{padIndex(index)}/{padIndex(FINISHES.length - 1)}]
                </span>
              </p>
              <BandMobileRails />
            </div>
          </article>
        ))}
      </div>

      <PlateBlock rows={10}>
        <Frame h={PROCESS_H} v={PROCESS_V} />

        <Cell at={[0, 12, 0, 1]} className="ab-head index-tag">
          <MobileEdge open />
          <span className="flex items-center gap-2">
            <span aria-hidden className="ab-marker" />
            {FINISHING.processLabel}
          </span>
          <span className="tabular-nums">Ekala Facility</span>
        </Cell>

        <Cell at={[0, 6, 1, 8]} className="dr-principles-intro">
          <MobileEdge />
          <div className="flex flex-col gap-4">
            <H3Heading data-reveal variant="statement">
              {PRETREATMENT.label}
            </H3Heading>
            {PRETREATMENT.paragraphs.map((paragraph) => (
              <Copy key={paragraph} data-reveal variant="body" className="ab-copy">
                {paragraph}
              </Copy>
            ))}
          </div>
          <div className="flex items-end justify-between gap-4">
            <span data-reveal className="index-tag flex items-center gap-2">
              <span aria-hidden className="ab-marker" />
              {PRETREATMENT.stagesLabel}
            </span>
            <span aria-hidden className="dr-principles-count ab-outline">
              {PRETREATMENT.stages}
            </span>
          </div>
        </Cell>

        <Cell at={[6, 12, 1, 8]} className="dr-principles-intro">
          <MobileEdge />
          <div className="flex flex-col gap-4">
            <H3Heading data-reveal variant="statement">
              {ENVIRONMENT.label}
            </H3Heading>
            <Copy data-reveal variant="body" className="ab-copy">
              {ENVIRONMENT.intro}
            </Copy>
            <ol className="vm-legend">
              {ENVIRONMENT.controls.map((item, i) => (
                <li key={item} data-reveal className="vm-legend-item index-tag">
                  <span className="tabular-nums opacity-60">[{padIndex(i)}]</span>
                  <span className="vm-legend-rule" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
          <Copy data-reveal variant="body" className="ab-copy">
            {ENVIRONMENT.body}
          </Copy>
        </Cell>

        <Cell at={[0, 8, 8, 10]} className="plate-statement">
          <MobileEdge />
          <Copy data-reveal variant="title" size="sm" className="ps-statement">
            {FINISHING.statement}
          </Copy>
        </Cell>

        <Cell at={[8, 12, 8, 10]} className="plate-cta">
          <MobileEdge />
          <BrandButton href={FINISHING.cta.href} font="sans" data-reveal>
            {FINISHING.cta.label}
          </BrandButton>
        </Cell>
      </PlateBlock>
    </SectionGrid>
  );
}
