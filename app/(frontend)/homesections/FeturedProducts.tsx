"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Copy from "@/app/(frontend)/components/Copy";
import H2Heading from "@/app/(frontend)/components/H2Heading";
import PlusMark, { type PlusArms } from "@/app/(frontend)/components/PlusMark";
import SectionGrid, { GridLine } from "@/app/(frontend)/components/SectionGrid";
import { FEATURED } from "@/app/(frontend)/homesections/home";
import SolutionsSection from "@/app/(frontend)/homesections/SolutionsSection";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const joinLeftEdge: PlusArms = { up: true, down: true, left: false, right: true };
const joinRightEdge: PlusArms = { up: true, down: true, left: true, right: false };
const joinTeeDown: PlusArms = { up: false, down: true, left: true, right: true };
const joinTeeUp: PlusArms = { up: true, down: false, left: true, right: true };

export default function FeturedProducts() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const header = gsap.utils.toArray<HTMLElement>("[data-featured-copy]", root);
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
            scrollTrigger: { trigger: root, start: "top 70%", once: true },
          },
        );
      });

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const bands = gsap.utils.toArray<HTMLElement>(".solutions-band", root);

        bands.forEach((band) => {
          const note = band.querySelector<HTMLElement>(".solutions-note");
          if (!note) return;

          gsap.set(note, { yPercent: -50 });

          const distance = () => Math.max(0, (band.offsetHeight - note.offsetHeight) / 2 - 16);

          gsap.fromTo(
            note,
            { y: () => -distance() },
            {
              y: () => distance(),
              ease: "none",
              scrollTrigger: {
                trigger: band,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      });

      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        const bands = gsap.utils.toArray<HTMLElement>(".solutions-band", root);

        bands.forEach((band) => {
          const shot = band.querySelector<HTMLElement>(".solutions-plate-shot");
          const note = band.querySelector<HTMLElement>(".solutions-note");
          if (!shot || !note) return;

          const tl = gsap.timeline({
            scrollTrigger: { trigger: shot, start: "top 85%", once: true },
          });
          tl.fromTo(
            shot,
            { clipPath: "inset(0% 0% 100% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power2.out" },
          );
          tl.fromTo(
            note,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
            0.35,
          );

          const image = shot.querySelector<HTMLElement>("img");
          if (!image) return;
          gsap.fromTo(
            image,
            { scale: 1.06 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: shot,
                start: "top bottom",
                end: "bottom center",
                scrub: true,
              },
            },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <SectionGrid
      ref={sectionRef}
      id="products"
      aria-labelledby="featured-heading"
      rows={14}
      tone="page"
      outerV={false}
      className="home-phone relative z-10 flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)] scroll-mt-16 xl:scroll-mt-0"
    >
      {/* Intro */}
      <div className="featured-intro min-h-rows-3">
        <div className="featured-title">
          <p data-featured-copy className="eyebrow">
            {FEATURED.eyebrow}
          </p>
          <H2Heading id="featured-heading" className="text-left">
            {FEATURED.heading[0]}{" "}
            <span className="ab-statement-muted">{FEATURED.heading[1]}</span>
          </H2Heading>
        </div>
        <Copy data-featured-copy variant="lede" className="featured-lede">
          {FEATURED.lede}
        </Copy>
        <GridLine axis="v" unstyled tone="page" className="v-g1-0 hero-v-above-plus md:hidden" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 hero-v-above-plus md:hidden" />
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-bottom md:hidden" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-0 solutions-v hidden md:block" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-8 solutions-v hidden md:block" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 solutions-v hidden md:block" />
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-mid solutions-h hidden md:block" />
        <GridLine axis="h" unstyled tone="page" className="h-seg-6-8 solutions-h hidden md:block" />
        <GridLine axis="h" unstyled tone="page" className="h-seg-8-12 solutions-h hidden md:block" />
        <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 solutions-h hidden md:block" />
        <PlusMark tone="page" arms={joinTeeDown} className="v-g1-6 solutions-h hidden md:block" />
        <PlusMark tone="page" arms={joinTeeUp} className="v-g1-8 solutions-h hidden md:block" />
        <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 solutions-h hidden md:block" />
      </div>

      <SolutionsSection />
    </SectionGrid>
  );
}
