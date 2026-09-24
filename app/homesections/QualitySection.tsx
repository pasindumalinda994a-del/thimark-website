"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BrandButton from "@/app/components/BrandButton";
import MaskRevealHeading from "@/app/components/MaskRevealHeading";
import PlusMark from "@/app/components/PlusMark";
import SectionGrid, { GridLine } from "@/app/components/SectionGrid";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PRINCIPLES = [
  "Reduce waste.",
  "Improve processes.",
  "Create consistent value.",
] as const;

const PILLARS = [
  {
    id: "quality",
    title: "Quality",
    image: "/home-images/quality-inspection.jpeg",
    alt: "Engineer inspecting a machined metal component with a digital caliper",
    objectPosition: "62% 35%",
    body: "Controlled processes and attention to detail at every stage of manufacturing.",
  },
  {
    id: "lean",
    title: "Lean Thinking",
    image: "/home-images/quality-lean-production.jpeg",
    alt: "Operators working a lean production line with organized workstations",
    objectPosition: "38% 42%",
    body: "Continuous improvement focused on efficiency, productivity and reducing unnecessary waste.",
  },
  {
    id: "improvement",
    title: "Continuous Improvement",
    image: "/home-images/quality-continuous-improvement.jpeg",
    alt: "Engineers reviewing a manufactured housing against production drawings",
    objectPosition: "48% 38%",
    body: "A culture of learning, process improvement and the adoption of emerging technologies.",
  },
] as const;

const CREDS = [
  {
    id: "iso",
    org: "ISO",
    code: "9001:2015",
    sub: "Certified Quality Management",
  },
  {
    id: "cida",
    org: "CIDA",
    code: "EM2",
    sub: "Heavy Steel Fabrication",
  },
] as const;

function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

export default function QualitySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const header = gsap.utils.toArray<HTMLElement>("[data-q-header]", root);
      const bar = root.querySelector<HTMLElement>("[data-q-bar]");
      const phrases = gsap.utils.toArray<HTMLElement>("[data-q-phrase]", root);
      const rails = gsap.utils.toArray<HTMLElement>("[data-q-rail]", root);
      const pillars = gsap.utils.toArray<HTMLElement>("[data-q-pillar]", root);
      const creds = gsap.utils.toArray<HTMLElement>("[data-q-stamp]", root);
      const credRails = gsap.utils.toArray<HTMLElement>(
        "[data-q-cred-rail]",
        root,
      );
      const credJoins = gsap.utils.toArray<HTMLElement>(
        "[data-q-cred-join]",
        root,
      );

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(header, { autoAlpha: 0, y: 10 });
        if (bar) gsap.set(bar, { clipPath: "inset(0% 100% 0% 0%)" });
        gsap.set(phrases, { autoAlpha: 0, x: -8 });
        gsap.set(rails, { scaleY: 0, transformOrigin: "center top" });
        gsap.set(pillars, { autoAlpha: 0, y: 12 });
        gsap.set(creds, { autoAlpha: 0, x: -8 });
        gsap.set(credRails, { scaleY: 0, transformOrigin: "center top" });
        gsap.set(credJoins, { autoAlpha: 0 });

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

        if (bar) {
          const barTl = gsap.timeline({
            scrollTrigger: {
              trigger: bar,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          });
          barTl.to(bar, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.9,
            ease: "power3.inOut",
          });
          barTl.to(
            rails,
            { scaleY: 1, duration: 0.4, ease: "power2.out", stagger: 0.12 },
            0.35,
          );
          barTl.to(
            phrases,
            {
              autoAlpha: 1,
              x: 0,
              duration: 0.45,
              ease: "power2.out",
              stagger: 0.16,
            },
            0.3,
          );
        }

        gsap.to(pillars, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: pillars[0] ?? root,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        const credTl = gsap.timeline({
          scrollTrigger: {
            trigger: creds[0] ?? root,
            start: "top 98%",
            toggleActions: "play none none reverse",
          },
        });
        credTl.to(credRails, {
          scaleY: 1,
          duration: 0.45,
          ease: "power2.out",
          stagger: 0.14,
        });
        credTl.to(
          credJoins,
          {
            autoAlpha: 1,
            duration: 0.3,
            ease: "power2.out",
            stagger: 0.07,
          },
          0.12,
        );
        credTl.to(
          creds,
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.14,
          },
          0.12,
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <SectionGrid
      ref={sectionRef}
      id="quality"
      aria-labelledby="quality-heading"
      rows={16}
      tone="page"
      outerV={false}
      className="flex flex-col bg-steel text-cream [--page-bg:var(--steel)] [--page-ink:var(--cream)] scroll-mt-16 md:scroll-mt-0"
    >
      {/* Mobile rails */}
      <GridLine axis="v" tone="page" className="v-g1-0 md:hidden" />
      <GridLine axis="v" tone="page" className="v-g1-12 md:hidden" />

      {/* Desktop rails */}
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-top-6 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-6-8 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-8-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-br2-end hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-top-6 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-6-8 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-8-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-br2-end hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-3 v-seg-top-6 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-9 v-seg-top-6 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-4 v-seg-8-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-8 v-seg-8-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-8 v-seg-br2-end hidden md:block" />

      {/* Row 6 */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-3 top-rows-6 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-3-9 top-rows-6 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-9g-12 top-rows-6 hidden md:block" />
      <PlusMark tone="page" className="v-g1-0 top-rows-6 hidden md:block" />
      <PlusMark tone="page" className="v-g1-3 top-rows-6 hidden md:block" />
      <PlusMark tone="page" className="v-g1-9 top-rows-6 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 top-rows-6 hidden md:block" />

      {/* Row 8 */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-4 top-rows-8 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-4-8 top-rows-8 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-8-12 top-rows-8 hidden md:block" />
      <PlusMark tone="page" className="v-g1-0 top-rows-8 hidden md:block" />
      <PlusMark tone="page" className="v-g1-4 top-rows-8 hidden md:block" />
      <PlusMark tone="page" className="v-g1-8 top-rows-8 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 top-rows-8 hidden md:block" />

      {/* Row 14 */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-8 at-br-2 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-8-12 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-0 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-8 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 at-br-2 hidden md:block" />

      {/* Flank textures */}
      <div className="quality-flank quality-flank-l dot-field" aria-hidden />
      <div className="quality-flank quality-flank-r dot-field" aria-hidden />

      {/* Header */}
      <div className="relative md:contents">
        <div className="quality-center min-h-rows-6">
          <p data-q-header className="eyebrow">
            Quality by Design
          </p>
          <MaskRevealHeading
            id="quality-heading"
            className="max-w-[640px] font-heading text-[clamp(28px,3.4vw,48px)] leading-none font-medium uppercase"
          >
            Precision Is Not
            <span className="block">a Promise.</span>
            <span className="block">It&rsquo;s a Process.</span>
          </MaskRevealHeading>
          <div
            data-q-header
            className="quality-copy font-heading text-[16px] leading-none font-normal uppercase"
          >
            <p className="font-medium">
              At Thimark, quality is embedded into the way we engineer and
              manufacture.
            </p>
            <p>
              Our ISO 9001:2015 certification, CIDA EM2 accreditation and focus
              on continuous improvement reflect our commitment to professional
              standards, controlled production and consistent results.
            </p>
            <p className="pt-2 text-[12px] font-medium tracking-[0.12em]">
              Our approach is guided by a simple principle:
            </p>
          </div>
        </div>
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-12 at-bottom md:hidden" />
      </div>

      {/* Principle bar */}
      <div className="relative md:contents">
        <div data-q-bar className="quality-bar min-h-rows-2">
          {PRINCIPLES.map((phrase, i) => (
            <div key={phrase} className="quality-bar-cell">
              {i > 0 ? (
                <span
                  data-q-rail
                  className="quality-bar-rail"
                  aria-hidden
                >
                  <svg width="1" height="100%" className="h-full w-px">
                    <line
                      x1="0.5"
                      x2="0.5"
                      y1="0"
                      y2="100%"
                      stroke="#f4f4ed"
                      strokeWidth="1"
                      strokeDasharray="8 8"
                    />
                  </svg>
                </span>
              ) : null}
              <p
                data-q-phrase
                className="font-heading text-[clamp(20px,1.8vw,24px)] leading-none font-medium uppercase"
              >
                <span aria-hidden className="mr-3 text-[12px] font-medium tracking-[0.12em] align-middle">
                  {padIndex(i)}
                </span>
                {phrase}
              </p>
            </div>
          ))}
        </div>
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-12 at-bottom md:hidden" />
      </div>

      {/* Pillars */}
      <div className="quality-pillars min-h-rows-6">
        {PILLARS.map((pillar, i) => (
          <div key={pillar.id} data-q-pillar className="quality-pillar">
            {i > 0 ? (
              <GridLine
                axis="h"
                unstyled
                tone="page"
                className="h-seg-0-12 top-0 md:hidden"
              />
            ) : null}
            <p className="index-tag flex items-center justify-between">
              <span>Pillar</span>
              <span aria-hidden>[{padIndex(i)}]</span>
            </p>
            <div className="quality-pillar-media">
              <Image
                src={pillar.image}
                alt={pillar.alt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
                style={{ objectPosition: pillar.objectPosition }}
              />
            </div>
            <span aria-hidden className="quality-pillar-numeral">
              {padIndex(i)}
            </span>
            <div className="quality-pillar-copy">
              <h3 className="font-heading text-[24px] leading-none font-medium uppercase">
                {pillar.title}
              </h3>
              <p className="font-heading text-[12px] leading-none font-normal uppercase md:text-justify md:[text-align-last:left]">
                {pillar.body}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Trust statement */}
      <div className="quality-creds min-h-rows-2">
        {CREDS.map((cred) => (
          <article
            key={cred.id}
            className="quality-cred"
          >
            <span className="quality-cred-bracket" aria-hidden>
              <PlusMark
                tone="page"
                data-q-cred-join=""
                className="top-0 left-0"
              />
              <span data-q-cred-rail="" className="quality-cred-rail">
                <svg width="1" height="100%" className="h-full w-px">
                  <line
                    x1="0.5"
                    x2="0.5"
                    y1="0"
                    y2="100%"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="butt"
                    strokeDasharray="8 8"
                  />
                </svg>
              </span>
              <PlusMark
                tone="page"
                data-q-cred-join=""
                className="top-full left-0"
              />
            </span>
            <div data-q-stamp="" className="quality-cred-body">
              <p className="quality-cred-org">{cred.org}</p>
              <div className="quality-cred-copy">
                <p className="quality-cred-code">{cred.code}</p>
                <p className="quality-cred-sub">{cred.sub}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <BrandButton href="/#contact" className="quality-cta">
        Our Approach to Quality
      </BrandButton>
    </SectionGrid>
  );
}
