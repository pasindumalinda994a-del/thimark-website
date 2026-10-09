"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BrandButton from "@/app/(frontend)/components/BrandButton";
import MaskRevealHeading from "@/app/(frontend)/components/MaskRevealHeading";
import PlusMark, { type PlusArms } from "@/app/(frontend)/components/PlusMark";
import SectionGrid, { GridLine } from "@/app/(frontend)/components/SectionGrid";
import FigMark, { HOME_FIG } from "@/app/(frontend)/components/FigMark";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const joinLeftEdge: PlusArms = { up: true, down: true, left: false, right: true };
const joinRightEdge: PlusArms = { up: true, down: true, left: true, right: false };
const joinTeeDown: PlusArms = { up: false, down: true, left: true, right: true };

const COLUMNS = [
  {
    id: "automotive",
    index: "01",
    title: "Automotive Components",
    href: "/automotive",
    cta: "Explore Automotive",
    image: "/home-images/two-core-automotive.jpeg",
    alt: "Engineers assembling a motorcycle frame on the production line",
    body: "We design, fabricate and supply motorcycle components for local assembly lines, with consistent production and dependable quality for leading manufacturers.",
    areas: [
      { index: "01", label: "Manufacturing", href: "/automotive#manufacturing" },
      {
        index: "02",
        label: "Local Value Addition",
        href: "/automotive#local-value-addition",
      },
    ],
  },
  {
    id: "engineering",
    index: "02",
    title: "Engineering & Services",
    href: "/engineering-services",
    cta: "Explore Services",
    image: "/home-images/about-workshop.png",
    alt: "Welders fabricating heavy steel frames in the Thimark workshop",
    body: "We take a requirement through to a finished part, with new product development, reverse engineering and powder coating for production components.",
    areas: [
      {
        index: "01",
        label: "Powder Coating",
        href: "/engineering-services#powder-coating",
      },
      {
        index: "02",
        label: "New Product Development",
        href: "/engineering-services#new-product-development",
      },
      {
        index: "03",
        label: "Reverse Engineering",
        href: "/engineering-services#reverse-engineering",
      },
    ],
  },
  {
    id: "machinery",
    index: "03",
    title: "Industrial Machinery",
    href: "/industrial-machinery",
    cta: "Explore Machinery",
    image: "/home-images/two-core-machinery.jpeg",
    alt: "Engineers inspecting a custom industrial water-treatment machine",
    body: "We design and manufacture custom equipment for hydropower, water management, construction and other demanding industrial environments.",
    areas: [
      {
        index: "01",
        label: "Product & Services",
        href: "/industrial-machinery#products-services",
      },
      { index: "02", label: "Exports", href: "/industrial-machinery#exports" },
    ],
  },
] as const;

const COL_CLASS = ["two-core-col-0", "two-core-col-1", "two-core-col-2"] as const;

type ColumnNodes = {
  head: HTMLElement | null;
  rule: HTMLElement | null;
  image: HTMLElement | null;
  numeral: HTMLElement | null;
  title: HTMLElement | null;
  body: HTMLElement | null;
  areas: HTMLElement | null;
  cta: HTMLElement | null;
};

function revealColumn(
  tl: gsap.core.Timeline,
  nodes: ColumnNodes,
  position: number,
) {
  const { head, rule, image, title, body, areas, cta } = nodes;
  if (!head || !image || !title || !body || !areas || !cta) return;

  tl.to(head, { autoAlpha: 1, duration: 0.45, ease: "power2.out" }, position);
  if (rule) {
    tl.to(
      rule,
      { scaleX: 1, duration: 0.7, ease: "power3.inOut" },
      position + 0.05,
    );
  }
  tl.fromTo(
    image,
    { clipPath: "inset(0% 0% 100% 0%)" },
    { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power2.out" },
    position + 0.12,
  );
  if (title !== head) {
    tl.to(title, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, position + 0.5);
  }
  tl.to(body, { autoAlpha: 1, duration: 0.45, ease: "power2.out" }, position + 0.62);
  tl.to(areas, { autoAlpha: 1, duration: 0.45, ease: "power2.out" }, position + 0.7);
  tl.to(cta, { autoAlpha: 1, duration: 0.4, ease: "power2.out" }, position + 0.8);
}

export default function OurTwoCoreSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const pick = (name: string, i: number) =>
        root.querySelector<HTMLElement>(`[data-core-${name}="${i}"]`);

      const columns: ColumnNodes[] = COLUMNS.map((_, i) => ({
        head: pick("label", i),
        rule: pick("rule", i),
        image: pick("image", i),
        numeral: pick("numeral", i),
        title: pick("title", i),
        body: pick("body", i),
        areas: pick("areas", i),
        cta: pick("cta", i),
      }));

      const header = gsap.utils.toArray<HTMLElement>("[data-core-header]", root);
      const fades = columns.flatMap((c) =>
        [c.head, c.numeral, c.title, c.body, c.areas, c.cta].filter(
          (el): el is HTMLElement => Boolean(el),
        ),
      );
      const images = columns
        .map((c) => c.image)
        .filter((el): el is HTMLElement => Boolean(el));
      const rules = columns
        .map((c) => c.rule)
        .filter((el): el is HTMLElement => Boolean(el));

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(images, { clipPath: "none" });
        gsap.set(fades, { autoAlpha: 1 });
        gsap.set(rules, { scaleX: 1 });
        gsap.set(header, { autoAlpha: 1 });
      });

      const hide = () => {
        gsap.set(images, { clipPath: "inset(0% 0% 100% 0%)" });
        gsap.set(fades, { autoAlpha: 0 });
        gsap.set(rules, {
          scaleX: 0,
          yPercent: -50,
          transformOrigin: "left center",
        });
      };

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

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          hide();
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: columns[0].image ?? root,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          });
          columns.forEach((nodes, i) => revealColumn(tl, nodes, i * 0.18));
        },
      );

      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          hide();
          columns.forEach((nodes) => {
            if (!nodes.image) return;
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: nodes.image,
                start: "top 82%",
                toggleActions: "play none none reverse",
              },
            });
            revealColumn(tl, nodes, 0);
          });
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <SectionGrid
      ref={sectionRef}
      id="capabilities"
      aria-labelledby="two-core-heading"
      rows={17}
      tone="page"
      outerV={false}
      className="flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)] scroll-mt-16 md:scroll-mt-0"
    >
      {/* Desktop rails */}
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-top-3 hidden lg:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-8 v-seg-top-3 hidden lg:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-top-3 hidden lg:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-3-4 hidden lg:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-4 v-seg-3-4 hidden lg:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-8 v-seg-3-4 hidden lg:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-3-4 hidden lg:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-4-11 hidden lg:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-4 v-seg-4-11 hidden lg:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-8 v-seg-4-11 hidden lg:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-4-11 hidden lg:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-11-br2 hidden lg:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-4 v-seg-11-br2 hidden lg:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-8 v-seg-11-br2 hidden lg:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-11-br2 hidden lg:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-br2-end hidden lg:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-4 v-seg-br2-end hidden lg:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-8 v-seg-br2-end hidden lg:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-br2-end hidden lg:block" />

      {/* Row 3 — intro base */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-8 top-rows-3 hidden lg:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-8-12 top-rows-3 hidden lg:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 top-rows-3 hidden lg:block" />
      <PlusMark tone="page" arms={joinTeeDown} className="v-g1-4 top-rows-3 hidden lg:block" />
      <PlusMark tone="page" className="v-g1-8 top-rows-3 hidden lg:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 top-rows-3 hidden lg:block" />

      {/* Row 4 — plate numbers */}
      <GridLine
        axis="h"
        unstyled
        tone="page"
        data-core-rule="0"
        className="h-seg-0-4 top-rows-4 hidden lg:block"
      />
      <GridLine
        axis="h"
        unstyled
        tone="page"
        data-core-rule="1"
        className="h-seg-4-8 top-rows-4 hidden lg:block"
      />
      <GridLine
        axis="h"
        unstyled
        tone="page"
        data-core-rule="2"
        className="h-seg-8-12 top-rows-4 hidden lg:block"
      />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 top-rows-4 hidden lg:block" />
      <PlusMark tone="page" className="v-g1-4 top-rows-4 hidden lg:block" />
      <PlusMark tone="page" className="v-g1-8 top-rows-4 hidden lg:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 top-rows-4 hidden lg:block" />

      {/* Row 9 — media base */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-4 top-rows-11 hidden lg:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-4-8 top-rows-11 hidden lg:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-8-12 top-rows-11 hidden lg:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 top-rows-11 hidden lg:block" />
      <PlusMark tone="page" className="v-g1-4 top-rows-11 hidden lg:block" />
      <PlusMark tone="page" className="v-g1-8 top-rows-11 hidden lg:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 top-rows-11 hidden lg:block" />

      {/* CTA band */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-4 at-br-2 hidden lg:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-4-8 at-br-2 hidden lg:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-8-12 at-br-2 hidden lg:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 at-br-2 hidden lg:block" />
      <PlusMark tone="page" className="v-g1-4 at-br-2 hidden lg:block" />
      <PlusMark tone="page" className="v-g1-8 at-br-2 hidden lg:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-br-2 hidden lg:block" />

      {/* Intro */}
      <div className="two-core-intro min-h-rows-3">
        <div className="two-core-title">
          <p data-core-header className="eyebrow">
            What We Do
          </p>
          <MaskRevealHeading
            id="two-core-heading"
            className="font-heading text-[clamp(28px,2.5vw,48px)] leading-none font-medium text-left uppercase"
          >
            Three Disciplines.
            <span className="block">One Engineering Mindset.</span>
          </MaskRevealHeading>
        </div>
        <p
          data-core-header
          className="two-core-lede font-heading text-[clamp(12px,1vw,16px)] leading-[1.15] font-medium text-left uppercase"
        >
          Components, services, and custom machinery for production.
        </p>
        <GridLine axis="v" unstyled tone="page" className="v-g1-0 hero-v-above-plus lg:hidden" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 hero-v-above-plus lg:hidden" />
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom lg:hidden" />
        <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 at-bottom lg:hidden" />
        <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-bottom lg:hidden" />
      </div>

      {/* Cards */}
      <div className="two-core-cards">
        {COLUMNS.map((col, i) => (
          <article
            key={col.id}
            id={col.id}
            className={`two-core-card ${COL_CLASS[i]} scroll-mt-16 lg:scroll-mt-0`}
          >
            <div
              data-core-label={i}
              className="two-core-card-head index-tag"
            >
              <span>{col.title}</span>
              <span aria-hidden className="shrink-0">
                [{col.index}]
              </span>
            </div>
            <Link
              href={col.href}
              data-core-image={i}
              data-cursor="explore"
              aria-label={col.cta}
              className="two-core-card-media"
            >
              <Image
                src={col.image}
                alt={col.alt}
                fill
                sizes="(min-width: 1024px) 30vw, 100vw"
                className="object-cover"
              />
              <PlusMark tone="light" className="top-4 left-4 z-10" />
              <PlusMark tone="light" className="top-4 left-[calc(100%-16px)] z-10" />
              <PlusMark tone="light" className="bottom-4 left-4 z-10" />
              <PlusMark tone="light" className="bottom-4 left-[calc(100%-16px)] z-10" />
              <FigMark n={HOME_FIG.core + i} />
            </Link>
            <div className="two-core-card-base">
              <h3
                data-core-title={i}
                className="font-heading text-[clamp(16px,1.25vw,24px)] leading-none font-medium uppercase"
              >
                {col.title}
              </h3>
              <p
                data-core-body={i}
                className="font-heading text-[clamp(10px,0.85vw,12px)] leading-[1.2] font-normal uppercase"
              >
                {col.body}
              </p>
              <div data-core-areas={i} className="two-core-areas">
                <ul aria-label="Main areas">
                  {col.areas.map((area) => (
                    <li key={area.href}>
                      <Link href={area.href} data-cursor="explore" className="two-core-area">
                        <span className="two-core-area-index">[{area.index}]</span>
                        <span className="two-core-area-rule" aria-hidden />
                        <span className="two-core-area-name">{area.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="two-core-card-foot">
              <BrandButton
                tone="steel"
                href={col.href}
                data-core-cta={i}
                data-cursor="explore"
                className="two-core-cta"
              >
                {col.cta}
              </BrandButton>
            </div>
            <GridLine axis="v" unstyled tone="page" className="v-g1-0 hero-v-between-pluses lg:hidden" />
            <GridLine axis="v" unstyled tone="page" className="v-g1-12 hero-v-between-pluses lg:hidden" />
            <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom lg:hidden" />
            <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 at-bottom lg:hidden" />
            <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-bottom lg:hidden" />
          </article>
        ))}
      </div>
    </SectionGrid>
  );
}
