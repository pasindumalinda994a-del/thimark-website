"use client";

import type { RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { formatStat } from "@/app/(frontend)/components/stats";

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin);

function strokes(root: Element) {
  return root.querySelectorAll<SVGElement>("[data-glyph-stroke], [data-seal-stroke]");
}

export function drawStrokes(root: Element) {
  const tl = gsap.timeline();
  const lines = strokes(root);
  const fades = root.querySelectorAll<SVGElement>("[data-seal-fade]");
  if (lines.length) {
    tl.fromTo(
      lines,
      { drawSVG: "0%" },
      { drawSVG: "100%", duration: 1.1, ease: "power2.inOut", stagger: 0.03, overwrite: "auto" },
    );
  }
  if (fades.length) {
    tl.fromTo(
      fades,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.5, ease: "power2.out", stagger: 0.06 },
      0.6,
    );
  }
  return tl;
}

function setCount(el: HTMLElement, n: number) {
  const pad = el.dataset.countPad ? Number(el.dataset.countPad) : undefined;
  el.textContent = formatStat(n, pad);
}

export type PlateMotionOptions = {
  /** Image open. "rise" matches the homepage bottom clip. Default opens from the centre. */
  image?: "center" | "rise";
};

/**
 * Shared entrances for plate-grid sections:
 * [data-reveal] fades up, [data-wipe] opens from the centre (or from the
 * bottom when image is "rise"),
 * [data-draw] draws its strokes, [data-count] counts up,
 * [data-redraw] replays its strokes on hover,
 * [data-scrub-x] grows left-to-right with scroll and sets data-passed on
 * [data-scrub-stop="0.5"] markers once its progress reaches their value.
 */
export function usePlateMotion(
  scope: RefObject<HTMLElement | null>,
  options?: PlateMotionOptions,
) {
  const rise = options?.image === "rise";

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);
      const wipes = gsap.utils.toArray<HTMLElement>("[data-wipe]", root);
      const draws = gsap.utils.toArray<HTMLElement>("[data-draw]", root);
      const counts = gsap.utils.toArray<HTMLElement>("[data-count]", root);
      const redraws = gsap.utils.toArray<HTMLElement>("[data-redraw]", root);
      const scrubs = gsap.utils.toArray<HTMLElement>("[data-scrub-x]", root);
      const stops = gsap.utils.toArray<HTMLElement>("[data-scrub-stop]", root);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        counts.forEach((el) => setCount(el, Number(el.dataset.count)));
        stops.forEach((el) => {
          el.dataset.passed = "true";
        });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        scrubs.forEach((el) => {
          gsap.fromTo(
            el,
            { scaleX: 0, transformOrigin: "left center" },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                end: "top 40%",
                scrub: true,
                onUpdate: (self) => {
                  stops.forEach((stop) => {
                    const at = Number(stop.dataset.scrubStop) || 0;
                    stop.dataset.passed = self.progress >= at ? "true" : "false";
                  });
                },
              },
            },
          );
        });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(reveals, { autoAlpha: 0, y: rise ? 10 : 12 });
        ScrollTrigger.batch(reveals, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.08,
              overwrite: true,
            }),
        });

        wipes.forEach((el) => {
          if (rise) {
            gsap.fromTo(
              el,
              { clipPath: "inset(0% 0% 100% 0%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 0.9,
                ease: "power2.out",
                scrollTrigger: { trigger: el, start: "top 82%", once: true },
              },
            );
            return;
          }

          gsap.fromTo(
            el,
            { clipPath: "inset(0% 50% 0% 50%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.1,
              ease: "power3.inOut",
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            },
          );
          const img = el.querySelector("img");
          if (img) {
            gsap.fromTo(
              img,
              { scale: 1.08 },
              {
                scale: 1,
                ease: "none",
                scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
              },
            );
          }
        });

        draws.forEach((el) => {
          const lines = strokes(el);
          const fades = el.querySelectorAll("[data-seal-fade]");
          if (lines.length) gsap.set(lines, { drawSVG: "0%" });
          if (fades.length) gsap.set(fades, { autoAlpha: 0 });
          ScrollTrigger.create({
            trigger: el,
            start: "top 82%",
            once: true,
            onEnter: () => drawStrokes(el),
          });
        });

        counts.forEach((el) => {
          const target = Number(el.dataset.count);
          const state = { n: 0 };
          setCount(el, 0);
          gsap.to(state, {
            n: target,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => setCount(el, state.n),
          });
        });
      });

      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const cleanups = redraws.map((el) => {
          let tl: gsap.core.Timeline | undefined;
          const enter = () => {
            tl?.kill();
            tl = drawStrokes(el);
          };
          const leave = () => {
            if (tl?.isActive()) tl.progress(1);
          };
          el.addEventListener("pointerenter", enter);
          el.addEventListener("pointerleave", leave);
          return () => {
            el.removeEventListener("pointerenter", enter);
            el.removeEventListener("pointerleave", leave);
            tl?.kill();
          };
        });
        return () => cleanups.forEach((fn) => fn());
      });

      return () => mm.revert();
    },
    { scope, dependencies: [rise], revertOnUpdate: true },
  );
}
