"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import BrandButton from "@/app/components/BrandButton";
import ScrollHint, { setScrollHintHidden } from "@/app/components/ScrollHint";
import MaskRevealHeading from "@/app/components/MaskRevealHeading";
import CapabilityGlyph from "@/app/components/CapabilityGlyph";
import PlusMark from "@/app/components/PlusMark";
import SectionGrid, { GridLine } from "@/app/components/SectionGrid";
import StoryProgress, {
  STORY,
  StationPlus,
  padIndex,
} from "@/app/homesections/StoryProgress";

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin);

type Parts = {
  fills: HTMLElement[];
  washes: HTMLElement[];
  stations: HTMLElement[];
  slides: HTMLElement[];
  glyphs: HTMLElement[];
  texts: HTMLElement[];
  numeral: HTMLElement | null;
  count: HTMLElement | null;
  tabs: HTMLElement | null;
};

function showChapter(parts: Parts, index: number, animate: boolean) {
  const { glyphs, texts, numeral, count, tabs, stations } = parts;
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

  if (numeral) numeral.textContent = padIndex(index);
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
  tl.fromTo(
    visibleStrokes(root),
    { drawSVG: "0%" },
    {
      drawSVG: "100%",
      duration: 0.9,
      ease: "power2.inOut",
      stagger: 0.02,
      overwrite: "auto",
    },
  );
  tl.fromTo(
    hiddenStrokes(root),
    { autoAlpha: 0 },
    {
      autoAlpha: 0.55,
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    },
    0.7,
  );
  return tl;
}

function applyChapter(parts: Parts, progress: number) {
  const { fills, washes, stations, slides } = parts;
  // One wipe segment per station so the last tab fills gradually too.
  const count = Math.max(1, stations.length);
  const scaled = progress * count;
  const index = Math.min(count - 1, Math.floor(scaled + 1e-4));
  const local = gsap.utils.clamp(0, 1, scaled - index);
  const atEnd = progress >= 1;

  fills.forEach((fill, i) => {
    const scale = chapterScale(i, index, local, atEnd);
    gsap.set(fill, { scaleX: scale, transformOrigin: "left center" });
    const wash = washes[i];
    if (wash) setStoryWash(wash, scale);
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

export default function AboutSection() {
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
        slides: gsap.utils.toArray<HTMLElement>("[data-story-slide]", root),
        fills: gsap.utils.toArray<HTMLElement>("[data-story-fill]", root),
        washes: gsap.utils.toArray<HTMLElement>("[data-story-wash]", root),
        stations: gsap.utils.toArray<HTMLElement>("[data-story-station]", root),
        glyphs: gsap.utils.toArray<HTMLElement>("[data-chapter-glyph]", root),
        texts: gsap.utils.toArray<HTMLElement>("[data-chapter-text]", root),
        numeral: root.querySelector<HTMLElement>("[data-chapter-numeral]"),
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

      const mm = gsap.matchMedia();

      // Without the scrub the tabs are the only way through the story.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const select = (index: number) => {
          parts.fills.forEach((fill, i) => {
            gsap.set(fill, {
              scaleX: i === index ? 1 : 0,
              transformOrigin: "left center",
            });
          });
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
        gsap.set(parts.fills, { scaleX: 0, transformOrigin: "left center" });
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
            setScrollHintHidden(root, self.progress);
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
            end: "+=250%",
            id: "about-story-desktop",
          });
        },
      );

      mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          const chapter = root.querySelector(".about-chapter") ?? root;
          return bindScrub({
            trigger: chapter,
            pin: false,
            start: "top 80%",
            end: "bottom 30%",
            id: "about-story-mobile",
          });
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
      id="about"
      aria-labelledby="about-heading"
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
      <PlusMark tone="page" className="v-g1-0 top-rows-3 hidden md:block" />
      <PlusMark tone="page" className="v-g1-8 top-rows-3 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 top-rows-3 hidden md:block" />

      {/* Row 4 */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 top-rows-4 hidden md:block" />
      <PlusMark tone="page" className="v-g1-0 top-rows-4 hidden md:block" />
      <PlusMark tone="page" className="v-g1-6 top-rows-4 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 top-rows-4 hidden md:block" />

      {/* Row 8 */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-mid top-rows-8 hidden md:block" />
      <PlusMark tone="page" className="v-g1-0 top-rows-8 hidden md:block" />
      <PlusMark tone="page" className="v-g1-6 top-rows-8 hidden md:block" />

      {/* Row 12 */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-mid at-br-2 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-6-9 at-br-2 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-9g-12 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-0 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-6 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-9 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 at-br-2 hidden md:block" />

      {/* Intro */}
      <div className="about-intro min-h-rows-3">
        <div className="about-title">
          <p data-about-header className="eyebrow">
            Built From The Ground Up
          </p>
          <MaskRevealHeading
            id="about-heading"
            className="font-heading text-[clamp(28px,3.4vw,48px)] leading-none font-medium text-left uppercase"
          >
            From Steel Fabrication
            <span className="block">to Advanced Engineering.</span>
          </MaskRevealHeading>
        </div>
        <p
          data-about-header
          className="about-lede font-heading text-[16px] leading-none font-medium text-left uppercase md:text-justify md:[text-align-last:left]"
        >
          What began as a modest steel fabrication business has evolved into a
          Sri Lankan engineering company delivering precision manufacturing, OEM
          components and custom-built industrial machinery.
        </p>
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-12 at-bottom md:hidden" />
      </div>

      {/* Chapter tabs */}
      <div className="relative md:contents">
        <StoryProgress />
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-12 at-bottom md:hidden" />
      </div>

      {/* Active chapter */}
      <div className="about-chapter">
        <div className="about-chapter-glyph dot-field-soft">
          <PlusMark tone="page" className="top-4 left-4 z-10" />
          <PlusMark tone="page" className="top-4 left-[calc(100%-16px)] z-10" />
          <PlusMark tone="page" className="top-[calc(100%-16px)] left-4 z-10" />
          <PlusMark tone="page" className="top-[calc(100%-16px)] left-[calc(100%-16px)] z-10" />
          {STORY.map((item, i) => (
            <span
              key={item.id}
              data-chapter-glyph={i}
              className="about-chapter-panel"
            >
              <CapabilityGlyph kind={item.glyph} className="about-chapter-mark" />
            </span>
          ))}
          <span aria-hidden data-chapter-numeral className="about-chapter-numeral">
            01
          </span>
        </div>
        <div className="about-chapter-copy">
          <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 top-0 md:hidden" />
          {STORY.map((item, i) => (
            <div key={item.id} data-chapter-text={i} className="about-chapter-text">
              <p className="index-tag flex items-center justify-between gap-4">
                <span>{item.label}</span>
                <span aria-hidden>[{padIndex(i)}]</span>
              </p>
              <p className="font-heading text-[16px] leading-none font-medium uppercase md:text-justify md:[text-align-last:left]">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Story reel */}
      <div className="relative md:contents">
        <div className="about-reel">
          {STORY.map((item, index) => (
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
        </div>
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-12 at-bottom md:hidden" />
      </div>

      {/* Readout */}
      <div className="about-readout">
        <div className="index-tag flex items-center justify-between gap-4">
          <span className="flex items-center gap-1">
            <StationPlus />
            <span aria-hidden className="inline-block h-[1.5px] w-2 bg-current" />
            <span>Our Story</span>
          </span>
          <span className="tabular-nums">
            <span data-story-count>01</span>
            {" / "}
            {padIndex(STORY.length - 1)}
          </span>
        </div>
        <p className="font-heading text-[12px] leading-[1.3] font-normal uppercase">
          We continue to invest in people, technology and innovation with one
          goal:{" "}
          <strong className="font-medium">
            to turn engineering challenges into dependable, purpose-built
            solutions
          </strong>
          .
        </p>
      </div>

      <BrandButton tone="steel" href="/#manufacturing" className="about-cta">
        Discover Our Story
      </BrandButton>
      <ScrollHint seat="col-9" />
    </SectionGrid>
  );
}
