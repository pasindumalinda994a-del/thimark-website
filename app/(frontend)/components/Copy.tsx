import type { HTMLAttributes, ReactNode } from "react";

const JUSTIFY = "text-left xl:text-justify xl:[text-align-last:left]";

const SCALE = {
  caption: "font-heading text-[length:var(--type-caption)] font-normal leading-[1.25] uppercase",
  body: "font-heading text-[length:var(--type-body)] font-normal leading-[1.35] uppercase",
  lede: {
    sm: `font-heading text-[length:var(--type-lede-sm)] font-medium leading-[1.15] uppercase ${JUSTIFY}`,
    md: `font-heading text-[length:var(--type-lede)] font-medium leading-[1.15] uppercase ${JUSTIFY}`,
    fixed: "font-heading text-[16px] leading-none uppercase",
  },
  title: {
    sm: "font-heading text-[length:var(--type-title-sm)] font-medium leading-[1.05] uppercase",
    md: "font-heading text-[length:var(--type-title)] font-medium leading-[1.05] uppercase",
  },
  lead: "font-heading text-[length:var(--type-lead)] font-medium leading-[1.02] uppercase",
  statement: "font-heading text-[length:var(--type-statement)] font-medium leading-[0.95] uppercase",
  display: {
    sm: "font-heading text-[length:var(--type-display-sm)] font-medium leading-none tracking-[0.02em] uppercase text-center",
    lg: "font-heading text-[length:var(--type-display-lg)] font-medium leading-none tracking-[0.02em] uppercase text-center",
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
