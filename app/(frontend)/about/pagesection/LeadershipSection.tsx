"use client";

import Copy from "@/app/(frontend)/components/Copy";
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
  type VLine,
} from "@/app/(frontend)/components/plate";
import { padIndex } from "@/app/(frontend)/homesections/StoryProgress";
import { LEADERSHIP, PEOPLE } from "./about";

const H: HLine[] = [
  [3, 0, 12],
  [4, 0, 12],
  [9, 0, 12],
  [13, 0, 12],
  [14, 0, 12],
  [21, 0, 12],
];

const V: VLine[] = [
  [0, 0, 25],
  [12, 0, 25],
  [8, 0, 3],
  [3, 4, 13],
  [6, 4, 13],
  [9, 4, 13],
  [6, 14, 21],
  [8, 21, 25],
];

export default function LeadershipSection() {
  const ref = useRef<HTMLElement>(null);
  usePlateMotion(ref, { image: "rise" });
  useLetterScrub(ref);

  const { leaders } = LEADERSHIP;

  return (
    <SectionGrid
      ref={ref}
      id="leadership"
      aria-labelledby="leadership-heading"
      rows={20}
      tone="page"
      outerV={false}
      className="plate-auto flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)] scroll-mt-16 xl:scroll-mt-0"
    >
      <PlateBlock rows={25}>
        <Frame h={H} v={V} />

        <Cell at={[0, 8, 0, 3]} className="plate-title">
          <MobileEdge open />
          <Eyebrow data-reveal index={LEADERSHIP.index}>
            {LEADERSHIP.eyebrow}
          </Eyebrow>
          <H2Heading id="leadership-heading">
            {LEADERSHIP.heading[0]}
            <span className="ab-statement-muted">{LEADERSHIP.heading[1]}</span>
          </H2Heading>
        </Cell>

        <Cell at={[8, 12, 0, 3]} className="plate-lede">
          <MobileEdge />
          <Copy
            data-reveal
            variant="lede"
          >
            {LEADERSHIP.intro}
          </Copy>
        </Cell>

        <Cell at={[0, 12, 3, 4]} className="ab-head index-tag">
          <MobileEdge open />
          <span className="flex items-center gap-2">
            <span aria-hidden className="ab-marker" />
            {LEADERSHIP.teamLabel}
          </span>
          <span className="tabular-nums">
            [{padIndex(0)}&ndash;{padIndex(leaders.length - 1)}]
          </span>
        </Cell>

        <div className="ld-grid md:contents">
          {leaders.map((person, i) => {
            const c = i * 3;
            return (
              <div key={person.id} className="ld-card md:contents">
                <Cell at={[c, c + 3, 4, 9]} className="ld-portrait-cell">
                  <div data-wipe className="ld-portrait ld-roster ld-roster-light">
                    <Corners />
                    <span aria-hidden className="ld-portrait-marker" />
                    <div className="ld-portrait-frame">
                      {person.portrait ? (
                        <Image
                          src={person.portrait}
                          alt={person.portraitAlt}
                          fill
                          sizes="(min-width: 768px) 22vw, 100vw"
                          className="object-cover grayscale"
                        />
                      ) : (
                        <div className="ld-monogram dot-field" role="img" aria-label={person.name}>
                          <span aria-hidden className="ld-monogram-text ab-outline">
                            {person.initials}
                          </span>
                        </div>
                      )}
                    </div>
                    <p aria-hidden className="ld-portrait-caption index-tag">
                      <span className="tabular-nums">[{padIndex(i)}]</span>
                      <span>Leadership</span>
                    </p>
                  </div>
                </Cell>
                <Cell
                  at={[c, c + 3, 9, 13]}
                  as="article"
                  className="ld-name ld-bio"
                  aria-labelledby={`leader-${person.id}`}
                >
                  <div className="flex flex-col gap-2">
                    <H3Heading id={`leader-${person.id}`} data-reveal variant="title" size="sm">
                      {person.honorific} {person.name}
                      {person.credential ? (
                        <span className="ld-credential"> ({person.credential})</span>
                      ) : null}
                    </H3Heading>
                    <p data-reveal className="index-tag leading-[1.2] opacity-70">
                      {person.role}
                    </p>
                  </div>
                  <Copy data-reveal variant="body" className="ld-bio-copy">
                    {person.bio}
                  </Copy>
                </Cell>
              </div>
            );
          })}
          <MobileEdge />
        </div>

        <Cell at={[0, 12, 13, 14]} className="ab-head index-tag">
          <MobileEdge open />
          <span className="flex items-center gap-2">
            <span aria-hidden className="ab-marker" />
            {PEOPLE.label}
          </span>
          <span className="tabular-nums">
            [{padIndex(0)}&ndash;{padIndex(PEOPLE.paragraphs.length - 1)}]
          </span>
        </Cell>

        <Cell at={[0, 6, 14, 21]} className="st-media">
          <MobileEdge />
          <div data-wipe className="plate-media">
            <Image
              src={PEOPLE.media.src}
              alt={PEOPLE.media.alt}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
              style={{ objectPosition: PEOPLE.media.objectPosition }}
            />
            <Corners tone="light" />
          </div>
        </Cell>

        <Cell at={[6, 12, 14, 21]} className="st-story">
          <MobileEdge />
          {PEOPLE.paragraphs.map((paragraph, i) => (
            <div key={paragraph} className="st-story-item">
              <span className="index-tag tabular-nums opacity-60">[{padIndex(i)}]</span>
              <Copy data-letters variant="title">
                {paragraph}
              </Copy>
            </div>
          ))}
        </Cell>

        <Cell at={[0, 8, 21, 25]} as="blockquote" className="st-closing m-0">
          <MobileEdge />
          <Copy data-reveal variant="statement">{PEOPLE.closing}</Copy>
        </Cell>

        <Cell at={[8, 12, 21, 25]} className="plate-lede">
          <MobileEdge />
          <Copy data-reveal variant="body" className="ab-copy">
            {LEADERSHIP.body}
          </Copy>
        </Cell>
      </PlateBlock>
    </SectionGrid>
  );
}
