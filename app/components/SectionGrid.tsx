import type { HTMLAttributes, ReactNode, Ref } from "react";

export type GridTone = "light" | "dark" | "page";

function toneStroke(tone: GridTone) {
  if (tone === "light") return "#FFFFFF";
  if (tone === "page") return "var(--page-ink)";
  return "#575757";
}

type GridLineProps = {
  axis: "h" | "v";
  tone?: GridTone;
  className?: string;
  unstyled?: boolean;
} & Omit<HTMLAttributes<HTMLSpanElement>, "children">;

export function GridLine({
  axis,
  tone = "dark",
  className = "",
  unstyled = false,
  ...rest
}: GridLineProps) {
  const isV = axis === "v";
  const stroke = toneStroke(tone);

  if (!isV) {
    return (
      <span
        aria-hidden
        className={`pointer-events-none absolute z-10 h-px -translate-y-1/2 ${unstyled ? "" : "left-4 w-[calc(100%-32px)] "} ${className}`}
        {...rest}
        style={{ backgroundColor: stroke }}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute z-10 w-px -translate-x-1/2 overflow-visible ${unstyled ? "" : "top-0 h-full "} ${className}`}
      {...rest}
    >
      <svg width="1" height="100%" className="h-full w-px">
        <line
          x1="0.5"
          x2="0.5"
          y1="0"
          y2="100%"
          stroke={stroke}
          strokeWidth="1"
          strokeLinecap="butt"
          strokeDasharray="8 8"
        />
      </svg>
    </span>
  );
}

type SectionGridProps = {
  tone?: GridTone;
  rows?: 14 | 16 | 18;
  className?: string;
  children: ReactNode;
  id?: string;
  "aria-labelledby"?: string;
  outerV?: boolean;
  ref?: Ref<HTMLElement>;
};

export default function SectionGrid({
  tone = "dark",
  rows = 16,
  className = "",
  children,
  id,
  "aria-labelledby": ariaLabelledby,
  outerV = true,
  ref,
}: SectionGridProps) {
  const plate =
    rows === 14 ? "h-rows-14" : rows === 18 ? "h-rows-18" : "h-rows-16";

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={ariaLabelledby}
      className={`relative overflow-x-hidden content-plate ${plate} ${className}`}
    >
      {outerV ? (
        <>
          <GridLine
            axis="v"
            tone={tone}
            className="v-g1-0"
          />
          <GridLine
            axis="v"
            tone={tone}
            className="v-g1-12"
          />
        </>
      ) : null}
      {children}
    </section>
  );
}

export function ContentColumns({
  children,
  className = "",
  cols = 2,
}: {
  children: ReactNode;
  className?: string;
  cols?: 2 | 3;
}) {
  return (
    <div
      className={`relative z-10 grid grid-cols-1 gap-4 px-4 ${cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2"} ${className}`}
    >
      {children}
    </div>
  );
}
