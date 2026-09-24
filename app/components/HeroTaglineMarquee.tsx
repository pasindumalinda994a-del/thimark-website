"use client";

import { Fragment, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const WORDS = ["ENGINEERING", "MANUFACTURING", "INNOVATION"] as const;
const PX_PER_SECOND = 22;

function MarqueeLogo() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 32 41"
      width={32}
      height={41}
      fill="none"
      className="h-[0.9em] w-auto shrink-0 overflow-hidden text-cream"
    >
      <path d="M0 0H14.7692V19.27H0V0Z" fill="currentColor" />
      <path d="M17.2308 0H32V19.27H17.2308V0Z" fill="currentColor" />
      <path d="M0 21.73H14.7692V41H0V21.73Z" fill="currentColor" />
      <path d="M17.2308 21.73H32V41H17.2308V21.73Z" fill="currentColor" />
    </svg>
  );
}

function MarqueeCycle() {
  return WORDS.map((word) => (
    <Fragment key={word}>
      <span className="shrink-0">{word}</span>
      <MarqueeLogo />
    </Fragment>
  ));
}

export default function HeroTaglineMarquee({
  className = "",
}: {
  className?: string;
}) {
  const scope = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(2);

  useGSAP(
    () => {
      const trackEl = track.current;
      const root = scope.current;
      if (!trackEl || !root) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      let tween: gsap.core.Tween | undefined;
      let active = true;

      const loopWidth = () => {
        const units = trackEl.querySelectorAll<HTMLElement>("[data-unit]");
        if (units.length < 2) return units[0]?.offsetWidth ?? 0;
        return units[1].offsetLeft - units[0].offsetLeft;
      };

      const start = () => {
        if (!active) return;
        tween?.kill();
        gsap.set(trackEl, { x: 0 });

        const width = loopWidth();
        if (!width) return;

        const needed = Math.max(2, Math.ceil(root.offsetWidth / width) + 1);
        if (needed !== copies) {
          setCopies(needed);
          return;
        }

        if (reduced) return;

        tween = gsap.to(trackEl, {
          x: -width,
          duration: width / PX_PER_SECOND,
          ease: "none",
          repeat: -1,
        });
      };

      const run = () => {
        if (!active) return;
        if (document.fonts?.ready) {
          void document.fonts.ready.then(start);
        } else {
          start();
        }
      };

      run();
      const observer = new ResizeObserver(run);
      observer.observe(root);

      return () => {
        active = false;
        observer.disconnect();
        tween?.kill();
      };
    },
    { scope, dependencies: [copies], revertOnUpdate: true },
  );

  return (
    <div ref={scope} className={`overflow-hidden ${className}`} aria-hidden>
      <div
        ref={track}
        className="flex w-max items-center font-heading text-[clamp(16px,1.7vw,24px)] leading-none font-normal uppercase will-change-transform"
      >
        {Array.from({ length: copies }, (_, i) => (
          <div
            key={i}
            data-unit
            className="flex items-center gap-8 pr-8"
          >
            <MarqueeCycle />
          </div>
        ))}
      </div>
    </div>
  );
}
