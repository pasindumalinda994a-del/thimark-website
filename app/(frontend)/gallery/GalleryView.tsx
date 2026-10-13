"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import BrandButton from "@/app/(frontend)/components/BrandButton";
import CarouselControls from "@/app/(frontend)/components/CarouselControls";
import DirectionPulse from "@/app/(frontend)/components/DirectionPulse";
import Copy from "@/app/(frontend)/components/Copy";
import H1Heading from "@/app/(frontend)/components/H1Heading";
import PlusMark, { type PlusArms } from "@/app/(frontend)/components/PlusMark";
import { Corners, MobileEdge } from "@/app/(frontend)/components/plate";
import SectionGrid, { GridLine } from "@/app/(frontend)/components/SectionGrid";
import { bindSnapCarousel } from "@/app/(frontend)/components/snapCarousel";
import GalleryStrip, { type GalleryStripHandle } from "@/app/(frontend)/gallery/GalleryStrip";
import {
  GALLERY_CATEGORIES,
  categoryById,
  frameSrc,
  pad2,
  type GalleryCategoryId,
  type GalleryFrame,
} from "@/app/(frontend)/gallery/records";

gsap.registerPlugin(useGSAP);

const armDown: PlusArms = { up: false, down: true, left: false, right: false };
const armUp: PlusArms = { up: true, down: false, left: false, right: false };
const joinLeftEdge: PlusArms = { up: true, down: true, left: false, right: true };
const joinRightEdge: PlusArms = { up: true, down: true, left: true, right: false };
const joinTeeDown: PlusArms = { up: false, down: true, left: true, right: true };
const joinTeeUp: PlusArms = { up: true, down: false, left: true, right: true };

type GalleryFilter = "all" | GalleryCategoryId;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function GalleryView({ frames }: { frames: GalleryFrame[] }) {
  const heroRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const phoneReelRef = useRef<HTMLDivElement>(null);
  const phoneTrackRef = useRef<HTMLDivElement>(null);
  const phoneCopyRef = useRef<HTMLDivElement>(null);
  const phoneScrollRef = useRef(0);
  const phonePointerRef = useRef({ x: 0, dragged: false });
  const frameRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<GalleryStripHandle>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const firstCopy = useRef(true);
  const firstPhoneCopy = useRef(true);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [phoneIndex, setPhoneIndex] = useState(0);
  const [category, setCategory] = useState<GalleryFilter>("all");
  const [wide, setWide] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [viewer, setViewer] = useState<{ ids: string[]; index: number } | null>(
    null,
  );
  const [mounted, setMounted] = useState(false);
  const lenis = useLenis();

  const safeIndex =
    frames.length === 0
      ? 0
      : Math.min(activeIndex, frames.length - 1);
  const shown = frames[safeIndex];
  const catalogueIndex = shown
    ? frames.findIndex((frame) => frame.id === shown.id)
    : -1;
  const current = viewer
    ? (frames.find((frame) => frame.id === viewer.ids[viewer.index]) ?? null)
    : null;
  const interactive = !reduced && frames.length > 1;
  const categories = useMemo(
    () =>
      GALLERY_CATEGORIES.filter((item) =>
        frames.some((frame) => frame.category === item.id),
      ),
    [frames],
  );
  const filters = useMemo<GalleryFilter[]>(
    () => ["all", ...categories.map((item) => item.id)],
    [categories],
  );
  const phoneFrames = useMemo(
    () =>
      category === "all"
        ? frames
        : frames.filter((frame) => frame.category === category),
    [frames, category],
  );
  const phoneKey = phoneFrames.map((frame) => frame.id).join("|");
  const phoneSafe =
    phoneFrames.length === 0
      ? 0
      : Math.min(phoneIndex, phoneFrames.length - 1);
  const phoneShown = phoneFrames[phoneSafe];
  const phoneCatalogueIndex = phoneShown
    ? frames.findIndex((frame) => frame.id === phoneShown.id)
    : -1;

  useLayoutEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const sync = () => setWide(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

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
      const rules = gsap.utils
        .toArray<HTMLElement>(
          "[data-gal-rule], .gallery-phone-band > .h-seg-0-12",
          root,
        )
        .filter((rule) => getComputedStyle(rule).display !== "none");
      const media = gsap.utils.toArray<HTMLElement>("[data-gal-media]", root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(items, { autoAlpha: 0, y: 12 });
        gsap.set(rules, {
          scaleX: 0,
          yPercent: -50,
          transformOrigin: "left center",
        });
        gsap.set(media, { clipPath: "inset(0% 100% 0% 0%)" });

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

  useGSAP(
    () => {
      const root = phoneCopyRef.current;
      if (!root || !phoneShown || wide) return;
      const nodes = gsap.utils.toArray<HTMLElement>("[data-reel-copy]", root);
      if (!nodes.length || prefersReducedMotion()) return;
      if (firstPhoneCopy.current) {
        firstPhoneCopy.current = false;
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
    { scope: phoneCopyRef, dependencies: [phoneShown?.id, wide] },
  );

  useEffect(() => {
    if (wide) return;
    const root = phoneReelRef.current;
    const track = phoneTrackRef.current;
    if (!root || !track) return;
    const slides = [...track.querySelectorAll<HTMLElement>("[data-gallery-slide]")];
    if (!slides.length) return;
    track.scrollLeft = 0;
    const carousel = bindSnapCarousel({
      track,
      slides,
      controls: root.querySelector<HTMLElement>("[data-carousel-controls]"),
      reduced,
      onChange: (index) => setPhoneIndex(index),
    });
    return () => carousel.destroy();
  }, [wide, phoneKey, reduced]);

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
    if (frames.length < 2) return;
    if (reduced) {
      setActiveIndex(
        (index) => (index + direction + frames.length) % frames.length,
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
      frames.map((frame) => frame.id),
      trigger,
    );
  };

  const selectCategory = (id: GalleryFilter) => {
    setCategory(id);
    setPhoneIndex(0);
  };

  const onTabKey = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    if (
      event.key !== "ArrowRight" &&
      event.key !== "ArrowLeft" &&
      event.key !== "Home" &&
      event.key !== "End"
    ) {
      return;
    }
    event.preventDefault();
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % filters.length;
    if (event.key === "ArrowLeft") next = (index - 1 + filters.length) % filters.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = filters.length - 1;
    const id = filters[next];
    selectCategory(id);
    document.getElementById(`gallery-tab-${id}`)?.focus();
  };

  const onTrackPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    phoneScrollRef.current = phoneTrackRef.current?.scrollLeft ?? 0;
    phonePointerRef.current = { x: event.clientX, dragged: false };
  };

  const onTrackPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (Math.abs(event.clientX - phonePointerRef.current.x) > 8) {
      phonePointerRef.current.dragged = true;
    }
  };

  const openPhoneFrame = (id: string, trigger: HTMLElement) => {
    const track = phoneTrackRef.current;
    if (phonePointerRef.current.dragged) return;
    if (track && Math.abs(track.scrollLeft - phoneScrollRef.current) > 6) return;
    openFrame(
      id,
      phoneFrames.map((frame) => frame.id),
      trigger,
    );
  };

  const onViewerPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    swipeRef.current = { x: event.clientX, y: event.clientY };
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // A pointer can already be released. The swipe still resolves on pointerup.
    }
  };

  const onViewerPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = swipeRef.current;
    swipeRef.current = null;
    if (!start || event.pointerType === "mouse") return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 48 || Math.abs(dx) <= Math.abs(dy)) return;
    stepViewer(dx < 0 ? 1 : -1);
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
        <PlusMark tone="page" arms={armDown} className="v-g1-0 gallery-plus-top hidden md:block" />
        <PlusMark tone="page" arms={armDown} className="v-g1-8 gallery-plus-top hidden md:block" />
        <PlusMark tone="page" arms={armDown} className="v-g1-12 gallery-plus-top hidden md:block" />

        <GridLine axis="v" unstyled tone="page" className="v-g1-0 gallery-v-head hidden md:block" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-8 gallery-v-head hidden md:block" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 gallery-v-head hidden md:block" />

        <GridLine axis="h" unstyled tone="page" data-gal-rule className="h-seg-0-8 top-rows-3 hidden md:block" />
        <GridLine axis="h" unstyled tone="page" data-gal-rule className="h-seg-8-12 top-rows-3 hidden md:block" />
        <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 top-rows-3 hidden md:block" />
        <PlusMark tone="page" arms={joinTeeUp} className="v-g1-8 top-rows-3 hidden md:block" />
        <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 top-rows-3 hidden md:block" />

        <GridLine axis="v" unstyled tone="page" className="v-g1-0 gallery-v-runway hidden md:block" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 gallery-v-runway hidden md:block" />

        <GridLine axis="h" unstyled tone="page" data-gal-rule className="h-seg-0-2 at-br-3 hidden md:block" />
        <GridLine axis="h" unstyled tone="page" data-gal-rule className="h-seg-2-10 at-br-3 hidden md:block" />
        <GridLine axis="h" unstyled tone="page" data-gal-rule className="h-seg-10-12 at-br-3 hidden md:block" />
        <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 at-br-3 hidden md:block" />
        <PlusMark tone="page" arms={joinTeeDown} className="v-g1-2 at-br-3 hidden md:block" />
        <PlusMark tone="page" arms={joinTeeDown} className="v-g1-10 at-br-3 hidden md:block" />
        <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-br-3 hidden md:block" />

        <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-br3-end hidden md:block" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-2 v-seg-br3-end hidden md:block" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-10 v-seg-br3-end hidden md:block" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-br3-end hidden md:block" />

        <PlusMark tone="page" arms={armUp} className="v-g1-0 at-bottom hidden md:block" />
        <PlusMark tone="page" arms={armUp} className="v-g1-2 at-bottom hidden md:block" />
        <PlusMark tone="page" arms={armUp} className="v-g1-10 at-bottom hidden md:block" />
        <PlusMark tone="page" arms={armUp} className="v-g1-12 at-bottom hidden md:block" />

        <div className="gallery-stage-copy gallery-phone-band">
          <MobileEdge />
          <div className="gallery-head-title">
            <p data-gal-item className="eyebrow">
              Gallery
            </p>
            <H1Heading id="gallery-heading">
              Seen where it is made.
            </H1Heading>
          </div>
          <div className="gallery-head-aside">
            <Copy data-gal-item variant="lede">
              The Kadawatha workshop, Kilgharrah 600 in the field, and the
              evening the company was received.
            </Copy>
          </div>
        </div>

        <div className="gallery-phone-band gallery-phone-cats relative md:hidden">
          <MobileEdge />
          <div
            role="tablist"
            aria-label="Gallery categories"
            className="catalogue-tabs gallery-phone-tabs"
          >
            {filters.map((id, index) => {
              const selected = id === category;
              const label = id === "all" ? "All" : categoryById(id).label;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  id={`gallery-tab-${id}`}
                  aria-selected={selected}
                  aria-controls="gallery-phone-reel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectCategory(id)}
                  onKeyDown={(event) => onTabKey(event, index)}
                  className="catalogue-tab index-tag outline-none hover:text-brand focus-visible:text-brand"
                >
                  {index > 0 ? (
                    <span aria-hidden className="catalogue-tab-divider" />
                  ) : null}
                  <span>{label}</span>
                  <span aria-hidden data-tab-draw className="catalogue-tab-draw" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="gallery-reel-slot hidden md:block">
          <div
            ref={frameRef}
            data-gal-media
            className="gallery-reel-frame"
            {...(interactive ? { "data-lenis-prevent": "" } : {})}
          >
            {wide && shown && reduced ? (
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
                  sizes="80vw"
                  priority
                  className={
                    shown.fit === "contain" ? "object-contain p-[12%]" : "object-cover"
                  }
                />
              </button>
            ) : wide ? (
              <GalleryStrip
                ref={stripRef}
                frames={frames}
                onActiveIndex={setActiveIndex}
                onOpen={(id) => {
                  const trigger = frameRef.current;
                  if (!trigger) return;
                  openFrame(
                    id,
                    frames.map((frame) => frame.id),
                    trigger,
                  );
                }}
              />
            ) : null}
          </div>
          {interactive ? (
            <div className="gallery-drag-cue" aria-hidden>
              <span className="index-tag">Drag</span>
              <DirectionPulse direction="right" stack="trio" />
            </div>
          ) : null}
        </div>

        <div
          ref={phoneReelRef}
          id="gallery-phone-reel"
          role="tabpanel"
          aria-labelledby={`gallery-tab-${category}`}
          className="gallery-phone-band gallery-phone-reel relative md:hidden"
        >
          <MobileEdge />
          <div
            ref={phoneTrackRef}
            data-gallery-track
            role="region"
            aria-roledescription="carousel"
            aria-label="Gallery photographs"
            className="gallery-phone-track"
            onPointerDown={onTrackPointerDown}
            onPointerMove={onTrackPointerMove}
          >
            {phoneFrames.map((frame, index) => (
              <button
                key={frame.id}
                type="button"
                data-gallery-slide=""
                {...(index === 0 ? { "data-gal-media": "" } : {})}
                className="gallery-phone-slide relative"
                onClick={(event) => openPhoneFrame(frame.id, event.currentTarget)}
                aria-label={`Open ${frame.title}, ${categoryById(frame.category).full}`}
              >
                <Image
                  src={frameSrc(frame.image)}
                  alt={frame.alt}
                  fill
                  sizes="86vw"
                  priority={index === 0}
                  className={
                    frame.fit === "contain"
                      ? "object-contain p-[12%]"
                      : "object-cover"
                  }
                />
                <Corners tone={frame.fit === "contain" ? "page" : "light"} />
              </button>
            ))}
          </div>
          {phoneFrames.length > 0 ? (
            <CarouselControls label="Frames" count={phoneFrames.length} />
          ) : null}
          {phoneShown ? (
            <div ref={phoneCopyRef} className="gallery-phone-caption">
              <div data-reel-copy className="gallery-phone-kicker">
                <p className="index-tag">
                  <span>[{pad2(phoneCatalogueIndex + 1)}]</span>
                  <span aria-hidden> · </span>
                  <span>
                    {pad2(phoneSafe + 1)} / {pad2(phoneFrames.length)}
                  </span>
                </p>
                <p className="index-tag font-normal">
                  <span>{categoryById(phoneShown.category).full}</span>
                  {phoneShown.place ? (
                    <>
                      <span aria-hidden> · </span>
                      <span>{phoneShown.place}</span>
                    </>
                  ) : null}
                </p>
              </div>
              <div data-reel-copy className="gallery-phone-note">
                <Copy variant="statement" className="gallery-phone-title" aria-live="polite">
                  {phoneShown.title}
                </Copy>
                {phoneShown.note ? <Copy variant="meta">{phoneShown.note}</Copy> : null}
              </div>
            </div>
          ) : null}
        </div>

        {shown ? (
          <div
            ref={slotRef}
            className="gallery-reel-detail hidden md:block"
            onKeyDown={onSlotKey}
          >
            <BrandButton
              type="button"
              tone="steel"
              className="gallery-reel-corner gallery-reel-corner-prev"
              onClick={() => stepReel(-1)}
              disabled={frames.length < 2}
              aria-label="Previous frame"
            >
              Prev
            </BrandButton>
            <div className="gallery-reel-center">
              <div data-reel-copy className="gallery-title-index">
                <div className="gallery-title-kicker">
                  <p className="index-tag">
                    <span>[{pad2(catalogueIndex + 1)}]</span>
                    <span aria-hidden> · </span>
                    <span>
                      {pad2(safeIndex + 1)} / {pad2(frames.length)}
                    </span>
                  </p>
                  <p className="index-tag font-normal">
                    {categoryById(shown.category).full}
                  </p>
                </div>
                <Copy variant="statement" className="gallery-reel-title" aria-live="polite">
                  {shown.title}
                </Copy>
              </div>
              <div data-reel-copy className="gallery-title-note">
                <Copy variant="meta" className="gallery-reel-note">
                  {shown.note}
                </Copy>
                <p className="index-tag font-normal">{shown.place}</p>
              </div>
            </div>
            <BrandButton
              type="button"
              tone="steel"
              className="gallery-reel-corner gallery-reel-corner-next"
              onClick={() => stepReel(1)}
              disabled={frames.length < 2}
              aria-label="Next frame"
            >
              Next
            </BrandButton>
          </div>
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
              <div
                className="gallery-viewer-frame"
                onPointerDown={onViewerPointerDown}
                onPointerUp={onViewerPointerUp}
                onPointerCancel={() => {
                  swipeRef.current = null;
                }}
              >
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
                      [{pad2(frames.findIndex((frame) => frame.id === current.id) + 1)}]
                    </span>
                    <span>
                      {pad2(viewer.index + 1)} / {pad2(viewer.ids.length)}
                    </span>
                  </p>
                  <Copy id="gallery-viewer-title" variant="lead">
                    {current.title}
                  </Copy>
                  <p className="index-tag font-normal">
                    {categoryById(current.category).full}
                    <span aria-hidden> · </span>
                    {current.place}
                  </p>
                  <Copy variant="meta" className="gallery-viewer-note text-cream/75">
                    {current.note}
                  </Copy>
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
