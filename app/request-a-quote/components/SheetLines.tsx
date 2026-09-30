import type { CSSProperties } from "react";
import PlusMark, { type PlusArms } from "@/app/components/PlusMark";

/** Horizontal rule at grid row `y`, from column `from` to column `to` (0–12). */
export type HLine = { y: number; from: number; to: number };
/** Vertical rule at column `x`, from grid row `from` to row `to`. */
export type VLine = { x: number; from: number; to: number };
export type Lines = { h: HLine[]; v: VLine[] };

type Span = [number, number];

const STOP = "var(--line-stop)";

function col(n: number) {
  return `calc(var(--g1-offset) + ${n} * var(--g1-col))`;
}

function merge(spans: Span[]): Span[] {
  const sorted = [...spans].sort((a, b) => a[0] - b[0]);
  const out: Span[] = [];
  for (const span of sorted) {
    const last = out[out.length - 1];
    if (last && span[0] <= last[1]) last[1] = Math.max(last[1], span[1]);
    else out.push([span[0], span[1]]);
  }
  return out;
}

function group<T>(items: T[], key: (item: T) => number, span: (item: T) => Span) {
  const map = new Map<number, Span[]>();
  for (const item of items) {
    const list = map.get(key(item)) ?? [];
    list.push(span(item));
    map.set(key(item), list);
  }
  return new Map([...map].map(([k, spans]) => [k, merge(spans)] as const));
}

export function joinLines(...sets: Lines[]): Lines {
  return { h: sets.flatMap((set) => set.h), v: sets.flatMap((set) => set.v) };
}

/**
 * Draws a sheet's rules from data: solid horizontals, dashed verticals, a
 * `--line-stop` gap at every joint and a PlusMark whose arms follow the lines.
 */
export default function SheetLines({ lines, rows }: { lines: Lines; rows: number }) {
  const hs = group(lines.h, (l) => l.y, (l) => [l.from, l.to]);
  const vs = group(lines.v, (l) => l.x, (l) => [l.from, l.to]);

  const yPos = (y: number) =>
    y >= rows ? "calc(100% - var(--plus-size) / 2)" : `calc(${y} * var(--row))`;

  const points = new Map<string, { x: number; y: number }>();
  const add = (x: number, y: number) => points.set(`${x},${y}`, { x, y });
  hs.forEach((spans, y) => spans.forEach(([a, b]) => (add(a, y), add(b, y))));
  vs.forEach((spans, x) => spans.forEach(([a, b]) => (add(x, a), add(x, b))));
  hs.forEach((hSpans, y) =>
    vs.forEach((vSpans, x) => {
      const onH = hSpans.some(([a, b]) => x >= a && x <= b);
      const onV = vSpans.some(([a, b]) => y >= a && y <= b);
      if (onH && onV) add(x, y);
    }),
  );

  const joints = new Map<string, PlusArms & { x: number; y: number }>();
  points.forEach(({ x, y }, id) => {
    const hSpans = hs.get(y) ?? [];
    const vSpans = vs.get(x) ?? [];
    const left = hSpans.some(([a, b]) => a < x && x <= b);
    const right = hSpans.some(([a, b]) => a <= x && x < b);
    if (!left && !right) return;
    const up = vSpans.some(([a, b]) => a < y && y <= b);
    const down = vSpans.some(([a, b]) => a <= y && y < b);
    joints.set(id, { x, y, left, right, up, down });
  });

  const isJoint = (x: number, y: number) => joints.has(`${x},${y}`);

  const hPieces: { y: number; a: number; b: number }[] = [];
  hs.forEach((spans, y) =>
    spans.forEach(([from, to]) => {
      const stops = [...joints.values()]
        .filter((j) => j.y === y && j.x > from && j.x < to)
        .map((j) => j.x);
      const marks = [from, ...stops.sort((p, q) => p - q), to];
      for (let i = 0; i < marks.length - 1; i += 1) hPieces.push({ y, a: marks[i], b: marks[i + 1] });
    }),
  );

  const vPieces: { x: number; a: number; b: number }[] = [];
  vs.forEach((spans, x) =>
    spans.forEach(([from, to]) => {
      const stops = [...joints.values()]
        .filter((j) => j.x === x && j.y > from && j.y < to)
        .map((j) => j.y);
      const marks = [from, ...stops.sort((p, q) => p - q), to];
      for (let i = 0; i < marks.length - 1; i += 1) vPieces.push({ x, a: marks[i], b: marks[i + 1] });
    }),
  );

  return (
    <>
      {hPieces.map(({ y, a, b }) => {
        const inA = isJoint(a, y) ? STOP : "0px";
        const inB = isJoint(b, y) ? STOP : "0px";
        const style: CSSProperties = {
          top: yPos(y),
          left: `calc(${col(a)} + ${inA})`,
          width: `calc(${col(b)} - ${col(a)} - ${inA} - ${inB})`,
        };
        return <span key={`h${y}-${a}`} aria-hidden data-rfq-rule className="rfq-line-h" style={style} />;
      })}
      {vPieces.map(({ x, a, b }) => {
        const inA = isJoint(x, a) ? STOP : "0px";
        const inB = isJoint(x, b) ? STOP : "0px";
        const top = `calc(${yPos(a)} + ${inA})`;
        const style: CSSProperties = {
          left: col(x),
          top,
          height: `calc(${yPos(b)} - ${yPos(a)} - ${inA} - ${inB})`,
          backgroundPosition: `0 calc(-1 * ${top})`,
        };
        return <span key={`v${x}-${a}`} aria-hidden className="rfq-line-v" style={style} />;
      })}
      {[...joints.values()].map(({ x, y, left, right, up, down }) => (
        <PlusMark
          key={`j${x}-${y}`}
          tone="page"
          arms={{ left, right, up, down }}
          className="rfq-joint"
          style={{ left: col(x), top: yPos(y) }}
        />
      ))}
    </>
  );
}
