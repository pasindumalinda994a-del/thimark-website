"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";

gsap.registerPlugin(useGSAP);

const COLORS = {
  steel: "#575757",
  brand: "#8a151c",
  silver: "#c0c0c0",
} as const;

const MARK_W = 78;
const MARK_H = 100;
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

export default function PreLoading() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(alreadyPreloaded);
  const lenis = useLenis();

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

  useGSAP(
    (_context, contextSafe) => {
      const el = root.current;
      if (!el || !contextSafe) return;
      if (alreadyPreloaded()) {
        setDone(true);
        return;
      }

      const finish = contextSafe(() => {
        document.documentElement.dataset.preloaded = "true";
        window.dispatchEvent(new CustomEvent("thimark:preload-done"));
        setDone(true);
      });

      const q = gsap.utils.selector(el);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mx = Math.round((vw - MARK_W) / 2);
      const my = Math.round((vh - MARK_H) / 2);
      const cx = mx + MARK_W / 2;
      const cy = my + MARK_H / 2;
      const halfW = vw / 2;
      const halfH = vh / 2;

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
      const innerLines = [...vInnerL, ...vInnerR, ...hInnerT, ...hInnerB];
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
        vInnerR: mx + 41,
        vOuterR: mx + 78,
        hOuterT: my - 1,
        hInnerT: my + 47,
        hInnerB: my + 52,
        hOuterB: my + 100,
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
      gsap.set(titles, { yPercent: 100 });

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
        .to(vLines, { scaleY: 1, duration: 1.15 }, "draw")
        .to(hLines, { scaleX: 1, duration: 0.8 }, "draw")
        .to(prog, { n: 20, duration: 1.15, ease: "none", onUpdate: writeProg }, "draw");

      tl.addLabel("fill", ">-0.25").to(
        cells,
        { autoAlpha: 1, backgroundColor: COLORS.silver, duration: 0.25 },
        "fill",
      );

      tl.addLabel("erase")
        .to(vOuters, { scaleY: 0, duration: 0.45 }, "erase")
        .to(hOuters, { scaleX: 0, duration: 0.45 }, "erase");

      tl.addLabel("collapse")
        .to(
          vInnerL,
          { x: xTo(pos.vInnerL, cx), autoAlpha: 0, duration: 0.6 },
          "collapse",
        )
        .to(
          vInnerR,
          { x: xTo(pos.vInnerR, cx), autoAlpha: 0, duration: 0.6 },
          "collapse",
        )
        .to(
          hInnerT,
          { y: xTo(pos.hInnerT, cy), autoAlpha: 0, duration: 0.6 },
          "collapse",
        )
        .to(
          hInnerB,
          { y: xTo(pos.hInnerB, cy), autoAlpha: 0, duration: 0.6 },
          "collapse",
        )
        .to(q("[data-cell='tl']"), { backgroundColor: COLORS.steel, duration: 0.6 }, "collapse")
        .to(q("[data-cell='tr']"), { backgroundColor: COLORS.brand, duration: 0.6 }, "collapse")
        .to(q("[data-cell='bl']"), { backgroundColor: COLORS.silver, duration: 0.6 }, "collapse")
        .to(q("[data-cell='br']"), { backgroundColor: COLORS.steel, duration: 0.6 }, "collapse")
        .to(prog, { n: 50, duration: 1.55, ease: "none", onUpdate: writeProg }, "erase");

      const slide = { duration: 0.55, ease: "power3.inOut" };

      tl.addLabel("words").to(
        wordEng,
        { yPercent: 0, duration: 0.55, ease: "power3.out" },
        "words",
      );

      tl.addLabel("mfg", "+=0.25")
        .to(wordEng, { yPercent: -100, ...slide }, "mfg")
        .to(wordMfg, { yPercent: 0, ...slide }, "mfg");

      tl.addLabel("inn", "+=0.25")
        .to(wordMfg, { yPercent: -100, ...slide }, "inn")
        .to(wordInn, { yPercent: 0, ...slide }, "inn")
        .to(prog, { n: 85, duration: 1.6, ease: "none", onUpdate: writeProg }, "mfg");

      tl.addLabel("brand", "+=0.25")
        .to(wordInn, { yPercent: -100, ...slide }, "brand")
        .to(brand, { yPercent: 0, ...slide }, "brand")
        .to(prog, { n: 100, duration: 1.2, ease: "none", onUpdate: writeProg }, "brand");

      tl.addLabel("hold").to({}, { duration: 0.4 });

      const holeX = mx / halfW;
      const holeY = my / halfH;
      const holeR = (vw - (mx + MARK_W)) / halfW;
      const holeB = (vh - (my + MARK_H)) / halfH;

      tl.addLabel("reveal")
        .set(innerLines, { autoAlpha: 1 })
        .to(vInnerL, { x: xTo(pos.vInnerL, pos.vOuterL), duration: 0.5 }, "reveal")
        .to(vInnerR, { x: xTo(pos.vInnerR, pos.vOuterR), duration: 0.5 }, "reveal")
        .to(hInnerT, { y: xTo(pos.hInnerT, pos.hOuterT), duration: 0.5 }, "reveal")
        .to(hInnerB, { y: xTo(pos.hInnerB, pos.hOuterB), duration: 0.5 }, "reveal")
        .to(panelTop, { scaleY: holeY, duration: 0.5 }, "reveal")
        .to(panelBottom, { scaleY: holeB, duration: 0.5 }, "reveal")
        .to(panelLeft, { scaleX: holeX, duration: 0.5 }, "reveal")
        .to(panelRight, { scaleX: holeR, duration: 0.5 }, "reveal")
        .to(cells, { autoAlpha: 0, duration: 0.3 }, "reveal")
        .to(brand, { autoAlpha: 0, duration: 0.3 }, "reveal")
        .to(progressEl, { autoAlpha: 0, duration: 0.3 }, "reveal");

      tl.addLabel("expand")
        .to(vInnerL, { x: xTo(pos.vInnerL, 0), duration: 0.9 }, "expand")
        .to(vInnerR, { x: xTo(pos.vInnerR, vw), duration: 0.9 }, "expand")
        .to(hInnerT, { y: xTo(pos.hInnerT, 0), duration: 0.9 }, "expand")
        .to(hInnerB, { y: xTo(pos.hInnerB, vh), duration: 0.9 }, "expand")
        .to(panelTop, { scaleY: 0, duration: 0.9 }, "expand")
        .to(panelBottom, { scaleY: 0, duration: 0.9 }, "expand")
        .to(panelLeft, { scaleX: 0, duration: 0.9 }, "expand")
        .to(panelRight, { scaleX: 0, duration: 0.9 }, "expand")
        .to(innerLines, { autoAlpha: 0, duration: 0.4 }, "expand+=0.5");
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div
      ref={root}
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
        className="absolute top-0 left-0 z-20 grid h-[100px] w-[78px] grid-cols-2 grid-rows-2 gap-[6px]"
      >
        <span data-cell="tl" className="h-[47px] w-[36px] bg-silver opacity-0" />
        <span data-cell="tr" className="h-[47px] w-[36px] bg-silver opacity-0" />
        <span data-cell="bl" className="h-[47px] w-[36px] bg-silver opacity-0" />
        <span data-cell="br" className="h-[47px] w-[36px] bg-silver opacity-0" />
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
        <p data-brand className={WORD_CLASS}>
          THIMARK
        </p>
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
