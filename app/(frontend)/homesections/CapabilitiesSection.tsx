"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import BrandButton from "@/app/(frontend)/components/BrandButton";
import ScrollHint from "@/app/(frontend)/components/ScrollHint";
import Copy from "@/app/(frontend)/components/Copy";
import H2Heading from "@/app/(frontend)/components/H2Heading";
import H3Heading from "@/app/(frontend)/components/H3Heading";
import IsoGlyph, { type IsoIcon } from "@/app/(frontend)/components/IsoGlyph";
import PlusMark, { type PlusArms } from "@/app/(frontend)/components/PlusMark";
import SectionGrid, { GridLine } from "@/app/(frontend)/components/SectionGrid";
import { STATS, formatStat } from "@/app/(frontend)/components/stats";
import { StationDash, StationPlus } from "@/app/(frontend)/homesections/StoryProgress";

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin);

export type Capability = {
  id: string;
  tag: string;
  title: string;
  body: string;
  icon: IsoIcon;
};

type CapabilitiesCta = { label: string; href: string };

export type CapabilitiesCopy = {
  eyebrow: string;
  heading: readonly [string, string];
  lede: readonly string[];
};

const DEFAULT_CTA: CapabilitiesCta = {
  label: "Explore Our Capabilities",
  href: "/#catalogue",
};

const DEFAULT_COPY: CapabilitiesCopy = {
  eyebrow: "The Thimark Advantage",
  heading: ["Capability You", "Can Build On."],
  lede: [
    "Great engineering starts with good ideas — but reliable products require the capability to turn those ideas into reality.",
    "Thimark combines manufacturing infrastructure, technical expertise and controlled production processes to support precision, consistency and dependable delivery.",
  ],
};

const CAPABILITIES: Capability[] = [
  {
    id: "precision",
    tag: "Precision",
    title: "Precision Manufacturing",
    body: "Quality-controlled production processes designed for accuracy, reliability and consistency.",
    icon: "precision",
  },
  {
    id: "engineering",
    tag: "Engineering",
    title: "Engineering & Design",
    body: "Practical engineering solutions developed around automotive and industrial requirements.",
    icon: "schema",
  },
  {
    id: "fabrication",
    tag: "Fabrication",
    title: "Heavy Steel Fabrication",
    body: "Proven fabrication capabilities built through years of mechanical engineering and industrial projects.",
    icon: "work",
  },
  {
    id: "oem",
    tag: "OEM",
    title: "OEM Manufacturing",
    body: "Precision motorcycle components manufactured for established local assembly and manufacturing partners.",
    icon: "factory",
  },
  {
    id: "machinery",
    tag: "Machinery",
    title: "Industrial Machinery",
    body: "Custom-designed machinery and mechanical systems for demanding industrial applications.",
    icon: "forklift",
  },
  {
    id: "automation",
    tag: "Automation",
    title: "Automation & Custom Solutions",
    body: "Integration of mechanical, hydraulic and control technologies to address specialized industrial challenges.",
    icon: "electrical",
  },
];

const VISIBLE_CARDS = 4;
const SCRUB_STRETCH = 1.6;

const joinLeftEdge: PlusArms = { up: true, down: true, left: false, right: true };
const joinRightEdge: PlusArms = { up: true, down: true, left: true, right: false };
const joinTeeDown: PlusArms = { up: false, down: true, left: true, right: true };
const joinTeeUp: PlusArms = { up: true, down: false, left: true, right: true };
const joinCardMid: PlusArms = { up: true, down: true, left: false, right: true };

function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

function CornerPlus({ className }: { className: string }) {
  return <PlusMark tone="page" className={`${className} z-10`} />;
}

export default function CapabilitiesSection({
  id = "manufacturing",
  items = CAPABILITIES,
  cta = DEFAULT_CTA,
  copy = DEFAULT_COPY,
  progressLabel = "Capabilities",
  foot,
  aside,
}: {
  id?: string;
  items?: readonly Capability[];
  /** Pass null to seat `aside` in the button cell instead. */
  cta?: CapabilitiesCta | null;
  copy?: CapabilitiesCopy;
  progressLabel?: string;
  /** Replaces the stats band under the track. */
  foot?: ReactNode;
  aside?: ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const plain = foot != null;

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const clip = root.querySelector<HTMLElement>("[data-caps-clip]");
      const track = root.querySelector<HTMLElement>("[data-caps-track]");
      const fill = root.querySelector<HTMLElement>("[data-caps-fill]");
      const count = root.querySelector<HTMLElement>("[data-caps-count]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-caps-card]", root);
      const statValues = gsap.utils.toArray<HTMLElement>(
        "[data-stat-value]",
        root,
      );
      if (!clip || !track) return;

      const visibleStrokes = (card: HTMLElement) =>
        card.querySelectorAll<SVGElement>('[data-glyph-stroke="visible"]');
      const hiddenStrokes = (card: HTMLElement) =>
        card.querySelectorAll<SVGElement>('[data-glyph-stroke="hidden"]');

      const setCount = (revealed: number) => {
        if (count) count.textContent = padIndex(revealed - 1);
      };

      const drawCardGlyph = (
        card: HTMLElement,
        tl: gsap.core.Timeline = gsap.timeline(),
        at = 0,
      ) => {
        const visible = visibleStrokes(card);
        const hidden = hiddenStrokes(card);
        if (visible.length) {
          tl.fromTo(
            visible,
            { drawSVG: "0%" },
            {
              drawSVG: "100%",
              duration: 1.1,
              ease: "power2.inOut",
              stagger: 0.035,
              overwrite: "auto",
            },
            at,
          );
        }
        if (hidden.length) {
          tl.fromTo(
            hidden,
            { autoAlpha: 0 },
            {
              autoAlpha: 0.55,
              duration: 0.4,
              ease: "power2.out",
              overwrite: "auto",
            },
            at + 0.7,
          );
        }
        return tl;
      };

      const drawGlyphs = (trigger: Element, start: string) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger,
            start,
            toggleActions: "play none none reverse",
          },
        });
        cards.forEach((card, i) => {
          const title = card.querySelector("[data-caps-title]");
          const body = card.querySelector("[data-caps-body]");
          const at = i * 0.12;
          drawCardGlyph(card, tl, at);
          if (title) {
            tl.fromTo(
              title,
              { autoAlpha: 0, y: 6 },
              { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
              at + 0.35,
            );
          }
          if (body) {
            tl.fromTo(
              body,
              { autoAlpha: 0, y: 6 },
              { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
              at + 0.5,
            );
          }
        });
        return tl;
      };

      const countStats = (trigger: Element, start: string) => {
        statValues.forEach((el) => {
          const target = Number(el.dataset.statValue);
          const pad = el.dataset.statPad ? Number(el.dataset.statPad) : undefined;
          const state = { n: 0 };
          el.textContent = formatStat(0, pad);
          gsap.to(state, {
            n: target,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: { trigger, start, once: true },
            onUpdate: () => {
              el.textContent = formatStat(state.n, pad);
            },
          });
        });
      };

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        statValues.forEach((el) => {
          const pad = el.dataset.statPad ? Number(el.dataset.statPad) : undefined;
          el.textContent = formatStat(Number(el.dataset.statValue), pad);
        });
        if (fill) gsap.set(fill, { scaleX: 1 });
        setCount(items.length);
      });

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          clip.dataset.pinned = "true";
          if (fill) gsap.set(fill, { scaleX: 0 });
          setCount(VISIBLE_CARDS);

          const shift = () => Math.max(track.scrollWidth - clip.clientWidth, 0);

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: () =>
                `+=${Math.round(shift() * SCRUB_STRETCH + window.innerHeight * 0.35)}`,
              pin: true,
              pinType: "transform",
              anticipatePin: 1,
              scrub: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (fill) gsap.set(fill, { scaleX: self.progress });
                const extra = items.length - VISIBLE_CARDS;
                setCount(
                  VISIBLE_CARDS + Math.round(gsap.utils.clamp(0, 1, (self.progress - 0.2) / 0.8) * extra),
                );
              },
            },
          });

          tl.to({ n: 0 }, { n: 1, duration: 0.2 });
          tl.to(track, { x: () => -shift(), duration: 0.8 });

          drawGlyphs(root, "top 70%");
          countStats(root, "top 55%");

          return () => {
            delete clip.dataset.pinned;
            gsap.set(track, { clearProps: "x" });
          };
        },
      );

      mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          drawGlyphs(clip, "top 80%");
          countStats(root.querySelector("[data-caps-stats]") ?? root, "top 85%");
        },
      );

      mm.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const cleanups: Array<() => void> = [];
          cards.forEach((card) => {
            let hoverTl: gsap.core.Timeline | undefined;
            const enter = () => {
              hoverTl?.kill();
              hoverTl = drawCardGlyph(card);
            };
            const leave = () => {
              if (hoverTl?.isActive()) hoverTl.progress(1);
            };
            card.addEventListener("pointerenter", enter);
            card.addEventListener("pointerleave", leave);
            cleanups.push(() => {
              card.removeEventListener("pointerenter", enter);
              card.removeEventListener("pointerleave", leave);
              hoverTl?.kill();
            });
          });
          return () => cleanups.forEach((fn) => fn());
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <SectionGrid
      ref={sectionRef}
      id={id}
      aria-labelledby="caps-heading"
      rows={14}
      tone="page"
      outerV={false}
      className="flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)] scroll-mt-16 md:scroll-mt-0"
    >
      {/* Desktop rails */}
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-top-3 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-3-br4 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-br4-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-br2-end hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-top-3 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-3-br4 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-br4-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-br2-end hidden md:block" />
      {plain ? null : (
        <>
          <GridLine axis="v" unstyled tone="page" className="v-g1-3 v-seg-br4-br2 hidden md:block" />
          <GridLine axis="v" unstyled tone="page" className="v-g1-6 v-seg-br4-br2 hidden md:block" />
          <GridLine axis="v" unstyled tone="page" className="v-g1-9 v-seg-br4-br2 hidden md:block" />
        </>
      )}
      <GridLine axis="v" unstyled tone="page" className="v-g1-9 v-seg-br2-end hidden md:block" />

      {/* Row 3 */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 top-rows-3 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 top-rows-3 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 top-rows-3 hidden md:block" />

      {/* Row 10 (stats top) */}
      {plain ? (
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-br-4 hidden md:block" />
      ) : (
        <>
          <GridLine axis="h" unstyled tone="page" className="h-seg-0-3 at-br-4 hidden md:block" />
          <GridLine axis="h" unstyled tone="page" className="h-seg-3-6 at-br-4 hidden md:block" />
          <GridLine axis="h" unstyled tone="page" className="h-seg-6-9 at-br-4 hidden md:block" />
          <GridLine axis="h" unstyled tone="page" className="h-seg-9g-12 at-br-4 hidden md:block" />
          <PlusMark tone="page" arms={joinTeeDown} className="v-g1-3 at-br-4 hidden md:block" />
          <PlusMark tone="page" arms={joinTeeDown} className="v-g1-6 at-br-4 hidden md:block" />
          <PlusMark tone="page" arms={joinTeeDown} className="v-g1-9 at-br-4 hidden md:block" />
        </>
      )}
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 at-br-4 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-br-4 hidden md:block" />

      {/* Row 12 (stats bottom / CTA top) */}
      {plain ? (
        <>
          <GridLine axis="h" unstyled tone="page" className="h-seg-0-9g at-br-2 hidden md:block" />
          <GridLine axis="h" unstyled tone="page" className="h-seg-9g-12 at-br-2 hidden md:block" />
          <PlusMark tone="page" arms={joinTeeDown} className="v-g1-9 at-br-2 hidden md:block" />
        </>
      ) : (
        <>
          <GridLine axis="h" unstyled tone="page" className="h-seg-0-3 at-br-2 hidden md:block" />
          <GridLine axis="h" unstyled tone="page" className="h-seg-3-6 at-br-2 hidden md:block" />
          <GridLine axis="h" unstyled tone="page" className="h-seg-6-9 at-br-2 hidden md:block" />
          <GridLine axis="h" unstyled tone="page" className="h-seg-9g-12 at-br-2 hidden md:block" />
          <PlusMark tone="page" arms={joinTeeUp} className="v-g1-3 at-br-2 hidden md:block" />
          <PlusMark tone="page" arms={joinTeeUp} className="v-g1-6 at-br-2 hidden md:block" />
          <PlusMark tone="page" className="v-g1-9 at-br-2 hidden md:block" />
        </>
      )}
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 at-br-2 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-br-2 hidden md:block" />

      {/* Intro */}
      <div className="caps-intro min-h-rows-3">
        <GridLine axis="v" unstyled tone="page" className="v-g1-0 hero-v-above-plus md:hidden" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 hero-v-above-plus md:hidden" />
        <div className="caps-title">
          <p className="eyebrow">{copy.eyebrow}</p>
          <H2Heading id="caps-heading" className="text-left">
            {copy.heading[0]}
            <span className="ab-statement-muted">{copy.heading[1]}</span>
          </H2Heading>
        </div>
        <div className="caps-lede">
          {copy.lede.map((paragraph, i) => (
            <Copy key={paragraph} variant="lede" weight={i > 0 ? "normal" : "medium"}>
              {paragraph}
            </Copy>
          ))}
        </div>
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-bottom md:hidden" />
      </div>

      {/* Card track */}
      <div className="relative md:contents">
        <GridLine axis="v" unstyled tone="page" className="v-g1-0 hero-v-between-pluses md:hidden" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 hero-v-between-pluses md:hidden" />
        <div
          data-caps-clip
          className="caps-track-clip"
          aria-label="Capability cards"
        >
          <ol data-caps-track className="caps-track m-0 list-none p-0">
            {items.map((item, i) => (
              <li key={item.id} data-caps-card className="caps-card">
                <span aria-hidden className="caps-halo top-0 left-0" />
                <span aria-hidden className="caps-halo top-full left-0" />
                <GridLine
                  axis="v"
                  unstyled
                  tone="page"
                  className="caps-card-rail-top left-0"
                />
                <GridLine
                  axis="v"
                  unstyled
                  tone="page"
                  className="caps-card-rail-base left-0"
                />
                <PlusMark tone="page" arms={joinTeeDown} className="top-0 left-0" />
                <PlusMark tone="page" arms={joinTeeUp} className="top-full left-0" />
                <PlusMark
                  tone="page"
                  arms={i === 0 ? joinCardMid : undefined}
                  className="left-0"
                  style={{ top: "var(--row)" }}
                />
                <span aria-hidden className="caps-card-rule" />

                <div className="caps-card-head index-tag">
                  <span>{item.tag}</span>
                  <span aria-hidden>[{padIndex(i)}]</span>
                </div>

                <div className="caps-card-glyph dot-field-mark">
                  <CornerPlus className="plus-at-tl" />
                  <CornerPlus className="plus-at-tr" />
                  <CornerPlus className="plus-at-bl" />
                  <CornerPlus className="plus-at-br" />
                  <IsoGlyph kind={item.icon} className="caps-glyph" />
                </div>

                <div className="caps-card-base">
                  <H3Heading data-caps-title variant="title">
                    {item.title}
                  </H3Heading>
                  <Copy
                    data-caps-body
                    variant="caption"
                    className="md:text-justify md:[text-align-last:left]"
                  >
                    {item.body}
                  </Copy>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-bottom md:hidden" />
      </div>

      {/* Stats through CTA — one rail from the track plus to the section foot */}
      <div className="relative flex flex-col md:contents">
        <GridLine axis="v" unstyled tone="page" className="v-g1-0 hero-v-below-plus md:hidden" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 hero-v-below-plus md:hidden" />
        {plain ? (
          <div className="caps-foot min-h-rows-2">{foot}</div>
        ) : (
        <dl data-caps-stats className="caps-stats min-h-rows-2 m-0">
        {STATS.map((stat, i) => (
          <div key={stat.id} className="caps-stat">
            {i % 2 === 1 ? (
              <GridLine
                axis="v"
                unstyled
                tone="page"
                className="top-0 left-0 h-full md:hidden"
              />
            ) : null}
            {i >= 2 ? (
              <GridLine
                axis="h"
                unstyled
                tone="page"
                className="top-0 left-0 w-full md:hidden"
              />
            ) : null}
            <dt className="index-tag">{stat.label}</dt>
            <dd className="caps-stat-value m-0">
              <span
                data-stat-value={stat.value}
                data-stat-pad={stat.pad}
              >
                {formatStat(stat.value, stat.pad)}
              </span>
              {stat.suffix ? <span>{stat.suffix}</span> : null}
              {stat.unit ? (
                <span className="caps-stat-unit">{stat.unit}</span>
              ) : null}
            </dd>
          </div>
        ))}
        </dl>
        )}

        {/* Progress readout */}
        <div className="caps-progress" aria-hidden>
          <div className="flex items-center justify-between index-tag">
            <span className="flex items-center gap-1">
              <StationPlus />
              <StationDash />
              <span>{progressLabel}</span>
            </span>
            <span className="tabular-nums">
              <span data-caps-count>{padIndex(VISIBLE_CARDS - 1)}</span>
              {" / "}
              {padIndex(items.length - 1)}
            </span>
          </div>
          <div className="caps-progress-rail">
            <span data-caps-fill className="caps-progress-fill" />
          </div>
        </div>

        {cta ? (
          <BrandButton
            tone="steel"
            href={cta.href}
            className="caps-cta"
          >
            {cta.label}
          </BrandButton>
        ) : aside ? (
          <div className="caps-aside">{aside}</div>
        ) : null}
      </div>
      <ScrollHint seat="col-9" />
    </SectionGrid>
  );
}
