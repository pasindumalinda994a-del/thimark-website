import type { SVGAttributes } from "react";

export type GlyphKind =
  | "precision"
  | "engineering"
  | "fabrication"
  | "oem"
  | "machinery"
  | "automation";

type P3 = [number, number, number];

type Seg = {
  pts: P3[];
  hidden?: boolean;
  closed?: boolean;
};

const VIEW_W = 200;
const VIEW_H = 140;
const MARGIN = 10;
const COS30 = 0.8660254;
const SIN30 = 0.5;
const CIRCLE_STEPS = 28;

function iso([a, b, c]: P3): [number, number] {
  return [(a - b) * COS30, (a + b) * SIN30 - c];
}

function circleTop(cx: number, cy: number, z: number, r: number): P3[] {
  return Array.from({ length: CIRCLE_STEPS }, (_, i) => {
    const t = (i / CIRCLE_STEPS) * Math.PI * 2;
    return [cx + r * Math.cos(t), cy + r * Math.sin(t), z] as P3;
  });
}

function circleSide(a: number, cb: number, cc: number, r: number): P3[] {
  return Array.from({ length: CIRCLE_STEPS }, (_, i) => {
    const t = (i / CIRCLE_STEPS) * Math.PI * 2;
    return [a, cb + r * Math.cos(t), cc + r * Math.sin(t)] as P3;
  });
}

function box(
  a0: number,
  b0: number,
  c0: number,
  a1: number,
  b1: number,
  c1: number,
): Seg[] {
  return [
    // top face
    {
      pts: [
        [a0, b0, c1],
        [a1, b0, c1],
        [a1, b1, c1],
        [a0, b1, c1],
      ],
      closed: true,
    },
    // front-right face (+a)
    {
      pts: [
        [a1, b0, c0],
        [a1, b1, c0],
        [a1, b1, c1],
      ],
    },
    { pts: [[a1, b0, c0], [a1, b0, c1]] },
    // front-left face (+b)
    { pts: [[a0, b1, c0], [a1, b1, c0]] },
    { pts: [[a0, b1, c0], [a0, b1, c1]] },
    // hidden back edges
    { pts: [[a0, b0, c0], [a1, b0, c0]], hidden: true },
    { pts: [[a0, b0, c0], [a0, b1, c0]], hidden: true },
    { pts: [[a0, b0, c0], [a0, b0, c1]], hidden: true },
  ];
}

function extrude(
  profile: [number, number][],
  a0: number,
  a1: number,
): Seg[] {
  const front: P3[] = profile.map(([b, c]) => [a1, b, c]);
  const back: P3[] = profile.map(([b, c]) => [a0, b, c]);
  const links: Seg[] = profile.map(([b, c], i) => ({
    pts: [
      [a0, b, c],
      [a1, b, c],
    ],
    hidden: i % 3 === 1,
  }));
  return [
    { pts: front, closed: true },
    { pts: back, closed: true, hidden: true },
    ...links,
  ];
}

const I_PROFILE: [number, number][] = [
  [0, 0],
  [4, 0],
  [4, 0.6],
  [2.35, 0.6],
  [2.35, 3.4],
  [4, 3.4],
  [4, 4],
  [0, 4],
  [0, 3.4],
  [1.65, 3.4],
  [1.65, 0.6],
  [0, 0.6],
];

const L_PROFILE: [number, number][] = [
  [0, 0],
  [4.4, 0],
  [4.4, 0.6],
  [0.6, 0.6],
  [0.6, 4.2],
  [0, 4.2],
];

const GLYPHS: Record<GlyphKind, Seg[]> = {
  precision: [
    ...box(0, 0, 0, 8, 5, 0.8),
    { pts: circleTop(2.2, 2.5, 0.8, 0.9), closed: true },
    { pts: circleTop(2.2, 2.5, 0, 0.9), closed: true, hidden: true },
    { pts: circleTop(5.8, 2.5, 0.8, 0.9), closed: true },
    { pts: circleTop(5.8, 2.5, 0, 0.9), closed: true, hidden: true },
    { pts: circleTop(4, 1.1, 0.8, 0.28), closed: true },
    { pts: circleTop(4, 3.9, 0.8, 0.28), closed: true },
    // datum line across the top face
    {
      pts: [
        [-0.8, 2.5, 0.8],
        [8.8, 2.5, 0.8],
      ],
      hidden: true,
    },
  ],
  engineering: [
    ...box(0, 0, 0, 5, 5, 3),
    // section cut: inner offset box on the top face
    {
      pts: [
        [1, 1, 3],
        [4, 1, 3],
        [4, 4, 3],
        [1, 4, 3],
      ],
      closed: true,
      hidden: true,
    },
    // dimension along +a edge
    {
      pts: [
        [0, 6.2, 0],
        [5, 6.2, 0],
      ],
    },
    { pts: [[0, 5.6, 0], [0, 6.8, 0]] },
    { pts: [[5, 5.6, 0], [5, 6.8, 0]] },
    // dimension for height
    {
      pts: [
        [6.2, 0, 0],
        [6.2, 0, 3],
      ],
    },
    { pts: [[5.6, 0, 0], [6.8, 0, 0]] },
    { pts: [[5.6, 0, 3], [6.8, 0, 3]] },
    // construction diagonal
    {
      pts: [
        [0, 0, 3],
        [5, 5, 3],
      ],
      hidden: true,
    },
  ],
  fabrication: [
    ...extrude(I_PROFILE, 0, 8),
    // weld seam ticks on the top flange
    { pts: [[2, 0.4, 4], [2, -0.6, 4.6]] },
    { pts: [[4, 0.4, 4], [4, -0.6, 4.6]] },
    { pts: [[6, 0.4, 4], [6, -0.6, 4.6]] },
  ],
  oem: [
    ...extrude(L_PROFILE, 0, 5),
    { pts: circleTop(1.4, 2.6, 0.6, 0.45), closed: true },
    { pts: circleTop(3.6, 2.6, 0.6, 0.45), closed: true },
    { pts: circleTop(1.4, 2.6, 0, 0.45), closed: true, hidden: true },
    { pts: circleTop(3.6, 2.6, 0, 0.45), closed: true, hidden: true },
    // slot on the vertical leg
    {
      pts: [
        [1.2, 0.6, 2.2],
        [3.8, 0.6, 2.2],
        [3.8, 0.6, 3.0],
        [1.2, 0.6, 3.0],
      ],
      closed: true,
    },
  ],
  machinery: [
    ...box(0, 0, 0, 6, 4, 3),
    ...box(1, 0.8, 3, 3.6, 3.2, 4.2),
    // output shaft on the +a face
    { pts: circleSide(6, 2, 1.4, 0.9), closed: true },
    { pts: circleSide(8, 2, 1.4, 0.9), closed: true },
    { pts: [[6, 2, 2.3], [8, 2, 2.3]] },
    { pts: [[6, 2, 0.5], [8, 2, 0.5]] },
    { pts: [[6, 2.9, 1.4], [8, 2.9, 1.4]] },
    { pts: [[6, 1.1, 1.4], [8, 1.1, 1.4]], hidden: true },
    // mounting feet
    { pts: [[0, -0.7, 0], [6, -0.7, 0], [6, 0, 0]], hidden: true },
    { pts: [[6, 4, 0], [6, 4.7, 0], [0, 4.7, 0]] },
  ],
  automation: [
    // barrel
    { pts: circleSide(0, 2, 2, 1.1), closed: true, hidden: true },
    { pts: circleSide(5, 2, 2, 1.1), closed: true },
    { pts: [[0, 2, 3.1], [5, 2, 3.1]] },
    { pts: [[0, 2, 0.9], [5, 2, 0.9]] },
    { pts: [[0, 3.1, 2], [5, 3.1, 2]] },
    { pts: [[0, 0.9, 2], [5, 0.9, 2]], hidden: true },
    // rod
    { pts: circleSide(8.4, 2, 2, 0.45), closed: true },
    { pts: [[5, 2, 2.45], [8.4, 2, 2.45]] },
    { pts: [[5, 2, 1.55], [8.4, 2, 1.55]] },
    { pts: [[5, 2.45, 2], [8.4, 2.45, 2]] },
    // control valve block on top
    ...box(1.2, 1.4, 3.1, 2.6, 2.6, 4.3),
    // signal line up and out
    { pts: [[1.9, 2, 4.3], [1.9, 2, 5.4], [4.6, 2, 5.4]], hidden: true },
    { pts: circleSide(4.6, 2, 5.4, 0.22), closed: true },
  ],
};

function project(segs: Seg[]) {
  const projected = segs.map((seg) => ({
    ...seg,
    xy: seg.pts.map(iso),
  }));

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  projected.forEach((seg) =>
    seg.xy.forEach(([x, y]) => {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }),
  );

  const innerW = VIEW_W - MARGIN * 2;
  const innerH = VIEW_H - MARGIN * 2;
  const scale = Math.min(innerW / (maxX - minX), innerH / (maxY - minY));
  const offX = MARGIN + (innerW - (maxX - minX) * scale) / 2;
  const offY = MARGIN + (innerH - (maxY - minY) * scale) / 2;

  return projected.map((seg) => ({
    hidden: seg.hidden,
    closed: seg.closed,
    points: seg.xy
      .map(
        ([x, y]) =>
          `${((x - minX) * scale + offX).toFixed(2)},${((y - minY) * scale + offY).toFixed(2)}`,
      )
      .join(" "),
  }));
}

const PROJECTED: Record<GlyphKind, ReturnType<typeof project>> = {
  precision: project(GLYPHS.precision),
  engineering: project(GLYPHS.engineering),
  fabrication: project(GLYPHS.fabrication),
  oem: project(GLYPHS.oem),
  machinery: project(GLYPHS.machinery),
  automation: project(GLYPHS.automation),
};

type CapabilityGlyphProps = {
  kind: GlyphKind;
  className?: string;
} & Omit<SVGAttributes<SVGSVGElement>, "children" | "viewBox">;

export default function CapabilityGlyph({
  kind,
  className = "",
  ...rest
}: CapabilityGlyphProps) {
  const segs = PROJECTED[kind];

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      overflow="visible"
      className={className}
      {...rest}
    >
      {segs.map((seg, i) =>
        seg.closed ? (
          <polygon
            key={i}
            points={seg.points}
            stroke="currentColor"
            strokeWidth={1}
            strokeLinejoin="round"
            strokeLinecap="square"
            vectorEffect="non-scaling-stroke"
            strokeDasharray={seg.hidden ? "3 3" : undefined}
            opacity={seg.hidden ? 0.55 : 1}
            data-glyph-stroke={seg.hidden ? "hidden" : "visible"}
          />
        ) : (
          <polyline
            key={i}
            points={seg.points}
            stroke="currentColor"
            strokeWidth={1}
            strokeLinejoin="round"
            strokeLinecap="square"
            vectorEffect="non-scaling-stroke"
            strokeDasharray={seg.hidden ? "3 3" : undefined}
            opacity={seg.hidden ? 0.55 : 1}
            data-glyph-stroke={seg.hidden ? "hidden" : "visible"}
          />
        ),
      )}
    </svg>
  );
}
