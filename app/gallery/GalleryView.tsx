"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import MaskRevealHeading from "@/app/components/MaskRevealHeading";
import PlusMark from "@/app/components/PlusMark";
import ScrollHint from "@/app/components/ScrollHint";
import SectionGrid, { GridLine } from "@/app/components/SectionGrid";
import GalleryStrip, { type GalleryStripHandle } from "@/app/gallery/GalleryStrip";
import {
  GALLERY_CATEGORIES,
  GALLERY_FRAMES,
  categoryById,
  frameById,
  frameSrc,
  pad2,
} from "@/app/gallery/records";

gsap.registerPlugin(useGSAP);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function GalleryView() {
  const heroRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<GalleryStripHandle>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const firstCopy = useRef(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [viewer, setViewer] = useState<{ ids: string[]; index: number } | null>(
    null,
  );
  const [mounted, setMounted] = useState(false);
  const lenis = useLenis();

  const safeIndex =
    GALLERY_FRAMES.length === 0
      ? 0
      : Math.min(activeIndex, GALLERY_FRAMES.length - 1);
  const shown = GALLERY_FRAMES[safeIndex];
  const catalogueIndex = shown
    ? GALLERY_FRAMES.findIndex((frame) => frame.id === shown.id)
    : -1;
  const current = viewer ? frameById(viewer.ids[viewer.index]) : null;
  const interactive = !reduced && GALLERY_FRAMES.length > 1;

  useEffect(() => {
    setMounted(true);
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
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
      const root = slotRef.current;
      if (!root || !shown) return;
      const nodes = gsap.utils.toArray<HTMLElement>("[data-reel-copy]", root);
      if (!nodes.length || prefersReducedMotion()) return;
      if (firstCopy.current) {
        firstCopy.current = false;
        return;
      }
      gsap.fromTo(
        nodes,
        { autoAlpha: 0.72, y: 8 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.34,
          ease: "power2.out",
          overwrite: "auto",
        },
      );
    },
    { scope: slotRef, dependencies: [shown?.id] },
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

  const closeViewer = () => setViewer(null);

  const stepViewer = (delta: number) => {
    setViewer((currentViewer) => {
      if (!currentViewer) return currentViewer;
      const count = currentViewer.ids.length;
      const index = (currentViewer.index + delta + count) % count;
      return { ...currentViewer, index };
    });
  };

  const stepReel = (direction: 1 | -1) => {
    if (GALLERY_FRAMES.length < 2) return;
    if (reduced) {
      setActiveIndex(
        (index) => (index + direction + GALLERY_FRAMES.length) % GALLERY_FRAMES.length,
      );
      return;
    }
    stripRef.current?.step(direction);
  };

  const onSlotKey = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      stepReel(1);
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      stepReel(-1);
    }
  };

  const openShown = (trigger: HTMLElement) => {
    if (!shown) return;
    openFrame(
      shown.id,
      GALLERY_FRAMES.map((frame) => frame.id),
      trigger,
    );
  };

  return (
    <>
      <SectionGrid
        ref={heroRef}
        id="gallery-hero"
        aria-labelledby="gallery-heading"
        rows={14}
        tone="page"
        outerV={false}
        className="gallery-stage flex flex-col bg-cream text-steel"
      >
        <GridLine axis="v" tone="page" className="v-g1-0 md:hidden" />
        <GridLine axis="v" tone="page" className="v-g1-12 md:hidden" />

        <GridLine axis="v" unstyled tone="page" className="v-g1-0 gallery-v-top-7 hidden md:block" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-0 gallery-v-7-end hidden md:block" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-3 gallery-v-top-7 hidden md:block" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-3 gallery-v-7-end hidden md:block" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-9 gallery-v-top-7 hidden md:block" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-9 gallery-v-7-end hidden md:block" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 gallery-v-top-7 hidden md:block" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 gallery-v-7-end hidden md:block" />

        <PlusMark tone="page" className="v-g1-0 gallery-plus-top hidden md:block" />
        <PlusMark tone="page" className="v-g1-3 gallery-plus-top hidden md:block" />
        <PlusMark tone="page" className="v-g1-9 gallery-plus-top hidden md:block" />
        <PlusMark tone="page" className="v-g1-12 gallery-plus-top hidden md:block" />

        <GridLine axis="h" unstyled tone="page" data-gal-rule className="h-seg-0-3 gallery-at-7 hidden md:block" />
        <GridLine axis="h" unstyled tone="page" data-gal-rule className="h-seg-9g-12 gallery-at-7 hidden md:block" />
        <PlusMark tone="page" className="v-g1-0 gallery-at-7 hidden md:block" />
        <PlusMark tone="page" className="v-g1-3 gallery-at-7 hidden md:block" />
        <PlusMark tone="page" className="v-g1-9 gallery-at-7 hidden md:block" />
        <PlusMark tone="page" className="v-g1-12 gallery-at-7 hidden md:block" />

        <PlusMark tone="page" className="v-g1-0 at-bottom hidden md:block" />
        <PlusMark tone="page" className="v-g1-3 at-bottom hidden md:block" />
        <PlusMark tone="page" className="v-g1-9 at-bottom hidden md:block" />
        <PlusMark tone="page" className="v-g1-12 at-bottom hidden md:block" />

        <div className="gallery-stage-copy">
          <div className="gallery-reel-above">
            <p data-gal-item className="eyebrow">
              Gallery
            </p>
            <MaskRevealHeading
              as="h1"
              id="gallery-heading"
              className="font-heading text-[clamp(28px,2.6vw,48px)] leading-[0.92] font-medium tracking-[-0.02em] uppercase"
            >
              Seen where it is made.
            </MaskRevealHeading>
          </div>
          <div className="gallery-reel-below">
            <p
              data-gal-item
              className="font-heading text-[clamp(12px,1vw,16px)] leading-[1.35] font-medium uppercase"
            >
              Components, machinery, people, and the work between them on the
              Kadawatha floor.
            </p>
            <p data-gal-item className="index-tag gallery-stage-readout">
              <span>{pad2(GALLERY_CATEGORIES.length)} Fields</span>
              <span aria-hidden>·</span>
              <span>{pad2(GALLERY_FRAMES.length)} Frames</span>
            </p>
          </div>
        </div>

        <div
          ref={frameRef}
          data-gal-media
          className="gallery-reel-frame"
          {...(interactive ? { "data-lenis-prevent": "" } : {})}
        >
          {shown && reduced ? (
            <button
              type="button"
              className="gallery-reel-still"
              data-cursor="explore"
              onClick={(event) => openShown(event.currentTarget)}
              aria-label={`Open ${shown.title}, ${categoryById(shown.category).full}`}
            >
              <Image
                src={frameSrc(shown.image)}
                alt={shown.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                priority
                className={
                  shown.fit === "contain" ? "object-contain p-[12%]" : "object-cover"
                }
              />
            </button>
          ) : (
            <GalleryStrip
              ref={stripRef}
              frames={GALLERY_FRAMES}
              onActiveIndex={setActiveIndex}
              onOpen={(id) => {
                const trigger = frameRef.current;
                if (!trigger) return;
                openFrame(
                  id,
                  GALLERY_FRAMES.map((frame) => frame.id),
                  trigger,
                );
              }}
            />
          )}
        </div>

        {shown ? (
          <div
            ref={slotRef}
            className="gallery-reel-detail"
            onKeyDown={onSlotKey}
          >
            <div data-reel-copy className="gallery-reel-above">
              <p className="index-tag">
                <span>[{pad2(catalogueIndex + 1)}]</span>
                <span aria-hidden> · </span>
                <span>
                  {pad2(safeIndex + 1)} / {pad2(GALLERY_FRAMES.length)}
                </span>
              </p>
              <p className="index-tag font-normal">
                {categoryById(shown.category).full}
              </p>
              <p className="gallery-reel-title" aria-live="polite">
                {shown.title}
              </p>
            </div>
            <div data-reel-copy className="gallery-reel-below">
              <p className="gallery-reel-note">{shown.note}</p>
              <p className="index-tag font-normal">{shown.place}</p>
              <div className="gallery-reel-steps">
                <button
                  type="button"
                  className="gallery-reel-nav index-tag"
                  onClick={() => stepReel(-1)}
                  disabled={GALLERY_FRAMES.length < 2}
                >
                  Prev
                </button>
                <button
                  type="button"
                  className="gallery-reel-nav index-tag"
                  onClick={() => stepReel(1)}
                  disabled={GALLERY_FRAMES.length < 2}
                >
                  Next
                </button>
              </div>
              <button
                type="button"
                className="gallery-reel-nav index-tag"
                onClick={(event) => openShown(event.currentTarget)}
              >
                Open
              </button>
            </div>
          </div>
        ) : null}
        {interactive ? (
          <>
            <ScrollHint seat="col-9" edge="top" />
            <ScrollHint seat="col-9" />
          </>
        ) : null}
      </SectionGrid>

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
                  <p
                    id="gallery-viewer-title"
                    className="font-heading text-[clamp(18px,1.6vw,28px)] leading-none font-medium uppercase"
                  >
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
