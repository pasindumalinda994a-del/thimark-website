"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import BrandButton from "@/app/components/BrandButton";
import MaskRevealHeading from "@/app/components/MaskRevealHeading";
import PlusMark from "@/app/components/PlusMark";
import SectionBreak from "@/app/components/SectionBreak";
import SectionGrid, { GridLine } from "@/app/components/SectionGrid";
import {
  FEATURED_ID,
  GALLERY_CATEGORIES,
  GALLERY_FRAMES,
  HERO_TALL_ID,
  HERO_WIDE_ID,
  categoryById,
  frameById,
  frameSrc,
  framesIn,
  pad2,
  type GalleryCategoryId,
  type GalleryFrame,
} from "@/app/gallery/records";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type TabId = "all" | GalleryCategoryId;

const TABS: { id: TabId; label: string; full: string }[] = [
  { id: "all", label: "All", full: "All frames" },
  ...GALLERY_CATEGORIES,
];

type CellRole = "feature" | "stack" | "band" | "pair";
type CellSide = "left" | "right";

type PlacedFrame = {
  frame: GalleryFrame;
  role: CellRole;
  side: CellSide;
  col: number;
  colSpan: number;
  row: number;
  rowSpan: number;
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function placeFrames(frames: GalleryFrame[]): PlacedFrame[] {
  const cells: PlacedFrame[] = [];
  let index = 0;
  let row = 1;

  const push = (
    frame: GalleryFrame,
    role: CellRole,
    side: CellSide,
    col: number,
    colSpan: number,
    rowStart: number,
    rowSpan: number,
  ) => {
    cells.push({ frame, role, side, col, colSpan, row: rowStart, rowSpan });
  };

  const spread = (side: CellSide) => {
    const feature = frames[index];
    const stackA = frames[index + 1];
    const stackB = frames[index + 2];
    if (!feature || !stackA || !stackB) return false;
    index += 3;
    if (side === "left") {
      push(feature, "feature", "left", 1, 7, row, 8);
      push(stackA, "stack", "right", 8, 5, row, 4);
      push(stackB, "stack", "right", 8, 5, row + 4, 4);
    } else {
      push(feature, "feature", "right", 6, 7, row, 8);
      push(stackA, "stack", "left", 1, 5, row, 4);
      push(stackB, "stack", "left", 1, 5, row + 4, 4);
    }
    row += 8;
    return true;
  };

  while (index < frames.length) {
    const left = frames.length - index;
    if (left >= 7) {
      spread("left");
      spread("right");
      const band = frames[index];
      if (!band) break;
      index += 1;
      push(band, "band", "left", 1, 12, row, 6);
      row += 6;
      continue;
    }
    if (left === 6) {
      spread("left");
      spread("right");
      continue;
    }
    if (left === 5 || left === 4 || left === 3) {
      spread("left");
      if (left === 5) {
        const feature = frames[index];
        const stack = frames[index + 1];
        if (feature && stack) {
          index += 2;
          push(feature, "pair", "right", 6, 7, row, 8);
          push(stack, "pair", "left", 1, 5, row, 8);
          row += 8;
        }
      } else if (left === 4) {
        const band = frames[index];
        if (band) {
          index += 1;
          push(band, "band", "left", 1, 12, row, 6);
          row += 6;
        }
      }
      continue;
    }
    if (left === 2) {
      const feature = frames[index];
      const stack = frames[index + 1];
      if (!feature || !stack) break;
      index += 2;
      push(feature, "pair", "left", 1, 7, row, 8);
      push(stack, "pair", "right", 8, 5, row, 8);
      row += 8;
      continue;
    }
    const band = frames[index];
    if (!band) break;
    index += 1;
    push(band, "band", "left", 1, 12, row, 6);
    row += 6;
  }

  return cells;
}

function CornerPluses({ tone = "page" }: { tone?: "page" | "light" }) {
  return (
    <>
      <PlusMark tone={tone} className="top-0 left-0" />
      <PlusMark tone={tone} className="top-0 left-full" />
      <PlusMark tone={tone} className="top-full left-0" />
      <PlusMark tone={tone} className="top-full left-full" />
    </>
  );
}

function GalleryPhoto({
  frame,
  sizes,
  priority = false,
  className = "",
}: {
  frame: GalleryFrame;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      src={frameSrc(frame.image)}
      alt={frame.alt}
      fill
      sizes={sizes}
      priority={priority}
      onLoad={() => setLoaded(true)}
      className={`gallery-photo ${frame.fit === "contain" ? "is-contain" : "is-cover"} ${loaded ? "is-loaded" : ""} ${className}`}
    />
  );
}

function FrameButton({
  frame,
  indexLabel,
  onOpen,
  className = "",
  children,
}: {
  frame: GalleryFrame;
  indexLabel: string;
  onOpen: (id: string, trigger: HTMLButtonElement) => void;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`gallery-frame-btn ${className}`}
      data-cursor="explore"
      onClick={(event) => onOpen(frame.id, event.currentTarget)}
      aria-label={`Open ${frame.title}, ${categoryById(frame.category).full}`}
    >
      {children}
      <span className="index-tag gallery-chip">
        <span aria-hidden>[{indexLabel}]</span>
        <span>{categoryById(frame.category).label}</span>
      </span>
    </button>
  );
}

export default function GalleryView() {
  const heroRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const indexRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const viewerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);
  const [viewer, setViewer] = useState<{ ids: string[]; index: number } | null>(
    null,
  );
  const [mounted, setMounted] = useState(false);
  const pendingRef = useRef<number | null>(null);
  const firstPaint = useRef(true);
  const busy = useRef(false);
  const lenis = useLenis();

  const tab = TABS[active];
  const visible = framesIn(tab.id);
  const placed = placeFrames(visible);
  const tall = frameById(HERO_TALL_ID);
  const wide = frameById(HERO_WIDE_ID);
  const featured = frameById(FEATURED_ID);
  const tallIndex = GALLERY_FRAMES.findIndex((frame) => frame.id === tall.id);
  const wideIndex = GALLERY_FRAMES.findIndex((frame) => frame.id === wide.id);
  const featuredIndex = GALLERY_FRAMES.findIndex(
    (frame) => frame.id === featured.id,
  );
  const current = viewer ? frameById(viewer.ids[viewer.index]) : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(
    () => {
      const root = heroRef.current;
      if (!root) return;
      const items = gsap.utils.toArray<HTMLElement>("[data-gal-item]", root);
      const rules = gsap.utils.toArray<HTMLElement>("[data-gal-rule]", root);
      const media = gsap.utils.toArray<HTMLElement>("[data-gal-media]", root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(items, { autoAlpha: 0, y: 12 });
        gsap.set(rules, {
          scaleX: 0,
          yPercent: -50,
          transformOrigin: "left center",
        });
        gsap.set(media, { clipPath: "inset(0% 0% 100% 0%)" });

        const tl = gsap.timeline();
        tl.to(rules, {
          scaleX: 1,
          duration: 0.8,
          ease: "power3.inOut",
          stagger: 0.06,
        });
        tl.to(
          items,
          { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.1 },
          0.15,
        );
        tl.to(
          media,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.08,
          },
          0.2,
        );
      });

      return () => mm.revert();
    },
    { scope: heroRef },
  );

  useGSAP(
    () => {
      const root = storyRef.current;
      if (!root) return;
      const media = root.querySelector<HTMLElement>("[data-story-media]");
      const copy = gsap.utils.toArray<HTMLElement>("[data-story-copy]", root);
      const rule = root.querySelector<HTMLElement>("[data-story-rule]");
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (media) gsap.set(media, { clipPath: "inset(0% 0% 100% 0%)" });
        gsap.set(copy, { autoAlpha: 0, y: 12 });
        if (rule) {
          gsap.set(rule, {
            scaleX: 0,
            yPercent: -50,
            transformOrigin: "left center",
          });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        });
        if (media) {
          tl.to(media, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.7,
            ease: "power2.out",
          });
        }
        if (rule) {
          tl.to(
            rule,
            { scaleX: 1, duration: 0.6, ease: "power3.inOut" },
            0.15,
          );
        }
        tl.to(
          copy,
          { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out", stagger: 0.08 },
          0.2,
        );
      });

      return () => mm.revert();
    },
    { scope: storyRef },
  );

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-gal-card]", grid);
      const media = gsap.utils.toArray<HTMLElement>("[data-gal-card-media]", grid);
      const draws = gsap.utils.toArray<HTMLElement>(
        "[data-tab-draw]",
        indexRef.current ?? grid,
      );

      if (prefersReducedMotion()) {
        gsap.set(cards, { clearProps: "all" });
        draws.forEach((draw, i) =>
          gsap.set(draw, { scaleX: i === active ? 1 : 0 }),
        );
        firstPaint.current = false;
        busy.current = false;
        return;
      }

      draws.forEach((draw, i) =>
        gsap.to(draw, {
          scaleX: i === active ? 1 : 0,
          duration: 0.32,
          ease: "power2.out",
          overwrite: "auto",
        }),
      );

      const tl = gsap.timeline({
        onComplete: () => {
          busy.current = false;
        },
      });
      tl.fromTo(
        cards,
        { autoAlpha: 0, y: 10 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
          stagger: 0.05,
        },
      );
      tl.fromTo(
        media,
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.05,
        },
        0.05,
      );

      if (firstPaint.current) {
        firstPaint.current = false;
        tl.pause();
        ScrollTrigger.create({
          trigger: grid,
          start: "top 78%",
          once: true,
          onEnter: () => tl.play(),
        });
      }
    },
    { scope: indexRef, dependencies: [active] },
  );

  useEffect(() => {
    if (!viewer) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    const dialog = viewerRef.current;
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 30);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeViewer();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        stepViewer(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        stepViewer(-1);
      }
      if (event.key !== "Tab" || !dialog) return;
      const nodes = dialog.querySelectorAll<HTMLElement>("button");
      if (!nodes.length) return;
      const list = [...nodes];
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      lenis?.start();
      triggerRef.current?.focus();
    };
    // Viewer navigation updates index without restarting the lock.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewer?.ids.join("|"), Boolean(viewer), lenis]);

  useGSAP(
    () => {
      const panel = viewerRef.current;
      if (!viewer || !panel) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const opener = triggerRef.current?.getBoundingClientRect();
        const from = opener
          ? `inset(${opener.top}px ${window.innerWidth - opener.right}px ${window.innerHeight - opener.bottom}px ${opener.left}px)`
          : "inset(12% 12% 12% 12%)";
        gsap.fromTo(
          panel,
          { clipPath: from },
          {
            clipPath: "inset(0px 0px 0px 0px)",
            duration: 0.45,
            ease: "power2.out",
          },
        );
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.fromTo(panel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 });
      });
      return () => mm.revert();
    },
    { dependencies: [Boolean(viewer)], scope: viewerRef },
  );

  const openFrame = (id: string, ids: string[], trigger: HTMLElement) => {
    const index = ids.indexOf(id);
    if (index < 0) return;
    triggerRef.current = trigger;
    setViewer({ ids, index });
  };

  const openFromCatalogue = (id: string, trigger: HTMLButtonElement) => {
    openFrame(
      id,
      visible.map((frame) => frame.id),
      trigger,
    );
  };

  const openFromLead = (id: string, trigger: HTMLButtonElement) => {
    openFrame(
      id,
      GALLERY_FRAMES.map((frame) => frame.id),
      trigger,
    );
  };

  const closeViewer = () => setViewer(null);

  const stepViewer = (delta: number) => {
    setViewer((currentViewer) => {
      if (!currentViewer) return currentViewer;
      const count = currentViewer.ids.length;
      const index = (currentViewer.index + delta + count) % count;
      return { ...currentViewer, index };
    });
  };

  const select = (next: number) => {
    if (next === active) return;
    const grid = gridRef.current;
    if (!grid || prefersReducedMotion()) {
      setActive(next);
      return;
    }
    pendingRef.current = next;
    if (busy.current) return;
    busy.current = true;
    const cards = gsap.utils.toArray<HTMLElement>("[data-gal-card]", grid);
    gsap.to(cards, {
      autoAlpha: 0,
      y: -8,
      duration: 0.22,
      ease: "power2.in",
      stagger: 0.03,
      overwrite: "auto",
      onComplete: () => {
        const target = pendingRef.current;
        pendingRef.current = null;
        if (target !== null) setActive(target);
        else busy.current = false;
      },
    });
  };

  const onTabKey = (event: ReactKeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = TABS.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight") next = i === last ? 0 : i + 1;
    if (event.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    tabRefs.current[next]?.focus();
    select(next);
  };

  return (
    <>
      <SectionGrid
        ref={heroRef}
        id="gallery-hero"
        aria-labelledby="gallery-heading"
        rows={16}
        tone="page"
        outerV={false}
        className="gallery-hero flex flex-col bg-cream text-steel"
      >
        <GridLine axis="v" tone="page" className="v-g1-0 md:hidden" />
        <GridLine axis="v" tone="page" className="v-g1-12 md:hidden" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-top-4 hidden md:block" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-4-10 hidden md:block" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-0 gallery-v-10-end hidden md:block" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-top-4 hidden md:block" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-4-10 hidden md:block" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 gallery-v-10-end hidden md:block" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-8 v-seg-top-4 hidden md:block" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-6 v-seg-4-10 hidden md:block" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-6 gallery-v-10-end hidden md:block" />

        <GridLine axis="h" unstyled tone="page" data-gal-rule className="h-seg-0-8 top-rows-4 hidden md:block" />
        <GridLine axis="h" unstyled tone="page" data-gal-rule className="h-seg-8-12 top-rows-4 hidden md:block" />
        <PlusMark tone="page" className="v-g1-0 top-rows-4 hidden md:block" />
        <PlusMark tone="page" className="v-g1-6 top-rows-4 hidden md:block" />
        <PlusMark tone="page" className="v-g1-8 top-rows-4 hidden md:block" />
        <PlusMark tone="page" className="v-g1-12 top-rows-4 hidden md:block" />

        <GridLine axis="h" unstyled tone="page" data-gal-rule className="gallery-h-6-12 top-rows-10 hidden md:block" />
        <PlusMark tone="page" className="v-g1-6 top-rows-10 hidden md:block" />
        <PlusMark tone="page" className="v-g1-12 top-rows-10 hidden md:block" />

        <div className="gallery-hero-title">
          <p data-gal-item className="eyebrow">
            Gallery
          </p>
          <MaskRevealHeading
            as="h1"
            id="gallery-heading"
            className="font-heading text-[clamp(36px,4.2vw,64px)] leading-[0.92] font-medium tracking-[-0.02em] uppercase"
          >
            Seen where it is made.
          </MaskRevealHeading>
        </div>
        <div className="gallery-hero-lede">
          <p
            data-gal-item
            className="font-heading text-[clamp(12px,1vw,16px)] leading-none font-medium uppercase"
          >
            Components, machinery, people, and the work between them on the
            Kadawatha floor.
          </p>
          <p data-gal-item className="index-tag gallery-hero-readout">
            <span>{pad2(GALLERY_CATEGORIES.length)} Fields</span>
            <span aria-hidden>·</span>
            <span>{pad2(GALLERY_FRAMES.length)} Frames</span>
          </p>
        </div>

        <div data-gal-media className="gallery-hero-tall">
          <FrameButton
            frame={tall}
            indexLabel={pad2(tallIndex + 1)}
            onOpen={openFromLead}
          >
            <GalleryPhoto
              frame={tall}
              priority
              sizes="(min-width: 768px) 42vw, 100vw"
            />
            <CornerPluses />
          </FrameButton>
        </div>

        <div data-gal-media className="gallery-hero-wide">
          <FrameButton
            frame={wide}
            indexLabel={pad2(wideIndex + 1)}
            onOpen={openFromLead}
          >
            <GalleryPhoto
              frame={wide}
              priority
              sizes="(min-width: 768px) 42vw, 100vw"
            />
            <CornerPluses />
          </FrameButton>
        </div>

        <div className="gallery-hero-caption">
          <p data-gal-item className="index-tag">
            <span>[{pad2(wideIndex + 1)}]</span>
            <span>{categoryById(wide.category).full}</span>
          </p>
          <p
            data-gal-item
            className="font-heading text-[clamp(20px,1.8vw,32px)] leading-none font-medium uppercase"
          >
            {wide.title}
          </p>
          <p data-gal-item className="text-[14px] leading-[1.45] text-steel/80">
            {wide.note}
          </p>
          <p data-gal-item className="index-tag">
            {wide.place}
          </p>
        </div>
      </SectionGrid>

      <div className="bg-steel text-cream [--page-bg:var(--steel)] [--page-ink:var(--cream)]">
        <SectionBreak tone="page" split="6" />
        <SectionGrid
          ref={storyRef}
          id="gallery-story"
          aria-labelledby="gallery-story-heading"
          rows={16}
          tone="light"
          outerV={false}
          className="gallery-story"
        >
          <GridLine axis="v" tone="light" className="v-g1-0 md:hidden" />
          <GridLine axis="v" tone="light" className="v-g1-12 md:hidden" />
          <GridLine axis="v" unstyled tone="light" className="v-g1-0 gallery-v-top-br4 hidden md:block" />
          <GridLine axis="v" unstyled tone="light" className="v-g1-0 gallery-v-br4-end hidden md:block" />
          <GridLine axis="v" unstyled tone="light" className="v-g1-12 gallery-v-top-br4 hidden md:block" />
          <GridLine axis="v" unstyled tone="light" className="v-g1-12 gallery-v-br4-end hidden md:block" />
          <GridLine axis="v" unstyled tone="light" className="gallery-v-5 gallery-v-br4-end hidden md:block" />

          <GridLine
            axis="h"
            unstyled
            tone="light"
            data-story-rule
            className="gallery-h-0-5 at-br-4 hidden md:block"
          />
          <PlusMark tone="light" className="v-g1-0 at-br-4 hidden md:block" />
          <PlusMark tone="light" className="gallery-v-5 at-br-4 hidden md:block" />
          <PlusMark tone="light" className="v-g1-12 at-br-4 hidden md:block" />

          <div data-story-media className="gallery-story-media">
            <FrameButton
              frame={featured}
              indexLabel={pad2(featuredIndex + 1)}
              onOpen={openFromLead}
              className="gallery-story-hit"
            >
              <GalleryPhoto
                frame={featured}
                sizes="(min-width: 768px) 80vw, 100vw"
              />
            </FrameButton>
          </div>

          <div className="gallery-story-caption">
            <p data-story-copy className="index-tag text-steel">
              <span>[{pad2(featuredIndex + 1)}]</span>
              <span>{categoryById(featured.category).full}</span>
            </p>
            <h2
              id="gallery-story-heading"
              data-story-copy
              className="font-heading text-[clamp(24px,2.2vw,40px)] leading-none font-medium uppercase text-steel"
            >
              {featured.title}
            </h2>
            <p data-story-copy className="text-[14px] leading-[1.45] text-steel/80">
              {featured.note}
            </p>
            <p data-story-copy className="index-tag text-steel">
              {featured.place}
            </p>
          </div>
        </SectionGrid>
      </div>

      <SectionBreak tone="page" split="8" />

      <section
        ref={indexRef}
        id="gallery-index"
        aria-labelledby="gallery-index-heading"
        className="gallery-index content-plate relative"
      >
        <h2 id="gallery-index-heading" className="sr-only">
          Gallery index
        </h2>
        <GridLine axis="v" tone="page" className="v-g1-0" />
        <GridLine axis="v" tone="page" className="v-g1-12" />

        <div className="gallery-index-head">
          <div role="tablist" aria-label="Gallery fields" className="catalogue-tabs">
            {TABS.map((tabItem, i) => {
              const selected = i === active;
              const count =
                tabItem.id === "all"
                  ? GALLERY_FRAMES.length
                  : GALLERY_FRAMES.filter((frame) => frame.category === tabItem.id)
                      .length;
              return (
                <button
                  key={tabItem.id}
                  ref={(node) => {
                    tabRefs.current[i] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`gallery-tab-${tabItem.id}`}
                  aria-selected={selected}
                  aria-controls="gallery-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={(event) => onTabKey(event, i)}
                  className="catalogue-tab index-tag outline-none hover:text-brand focus-visible:text-brand"
                >
                  {i > 0 ? (
                    <span aria-hidden className="catalogue-tab-divider" />
                  ) : null}
                  <span>{tabItem.label}</span>
                  <span aria-hidden>[{pad2(count)}]</span>
                  <span aria-hidden data-tab-draw className="catalogue-tab-draw" />
                </button>
              );
            })}
          </div>
        </div>

        <ul
          ref={gridRef}
          id="gallery-panel"
          role="tabpanel"
          aria-labelledby={`gallery-tab-${tab.id}`}
          className="gallery-index-grid"
        >
          {placed.length === 0 ? (
            <li className="gallery-empty index-tag">No frames in this field.</li>
          ) : (
            placed.map((cell) => {
              const index = GALLERY_FRAMES.findIndex(
                (frame) => frame.id === cell.frame.id,
              );
              return (
                <li
                  key={cell.frame.id}
                  data-gal-card
                  data-role={cell.role}
                  className="gallery-cell"
                  style={{
                    ["--g-col" as string]: cell.col,
                    ["--g-span" as string]: cell.colSpan,
                    ["--g-row" as string]: cell.row,
                    ["--g-row-span" as string]: cell.rowSpan,
                  }}
                >
                  <div
                    data-gal-card-media
                    className={`gallery-cell-media ${cell.frame.fit === "contain" ? "is-plate" : ""}`}
                  >
                    <FrameButton
                      frame={cell.frame}
                      indexLabel={pad2(index + 1)}
                      onOpen={openFromCatalogue}
                    >
                      <GalleryPhoto
                        frame={cell.frame}
                        sizes="(min-width: 768px) 40vw, 100vw"
                      />
                      <CornerPluses />
                    </FrameButton>
                    <div className="gallery-cell-caption">
                      <p className="font-heading text-[clamp(16px,1.2vw,22px)] leading-none font-medium uppercase">
                        {cell.frame.title}
                      </p>
                      <p className="index-tag font-normal">
                        {categoryById(cell.frame.category).full}
                      </p>
                      <p className="text-[13px] leading-[1.4] text-steel/75">
                        {cell.frame.note}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ul>

        <div className="gallery-index-foot index-tag">
          <p>
            {pad2(GALLERY_FRAMES.length)} Frames
            <span aria-hidden> · </span>
            {pad2(GALLERY_CATEGORIES.length)} Fields
          </p>
          <p className="font-normal">
            Showing {tab.full} — {pad2(visible.length)} frames
          </p>
        </div>
      </section>

      <SectionBreak tone="page" split="thirds" />

      <section
        id="gallery-close"
        aria-labelledby="gallery-close-heading"
        className="gallery-close content-plate relative h-rows-8"
      >
        <GridLine axis="v" tone="page" className="v-g1-0" />
        <GridLine axis="v" tone="page" className="v-g1-12" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-8 hidden md:block" />
        <div className="gallery-close-copy">
          <p className="eyebrow">Next</p>
          <MaskRevealHeading
            id="gallery-close-heading"
            className="font-heading text-[clamp(28px,3.2vw,48px)] leading-none font-medium uppercase"
          >
            The frame is the floor.
          </MaskRevealHeading>
        </div>
        <div className="gallery-close-actions">
          <BrandButton href="/automotive" className="w-full md:w-auto">
            Automotive
          </BrandButton>
          <BrandButton href="/contact" tone="outline" className="w-full md:w-auto">
            Contact
          </BrandButton>
        </div>
      </section>

      {mounted && viewer && current
        ? createPortal(
            <div
              ref={viewerRef}
              className="gallery-viewer"
              role="dialog"
              aria-modal="true"
              aria-labelledby="gallery-viewer-title"
            >
              <button
                type="button"
                className="gallery-viewer-backdrop"
                aria-label="Close image"
                onClick={closeViewer}
              />
              <div className="gallery-viewer-frame">
                <Image
                  key={current.id}
                  src={frameSrc(current.image)}
                  alt={current.alt}
                  fill
                  sizes="100vw"
                  className={`gallery-viewer-photo ${current.fit === "contain" ? "is-contain" : "is-cover"}`}
                  priority
                />
              </div>
              <div className="gallery-viewer-bar">
                <button
                  ref={closeRef}
                  type="button"
                  data-viewer-close
                  className="gallery-viewer-nav index-tag"
                  onClick={closeViewer}
                >
                  Close
                </button>
                <div className="gallery-viewer-copy">
                  <p className="index-tag">
                    <span>
                      [{pad2(GALLERY_FRAMES.findIndex((frame) => frame.id === current.id) + 1)}]
                    </span>
                    <span>
                      {pad2(viewer.index + 1)} / {pad2(viewer.ids.length)}
                    </span>
                  </p>
                  <p id="gallery-viewer-title" className="font-heading text-[clamp(18px,1.6vw,28px)] leading-none font-medium uppercase">
                    {current.title}
                  </p>
                  <p className="index-tag font-normal">
                    {categoryById(current.category).full}
                    <span aria-hidden> · </span>
                    {current.place}
                  </p>
                  <p className="text-[14px] leading-[1.4] text-cream/75">
                    {current.note}
                  </p>
                </div>
                <div className="gallery-viewer-steps">
                  <button
                    type="button"
                    className="gallery-viewer-nav index-tag"
                    onClick={() => stepViewer(-1)}
                    aria-label="Previous frame"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    className="gallery-viewer-nav index-tag"
                    onClick={() => stepViewer(1)}
                    aria-label="Next frame"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
