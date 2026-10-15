"use client";

import Copy, { copyClass } from "@/app/(frontend)/components/Copy";
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
import PartnerWordmark from "@/app/(frontend)/homesections/PartnerWordmark";
import { PARTNERS, type Partner } from "@/app/(frontend)/homesections/partners";
import { padIndex } from "@/app/(frontend)/homesections/StoryProgress";
import { BandMobileRails, BandRails } from "@/app/(frontend)/about/pagesection/bands";
import { OEM, OEM_PARTNERS, type OemPartner } from "./automotive";

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
  [1, 0, 12],
  [6, 0, 12],
  [9, 0, 12],
];
const GRID_V: VLine[] = [
  [0, 0, 9],
  [12, 0, 9],
  [4, 1, 9],
  [8, 1, 9],
];
const GRID_JOINS: Join[] = [
  [0, 0, { up: true }],
  [6, 0, { up: true }],
  [12, 0, { up: true }],
];

const ROSTER = OEM_PARTNERS.flatMap((entry) => {
  const partner = PARTNERS.find((p) => p.id === entry.id);
  return partner ? [{ ...entry, partner }] : [];
}) satisfies (OemPartner & { partner: Partner })[];

export default function OemSection() {
  const ref = useRef<HTMLElement>(null);
  usePlateMotion(ref, { image: "rise", phoneNotes: true });

  const { band } = OEM;

  return (
    <SectionGrid
      ref={ref}
      id="oem-partnerships"
      aria-labelledby="oem-heading"
      rows={16}
      tone="page"
      outerV={false}
      className="oem-section plate-auto flex flex-col bg-steel text-cream [--page-bg:var(--steel)] [--page-ink:var(--cream)] scroll-mt-16 xl:scroll-mt-0"
    >
      <PlateBlock rows={3}>
        <Frame h={HEAD_H} v={HEAD_V} joins={HEAD_JOINS} />

        <Cell at={[0, 8, 0, 3]} className="plate-title">
          <MobileEdge open />
          <Eyebrow data-reveal index={OEM.index}>
            {OEM.eyebrow}
          </Eyebrow>
          <H2Heading id="oem-heading">
            {OEM.heading[0]}{" "}
            <span className="ab-statement-muted">{OEM.heading[1]}</span>
          </H2Heading>
        </Cell>

        <Cell at={[8, 12, 0, 3]} className="plate-lede">
          <MobileEdge />
          <Copy
            data-reveal
            variant="lede"
          >
            {OEM.intro}
          </Copy>
        </Cell>
      </PlateBlock>

      <div className="solutions-sheet dr-bands">
        <article
          data-image="left"
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
              <Copy variant="lead">{band.lead}</Copy>
              <div className="ab-copy dr-note-body">
                {band.paragraphs.map((paragraph) => (
                  <Copy key={paragraph} variant="body">
                    {paragraph}
                  </Copy>
                ))}
              </div>
            </div>
            <p aria-hidden className="dr-note-foot index-tag">
              <span>OEM Partnerships</span>
              <span className="tabular-nums">[{padIndex(ROSTER.length - 1)}] Partners</span>
            </p>
            <BandMobileRails />
          </div>
        </article>
      </div>

      <PlateBlock rows={9}>
        <Frame h={GRID_H} v={GRID_V} joins={GRID_JOINS} />

        <Cell at={[0, 12, 0, 1]} className="ab-head index-tag">
          <MobileEdge open />
          <span className="flex items-center gap-2">
            <span aria-hidden className="ab-marker" />
            {OEM.partnersLabel}
          </span>
          <span className="tabular-nums">
            [{padIndex(0)}&ndash;{padIndex(ROSTER.length - 1)}]
          </span>
        </Cell>

        {ROSTER.map(({ id, partner, lead, models }, i) => {
          const c = i * 4;
          return (
            <div key={id} className="oem-row md:contents">
              <MobileEdge />
              <Cell at={[c, c + 4, 1, 6]} className="oem-mark-cell">
                <div data-wipe className="oem-mark dot-field-soft">
                  <Corners />
                  <p className="oem-mark-head index-tag">
                    <span>{partner.sector}</span>
                    <span className="tabular-nums">[{padIndex(i)}]</span>
                  </p>
                  <div className={`partner-wordmark ${copyClass("display", undefined, "lg")}`}>
                    <PartnerWordmark partner={partner} />
                  </div>
                </div>
              </Cell>
              <Cell
                at={[c, c + 4, 6, 9]}
                as="article"
                className="oem-models"
                aria-labelledby={`oem-${id}`}
              >
                <div data-reveal className="flex flex-col gap-2">
                  <H3Heading id={`oem-${id}`} variant="title" size="sm">
                    {partner.legalName}
                  </H3Heading>
                  <p className="index-tag opacity-70">
                    {OEM.modelsLabel}
                    {lead ? ` ${lead}` : ""}
                  </p>
                </div>
                <ol className="vm-legend">
                  {models.map((model, m) => (
                    <li key={model} data-reveal className="vm-legend-item index-tag">
                      <span className="tabular-nums opacity-60">[{padIndex(m)}]</span>
                      <span className="vm-legend-rule" aria-hidden />
                      <span>{model}</span>
                    </li>
                  ))}
                </ol>
              </Cell>
            </div>
          );
        })}
      </PlateBlock>
    </SectionGrid>
  );
}
