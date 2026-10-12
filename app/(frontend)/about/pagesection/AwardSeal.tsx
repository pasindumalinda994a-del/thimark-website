import { useId } from "react";

const SIZE = 200;
const C = SIZE / 2;
const RING_R = 70;
const RING_LENGTH = Math.round(2 * Math.PI * RING_R) - 8;

function ticksPath() {
  let d = "";
  for (let i = 0; i < 72; i += 1) {
    const a = (i * 5 * Math.PI) / 180;
    const outer = i % 6 === 0 ? 96 : 91;
    const x1 = C + 86 * Math.sin(a);
    const y1 = C - 86 * Math.cos(a);
    const x2 = C + outer * Math.sin(a);
    const y2 = C - outer * Math.cos(a);
    d += `M${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}`;
  }
  return d;
}

const TICKS = ticksPath();

/**
 * Engineered award seal. Top honours carry a solid inner disc, others an open
 * dashed one, so rank reads without metallic colour.
 */
export default function AwardSeal({
  label,
  solid,
  ring,
  year,
  className = "",
}: {
  label: string;
  solid: boolean;
  ring: string;
  year: string;
  className?: string;
}) {
  const id = useId();
  const ringId = `${id}-ring`;
  const labelSize = label.length > 6 ? 14 : solid ? 26 : 20;

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      fill="none"
      overflow="visible"
      className={className}
    >
      <defs>
        <path
          id={ringId}
          d={`M${C - RING_R} ${C}a${RING_R} ${RING_R} 0 1 1 ${2 * RING_R} 0a${RING_R} ${RING_R} 0 1 1 ${-2 * RING_R} 0`}
        />
      </defs>

      <g data-seal-fade stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.45">
        <line x1={C} y1={-12} x2={C} y2={SIZE + 12} />
        <line x1={-12} y1={C} x2={SIZE + 12} y2={C} />
      </g>

      <circle data-seal-stroke cx={C} cy={C} r={98} stroke="currentColor" strokeWidth="1" />
      <path data-seal-stroke d={TICKS} stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
      <circle data-seal-stroke cx={C} cy={C} r={82} stroke="currentColor" strokeWidth="1" />
      <circle data-seal-stroke cx={C} cy={C} r={58} stroke="currentColor" strokeWidth="1" />

      <text
        data-seal-fade
        fill="currentColor"
        fontSize="8"
        fontWeight="500"
        className="font-heading"
      >
        <textPath href={`#${ringId}`} textLength={RING_LENGTH} lengthAdjust="spacing">
          {ring.toUpperCase()}
        </textPath>
      </text>

      {solid ? (
        <circle data-seal-fade cx={C} cy={C} r={52} fill="currentColor" />
      ) : (
        <circle
          data-seal-fade
          cx={C}
          cy={C}
          r={52}
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
      )}

      <g
        data-seal-fade
        fill={solid ? "var(--page-bg)" : "currentColor"}
        textAnchor="middle"
        className="font-heading"
        fontWeight="500"
      >
        <text x={C} y={C - 18} fontSize="8" letterSpacing="2">
          {year}
        </text>
        <text x={C} y={C + 8} fontSize={labelSize} letterSpacing="0.5">
          {label.toUpperCase()}
        </text>
        <text x={C} y={C + 26} fontSize="7" letterSpacing="2.4">
          AWARD
        </text>
      </g>

      <rect data-seal-fade x={C - 3} y={-1} width={6} height={6} fill="var(--brand)" />
    </svg>
  );
}
