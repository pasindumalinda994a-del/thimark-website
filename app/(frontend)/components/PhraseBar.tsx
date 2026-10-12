"use client";

import { useRef } from "react";
import gsap from "gsap";
import Copy from "@/app/(frontend)/components/Copy";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

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

      const rails = gsap.utils.toArray<HTMLElement>("[data-phrase-rail]", bar);
      const items = gsap.utils.toArray<HTMLElement>("[data-phrase]", bar);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(bar, { clipPath: "inset(0% 100% 0% 0%)" });
        gsap.set(rails, { scaleY: 0, transformOrigin: "center top" });
        gsap.set(items, { autoAlpha: 0, x: -8 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: bar,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });
        tl.to(bar, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.inOut" });
        tl.to(rails, { scaleY: 1, duration: 0.4, ease: "power2.out", stagger: 0.12 }, 0.35);
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
    <div ref={ref} className={`phrase-bar ${className}`}>
      {phrases.map((phrase, i) => (
        <div key={phrase} className="phrase-bar-cell">
          {i > 0 ? (
            <span data-phrase-rail className="phrase-bar-rail" aria-hidden>
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
          <Copy
            data-phrase
            variant="title"
          >
            <span aria-hidden className="mr-3 align-middle text-[12px] font-medium tracking-[0.12em]">
              {padIndex(i)}
            </span>
            {phrase}
          </Copy>
        </div>
      ))}
    </div>
  );
}
