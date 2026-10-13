"use client";

import type { RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/**
 * [data-letters] paragraphs brighten character by character as they scroll
 * through the viewport, one paragraph after the next.
 */
export function useLetterScrub(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const paragraphs = gsap.utils.toArray<HTMLElement>("[data-letters]", root);
      if (!paragraphs.length) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(paragraphs, { opacity: 1 });
      });

      // Phones brighten word by word: far fewer spans to split and scrub.
      mm.add(
        {
          phone: "(max-width: 767px)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { phone, motion } = ctx.conditions ?? {};
          if (!motion) return;

          const split = SplitText.create(paragraphs, {
            type: phone ? "words" : "chars",
            autoSplit: true,
            tag: "span",
            onSplit(self) {
              const units = phone ? self.words : self.chars;
              const tl = gsap.timeline({
                scrollTrigger: {
                  trigger: paragraphs[0],
                  endTrigger: paragraphs[paragraphs.length - 1],
                  start: "top 80%",
                  end: "bottom 45%",
                  scrub: true,
                },
              });
              paragraphs.forEach((el, i) => {
                const own = units.filter((unit) => el.contains(unit));
                if (!own.length) return;
                tl.fromTo(
                  own,
                  { opacity: 0.5 },
                  { opacity: 1, ease: "none", duration: 0.15, stagger: 0.2 },
                  i === 0 ? 0 : ">",
                );
              });
              return tl;
            },
          });

          return () => split.revert();
        },
      );

      return () => mm.revert();
    },
    { scope },
  );
}
