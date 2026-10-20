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
import { STORY as HOME_STORY } from "@/app/(frontend)/homesections/home";
import { STORY as ABOUT_STORY } from "./about";

type StoryCopy = typeof HOME_STORY;

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

export default function StorySection({
  copy = ABOUT_STORY,
  cta,
}: {
  copy?: StoryCopy;
  cta?: { label: string; href: string };
}) {
  const action = cta ?? copy.cta;
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
        <Eyebrow data-reveal index={copy.index}>
          {copy.eyebrow}
        </Eyebrow>
        <H2Heading id="story-heading">
          {copy.heading[0]}{" "}
          <span className="ab-statement-muted">{copy.heading[1]}</span>
        </H2Heading>
      </Cell>

      <Cell at={[8, 12, 0, 3]} className="plate-lede">
        <MobileEdge />
        <Copy data-reveal variant="lede">
          {copy.lede}
        </Copy>
      </Cell>

      <Cell at={[0, 12, 3, 4]} className="ab-head index-tag">
        <MobileEdge open />
        <span className="flex items-center gap-2">
          <span aria-hidden className="ab-marker" />
          {copy.storyLabel}
        </span>
        <span className="tabular-nums">
          {copy.since} [{padIndex(0)}&ndash;{padIndex(copy.paragraphs.length - 1)}]
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

      <Cell at={[0, 8, 11, 16]} as="blockquote" className="st-closing m-0">
        <MobileEdge />
        <Copy data-reveal variant="statement">
          {copy.closing}
        </Copy>
      </Cell>

      <Cell at={[8, 12, 11, 14]} className="plate-lede st-scope">
        <MobileEdge open />
        <p data-reveal className="index-tag opacity-70">
          {copy.scopeLabel}
        </p>
        <ol className="vm-legend">
          {copy.scope.map((item, i) => (
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
        <BrandButton
          href={action.href}
          direction={action.href.includes("#") ? "down" : "right"}
          tone="steel"
          data-reveal
        >
          {action.label}
        </BrandButton>
      </Cell>
    </SectionGrid>
  );
}
