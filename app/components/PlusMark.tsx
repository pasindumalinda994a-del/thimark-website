import type { SVGAttributes } from "react";

export type PlusArms = {
  up?: boolean;
  down?: boolean;
  left?: boolean;
  right?: boolean;
};

type PlusMarkProps = {
  tone?: "light" | "dark" | "brand" | "page";
  className?: string;
  /** Which arms to draw. Omitted arms default to on, so a bare mark stays a plus. */
  arms?: PlusArms;
} & Omit<SVGAttributes<SVGSVGElement>, "children">;

function axisSpan(negative: boolean, positive: boolean) {
  if (negative && positive) return { from: 0, to: 7 };
  if (positive) return { from: 4, to: 7 };
  if (negative) return { from: 0, to: 3 };
  return null;
}

export default function PlusMark({
  tone = "dark",
  className = "",
  arms,
  ...rest
}: PlusMarkProps) {
  const stroke =
    tone === "light"
      ? "#FFFFFF"
      : tone === "brand"
        ? "#8A151C"
        : tone === "page"
          ? "var(--page-ink)"
          : "#575757";

  const horizontal = axisSpan(arms?.left ?? true, arms?.right ?? true);
  const vertical = axisSpan(arms?.up ?? true, arms?.down ?? true);

  return (
    <svg
      aria-hidden
      width={7}
      height={7}
      viewBox="0 0 7 7"
      fill="none"
      overflow="visible"
      className={`pointer-events-none absolute z-20 size-[7px] max-w-none -translate-x-1/2 -translate-y-1/2 ${className}`}
      {...rest}
    >
      {horizontal ? (
        <line
          x1={horizontal.from}
          y1="3.5"
          x2={horizontal.to}
          y2="3.5"
          stroke={stroke}
          strokeWidth="1"
          strokeLinecap="square"
        />
      ) : null}
      {vertical ? (
        <line
          x1="3.5"
          y1={vertical.from}
          x2="3.5"
          y2={vertical.to}
          stroke={stroke}
          strokeWidth="1"
          strokeLinecap="square"
        />
      ) : null}
    </svg>
  );
}
