"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BrandButton from "@/app/(frontend)/components/BrandButton";
import Copy, { copyClass } from "@/app/(frontend)/components/Copy";
import H2Heading from "@/app/(frontend)/components/H2Heading";
import PlusMark, { type PlusArms } from "@/app/(frontend)/components/PlusMark";
import SectionGrid, { GridLine } from "@/app/(frontend)/components/SectionGrid";
import PartnerWordmark from "@/app/(frontend)/homesections/PartnerWordmark";
import { PARTNERS } from "@/app/(frontend)/homesections/partners";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const joinLeftEdge: PlusArms = { up: true, down: true, left: false, right: true };
const joinRightEdge: PlusArms = { up: true, down: true, left: true, right: false };
const joinTeeDown: PlusArms = { up: false, down: true, left: true, right: true };

function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

export type PartnersCopy = {
  eyebrow: string;
  heading: readonly [string, string];
  lede: { strong: string; rest: string };
  statement: string;
  cta?: { label: string; href: string };
};

const HOME_COPY: PartnersCopy = {
  eyebrow: "Trusted by Industry",
  heading: ["Engineering That", "Earns Trust."],
  lede: {
    strong: "Strong engineering partnerships are built over time.",
    rest: "Thimark works with established organizations that rely on its manufacturing capability, technical expertise and commitment to quality.",
  },
  statement:
    "From local manufacturing partnerships to international engineering projects, our work speaks through the relationships we build.",
};

export default function PartnersSection({
  id = "partners",
  copy = HOME_COPY,
}: {
  id?: string;
  copy?: PartnersCopy;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingId = `${id}-heading`;

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const header = gsap.utils.toArray<HTMLElement>("[data-p-header]", root);
      const cells = gsap.utils.toArray<HTMLElement>("[data-p-cell]", root);
      const marks = gsap.utils.toArray<HTMLElement>("[data-p-mark]", root);

      const mm = gsap.matchMedia();

      const conditions = {
        motion: "(prefers-reduced-motion: no-preference)",
        phone: "(max-width: 767px)",
      };

      mm.add(conditions, (ctx) => {
        const { motion, phone } = ctx.conditions ?? {};
        if (!motion) return;
        const toggleActions = phone ? "play none none none" : "play none none reverse";

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
            start: phone ? "top 80%" : "top 70%",
            toggleActions,
          },
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: cells[0] ?? root,
            start: phone ? "top 85%" : "top 80%",
            toggleActions,
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
      id={id}
      aria-labelledby={headingId}
      rows={14}
      tone="page"
      outerV={false}
      className="home-phone flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)] scroll-mt-16 xl:scroll-mt-0"
    >
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
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 top-rows-4 hidden md:block" />
      <PlusMark tone="page" arms={joinTeeDown} className="v-g1-4 top-rows-4 hidden md:block" />
      <PlusMark tone="page" arms={joinTeeDown} className="v-g1-8 top-rows-4 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 top-rows-4 hidden md:block" />

      {/* Row 9 */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-4 at-br-5 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-4-8 at-br-5 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-8-12 at-br-5 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 at-br-5 hidden md:block" />
      <PlusMark tone="page" className="v-g1-4 at-br-5 hidden md:block" />
      <PlusMark tone="page" className="v-g1-8 at-br-5 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-br-5 hidden md:block" />

      {/* Header */}
      <header className="relative z-10 flex min-h-rows-4 flex-col items-center justify-center gap-4 px-[calc(var(--g1-offset)+16px)] py-4 text-center md:h-rows-4 md:py-0">
        <GridLine axis="v" unstyled tone="page" className="v-g1-0 hero-v-above-plus md:hidden" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 hero-v-above-plus md:hidden" />
        <p data-p-header className="eyebrow">
          {copy.eyebrow}
        </p>
        <H2Heading id={headingId}>
          {copy.heading[0]}
          <span className="ab-statement-muted">{copy.heading[1]}</span>
        </H2Heading>
        <Copy data-p-header variant="lede" weight="normal" className="max-w-[720px]">
          <span className="font-medium">{copy.lede.strong}</span>{" "}
          {copy.lede.rest}
        </Copy>
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-bottom md:hidden" />
      </header>

      {/* Logo cells */}
      <div className="relative md:contents">
        <GridLine axis="v" unstyled tone="page" className="v-g1-0 hero-v-below-plus md:hidden" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 hero-v-below-plus md:hidden" />
        <ul className="partners-grid h-rows-10 m-0 min-h-0 list-none p-0">
        {PARTNERS.map((partner, i) => {
          // Phones run two columns; an odd last partner spans both.
          const wide = PARTNERS.length % 2 === 1 && i === PARTNERS.length - 1;
          const leftColumn = !wide && i % 2 === 0;

          return (
            <li
              key={partner.id}
              data-p-cell
              data-cursor="interactive"
              tabIndex={0}
              className={`partner-cell${wide ? " partner-cell-wide" : ""} outline-none`}
              aria-label={`${partner.brand} — ${partner.legalName}, ${partner.sector}`}
            >
              <p className="index-tag flex items-center justify-between gap-4">
                <span className="partner-sector">{partner.sector}</span>
                <span aria-hidden className="partner-index">[{padIndex(i)}]</span>
              </p>
              <div data-p-mark className={`partner-wordmark ${copyClass("display")}`}>
                <PartnerWordmark partner={partner} />
              </div>
              <Copy variant="caption">{partner.legalName}</Copy>
              <GridLine
                axis="h"
                unstyled
                tone="page"
                className="partner-cell-rule at-bottom md:hidden"
              />
              {leftColumn ? (
                <>
                  <GridLine
                    axis="v"
                    unstyled
                    tone="page"
                    className="partner-cell-divider md:hidden"
                  />
                  <PlusMark
                    tone="page"
                    className="partner-cell-join left-full at-bottom md:hidden"
                  />
                </>
              ) : null}
            </li>
          );
        })}
        <li
          data-p-cell
          className={`partner-statement dot-field-soft${copy.cta ? " partner-statement-stack" : ""}`}
        >
          <Copy variant="lede">{copy.statement}</Copy>
          {copy.cta ? (
            <BrandButton href={copy.cta.href} className="partner-statement-cta">
              {copy.cta.label}
            </BrandButton>
          ) : null}
        </li>
        </ul>
      </div>
    </SectionGrid>
  );
}
