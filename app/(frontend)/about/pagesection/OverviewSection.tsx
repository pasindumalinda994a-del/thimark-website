"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import MaskRevealHeading from "@/app/(frontend)/components/MaskRevealHeading";
import SectionGrid from "@/app/(frontend)/components/SectionGrid";
import { STATS, formatStat } from "@/app/(frontend)/components/stats";
import { OVERVIEW } from "./about";
import { usePlateMotion } from "@/app/(frontend)/components/usePlateMotion";
import {
  Cell,
  Corners,
  Eyebrow,
  Frame,
  MobileEdge,
  type HLine,
  type VLine,
} from "@/app/(frontend)/components/plate";
import { padIndex } from "@/app/(frontend)/homesections/StoryProgress";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const H: HLine[] = [
  [3, 0, 12],
  [4, 6, 12],
  [13, 0, 12],
  [16, 0, 12],
];

const V: VLine[] = [
  [0, 0, 20],
  [12, 0, 20],
  [6, 3, 13],
  [8, 13, 16],
  [4, 16, 20],
  [6, 16, 20],
  [8, 16, 20],
  [10, 16, 20],
];

export default function OverviewSection() {
  const ref = useRef<HTMLElement>(null);
  usePlateMotion(ref, { image: "rise" });

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const paragraphs = gsap.utils.toArray<HTMLElement>("[data-letters]", root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(paragraphs, { opacity: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(paragraphs, {
          type: "chars",
          autoSplit: true,
          tag: "span",
          onSplit(self) {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: paragraphs[0],
                endTrigger: paragraphs[paragraphs.length - 1],
                start: "top 80%",
                end: "bottom 45%",
                scrub: true,
              },
            });
            paragraphs.forEach((el, i) => {
              const chars = self.chars.filter((char) => el.contains(char));
              if (!chars.length) return;
              tl.fromTo(
                chars,
                { opacity: 0.5 },
                { opacity: 1, ease: "none", duration: 0.15, stagger: 0.2 },
                i === 0 ? 0 : ">",
              );
            });
            return tl;
          },
        });

        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <SectionGrid
      ref={ref}
      id="overview"
      aria-labelledby="overview-heading"
      rows={20}
      tone="page"
      outerV={false}
      className="flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)]"
    >
      <Frame h={H} v={V} />

      <Cell at={[0, 12, 0, 3]} className="plate-title">
        <MobileEdge open />
        <Eyebrow data-reveal index={OVERVIEW.index}>
          {OVERVIEW.eyebrow}
        </Eyebrow>
        <MaskRevealHeading
          id="overview-heading"
          className="font-heading text-[clamp(28px,2.5vw,48px)] leading-none font-medium uppercase"
        >
          {OVERVIEW.heading[0]}
          <span className="ab-statement-muted">{OVERVIEW.heading[1]}</span>
        </MaskRevealHeading>
      </Cell>

      <Cell at={[0, 6, 3, 13]} className="ov-media">
        <MobileEdge />
        <div data-wipe className="plate-media">
          <Image
            src={OVERVIEW.media.src}
            alt={OVERVIEW.media.alt}
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
            style={{ objectPosition: OVERVIEW.media.objectPosition }}
          />
          <Corners tone="light" />
        </div>
      </Cell>

      <Cell at={[6, 12, 3, 4]} className="ab-head index-tag">
        <MobileEdge open />
        <span className="flex items-center gap-2">
          <span aria-hidden className="ab-marker" />
          {OVERVIEW.storyLabel}
        </span>
        <span className="tabular-nums">
          [{padIndex(0)}&ndash;{padIndex(OVERVIEW.paragraphs.length - 1)}]
        </span>
      </Cell>

      <Cell at={[6, 12, 4, 13]} className="ov-story">
        <MobileEdge />
        {OVERVIEW.paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            data-letters
            className="font-heading text-[clamp(16px,1.5vw,26px)] leading-[1.05] font-medium uppercase"
          >
            {paragraph}
          </p>
        ))}
      </Cell>

      <Cell at={[0, 8, 13, 16]} className="plate-statement">
        <MobileEdge open />
        <p data-reveal className="ab-statement">
          {OVERVIEW.statement[0]}
          <span className="ab-statement-muted">{OVERVIEW.statement[1]}</span>
        </p>
      </Cell>

      <Cell at={[8, 12, 13, 16]} className="plate-lede">
        <MobileEdge />
        {OVERVIEW.aside.map((line, i) => (
          <p
            key={line}
            data-reveal
            className={`font-heading text-[clamp(12px,1vw,16px)] leading-[1.1] uppercase ${i === 0 ? "font-medium" : "font-normal opacity-80"}`}
          >
            {line}
          </p>
        ))}
      </Cell>

      <Cell at={[0, 4, 16, 20]} className="ov-iso">
        <MobileEdge />
        <p className="index-tag flex items-center justify-between gap-4">
          <span>{OVERVIEW.snapshotLabel}</span>
          <span>[{padIndex(0)}]</span>
        </p>
        <div data-reveal className="ov-iso-lockup">
          <span className="ov-iso-org">{OVERVIEW.iso.org}</span>
          <span className="ov-iso-code">{OVERVIEW.iso.code}</span>
          <span className="ov-iso-sub">{OVERVIEW.iso.sub}</span>
        </div>
      </Cell>

      {STATS.map((stat, i) => (
        <Cell key={stat.id} at={[4 + i * 2, 6 + i * 2, 16, 20]} className="ov-stat">
          <MobileEdge />
          <p className="ov-stat-head index-tag">
            <span>{stat.label}</span>
            <span className="tabular-nums opacity-60">[{padIndex(i + 1)}]</span>
          </p>
          <div data-reveal className="ov-stat-figure">
            {stat.unit ? <span className="index-tag opacity-70">{stat.unit}</span> : null}
            <p className="ov-stat-value">
              <span data-count={stat.value} data-count-pad={stat.pad}>
                {formatStat(stat.value, stat.pad)}
              </span>
              {stat.suffix}
            </p>
          </div>
        </Cell>
      ))}
    </SectionGrid>
  );
}
