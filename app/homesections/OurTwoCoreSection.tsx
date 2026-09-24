"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BrandButton from "@/app/components/BrandButton";
import MaskRevealHeading from "@/app/components/MaskRevealHeading";
import PlusMark from "@/app/components/PlusMark";
import SectionGrid, { GridLine } from "@/app/components/SectionGrid";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const COLUMNS = [
  {
    id: "automotive",
    index: "01",
    label: "Automotive Component Manufacturing",
    title: "Precision Components for the Mobility Industry",
    href: "/#catalogue",
    cta: "Explore Automotive Components",
    image: "/home-images/two-core-automotive.jpeg",
    alt: "Engineers assembling a motorcycle frame on the production line",
    body: "We design, fabricate and supply high-quality motorcycle components for local assembly lines, supporting leading manufacturers with consistent production, dependable quality and increased local value addition. From individual brackets and stands to structural motorcycle components, our OEM manufacturing capabilities are built around the demands of production environments.",
  },
  {
    id: "machinery",
    index: "02",
    label: "Industrial Machinery Design & Manufacturing",
    title: "Machines Engineered Around the Challenge",
    href: "/#manufacturing",
    cta: "Explore Industrial Solutions",
    image: "/home-images/two-core-machinery.jpeg",
    alt: "Engineers inspecting a custom industrial water-treatment machine",
    body: "We design and manufacture customized industrial equipment for applications across construction, hydropower, water management and manufacturing. From fabricated systems and conveyors to specialized automated machinery, we bring engineering, fabrication and problem-solving together to create solutions for demanding industrial environments.",
  },
] as const;

type ColumnNodes = {
  head: HTMLElement | null;
  rule: HTMLElement | null;
  image: HTMLElement | null;
  numeral: HTMLElement | null;
  title: HTMLElement | null;
  body: HTMLElement | null;
  cta: HTMLElement | null;
};

function revealColumn(
  tl: gsap.core.Timeline,
  nodes: ColumnNodes,
  position: number,
) {
  const { head, rule, image, numeral, title, body, cta } = nodes;
  if (!head || !image || !title || !body || !cta) return;

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
  if (numeral) {
    tl.to(
      numeral,
      { autoAlpha: 1, duration: 0.5, ease: "power2.out" },
      position + 0.42,
    );
  }
  tl.to(title, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, position + 0.5);
  tl.to(body, { autoAlpha: 1, duration: 0.45, ease: "power2.out" }, position + 0.62);
  tl.to(cta, { autoAlpha: 1, duration: 0.4, ease: "power2.out" }, position + 0.72);
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
        cta: pick("cta", i),
      }));

      const header = gsap.utils.toArray<HTMLElement>("[data-core-header]", root);
      const fades = columns.flatMap((c) =>
        [c.head, c.numeral, c.title, c.body, c.cta].filter(
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
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
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
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
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
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-4-br5 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-br5-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-br2-end hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-top-3 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-3-4 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-4-br5 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-br5-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-br2-end hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 v-seg-3-4 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 v-seg-4-br5 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 v-seg-br5-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 v-seg-br2-end hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-8 v-seg-top-3 hidden md:block" />

      {/* Row 3 — intro base / card heads */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-8 top-rows-3 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-8-12 top-rows-3 hidden md:block" />
      <PlusMark tone="page" className="v-g1-0 top-rows-3 hidden md:block" />
      <PlusMark tone="page" className="v-g1-6 top-rows-3 hidden md:block" />
      <PlusMark tone="page" className="v-g1-8 top-rows-3 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 top-rows-3 hidden md:block" />

      {/* Row 4 — head base (drawn per column) */}
      <GridLine
        axis="h"
        unstyled
        tone="page"
        data-core-rule="0"
        className="h-seg-0-mid top-rows-4 hidden md:block"
      />
      <GridLine
        axis="h"
        unstyled
        tone="page"
        data-core-rule="1"
        className="h-seg-mid-12 top-rows-4 hidden md:block"
      />
      <PlusMark tone="page" className="v-g1-0 top-rows-4 hidden md:block" />
      <PlusMark tone="page" className="v-g1-6 top-rows-4 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 top-rows-4 hidden md:block" />

      {/* Row 11 — media base */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-mid at-br-5 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-mid-12 at-br-5 hidden md:block" />
      <PlusMark tone="page" className="v-g1-0 at-br-5 hidden md:block" />
      <PlusMark tone="page" className="v-g1-6 at-br-5 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 at-br-5 hidden md:block" />

      {/* Row 14 — CTA band */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-mid at-br-2 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-mid-12 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-0 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-6 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 at-br-2 hidden md:block" />

      {/* Intro */}
      <div className="two-core-intro min-h-rows-3">
        <div className="two-core-title">
          <p data-core-header className="eyebrow">
            What We Do
          </p>
          <MaskRevealHeading
            id="two-core-heading"
            className="font-heading text-[clamp(28px,3.4vw,48px)] leading-none font-medium text-left uppercase"
          >
            Two Capabilities.
            <span className="block">One Engineering Mindset.</span>
          </MaskRevealHeading>
        </div>
        <p
          data-core-header
          className="two-core-lede font-heading text-[16px] leading-none font-medium text-left uppercase md:text-justify md:[text-align-last:left]"
        >
          Thimark operates across two complementary areas of engineering and
          manufacturing — helping customers source precision components while
          also developing complete, custom-engineered machinery and systems.
        </p>
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-12 at-bottom md:hidden" />
      </div>

      {/* Cards */}
      <div className="two-core-cards">
        {COLUMNS.map((col, i) => (
          <article
            key={col.id}
            id={col.id}
            className={`two-core-card ${i === 0 ? "two-core-col-a" : "two-core-col-b"} scroll-mt-16 md:scroll-mt-0`}
          >
            <p data-core-label={i} className="two-core-card-head index-tag">
              <span>{col.label}</span>
              <span aria-hidden>[{col.index}]</span>
            </p>
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
                sizes="(min-width: 768px) 46vw, 100vw"
                className="object-cover"
              />
              <PlusMark tone="light" className="top-4 left-4 z-10" />
              <PlusMark tone="light" className="top-4 left-[calc(100%-16px)] z-10" />
              <PlusMark tone="light" className="top-[calc(100%-16px)] left-4 z-10" />
              <PlusMark tone="light" className="top-[calc(100%-16px)] left-[calc(100%-16px)] z-10" />
              <span aria-hidden data-core-numeral={i} className="two-core-numeral">
                {col.index}
              </span>
            </Link>
            <div className="two-core-card-base">
              <h3
                data-core-title={i}
                className="font-heading text-[24px] leading-none font-medium text-left uppercase"
              >
                {col.title}
              </h3>
              <p
                data-core-body={i}
                className="font-heading text-[12px] leading-none font-normal uppercase md:text-justify md:[text-align-last:left]"
              >
                {col.body}
              </p>
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
            <GridLine
              axis="h"
              unstyled
              tone="page"
              className="at-bottom left-0 w-full md:hidden"
            />
          </article>
        ))}
      </div>
    </SectionGrid>
  );
}
