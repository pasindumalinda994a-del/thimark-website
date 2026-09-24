"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

type MaskRevealHeadingProps = {
  as?: "h1" | "h2";
  id?: string;
  className?: string;
  children: ReactNode;
  waitForPreload?: boolean;
  stagger?: number;
  duration?: number;
  delay?: number;
  start?: string;
};

export default function MaskRevealHeading({
  as: Tag = "h2",
  id,
  className,
  children,
  waitForPreload = false,
  stagger = 0.08,
  duration = 0.7,
  delay,
  start = "top 75%",
}: MaskRevealHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const lineDelay = delay ?? (waitForPreload ? 0.2 : 0);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el, { autoAlpha: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(el, { autoAlpha: 0 });

        let ready =
          !waitForPreload ||
          document.documentElement.dataset.preloaded === "true";
        let pending: gsap.core.Tween | undefined;

        const onReady = () => {
          ready = true;
          pending?.play();
        };

        if (waitForPreload && !ready) {
          window.addEventListener("thimark:preload-done", onReady);
        }

        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          tag: "span",
          onSplit(self) {
            gsap.set(el, { autoAlpha: 1 });
            gsap.set(self.masks, { display: "block" });
            gsap.set(self.lines, { display: "block" });

            const tween = gsap.from(self.lines, {
              yPercent: 100,
              duration,
              ease: "power3.out",
              stagger,
              delay: lineDelay,
              immediateRender: true,
              paused: waitForPreload,
              scrollTrigger: waitForPreload
                ? undefined
                : {
                    trigger: el,
                    start,
                    once: true,
                  },
            });

            if (waitForPreload) {
              if (ready) tween.play();
              else pending = tween;
            }

            return tween;
          },
        });

        return () => {
          if (waitForPreload) {
            window.removeEventListener("thimark:preload-done", onReady);
          }
          split.revert();
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
