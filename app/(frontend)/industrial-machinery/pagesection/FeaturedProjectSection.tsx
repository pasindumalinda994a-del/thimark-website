"use client";

import { useRef } from "react";
import Image from "next/image";
import BrandButton from "@/app/(frontend)/components/BrandButton";
import IsoGlyph from "@/app/(frontend)/components/IsoGlyph";
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
import { ELEMENTS, FEATURED } from "./machinery";

const H: HLine[] = [
  [3, 0, 12],
  [4, 0, 12],
  [13, 0, 12],
  [14, 0, 12],
  [18, 0, 12],
];

const V: VLine[] = [
  [0, 0, 20],
  [12, 0, 20],
  [8, 0, 13],
  [3, 14, 18],
  [6, 14, 18],
  [9, 14, 18],
  [8, 18, 20],
];

export default function FeaturedProjectSection() {
  const ref = useRef<HTMLElement>(null);
  usePlateMotion(ref);

  return (
    <SectionGrid
      ref={ref}
      id="kilgharrah"
      aria-labelledby="kilgharrah-heading"
      rows={20}
      tone="page"
      outerV={false}
      className="flex flex-col bg-steel text-cream [--page-bg:var(--steel)] [--page-ink:var(--cream)] scroll-mt-16 md:scroll-mt-0"
    >
      <Frame h={H} v={V} />

      <Cell at={[0, 8, 0, 3]} className="plate-title">
        <MobileEdge open />
        <Eyebrow data-reveal index={FEATURED.index}>
          {FEATURED.eyebrow}
        </Eyebrow>
        <MaskRevealHeading
          id="kilgharrah-heading"
          className="font-heading text-[clamp(28px,2.5vw,48px)] leading-none font-medium uppercase"
        >
          {FEATURED.heading[0]}
          <span className="block">{FEATURED.heading[1]}</span>
        </MaskRevealHeading>
      </Cell>

      <Cell at={[8, 12, 0, 3]} className="plate-lede">
        <MobileEdge />
        <p
          data-reveal
          className="font-heading text-[clamp(12px,1vw,16px)] leading-[1.1] font-medium uppercase md:text-justify md:[text-align-last:left]"
        >
          {FEATURED.lede}
        </p>
      </Cell>

      <Cell at={[0, 8, 3, 4]} className="ab-head index-tag">
        <MobileEdge open />
        <span className="flex items-center gap-2">
          <span aria-hidden className="ab-marker" />
          {FEATURED.mediaLabel}
        </span>
        <span>[KE]</span>
      </Cell>

      <Cell at={[0, 8, 4, 13]} className="ov-media">
        <MobileEdge />
        <div data-wipe className="plate-media">
          <Image
            src={FEATURED.media.src}
            alt={FEATURED.media.alt}
            fill
            sizes="(min-width: 768px) 60vw, 100vw"
            className="object-cover"
            style={{ objectPosition: FEATURED.media.objectPosition }}
          />
          <span aria-hidden className="ah-media-scrim" />
          <p aria-hidden className="solutions-callout index-tag">
            {FEATURED.callout.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
          <span aria-hidden className="im-fp-numeral">
            {FEATURED.numeral}
          </span>
          <Corners tone="light" />
        </div>
      </Cell>

      <Cell at={[8, 12, 3, 4]} className="ab-head index-tag">
        <MobileEdge open />
        <span>{FEATURED.briefLabel}</span>
        <span className="tabular-nums">
          [{padIndex(0)}&ndash;{padIndex(FEATURED.paragraphs.length)}]
        </span>
      </Cell>

      <Cell at={[8, 12, 4, 13]} className="ov-story">
        <MobileEdge />
        <p
          data-reveal
          className="font-heading text-[clamp(16px,1.35vw,24px)] leading-[1.08] font-medium uppercase"
        >
          {FEATURED.lead}
        </p>
        <div className="ov-story-list">
          {FEATURED.paragraphs.map((paragraph, i) => {
            const marked = i === FEATURED.highlight;
            return (
              <div key={paragraph} data-reveal className="ov-story-item">
                <span className="index-tag tabular-nums" aria-hidden>
                  {marked ? <span className="ab-marker" /> : padIndex(i)}
                </span>
                <p className="ab-copy">{paragraph}</p>
              </div>
            );
          })}
        </div>
      </Cell>

      <Cell at={[0, 12, 13, 14]} className="ab-head index-tag">
        <MobileEdge open />
        <span className="flex items-center gap-2">
          <span aria-hidden className="ab-marker" />
          {FEATURED.elementsLabel}
        </span>
        <span className="tabular-nums">
          [{padIndex(0)}&ndash;{padIndex(ELEMENTS.length - 1)}]
        </span>
      </Cell>

      {ELEMENTS.map((element, i) => (
        <Cell
          key={element.id}
          at={[i * 3, i * 3 + 3, 14, 18]}
          as="article"
          className="vm-principle im-tile im-tile-short"
          data-redraw=""
          tabIndex={0}
          aria-labelledby={`element-${element.id}`}
        >
          <MobileEdge />
          <p className="ab-head index-tag vm-principle-head">
            <span>Element</span>
            <span className="tabular-nums">[{padIndex(i)}]</span>
          </p>
          <div data-draw className="vm-principle-glyph dot-field-soft">
            <Corners />
            <IsoGlyph kind={element.icon} className="vm-principle-mark" />
          </div>
          <div className="vm-principle-copy">
            <h3
              id={`element-${element.id}`}
              className="font-heading text-[clamp(14px,1.1vw,20px)] leading-none font-medium uppercase"
            >
              {element.title}
            </h3>
          </div>
        </Cell>
      ))}

      <Cell at={[0, 8, 18, 20]} className="im-credit">
        <MobileEdge open />
        <p data-reveal className="im-credit-line">
          <span className="index-tag opacity-70">{FEATURED.credit.label}</span>
          <span className="font-heading text-[clamp(18px,1.6vw,28px)] leading-none font-medium uppercase">
            {FEATURED.credit.value}
          </span>
        </p>
        <ul data-reveal className="im-credit-tags">
          {FEATURED.tags.map((tag) => (
            <li key={tag} className="index-tag">
              {tag}
            </li>
          ))}
        </ul>
      </Cell>

      <Cell at={[8, 12, 18, 20]} className="plate-cta">
        <MobileEdge />
        <BrandButton href={FEATURED.cta.href} font="sans" data-reveal>
          {FEATURED.cta.label}
        </BrandButton>
      </Cell>
    </SectionGrid>
  );
}
