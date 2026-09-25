"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { normalizePath } from "@/app/components/nav";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STEEL = "#575757";
const MARK_W = 78;
const MARK_H = 100;
const NAV_TIMEOUT_MS = 2500;
const CLOSE_WATCHDOG_MS = 1800;

function xTo(from: number, target: number) {
  return target - from;
}

function MaskLine({
  axis,
  line,
}: {
  axis: "v" | "h";
  line: string;
}) {
  const isV = axis === "v";

  return (
    <span
      data-line={line}
      data-axis={axis}
      className={
        isV
          ? "pointer-events-none absolute top-0 z-30 h-full w-px overflow-visible"
          : "pointer-events-none absolute left-0 z-30 h-px w-full overflow-visible"
      }
    >
      <svg
        aria-hidden
        width={isV ? "1" : "100%"}
        height={isV ? "100%" : "1"}
        className={
          isV ? "h-full w-px overflow-visible" : "h-px w-full overflow-visible"
        }
      >
        <line
          x1={isV ? "0.5" : "0"}
          x2={isV ? "0.5" : "100%"}
          y1={isV ? "0" : "0.5"}
          y2={isV ? "100%" : "0.5"}
          stroke={STEEL}
          strokeWidth="1"
          strokeLinecap="butt"
        />
      </svg>
    </span>
  );
}

type Phase = "idle" | "closing" | "waiting" | "revealing";

export default function PageTransition() {
  const root = useRef<HTMLDivElement>(null);
  const phase = useRef<Phase>("idle");
  const pendingPath = useRef<string | null>(null);
  const navTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const playClose = useRef<(onClosed: () => void) => void>(() => {});
  const playReveal = useRef<() => void>(() => {});

  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;
  const routerRef = useRef(router);
  routerRef.current = router;

  const [busy, setBusy] = useState(false);

  const beginNav = useRef((nextPath: string, href: string) => {
    if (phase.current !== "closing") return;
    phase.current = "waiting";
    pendingPath.current = nextPath;
    routerRef.current.push(href);
    window.clearTimeout(navTimer.current);
    navTimer.current = setTimeout(() => {
      if (phase.current !== "waiting") return;
      pendingPath.current = null;
      phase.current = "revealing";
      playReveal.current();
    }, NAV_TIMEOUT_MS);
  });

  useGSAP(
    (_context, contextSafe) => {
      const el = root.current;
      if (!el || !contextSafe) return;

      const q = gsap.utils.selector(el);
      const vInnerL = q("[data-line='v-inner-l']");
      const vInnerR = q("[data-line='v-inner-r']");
      const hInnerT = q("[data-line='h-inner-t']");
      const hInnerB = q("[data-line='h-inner-b']");
      const innerLines = [...vInnerL, ...vInnerR, ...hInnerT, ...hInnerB];
      const panelTop = q("[data-panel='top']");
      const panelRight = q("[data-panel='right']");
      const panelBottom = q("[data-panel='bottom']");
      const panelLeft = q("[data-panel='left']");

      const layout = () => {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const mx = Math.round((w - MARK_W) / 2);
        const my = Math.round((h - MARK_H) / 2);
        const halfW = w / 2;
        const halfH = h / 2;
        const pos = {
          vOuterL: mx - 1,
          vInnerL: mx + 36,
          vInnerR: mx + 41,
          vOuterR: mx + 78,
          hOuterT: my - 1,
          hInnerT: my + 47,
          hInnerB: my + 52,
          hOuterB: my + 100,
        };
        const hole = {
          x: mx / halfW,
          y: my / halfH,
          r: (w - (mx + MARK_W)) / halfW,
          b: (h - (my + MARK_H)) / halfH,
        };

        gsap.set(vInnerL, { left: pos.vInnerL });
        gsap.set(vInnerR, { left: pos.vInnerR });
        gsap.set(hInnerT, { top: pos.hInnerT });
        gsap.set(hInnerB, { top: pos.hInnerB });

        return { w, h, pos, hole };
      };

      const resetIdle = () => {
        layout();
        gsap.set(el, { autoAlpha: 0, pointerEvents: "none" });
        gsap.set(panelTop, { scaleY: 0 });
        gsap.set(panelBottom, { scaleY: 0 });
        gsap.set(panelLeft, { scaleX: 0 });
        gsap.set(panelRight, { scaleX: 0 });
        gsap.set(vInnerL, { x: 0, scaleY: 1, autoAlpha: 1, transformOrigin: "center bottom" });
        gsap.set(vInnerR, { x: 0, scaleY: 1, autoAlpha: 1, transformOrigin: "center bottom" });
        gsap.set(hInnerT, { y: 0, scaleX: 1, autoAlpha: 1, transformOrigin: "left center" });
        gsap.set(hInnerB, { y: 0, scaleX: 1, autoAlpha: 1, transformOrigin: "left center" });
        phase.current = "idle";
        setBusy(false);
      };

      layout();
      gsap.set(el, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(panelTop, { scaleY: 0 });
      gsap.set(panelBottom, { scaleY: 0 });
      gsap.set(panelLeft, { scaleX: 0 });
      gsap.set(panelRight, { scaleX: 0 });
      gsap.set(vInnerL, { x: 0, scaleY: 1, autoAlpha: 1, transformOrigin: "center bottom" });
      gsap.set(vInnerR, { x: 0, scaleY: 1, autoAlpha: 1, transformOrigin: "center bottom" });
      gsap.set(hInnerT, { y: 0, scaleX: 1, autoAlpha: 1, transformOrigin: "left center" });
      gsap.set(hInnerB, { y: 0, scaleX: 1, autoAlpha: 1, transformOrigin: "left center" });
      phase.current = "idle";

      playClose.current = contextSafe((onClosed: () => void) => {
        gsap.killTweensOf([
          el,
          innerLines,
          panelTop,
          panelBottom,
          panelLeft,
          panelRight,
        ]);

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const { w, h, pos, hole } = layout();
        gsap.set(el, { autoAlpha: 1, pointerEvents: "auto" });
        lenisRef.current?.stop();

        if (reduce) {
          gsap.set(panelTop, { scaleY: 1 });
          gsap.set(panelBottom, { scaleY: 1 });
          gsap.set(panelLeft, { scaleX: 1 });
          gsap.set(panelRight, { scaleX: 1 });
          gsap.set(innerLines, { autoAlpha: 0 });
          gsap.delayedCall(0.2, onClosed);
          return;
        }

        gsap.set(vInnerL, {
          x: xTo(pos.vInnerL, 0),
          scaleY: 1,
          autoAlpha: 1,
        });
        gsap.set(vInnerR, {
          x: xTo(pos.vInnerR, w),
          scaleY: 1,
          autoAlpha: 1,
        });
        gsap.set(hInnerT, {
          y: xTo(pos.hInnerT, 0),
          scaleX: 1,
          autoAlpha: 1,
        });
        gsap.set(hInnerB, {
          y: xTo(pos.hInnerB, h),
          scaleX: 1,
          autoAlpha: 1,
        });
        gsap.set(panelTop, { scaleY: 0 });
        gsap.set(panelBottom, { scaleY: 0 });
        gsap.set(panelLeft, { scaleX: 0 });
        gsap.set(panelRight, { scaleX: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          onComplete: onClosed,
        });

        tl.addLabel("expand")
          .to(vInnerL, { x: xTo(pos.vInnerL, pos.vOuterL), duration: 0.9 }, "expand")
          .to(vInnerR, { x: xTo(pos.vInnerR, pos.vOuterR), duration: 0.9 }, "expand")
          .to(hInnerT, { y: xTo(pos.hInnerT, pos.hOuterT), duration: 0.9 }, "expand")
          .to(hInnerB, { y: xTo(pos.hInnerB, pos.hOuterB), duration: 0.9 }, "expand")
          .to(panelTop, { scaleY: hole.y, duration: 0.9 }, "expand")
          .to(panelBottom, { scaleY: hole.b, duration: 0.9 }, "expand")
          .to(panelLeft, { scaleX: hole.x, duration: 0.9 }, "expand")
          .to(panelRight, { scaleX: hole.r, duration: 0.9 }, "expand");

        tl.addLabel("reveal")
          .to(vInnerL, { x: 0, duration: 0.5 }, "reveal")
          .to(vInnerR, { x: 0, duration: 0.5 }, "reveal")
          .to(hInnerT, { y: 0, duration: 0.5 }, "reveal")
          .to(hInnerB, { y: 0, duration: 0.5 }, "reveal")
          .to(panelTop, { scaleY: 1, duration: 0.5 }, "reveal")
          .to(panelBottom, { scaleY: 1, duration: 0.5 }, "reveal")
          .to(panelLeft, { scaleX: 1, duration: 0.5 }, "reveal")
          .to(panelRight, { scaleX: 1, duration: 0.5 }, "reveal");
      });

      playReveal.current = contextSafe(() => {
        gsap.killTweensOf([
          el,
          innerLines,
          panelTop,
          panelBottom,
          panelLeft,
          panelRight,
        ]);

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const { w, h, pos, hole } = layout();
        lenisRef.current?.scrollTo(0, { immediate: true });
        window.scrollTo(0, 0);

        const finish = () => {
          resetIdle();
          lenisRef.current?.start();
          ScrollTrigger.refresh();
        };

        if (reduce) {
          gsap.set(panelTop, { scaleY: 0 });
          gsap.set(panelBottom, { scaleY: 0 });
          gsap.set(panelLeft, { scaleX: 0 });
          gsap.set(panelRight, { scaleX: 0 });
          gsap.set(innerLines, { autoAlpha: 0 });
          gsap.delayedCall(0.15, finish);
          return;
        }

        gsap.set(vInnerL, { x: 0, scaleY: 1, autoAlpha: 1 });
        gsap.set(vInnerR, { x: 0, scaleY: 1, autoAlpha: 1 });
        gsap.set(hInnerT, { y: 0, scaleX: 1, autoAlpha: 1 });
        gsap.set(hInnerB, { y: 0, scaleX: 1, autoAlpha: 1 });
        gsap.set(panelTop, { scaleY: 1 });
        gsap.set(panelBottom, { scaleY: 1 });
        gsap.set(panelLeft, { scaleX: 1 });
        gsap.set(panelRight, { scaleX: 1 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          onComplete: finish,
        });

        tl.addLabel("reveal")
          .set(innerLines, { autoAlpha: 1 })
          .to(vInnerL, { x: xTo(pos.vInnerL, pos.vOuterL), duration: 0.5 }, "reveal")
          .to(vInnerR, { x: xTo(pos.vInnerR, pos.vOuterR), duration: 0.5 }, "reveal")
          .to(hInnerT, { y: xTo(pos.hInnerT, pos.hOuterT), duration: 0.5 }, "reveal")
          .to(hInnerB, { y: xTo(pos.hInnerB, pos.hOuterB), duration: 0.5 }, "reveal")
          .to(panelTop, { scaleY: hole.y, duration: 0.5 }, "reveal")
          .to(panelBottom, { scaleY: hole.b, duration: 0.5 }, "reveal")
          .to(panelLeft, { scaleX: hole.x, duration: 0.5 }, "reveal")
          .to(panelRight, { scaleX: hole.r, duration: 0.5 }, "reveal");

        tl.addLabel("expand")
          .to(vInnerL, { x: xTo(pos.vInnerL, 0), duration: 0.9 }, "expand")
          .to(vInnerR, { x: xTo(pos.vInnerR, w), duration: 0.9 }, "expand")
          .to(hInnerT, { y: xTo(pos.hInnerT, 0), duration: 0.9 }, "expand")
          .to(hInnerB, { y: xTo(pos.hInnerB, h), duration: 0.9 }, "expand")
          .to(panelTop, { scaleY: 0, duration: 0.9 }, "expand")
          .to(panelBottom, { scaleY: 0, duration: 0.9 }, "expand")
          .to(panelLeft, { scaleX: 0, duration: 0.9 }, "expand")
          .to(panelRight, { scaleX: 0, duration: 0.9 }, "expand")
          .to(innerLines, { autoAlpha: 0, duration: 0.4 }, "expand+=0.5");
      });
    },
    { scope: root },
  );

  useEffect(() => {
    if (phase.current !== "waiting") return;
    if (!pendingPath.current) return;
    if (normalizePath(pathname) !== pendingPath.current) return;

    window.clearTimeout(navTimer.current);
    pendingPath.current = null;
    phase.current = "revealing";
    playReveal.current();
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor?.href || (anchor.target && anchor.target !== "_self")) return;
      if (anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      const current = new URL(window.location.href);
      if (url.origin !== current.origin) return;
      if (url.protocol === "mailto:" || url.protocol === "tel:") return;

      const nextPath = normalizePath(url.pathname);
      const herePath = normalizePath(current.pathname);
      if (nextPath === herePath) return;
      if (document.querySelector('[aria-label="Loading"][aria-busy="true"]')) {
        return;
      }

      event.preventDefault();
      if (phase.current !== "idle") return;

      setBusy(true);
      phase.current = "closing";

      const href = `${url.pathname}${url.search}${url.hash}`;
      const closeWatchdog = window.setTimeout(
        () => beginNav.current(nextPath, href),
        CLOSE_WATCHDOG_MS,
      );
      playClose.current(() => {
        window.clearTimeout(closeWatchdog);
        beginNav.current(nextPath, href);
      });
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return (
    <div
      ref={root}
      className={`pointer-events-none fixed top-14 right-0 bottom-0 left-0 z-35 overflow-hidden md:top-0 md:left-sidebar ${
        busy ? "" : "invisible opacity-0"
      }`}
      role="status"
      aria-busy={busy}
      aria-hidden={!busy}
      inert={!busy}
    >
      <div
        data-panel="top"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[calc(50%+1px)] origin-top scale-y-0 bg-cream"
      />
      <div
        data-panel="bottom"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[calc(50%+1px)] origin-bottom scale-y-0 bg-cream"
      />
      <div
        data-panel="left"
        className="pointer-events-none absolute inset-y-0 left-0 z-0 w-[calc(50%+1px)] origin-left scale-x-0 bg-cream"
      />
      <div
        data-panel="right"
        className="pointer-events-none absolute inset-y-0 right-0 z-0 w-[calc(50%+1px)] origin-right scale-x-0 bg-cream"
      />

      <MaskLine line="v-inner-l" axis="v" />
      <MaskLine line="v-inner-r" axis="v" />
      <MaskLine line="h-inner-t" axis="h" />
      <MaskLine line="h-inner-b" axis="h" />
    </div>
  );
}
