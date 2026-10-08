"use client";

import { useEffect, useMemo } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import type { LenisOptions } from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

function LenisScrollTriggerSync() {
  useLenis(() => {
    ScrollTrigger.update();
  });
  return null;
}

const MOBILE_HASH_OFFSET = -64;

function hashOffset() {
  return window.matchMedia("(max-width: 767px)").matches
    ? MOBILE_HASH_OFFSET
    : 0;
}

export default function SmoothScroll() {
  const options = useMemo<LenisOptions>(
    () => ({
      autoRaf: true,
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
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <ReactLenis root options={options}>
      <LenisScrollTriggerSync />
    </ReactLenis>
  );
}
