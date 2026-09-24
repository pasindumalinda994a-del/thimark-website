"use client";

import { useEffect, useRef, useState, type AnchorHTMLAttributes } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const STEEL = "#575757";
const CREAM = "#f4f4ed";
const TARGET_CELL_W = 14;
const TARGET_CELL_H = 22;
const MAX_CELLS = 120;
const COVER_SCALE = 1.15;

type BrandButtonProps = {
  children: string;
  href?: string;
  font?: "heading" | "sans";
  tone?: "brand" | "steel" | "outline";
  className?: string;
  onClick?: () => void;
  "aria-label"?: string;
} & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "children" | "href" | "className" | "onClick"
>;

function gridFor(width: number, height: number) {
  if (!width || !height) return { cols: 1, rows: 1 };

  const startRows = Math.max(1, Math.round(height / TARGET_CELL_H));

  for (let rows = startRows; rows >= 1; rows -= 1) {
    const minCols = Math.floor((rows * width) / height) + 1;
    const maxCols = Math.floor(MAX_CELLS / rows);
    if (maxCols < minCols) continue;

    const targetCols = Math.round(width / TARGET_CELL_W);
    const cols = Math.min(maxCols, Math.max(minCols, targetCols));
    return { cols, rows };
  }

  return { cols: MAX_CELLS, rows: 1 };
}

function nearestIndex(cells: HTMLElement[], x: number, y: number) {
  let best = 0;
  let dist = Infinity;

  for (let i = 0; i < cells.length; i += 1) {
    const box = cells[i].getBoundingClientRect();
    const dx = x - (box.left + box.width / 2);
    const dy = y - (box.top + box.height / 2);
    const d = dx * dx + dy * dy;
    if (d < dist) {
      dist = d;
      best = i;
    }
  }

  return best;
}

export default function BrandButton({
  children,
  href = "#",
  font = "heading",
  tone = "brand",
  className = "",
  onClick,
  "aria-label": ariaLabel,
  ...rest
}: BrandButtonProps) {
  const root = useRef<HTMLAnchorElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const [grid, setGrid] = useState({ cols: 1, rows: 1 });

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const measure = () => {
      const next = gridFor(el.clientWidth, el.clientHeight);
      setGrid((current) =>
        current.cols === next.cols && current.rows === next.rows
          ? current
          : next,
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    (_context, contextSafe) => {
      const rootEl = root.current;
      const labelEl = label.current;
      if (!rootEl || !labelEl || !contextSafe) return;

      const cells = gsap.utils.toArray<HTMLElement>("[data-pixel]", rootEl);
      gsap.set(cells, { scale: 0, autoAlpha: 0 });
      gsap.set(labelEl, { clearProps: "color" });

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      let tl: gsap.core.Timeline | undefined;

      const build = (from: number | "random") => {
        tl?.kill();
        tl = gsap.timeline({
          paused: true,
          defaults: { ease: "power3.out", overwrite: "auto" },
          onReverseComplete: () => {
            gsap.set(labelEl, { clearProps: "color" });
          },
        });
        tl.fromTo(
          cells,
          { scale: 0, autoAlpha: 0 },
          {
            scale: COVER_SCALE,
            autoAlpha: 1,
            duration: 0.32,
            force3D: false,
            stagger: { amount: 0.38, from },
          },
          0,
        );
        tl.to(labelEl, { color: STEEL, duration: 0.22, ease: "power2.out" }, 0);
      };

      const enter = contextSafe((event: Event) => {
        if (reduced) {
          gsap.set(cells, { scale: COVER_SCALE, autoAlpha: 1 });
          gsap.set(labelEl, { color: STEEL });
          return;
        }

        if (tl && tl.progress() > 0) {
          tl.play();
          return;
        }

        const point = event as PointerEvent;
        const from =
          Number.isFinite(point.clientX) && Number.isFinite(point.clientY)
            ? nearestIndex(cells, point.clientX, point.clientY)
            : "random";
        build(from);
        tl?.play();
      });

      const leave = contextSafe(() => {
        if (reduced) {
          gsap.set(cells, { scale: 0, autoAlpha: 0 });
          gsap.set(labelEl, { clearProps: "color" });
          return;
        }
        tl?.reverse();
      });

      rootEl.addEventListener("pointerenter", enter);
      rootEl.addEventListener("pointerleave", leave);
      rootEl.addEventListener("focus", enter);
      rootEl.addEventListener("blur", leave);

      return () => {
        rootEl.removeEventListener("pointerenter", enter);
        rootEl.removeEventListener("pointerleave", leave);
        rootEl.removeEventListener("focus", enter);
        rootEl.removeEventListener("blur", leave);
        tl?.kill();
      };
    },
    { scope: root, dependencies: [grid.cols, grid.rows], revertOnUpdate: true },
  );

  return (
    <a
      ref={root}
      href={href}
      onClick={onClick}
      aria-label={ariaLabel}
      {...rest}
      className={`group relative inline-flex h-[111px] overflow-hidden ${
        tone === "steel"
          ? "bg-steel"
          : tone === "outline"
            ? "bg-transparent"
            : "bg-brand"
      } ${className}`}
    >
      <span
        className="pointer-events-none absolute inset-0 grid h-full w-full gap-0"
        style={{
          gridTemplateColumns: `repeat(${grid.cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${grid.rows}, minmax(0, 1fr))`,
        }}
        aria-hidden
      >
        {Array.from({ length: grid.cols * grid.rows }, (_, i) => (
          <span
            key={i}
            data-pixel
            className="min-h-0 min-w-0 origin-center bg-cream"
          />
        ))}
      </span>
      {tone === "steel" || tone === "outline" ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-2"
          style={{
            boxShadow: `inset 0 0 0 1px ${tone === "steel" ? STEEL : CREAM}`,
          }}
        />
      ) : null}
      <span
        ref={label}
        className={`relative z-3 flex h-full w-full items-center justify-center text-[12px] leading-none font-normal text-white uppercase group-hover:text-steel! group-focus-visible:text-steel! ${
          font === "sans" ? "font-sans" : "font-heading"
        }`}
      >
        {children}
      </span>
    </a>
  );
}
