"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import BrandButton from "@/app/components/BrandButton";
import MaskRevealHeading from "@/app/components/MaskRevealHeading";
import MarkDrawing from "@/app/components/MarkDrawing";
import PlusMark from "@/app/components/PlusMark";
import SectionGrid, { GridLine } from "@/app/components/SectionGrid";

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin);

const CONTACT = [
  {
    id: "company",
    label: "Company",
    lines: ["Thimark Technocreations (Pvt) Ltd"],
  },
  {
    id: "address",
    label: "Address",
    lines: ["No. 379/D, Maharanugegoda,", "Kadawatha, Sri Lanka"],
  },
  {
    id: "phone",
    label: "Phone",
    lines: ["+94 112 051 944"],
    href: "tel:+94112051944",
  },
  {
    id: "email",
    label: "Email",
    lines: ["info@thimark.com"],
    href: "mailto:info@thimark.com",
    caseNormal: true,
  },
] as const;

export default function QuoteSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const copy = gsap.utils.toArray<HTMLElement>("[data-quote-copy]", root);
      const drawing = root.querySelector<SVGSVGElement>("[data-quote-drawing] svg");
      const ctas = gsap.utils.toArray<HTMLElement>(
        ".quote-cta-primary, .quote-cta-secondary",
        root,
      );
      const cells = gsap.utils.toArray<HTMLElement>("[data-quote-cell]", root);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(copy, { autoAlpha: 0, y: 12 });
        gsap.set(ctas, { autoAlpha: 0, y: 8 });
        gsap.set(cells, { autoAlpha: 0 });

        gsap.to(copy, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: root,
            start: "top 70%",
            toggleActions: "play none play reverse",
          },
        });

        if (drawing) {
          const draws = drawing.querySelectorAll("[data-mark-draw]");
          const labels = drawing.querySelectorAll("[data-mark-label]");
          const hatchEl = drawing.querySelector("[data-mark-hatch]");
          const field = drawing.querySelector("[data-mark-field]");
          const guides = drawing.querySelectorAll("[data-mark-guide]");
          const statics = drawing.querySelectorAll("[data-mark-static]");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: drawing,
              start: "top 75%",
              toggleActions: "play none play reverse",
            },
          });
          tl.fromTo(field, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 });
          tl.fromTo(
            statics,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.3, stagger: 0.02 },
            0.1,
          );
          tl.fromTo(
            draws,
            { drawSVG: "0%" },
            {
              drawSVG: "100%",
              duration: 1.1,
              ease: "power2.inOut",
              stagger: 0.05,
            },
            0.2,
          );
          if (hatchEl) {
            tl.fromTo(
              hatchEl,
              { clipPath: "inset(0% 0% 100% 0%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 0.7,
                ease: "power2.out",
              },
              0.9,
            );
          }
          tl.fromTo(
            labels,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.4, stagger: 0.06 },
            1.2,
          );

          // Slow idle drift on the construction guides.
          gsap.to(guides, {
            strokeDashoffset: -40,
            duration: 12,
            ease: "none",
            repeat: -1,
          });
        }

        gsap.to(ctas, {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ctas[0] ?? root,
            start: "top 92%",
            toggleActions: "play none play reverse",
          },
        });

        gsap.to(cells, {
          autoAlpha: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: cells[0] ?? root,
            start: "top 98%",
            toggleActions: "play none play reverse",
          },
        });
      });

      const frame = requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        cancelAnimationFrame(frame);
        mm.revert();
      };
    },
    { scope: sectionRef, dependencies: [pathname] },
  );

  return (
    <SectionGrid
      ref={sectionRef}
      id="contact"
      aria-labelledby="quote-heading"
      rows={14}
      tone="page"
      outerV={false}
      className="flex flex-col bg-steel text-cream [--page-bg:var(--steel)] [--page-ink:var(--cream)] scroll-mt-16 md:scroll-mt-0"
    >
      {/* Mobile rails */}
      <GridLine axis="v" tone="page" className="v-g1-0 md:hidden" />
      <GridLine axis="v" tone="page" className="v-g1-12 md:hidden" />

      {/* Desktop rails */}
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-top-br5 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-br5-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-br2-end hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-top-br5 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-br5-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-br2-end hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 v-seg-top-br5 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 v-seg-br5-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 v-seg-br2-end hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-9 v-seg-br5-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-9 v-seg-br2-end hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-3 v-seg-br2-end hidden md:block" />

      {/* Row 9 */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-mid at-br-5 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-6-9 at-br-5 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-9g-12 at-br-5 hidden md:block" />
      <PlusMark tone="page" className="v-g1-0 at-br-5 hidden md:block" />
      <PlusMark tone="page" className="v-g1-6 at-br-5 hidden md:block" />
      <PlusMark tone="page" className="v-g1-9 at-br-5 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 at-br-5 hidden md:block" />

      {/* Row 12 */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-3 at-br-2 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-3-6 at-br-2 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-6-9 at-br-2 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-9g-12 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-0 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-3 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-6 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-9 at-br-2 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 at-br-2 hidden md:block" />

      {/* Bottom edge */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-3 at-bottom hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-3-6 at-bottom hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-6-9 at-bottom hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-9g-12 at-bottom hidden md:block" />
      <PlusMark tone="page" className="v-g1-0 at-bottom" />
      <PlusMark tone="page" className="v-g1-3 at-bottom hidden md:block" />
      <PlusMark tone="page" className="v-g1-6 at-bottom hidden md:block" />
      <PlusMark tone="page" className="v-g1-9 at-bottom hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 at-bottom" />

      {/* Copy */}
      <div className="quote-copy">
        <div className="quote-title">
          <p data-quote-copy className="eyebrow">
            Have an Engineering Challenge?
          </p>
          <MaskRevealHeading
            id="quote-heading"
            className="font-heading text-[clamp(40px,5.2vw,64px)] leading-[0.89] font-medium tracking-[-0.01em] uppercase"
          >
            Let&rsquo;s Turn Your Requirement Into a Solution.
          </MaskRevealHeading>
        </div>
        <p
          data-quote-copy
          className="max-w-[560px] font-heading text-[16px] leading-none font-normal uppercase md:text-justify md:[text-align-last:left]"
        >
          Whether you need a reliable OEM manufacturing partner, precision
          components or a custom industrial machine, our engineering team is
          ready to understand your requirement and explore the right solution.
        </p>
      </div>

      {/* Technical drawing */}
      <div className="relative md:contents">
        <div data-quote-drawing className="quote-drawing">
          <MarkDrawing />
        </div>
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-0 at-bottom md:hidden" />
        <PlusMark tone="page" className="v-g1-12 at-bottom md:hidden" />
      </div>

      {/* Closing line */}
      <div className="quote-close">
        <p
          data-quote-copy
          className="font-heading text-[clamp(20px,1.8vw,24px)] leading-none font-medium uppercase"
        >
          Tell us what you need.
          <span className="block">We&rsquo;ll help engineer what comes next.</span>
        </p>
      </div>

      {/* CTAs */}
      <div className="quote-ctas">
        <BrandButton
          href="mailto:info@thimark.com?subject=Request%20a%20Quote"
          font="sans"
          className="quote-cta-primary"
        >
          Request a Quote
        </BrandButton>
        <BrandButton
          href="tel:+94112051944"
          tone="outline"
          className="quote-cta-secondary"
        >
          Talk to Our Team
        </BrandButton>
      </div>

      {/* Contact strip */}
      <address className="quote-contact min-h-rows-2 not-italic">
        {CONTACT.map((cell, i) => (
          <div key={cell.id} data-quote-cell className="quote-contact-cell">
            {i > 0 ? (
              <>
                <GridLine
                  axis="h"
                  unstyled
                  tone="page"
                  className="top-0 left-0 w-full sm:hidden"
                />
                {i % 2 === 1 ? (
                  <GridLine
                    axis="v"
                    unstyled
                    tone="page"
                    className="top-0 left-0 hidden h-full sm:block md:hidden"
                  />
                ) : (
                  <GridLine
                    axis="h"
                    unstyled
                    tone="page"
                    className="top-0 left-0 hidden w-full sm:block md:hidden"
                  />
                )}
              </>
            ) : null}
            <p className="index-tag opacity-80">{cell.label}</p>
            {"href" in cell ? (
              <a
                href={cell.href}
                className={`font-heading text-[12px] leading-[1.3] font-medium ${
                  "caseNormal" in cell ? "" : "uppercase"
                } underline-offset-4 hover:underline focus-visible:underline outline-none`}
              >
                {cell.lines.join(" ")}
              </a>
            ) : (
              <p className="font-heading text-[12px] leading-[1.3] font-medium uppercase">
                {cell.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            )}
          </div>
        ))}
      </address>
    </SectionGrid>
  );
}
