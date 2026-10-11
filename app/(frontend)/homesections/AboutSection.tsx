"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import BrandButton from "@/app/(frontend)/components/BrandButton";
import ScrollHint from "@/app/(frontend)/components/ScrollHint";
import MaskRevealHeading from "@/app/(frontend)/components/MaskRevealHeading";
import IsoGlyph from "@/app/(frontend)/components/IsoGlyph";
import PlusMark, { type PlusArms } from "@/app/(frontend)/components/PlusMark";
import SectionGrid, { GridLine } from "@/app/(frontend)/components/SectionGrid";
import { figLabel } from "@/app/(frontend)/components/FigMark";
import StoryProgress, {
  STORY,
  StationDash,
  StationPlus,
  padIndex,
  type StoryItem,
} from "@/app/(frontend)/homesections/StoryProgress";

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin);

export type StoryCopy = {
  index?: string;
  eyebrow: string;
  heading: readonly [string, string];
  lede: string;
  readoutLabel: string;
  readout: readonly { text: string; strong?: boolean }[];
  cta: { label: string; href: string };
};

const HOME_COPY: StoryCopy = {
  eyebrow: "Built From The Ground Up",
  heading: ["From Steel Fabrication", "to Advanced Engineering."],
  lede: "What began as a modest steel fabrication business has evolved into a Sri Lankan engineering company delivering precision manufacturing, OEM components and custom-built industrial machinery.",
  readoutLabel: "Our Story",
  readout: [
    { text: "We invest in people and technology " },
    { text: "to turn challenges into dependable solutions", strong: true },
    { text: "." },
  ],
  cta: { label: "Discover Our Story", href: "/#manufacturing" },
};

type Parts = {
  years: string[];
  washes: HTMLElement[];
  stations: HTMLElement[];
  slides: HTMLElement[];
  glyphs: HTMLElement[];
  texts: HTMLElement[];
  numeral: HTMLElement | null;
  fig: HTMLElement | null;
  count: HTMLElement | null;
  tabs: HTMLElement | null;
};

function showChapter(parts: Parts, index: number, animate: boolean) {
  const { glyphs, texts, numeral, fig, count, tabs, stations } = parts;
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

  if (numeral) numeral.textContent = parts.years[index] ?? padIndex(index);
  if (fig) fig.textContent = figLabel(index + 1);
  if (count) count.textContent = padIndex(index);

  // Keep the active station in view when the tab strip scrolls (mobile).
  const station = stations[index];
  if (tabs && station && tabs.scrollWidth > tabs.clientWidth) {
    tabs.scrollTo({
      left: station.offsetLeft - (tabs.clientWidth - station.offsetWidth) / 2,
      behavior: animate ? "smooth" : "auto",
    });
  }
}

function chapterScale(i: number, index: number, local: number, atEnd: boolean) {
  return atEnd || i < index ? 1 : i === index ? local : 0;
}

function setStoryWash(wash: HTMLElement, scale: number) {
  gsap.set(wash, { clipPath: `inset(0 ${(1 - scale) * 100}% 0 0)` });
}

function setStorySlide(slide: HTMLElement, scale: number) {
  gsap.set(slide, {
    autoAlpha: 1,
    clipPath: `inset(0 ${(1 - scale) * 100}% 0 0)`,
  });
}

function visibleStrokes(root: HTMLElement) {
  return root.querySelectorAll<SVGElement>('[data-glyph-stroke="visible"]');
}

function hiddenStrokes(root: HTMLElement) {
  return root.querySelectorAll<SVGElement>('[data-glyph-stroke="hidden"]');
}

function drawChapterGlyph(root: HTMLElement) {
  const tl = gsap.timeline();
  const visible = visibleStrokes(root);
  const hidden = hiddenStrokes(root);
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

  washes.forEach((wash, i) => {
    setStoryWash(wash, chapterScale(i, index, local, atEnd));
  });

  stations.forEach((station, i) => {
    const current = i === index;
    station.setAttribute("aria-selected", current ? "true" : "false");
    if (current) station.setAttribute("aria-current", "true");
    else station.removeAttribute("aria-current");
  });

  slides.forEach((slide, i) => {
    // First image stays open as the base; later slides wipe in over it.
    const scale = i === 0 ? 1 : chapterScale(i, index, local, atEnd);
    setStorySlide(slide, scale);
  });

  return index;
}

function StoryArrow({ direction }: { direction: "prev" | "next" }) {
  const prev = direction === "prev";

  return (
    <button
      type="button"
      className={`about-story-arrow about-story-${direction} md:hidden`}
      data-story-step={prev ? -1 : 1}
      aria-label={prev ? "Previous chapter" : "Next chapter"}
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

const joinLeftEdge: PlusArms = { up: true, down: true, left: false, right: true };
const joinRightEdge: PlusArms = { up: true, down: true, left: true, right: false };
const joinTeeDown: PlusArms = { up: false, down: true, left: true, right: true };
const joinTeeUp: PlusArms = { up: true, down: false, left: true, right: true };

export default function AboutSection({
  id = "about",
  copy = HOME_COPY,
  items = STORY,
  showTitles = false,
  figures = false,
}: {
  id?: string;
  copy?: StoryCopy;
  items?: StoryItem[];
  showTitles?: boolean;
  figures?: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useGSAP(
    (context, contextSafe) => {
      const root = sectionRef.current;
      if (!root || !contextSafe) return;

      const parts: Parts = {
        years: items.map((item) => item.year),
        slides: gsap.utils.toArray<HTMLElement>("[data-story-slide]", root),
        washes: gsap.utils.toArray<HTMLElement>("[data-story-wash]", root),
        stations: gsap.utils.toArray<HTMLElement>("[data-story-station]", root),
        glyphs: gsap.utils.toArray<HTMLElement>("[data-chapter-glyph]", root),
        texts: gsap.utils.toArray<HTMLElement>("[data-chapter-text]", root),
        numeral: root.querySelector<HTMLElement>("[data-chapter-numeral]"),
        fig: root.querySelector<HTMLElement>("[data-story-fig]"),
        count: root.querySelector<HTMLElement>("[data-story-count]"),
        tabs: root.querySelector<HTMLElement>(".about-tabs"),
      };

      const header = gsap.utils.toArray<HTMLElement>("[data-about-header]", root);

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

      const mm = gsap.matchMedia();

      // Without the scrub the tabs are the only way through the story.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const select = (index: number) => {
          parts.washes.forEach((wash, i) => {
            setStoryWash(wash, i === index ? 1 : 0);
          });
          parts.stations.forEach((station, i) => {
            station.setAttribute("aria-selected", i === index ? "true" : "false");
          });
          parts.slides.forEach((slide, i) => {
            setStorySlide(slide, i === 0 || i <= index ? 1 : 0);
          });
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

      const bindScrub = ({
        trigger,
        pin,
        start,
        end,
        id,
      }: {
        trigger: Element;
        pin: boolean;
        start: string;
        end: string;
        id: string;
      }) => {
        parts.washes.forEach((wash) => setStoryWash(wash, 0));
        parts.slides.forEach((slide, i) => setStorySlide(slide, i === 0 ? 1 : 0));
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
          id,
          trigger,
          start,
          end,
          pin,
          pinType: pin ? "transform" : undefined,
          anticipatePin: pin ? 1 : undefined,
          scrub: 1,
          invalidateOnRefresh: true,
          onEnter: () => playGlyph(Math.max(current, 0)),
          onUpdate: (self) => {
            sync(self.progress);
          },
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

        parts.stations.forEach((station) => {
          station.addEventListener("click", onClick);
        });

        return () => {
          parts.stations.forEach((station) => {
            station.removeEventListener("click", onClick);
          });
          glyphTl?.kill();
          st.kill();
        };
      };

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.fromTo(
            header,
            { autoAlpha: 0, y: 10 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.1,
              scrollTrigger: { trigger: root, start: "top 65%", once: true },
            },
          );

          return bindScrub({
            trigger: root,
            pin: true,
            start: "top top",
            end: "+=350%",
            id: `${id}-story-desktop`,
          });
        },
      );

      mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.fromTo(
            header,
            { autoAlpha: 0, y: 10 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.1,
              scrollTrigger: { trigger: root, start: "top 80%", once: true },
            },
          );

          const selectChapter = (index: number, animate: boolean) => {
            parts.washes.forEach((wash, i) => {
              setStoryWash(wash, i === index ? 1 : 0);
            });
            parts.stations.forEach((station, i) => {
              const current = i === index;
              station.setAttribute("aria-selected", current ? "true" : "false");
              if (current) station.setAttribute("aria-current", "true");
              else station.removeAttribute("aria-current");
            });
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
                setStorySlide(slide, open ? 1 : 0);
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

          const onClick = (event: Event) => {
            const btn = event.currentTarget;
            if (!(btn instanceof HTMLElement)) return;
            const index = parts.stations.indexOf(btn);
            if (index < 0 || index === activeChapter) return;
            selectChapter(index, true);
          };

          parts.stations.forEach((station) => {
            station.addEventListener("click", onClick);
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
            parts.stations.forEach((station) => {
              station.removeEventListener("click", onClick);
            });
            arrows.forEach((arrow) => arrow.removeEventListener("click", onStep));
            glyphTl?.kill();
            reveal.kill();
          };
        },
      );

      mm.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const field = root.querySelector<HTMLElement>(".about-chapter-glyph");
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
      aria-labelledby={`${id}-heading`}
      rows={14}
      tone="page"
      outerV={false}
      className="flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)] scroll-mt-16 md:scroll-mt-0"
    >
      {/* Desktop rails */}
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-top-3 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-3-4 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-4-8 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-8-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-br2-end hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-top-3 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-3-4 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-4-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-br2-end hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 v-seg-4-8 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 v-seg-8-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-8 v-seg-top-3 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-9 v-seg-br2-end hidden md:block" />

      {/* Row 3 */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-8 top-rows-3 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-8-12 top-rows-3 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 top-rows-3 hidden md:block" />
      <PlusMark tone="page" arms={joinTeeUp} className="v-g1-8 top-rows-3 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 top-rows-3 hidden md:block" />

      {/* Row 4 */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-mid top-rows-4 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-mid-12 top-rows-4 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 top-rows-4 hidden md:block" />
      <PlusMark tone="page" arms={joinTeeDown} className="v-g1-6 top-rows-4 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 top-rows-4 hidden md:block" />

      {/* Row 8 */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-mid top-rows-8 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 top-rows-8 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-6 top-rows-8 hidden md:block" />

      {/* Row 12 */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-mid at-br-2 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-6-9 at-br-2 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-9g-12 at-br-2 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 at-br-2 hidden md:block" />
      <PlusMark tone="page" arms={joinTeeUp} className="v-g1-6 at-br-2 hidden md:block" />
      <PlusMark tone="page" arms={joinTeeDown} className="v-g1-9 at-br-2 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-br-2 hidden md:block" />

      {/* Intro */}
      <div className="about-intro min-h-rows-3">
        <div className="about-title">
          <p data-about-header className="eyebrow">
            {copy.index ? (
              <span className="mr-3 tabular-nums opacity-60">{copy.index}</span>
            ) : null}
            {copy.eyebrow}
          </p>
          <MaskRevealHeading
            id={`${id}-heading`}
            className="font-heading text-[clamp(28px,2.5vw,48px)] leading-none font-medium text-left uppercase"
          >
            {copy.heading[0]}
            <span className="ab-statement-muted">{copy.heading[1]}</span>
          </MaskRevealHeading>
        </div>
        <p
          data-about-header
          className="about-lede font-heading text-[clamp(12px,1vw,16px)] leading-snug font-medium text-left uppercase md:text-justify md:leading-none md:[text-align-last:left]"
        >
          {copy.lede}
        </p>
        <GridLine axis="v" unstyled tone="page" className="v-g1-0 hero-v-above-plus md:hidden" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 hero-v-above-plus md:hidden" />
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-bottom md:hidden" />
      </div>

      {/* Chapter tabs */}
      <div className="about-tabs-band relative min-w-0 md:contents">
        <StoryProgress items={items} />
        <GridLine axis="v" unstyled tone="page" className="v-g1-0 hero-v-between-pluses md:hidden" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 hero-v-between-pluses md:hidden" />
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-bottom md:hidden" />
      </div>

      {/* Active chapter */}
      <div className="about-chapter">
        <div className="relative flex flex-col">
          <GridLine axis="v" unstyled tone="page" className="v-g1-0 hero-v-between-pluses md:hidden" />
          <GridLine axis="v" unstyled tone="page" className="v-g1-12 hero-v-between-pluses md:hidden" />
          <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
          <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 at-bottom md:hidden" />
          <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-bottom md:hidden" />
          <div className="about-chapter-glyph dot-field-mark">
          <PlusMark tone="page" className="plus-at-tl z-10" />
          <PlusMark tone="page" className="plus-at-tr z-10" />
          <PlusMark tone="page" className="plus-at-bl z-10" />
          <PlusMark tone="page" className="plus-at-br z-10" />
          {items.map((item, i) => (
            <span
              key={item.id}
              data-chapter-glyph={i}
              className="about-chapter-panel"
            >
              <IsoGlyph kind={item.icon} className="about-chapter-mark" />
            </span>
          ))}
          <span aria-hidden data-chapter-numeral className="about-chapter-numeral">
            {items[0]?.year}
          </span>
          </div>
        </div>
        <div className="about-chapter-copy">
          <GridLine axis="v" unstyled tone="page" className="v-g1-0 hero-v-between-pluses md:hidden" />
          <GridLine axis="v" unstyled tone="page" className="v-g1-12 hero-v-between-pluses md:hidden" />
          <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
          <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 at-bottom md:hidden" />
          <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-bottom md:hidden" />
          <StoryArrow direction="prev" />
          <div className="about-chapter-texts">
          {items.map((item, i) => (
            <div key={item.id} data-chapter-text={i} className="about-chapter-text">
              <p className="index-tag flex items-center justify-between gap-4">
                <span>{item.label}</span>
                <span className="about-story-year tabular-nums">{item.year}</span>
              </p>
              {showTitles ? (
                <h3 className="font-heading text-[clamp(16px,1.25vw,24px)] leading-none font-medium uppercase">
                  {item.title}
                </h3>
              ) : null}
              <p className="font-heading text-[clamp(12px,1vw,16px)] leading-none font-medium uppercase md:text-justify md:[text-align-last:left]">
                {item.body}
              </p>
            </div>
          ))}
          </div>
          <StoryArrow direction="next" />
        </div>
      </div>

      {/* Story reel */}
      <div className="about-media relative md:contents">
        <GridLine axis="v" unstyled tone="page" className="v-g1-0 hero-v-above-plus md:hidden" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 hero-v-above-plus md:hidden" />
        <div className="about-reel">
          {items.map((item, index) => (
            <Image
              key={item.id}
              data-story-slide=""
              src={item.image}
              alt={item.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              priority={index === 0}
              loading={index === 0 ? undefined : "eager"}
              className="object-cover"
              style={{ zIndex: index, objectPosition: item.objectPosition }}
            />
          ))}
          <PlusMark tone="light" className="top-4 left-4 z-10" />
          <PlusMark tone="light" className="top-4 left-[calc(100%-16px)] z-10" />
          <PlusMark tone="light" className="top-[calc(100%-16px)] left-4 z-10" />
          <PlusMark tone="light" className="top-[calc(100%-16px)] left-[calc(100%-16px)] z-10" />
          {figures ? (
            <p aria-hidden data-story-fig className="fig-mark index-tag">
              {figLabel(1)}
            </p>
          ) : null}
        </div>
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-bottom md:hidden" />
      </div>

      {/* Readout */}
      <div className="about-foot relative flex flex-col md:contents">
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 hero-v-below-plus md:hidden" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 hero-v-below-plus md:hidden" />
      <div className="about-readout">
        <div className="index-tag flex items-center justify-between gap-4">
          <span className="flex items-center gap-1">
            <StationPlus />
            <StationDash />
            <span>{copy.readoutLabel}</span>
          </span>
          <span className="tabular-nums">
            <span data-story-count>01</span>
            {" / "}
            {padIndex(items.length - 1)}
          </span>
        </div>
        <p className="font-heading text-[clamp(10px,0.85vw,12px)] leading-[1.3] font-normal uppercase">
          {copy.readout.map((part) =>
            part.strong ? (
              <strong key={part.text} className="font-medium">
                {part.text}
              </strong>
            ) : (
              part.text
            ),
          )}
        </p>
      </div>

      <BrandButton tone="steel" href={copy.cta.href} className="about-cta">
        {copy.cta.label}
      </BrandButton>
      </div>
      <ScrollHint seat="col-9" />
    </SectionGrid>
  );
}
