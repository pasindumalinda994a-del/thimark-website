"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { MASK_MOTION as MASK } from "@/app/(frontend)/components/maskMotion";
import { PRELOAD_SESSION_KEY } from "@/app/(frontend)/components/preloadSession";

gsap.registerPlugin(useGSAP);

const COLORS = {
  steel: "#3A3D42",
  brand: "#6E1218",
  silver: "#A8ADB4",
} as const;

const MARK_W = 80;
const MARK_H = 104;
const COPY_GAP = 32;

function xTo(from: number, target: number) {
  return target - from;
}

function PreloadLine({
  axis,
  dashed,
  line,
}: {
  axis: "v" | "h";
  dashed?: boolean;
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
          stroke={COLORS.steel}
          strokeWidth="1"
          strokeLinecap="butt"
          {...(dashed ? { strokeDasharray: "4 4" } : {})}
        />
      </svg>
    </span>
  );
}

const WORD_CLASS =
  "absolute inset-x-0 top-0 whitespace-nowrap text-center font-heading text-[13px] leading-none font-medium uppercase text-black md:text-[20px]";

function alreadyPreloaded() {
  return (
    typeof document !== "undefined" &&
    document.documentElement.dataset.preloaded === "true"
  );
}

function rememberPreloaded() {
  try {
    sessionStorage.setItem(PRELOAD_SESSION_KEY, "1");
  } catch {}
}

const PRELOAD_WATCHDOG_MS = 8000;

export default function PreLoading() {
  const root = useRef<HTMLDivElement>(null);
  // Always start false so hydration matches the server HTML; the layout effect hides it before paint.
  const [done, setDone] = useState(false);
  const lenis = useLenis();

  const finishRef = useRef(() => {});
  finishRef.current = () => {
    if (alreadyPreloaded()) {
      setDone(true);
      return;
    }
    document.documentElement.dataset.preloaded = "true";
    rememberPreloaded();
    window.dispatchEvent(new CustomEvent("thimark:preload-done"));
    setDone(true);
  };

  useLayoutEffect(() => {
    if (alreadyPreloaded()) setDone(true);
  }, []);

  useEffect(() => {
    if (!lenis || done) return;
    lenis.stop();
    return () => {
      lenis.start();
    };
  }, [lenis, done]);

  useEffect(() => {
    if (done) return;
    const watchdog = window.setTimeout(
      () => finishRef.current(),
      PRELOAD_WATCHDOG_MS,
    );
    return () => window.clearTimeout(watchdog);
  }, [done]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (alreadyPreloaded()) {
        setDone(true);
        return;
      }

      const finish = () => finishRef.current();

      const q = gsap.utils.selector(el);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mx = Math.round((vw - MARK_W) / 2);
      const my = Math.round((vh - MARK_H) / 2);
      const cx = mx + MARK_W / 2;
      const cy = my + MARK_H / 2;

      const vOuterL = q("[data-line='v-outer-l']");
      const vInnerL = q("[data-line='v-inner-l']");
      const vInnerR = q("[data-line='v-inner-r']");
      const vOuterR = q("[data-line='v-outer-r']");
      const hOuterT = q("[data-line='h-outer-t']");
      const hInnerT = q("[data-line='h-inner-t']");
      const hInnerB = q("[data-line='h-inner-b']");
      const hOuterB = q("[data-line='h-outer-b']");
      const vLines = q("[data-axis='v']");
      const hLines = q("[data-axis='h']");
      const vOuters = [...vOuterL, ...vOuterR];
      const hOuters = [...hOuterT, ...hOuterB];
      const cells = q("[data-cell]");
      const mark = q("[data-mark]");
      const copy = q("[data-copy]");
      const panelTop = q("[data-panel='top']");
      const panelRight = q("[data-panel='right']");
      const panelBottom = q("[data-panel='bottom']");
      const panelLeft = q("[data-panel='left']");
      const progressEl = q("[data-progress]")[0] as HTMLElement;
      const wordEng = q("[data-word='engineering']");
      const wordMfg = q("[data-word='manufacturing']");
      const wordInn = q("[data-word='innovation']");
      const brand = q("[data-brand]");
      const titles = [...wordEng, ...wordMfg, ...wordInn, ...brand];

      const pos = {
        vOuterL: mx - 1,
        vInnerL: mx + 36,
        vInnerR: mx + 44,
        vOuterR: mx + 80,
        hOuterT: my - 1,
        hInnerT: my + 48,
        hInnerB: my + 56,
        hOuterB: my + 104,
      };

      gsap.set(mark, { left: mx, top: my, x: 0, y: 0, xPercent: 0, yPercent: 0 });
      gsap.set(copy, { left: vw / 2, top: my + MARK_H + COPY_GAP });
      gsap.set(vOuterL, { left: pos.vOuterL });
      gsap.set(vInnerL, { left: pos.vInnerL });
      gsap.set(vInnerR, { left: pos.vInnerR });
      gsap.set(vOuterR, { left: pos.vOuterR });
      gsap.set(hOuterT, { top: pos.hOuterT });
      gsap.set(hInnerT, { top: pos.hInnerT });
      gsap.set(hInnerB, { top: pos.hInnerB });
      gsap.set(hOuterB, { top: pos.hOuterB });
      gsap.set(vLines, { scaleY: 0, transformOrigin: "center bottom" });
      gsap.set(hLines, { scaleX: 0, transformOrigin: "left center" });
      const dash = 8;
      gsap.set(q("[data-line='v-outer-l'] line, [data-line='v-outer-r'] line"), {
        attr: { "stroke-dashoffset": ((pos.hOuterT % dash) + dash) % dash },
      });
      gsap.set(q("[data-line='h-outer-t'] line, [data-line='h-outer-b'] line"), {
        attr: { "stroke-dashoffset": ((pos.vOuterL % dash) + dash) % dash },
      });
      gsap.set(cells, { autoAlpha: 0 });
      gsap.set(titles, { yPercent: 100, autoAlpha: 0 });

      const prog = { n: 0 };
      const writeProg = () => {
        progressEl.textContent = `${Math.round(prog.n)}%`;
      };

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduce) {
        gsap.set(vLines, { scaleY: 0 });
        gsap.set(hLines, { scaleX: 0 });
        gsap.set(q("[data-cell='tl']"), { autoAlpha: 1, backgroundColor: COLORS.steel });
        gsap.set(q("[data-cell='tr']"), { autoAlpha: 1, backgroundColor: COLORS.brand });
        gsap.set(q("[data-cell='bl']"), { autoAlpha: 1, backgroundColor: COLORS.silver });
        gsap.set(q("[data-cell='br']"), { autoAlpha: 1, backgroundColor: COLORS.steel });
        gsap.set(copy, { autoAlpha: 0 });
        prog.n = 100;
        writeProg();
        gsap.delayedCall(0.6, finish);
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: finish,
      });

      tl.addLabel("draw")
        .to(vLines, { scaleY: 1, duration: 0.85 }, "draw")
        .to(hLines, { scaleX: 1, duration: 0.65 }, "draw")
        .to(prog, { n: 30, duration: 0.85, ease: "none", onUpdate: writeProg }, "draw");

      tl.addLabel("fill", ">-0.15").to(
        cells,
        { autoAlpha: 1, backgroundColor: COLORS.silver, duration: 0.3 },
        "fill",
      );

      tl.addLabel("erase", "+=0.15")
        .to(vOuters, { scaleY: 0, duration: 0.4 }, "erase")
        .to(hOuters, { scaleX: 0, duration: 0.4 }, "erase");

      tl.addLabel("collapse")
        .to(
          vInnerL,
          { x: xTo(pos.vInnerL, cx), autoAlpha: 0, duration: 0.55 },
          "collapse",
        )
        .to(
          vInnerR,
          { x: xTo(pos.vInnerR, cx), autoAlpha: 0, duration: 0.55 },
          "collapse",
        )
        .to(
          hInnerT,
          { y: xTo(pos.hInnerT, cy), autoAlpha: 0, duration: 0.55 },
          "collapse",
        )
        .to(
          hInnerB,
          { y: xTo(pos.hInnerB, cy), autoAlpha: 0, duration: 0.55 },
          "collapse",
        )
        .to(q("[data-cell='tl']"), { backgroundColor: COLORS.steel, duration: 0.55 }, "collapse")
        .to(q("[data-cell='tr']"), { backgroundColor: COLORS.brand, duration: 0.55 }, "collapse")
        .to(q("[data-cell='bl']"), { backgroundColor: COLORS.silver, duration: 0.55 }, "collapse")
        .to(q("[data-cell='br']"), { backgroundColor: COLORS.steel, duration: 0.55 }, "collapse");

      const slide = { duration: 0.45, ease: "power3.inOut" };
      const slideIn = { yPercent: 0, autoAlpha: 1, ...slide };
      const slideOut = { yPercent: -100, autoAlpha: 0, ...slide };

      // Words wait for the line animation to finish so the two never overlap.
      tl.addLabel("words", "+=0.1").to(
        wordEng,
        { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" },
        "words",
      );

      tl.addLabel("mfg", "words+=0.8")
        .to(wordEng, slideOut, "mfg")
        .to(wordMfg, slideIn, "mfg");

      tl.addLabel("inn", "mfg+=0.8")
        .to(wordMfg, slideOut, "inn")
        .to(wordInn, slideIn, "inn")
        .to(prog, { n: 75, duration: 3.45, ease: "none", onUpdate: writeProg }, "erase");

      tl.addLabel("brand", "inn+=0.8")
        .to(wordInn, slideOut, "brand")
        .to(brand, slideIn, "brand")
        .to(prog, { n: 100, duration: 0.45, ease: "none", onUpdate: writeProg }, "brand");

      tl.addLabel("hold", "brand+=0.45").to({}, { duration: 0.4 }, "hold");

      const mid = vh / 2;

      tl.addLabel("reveal")
        .set(vInnerL, { autoAlpha: 0 })
        .set(vInnerR, { autoAlpha: 0 })
        .set(panelLeft, { scaleX: 0 })
        .set(panelRight, { scaleX: 0 })
        .set(hInnerT, { y: xTo(pos.hInnerT, mid), autoAlpha: 1 })
        .set(hInnerB, { y: xTo(pos.hInnerB, mid), autoAlpha: 1 })
        .to(panelTop, { scaleY: 0, ...MASK.split }, "reveal")
        .to(panelBottom, { scaleY: 0, ...MASK.split }, "reveal")
        .to(hInnerT, { y: xTo(pos.hInnerT, 0), ...MASK.split }, "reveal")
        .to(hInnerB, { y: xTo(pos.hInnerB, vh), ...MASK.split }, "reveal")
        .to(cells, { autoAlpha: 0, duration: MASK.fade.duration }, "reveal")
        .to(brand, { autoAlpha: 0, duration: MASK.fade.duration }, "reveal")
        .to(progressEl, { autoAlpha: 0, duration: MASK.fade.duration }, "reveal")
        .to(
          [hInnerT, hInnerB],
          { autoAlpha: 0, duration: MASK.lineFade.duration },
          `reveal+=${MASK.lineFade.at}`,
        );
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div
      ref={root}
      data-preloader
      className="fixed inset-0 z-50 overflow-hidden"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <div
        data-panel="top"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[calc(50%+1px)] origin-top bg-cream"
      />
      <div
        data-panel="bottom"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[calc(50%+1px)] origin-bottom bg-cream"
      />
      <div
        data-panel="left"
        className="pointer-events-none absolute inset-y-0 left-0 z-0 w-[calc(50%+1px)] origin-left bg-cream"
      />
      <div
        data-panel="right"
        className="pointer-events-none absolute inset-y-0 right-0 z-0 w-[calc(50%+1px)] origin-right bg-cream"
      />

      <PreloadLine line="v-outer-l" axis="v" dashed />
      <PreloadLine line="v-inner-l" axis="v" />
      <PreloadLine line="v-inner-r" axis="v" />
      <PreloadLine line="v-outer-r" axis="v" dashed />
      <PreloadLine line="h-outer-t" axis="h" dashed />
      <PreloadLine line="h-inner-t" axis="h" />
      <PreloadLine line="h-inner-b" axis="h" />
      <PreloadLine line="h-outer-b" axis="h" dashed />

      <div
        data-mark
        className="absolute top-0 left-0 z-20 grid h-[104px] w-[80px] grid-cols-2 grid-rows-2 gap-[8px]"
      >
        <span data-cell="tl" className="h-[48px] w-[36px] bg-silver opacity-0" />
        <span data-cell="tr" className="h-[48px] w-[36px] bg-silver opacity-0" />
        <span data-cell="bl" className="h-[48px] w-[36px] bg-silver opacity-0" />
        <span data-cell="br" className="h-[48px] w-[36px] bg-silver opacity-0" />
      </div>

      <div
        data-copy
        className="pointer-events-none absolute left-1/2 z-20 h-[13px] w-full -translate-x-1/2 overflow-hidden md:h-[20px]"
      >
        <p data-word="engineering" className={WORD_CLASS}>
          ENGINEERING
        </p>
        <p data-word="manufacturing" className={WORD_CLASS}>
          MANUFACTURING
        </p>
        <p data-word="innovation" className={WORD_CLASS}>
          INNOVATION
        </p>
        <div data-brand className="absolute inset-0 flex justify-center">
          <Image
            src="/brand/logo-wordmark.svg"
            alt="Thimark"
            width={5819}
            height={936}
            loading="eager"
            className="h-full w-auto"
          />
        </div>
      </div>

      <p
        data-progress
        className="pointer-events-none absolute right-8 bottom-8 z-30 font-heading text-[clamp(32px,4.4vw,64px)] leading-none text-steel tabular-nums"
      >
        0%
      </p>
    </div>
  );
}
