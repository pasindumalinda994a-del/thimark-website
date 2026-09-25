"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import BrandButton from "@/app/components/BrandButton";
import ScrollHint, { setScrollHintHidden } from "@/app/components/ScrollHint";
import MaskRevealHeading from "@/app/components/MaskRevealHeading";
import CapabilityGlyph, { type GlyphKind } from "@/app/components/CapabilityGlyph";
import PlusMark from "@/app/components/PlusMark";
import SectionGrid, { GridLine } from "@/app/components/SectionGrid";

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin);

const CAPABILITIES: {
  id: string;
  tag: string;
  title: string;
  body: string;
  glyph: GlyphKind;
}[] = [
  {
    id: "precision",
    tag: "Precision",
    title: "Precision Manufacturing",
    body: "Quality-controlled production processes designed for accuracy, reliability and consistency.",
    glyph: "precision",
  },
  {
    id: "engineering",
    tag: "Engineering",
    title: "Engineering & Design",
    body: "Engineering expertise focused on developing practical solutions for automotive and industrial applications.",
    glyph: "engineering",
  },
  {
    id: "fabrication",
    tag: "Fabrication",
    title: "Heavy Steel Fabrication",
    body: "Proven fabrication capability developed through years of mechanical engineering and industrial projects.",
    glyph: "fabrication",
  },
  {
    id: "oem",
    tag: "OEM",
    title: "OEM Manufacturing",
    body: "Production of motorcycle components for established local assembly and manufacturing partners.",
    glyph: "oem",
  },
  {
    id: "machinery",
    tag: "Machinery",
    title: "Industrial Machinery",
    body: "Design and manufacture of customized machinery and mechanical systems.",
    glyph: "machinery",
  },
  {
    id: "automation",
    tag: "Automation",
    title: "Automation & Custom Solutions",
    body: "Integration of mechanical, hydraulic and control technologies to solve specialized industrial challenges.",
    glyph: "automation",
  },
];

const STATS: {
  id: string;
  label: string;
  value: number;
  pad?: number;
  suffix?: string;
  unit?: string;
}[] = [
  {
    id: "factory",
    label: "Modern Factory",
    value: 15000,
    suffix: "+",
    unit: "sq. ft.",
  },
  { id: "employees", label: "Skilled Employees", value: 95 },
  { id: "engineers", label: "Qualified Engineers", value: 7, pad: 2 },
  { id: "projects", label: "Projects Completed", value: 120, suffix: "+" },
];

const VISIBLE_CARDS = 4;
const SCRUB_STRETCH = 1.6;

function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

function formatStat(value: number, pad?: number) {
  const rounded = Math.round(value);
  if (pad) return String(rounded).padStart(pad, "0");
  return rounded.toLocaleString("en-US");
}

function StationPlus() {
  return (
    <svg
      aria-hidden
      width={7}
      height={7}
      viewBox="0 0 7 7"
      fill="none"
      className="size-[7px] shrink-0"
    >
      <line
        x1="0"
        y1="3.5"
        x2="7"
        y2="3.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
      />
      <line
        x1="3.5"
        y1="0"
        x2="3.5"
        y2="7"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
      />
    </svg>
  );
}

function CornerPlus({ className }: { className: string }) {
  return <PlusMark tone="page" className={`${className} z-10`} />;
}

export default function CapabilitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);

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
        tl.fromTo(
          visibleStrokes(card),
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            duration: 0.9,
            ease: "power2.inOut",
            stagger: 0.02,
            overwrite: "auto",
          },
          at,
        );
        tl.fromTo(
          hiddenStrokes(card),
          { autoAlpha: 0 },
          {
            autoAlpha: 0.55,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          },
          at + 0.7,
        );
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
        setCount(CAPABILITIES.length);
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
                const extra = CAPABILITIES.length - VISIBLE_CARDS;
                setCount(
                  VISIBLE_CARDS + Math.round(gsap.utils.clamp(0, 1, (self.progress - 0.2) / 0.8) * extra),
                );
                setScrollHintHidden(root, self.progress);
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
      id="manufacturing"
      aria-labelledby="caps-heading"
      rows={14}
      tone="page"
      outerV={false}
      className="flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)] scroll-mt-16 md:scroll-mt-0"
    >
      {/* Mobile rails */}
      <GridLine axis="v" tone="page" className="v-g1-0 md:hidden" />
      <GridLine axis="v" tone="page" className="v-g1-12 md:hidden" />

      {/* Desktop rails */}
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-top-3 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-3-br4 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-br4-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-br2-end hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-top-3 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-3-br4 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-br4-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-br2-end hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-3 v-seg-br4-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 v-seg-br4-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-9 v-seg-br4-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-9 v-seg-br2-end hidden md:block" />

      {/* Row 3 */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 top-rows-3 hidden md:block" />
      <PlusMark tone="page" className="v-g1-0 top-rows-3 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 top-rows-3 hidden md:block" />

      {/* Row 10 (stats top) */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-3 at-br-4 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-3-6 at-br-4 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-6-9 at-br-4 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-9g-12 at-br-4 hidden md:block" />
      <PlusMark tone="page" className="v-g1-0 at-br-4 hidden md:block" />
      <PlusMark tone="page" className="v-g1-3 at-br-4 hidden md:block" />
      <PlusMark tone="page" className="v-g1-6 at-br-4 hidden md:block" />
      <PlusMark tone="page" className="v-g1-9 at-br-4 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 at-br-4 hidden md:block" />

      {/* Row 12 (stats bottom / CTA top) */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-9g at-br-2 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-9g-12 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-0 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-3 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-6 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-9 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 at-br-2 hidden md:block" />

      {/* Intro */}
      <div className="caps-intro min-h-rows-3">
        <div className="caps-title">
          <p className="eyebrow">The Thimark Advantage</p>
          <MaskRevealHeading
            id="caps-heading"
            className="font-heading text-[clamp(28px,2.5vw,48px)] leading-none font-medium text-left uppercase"
          >
            Capability You
            <span className="block">Can Build On.</span>
          </MaskRevealHeading>
        </div>
        <div className="caps-lede font-heading text-[clamp(12px,1vw,16px)] leading-none font-medium text-left uppercase md:text-justify md:[text-align-last:left]">
          <p>
            Great engineering starts with good ideas — but reliable products
            require the capability to turn those ideas into reality.
          </p>
          <p className="font-normal">
            Thimark has developed its manufacturing infrastructure, technical
            expertise and production systems to support precision, consistency
            and dependable delivery.
          </p>
        </div>
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-12 at-bottom md:hidden" />
      </div>

      {/* Card track */}
      <div className="relative md:contents">
        <div
          data-caps-clip
          className="caps-track-clip"
          aria-label="Capability cards"
        >
          <ol data-caps-track className="caps-track m-0 list-none p-0">
            {CAPABILITIES.map((item, i) => (
              <li key={item.id} data-caps-card className="caps-card">
                <span aria-hidden className="caps-halo top-0 left-0" />
                <span aria-hidden className="caps-halo top-full left-0" />
                <GridLine
                  axis="v"
                  unstyled
                  tone="page"
                  className="top-0 left-0 h-full"
                />
                <PlusMark tone="page" className="top-0 left-0" />
                <PlusMark tone="page" className="top-full left-0" />
                <PlusMark tone="page" className="left-0" style={{ top: "var(--row)" }} />
                <span aria-hidden className="caps-card-rule" />

                <div className="caps-card-head index-tag">
                  <span>{item.tag}</span>
                  <span aria-hidden>[{padIndex(i)}]</span>
                </div>

                <div className="caps-card-glyph dot-field-soft">
                  <CornerPlus className="top-4 left-4" />
                  <CornerPlus className="top-4 left-[calc(100%-16px)]" />
                  <CornerPlus className="top-[calc(100%-16px)] left-4" />
                  <CornerPlus className="top-[calc(100%-16px)] left-[calc(100%-16px)]" />
                  <CapabilityGlyph kind={item.glyph} className="caps-glyph" />
                </div>

                <div className="caps-card-base">
                  <h3
                    data-caps-title
                    className="font-heading text-[clamp(16px,1.25vw,24px)] leading-none font-medium uppercase"
                  >
                    {item.title}
                  </h3>
                  <p
                    data-caps-body
                    className="font-heading text-[clamp(10px,0.85vw,12px)] leading-none font-normal uppercase md:text-justify md:[text-align-last:left]"
                  >
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-12 at-bottom md:hidden" />
      </div>

      {/* Stats */}
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

      {/* Progress readout */}
      <div className="caps-progress" aria-hidden>
        <div className="flex items-center justify-between index-tag">
          <span className="flex items-center gap-1">
            <StationPlus />
            <span className="inline-block h-[1.5px] w-2 bg-current" />
            <span>Capabilities</span>
          </span>
          <span className="tabular-nums">
            <span data-caps-count>{padIndex(VISIBLE_CARDS - 1)}</span>
            {" / "}
            {padIndex(CAPABILITIES.length - 1)}
          </span>
        </div>
        <div className="caps-progress-rail">
          <span data-caps-fill className="caps-progress-fill" />
        </div>
      </div>

      <BrandButton
        tone="steel"
        href="/#catalogue"
        className="caps-cta"
      >
        Explore Our Capabilities
      </BrandButton>
      <ScrollHint seat="col-9" />
    </SectionGrid>
  );
}
