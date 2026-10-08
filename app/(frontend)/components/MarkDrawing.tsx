const VIEW = 400;
const SCALE = 5;
const OX = 120;
const OY = 92;

// Geometry from /public/brand/logo-mark.svg (32 x 41 units)
const COL_W = 14.7692;
const COL_2 = 17.2308;
const ROW_H = 19.27;
const ROW_2 = 21.73;
const MARK_W = 32;
const MARK_H = 41;

const u = (v: number) => v * SCALE;

const SQUARES = [
  { x: 0, y: 0, hatch: false },
  { x: COL_2, y: 0, hatch: true },
  { x: 0, y: ROW_2, hatch: false },
  { x: COL_2, y: ROW_2, hatch: false },
];

const X0 = OX;
const X1 = OX + u(MARK_W);
const Y0 = OY;
const Y1 = OY + u(MARK_H);

const text = {
  fontFamily: "var(--font-heading)",
  fontSize: 10,
  fill: "currentColor",
  letterSpacing: 1.2,
} as const;

function Cross({ x, y, size = 7 }: { x: number; y: number; size?: number }) {
  const h = size / 2;
  return (
    <>
      <line
        x1={x - h}
        y1={y}
        x2={x + h}
        y2={y}
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="square"
        vectorEffect="non-scaling-stroke"
        data-mark-static
      />
      <line
        x1={x}
        y1={y - h}
        x2={x}
        y2={y + h}
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="square"
        vectorEffect="non-scaling-stroke"
        data-mark-static
      />
    </>
  );
}

function Tick({ x, y, axis }: { x: number; y: number; axis: "h" | "v" }) {
  return axis === "h" ? (
    <line
      x1={x}
      y1={y - 5}
      x2={x}
      y2={y + 5}
      stroke="currentColor"
      strokeWidth={1}
      vectorEffect="non-scaling-stroke"
      data-mark-draw
    />
  ) : (
    <line
      x1={x - 5}
      y1={y}
      x2={x + 5}
      y2={y}
      stroke="currentColor"
      strokeWidth={1}
      vectorEffect="non-scaling-stroke"
      data-mark-draw
    />
  );
}

export default function MarkDrawing({ className = "" }: { className?: string }) {
  const dimTopY = Y0 - 28;
  const dimRightX = X1 + 34;
  const gapY = Y1 + 26;

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      overflow="visible"
      className={className}
    >
      <defs>
        <pattern
          id="mark-dots"
          width="12"
          height="12"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="6" cy="6" r="0.6" fill="currentColor" opacity="0.35" />
        </pattern>
        <pattern
          id="mark-hatch"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="6"
            stroke="#8a151c"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      {/* Field */}
      <rect
        x="0"
        y="0"
        width={VIEW}
        height={VIEW}
        fill="url(#mark-dots)"
        data-mark-field
      />

      {/* Construction guides */}
      <g opacity="0.4" data-mark-guides>
        <line
          x1="0"
          y1="0"
          x2={VIEW}
          y2={VIEW}
          stroke="currentColor"
          strokeWidth={1}
          strokeDasharray="4 6"
          vectorEffect="non-scaling-stroke"
          data-mark-guide
        />
        <line
          x1={VIEW}
          y1="0"
          x2="0"
          y2={VIEW}
          stroke="currentColor"
          strokeWidth={1}
          strokeDasharray="4 6"
          vectorEffect="non-scaling-stroke"
          data-mark-guide
        />
        <line
          x1={X0 + u(MARK_W) / 2}
          y1="0"
          x2={X0 + u(MARK_W) / 2}
          y2={VIEW}
          stroke="currentColor"
          strokeWidth={1}
          strokeDasharray="4 6"
          vectorEffect="non-scaling-stroke"
          data-mark-guide
        />
        <line
          x1="0"
          y1={Y0 + u(MARK_H) / 2}
          x2={VIEW}
          y2={Y0 + u(MARK_H) / 2}
          stroke="currentColor"
          strokeWidth={1}
          strokeDasharray="4 6"
          vectorEffect="non-scaling-stroke"
          data-mark-guide
        />
      </g>

      {/* Corner crosses */}
      <Cross x={X0 - 18} y={Y0 - 18} />
      <Cross x={X1 + 18} y={Y0 - 18} />
      <Cross x={X0 - 18} y={Y1 + 18} />
      <Cross x={X1 + 18} y={Y1 + 18} />

      {/* Hatch on the brand square */}
      <rect
        x={X0 + u(COL_2)}
        y={Y0}
        width={u(COL_W)}
        height={u(ROW_H)}
        fill="url(#mark-hatch)"
        data-mark-hatch
      />

      {/* Mark outlines */}
      {SQUARES.map((sq, i) => (
        <rect
          key={i}
          x={X0 + u(sq.x)}
          y={Y0 + u(sq.y)}
          width={u(COL_W)}
          height={u(ROW_H)}
          stroke="currentColor"
          strokeWidth={1}
          strokeLinejoin="miter"
          vectorEffect="non-scaling-stroke"
          data-mark-draw
        />
      ))}

      {/* Overall width dimension */}
      <line
        x1={X0}
        y1={dimTopY}
        x2={X1}
        y2={dimTopY}
        stroke="currentColor"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        data-mark-draw
      />
      <Tick x={X0} y={dimTopY} axis="h" />
      <Tick x={X1} y={dimTopY} axis="h" />
      <text
        x={(X0 + X1) / 2}
        y={dimTopY - 8}
        textAnchor="middle"
        {...text}
        data-mark-label
      >
        32
      </text>

      {/* Overall height dimension */}
      <line
        x1={dimRightX}
        y1={Y0}
        x2={dimRightX}
        y2={Y1}
        stroke="currentColor"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        data-mark-draw
      />
      <Tick x={dimRightX} y={Y0} axis="v" />
      <Tick x={dimRightX} y={Y1} axis="v" />
      <text
        x={dimRightX + 10}
        y={(Y0 + Y1) / 2 + 4}
        {...text}
        data-mark-label
      >
        41
      </text>

      {/* Gap callout */}
      <line
        x1={X0 + u(COL_W)}
        y1={gapY}
        x2={X0 + u(COL_2)}
        y2={gapY}
        stroke="currentColor"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        data-mark-draw
      />
      <Tick x={X0 + u(COL_W)} y={gapY} axis="h" />
      <Tick x={X0 + u(COL_2)} y={gapY} axis="h" />
      <line
        x1={X0 + u(COL_W)}
        y1={Y1 + 4}
        x2={X0 + u(COL_W)}
        y2={gapY - 6}
        stroke="currentColor"
        strokeWidth={1}
        strokeDasharray="2 3"
        vectorEffect="non-scaling-stroke"
        data-mark-draw
      />
      <line
        x1={X0 + u(COL_2)}
        y1={Y1 + 4}
        x2={X0 + u(COL_2)}
        y2={gapY - 6}
        stroke="currentColor"
        strokeWidth={1}
        strokeDasharray="2 3"
        vectorEffect="non-scaling-stroke"
        data-mark-draw
      />
      <text
        x={X0 + u(COL_2) + 10}
        y={gapY + 4}
        {...text}
        data-mark-label
      >
        2.46
      </text>

      {/* Title block */}
      <g data-mark-label>
        <text x={16} y={VIEW - 40} {...text}>
          THIMARK — MARK
        </text>
        <text x={16} y={VIEW - 26} {...text} opacity="0.7">
          SCALE 1:5 · REV 01
        </text>
        <text x={16} y={VIEW - 12} {...text} opacity="0.7">
          ENGINEERING · MANUFACTURING · INNOVATION
        </text>
      </g>
    </svg>
  );
}
