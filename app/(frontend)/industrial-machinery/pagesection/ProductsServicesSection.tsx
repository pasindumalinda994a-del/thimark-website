"use client";

import { useRef, useState } from "react";
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
import { CATEGORIES, PRODUCTS } from "./machinery";

const ROW0 = 4;
const ROW_SPAN = 3;

const H: HLine[] = [
  [3, 0, 12],
  [4, 0, 12],
  ...CATEGORIES.slice(1).map((_, i): HLine => [ROW0 + (i + 1) * ROW_SPAN, 6, 12]),
  [16, 0, 12],
];

const V: VLine[] = [
  [0, 0, 18],
  [12, 0, 18],
  [8, 0, 3],
  [6, 3, 16],
  [8, 16, 18],
];

export default function ProductsServicesSection() {
  const ref = useRef<HTMLElement>(null);
  usePlateMotion(ref);
  const [active, setActive] = useState(0);
  const current = CATEGORIES[active];

  return (
    <SectionGrid
      ref={ref}
      id="products-services"
      aria-labelledby="products-services-heading"
      rows={18}
      tone="page"
      outerV={false}
      className="flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)] scroll-mt-16 md:scroll-mt-0"
    >
      <Frame h={H} v={V} />

      <Cell at={[0, 8, 0, 3]} className="plate-title">
        <MobileEdge open />
        <Eyebrow data-reveal index={PRODUCTS.index}>
          {PRODUCTS.eyebrow}
        </Eyebrow>
        <MaskRevealHeading
          id="products-services-heading"
          className="font-heading text-[clamp(28px,2.5vw,48px)] leading-none font-medium uppercase"
        >
          {PRODUCTS.heading[0]}
          <span className="block">{PRODUCTS.heading[1]}</span>
        </MaskRevealHeading>
      </Cell>

      <Cell at={[8, 12, 0, 3]} className="plate-lede">
        <MobileEdge />
        <p
          data-reveal
          className="font-heading text-[clamp(12px,1vw,16px)] leading-[1.1] font-medium uppercase md:text-justify md:[text-align-last:left]"
        >
          {PRODUCTS.lede}
        </p>
      </Cell>

      <Cell at={[0, 6, 3, 4]} className="ab-head index-tag im-pv-head">
        <span className="flex items-center gap-2">
          <span aria-hidden className="ab-marker" />
          Fig. 02 &middot; {PRODUCTS.mediaLabel}
        </span>
        <span className="tabular-nums" aria-live="polite">
          [{padIndex(active)}]
        </span>
      </Cell>

      <Cell at={[6, 12, 3, 4]} className="ab-head index-tag">
        <MobileEdge open />
        <span>{PRODUCTS.listLabel}</span>
        <span className="tabular-nums">
          [{padIndex(0)}&ndash;{padIndex(CATEGORIES.length - 1)}]
        </span>
      </Cell>

      <Cell at={[0, 6, ROW0, 16]} className="im-pv hidden md:block" aria-hidden>
        <div data-wipe className="plate-media">
          {CATEGORIES.map((category, i) => (
            <div
              key={category.id}
              className="im-pv-shot"
              data-active={i === active ? "true" : "false"}
            >
              <Image
                src={category.media.src}
                alt=""
                fill
                sizes="(min-width: 768px) 45vw, 1px"
                className="object-cover"
                style={{ objectPosition: category.media.objectPosition }}
              />
            </div>
          ))}
          <span aria-hidden className="ah-media-scrim" />
          <Corners tone="light" />
          <p className="ah-media-caption index-tag">
            <span className="tabular-nums">[{padIndex(active)}]</span>
            <span className="text-right">{current.title}</span>
          </p>
        </div>
      </Cell>

      {CATEGORIES.map((category, i) => {
        const r0 = ROW0 + i * ROW_SPAN;
        return (
          <Cell
            key={category.id}
            at={[6, 12, r0, r0 + ROW_SPAN]}
            as="article"
            className="im-cat"
            data-active={i === active ? "true" : "false"}
            tabIndex={0}
            aria-labelledby={`category-${category.id}`}
            onPointerEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
          >
            <MobileEdge />
            <div className="im-cat-shot md:hidden">
              <Image
                src={category.media.src}
                alt={category.media.alt}
                fill
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: category.media.objectPosition }}
              />
              <Corners tone="light" />
            </div>
            <div data-reveal className="im-cat-head">
              <span className="index-tag tabular-nums">[{padIndex(i)}]</span>
              <h3
                id={`category-${category.id}`}
                className="font-heading text-[clamp(16px,1.25vw,22px)] leading-none font-medium uppercase"
              >
                {category.title}
              </h3>
            </div>
            <div data-reveal className="im-cat-body">
              <p className="ab-copy">{category.body}</p>
              {category.items.length ? (
                <ul className="im-cat-list" aria-label="Equipment includes">
                  {category.items.map((item) => (
                    <li key={item} className="index-tag">
                      <span aria-hidden className="ab-marker" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : category.pull ? (
                <p className="im-cat-pull">{category.pull}</p>
              ) : null}
            </div>
          </Cell>
        );
      })}

      <Cell at={[0, 8, 16, 18]} className="plate-statement">
        <MobileEdge open />
        <p data-reveal className="ab-statement">
          {PRODUCTS.statement[0]}
          <span className="ab-statement-muted">{PRODUCTS.statement[1]}</span>
        </p>
      </Cell>

      <Cell at={[8, 12, 16, 18]} className="plate-cta">
        <MobileEdge />
        <BrandButton href={PRODUCTS.cta.href} tone="steel" data-reveal>
          {PRODUCTS.cta.label}
        </BrandButton>
      </Cell>
    </SectionGrid>
  );
}
