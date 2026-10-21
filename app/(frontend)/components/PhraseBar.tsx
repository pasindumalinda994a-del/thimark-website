"use client";

import { useRef } from "react";
import gsap from "gsap";
import Copy from "@/app/(frontend)/components/Copy";
import DirectionMark from "@/app/(frontend)/components/DirectionMark";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** The brand principle bar from the homepage quality plate, for any short run of phrases. */
export default function PhraseBar({
  phrases,
  className = "",
}: {
  phrases: readonly string[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const bar = ref.current;
      if (!bar) return;

      const seps = gsap.utils.toArray<HTMLElement>("[data-phrase-sep]", bar);
      const items = gsap.utils.toArray<HTMLElement>("[data-phrase]", bar);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(bar, { clipPath: "inset(0% 100% 0% 0%)" });
        gsap.set(seps, { autoAlpha: 0, scale: 0.7 });
        gsap.set(items, { autoAlpha: 0, x: -8 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: bar,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });
        tl.to(bar, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.inOut" });
        tl.to(
          seps,
          { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power2.out", stagger: 0.12 },
          0.35,
        );
        tl.to(
          items,
          { autoAlpha: 1, x: 0, duration: 0.45, ease: "power2.out", stagger: 0.16 },
          0.3,
        );
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`phrase-bar${className ? ` ${className}` : ""}`}>
      {phrases.map((phrase, i) => (
        <div key={phrase} className="phrase-bar-cell">
          {i > 0 ? (
            <span data-phrase-sep className="phrase-bar-sep" aria-hidden>
              <DirectionMark
                direction="right"
                className="phrase-bar-sep-mark phrase-bar-sep-mark--row"
              />
              <DirectionMark
                direction="down"
                className="phrase-bar-sep-mark phrase-bar-sep-mark--stack"
              />
            </span>
          ) : null}
          <Copy data-phrase variant="title" className="phrase-bar-item">
            {phrase}
          </Copy>
        </div>
      ))}
    </div>
  );
}
