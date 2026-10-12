"use client";

import Copy from "@/app/(frontend)/components/Copy";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BrandButton from "@/app/(frontend)/components/BrandButton";
import H2Heading from "@/app/(frontend)/components/H2Heading";
import H3Heading from "@/app/(frontend)/components/H3Heading";
import IsoGlyph from "@/app/(frontend)/components/IsoGlyph";
import PlusMark from "@/app/(frontend)/components/PlusMark";
import SectionGrid from "@/app/(frontend)/components/SectionGrid";
import { figLabel } from "@/app/(frontend)/components/FigMark";
import { drawStrokes, usePlateMotion } from "@/app/(frontend)/components/usePlateMotion";
import {
  Cell,
  Corners,
  Eyebrow,
  Frame,
  MobileEdge,
  type HLine,
  type Join,
  type VLine,
} from "@/app/(frontend)/components/plate";
import StoryProgress, {
  StationDash,
  StationPlus,
  padIndex,
} from "@/app/(frontend)/homesections/StoryProgress";
import { PROCESS, STAGES, type Stage } from "./automotive";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type ProcessCopy = {
  index: string;
  eyebrow: string;
  heading: readonly [string, string];
  lede: readonly string[];
  readoutLabel: string;
  /** Accessible name for the stage tabs. */
  tabsLabel?: string;
  statement: string;
};

const H: HLine[] = [
  [3, 0, 12],
  [4, 0, 12],
  [12, 0, 12],
];

const V: VLine[] = [
  [0, 0, 14],
  [12, 0, 14],
  [8, 0, 3],
];

/** Footer columns: statement | readout | CTA when a CTA is set, else statement | readout. */
const FOOT_V: VLine[] = [[8, 12, 14]];
const FOOT_CTA_V: VLine[] = [
  [6, 12, 14],
  [9, 12, 14],
];

/** Card rails count rows from the top of the stack (section row 4). */
const CARD_H: HLine[] = [[4, 7, 12]];
const CARD_V: VLine[] = [[7, 0, 8]];
const CARD_JOINS: Join[] = [
  [7, 0, { left: true, right: true, down: true }],
  [7, 8, { left: true, right: true, up: true }],
];

type Parts = {
  cards: HTMLElement[];
  shades: HTMLElement[];
  images: HTMLElement[];
  glyphs: HTMLElement[];
  washes: HTMLElement[];
  stations: HTMLElement[];
  count: HTMLElement | null;
  fill: HTMLElement | null;
};

function setWash(wash: HTMLElement, scale: number) {
  gsap.set(wash, { clipPath: `inset(0 ${(1 - scale) * 100}% 0 0)` });
}

function markStation(parts: Parts, index: number) {
  parts.stations.forEach((station, i) => {
    const current = i === index;
    station.setAttribute("aria-selected", current ? "true" : "false");
    if (current) station.setAttribute("aria-current", "true");
    else station.removeAttribute("aria-current");
  });
  if (parts.count) parts.count.textContent = padIndex(index);
}

export default function ProcessSection({
  id = "process",
  copy = PROCESS,
  stages = STAGES,
  cta,
  pace = 1,
}: {
  id?: string;
  copy?: ProcessCopy;
  stages?: readonly Stage[];
  cta?: { label: string; href: string };
  /** Viewport heights of scroll per card change; below 1 tightens long stacks. */
  pace?: number;
}) {
  const LAST = stages.length - 1;
  const stations = stages.map((stage, i) => ({
    id: stage.id,
    label: stage.label,
    year: padIndex(i),
  }));
  const sectionRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  usePlateMotion(sectionRef, { image: "rise" });

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useGSAP(
    (_context, contextSafe) => {
      const root = sectionRef.current;
      if (!root || !contextSafe) return;

      const parts: Parts = {
        cards: gsap.utils.toArray<HTMLElement>("[data-ps-card]", root),
        shades: gsap.utils.toArray<HTMLElement>("[data-ps-shade]", root),
        images: gsap.utils.toArray<HTMLElement>("[data-ps-media] img", root),
        glyphs: gsap.utils.toArray<HTMLElement>("[data-ps-glyph]", root),
        washes: gsap.utils.toArray<HTMLElement>("[data-story-wash]", root),
        stations: gsap.utils.toArray<HTMLElement>("[data-story-station]", root),
        count: root.querySelector<HTMLElement>("[data-ps-count]"),
        fill: root.querySelector<HTMLElement>("[data-ps-fill]"),
      };
      const media = gsap.utils.toArray<HTMLElement>("[data-ps-media]", root);
      const copies = gsap.utils.toArray<HTMLElement>("[data-ps-copy]", root);

      let glyphTl: gsap.core.Timeline | undefined;
      const playGlyph = (index: number) => {
        const glyph = parts.glyphs[index];
        if (!glyph) return;
        glyphTl?.kill();
        glyphTl = drawStrokes(glyph);
      };

      const mm = gsap.matchMedia();

      // Without the scrub the tabs switch stages directly.
      mm.add("(min-width: 768px) and (prefers-reduced-motion: reduce)", () => {
        const select = (index: number) => {
          parts.cards.forEach((card, i) => gsap.set(card, { yPercent: i === index ? 0 : 100 }));
          parts.washes.forEach((wash, i) => setWash(wash, i === index ? 1 : 0));
          markStation(parts, index);
          if (parts.fill) gsap.set(parts.fill, { scaleX: index / Math.max(1, LAST) });
        };

        const handlers = parts.stations.map((station, i) => {
          const onClick = () => select(i);
          station.addEventListener("click", onClick);
          return onClick;
        });
        select(0);

        return () => {
          parts.stations.forEach((station, i) => {
            station.removeEventListener("click", handlers[i]);
          });
          gsap.set(parts.cards, { clearProps: "transform" });
        };
      });

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(parts.cards.slice(1), { yPercent: 100 });
        gsap.set(parts.shades, { autoAlpha: 0 });
        parts.washes.forEach((wash, i) => setWash(wash, i === 0 ? 1 : 0));

        const firstMedia = media[0];
        if (firstMedia) {
          gsap.fromTo(
            firstMedia,
            { clipPath: "inset(0% 0% 100% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.9,
              ease: "power2.out",
              scrollTrigger: { trigger: root, start: "top 55%", once: true },
            },
          );
        }
        const firstCopy = copies[0];
        if (firstCopy) {
          gsap.fromTo(
            firstCopy.children,
            { autoAlpha: 0, y: 10 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.08,
              scrollTrigger: { trigger: root, start: "top 55%", once: true },
            },
          );
        }

        const tl = gsap.timeline({ defaults: { ease: "none" } });
        for (let i = 1; i < parts.cards.length; i += 1) {
          const at = i - 1;
          tl.fromTo(parts.cards[i], { yPercent: 100 }, { yPercent: 0, duration: 1 }, at);
          if (parts.images[i]) {
            tl.fromTo(parts.images[i], { scale: 1.08 }, { scale: 1, duration: 1 }, at);
          }
          tl.to(parts.cards[i - 1], { scale: 0.94, duration: 1 }, at);
          if (parts.shades[i - 1]) {
            tl.to(parts.shades[i - 1], { autoAlpha: 1, duration: 1 }, at);
          }
        }

        let current = -1;
        const sync = (progress: number) => {
          const scaled = progress * LAST;
          parts.washes.forEach((wash, i) => {
            setWash(wash, i === 0 ? 1 : gsap.utils.clamp(0, 1, scaled - (i - 1)));
          });
          if (parts.fill) gsap.set(parts.fill, { scaleX: progress });
          const index = Math.min(LAST, Math.floor(scaled + 0.5));
          if (index === current) return;
          const initialized = current >= 0;
          current = index;
          markStation(parts, index);
          if (initialized) playGlyph(index);
        };
        sync(0);

        const st = ScrollTrigger.create({
          id: `${id}-stack`,
          trigger: root,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * LAST * pace)}`,
          pin: true,
          pinType: "transform",
          anticipatePin: 1,
          scrub: 1,
          invalidateOnRefresh: true,
          animation: tl,
          onUpdate: (self) => sync(self.progress),
        });

        const reveal = ScrollTrigger.create({
          trigger: root,
          start: "top 55%",
          once: true,
          onEnter: () => playGlyph(Math.max(current, 0)),
        });

        const onClick = contextSafe((event: Event) => {
          const btn = event.currentTarget;
          if (!(btn instanceof HTMLElement)) return;
          const i = parts.stations.indexOf(btn);
          if (i < 0) return;
          const y = st.start + (st.end - st.start) * (i / Math.max(1, LAST));
          const scroller = lenisRef.current;
          if (scroller) scroller.scrollTo(y, { duration: 1.1 });
          else window.scrollTo({ top: y, behavior: "smooth" });
        });
        parts.stations.forEach((station) => station.addEventListener("click", onClick));

        return () => {
          parts.stations.forEach((station) => station.removeEventListener("click", onClick));
          glyphTl?.kill();
          reveal.kill();
          st.kill();
          tl.kill();
          gsap.set([...parts.cards, ...parts.images], { clearProps: "transform" });
        };
      });

      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        parts.cards.forEach((card, i) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: card, start: "top 80%", once: true },
          });
          if (media[i]) {
            tl.fromTo(
              media[i],
              { clipPath: "inset(0% 0% 100% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power2.out" },
            );
          }
          if (copies[i]) {
            tl.fromTo(
              copies[i].children,
              { autoAlpha: 0, y: 10 },
              { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.08 },
              0.3,
            );
          }
          const glyph = parts.glyphs[i];
          if (glyph) tl.add(drawStrokes(glyph), 0.2);
        });
      });

      return () => {
        glyphTl?.kill();
        mm.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <SectionGrid
      ref={sectionRef}
      id={id}
      aria-labelledby={`${id}-heading`}
      rows={14}
      tone="page"
      outerV={false}
      className="ps-section flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)] scroll-mt-16 md:scroll-mt-0"
    >
      <Frame h={H} v={[...V, ...(cta ? FOOT_CTA_V : FOOT_V)]} />

      <Cell at={[0, 8, 0, 3]} className="plate-title">
        <MobileEdge open />
        <Eyebrow data-reveal index={copy.index}>
          {copy.eyebrow}
        </Eyebrow>
        <H2Heading id={`${id}-heading`}>
          {copy.heading[0]}
          <span className="ab-statement-muted">{copy.heading[1]}</span>
        </H2Heading>
      </Cell>

      <Cell at={[8, 12, 0, 3]} className="plate-lede">
        <MobileEdge />
        {copy.lede.map((paragraph, i) => (
          <Copy
            key={paragraph}
            data-reveal
            variant="lede" size="sm" weight={i === 0 ? "medium" : "normal"}
          >
            {paragraph}
          </Copy>
        ))}
      </Cell>

      <Cell at={[0, 12, 3, 4]} className="jr-tabs hidden md:block">
        <StoryProgress items={stations} label={copy.tabsLabel ?? "Production stages"} />
      </Cell>

      <div className="ps-stack">
        {stages.map((stage, i) => (
          <article
            key={stage.id}
            data-ps-card=""
            className="ps-card"
            style={{ zIndex: i + 1 }}
            aria-labelledby={`${id}-stage-${stage.id}`}
          >
            <Frame h={CARD_H} v={CARD_V} joins={CARD_JOINS} />

            <Cell at={[0, 7, 0, 8]} className="ps-media">
              <MobileEdge />
              <div data-ps-media="" className="plate-media">
                <Image
                  src={stage.media.src}
                  alt={stage.media.alt}
                  fill
                  sizes="(min-width: 768px) 55vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: stage.media.objectPosition }}
                />
                <span aria-hidden className="ah-media-scrim" />
                <Corners tone="light" />
                <p aria-hidden className="ah-media-caption index-tag">
                  <span>{figLabel(i + 2)}</span>
                  <span>{stage.title}</span>
                </p>
              </div>
            </Cell>

            <Cell at={[7, 12, 0, 4]} className="ps-glyph">
              <MobileEdge />
              <div data-ps-glyph="" className="ps-glyph-field dot-field-mark">
                <PlusMark tone="page" className="plus-at-tl z-10" />
                <PlusMark tone="page" className="plus-at-tr z-10" />
                <PlusMark tone="page" className="plus-at-bl z-10" />
                <PlusMark tone="page" className="plus-at-br z-10" />
                <IsoGlyph kind={stage.icon} className="ps-glyph-mark" />
                <span aria-hidden className="ps-numeral ab-outline">
                  {padIndex(i)}
                </span>
              </div>
            </Cell>

            <Cell at={[7, 12, 4, 8]} className="ps-copy">
              <MobileEdge />
              <div data-ps-copy="" className="ps-copy-inner">
                <p className="index-tag flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2">
                    <span aria-hidden className="ab-marker" />
                    {copy.readoutLabel} [{padIndex(i)}]
                  </span>
                  <span className="tabular-nums opacity-60">
                    {padIndex(i)} / {padIndex(LAST)}
                  </span>
                </p>
                <H3Heading id={`${id}-stage-${stage.id}`} variant="title">
                  {stage.title}
                </H3Heading>
                <Copy variant="body" className="ab-copy">{stage.body}</Copy>
                <ul className="im-credit-tags index-tag" aria-label="Operations">
                  {stage.operations.map((operation) => (
                    <li key={operation}>{operation}</li>
                  ))}
                </ul>
              </div>
            </Cell>

            <span aria-hidden data-ps-shade="" className="ps-card-shade" />
          </article>
        ))}
      </div>

      <Cell at={[0, cta ? 6 : 8, 12, 14]} className="plate-statement">
        <MobileEdge />
        <Copy
          data-reveal
          variant="title" size="sm"
          className="ps-statement"
        >
          {copy.statement}
        </Copy>
      </Cell>

      <Cell at={[cta ? 6 : 8, cta ? 9 : 12, 12, 14]} className="ps-readout" aria-hidden>
        <div className="index-tag flex items-center justify-between gap-4">
          <span className="flex items-center gap-1">
            <StationPlus />
            <StationDash />
            <span>{copy.readoutLabel}</span>
          </span>
          <span className="tabular-nums">
            <span data-ps-count>{padIndex(0)}</span>
            {" / "}
            {padIndex(LAST)}
          </span>
        </div>
        <div className="ps-rail">
          <span data-ps-fill className="ps-rail-fill" />
        </div>
      </Cell>

      {cta ? (
        <Cell at={[9, 12, 12, 14]} className="plate-cta">
          <MobileEdge />
          <BrandButton href={cta.href} tone="steel" data-reveal>
            {cta.label}
          </BrandButton>
        </Cell>
      ) : null}
    </SectionGrid>
  );
}
