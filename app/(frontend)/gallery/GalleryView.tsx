"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import BrandButton from "@/app/(frontend)/components/BrandButton";
import Copy from "@/app/(frontend)/components/Copy";
import DirectionPulse from "@/app/(frontend)/components/DirectionPulse";
import H1Heading from "@/app/(frontend)/components/H1Heading";
import SectionGrid from "@/app/(frontend)/components/SectionGrid";
import {
  Cell,
  Eyebrow,
  Frame,
  MobileEdge,
  type HLine,
  type Join,
  type VLine,
} from "@/app/(frontend)/components/plate";
import GalleryStrip, {
  type GalleryStripHandle,
} from "@/app/(frontend)/gallery/GalleryStrip";
import {
  categoryById,
  frameSrc,
  pad2,
  type GalleryFrame,
} from "@/app/(frontend)/gallery/records";

gsap.registerPlugin(useGSAP);

const REEL_H: HLine[] = [
  [0, 0, 12],
  [3, 0, 12],
  [11, 0, 12],
];
const REEL_V: VLine[] = [
  [0, 0, 14],
  [8, 0, 3],
  [12, 0, 14],
];
const REEL_JOINS: Join[] = [
  [0, 0, { up: true, down: true }],
  [8, 0, { down: true }],
  [12, 0, { up: true, down: true }],
  [0, 3, { up: true, down: true }],
  [8, 3, { up: true }],
  [12, 3, { up: true, down: true }],
  [0, 11, { up: true, down: true }],
  [12, 11, { up: true, down: true }],
];

function frameAriaLabel(frame: GalleryFrame) {
  const category = categoryById(frame.category).full;
  if (frame.href && frame.destinationLabel) {
    return `Go to ${frame.destinationLabel}: ${frame.title}, ${category}`;
  }
  return `${frame.title}, ${category}`;
}

export default function GalleryView({ frames }: { frames: GalleryFrame[] }) {
  const router = useRouter();
  const reelRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<GalleryStripHandle>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduced, setReduced] = useState(false);

  const safeIndex =
    frames.length === 0 ? 0 : Math.min(activeIndex, frames.length - 1);
  const shown = frames[safeIndex];
  const interactive = !reduced && frames.length > 1;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useGSAP(
    () => {
      const root = reelRef.current;
      if (!root) return;
      const items = gsap.utils.toArray<HTMLElement>("[data-gal-item]", root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(items, { autoAlpha: 0, y: 12 });
        gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
        });
      });

      return () => mm.revert();
    },
    { scope: reelRef },
  );

  const openDestination = (id: string) => {
    const frame = frames.find((item) => item.id === id);
    if (!frame?.href) return;
    router.push(frame.href);
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
    if ((event.key === "Enter" || event.key === " ") && shown?.href) {
      event.preventDefault();
      openDestination(shown.id);
    }
  };

  return (
    <SectionGrid
      ref={reelRef}
      id="gallery-reel"
      aria-labelledby="gallery-heading"
      rows={14}
      tone="page"
      outerV={false}
      className="gallery-reel-stage relative bg-cream text-steel"
    >
      <Frame h={REEL_H} v={REEL_V} joins={REEL_JOINS} />

      <Cell at={[0, 8, 0, 3]} className="plate-title gallery-hero-title">
        <MobileEdge open />
        <Eyebrow data-gal-item>Gallery</Eyebrow>
        <H1Heading id="gallery-heading">Seen where it is made.</H1Heading>
      </Cell>

      <Cell at={[8, 12, 0, 3]} className="plate-lede gallery-hero-lede">
        <MobileEdge />
        <Copy data-gal-item variant="lede">
          The Kadawatha workshop, Kilgharrah 600 in the field, and the evening
          the company was received. Tap a frame to open its page or story.
        </Copy>
      </Cell>

      {frames.length > 0 ? (
        <div className="gallery-reel-slot">
          <div
            ref={frameRef}
            className="gallery-reel-frame"
            {...(interactive ? { "data-lenis-prevent": "" } : {})}
          >
            {shown && reduced ? (
              shown.href ? (
                <button
                  type="button"
                  className="gallery-reel-still"
                  data-cursor="explore"
                  onClick={() => openDestination(shown.id)}
                  aria-label={frameAriaLabel(shown)}
                >
                  <Image
                    src={frameSrc(shown.image)}
                    alt={shown.alt}
                    fill
                    sizes="80vw"
                    fetchPriority="high"
                    className={
                      shown.fit === "contain"
                        ? "object-contain p-[12%]"
                        : "object-cover"
                    }
                  />
                </button>
              ) : (
                <div className="gallery-reel-still" aria-label={frameAriaLabel(shown)}>
                  <Image
                    src={frameSrc(shown.image)}
                    alt={shown.alt}
                    fill
                    sizes="80vw"
                    fetchPriority="high"
                    className={
                      shown.fit === "contain"
                        ? "object-contain p-[12%]"
                        : "object-cover"
                    }
                  />
                </div>
              )
            ) : (
              <GalleryStrip
                ref={stripRef}
                frames={frames}
                onActiveIndex={setActiveIndex}
                onOpen={openDestination}
              />
            )}
          </div>
          {interactive ? (
            <div className="gallery-drag-cue" aria-hidden>
              <span className="index-tag">Drag</span>
              <DirectionPulse direction="right" stack="trio" />
            </div>
          ) : null}
        </div>
      ) : null}

      {shown ? (
        <div
          ref={slotRef}
          className="gallery-reel-detail"
          tabIndex={0}
          onKeyDown={onSlotKey}
        >
          <BrandButton
            type="button"
            direction="left"
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
                  <span>[{pad2(safeIndex + 1)}]</span>
                  <span aria-hidden> · </span>
                  <span>
                    {pad2(safeIndex + 1)} / {pad2(frames.length)}
                  </span>
                </p>
                <p className="index-tag font-normal">
                  {shown.destinationLabel
                    ? `${shown.destinationLabel} · ${categoryById(shown.category).full}`
                    : categoryById(shown.category).full}
                </p>
              </div>
              <Copy
                variant="statement"
                className="gallery-reel-title"
                aria-live="polite"
              >
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
  );
}
