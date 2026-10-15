"use client";

import Copy from "@/app/(frontend)/components/Copy";
import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BrandButton from "@/app/(frontend)/components/BrandButton";
import H2Heading from "@/app/(frontend)/components/H2Heading";
import H3Heading from "@/app/(frontend)/components/H3Heading";
import PlusMark, { type PlusArms } from "@/app/(frontend)/components/PlusMark";
import SectionGrid, { GridLine } from "@/app/(frontend)/components/SectionGrid";
import { HOME_FIG, figLabel } from "@/app/(frontend)/components/FigMark";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const joinLeftEdge: PlusArms = { up: true, down: true, left: false, right: true };
const joinRightEdge: PlusArms = { up: true, down: true, left: true, right: false };
const joinTeeDown: PlusArms = { up: false, down: true, left: true, right: true };
const joinTeeUp: PlusArms = { up: true, down: false, left: true, right: true };
const joinStubDown: PlusArms = { up: false, down: true, left: false, right: false };
const joinStubUp: PlusArms = { up: true, down: false, left: false, right: false };

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
    body: "Controlled processes and attention to detail throughout manufacturing.",
  },
  {
    id: "lean",
    title: "Lean Thinking",
    image: "/home-images/quality-lean-production.jpeg",
    alt: "Operators working a lean production line with organized workstations",
    objectPosition: "38% 42%",
    body: "Improving efficiency, productivity and resource utilization while reducing unnecessary waste.",
  },
  {
    id: "improvement",
    title: "Continuous Improvement",
    image: "/home-images/quality-continuous-improvement.jpeg",
    alt: "Engineers reviewing a manufactured housing against production drawings",
    objectPosition: "48% 38%",
    body: "Learning, refining processes and adopting technologies that strengthen performance.",
  },
] as const;

const CREDS = [
  {
    id: "iso",
    org: "ISO",
    code: "9001:2015",
    sub: "Certified Quality Management System",
  },
  {
    id: "cida",
    org: "CIDA",
    code: "EM2",
    sub: "Heavy Steel Fabrication Grade",
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

      const conditions = {
        motion: "(prefers-reduced-motion: no-preference)",
        phone: "(max-width: 767px)",
      };

      mm.add(conditions, (ctx) => {
        const { motion, phone } = ctx.conditions ?? {};
        if (!motion) return;
        // Phones reveal once; the bar's dividers run across the stacked rows.
        const toggleActions = phone ? "play none none none" : "play none none reverse";
        const railAxis = phone ? "scaleX" : "scaleY";

        gsap.set(header, { autoAlpha: 0, y: 10 });
        if (bar) gsap.set(bar, { clipPath: "inset(0% 100% 0% 0%)" });
        gsap.set(phrases, { autoAlpha: 0, x: -8 });
        gsap.set(rails, {
          [railAxis]: 0,
          transformOrigin: phone ? "left center" : "center top",
        });
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
            start: phone ? "top 80%" : "top 70%",
            toggleActions,
          },
        });

        if (bar) {
          const barTl = gsap.timeline({
            scrollTrigger: {
              trigger: bar,
              start: "top 82%",
              toggleActions,
            },
          });
          barTl.to(bar, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.9,
            ease: "power3.inOut",
          });
          barTl.to(
            rails,
            { [railAxis]: 1, duration: 0.4, ease: "power2.out", stagger: 0.12 },
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

        if (phone) {
          // Stacked pillars each reveal as they arrive.
          pillars.forEach((pillar) => {
            gsap.to(pillar, {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: { trigger: pillar, start: "top 85%", once: true },
            });
          });
        } else {
          gsap.to(pillars, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: pillars[0] ?? root,
              start: "top 80%",
              toggleActions,
            },
          });
        }

        const credTl = gsap.timeline({
          scrollTrigger: {
            trigger: creds[0] ?? root,
            start: phone ? "top 92%" : "top 98%",
            toggleActions,
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
      className="home-phone flex flex-col bg-steel text-cream [--page-bg:var(--steel)] [--page-ink:var(--cream)] scroll-mt-16 xl:scroll-mt-0"
    >
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
      <GridLine axis="h" unstyled tone="page" className="h-seg-3-4 top-rows-6 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-4-8 top-rows-6 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-8-9 top-rows-6 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-9g-12 top-rows-6 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 top-rows-6 hidden md:block" />
      <PlusMark tone="page" arms={joinTeeUp} className="v-g1-3 top-rows-6 hidden md:block" />
      <PlusMark tone="page" arms={joinTeeDown} className="v-g1-4 top-rows-6 hidden md:block" />
      <PlusMark tone="page" arms={joinTeeDown} className="v-g1-8 top-rows-6 hidden md:block" />
      <PlusMark tone="page" arms={joinTeeUp} className="v-g1-9 top-rows-6 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 top-rows-6 hidden md:block" />

      {/* Row 8 */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-4 top-rows-8 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-4-8 top-rows-8 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-8-12 top-rows-8 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 top-rows-8 hidden md:block" />
      <PlusMark tone="page" className="v-g1-4 top-rows-8 hidden md:block" />
      <PlusMark tone="page" className="v-g1-8 top-rows-8 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 top-rows-8 hidden md:block" />

      {/* Row 14 */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-4 at-br-2 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-4-8 at-br-2 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-8-12 at-br-2 hidden md:block" />
      <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 at-br-2 hidden md:block" />
      <PlusMark tone="page" arms={joinTeeUp} className="v-g1-4 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-8 at-br-2 hidden md:block" />
      <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-br-2 hidden md:block" />

      {/* Flank textures */}
      {(["l", "r"] as const).map((side) => (
        <div key={side} className={`quality-flank quality-flank-${side} dot-field-mark`} aria-hidden>
          <PlusMark tone="page" className="plus-at-tl" />
          <PlusMark tone="page" className="plus-at-tr" />
          <PlusMark tone="page" className="plus-at-bl" />
          <PlusMark tone="page" className="plus-at-br" />
        </div>
      ))}

      {/* Header */}
      <div className="relative md:contents">
        <GridLine axis="v" unstyled tone="page" className="v-g1-0 hero-v-above-plus md:hidden" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 hero-v-above-plus md:hidden" />
        <div className="quality-center min-h-rows-6">
          <p data-q-header className="eyebrow">
            Quality by Design
          </p>
          <H2Heading id="quality-heading">
            Precision Is Not a Promise.{" "}
            <span className="ab-statement-muted">It&rsquo;s a Process.</span>
          </H2Heading>
          <div data-q-header className="quality-copy">
            <Copy variant="lede">
              At Thimark, quality is embedded into the way we engineer and
              manufacture.
            </Copy>
            <Copy variant="lede" weight="normal">
              Our ISO 9001:2015 certification and CIDA EM2 Grade in Heavy Steel
              Fabrication reflect our commitment to professional standards,
              controlled production and consistent results.
            </Copy>
            <Copy variant="lede" weight="normal">
              Our quality approach includes material verification, in-process
              controls, testing and final inspection, supported by structured
              problem-solving and continuous improvement.
            </Copy>
            <Copy variant="caption" weight="medium" className="pt-2 tracking-[0.12em]">
              Our approach is guided by a simple principle:
            </Copy>
          </div>
        </div>
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-bottom md:hidden" />
      </div>

      {/* Principle bar */}
      <div className="relative md:contents">
        <GridLine axis="v" unstyled tone="page" className="v-g1-0 hero-v-between-pluses md:hidden" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 hero-v-between-pluses md:hidden" />
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
              <Copy data-q-phrase variant="lead">
                <span aria-hidden className="mr-3 text-[12px] font-medium tracking-[0.12em] align-middle">
                  {padIndex(i)}
                </span>
                {phrase}
              </Copy>
            </div>
          ))}
        </div>
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-bottom md:hidden" />
      </div>

      {/* Pillars through CTA — one rail from the bar plus to the section foot */}
      <div className="relative flex flex-col md:contents">
        <GridLine axis="v" unstyled tone="page" className="v-g1-0 hero-v-below-plus md:hidden" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 hero-v-below-plus md:hidden" />
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
              <span>{figLabel(HOME_FIG.quality + i)}</span>
              <span aria-hidden>[{padIndex(i)}]</span>
            </p>
            <div className="quality-pillar-figure md:contents">
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
            </div>
            <div className="quality-pillar-copy">
              <H3Heading variant="title">{pillar.title}</H3Heading>
              <Copy variant="caption" className="md:text-justify md:[text-align-last:left]">
                {pillar.body}
              </Copy>
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
                arms={joinStubDown}
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
                arms={joinStubUp}
                data-q-cred-join=""
                className="top-full left-0"
              />
            </span>
            <div data-q-stamp="" className="quality-cred-body">
              <p className="quality-cred-org">{cred.org}</p>
              <div className="quality-cred-copy">
                <Copy variant="lead" className="quality-cred-code tabular-nums tracking-[0.06em]">{cred.code}</Copy>
                <p className="quality-cred-sub">{cred.sub}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <BrandButton href="/about#quality" className="quality-cta">
        Our Approach to Quality
      </BrandButton>
      </div>
    </SectionGrid>
  );
}
