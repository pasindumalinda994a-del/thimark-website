import type { HTMLAttributes, ReactNode } from "react";

const JUSTIFY = "text-left xl:text-justify xl:[text-align-last:left]";

const SCALE = {
  caption: "font-heading text-[clamp(9px,0.75vw,12px)] font-normal leading-[1.25] uppercase",
  body: "font-heading text-[clamp(11px,0.8vw,14px)] font-normal leading-[1.35] uppercase",
  lede: {
    sm: `font-heading text-[clamp(10px,0.85vw,14px)] font-medium leading-[1.15] uppercase ${JUSTIFY}`,
    md: `font-heading text-[clamp(11px,0.9vw,16px)] font-medium leading-[1.15] uppercase ${JUSTIFY}`,
    fixed: "font-heading text-[16px] leading-none uppercase",
  },
  title: {
    sm: "font-heading text-[clamp(13px,1.1vw,22px)] font-medium leading-[1.05] uppercase",
    md: "font-heading text-[clamp(15px,1.3vw,26px)] font-medium leading-[1.05] uppercase",
  },
  lead: "font-heading text-[clamp(17px,1.45vw,28px)] font-medium leading-[1.02] uppercase",
  statement: "font-heading text-[clamp(19px,1.7vw,34px)] font-medium leading-[0.95] uppercase",
  display: {
    sm: "font-heading text-[clamp(27px,2.35vw,40px)] font-medium leading-none tracking-[0.02em] uppercase text-center",
    lg: "font-heading text-[clamp(31px,2.9vw,56px)] font-medium leading-none tracking-[0.02em] uppercase text-center",
  },
  prose: "font-sans text-[15px] font-normal leading-[1.45]",
  meta: "text-[14px] font-normal leading-[1.45]",
} as const;

export type CopyVariant = keyof typeof SCALE;
export type CopySize = "sm" | "md" | "lg" | "fixed";

function variantClass(variant: CopyVariant, size: CopySize = "md") {
  const entry = SCALE[variant];
  if (typeof entry === "string") return entry;
  const steps: Partial<Record<CopySize, string>> = entry;
  return steps[size] ?? steps.md ?? steps.sm ?? "";
}

export function copyClass(variant: CopyVariant, weight?: "medium" | "normal", size?: CopySize) {
  const classes = variantClass(variant, size);
  if (!weight) return classes;
  const stripped = classes.replace(/\bfont-(medium|normal)\b/g, "").replace(/\s+/g, " ").trim();
  return `${stripped} font-${weight}`;
}

type CopyProps = {
  variant: CopyVariant;
  as?: "p" | "span" | "div";
  /** Overrides the variant weight. Ledes use this for a following paragraph. */
  weight?: "medium" | "normal";
  /** Step within lede, title, and display. Other roles ignore it. */
  size?: CopySize;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "children">;

/** Reading text. Never a heading. */
export default function Copy({
  variant,
  as: Tag = "p",
  weight,
  size,
  className = "",
  children,
  ...props
}: CopyProps) {
  const classes = copyClass(variant, weight, size);
  return (
    <Tag className={className ? `${classes} ${className}` : classes} {...props}>
      {children}
    </Tag>
  );
}
