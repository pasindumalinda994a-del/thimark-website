"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import BrandButton from "@/app/components/BrandButton";
import MaskRevealHeading from "@/app/components/MaskRevealHeading";
import HeroProvenance from "@/app/components/HeroProvenance";
import HeroReel from "@/app/components/HeroReel";
import PlusMark from "@/app/components/PlusMark";
import SectionGrid, { GridLine } from "@/app/components/SectionGrid";

gsap.registerPlugin(useGSAP);

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
      className="flex flex-col text-white"
    >
      <HeroReel />
      <div className="hero-copy-scrim" aria-hidden />

      {/* Mobile rails */}
      <GridLine axis="v" tone="light" className="v-g1-0 md:hidden" />
      <GridLine axis="v" tone="light" className="v-g1-12 md:hidden" />

      {/* Desktop rails */}
      <GridLine axis="v" unstyled tone="light" className="v-g1-0 v-seg-top-br5 hidden md:block" />
      <GridLine axis="v" unstyled tone="light" className="v-g1-0 v-seg-br5-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="light" className="v-g1-0 v-seg-br2-end hidden md:block" />
      <GridLine axis="v" unstyled tone="light" className="v-g1-12 v-seg-top-br5 hidden md:block" />
      <GridLine axis="v" unstyled tone="light" className="v-g1-12 v-seg-br5-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="light" className="v-g1-12 v-seg-br2-end hidden md:block" />
      <GridLine axis="v" unstyled tone="light" className="v-g1-9 v-seg-top-br5 hidden md:block" />
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
      <PlusMark tone="light" className="v-g1-0 at-br-5 hidden md:block" />
      <PlusMark tone="light" className="v-g1-9 at-br-5 hidden md:block" />
      <PlusMark tone="light" className="v-g1-12 at-br-5 hidden md:block" />

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
      <PlusMark tone="light" className="v-g1-0 at-br-2 hidden md:block" />
      <PlusMark tone="light" className="v-g1-6 at-br-2 hidden md:block" />
      <PlusMark tone="light" className="v-g1-9 at-br-2 hidden md:block" />
      <PlusMark tone="light" className="v-g1-12 at-br-2 hidden md:block" />

      {/* Mobile reel band */}
      <div className="relative h-rows-7 shrink-0 md:hidden" aria-hidden>
        <GridLine axis="h" unstyled tone="light" className="h-seg-0-12 at-bottom" />
        <PlusMark tone="light" className="v-g1-0 at-bottom" />
        <PlusMark tone="light" className="v-g1-12 at-bottom" />
      </div>

      <div className="hero-title">
        <p data-hero-item className="eyebrow">
          Engineering <span aria-hidden>·</span> Manufacturing{" "}
          <span aria-hidden>·</span> Innovation
        </p>
        <MaskRevealHeading
          as="h1"
          id="hero-heading"
          waitForPreload
          className="hero-heading font-heading text-[clamp(40px,5.2vw,64px)] leading-[0.89] font-medium tracking-[-0.01em] uppercase"
        >
          Engineering What Moves Industry Forward.
        </MaskRevealHeading>
      </div>

      <div className="hero-lede">
        <p
          data-hero-item
          className="hero-body font-heading text-[16px] leading-none font-medium uppercase"
        >
          From precision-engineered motorcycle components to custom industrial
          machinery, Thimark combines engineering expertise, advanced
          manufacturing and local capability to create solutions built for the
          real world.
        </p>
        <GridLine axis="h" unstyled tone="light" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="light" className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="light" className="v-g1-12 at-bottom md:hidden" />
      </div>

      <div className="hero-stamp">
        <div data-hero-item>
          <HeroProvenance />
        </div>
        <GridLine axis="h" unstyled tone="light" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="light" className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="light" className="v-g1-12 at-bottom md:hidden" />
      </div>

      <div className="hero-ctas">
        <BrandButton
          href="/#contact"
          font="sans"
          data-hero-item
          className="hero-cta-primary w-full md:w-auto"
        >
          Request a Quote
        </BrandButton>
        <BrandButton
          href="/#manufacturing"
          tone="outline"
          data-hero-item
          className="hero-cta-secondary w-full md:w-auto"
        >
          Explore Our Capabilities
        </BrandButton>
      </div>
    </SectionGrid>
  );
}
