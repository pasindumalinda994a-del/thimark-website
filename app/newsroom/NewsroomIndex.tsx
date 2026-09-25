"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MaskRevealHeading from "@/app/components/MaskRevealHeading";
import PlusMark from "@/app/components/PlusMark";
import SectionGrid, { GridLine } from "@/app/components/SectionGrid";
import {
  NEWS_CATEGORIES,
  NEWS_RECORDS,
  categoryById,
  formatRecordDate,
  recordsIn,
  type NewsCategoryId,
} from "@/app/newsroom/records";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SLOTS = 6;

const TABS: { id: "all" | NewsCategoryId; label: string; full: string }[] = [
  { id: "all", label: "All", full: "All records" },
  ...NEWS_CATEGORIES,
];

function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function recordSrc(path: string) {
  return encodeURI(path).replaceAll("&", "%26");
}

function CornerPluses() {
  return (
    <>
      <PlusMark tone="page" className="top-4 left-4" />
      <PlusMark tone="page" className="top-4 left-[calc(100%-16px)]" />
      <PlusMark tone="page" className="top-[calc(100%-16px)] left-4" />
      <PlusMark
        tone="page"
        className="top-[calc(100%-16px)] left-[calc(100%-16px)]"
      />
    </>
  );
}

export default function NewsroomIndex() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const pendingRef = useRef<number | null>(null);
  const firstPaint = useRef(true);
  const busy = useRef(false);

  const tab = TABS[active];
  const categoryRecords =
    tab.id === "all"
      ? [...NEWS_RECORDS].sort((a, b) => b.date.localeCompare(a.date))
      : recordsIn(tab.id);
  const items = categoryRecords.slice(0, SLOTS);
  const empties = Math.max(SLOTS - items.length, 0);

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-cat-card]", grid);
      const media = gsap.utils.toArray<HTMLElement>("[data-cat-media]", grid);
      const draws = gsap.utils.toArray<HTMLElement>(
        "[data-tab-draw]",
        sectionRef.current ?? grid,
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
          stagger: 0.06,
        },
      );
      tl.fromTo(
        media,
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.06,
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
    { scope: sectionRef, dependencies: [active] },
  );

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;
      const header = gsap.utils.toArray<HTMLElement>("[data-cat-header]", root);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          header,
          { autoAlpha: 0, y: 10 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: root,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

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
    const cards = gsap.utils.toArray<HTMLElement>("[data-cat-card]", grid);
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

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, i: number) => {
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
    <SectionGrid
      ref={sectionRef}
      id="newsroom-index"
      aria-labelledby="newsroom-heading"
      rows={18}
      tone="page"
      outerV={false}
      className="flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)] scroll-mt-16 md:scroll-mt-0"
    >
      <GridLine axis="v" tone="page" className="v-g1-0 md:hidden" />
      <GridLine axis="v" tone="page" className="v-g1-12 md:hidden" />

      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-top-3 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-3-4 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-4-10 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-10-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-br2-end hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-top-3 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-3-4 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-4-10 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-10-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-br2-end hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-4 v-seg-4-10 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-4 v-seg-10-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-8 v-seg-4-10 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-8 v-seg-10-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-8 v-seg-br2-end hidden md:block" />

      <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 top-rows-3 hidden md:block" />
      <PlusMark tone="page" className="v-g1-0 top-rows-3 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 top-rows-3 hidden md:block" />

      <GridLine axis="h" unstyled tone="page" className="h-seg-0-4 top-rows-4 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-4-8 top-rows-4 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-8-12 top-rows-4 hidden md:block" />
      <PlusMark tone="page" className="v-g1-0 top-rows-4 hidden md:block" />
      <PlusMark tone="page" className="v-g1-4 top-rows-4 hidden md:block" />
      <PlusMark tone="page" className="v-g1-8 top-rows-4 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 top-rows-4 hidden md:block" />

      <GridLine axis="h" unstyled tone="page" className="h-seg-0-4 top-rows-10 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-4-8 top-rows-10 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-8-12 top-rows-10 hidden md:block" />
      <PlusMark tone="page" className="v-g1-0 top-rows-10 hidden md:block" />
      <PlusMark tone="page" className="v-g1-4 top-rows-10 hidden md:block" />
      <PlusMark tone="page" className="v-g1-8 top-rows-10 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 top-rows-10 hidden md:block" />

      <GridLine axis="h" unstyled tone="page" className="h-seg-0-8 at-br-2 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-8-12 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-0 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-8 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 at-br-2 hidden md:block" />

      <div className="catalogue-intro min-h-rows-3">
        <div className="catalogue-title">
          <p data-cat-header className="eyebrow">
            Newsroom
          </p>
          <MaskRevealHeading
            id="newsroom-heading"
            className="font-heading text-[clamp(28px,3.4vw,48px)] leading-none font-medium text-left uppercase"
          >
            On the record.
          </MaskRevealHeading>
        </div>
        <p
          data-cat-header
          className="catalogue-lede font-heading text-[16px] leading-none font-medium text-left uppercase md:text-justify md:[text-align-last:left]"
        >
          Company news, project dispatches, awards, and work that leaves Sri Lanka.
        </p>
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-12 at-bottom md:hidden" />
      </div>

      <div className="relative md:contents">
        <div role="tablist" aria-label="News categories" className="catalogue-tabs">
          {TABS.map((tabItem, i) => {
            const selected = i === active;
            const count =
              tabItem.id === "all"
                ? NEWS_RECORDS.length
                : NEWS_RECORDS.filter((record) => record.category === tabItem.id).length;
            return (
              <button
                key={tabItem.id}
                ref={(node) => {
                  tabRefs.current[i] = node;
                }}
                type="button"
                role="tab"
                id={`news-tab-${tabItem.id}`}
                aria-selected={selected}
                aria-controls="newsroom-panel"
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
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-12 at-bottom md:hidden" />
      </div>

      <ul
        ref={gridRef}
        id="newsroom-panel"
        role="tabpanel"
        aria-labelledby={`news-tab-${tab.id}`}
        className="catalogue-grid m-0 list-none p-0"
      >
        {items.map((record, i) => (
          <li key={record.slug} data-cat-card className="catalogue-card">
            <Link
              href={`/newsroom/${record.slug}`}
              className="flex min-h-0 flex-1 flex-col text-inherit no-underline"
            >
              <div data-cat-media className="catalogue-card-media news-card-media has-photo">
                <Image
                  src={recordSrc(record.image)}
                  alt={record.alt}
                  fill
                  sizes="(min-width: 768px) 28vw, 100vw"
                  className="catalogue-card-photo news-card-photo"
                />
                <CornerPluses />
                <span className="index-tag absolute top-[9px] left-7 z-10 flex items-center gap-2 bg-cream px-2 py-1.5">
                  <span aria-hidden>[{padIndex(i)}]</span>
                  <span>{categoryById(record.category).label}</span>
                </span>
              </div>
              <div className="catalogue-card-copy">
                <h3 className="font-heading text-[clamp(16px,1.25vw,24px)] leading-none font-medium uppercase">
                  {record.title}
                </h3>
                <p className="line-clamp-2 text-[13px] leading-[1.4] text-steel/75">
                  {record.excerpt}
                </p>
                <p className="index-tag flex items-center justify-between gap-4 font-normal">
                  <span>
                    {categoryById(record.category).full} · {formatRecordDate(record.date)}
                  </span>
                </p>
              </div>
            </Link>
            <GridLine
              axis="h"
              unstyled
              tone="page"
              className="at-bottom left-0 w-full md:hidden"
            />
          </li>
        ))}
        {Array.from({ length: empties }, (_, i) => (
          <li
            key={`empty-${tab.id}-${i}`}
            data-cat-card
            aria-hidden
            className="catalogue-card"
          >
            <div className="dot-field-soft relative min-h-[8rem] flex-1">
              <CornerPluses />
            </div>
          </li>
        ))}
      </ul>

      <div className="catalogue-foot min-h-rows-2">
        <div className="catalogue-readout index-tag">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>{pad2(NEWS_RECORDS.length)} Records</span>
            <span aria-hidden>·</span>
            <span>{pad2(NEWS_CATEGORIES.length)} Categories</span>
          </p>
          <p className="hidden font-normal md:block">
            Showing {tab.full} — {pad2(categoryRecords.length)} records
          </p>
        </div>
      </div>
    </SectionGrid>
  );
}
