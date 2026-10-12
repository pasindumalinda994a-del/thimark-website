"use client";

import Copy from "@/app/(frontend)/components/Copy";
import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import H2Heading from "@/app/(frontend)/components/H2Heading";
import H3Heading from "@/app/(frontend)/components/H3Heading";
import IsoGlyph from "@/app/(frontend)/components/IsoGlyph";
import PlusMark from "@/app/(frontend)/components/PlusMark";
import SectionGrid from "@/app/(frontend)/components/SectionGrid";
import { figLabel } from "@/app/(frontend)/components/FigMark";
import {
  Cell,
  Corners,
  Frame,
  MobileEdge,
  type HLine,
  type VLine,
} from "@/app/(frontend)/components/plate";
import StoryProgress, {
  StationDash,
  StationPlus,
  padIndex,
} from "@/app/(frontend)/homesections/StoryProgress";
import { JOURNEY, JOURNEY_COPY, type JourneyItem } from "./about";

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin);

const H: HLine[] = [
  [3, 0, 12],
  [4, 0, 12],
  [8, 7, 12],
  [12, 0, 12],
];

const V: VLine[] = [
  [0, 0, 14],
  [12, 0, 14],
  [8, 0, 3],
  [7, 4, 12],
];

/** Where each milestone sits on the year axis, 0 at the first year and 1 at the last. */
function axisStops(items: JourneyItem[]) {
  const years = items.map((item) => Number(item.year));
  const first = years[0] ?? 0;
  const span = Math.max(1, (years[years.length - 1] ?? first) - first);
  return years.map((year) => (year - first) / span);
}

type Parts = {
  years: string[];
  stops: number[];
  washes: HTMLElement[];
  stations: HTMLElement[];
  slides: HTMLElement[];
  glyphs: HTMLElement[];
  texts: HTMLElement[];
  marks: HTMLElement[];
  numeral: HTMLElement | null;
  fig: HTMLElement | null;
  count: HTMLElement | null;
  fill: HTMLElement | null;
};

function showChapter(parts: Parts, index: number, animate: boolean) {
  const { glyphs, texts, numeral, fig, count } = parts;
  const duration = animate ? 0.32 : 0;

  glyphs.forEach((glyph, i) => {
    gsap.to(glyph, {
      autoAlpha: i === index ? 1 : 0,
      duration,
      ease: "power2.out",
      overwrite: "auto",
    });
  });

  texts.forEach((text, i) => {
    gsap.to(text, {
      autoAlpha: i === index ? 1 : 0,
      y: i === index ? 0 : 8,
      duration,
      ease: "power2.out",
      overwrite: "auto",
    });
  });

  if (numeral) numeral.textContent = parts.years[index] ?? "";
  if (fig) fig.textContent = figLabel(index + 1);
  if (count) count.textContent = padIndex(index);

  parts.marks.forEach((mark, i) => {
    mark.dataset.passed = i <= index ? "true" : "false";
  });
}

function chapterScale(i: number, index: number, local: number, atEnd: boolean) {
  return atEnd || i < index ? 1 : i === index ? local : 0;
}

function setWash(wash: HTMLElement, scale: number) {
  gsap.set(wash, { clipPath: `inset(0 ${(1 - scale) * 100}% 0 0)` });
}

function setSlide(slide: HTMLElement, scale: number) {
  gsap.set(slide, { autoAlpha: 1, clipPath: `inset(0 ${(1 - scale) * 100}% 0 0)` });
}

function setAxis(parts: Parts, index: number, local: number) {
  if (!parts.fill) return;
  const from = parts.stops[index] ?? 0;
  const to = parts.stops[index + 1] ?? 1;
  gsap.set(parts.fill, { scaleX: from + (to - from) * local });
}

function drawChapterGlyph(root: HTMLElement) {
  const tl = gsap.timeline();
  const visible = root.querySelectorAll<SVGElement>('[data-glyph-stroke="visible"]');
  const hidden = root.querySelectorAll<SVGElement>('[data-glyph-stroke="hidden"]');
  if (visible.length) {
    tl.fromTo(
      visible,
      { drawSVG: "0%" },
      { drawSVG: "100%", duration: 1.1, ease: "power2.inOut", stagger: 0.035, overwrite: "auto" },
    );
  }
  if (hidden.length) {
    tl.fromTo(
      hidden,
      { autoAlpha: 0 },
      { autoAlpha: 0.55, duration: 0.4, ease: "power2.out", overwrite: "auto" },
      0.7,
    );
  }
  return tl;
}

function applyChapter(parts: Parts, progress: number) {
  const { washes, stations, slides } = parts;
  // One wipe segment per station so the last tab fills gradually too.
  const count = Math.max(1, stations.length);
  const scaled = progress * count;
  const index = Math.min(count - 1, Math.floor(scaled + 1e-4));
  const local = gsap.utils.clamp(0, 1, scaled - index);
  const atEnd = progress >= 1;

  washes.forEach((wash, i) => setWash(wash, chapterScale(i, index, local, atEnd)));

  stations.forEach((station, i) => {
    const current = i === index;
    station.setAttribute("aria-selected", current ? "true" : "false");
    if (current) station.setAttribute("aria-current", "true");
    else station.removeAttribute("aria-current");
  });

  slides.forEach((slide, i) => {
    // First image stays open as the base; later slides wipe in over it.
    setSlide(slide, i === 0 ? 1 : chapterScale(i, index, local, atEnd));
  });

  setAxis(parts, index, atEnd ? 1 : local);
  return index;
}

function StoryArrow({ direction }: { direction: "prev" | "next" }) {
  const prev = direction === "prev";

  return (
    <button
      type="button"
      className={`about-story-arrow about-story-${direction} md:hidden`}
      data-story-step={prev ? -1 : 1}
      aria-label={prev ? "Previous milestone" : "Next milestone"}
    >
      <svg aria-hidden width={14} height={14} viewBox="0 0 14 14" fill="none">
        <path
          d={prev ? "M9 2.5 4.5 7 9 11.5" : "M5 2.5 9.5 7 5 11.5"}
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="square"
        />
      </svg>
    </button>
  );
}

export default function JourneySection({
  id = "journey",
  items = JOURNEY,
}: {
  id?: string;
  items?: JourneyItem[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  const stops = axisStops(items);

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useGSAP(
    (_context, contextSafe) => {
      const root = sectionRef.current;
      if (!root || !contextSafe) return;

      const parts: Parts = {
        years: items.map((item) => item.year),
        stops: axisStops(items),
        slides: gsap.utils.toArray<HTMLElement>("[data-story-slide]", root),
        washes: gsap.utils.toArray<HTMLElement>("[data-story-wash]", root),
        stations: gsap.utils.toArray<HTMLElement>("[data-story-station]", root),
        glyphs: gsap.utils.toArray<HTMLElement>("[data-chapter-glyph]", root),
        texts: gsap.utils.toArray<HTMLElement>("[data-chapter-text]", root),
        marks: gsap.utils.toArray<HTMLElement>("[data-jr-stop]", root),
        numeral: root.querySelector<HTMLElement>("[data-chapter-numeral]"),
        fig: root.querySelector<HTMLElement>("[data-story-fig]"),
        count: root.querySelector<HTMLElement>("[data-story-count]"),
        fill: root.querySelector<HTMLElement>("[data-jr-fill]"),
      };

      const header = gsap.utils.toArray<HTMLElement>("[data-jr-header]", root);

      let activeChapter = 0;
      let glyphTl: gsap.core.Timeline | undefined;

      const playGlyph = (index: number) => {
        const glyph = parts.glyphs[index];
        if (!glyph) return;
        glyphTl?.kill();
        glyphTl = drawChapterGlyph(glyph);
      };

      const syncArrows = (index: number) => {
        const prev = root.querySelector<HTMLButtonElement>("[data-story-step='-1']");
        const next = root.querySelector<HTMLButtonElement>("[data-story-step='1']");
        if (prev) prev.disabled = index <= 0;
        if (next) next.disabled = index >= parts.stations.length - 1;
      };

      const revealHeader = (start: string) => {
        gsap.fromTo(
          header,
          { autoAlpha: 0, y: 10 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.1,
            scrollTrigger: { trigger: root, start, once: true },
          },
        );
      };

      const mm = gsap.matchMedia();

      // Without the scrub the tabs and arrows are the only way through the journey.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const select = (index: number) => {
          parts.washes.forEach((wash, i) => setWash(wash, i === index ? 1 : 0));
          parts.stations.forEach((station, i) => {
            station.setAttribute("aria-selected", i === index ? "true" : "false");
          });
          parts.slides.forEach((slide, i) => setSlide(slide, i === 0 || i <= index ? 1 : 0));
          setAxis(parts, index, 0);
          showChapter(parts, index, false);
          activeChapter = index;
          syncArrows(index);
        };

        const handlers = parts.stations.map((station, i) => {
          const onClick = () => select(i);
          station.addEventListener("click", onClick);
          return onClick;
        });
        const onStep = (event: Event) => {
          const btn = event.currentTarget;
          if (!(btn instanceof HTMLButtonElement)) return;
          const index = activeChapter + Number(btn.dataset.storyStep);
          if (index < 0 || index >= parts.stations.length) return;
          select(index);
        };
        const arrows = root.querySelectorAll<HTMLButtonElement>("[data-story-step]");
        arrows.forEach((arrow) => arrow.addEventListener("click", onStep));
        select(0);

        return () => {
          parts.stations.forEach((station, i) => {
            station.removeEventListener("click", handlers[i]);
          });
          arrows.forEach((arrow) => arrow.removeEventListener("click", onStep));
        };
      });

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        revealHeader("top 65%");

        parts.washes.forEach((wash) => setWash(wash, 0));
        parts.slides.forEach((slide, i) => setSlide(slide, i === 0 ? 1 : 0));
        gsap.set(parts.glyphs, { autoAlpha: 0 });
        gsap.set(parts.texts, { autoAlpha: 0, y: 8 });

        let current = -1;
        const sync = (progress: number) => {
          const index = applyChapter(parts, progress);
          activeChapter = index;
          if (index === current) return;
          const initialized = current >= 0;
          showChapter(parts, index, initialized);
          current = index;
          if (initialized) playGlyph(index);
        };
        sync(0);

        const st = ScrollTrigger.create({
          id: `${id}-journey`,
          trigger: root,
          start: "top top",
          end: "+=350%",
          pin: true,
          pinType: "transform",
          anticipatePin: 1,
          scrub: 1,
          invalidateOnRefresh: true,
          onEnter: () => playGlyph(Math.max(current, 0)),
          onUpdate: (self) => sync(self.progress),
        });

        const onClick = contextSafe((event: Event) => {
          const btn = event.currentTarget;
          if (!(btn instanceof HTMLElement)) return;
          const i = parts.stations.indexOf(btn);
          if (i < 0) return;
          const progress = i / Math.max(1, parts.stations.length);
          const y = st.start + (st.end - st.start) * progress;
          const scroller = lenisRef.current;
          if (scroller) scroller.scrollTo(y, { duration: 1.1 });
          else window.scrollTo({ top: y, behavior: "smooth" });
        });

        parts.stations.forEach((station) => station.addEventListener("click", onClick));

        return () => {
          parts.stations.forEach((station) => station.removeEventListener("click", onClick));
          glyphTl?.kill();
          st.kill();
        };
      });

      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        revealHeader("top 80%");

        const selectChapter = (index: number, animate: boolean) => {
          parts.slides.forEach((slide, i) => {
            const open = i === 0 || i <= index;
            if (animate && i === index && i > 0) {
              gsap.fromTo(
                slide,
                { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" },
                {
                  autoAlpha: 1,
                  clipPath: "inset(0 0% 0 0)",
                  duration: 0.45,
                  ease: "power2.inOut",
                  overwrite: "auto",
                },
              );
            } else {
              setSlide(slide, open ? 1 : 0);
            }
          });
          showChapter(parts, index, animate);
          activeChapter = index;
          syncArrows(index);
          if (animate) playGlyph(index);
        };

        selectChapter(0, false);

        const reveal = ScrollTrigger.create({
          trigger: root,
          start: "top 80%",
          once: true,
          onEnter: () => playGlyph(activeChapter),
        });

        const onStep = (event: Event) => {
          const btn = event.currentTarget;
          if (!(btn instanceof HTMLButtonElement)) return;
          const index = activeChapter + Number(btn.dataset.storyStep);
          if (index < 0 || index >= parts.stations.length || index === activeChapter) return;
          selectChapter(index, true);
        };
        const arrows = root.querySelectorAll<HTMLButtonElement>("[data-story-step]");
        arrows.forEach((arrow) => arrow.addEventListener("click", onStep));

        return () => {
          arrows.forEach((arrow) => arrow.removeEventListener("click", onStep));
          glyphTl?.kill();
          reveal.kill();
        };
      });

      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const field = root.querySelector<HTMLElement>(".jr-glyph .about-chapter-glyph");
        if (!field) return;
        const enter = () => playGlyph(activeChapter);
        const leave = () => {
          if (glyphTl?.isActive()) glyphTl.progress(1);
        };
        field.addEventListener("pointerenter", enter);
        field.addEventListener("pointerleave", leave);
        return () => {
          field.removeEventListener("pointerenter", enter);
          field.removeEventListener("pointerleave", leave);
        };
      });

      return () => mm.revert();
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
      className="flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)] scroll-mt-16 md:scroll-mt-0"
    >
      <Frame h={H} v={V} />

      <Cell at={[0, 8, 0, 3]} className="plate-title">
        <MobileEdge open />
        <p data-jr-header className="eyebrow">
          {JOURNEY_COPY.eyebrow}
        </p>
        <H2Heading id={`${id}-heading`}>
          {JOURNEY_COPY.heading[0]}
          <span className="ab-statement-muted">{JOURNEY_COPY.heading[1]}</span>
        </H2Heading>
      </Cell>

      <Cell at={[8, 12, 0, 3]} className="jr-readout">
        <MobileEdge />
        <p data-jr-header className="index-tag flex items-center justify-between gap-4">
          <span className="flex items-center gap-1">
            <StationPlus />
            <StationDash />
            <span>{JOURNEY_COPY.readoutLabel}</span>
          </span>
          <span className="tabular-nums">
            <span data-story-count>01</span>
            {" / "}
            {padIndex(items.length - 1)}
          </span>
        </p>
        <span aria-hidden data-chapter-numeral className="jr-numeral ab-outline">
          {items[0]?.year}
        </span>
      </Cell>

      <Cell at={[0, 12, 3, 4]} className="jr-tabs hidden md:block">
        <StoryProgress items={items} />
      </Cell>

      <Cell at={[0, 7, 4, 12]} className="jr-reel-cell">
        <MobileEdge />
        <div className="jr-reel">
          {items.map((item, index) => (
            <Image
              key={item.id}
              data-story-slide=""
              src={item.image}
              alt={item.alt}
              fill
              sizes="(min-width: 768px) 55vw, 100vw"
              loading="eager"
              className="object-cover"
              style={{ zIndex: index, objectPosition: item.objectPosition }}
            />
          ))}
          <span aria-hidden className="ah-media-scrim" style={{ zIndex: items.length }} />
          <Corners tone="light" />
          <p aria-hidden className="jr-reel-caption index-tag">
            <span data-story-fig>{figLabel(1)}</span>
            <span>Thimark &middot; {JOURNEY_COPY.eyebrow}</span>
          </p>
        </div>
      </Cell>

      <Cell at={[7, 12, 4, 8]} className="jr-glyph">
        <MobileEdge />
        <div className="about-chapter-glyph dot-field-mark">
          <PlusMark tone="page" className="plus-at-tl z-10" />
          <PlusMark tone="page" className="plus-at-tr z-10" />
          <PlusMark tone="page" className="plus-at-bl z-10" />
          <PlusMark tone="page" className="plus-at-br z-10" />
          {items.map((item, i) => (
            <span key={item.id} data-chapter-glyph={i} className="about-chapter-panel">
              <IsoGlyph kind={item.icon} className="about-chapter-mark" />
            </span>
          ))}
        </div>
      </Cell>

      <Cell at={[7, 12, 8, 12]} className="jr-copy">
        <MobileEdge />
        <div className="about-chapter-copy">
          <StoryArrow direction="prev" />
          <div className="about-chapter-texts">
            {items.map((item, i) => (
              <article
                key={item.id}
                data-chapter-text={i}
                className="about-chapter-text"
                aria-labelledby={`${id}-${item.id}`}
              >
                <p className="index-tag flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2">
                    <span aria-hidden className="ab-marker" />
                    {item.label}
                  </span>
                  <span className="flex items-center gap-2 tabular-nums">
                    {item.status === "planned" ? (
                      <span className="jr-status">{JOURNEY_COPY.plannedLabel}</span>
                    ) : null}
                    {item.year}
                  </span>
                </p>
                <H3Heading id={`${id}-${item.id}`} variant="title">
                  {item.title}
                </H3Heading>
                <Copy variant="body" className="ab-copy">{item.body}</Copy>
              </article>
            ))}
          </div>
          <StoryArrow direction="next" />
        </div>
      </Cell>

      <Cell at={[0, 12, 12, 14]} className="jr-axis hidden md:block" aria-hidden>
        <span className="jr-axis-track" />
        <span data-jr-fill className="jr-axis-fill" />
        {items.map((item, i) => (
          <span
            key={item.id}
            data-jr-stop=""
            data-passed={i === 0 ? "true" : "false"}
            data-side={i % 2 === 0 ? "below" : "above"}
            className="jr-axis-stop index-tag"
            style={{ "--at": stops[i] } as CSSProperties}
          >
            <span className="jr-axis-dot" />
            <span className="jr-axis-year tabular-nums">{item.year}</span>
            <span className="jr-axis-label">{item.label}</span>
          </span>
        ))}
      </Cell>
    </SectionGrid>
  );
}
