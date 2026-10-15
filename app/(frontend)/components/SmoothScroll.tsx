"use client";

import { useEffect, useMemo, useRef } from "react";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import type { LenisOptions } from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

function LenisScrollTriggerSync() {
  useLenis(() => {
    ScrollTrigger.update();
  });
  return null;
}

const MOBILE_HASH_OFFSET = -64;

export function hashOffset() {
  return window.matchMedia("(max-width: 1279px)").matches
    ? MOBILE_HASH_OFFSET
    : 0;
}

type SectionScroller = {
  resize?: () => void;
  scrollTo: (
    target: number | HTMLElement,
    options?: {
      offset?: number;
      immediate?: boolean;
      duration?: number;
      force?: boolean;
    },
  ) => void;
};

function sectionId(hash: string) {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!raw) return "";
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/** Scroll to an in-page section. Returns false when the target is not in the document. */
export function scrollToSection(
  lenis: SectionScroller | null | undefined,
  hash: string,
  options?: { immediate?: boolean },
) {
  const id = sectionId(hash);
  const target = id ? document.getElementById(id) : null;
  if (!target) return false;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const immediate = options?.immediate ?? reduced;
  if (lenis) {
    lenis.resize?.();
    lenis.scrollTo(target, {
      offset: hashOffset(),
      immediate,
      duration: immediate ? undefined : 1.1,
      force: true,
    });
    return true;
  }

  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY + hashOffset());
  window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
  return true;
}

/** Return to the top of the current page and drop a section hash. */
export function scrollToHero(lenis: SectionScroller | null | undefined) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (lenis) {
    lenis.scrollTo(0, { duration: reduced ? 0 : 1.1, force: true });
  } else {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }
  const url = new URL(window.location.href);
  if (url.hash) {
    history.replaceState(null, "", `${url.pathname}${url.search}`);
  }
}

function HashAnchorScroll() {
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor?.href || (anchor.target && anchor.target !== "_self")) return;

      const url = new URL(anchor.href, window.location.href);
      const current = new URL(window.location.href);
      if (
        url.host !== current.host ||
        url.pathname !== current.pathname ||
        !url.hash
      ) {
        return;
      }

      event.preventDefault();
      const next = `${url.pathname}${url.search}${url.hash}`;
      const here = `${current.pathname}${current.search}${current.hash}`;
      if (next !== here) {
        history.pushState(null, "", next);
      }

      const hash = url.hash;
      requestAnimationFrame(() => {
        scrollToSection(lenisRef.current, hash);
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}

export default function SmoothScroll() {
  const lenisRef = useRef<LenisRef>(null);

  // One animation loop: Lenis is stepped by GSAP's ticker so pins and scrubs stay in sync.
  useEffect(() => {
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);

  const options = useMemo<LenisOptions>(
    () => ({
      autoRaf: false,
      lerp: 0.1,
      anchors: { offset: 0 },
      stopInertiaOnNavigate: true,
      respectReducedMotion: true,
    }),
    [],
  );

  useEffect(() => {
    const anchors = options.anchors;
    if (typeof anchors !== "object" || !anchors) return;

    const syncOffset = () => {
      anchors.offset = hashOffset();
    };
    syncOffset();
    window.addEventListener("resize", syncOffset);
    return () => window.removeEventListener("resize", syncOffset);
  }, [options]);

  return (
    <ReactLenis root options={options} ref={lenisRef}>
      <LenisScrollTriggerSync />
      <HashAnchorScroll />
    </ReactLenis>
  );
}
