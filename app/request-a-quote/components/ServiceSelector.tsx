"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import CapabilityGlyph from "@/app/components/CapabilityGlyph";
import { BODY_TOP, SheetPanel } from "@/app/request-a-quote/components/RfqSheet";
import type { Lines } from "@/app/request-a-quote/components/SheetLines";
import { SERVICES, type ServiceId } from "@/app/request-a-quote/rfq-schema";

gsap.registerPlugin(useGSAP, DrawSVGPlugin);

/** Service cells: 1 label row, 6 glyph rows, 2 title/CTA rows. */
export const SERVICE_ROWS = BODY_TOP + 9;

export const SERVICE_LINES: Lines = {
  h: [
    { y: BODY_TOP + 1, from: 0, to: 12 },
    { y: SERVICE_ROWS - 2, from: 0, to: 12 },
  ],
  v: [3, 6, 9].map((x) => ({ x, from: BODY_TOP, to: SERVICE_ROWS })),
};

type ServiceSelectorProps = {
  selected: ServiceId | null;
  onSelect: (service: ServiceId) => void;
};

export default function ServiceSelector({ selected, onSelect }: ServiceSelectorProps) {
  const rootRef = useRef<HTMLUListElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const root = rootRef.current;
      if (!root || !contextSafe) return;
      const cells = gsap.utils.toArray<HTMLElement>("[data-rfq-svc]", root);
      const strokes = (cell: HTMLElement) => cell.querySelectorAll('[data-glyph-stroke="visible"]');
      const mm = gsap.matchMedia();
      const cleanups: (() => void)[] = [];

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          cells.flatMap((cell) => Array.from(strokes(cell))),
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 1.1, ease: "power2.inOut", stagger: 0.012, delay: 0.2 },
        );

        cells.forEach((cell) => {
          const redraw = contextSafe(() => {
            gsap.fromTo(
              strokes(cell),
              { drawSVG: "0%" },
              { drawSVG: "100%", duration: 0.8, ease: "power2.inOut", stagger: 0.02, overwrite: true },
            );
          });
          cell.addEventListener("pointerenter", redraw);
          cell.addEventListener("focus", redraw);
          cleanups.push(() => {
            cell.removeEventListener("pointerenter", redraw);
            cell.removeEventListener("focus", redraw);
          });
        });
      });

      return () => {
        cleanups.forEach((cleanup) => cleanup());
        mm.revert();
      };
    },
    { scope: rootRef },
  );

  return (
    <SheetPanel side="full" edge="end">
      <h2 id="rfq-step-heading" tabIndex={-1} className="sr-only">
        Choose a service
      </h2>
      <ul ref={rootRef} className="rfq-services">
        {SERVICES.map((service) => {
          const isSelected = selected === service.id;
          return (
            <li key={service.id} className="rfq-svc-item" data-rfq-copy>
              <button
                type="button"
                data-rfq-svc
                aria-pressed={isSelected}
                className={`rfq-svc${isSelected ? " is-selected" : ""}`}
                onClick={() => onSelect(service.id)}
              >
                <span className="rfq-svc-head index-tag">
                  <span>{service.short}</span>
                  <span className="opacity-60">[{service.index}]</span>
                </span>
                <span className="rfq-svc-figure">
                  <CapabilityGlyph kind={service.glyph} className="rfq-svc-glyph" />
                </span>
                <span className="rfq-svc-foot">
                  <span className="rfq-svc-title">{service.title}</span>
                  <span className="rfq-svc-cta index-tag">
                    <span>{service.cta}</span>
                    <span aria-hidden className="rfq-svc-arrow">
                      →
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </SheetPanel>
  );
}
