"use client";

import Copy, { copyClass } from "@/app/(frontend)/components/Copy";
import { useRef } from "react";
import Image from "next/image";
import H2Heading from "@/app/(frontend)/components/H2Heading";
import H3Heading from "@/app/(frontend)/components/H3Heading";
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
  type Join,
  type VLine,
} from "@/app/(frontend)/components/plate";
import { padIndex } from "@/app/(frontend)/homesections/StoryProgress";
import MachineryList from "./MachineryList";
import { BANDS, PORTFOLIO, type PortfolioBand } from "./machinery";

const STORY_H: HLine[] = [
  [3, 0, 12],
  [4, 0, 12],
];

const STORY_V: VLine[] = [
  [0, 0, 11],
  [12, 0, 11],
  [8, 0, 3],
  [6, 4, 11],
];

const BAND_ROWS = 14;

const BAND_H: HLine[] = [[0, 0, 12]];

const BAND_V: VLine[] = [
  [0, 0, BAND_ROWS],
  [6, 0, BAND_ROWS],
  [12, 0, BAND_ROWS],
];

const BAND_JOINS: Join[] = [
  [0, 0, { up: true }],
  [6, 0, { up: true }],
  [12, 0, { up: true }],
];

function PortfolioBandBlock({ band }: { band: PortfolioBand }) {
  const imageAt = band.imageSide === "right" ? [6, 12, 0, BAND_ROWS] : [0, 6, 0, BAND_ROWS];
  const copyAt = band.imageSide === "right" ? [0, 6, 0, BAND_ROWS] : [6, 12, 0, BAND_ROWS];

  return (
    <PlateBlock rows={BAND_ROWS}>
      <Frame h={BAND_H} v={BAND_V} joins={BAND_JOINS} />

      <Cell at={imageAt as [number, number, number, number]} className="ah-media">
        <MobileEdge />
        <p aria-hidden className="im-band-head index-tag md:hidden">
          <span>Sector</span>
          <span className="tabular-nums">
            [{band.index} / {padIndex(BANDS.length - 1)}]
          </span>
        </p>
        <div data-wipe className="plate-media">
          <Image
            src={band.media.src}
            alt={band.media.alt}
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
            style={{ objectPosition: band.media.objectPosition }}
          />
          <span aria-hidden className="ah-media-scrim" />
          <Corners tone="light" />
          <p aria-hidden className="ah-media-caption index-tag">
            <span>{band.caption[0]}</span>
            <span>{band.caption[1]}</span>
          </p>
        </div>
      </Cell>

      <Cell
        at={copyAt as [number, number, number, number]}
        as="article"
        id={band.id}
        className="im-split-cell"
        aria-labelledby={`${band.id}-title`}
      >
        <MobileEdge />
        <div className="im-split">
          <div className="im-split-head">
            <p className="index-tag flex items-center gap-2">
              <span aria-hidden className="ab-marker" />
              <span className="tabular-nums">[{band.index}]</span>
            </p>
            <H3Heading id={`${band.id}-title`} data-reveal variant="statement">
              {band.title}
            </H3Heading>
            <Copy data-reveal variant="lede" className="im-split-sub">
              {band.subtitle}
            </Copy>
            <Copy data-reveal variant="body" className="ab-copy">
              {band.intro}
            </Copy>
          </div>
          <ul data-reveal className={`rc-distinctions rg-list ${copyClass("caption")}`}>
            {band.items.map((item) => (
              <li key={item.name}>
                <span aria-hidden className="ab-marker" />
                <span>
                  <span className="font-medium">{item.name}</span>
                  {" \u2014 "}
                  {item.body}
                </span>
              </li>
            ))}
          </ul>
          <MachineryList id={band.id} items={band.items} />
          <Copy data-reveal variant="lede" size="sm" className="im-cat-pull">
            {band.closing}
          </Copy>
        </div>
      </Cell>
    </PlateBlock>
  );
}

export default function PortfolioSection() {
  const ref = useRef<HTMLElement>(null);
  usePlateMotion(ref, { image: "rise" });
  useLetterScrub(ref);

  return (
    <SectionGrid
      ref={ref}
      id="portfolio"
      aria-labelledby="portfolio-heading"
      rows={16}
      tone="page"
      outerV={false}
      className="plate-auto flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)] scroll-mt-16 xl:scroll-mt-0"
    >
      <PlateBlock rows={11}>
        <Frame h={STORY_H} v={STORY_V} />

        <Cell at={[0, 8, 0, 3]} className="plate-title">
          <MobileEdge open />
          <Eyebrow data-reveal index={PORTFOLIO.index}>
            {PORTFOLIO.eyebrow}
          </Eyebrow>
          <H2Heading id="portfolio-heading">
            {PORTFOLIO.heading[0]}{" "}
            <span className="ab-statement-muted">{PORTFOLIO.heading[1]}</span>
          </H2Heading>
        </Cell>

        <Cell at={[8, 12, 0, 3]} className="plate-lede">
          <MobileEdge />
          <Copy
            data-reveal
            variant="lede"
          >
            {PORTFOLIO.lede}
          </Copy>
        </Cell>

        <Cell at={[0, 12, 3, 4]} className="ab-head index-tag">
          <MobileEdge open />
          <span className="flex items-center gap-2">
            <span aria-hidden className="ab-marker" />
            {PORTFOLIO.headLabel}
          </span>
          <span className="tabular-nums">
            <span className="hidden md:inline">{PORTFOLIO.headMeta} </span>
            [{padIndex(0)}&ndash;{padIndex(PORTFOLIO.paragraphs.length - 1)}]
          </span>
        </Cell>

        <Cell at={[0, 6, 4, 11]} className="st-media">
          <MobileEdge />
          <div data-wipe className="plate-media">
            <Image
              src={PORTFOLIO.media.src}
              alt={PORTFOLIO.media.alt}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
              style={{ objectPosition: PORTFOLIO.media.objectPosition }}
            />
            <Corners tone="light" />
          </div>
        </Cell>

        <Cell at={[6, 12, 4, 11]} className="st-story">
          <MobileEdge />
          {PORTFOLIO.paragraphs.map((paragraph, i) => (
            <div key={paragraph} className="st-story-item">
              <span className="index-tag tabular-nums opacity-60">[{padIndex(i)}]</span>
              <Copy data-letters variant="title">
                {paragraph}
              </Copy>
            </div>
          ))}
        </Cell>
      </PlateBlock>

      {BANDS.map((band) => (
        <PortfolioBandBlock key={band.id} band={band} />
      ))}
    </SectionGrid>
  );
}
