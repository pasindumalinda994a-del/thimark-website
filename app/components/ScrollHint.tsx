"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const STEM = 32;
const TICK = 1.5;

type ScrollHintProps = {
  seat: "col-8" | "col-9";
};

export function setScrollHintHidden(root: ParentNode, progress: number) {
  const hint = root.querySelector<HTMLElement>("[data-scroll-hint]");
  if (!hint) return;
  const hidden = hint.dataset.hidden === "true";
  if (progress > 0.15) {
    if (!hidden) hint.dataset.hidden = "true";
  } else if (progress < 0.04 && hidden) {
    delete hint.dataset.hidden;
  }
}

export default function ScrollHint({ seat }: ScrollHintProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tick = rootRef.current?.querySelector("[data-scroll-tick]");
      if (!tick) return;

      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.fromTo(
            tick,
            { y: 0 },
            {
              y: STEM - TICK,
              duration: 1.4,
              ease: "power2.inOut",
              repeat: -1,
              repeatDelay: 0.35,
            },
          );
        },
      );

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-scroll-hint=""
      className={`scroll-hint scroll-hint-${seat}`}
    >
      <span className="index-tag">Scroll</span>
      <span className="scroll-hint-stem">
        <span data-scroll-tick="" className="scroll-hint-tick" />
      </span>
    </div>
  );
}
