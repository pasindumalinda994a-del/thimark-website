"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { normalizePath } from "@/app/(frontend)/components/nav";
import { MASK_MOTION as MASK } from "@/app/(frontend)/components/maskMotion";
import { scrollToSection } from "@/app/(frontend)/components/SmoothScroll";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STEEL = "#575757";
const MARK_W = 78;
const MARK_H = 100;
const NAV_TIMEOUT_MS = 2500;
const CLOSE_WATCHDOG_MS = 1800;

type Edges = { l: number; r: number; t: number; b: number };

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
  const pendingHash = useRef("");
  const settleTimers = useRef<number[]>([]);
  const navTimer = useRef<number | undefined>(undefined);
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
    const hashAt = href.indexOf("#");
    pendingHash.current = hashAt === -1 ? "" : href.slice(hashAt);
    for (const timer of settleTimers.current) window.clearTimeout(timer);
    settleTimers.current = [];
    routerRef.current.push(href);
    window.clearTimeout(navTimer.current);
    navTimer.current = window.setTimeout(() => {
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

      const setLineL = gsap.quickSetter(vInnerL, "x", "px");
      const setLineR = gsap.quickSetter(vInnerR, "x", "px");
      const setLineT = gsap.quickSetter(hInnerT, "y", "px");
      const setLineB = gsap.quickSetter(hInnerB, "y", "px");
      const setPanelL = gsap.quickSetter(panelLeft, "x", "px");
      const setPanelR = gsap.quickSetter(panelRight, "x", "px");
      const setPanelT = gsap.quickSetter(panelTop, "y", "px");
      const setPanelB = gsap.quickSetter(panelBottom, "y", "px");

      const layout = () => {
        const { width: w, height: h } = el.getBoundingClientRect();
        const mx = Math.round((w - MARK_W) / 2);
        const my = Math.round((h - MARK_H) / 2);
        const inner: Edges = {
          l: mx + 36,
          r: mx + 41,
          t: my + 47,
          b: my + 52,
        };
        const outer: Edges = {
          l: mx - 1,
          r: mx + MARK_W,
          t: my - 1,
          b: my + MARK_H,
        };
        const open: Edges = { l: 0, r: Math.round(w), t: 0, b: Math.round(h) };

        gsap.set(vInnerL, { left: inner.l });
        gsap.set(vInnerR, { left: inner.r });
        gsap.set(hInnerT, { top: inner.t });
        gsap.set(hInnerB, { top: inner.b });

        return { w, h, inner, outer, open };
      };

      let geo = layout();

      // Each line occupies [edge, edge + 1]; panels butt against the line's
      // outer side so the cream never crosses into the hole. `seal` closes the
      // gap left between the inner line pairs once they meet.
      const edges = { l: 0, r: 0, t: 0, b: 0, seal: 0 };

      const apply = () => {
        const { w, h, inner } = geo;
        const l = Math.round(edges.l);
        const r = Math.round(edges.r);
        const t = Math.round(edges.t);
        const b = Math.round(edges.b);
        const sealX = (edges.seal * (r + 1 - l)) / 2;
        const sealY = (edges.seal * (b + 1 - t)) / 2;

        setLineL(l - inner.l);
        setLineR(r - inner.r);
        setLineT(t - inner.t);
        setLineB(b - inner.b);
        setPanelL(Math.round(l + sealX) - w);
        setPanelR(Math.round(r + 1 - sealX));
        setPanelT(Math.round(t + sealY) - h);
        setPanelB(Math.round(b + 1 - sealY));
      };

      const place = (target: Edges, seal: number) => {
        Object.assign(edges, target, { seal });
        apply();
      };

      const resetIdle = () => {
        geo = layout();
        place(geo.open, 0);
        gsap.set(innerLines, { autoAlpha: 1 });
        gsap.set(el, { autoAlpha: 0, pointerEvents: "none" });
        phase.current = "idle";
        setBusy(false);
      };

      place(geo.open, 0);
      gsap.set(innerLines, { autoAlpha: 1 });
      gsap.set(el, { autoAlpha: 0, pointerEvents: "none" });
      phase.current = "idle";

      playClose.current = contextSafe((onClosed: () => void) => {
        gsap.killTweensOf([el, innerLines, edges]);

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        geo = layout();
        gsap.set(el, { autoAlpha: 1, pointerEvents: "auto" });
        lenisRef.current?.stop();

        if (reduce) {
          place(geo.inner, 1);
          gsap.set(innerLines, { autoAlpha: 0 });
          gsap.delayedCall(0.2, onClosed);
          return;
        }

        // Sides stay off the field. Parking them on the open edges would let
        // the seam seal drag those plates back in, because seal closes whatever
        // gap is left between each pair.
        const park = -(geo.w + 2);
        const mid = Math.round(geo.h / 2);
        place({ l: park, r: park, t: geo.open.t, b: geo.open.b }, 0);
        gsap.set([vInnerL, vInnerR], { autoAlpha: 0 });
        gsap.set([hInnerT, hInnerB], { autoAlpha: 1 });

        gsap
          .timeline({
            onUpdate: apply,
            onComplete: onClosed,
          })
          .to(edges, {
            t: mid,
            b: mid,
            duration: MASK.split.duration,
            ease: MASK.split.ease,
          })
          .to(
            edges,
            { seal: 1, duration: MASK.seal.duration, ease: MASK.seal.ease },
            `-=${MASK.seal.duration}`,
          );
      });

      playReveal.current = contextSafe(() => {
        gsap.killTweensOf([el, innerLines, edges]);

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        geo = layout();
        const destinationHash = pendingHash.current;
        pendingHash.current = "";
        for (const timer of settleTimers.current) window.clearTimeout(timer);
        settleTimers.current = [];
        let landed = !destinationHash;
        const settle = () => {
          if (!destinationHash) {
            lenisRef.current?.scrollTo(0, { immediate: true, force: true });
            window.scrollTo(0, 0);
            return;
          }
          if (
            scrollToSection(lenisRef.current, destinationHash, {
              immediate: true,
            })
          ) {
            landed = true;
            return;
          }
          if (landed) return;
          lenisRef.current?.scrollTo(0, { immediate: true, force: true });
          window.scrollTo(0, 0);
        };
        settle();
        if (destinationHash) {
          settleTimers.current = [
            window.setTimeout(settle, 80),
            window.setTimeout(() => {
              ScrollTrigger.refresh();
              settle();
            }, 220),
          ];
        }

        const finish = () => {
          resetIdle();
          lenisRef.current?.start();
          ScrollTrigger.refresh();
        };

        if (reduce) {
          place(geo.open, 0);
          gsap.set(innerLines, { autoAlpha: 0 });
          gsap.delayedCall(0.15, finish);
          return;
        }

        const park = -(geo.w + 2);
        const mid = Math.round(geo.h / 2);
        place({ l: park, r: park, t: mid, b: mid }, 1);
        gsap.set([vInnerL, vInnerR], { autoAlpha: 0 });
        gsap.set([hInnerT, hInnerB], { autoAlpha: 1 });

        gsap
          .timeline({
            onUpdate: apply,
            onComplete: finish,
          })
          .to(
            edges,
            { seal: 0, duration: MASK.seal.duration, ease: MASK.unsealEase },
            0,
          )
          .to(
            edges,
            {
              t: geo.open.t,
              b: geo.open.b,
              duration: MASK.split.duration,
              ease: MASK.split.ease,
            },
            0,
          )
          .to(
            [hInnerT, hInnerB],
            { autoAlpha: 0, duration: MASK.lineFade.duration },
            MASK.lineFade.at,
          );
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
      className={`pointer-events-none fixed top-14 right-0 bottom-0 left-0 z-35 overflow-hidden xl:top-0 xl:left-sidebar ${
        busy ? "" : "invisible opacity-0"
      }`}
      role="status"
      aria-busy={busy}
      aria-hidden={!busy}
      inert={!busy}
    >
      <div
        data-panel="top"
        className="pointer-events-none absolute inset-0 z-0 bg-cream"
      />
      <div
        data-panel="bottom"
        className="pointer-events-none absolute inset-0 z-0 bg-cream"
      />
      <div
        data-panel="left"
        className="pointer-events-none absolute inset-0 z-0 bg-cream"
      />
      <div
        data-panel="right"
        className="pointer-events-none absolute inset-0 z-0 bg-cream"
      />

      <MaskLine line="v-inner-l" axis="v" />
      <MaskLine line="v-inner-r" axis="v" />
      <MaskLine line="h-inner-t" axis="h" />
      <MaskLine line="h-inner-b" axis="h" />
    </div>
  );
}
