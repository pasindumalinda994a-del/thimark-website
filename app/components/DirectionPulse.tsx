"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import DirectionMark from "@/app/components/DirectionMark";

gsap.registerPlugin(useGSAP);

const STACKS = {
  pair: 2,
  trio: 3,
} as const;

type DirectionPulseProps = {
  direction?: "down" | "up" | "right";
  stack?: keyof typeof STACKS;
};

export default function DirectionPulse({
  direction = "right",
  stack = "pair",
}: DirectionPulseProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const count = STACKS[stack];

  useGSAP(
    () => {
      const parts = rootRef.current?.querySelectorAll("[data-direction-part]");
      if (!parts?.length) return;

      const axis = direction === "right" ? "x" : "y";
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const travel = 0.5;
        const step = 0.22;
        const nudge = direction === "up" ? -2 : 2;
        const returnAt = (parts.length - 1) * step + travel - 0.18;
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.25 });

        parts.forEach((part, i) => {
          tl.fromTo(
            part,
            { [axis]: 0, opacity: 0.35 },
            {
              [axis]: nudge,
              opacity: 1,
              duration: travel,
              ease: "power2.out",
            },
            i * step,
          );
        });

        parts.forEach((part, i) => {
          tl.to(
            part,
            { [axis]: 0, opacity: 0.35, duration: travel, ease: "power2.in" },
            returnAt + i * step,
          );
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [direction, stack] },
  );

  return (
    <span
      ref={rootRef}
      aria-hidden
      className={`direction-pulse${stack === "trio" ? " direction-pulse-trio" : ""}`}
    >
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          data-direction-part=""
          className="direction-pulse-part"
        >
          <DirectionMark
            direction={direction}
            stack={stack}
            index={index}
            className="direction-pulse-icon"
          />
        </span>
      ))}
    </span>
  );
}
