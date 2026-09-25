"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BrandButton from "@/app/components/BrandButton";
import MaskRevealHeading from "@/app/components/MaskRevealHeading";
import PlusMark from "@/app/components/PlusMark";
import SectionGrid, { GridLine } from "@/app/components/SectionGrid";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_SLOTS,
  PRODUCT_TOTALS,
} from "@/app/homesections/products";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function productSrc(path: string) {
  return encodeURI(path).replaceAll("&", "%26");
}

function CornerPluses() {
  return (
    <>
      <PlusMark tone="page" className="top-4 left-4" />
      <PlusMark tone="page" className="top-4 left-[calc(100%-16px)]" />
      <PlusMark tone="page" className="top-[calc(100%-16px)] left-4" />
      <PlusMark tone="page" className="top-[calc(100%-16px)] left-[calc(100%-16px)]" />
    </>
  );
}

export default function ProductCatalogueSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const pendingRef = useRef<number | null>(null);
  const firstPaint = useRef(true);
  const busy = useRef(false);

  const category = PRODUCT_CATEGORIES[active];
  const items = category.items.slice(0, PRODUCT_SLOTS);
  const empties = Math.max(PRODUCT_SLOTS - items.length, 0);

  // Reveal cards whenever the active category changes (and on first paint).
  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-cat-card]", grid);
      const media = gsap.utils.toArray<HTMLElement>("[data-cat-media]", grid);
      const draws = gsap.utils.toArray<HTMLElement>("[data-tab-draw]", sectionRef.current ?? grid);

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
        { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.06 },
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

  // Header reveal.
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
    const last = PRODUCT_CATEGORIES.length - 1;
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
      id="catalogue"
      aria-labelledby="catalogue-heading"
      rows={16}
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
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-4-9 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-9-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-br2-end hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-top-3 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-3-4 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-4-9 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-9-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-br2-end hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-4 v-seg-4-9 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-4 v-seg-9-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-8 v-seg-4-9 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-8 v-seg-9-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-8 v-seg-br2-end hidden md:block" />

      {/* Row 3 */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 top-rows-3 hidden md:block" />
      <PlusMark tone="page" className="v-g1-0 top-rows-3 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 top-rows-3 hidden md:block" />

      {/* Row 4 */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-4 top-rows-4 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-4-8 top-rows-4 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-8-12 top-rows-4 hidden md:block" />
      <PlusMark tone="page" className="v-g1-0 top-rows-4 hidden md:block" />
      <PlusMark tone="page" className="v-g1-4 top-rows-4 hidden md:block" />
      <PlusMark tone="page" className="v-g1-8 top-rows-4 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 top-rows-4 hidden md:block" />

      {/* Row 9 */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-4 top-rows-9 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-4-8 top-rows-9 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-8-12 top-rows-9 hidden md:block" />
      <PlusMark tone="page" className="v-g1-0 top-rows-9 hidden md:block" />
      <PlusMark tone="page" className="v-g1-4 top-rows-9 hidden md:block" />
      <PlusMark tone="page" className="v-g1-8 top-rows-9 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 top-rows-9 hidden md:block" />

      {/* Row 14 */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-8 at-br-2 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-8-12 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-0 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-8 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 at-br-2 hidden md:block" />

      {/* Intro */}
      <div className="catalogue-intro min-h-rows-3">
        <div className="catalogue-title">
          <p data-cat-header className="eyebrow">
            Explore Our Products
          </p>
          <MaskRevealHeading
            id="catalogue-heading"
            className="font-heading text-[clamp(28px,2.5vw,48px)] leading-none font-medium text-left uppercase"
          >
            Precision Components.
            <span className="block">Built to Perform.</span>
          </MaskRevealHeading>
        </div>
        <p
          data-cat-header
          className="catalogue-lede font-heading text-[clamp(12px,1vw,16px)] leading-none font-medium text-left uppercase md:text-justify md:[text-align-last:left]"
        >
          Explore a selection of motorcycle components manufactured by Thimark
          for leading local assembly programs.
        </p>
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-12 at-bottom md:hidden" />
      </div>

      {/* Tabs */}
      <div className="relative md:contents">
        <div
          role="tablist"
          aria-label="Product categories"
          className="catalogue-tabs"
        >
          {PRODUCT_CATEGORIES.map((cat, i) => {
            const selected = i === active;
            return (
              <button
                key={cat.id}
                ref={(node) => {
                  tabRefs.current[i] = node;
                }}
                type="button"
                role="tab"
                id={`catalogue-tab-${cat.id}`}
                aria-selected={selected}
                aria-controls="catalogue-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => select(i)}
                onKeyDown={(event) => onTabKey(event, i)}
                className="catalogue-tab index-tag outline-none hover:text-brand focus-visible:text-brand"
              >
                {i > 0 ? (
                  <span aria-hidden className="catalogue-tab-divider" />
                ) : null}
                <span>
                  {cat.brand} {cat.model}
                </span>
                <span aria-hidden>[{pad2(cat.items.length)}]</span>
                <span aria-hidden data-tab-draw className="catalogue-tab-draw" />
              </button>
            );
          })}
        </div>
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-12 at-bottom md:hidden" />
      </div>

      {/* Product grid */}
      <ul
        ref={gridRef}
        id="catalogue-panel"
        role="tabpanel"
        aria-labelledby={`catalogue-tab-${category.id}`}
        className="catalogue-grid m-0 list-none p-0"
      >
        {items.map((item, i) => (
          <li
            key={`${category.id}-${item.name}-${i}`}
            data-cat-card
            className="catalogue-card"
          >
            <div
              data-cat-media
              className={
                item.image
                  ? "catalogue-card-media has-photo"
                  : "catalogue-card-media"
              }
            >
              {item.image ? (
                <>
                  <Image
                    src={productSrc(item.image)}
                    alt={
                      item.alt ??
                      `${item.name} for ${category.brand} ${category.model}`
                    }
                    fill
                    sizes="(min-width: 768px) 28vw, 100vw"
                    className="catalogue-card-photo"
                  />
                  <CornerPluses />
                </>
              ) : (
                <div className="dot-field-soft absolute inset-0 flex items-center justify-center">
                  <CornerPluses />
                  <span
                    aria-hidden
                    className="font-heading text-[clamp(64px,6vw,96px)] leading-none font-medium text-transparent [-webkit-text-stroke:1px_color-mix(in_srgb,var(--page-ink)_55%,transparent)]"
                  >
                    {padIndex(i)}
                  </span>
                </div>
              )}
              <span className="index-tag absolute top-[9px] left-7 z-10 flex items-center gap-2 bg-cream px-2 py-1.5">
                <span aria-hidden>[{padIndex(i)}]</span>
                <span>{category.model}</span>
              </span>
            </div>
            <div className="catalogue-card-copy">
              <h3 className="font-heading text-[clamp(16px,1.25vw,24px)] leading-none font-medium uppercase">
                {item.name}
              </h3>
              <p className="index-tag flex items-center justify-between gap-4 font-normal">
                <span>
                  Component · {category.brand} {category.model}
                </span>
              </p>
            </div>
            <GridLine
              axis="h"
              unstyled
              tone="page"
              className="at-bottom left-0 w-full md:hidden"
            />
          </li>
        ))}
        {Array.from({ length: empties }, (_, i) =>
          i === 0 ? (
            <li key={`more-${category.id}`} data-cat-card className="catalogue-card">
              <Link
                href="/#contact"
                data-cursor="explore"
                className="catalogue-more dot-field-soft flex-1"
              >
                <CornerPluses />
                <p className="index-tag flex items-center justify-between gap-4">
                  <span>All components</span>
                  <span aria-hidden>[{pad2(PRODUCT_TOTALS.components)}]</span>
                </p>
                <p className="font-heading text-[clamp(16px,1.25vw,24px)] leading-none font-medium uppercase">
                  View All
                  <span className="block">Products →</span>
                </p>
              </Link>
            </li>
          ) : (
            <li
              key={`empty-${category.id}-${i}`}
              data-cat-card
              aria-hidden
              className="catalogue-card"
            >
              <div className="dot-field-soft relative min-h-[8rem] flex-1">
                <CornerPluses />
              </div>
            </li>
          ),
        )}
      </ul>

      {/* Foot */}
      <div className="catalogue-foot min-h-rows-2">
        <div className="catalogue-readout index-tag">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>{pad2(PRODUCT_TOTALS.components)} Components</span>
            <span aria-hidden>·</span>
            <span>{pad2(PRODUCT_TOTALS.models)} Models</span>
            <span aria-hidden>·</span>
            <span>{pad2(PRODUCT_TOTALS.partners)} OEM Partners</span>
          </p>
          <p className="hidden font-normal md:block">
            Showing {category.brand} {category.model} —{" "}
            {pad2(category.items.length)} components
          </p>
        </div>
        <BrandButton tone="steel" href="/#contact" className="catalogue-cta">
          View All Products
        </BrandButton>
      </div>
    </SectionGrid>
  );
}
