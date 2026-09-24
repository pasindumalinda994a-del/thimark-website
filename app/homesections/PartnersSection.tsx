"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MaskRevealHeading from "@/app/components/MaskRevealHeading";
import PlusMark from "@/app/components/PlusMark";
import SectionGrid, { GridLine } from "@/app/components/SectionGrid";
import { PARTNERS } from "@/app/homesections/partners";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

export default function PartnersSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const header = gsap.utils.toArray<HTMLElement>("[data-p-header]", root);
      const cells = gsap.utils.toArray<HTMLElement>("[data-p-cell]", root);
      const marks = gsap.utils.toArray<HTMLElement>("[data-p-mark]", root);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(header, { autoAlpha: 0, y: 10 });
        gsap.set(cells, { autoAlpha: 0 });
        gsap.set(marks, { clipPath: "inset(0% 0% 100% 0%)" });

        gsap.to(header, {
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
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: cells[0] ?? root,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
        tl.to(cells, {
          autoAlpha: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.08,
        });
        tl.to(
          marks,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
          },
          0.15,
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <SectionGrid
      ref={sectionRef}
      id="partners"
      aria-labelledby="partners-heading"
      rows={14}
      tone="page"
      outerV={false}
      className="flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)] scroll-mt-16 md:scroll-mt-0"
    >
      {/* Mobile rails */}
      <GridLine axis="v" tone="page" className="v-g1-0 md:hidden" />
      <GridLine axis="v" tone="page" className="v-g1-12 md:hidden" />

      {/* Desktop rails */}
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-top-4 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-4-br5 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-br5-end hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-top-4 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-4-br5 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-br5-end hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-4 v-seg-4-br5 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-4 v-seg-br5-end hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-8 v-seg-4-br5 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-8 v-seg-br5-end hidden md:block" />

      {/* Row 4 */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-4 top-rows-4 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-4-8 top-rows-4 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-8-12 top-rows-4 hidden md:block" />
      <PlusMark tone="page" className="v-g1-0 top-rows-4 hidden md:block" />
      <PlusMark tone="page" className="v-g1-4 top-rows-4 hidden md:block" />
      <PlusMark tone="page" className="v-g1-8 top-rows-4 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 top-rows-4 hidden md:block" />

      {/* Row 9 */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-4 at-br-5 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-4-8 at-br-5 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-8-12 at-br-5 hidden md:block" />
      <PlusMark tone="page" className="v-g1-0 at-br-5 hidden md:block" />
      <PlusMark tone="page" className="v-g1-4 at-br-5 hidden md:block" />
      <PlusMark tone="page" className="v-g1-8 at-br-5 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 at-br-5 hidden md:block" />

      {/* Header */}
      <header className="relative z-10 flex min-h-rows-4 flex-col items-center justify-center gap-4 px-[calc(var(--g1-offset)+16px)] py-4 text-center md:h-rows-4 md:py-0">
        <p data-p-header className="eyebrow">
          Trusted by Industry
        </p>
        <MaskRevealHeading
          id="partners-heading"
          className="font-heading text-[clamp(28px,3.4vw,48px)] leading-none font-medium uppercase"
        >
          Engineering That Earns Trust.
        </MaskRevealHeading>
        <p
          data-p-header
          className="max-w-[720px] font-heading text-[16px] leading-none font-normal uppercase"
        >
          <span className="font-medium">
            Strong engineering partnerships are built over time.
          </span>{" "}
          Thimark works with established organizations that rely on our
          manufacturing capability, technical expertise and commitment to
          quality.
        </p>
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-12 at-bottom md:hidden" />
      </header>

      {/* Logo cells */}
      <ul className="partners-grid h-rows-10 m-0 min-h-0 list-none p-0">
        {PARTNERS.map((partner, i) => (
          <li
            key={partner.id}
            data-p-cell
            data-cursor="interactive"
            tabIndex={0}
            className="partner-cell outline-none"
            aria-label={`${partner.brand} — ${partner.legalName}, ${partner.sector}`}
          >
            <p className="index-tag flex items-center justify-between gap-4">
              <span>{partner.sector}</span>
              <span aria-hidden>[{padIndex(i)}]</span>
            </p>
            <div data-p-mark className="partner-wordmark">
              {partner.logo ? (
                <Image
                  src={partner.logo}
                  alt={partner.brand}
                  width={240}
                  height={80}
                  className="h-16 w-auto object-contain"
                />
              ) : (
                <span aria-hidden>{partner.brand}</span>
              )}
            </div>
            <p className="font-heading text-[12px] leading-none font-normal uppercase">
              {partner.legalName}
            </p>
            <GridLine
              axis="h"
              unstyled
              tone="page"
              className="at-bottom left-0 w-full md:hidden"
            />
          </li>
        ))}
        <li data-p-cell className="partner-statement dot-field-soft">
          <p className="font-heading text-[16px] leading-none font-medium uppercase md:text-justify md:[text-align-last:left]">
            From local manufacturing partnerships to international engineering
            projects, our work speaks through the relationships we build.
          </p>
        </li>
      </ul>
    </SectionGrid>
  );
}
