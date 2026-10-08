"use client";

import { useRef } from "react";
import IsoGlyph from "@/app/(frontend)/components/IsoGlyph";
import MaskRevealHeading from "@/app/(frontend)/components/MaskRevealHeading";
import SectionGrid from "@/app/(frontend)/components/SectionGrid";
import { PRINCIPLES, VISION_MISSION } from "@/app/(frontend)/aboutsections/about";
import { useAboutMotion } from "@/app/(frontend)/aboutsections/motion";
import {
  Cell,
  Corners,
  Eyebrow,
  Frame,
  MobileEdge,
  type HLine,
  type VLine,
} from "@/app/(frontend)/aboutsections/plate";
import { padIndex } from "@/app/(frontend)/homesections/StoryProgress";

const H: HLine[] = [
  [3, 0, 12],
  [4, 0, 12],
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
  useAboutMotion(ref);

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
          <span className="block">{VISION_MISSION.heading[1]}</span>
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

      <Cell at={[0, 6, 3, 4]} className="ab-head index-tag">
        <MobileEdge open />
        <span className="flex items-center gap-2">
          <span aria-hidden className="ab-marker" />
          {vision.word}
        </span>
        <span className="tabular-nums">[{padIndex(0)}]</span>
      </Cell>

      <Cell at={[6, 12, 3, 4]} className="ab-head index-tag">
        <MobileEdge open />
        <span className="flex items-center gap-2">
          <span aria-hidden className="ab-marker" />
          {mission.word}
        </span>
        <span className="tabular-nums">[{padIndex(1)}]</span>
      </Cell>

      <Cell at={[0, 6, 4, 10]} as="article" className="vm-plate" aria-label={vision.word}>
        <MobileEdge />
        <p data-reveal className="vm-declare">
          {vision.paragraphs[0]}
        </p>
      </Cell>

      <Cell at={[6, 12, 4, 10]} as="article" className="vm-plate" aria-label={mission.word}>
        <MobileEdge />
        <p data-reveal className="vm-lead">
          {mission.paragraphs[0]}
        </p>
        <div className="ov-story-list">
          {mission.paragraphs.slice(1).map((paragraph, i) => (
            <div key={paragraph} data-reveal className="ov-story-item">
              <span className="index-tag tabular-nums" aria-hidden>
                {padIndex(i)}
              </span>
              <p className="ab-copy">{paragraph}</p>
            </div>
          ))}
        </div>
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
          <div data-draw className="vm-principle-glyph dot-field-soft">
            <Corners />
            <IsoGlyph kind={principle.icon} className="vm-principle-mark" />
          </div>
          <div className="vm-principle-copy">
            <h3
              id={`principle-${principle.id}`}
              className="font-heading text-[clamp(16px,1.25vw,24px)] leading-none font-medium uppercase"
            >
              {principle.title}
            </h3>
            <p className="font-heading text-[clamp(10px,0.85vw,12px)] leading-[1.2] font-normal uppercase">
              {principle.body}
            </p>
          </div>
        </Cell>
      ))}
    </SectionGrid>
  );
}
