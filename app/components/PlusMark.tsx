import type { SVGAttributes } from "react";

type PlusMarkProps = {
  tone?: "light" | "dark" | "brand" | "page";
  className?: string;
} & Omit<SVGAttributes<SVGSVGElement>, "children">;

export default function PlusMark({
  tone = "dark",
  className = "",
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
      <line
        x1="0"
        y1="3.5"
        x2="7"
        y2="3.5"
        stroke={stroke}
        strokeWidth="1"
        strokeLinecap="square"
      />
      <line
        x1="3.5"
        y1="0"
        x2="3.5"
        y2="7"
        stroke={stroke}
        strokeWidth="1"
        strokeLinecap="square"
      />
    </svg>
  );
}
