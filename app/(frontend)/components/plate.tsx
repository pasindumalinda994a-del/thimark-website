import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import PlusMark, { type PlusArms } from "@/app/(frontend)/components/PlusMark";
import { GridLine, type GridTone } from "@/app/(frontend)/components/SectionGrid";

/** [colStart, colEnd, rowStart, rowEnd] on the G1 line grid. */
export type Span = readonly [number, number, number, number];

type CellProps = {
  at: Span;
  as?: "div" | "article" | "aside" | "figure" | "header" | "blockquote" | "dl";
  className?: string;
  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "children" | "className">;

/** Stacks in source order on mobile; seated on the line grid from md up. */
export function Cell({ at, as: Tag = "div", className = "", style, children, ...rest }: CellProps) {
  const [c0, c1, r0, r1] = at;
  const seat = { "--c0": c0, "--c1": c1, "--r0": r0, "--r1": r1, ...style } as CSSProperties;
  return (
    <Tag className={`plate-cell ${className}`} style={seat} {...rest}>
      {children}
    </Tag>
  );
}

/** [row, fromCol, toCol] */
export type HLine = readonly [number, number, number];
/** [col, fromRow, toRow] */
export type VLine = readonly [number, number, number];

const colX = (c: number) => `calc(var(--g1-offset) + ${c} * var(--g1-col))`;
const rowY = (r: number) => `calc(${r} * var(--row))`;

function within(value: number, from: number, to: number) {
  return value >= from && value <= to;
}

/** [col, row, arms] — a joint that also reaches into a neighbouring block. */
export type Join = readonly [number, number, PlusArms];

/**
 * Desktop rails for one section. Joints are derived from where the lines
 * meet, so a layout only lists its lines. `joins` adds arms (or whole joints)
 * where a rail carries on into the next stacked block.
 */
export function Frame({
  h,
  v,
  joins = [],
}: {
  h: readonly HLine[];
  v: readonly VLine[];
  joins?: readonly Join[];
}) {
  const joints = new Map<string, { c: number; r: number; arms: PlusArms }>();

  for (const [r, hc0, hc1] of h) {
    for (const [c, vr0, vr1] of v) {
      if (!within(c, hc0, hc1) || !within(r, vr0, vr1)) continue;
      const key = `${c}:${r}`;
      const prev = joints.get(key)?.arms ?? {};
      joints.set(key, {
        c,
        r,
        arms: {
          up: prev.up || vr0 < r,
          down: prev.down || vr1 > r,
          left: prev.left || hc0 < c,
          right: prev.right || hc1 > c,
        },
      });
    }
  }

  for (const [c, r, extra] of joins) {
    const key = `${c}:${r}`;
    const arms: PlusArms = { ...joints.get(key)?.arms };
    for (const [hr, hc0, hc1] of h) {
      if (hr !== r || !within(c, hc0, hc1)) continue;
      arms.left = arms.left || hc0 < c;
      arms.right = arms.right || hc1 > c;
    }
    joints.set(key, {
      c,
      r,
      arms: {
        up: arms.up || extra.up,
        down: arms.down || extra.down,
        left: arms.left || extra.left,
        right: arms.right || extra.right,
      },
    });
  }

  const stops = (line: "h" | "v", at: number, from: number, to: number) => {
    const points = new Set([from, to]);
    joints.forEach((j) => {
      if (line === "h" && j.r === at && within(j.c, from, to)) points.add(j.c);
      if (line === "v" && j.c === at && within(j.r, from, to)) points.add(j.r);
    });
    return [...points].sort((a, b) => a - b);
  };

  const segments: ReactNode[] = [];

  h.forEach(([r, c0, c1]) => {
    const pts = stops("h", r, c0, c1);
    for (let i = 0; i < pts.length - 1; i += 1) {
      const a = pts[i];
      const b = pts[i + 1];
      segments.push(
        <GridLine
          key={`h-${r}-${a}-${b}`}
          axis="h"
          unstyled
          tone="page"
          className="hidden md:block"
          style={{
            top: rowY(r),
            left: `calc(${colX(a)} + var(--line-stop))`,
            width: `calc(${b - a} * var(--g1-col) - 2 * var(--line-stop))`,
          }}
        />,
      );
    }
  });

  v.forEach(([c, r0, r1]) => {
    const pts = stops("v", c, r0, r1);
    for (let i = 0; i < pts.length - 1; i += 1) {
      const a = pts[i];
      const b = pts[i + 1];
      segments.push(
        <GridLine
          key={`v-${c}-${a}-${b}`}
          axis="v"
          unstyled
          tone="page"
          className="hidden md:block"
          style={{
            left: colX(c),
            top: `calc(${rowY(a)} + var(--line-stop))`,
            height: `calc(${b - a} * var(--row) - 2 * var(--line-stop))`,
          }}
        />,
      );
    }
  });

  return (
    <>
      {segments}
      {[...joints.values()].map(({ c, r, arms }) => (
        <PlusMark
          key={`j-${c}-${r}`}
          tone="page"
          arms={arms}
          className="hidden md:block"
          style={{ left: colX(c), top: rowY(r) }}
        />
      ))}
    </>
  );
}

/**
 * A run of grid rows inside a section that grows to fit its content
 * (`plate-auto`). Cells and Frame lines inside it count rows from its top.
 */
export function PlateBlock({
  rows,
  className = "",
  children,
  ...rest
}: { rows: number; className?: string; children?: ReactNode } & Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "className"
>) {
  return (
    <div
      className={`plate-block ${className}`}
      style={{ "--block-rows": rows } as CSSProperties}
      {...rest}
    >
      {children}
    </div>
  );
}

const joinLeftEdge: PlusArms = { up: true, down: true, left: false, right: true };
const joinRightEdge: PlusArms = { up: true, down: true, left: true, right: false };

/** Mobile side rails for a stacked block, closed by a foot line unless `open`. */
export function MobileEdge({ open = false }: { open?: boolean }) {
  const rail = open ? "hero-v-below-plus" : "hero-v-between-pluses";
  return (
    <>
      <GridLine axis="v" unstyled tone="page" className={`v-g1-0 ${rail} md:hidden`} />
      <GridLine axis="v" unstyled tone="page" className={`v-g1-12 ${rail} md:hidden`} />
      {open ? null : (
        <>
          <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
          <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 at-bottom md:hidden" />
          <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-bottom md:hidden" />
        </>
      )}
    </>
  );
}

/** Four registration marks inset 16px from a media or glyph frame. */
export function Corners({ tone = "page" }: { tone?: GridTone | "brand" }) {
  return (
    <>
      <PlusMark tone={tone} className="top-4 left-4 z-10" />
      <PlusMark tone={tone} className="top-4 left-[calc(100%-16px)] z-10" />
      <PlusMark tone={tone} className="top-[calc(100%-16px)] left-4 z-10" />
      <PlusMark tone={tone} className="top-[calc(100%-16px)] left-[calc(100%-16px)] z-10" />
    </>
  );
}

/** Section eyebrow with its page index, e.g. "02  Where We Are Going". */
export function Eyebrow({
  index,
  children,
  className = "",
  ...rest
}: { index?: string; children: ReactNode; className?: string } & Omit<
  HTMLAttributes<HTMLParagraphElement>,
  "children" | "className"
>) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${className}`} {...rest}>
      {index ? <span className="tabular-nums opacity-60">{index}</span> : null}
      <span>{children}</span>
    </p>
  );
}
