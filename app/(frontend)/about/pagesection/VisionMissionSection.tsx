"use client";

import { useRef } from "react";
import IsoGlyph from "@/app/(frontend)/components/IsoGlyph";
import MaskRevealHeading from "@/app/(frontend)/components/MaskRevealHeading";
import PlusMark from "@/app/(frontend)/components/PlusMark";
import SectionGrid from "@/app/(frontend)/components/SectionGrid";
import { PRINCIPLES, VISION_MISSION } from "./about";
import { usePlateMotion } from "@/app/(frontend)/components/usePlateMotion";
import {
  Cell,
  Eyebrow,
  Frame,
  MobileEdge,
  type HLine,
  type VLine,
} from "@/app/(frontend)/components/plate";
import { padIndex } from "@/app/(frontend)/homesections/StoryProgress";

const H: HLine[] = [
  [3, 0, 12],
  [10, 0, 12],
  [11, 0, 12],
  [14, 0, 12],
];

const V: VLine[] = [
  [0, 0, 16],
  [12, 0, 16],
  [8, 0, 3],
  [6, 3, 16],
  [3, 10, 16],
  [9, 10, 16],
];

export default function VisionMissionSection() {
  const ref = useRef<HTMLElement>(null);
  usePlateMotion(ref);

  const { vision, mission } = VISION_MISSION;

  return (
    <SectionGrid
      ref={ref}
      id="vision-mission"
      aria-labelledby="vision-mission-heading"
      rows={16}
      tone="page"
      outerV={false}
      className="flex flex-col bg-steel text-cream [--page-bg:var(--steel)] [--page-ink:var(--cream)]"
    >
      <Frame h={H} v={V} />

      <Cell at={[0, 8, 0, 3]} className="plate-title">
        <MobileEdge open />
        <Eyebrow data-reveal index={VISION_MISSION.index}>
          {VISION_MISSION.eyebrow}
        </Eyebrow>
        <MaskRevealHeading
          id="vision-mission-heading"
          className="font-heading text-[clamp(28px,2.5vw,48px)] leading-none font-medium uppercase"
        >
          {VISION_MISSION.heading[0]}
          <span className="ab-statement-muted">{VISION_MISSION.heading[1]}</span>
        </MaskRevealHeading>
      </Cell>

      <Cell at={[8, 12, 0, 3]} className="plate-lede">
        <MobileEdge />
        <ol className="vm-legend">
          {VISION_MISSION.legend.map((item, i) => (
            <li key={item} data-reveal className="vm-legend-item index-tag">
              <span className="tabular-nums opacity-60">[{padIndex(i)}]</span>
              <span className="vm-legend-rule" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </Cell>

      <Cell at={[0, 6, 3, 10]} as="article" className="vm-plate" aria-label={vision.word}>
        <MobileEdge />
        <div className="vm-plate-copy">
          <p data-reveal className="index-tag tabular-nums">
            [{padIndex(0)}]
          </p>
          <p data-reveal className="vm-declare">
            {vision.paragraphs[0]}
          </p>
          <span aria-hidden className="vm-rule" />
        </div>
        <p aria-hidden className="vm-word ab-outline">
          {vision.word}
        </p>
      </Cell>

      <Cell at={[6, 12, 3, 10]} as="article" className="vm-plate" aria-label={mission.word}>
        <MobileEdge />
        <div className="vm-plate-copy">
          <p data-reveal className="index-tag tabular-nums">
            [{padIndex(1)}]
          </p>
          <p data-reveal className="vm-lead">
            {mission.paragraphs[0]}
          </p>
          <span aria-hidden className="vm-rule" />
        </div>
        <p aria-hidden className="vm-word ab-outline">
          {mission.word}
        </p>
      </Cell>

      {PRINCIPLES.map((principle, i) => (
        <Cell
          key={principle.id}
          at={[i * 3, i * 3 + 3, 10, 16]}
          as="article"
          className="vm-principle"
          data-redraw=""
          tabIndex={0}
          aria-labelledby={`principle-${principle.id}`}
        >
          <MobileEdge />
          <p className="ab-head index-tag vm-principle-head">
            <span>Principle</span>
            <span className="tabular-nums">[{padIndex(i)}]</span>
          </p>
          <div data-draw className="vm-principle-glyph dot-field-mark">
            <PlusMark tone="page" className="plus-at-tl z-10" />
            <PlusMark tone="page" className="plus-at-tr z-10" />
            <PlusMark tone="page" className="plus-at-bl z-10" />
            <PlusMark tone="page" className="plus-at-br z-10" />
            <IsoGlyph kind={principle.icon} className="vm-principle-mark" />
          </div>
          <div className="vm-principle-copy">
            <h3
              id={`principle-${principle.id}`}
              data-reveal
              className="font-heading text-[clamp(16px,1.25vw,24px)] leading-none font-medium uppercase"
            >
              {principle.title}
            </h3>
            <p
              data-reveal
              className="font-heading text-[clamp(10px,0.85vw,12px)] leading-[1.2] font-normal uppercase"
            >
              {principle.body}
            </p>
          </div>
        </Cell>
      ))}
    </SectionGrid>
  );
}
