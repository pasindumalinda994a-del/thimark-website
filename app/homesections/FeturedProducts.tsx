"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BrandButton from "@/app/components/BrandButton";
import { setScrollHintHidden } from "@/app/components/ScrollHint";
import MaskRevealHeading from "@/app/components/MaskRevealHeading";
import PlusMark from "@/app/components/PlusMark";
import SectionGrid, { GridLine } from "@/app/components/SectionGrid";
import SolutionsSection from "@/app/homesections/SolutionsSection";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PIN_VIEWPORTS = 4;
const CARD_COUNT = 3;

function barStartY(bar: HTMLElement) {
  const current = Number(gsap.getProperty(bar, "y")) || 0;
  const card = bar.closest(".solutions-card");
  if (!(card instanceof HTMLElement)) return 0;
  const barRect = bar.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();
  const naturalTop = barRect.top - current;
  return Math.max(cardRect.bottom - barRect.height - naturalTop, 0);
}

function scrubSolutions(root: HTMLElement) {
  const midTops = gsap.utils.toArray<HTMLElement>('[data-mid-line="top"]', root);
  const midBases = gsap.utils.toArray<HTMLElement>(
    '[data-mid-line="base"]',
    root,
  );
  const pick = (name: string, i: number) =>
    root.querySelector<HTMLElement>(`[data-card-${name}="${i}"]`);

  const bars = Array.from({ length: CARD_COUNT }, (_, i) => pick("bar", i));
  const images = Array.from({ length: CARD_COUNT }, (_, i) => pick("image", i));
  const lanes = Array.from({ length: CARD_COUNT }, (_, i) => pick("lane", i));
  const bases = Array.from({ length: CARD_COUNT }, (_, i) => pick("base", i));
  const titles = Array.from({ length: CARD_COUNT }, (_, i) => pick("title", i));
  const bodies = Array.from({ length: CARD_COUNT }, (_, i) => pick("body", i));
  const ctas = Array.from({ length: CARD_COUNT }, (_, i) => pick("cta", i));
  const midHorizontals = [...lanes, ...bases].filter(
    (el): el is HTMLElement => Boolean(el),
  );

  gsap.set(midTops, { clipPath: "inset(0% 0% 100% 0%)" });
  gsap.set(midBases, { clipPath: "inset(0% 0% 100% 0%)" });
  gsap.set(midHorizontals, {
    scaleX: 0,
    yPercent: -50,
    transformOrigin: "left center",
  });
  gsap.set(titles, { autoAlpha: 0 });
  gsap.set(bodies, { autoAlpha: 0 });
  gsap.set(ctas, { autoAlpha: 0 });
  gsap.set(images, { clipPath: "inset(0% 0% 100% 0%)" });
  bars.forEach((bar) => {
    if (bar) gsap.set(bar, { y: barStartY(bar) });
  });

  const revealTls: (gsap.core.Timeline | undefined)[] = [];

  const syncReveals = () => {
    bars.forEach((bar, i) => {
      const reveal = revealTls[i];
      if (!bar || !reveal) return;
      const y = Math.abs(Number(gsap.getProperty(bar, "y")) || 0);
      if (y <= 1) reveal.play();
      else reveal.reverse();
    });
  };

  // Driven from the timeline, not the ScrollTrigger: with scrub the playhead
  // keeps moving after the last scroll event, so bars land between updates.
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    onUpdate: syncReveals,
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: () => `+=${PIN_VIEWPORTS * window.innerHeight}`,
      pin: true,
      pinType: "transform",
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => setScrollHintHidden(root, self.progress),
    },
  });

  tl.to(midTops, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.4 }, 0);
  tl.to(midBases, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.4 });

  bars.forEach((bar, i) => {
    const image = images[i];
    const title = titles[i];
    const body = bodies[i];
    const cta = ctas[i];
    if (!bar || !image || !title || !body || !cta) return;

    const revealTl = gsap.timeline({ paused: true });
    const boxLines = [lanes[i], bases[i]].filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (boxLines.length) {
      revealTl.to(
        boxLines,
        { scaleX: 1, duration: 0.45, ease: "power2.out" },
        0,
      );
    }
    revealTl.fromTo(
      image,
      { clipPath: "inset(0% 0% 100% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power2.out" },
      0,
    );
    revealTl.to(
      title,
      { autoAlpha: 1, duration: 0.35, ease: "power2.out" },
      "<0.15",
    );
    revealTl.to(
      body,
      { autoAlpha: 1, duration: 0.35, ease: "power2.out" },
      "<0.12",
    );
    revealTl.to(cta, { autoAlpha: 1, duration: 0.3, ease: "power2.out" }, "<0.1");
    revealTls[i] = revealTl;

    tl.fromTo(
      bar,
      { y: () => barStartY(bar) },
      { y: 0, duration: 0.4, immediateRender: false },
      i === 0 ? 0 : ">",
    );
  });

  tl.to({ n: 0 }, { n: 1, duration: 0.8 });
}

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

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          scrubSolutions(root);
        },
      );

      mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          const cards = gsap.utils.toArray<HTMLElement>(".solutions-card", root);
          cards.forEach((card) => {
            const media = card.querySelector<HTMLElement>("[data-card-image]");
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: card,
                start: "top 82%",
                toggleActions: "play none none reverse",
              },
            });
            tl.fromTo(
              card,
              { autoAlpha: 0, y: 12 },
              { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
            );
            if (media) {
              tl.fromTo(
                media,
                { clipPath: "inset(0% 0% 100% 0%)" },
                {
                  clipPath: "inset(0% 0% 0% 0%)",
                  duration: 0.7,
                  ease: "power2.out",
                },
                0.12,
              );
            }
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
      id="products"
      aria-labelledby="featured-heading"
      rows={14}
      tone="page"
      outerV={false}
      className="relative z-10 flex flex-col bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)] scroll-mt-16 md:scroll-mt-0"
    >
      {/* Mobile rails */}
      <GridLine axis="v" tone="page" className="v-g1-0 md:hidden" />
      <GridLine axis="v" tone="page" className="v-g1-12 md:hidden" />

      {/* Intro */}
      <div className="featured-intro min-h-rows-3">
        <div className="featured-title">
          <p data-featured-copy className="eyebrow">
            Engineered for the Real World
          </p>
          <MaskRevealHeading
            id="featured-heading"
            className="font-heading text-[clamp(28px,3.4vw,48px)] leading-none font-medium text-left uppercase"
          >
            When the Challenge Is Complex,
            <span className="block">Engineering Has to Be Smarter.</span>
          </MaskRevealHeading>
        </div>
        <p
          data-featured-copy
          className="featured-lede font-heading text-[16px] leading-none font-medium text-left uppercase md:text-justify md:[text-align-last:left]"
        >
          Our solutions are developed around the application, the environment
          and the challenge — combining practical engineering with precision
          manufacturing and automation.
        </p>
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-12 at-bottom md:hidden" />
      </div>

      <SolutionsSection />

      {/* Foot */}
      <div className="solutions-foot min-h-rows-2">
        <div className="solutions-readout index-tag">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>03 Solutions</span>
            <span aria-hidden>·</span>
            <span>Kilgharrah 600</span>
            <span aria-hidden>·</span>
            <span>OEM</span>
            <span aria-hidden>·</span>
            <span>Machinery</span>
          </p>
          <p className="hidden font-normal md:block">
            Engineered around the application, the environment and the
            challenge.
          </p>
        </div>
        <BrandButton tone="steel" href="/#catalogue" className="featured-cta">
          View All Products
        </BrandButton>
      </div>
    </SectionGrid>
  );
}
