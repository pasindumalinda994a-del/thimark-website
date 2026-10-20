"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import BrandButton from "@/app/(frontend)/components/BrandButton";
import Copy from "@/app/(frontend)/components/Copy";
import H1Heading from "@/app/(frontend)/components/H1Heading";
import HeroProvenance from "@/app/(frontend)/components/HeroProvenance";
import HeroReel from "@/app/(frontend)/components/HeroReel";
import PlusMark, { type PlusArms } from "@/app/(frontend)/components/PlusMark";
import SectionGrid, { GridLine } from "@/app/(frontend)/components/SectionGrid";
import { HERO } from "@/app/(frontend)/homesections/home";

gsap.registerPlugin(useGSAP);

const joinLeftEdge: PlusArms = { up: true, down: true, left: false, right: true };
const joinRightEdge: PlusArms = { up: true, down: true, left: true, right: false };
const joinTeeDown: PlusArms = { up: false, down: true, left: true, right: true };

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const items = gsap.utils.toArray<HTMLElement>("[data-hero-item]", root);
      const rules = gsap.utils.toArray<HTMLElement>("[data-hero-rule]", root);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(items, { autoAlpha: 0, y: 12 });
        gsap.set(rules, {
          scaleX: 0,
          yPercent: -50,
          transformOrigin: "left center",
        });

        const tl = gsap.timeline({ paused: true });
        tl.to(rules, {
          scaleX: 1,
          duration: 0.8,
          ease: "power3.inOut",
          stagger: 0.06,
        });
        tl.to(
          items,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.1,
          },
          0.2,
        );

        if (document.documentElement.dataset.preloaded === "true") {
          tl.play();
          return () => tl.kill();
        }

        const onReady = () => tl.play();
        window.addEventListener("thimark:preload-done", onReady);
        return () => {
          window.removeEventListener("thimark:preload-done", onReady);
          tl.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <SectionGrid
      ref={sectionRef}
      id="hero"
      aria-labelledby="hero-heading"
      rows={14}
      tone="light"
      outerV={false}
      className="flex flex-col text-white max-md:h-svh max-md:overflow-hidden"
    >
      <div className="hero-stage relative min-h-0 flex-1 md:contents">
        <HeroReel />
        <GridLine axis="v" unstyled tone="light" className="v-g1-0 hero-v-above-plus md:hidden" />
        <GridLine axis="v" unstyled tone="light" className="v-g1-12 hero-v-above-plus md:hidden" />
        <GridLine axis="h" unstyled tone="light" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="light" arms={joinLeftEdge} className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="light" arms={joinRightEdge} className="v-g1-12 at-bottom md:hidden" />
      </div>
      <div className="hero-copy-scrim" aria-hidden />

      {/* Mobile rails are split per band so each plus keeps a 4px gap. */}

      {/* Desktop rails */}
      <GridLine axis="v" unstyled tone="light" className="v-g1-0 v-seg-top-br5 hidden md:block" />
      <GridLine axis="v" unstyled tone="light" className="v-g1-0 v-seg-br5-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="light" className="v-g1-0 v-seg-br2-end hidden md:block" />
      <GridLine axis="v" unstyled tone="light" className="v-g1-12 v-seg-top-br5 hidden md:block" />
      <GridLine axis="v" unstyled tone="light" className="v-g1-12 v-seg-br5-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="light" className="v-g1-12 v-seg-br2-end hidden md:block" />
      <GridLine axis="v" unstyled tone="light" className="v-g1-9 v-seg-br5-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="light" className="v-g1-9 v-seg-br2-end hidden md:block" />
      <GridLine axis="v" unstyled tone="light" className="v-g1-6 v-seg-br2-end hidden md:block" />

      {/* Copy band top (row 9) */}
      <GridLine
        axis="h"
        unstyled
        tone="light"
        data-hero-rule
        className="h-seg-0-9g at-br-5 hidden md:block"
      />
      <GridLine
        axis="h"
        unstyled
        tone="light"
        data-hero-rule
        className="h-seg-9g-12 at-br-5 hidden md:block"
      />
      <PlusMark tone="light" arms={joinLeftEdge} className="v-g1-0 at-br-5 hidden md:block" />
      <PlusMark tone="light" arms={joinTeeDown} className="v-g1-9 at-br-5 hidden md:block" />
      <PlusMark tone="light" arms={joinRightEdge} className="v-g1-12 at-br-5 hidden md:block" />

      {/* Action band top (row 12) */}
      <GridLine
        axis="h"
        unstyled
        tone="light"
        data-hero-rule
        className="h-seg-0-mid at-br-2 hidden md:block"
      />
      <GridLine
        axis="h"
        unstyled
        tone="light"
        data-hero-rule
        className="h-seg-6-9 at-br-2 hidden md:block"
      />
      <GridLine
        axis="h"
        unstyled
        tone="light"
        data-hero-rule
        className="h-seg-9g-12 at-br-2 hidden md:block"
      />
      <PlusMark tone="light" arms={joinLeftEdge} className="v-g1-0 at-br-2 hidden md:block" />
      <PlusMark tone="light" arms={joinTeeDown} className="v-g1-6 at-br-2 hidden md:block" />
      <PlusMark tone="light" className="v-g1-9 at-br-2 hidden md:block" />
      <PlusMark tone="light" arms={joinRightEdge} className="v-g1-12 at-br-2 hidden md:block" />

      <div className="hero-title">
        <GridLine axis="v" unstyled tone="light" className="v-g1-0 hero-v-below-plus md:hidden" />
        <GridLine axis="v" unstyled tone="light" className="v-g1-12 hero-v-below-plus md:hidden" />
        <p data-hero-item className="eyebrow">
          {HERO.eyebrow[0]} <span aria-hidden>·</span> {HERO.eyebrow[1]}{" "}
          <span aria-hidden>·</span> {HERO.eyebrow[2]}
        </p>
        <H1Heading id="hero-heading" waitForPreload className="hero-heading">
          {HERO.heading[0]}{" "}
          <span className="ab-statement-muted">{HERO.heading[1]}</span>
        </H1Heading>
      </div>

      <div className="hero-lede">
        <GridLine axis="v" unstyled tone="light" className="v-g1-0 hero-v-above-plus md:hidden" />
        <GridLine axis="v" unstyled tone="light" className="v-g1-12 hero-v-above-plus md:hidden" />
        <Copy data-hero-item variant="lede" className="hero-body">
          {HERO.lede}
        </Copy>
        <GridLine axis="h" unstyled tone="light" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="light" arms={joinLeftEdge} className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="light" arms={joinRightEdge} className="v-g1-12 at-bottom md:hidden" />
      </div>

      <div className="hero-stamp">
        <GridLine axis="v" unstyled tone="light" className="v-g1-0 hero-v-between-pluses md:hidden" />
        <GridLine axis="v" unstyled tone="light" className="v-g1-12 hero-v-between-pluses md:hidden" />
        <div data-hero-item>
          <HeroProvenance />
        </div>
        <GridLine axis="h" unstyled tone="light" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="light" arms={joinLeftEdge} className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="light" arms={joinRightEdge} className="v-g1-12 at-bottom md:hidden" />
      </div>

      <div className="hero-ctas">
        <GridLine axis="v" unstyled tone="light" className="v-g1-0 hero-v-below-plus md:hidden" />
        <GridLine axis="v" unstyled tone="light" className="v-g1-12 hero-v-below-plus md:hidden" />
        <BrandButton
          href={HERO.primaryCta.href}
          aria-label={HERO.primaryCta.ariaLabel}
          font="sans"
          data-hero-item
          className="hero-cta-primary w-full md:w-auto"
        >
          {HERO.primaryCta.label}
        </BrandButton>
        <BrandButton
          href={HERO.secondaryCta.href}
          direction="down"
          tone="outline"
          data-hero-item
          className="hero-cta-secondary w-full md:w-auto"
        >
          {HERO.secondaryCta.label}
        </BrandButton>
      </div>
    </SectionGrid>
  );
}
