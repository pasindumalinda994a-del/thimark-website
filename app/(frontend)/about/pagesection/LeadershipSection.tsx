"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import MaskRevealHeading from "@/app/(frontend)/components/MaskRevealHeading";
import SectionGrid from "@/app/(frontend)/components/SectionGrid";
import { LEADERSHIP } from "./about";
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

const H: HLine[] = [
  [3, 0, 12],
  [4, 0, 12],
  [7, 0, 12],
  [11, 0, 12],
  [12, 0, 12],
  [17, 0, 12],
];

const V: VLine[] = [
  [0, 0, 20],
  [12, 0, 20],
  [8, 0, 3],
  [6, 7, 11],
  [6, 12, 20],
  [3, 12, 20],
  [9, 12, 20],
];

export default function LeadershipSection() {
  const ref = useRef<HTMLElement>(null);
  usePlateMotion(ref);

  const { leader, leaders, message } = LEADERSHIP;
  const half = Math.ceil(message.length / 2);
  const columns = [message.slice(0, half), message.slice(half)];

  return (
    <SectionGrid
      ref={ref}
      id="leadership"
      aria-labelledby="leadership-heading"
      rows={20}
      tone="page"
      outerV={false}
      className="flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)]"
    >
      <Frame h={H} v={V} />

      <Cell at={[0, 8, 0, 3]} className="plate-title">
        <MobileEdge open />
        <Eyebrow data-reveal index={LEADERSHIP.index}>
          {LEADERSHIP.eyebrow}
        </Eyebrow>
        <MaskRevealHeading
          id="leadership-heading"
          className="font-heading text-[clamp(28px,2.5vw,48px)] leading-none font-medium uppercase"
        >
          {LEADERSHIP.heading[0]}
          <span className="block">{LEADERSHIP.heading[1]}</span>
        </MaskRevealHeading>
      </Cell>

      <Cell at={[8, 12, 0, 3]} className="plate-lede">
        <MobileEdge />
        <p
          data-reveal
          className="font-heading text-[clamp(12px,1vw,16px)] leading-[1.1] font-medium uppercase md:text-justify md:[text-align-last:left]"
        >
          {LEADERSHIP.intro}
        </p>
      </Cell>

      <Cell at={[0, 12, 3, 4]} className="ab-head index-tag">
        <MobileEdge open />
        <span className="flex items-center gap-2">
          <span aria-hidden className="ab-marker" />
          {LEADERSHIP.messageLabel}
        </span>
        <span>From the Chairman</span>
      </Cell>

      <Cell at={[0, 12, 4, 7]} as="blockquote" className="ld-quote m-0">
        <MobileEdge />
        <p data-reveal>{LEADERSHIP.quote}</p>
      </Cell>

      {columns.map((paragraphs, i) => (
        <Cell key={paragraphs[0]} at={[i * 6, i * 6 + 6, 7, 11]} className="ld-message">
          <MobileEdge />
          <div data-reveal className="ab-copy">
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Cell>
      ))}

      <Cell at={[0, 12, 11, 12]} className="ld-sign">
        <MobileEdge />
        <p data-reveal className="font-heading text-[clamp(13px,1vw,16px)] leading-none font-medium uppercase">
          &mdash; {leader.name}
        </p>
        <p data-reveal className="index-tag opacity-70">
          {leader.role}
        </p>
      </Cell>

      {leaders.map((person, i) => {
        const c = i * 3;
        return (
          <Fragment key={person.id}>
          <Cell at={[c, c + 3, 12, 17]} className="ld-portrait-cell">
            <MobileEdge open />
            <div data-wipe className="ld-portrait ld-roster">
              <Corners tone="light" />
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
            key={`${person.id}-name`}
            at={[c, c + 3, 17, 20]}
            as="article"
            className="ld-name"
            aria-labelledby={`leader-${person.id}`}
          >
            <MobileEdge />
            <h3
              id={`leader-${person.id}`}
              data-reveal
              className="font-heading text-[clamp(16px,1.25vw,22px)] leading-none font-medium uppercase"
            >
              {person.honorific} {person.name}
            </h3>
            <p data-reveal className="index-tag leading-[1.2] opacity-70">
              {person.role}
            </p>
          </Cell>
          </Fragment>
        );
      })}
    </SectionGrid>
  );
}
