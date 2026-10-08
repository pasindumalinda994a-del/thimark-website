"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const CREAM = "#f4f4ed";
const STEEL = "#575757";
const BRAND = "#8a151c";
const SIZE = 24;
const CENTER = SIZE / 2;
const PLUS = 13;
const MARK = 7;
const FRAME_W = 128;
const FRAME_H = 56;
const SPREAD_X = FRAME_W / 2 - MARK / 2;
const SPREAD_Y = FRAME_H / 2 - MARK / 2;
const DASH = "4 4";
const INTERACTIVE =
  "a, button, [role='button'], [data-cursor='interactive']";
const EXPLORE = "[data-cursor='explore']";
const TEXT_FIELD =
  "input, textarea, select, [contenteditable]:not([contenteditable='false'])";

type Plate = "light" | "dark";
type Kind = "idle" | "interactive" | "explore";

function isCreamToken(value: string) {
  const token = value.toLowerCase();
  return (
    token.includes("cream") ||
    token.includes("#f4f4ed") ||
    token.includes("244, 244, 237")
  );
}

function isSteelToken(value: string) {
  const token = value.toLowerCase();
  return (
    token.includes("steel") ||
    token.includes("#575757") ||
    token.includes("87, 87, 87")
  );
}

function luminanceOf(bg: string) {
  const match = bg.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i,
  );
  if (!match) return null;
  const alpha = match[4] === undefined ? 1 : Number(match[4]);
  if (alpha < 0.45) return null;
  const r = Number(match[1]) / 255;
  const g = Number(match[2]) / 255;
  const b = Number(match[3]) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function plateFromPoint(x: number, y: number): Plate {
  const hits = document.elementsFromPoint(x, y);
  for (const hit of hits) {
    if (!(hit instanceof Element)) continue;
    if (hit.closest("[data-custom-cursor]")) continue;

    let node: HTMLElement | null =
      hit instanceof HTMLElement ? hit : hit.parentElement;

    while (node) {
      const pageBg = getComputedStyle(node).getPropertyValue("--page-bg").trim();
      if (pageBg) {
        if (isCreamToken(pageBg)) return "light";
        if (isSteelToken(pageBg)) return "dark";
      }
      node = node.parentElement;
    }

    node = hit instanceof HTMLElement ? hit : hit.parentElement;
    while (node && node !== document.documentElement) {
      const lum = luminanceOf(getComputedStyle(node).backgroundColor);
      if (lum !== null) return lum > 0.55 ? "light" : "dark";
      node = node.parentElement;
    }
    break;
  }
  return "dark";
}

function kindAt(x: number, y: number): Kind {
  const hits = document.elementsFromPoint(x, y);
  for (const hit of hits) {
    if (!(hit instanceof Element)) continue;
    if (hit.closest("[data-custom-cursor]")) continue;
    if (hit.closest(EXPLORE)) return "explore";
    const target = hit.closest(INTERACTIVE);
    if (!target) return "idle";
    if (target.closest("[disabled], [aria-disabled='true']")) return "idle";
    return "interactive";
  }
  return "idle";
}

function isTextFieldAt(x: number, y: number) {
  const hits = document.elementsFromPoint(x, y);
  for (const hit of hits) {
    if (!(hit instanceof Element)) continue;
    if (hit.closest("[data-custom-cursor]")) continue;
    return Boolean(hit.closest(TEXT_FIELD));
  }
  return false;
}

function palette(plate: Plate, kind: Kind) {
  if (kind === "explore") return { ink: CREAM, halo: STEEL };
  if (kind === "interactive") return { ink: BRAND, halo: CREAM };
  if (plate === "light") return { ink: STEEL, halo: CREAM };
  return { ink: CREAM, halo: STEEL };
}

function DualPlus({
  cx,
  cy,
  size,
  ink,
  halo,
}: {
  cx: number;
  cy: number;
  size: number;
  ink: string;
  halo: string;
}) {
  const half = size / 2;
  return (
    <>
      <line
        x1={cx - half}
        y1={cy}
        x2={cx + half}
        y2={cy}
        stroke={halo}
        strokeWidth="2"
        strokeLinecap="square"
        data-cursor-halo
      />
      <line
        x1={cx}
        y1={cy - half}
        x2={cx}
        y2={cy + half}
        stroke={halo}
        strokeWidth="2"
        strokeLinecap="square"
        data-cursor-halo
      />
      <line
        x1={cx - half}
        y1={cy}
        x2={cx + half}
        y2={cy}
        stroke={ink}
        strokeWidth="1.5"
        strokeLinecap="square"
        data-cursor-ink
      />
      <line
        x1={cx}
        y1={cy - half}
        x2={cx}
        y2={cy + half}
        stroke={ink}
        strokeWidth="1.5"
        strokeLinecap="square"
        data-cursor-ink
      />
    </>
  );
}

function DualDash({
  x1,
  y1,
  x2,
  y2,
  ink,
  halo,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  ink: string;
  halo: string;
}) {
  return (
    <>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={halo}
        strokeWidth="2"
        strokeDasharray={DASH}
        strokeLinecap="square"
        data-cursor-halo
      />
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={ink}
        strokeWidth="1.5"
        strokeDasharray={DASH}
        strokeLinecap="square"
        data-cursor-ink
      />
    </>
  );
}

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const headRef = useRef<HTMLDivElement>(null);
  const plusRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      const on = fine.matches && !motion.matches;
      setEnabled(on);
      document.documentElement.classList.toggle("has-custom-cursor", on);
    };

    sync();
    fine.addEventListener("change", sync);
    motion.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  useGSAP(
    (_ctx, contextSafe) => {
      if (!enabled || !contextSafe) return;

      const head = headRef.current;
      const plus = plusRef.current;
      const explore = exploreRef.current;
      if (!head || !plus || !explore) return;

      gsap.set(head, {
        xPercent: -50,
        yPercent: -50,
        opacity: 0,
        scale: 1,
      });
      const dashBox = explore.querySelector<HTMLElement>("[data-explore-dashes]");
      const label = explore.querySelector<HTMLElement>("[data-explore-label]");
      const marks = gsap.utils.toArray<HTMLElement>(
        explore.querySelectorAll("[data-explore-plus]"),
      );
      const spin = plus.querySelector<HTMLElement>("[data-plus-spin]");
      const idleInk = plus.querySelectorAll("[data-cursor-ink]");
      const idleHalo = plus.querySelectorAll("[data-cursor-halo]");
      const exploreInk = explore.querySelectorAll("[data-cursor-ink]");
      const exploreHalo = explore.querySelectorAll("[data-cursor-halo]");
      const corners = [
        { x: -SPREAD_X, y: -SPREAD_Y },
        { x: SPREAD_X, y: -SPREAD_Y },
        { x: -SPREAD_X, y: SPREAD_Y },
        { x: SPREAD_X, y: SPREAD_Y },
      ];

      if (!dashBox || !label || !spin || marks.length !== 4) return;

      gsap.set(marks, {
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        opacity: 0,
      });
      gsap.set(dashBox, { scale: 0.15, opacity: 0 });
      gsap.set(label, { opacity: 0 });
      gsap.set(explore, { opacity: 1 });
      gsap.set(plus, { opacity: 1, visibility: "visible" });
      gsap.set(spin, { rotation: 0 });

      const exploreTl = gsap.timeline({
        paused: true,
        defaults: { duration: 0.42, ease: "power3.out" },
      });
      exploreTl.to(plus, { opacity: 0, visibility: "visible" }, 0);
      exploreTl.to(label, { opacity: 1 }, 0);
      exploreTl.to(dashBox, { scale: 1, opacity: 1 }, 0);
      marks.forEach((mark, i) => {
        exploreTl.to(
          mark,
          { x: corners[i].x, y: corners[i].y, opacity: 1 },
          i * 0.04,
        );
      });

      const xTo = gsap.quickTo(head, "x", {
        duration: 0.08,
        ease: "power2.out",
      });
      const yTo = gsap.quickTo(head, "y", {
        duration: 0.08,
        ease: "power2.out",
      });

      let snapped = false;
      let visible = false;
      let overText = false;
      let plate: Plate = "dark";
      let kind: Kind = "idle";

      const show = () => {
        if (overText) return;
        visible = true;
        gsap.set(head, { opacity: 1 });
      };

      const hide = () => {
        visible = false;
        snapped = false;
        gsap.set(head, { opacity: 0 });
        exploreTl.reverse();
      };

      const paint = (nextPlate: Plate, nextKind: Kind) => {
        const colors = palette(nextPlate, nextKind);
        const exploring = nextKind === "explore";
        gsap.to(idleInk, {
          stroke: colors.ink,
          duration: 0.22,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(idleHalo, {
          stroke: colors.halo,
          duration: 0.22,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(exploreInk, {
          stroke: CREAM,
          duration: 0.22,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(exploreHalo, {
          stroke: STEEL,
          duration: 0.22,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(spin, {
          rotation: nextKind === "interactive" ? 45 : 0,
          duration: 0.22,
          ease: "power2.out",
          overwrite: "auto",
        });
        if (exploring) exploreTl.play();
        else exploreTl.reverse();
      };

      const onMove = contextSafe((event: PointerEvent) => {
        const x = event.clientX;
        const y = event.clientY;

        if (isTextFieldAt(x, y)) {
          overText = true;
          hide();
          return;
        }

        overText = false;

        if (!snapped) {
          snapped = true;
          gsap.set(head, { x, y });
        }

        xTo(x);
        yTo(y);
        show();

        const nextPlate = plateFromPoint(x, y);
        const nextKind = kindAt(x, y);
        if (nextPlate === plate && nextKind === kind) return;
        plate = nextPlate;
        kind = nextKind;
        paint(plate, kind);
      });

      const onLeave = contextSafe(() => {
        hide();
      });

      const onDown = contextSafe((event: PointerEvent) => {
        if (event.button !== 0 || overText || !visible) return;
        gsap.to(head, {
          scale: 0.82,
          duration: 0.08,
          ease: "power2.out",
          overwrite: "auto",
        });
      });

      const onUp = contextSafe(() => {
        gsap.to(head, {
          scale: 1,
          duration: 0.22,
          ease: "power2.out",
          overwrite: "auto",
        });
      });

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
      document.documentElement.addEventListener("pointerleave", onLeave);

      return () => {
        exploreTl.kill();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        document.documentElement.removeEventListener("pointerleave", onLeave);
      };
    },
    { dependencies: [enabled] },
  );

  if (!enabled) return null;

  const idle = palette("dark", "idle");
  const explore = palette("dark", "explore");
  const inset = MARK / 2;

  return (
    <div
      ref={headRef}
      data-custom-cursor
      className="pointer-events-none fixed top-0 left-0 z-[100] will-change-transform"
      aria-hidden="true"
    >
      <div ref={plusRef} className="will-change-transform">
        <div data-plus-spin className="origin-center will-change-transform">
          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            fill="none"
            overflow="visible"
          >
            <DualPlus
              cx={CENTER}
              cy={CENTER}
              size={PLUS}
              ink={idle.ink}
              halo={idle.halo}
            />
          </svg>
        </div>
      </div>
      <div
        ref={exploreRef}
        className="absolute top-1/2 left-1/2 h-14 w-32 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          data-explore-dashes
          className="absolute inset-0 origin-center"
        >
          <svg
            width={FRAME_W}
            height={FRAME_H}
            viewBox={`0 0 ${FRAME_W} ${FRAME_H}`}
            fill="none"
            overflow="visible"
          >
            <DualDash
              x1={inset + MARK}
              y1={inset}
              x2={FRAME_W - inset - MARK}
              y2={inset}
              ink={explore.ink}
              halo={explore.halo}
            />
            <DualDash
              x1={inset + MARK}
              y1={FRAME_H - inset}
              x2={FRAME_W - inset - MARK}
              y2={FRAME_H - inset}
              ink={explore.ink}
              halo={explore.halo}
            />
            <DualDash
              x1={inset}
              y1={inset + MARK}
              x2={inset}
              y2={FRAME_H - inset - MARK}
              ink={explore.ink}
              halo={explore.halo}
            />
            <DualDash
              x1={FRAME_W - inset}
              y1={inset + MARK}
              x2={FRAME_W - inset}
              y2={FRAME_H - inset - MARK}
              ink={explore.ink}
              halo={explore.halo}
            />
          </svg>
        </div>
        <span
          data-explore-label
          className="absolute inset-0 z-10 flex items-center justify-center px-3 text-center font-heading text-[10px] leading-none font-medium tracking-[0.08em] whitespace-nowrap text-cream uppercase"
          style={{
            textShadow: `-1px 0 ${STEEL}, 1px 0 ${STEEL}, 0 -1px ${STEEL}, 0 1px ${STEEL}`,
          }}
        >
          Click to view
        </span>
        {([0, 1, 2, 3] as const).map((i) => (
          <div
            key={i}
            data-explore-plus
            className="absolute top-1/2 left-1/2"
          >
            <svg
              width={MARK}
              height={MARK}
              viewBox={`0 0 ${MARK} ${MARK}`}
              fill="none"
              overflow="visible"
            >
              <DualPlus
                cx={inset}
                cy={inset}
                size={MARK}
                ink={explore.ink}
                halo={explore.halo}
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
