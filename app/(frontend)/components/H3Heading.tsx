import type { HTMLAttributes, ReactNode } from "react";

const BASE = "font-heading font-medium uppercase";

const SCALE = {
  statement: "text-[length:var(--type-statement)] leading-[0.95]",
  title: {
    sm: "text-[length:var(--type-title-sm)] leading-none",
    md: "text-[length:var(--type-title)] leading-[1.05]",
  },
} as const;

export type H3Variant = keyof typeof SCALE;
export type H3Size = "sm" | "md";

function variantClass(variant: H3Variant, size: H3Size = "md") {
  const entry = SCALE[variant];
  if (typeof entry === "string") return entry;
  return entry[size] ?? entry.md;
}

type H3HeadingProps = {
  variant: H3Variant;
  /** Step within title. Statement ignores it. */
  size?: H3Size;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLHeadingElement>, "children">;

/** Subsection title. Always h3, under a section h2. */
export default function H3Heading({
  variant,
  size,
  className = "",
  children,
  ...props
}: H3HeadingProps) {
  const classes = `${BASE} ${variantClass(variant, size)}`;
  return (
    <h3 className={className ? `${classes} ${className}` : classes} {...props}>
      {children}
    </h3>
  );
}

type H2LabelProps = {
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLHeadingElement>, "children">;

/** Form section directly under the page h1. */
export function FormHeading({ className = "", children, ...props }: H2LabelProps) {
  const size =
    "font-heading text-[length:var(--type-title)] leading-none font-medium uppercase";
  return (
    <h2 className={className ? `${size} ${className}` : size} {...props}>
      {children}
    </h2>
  );
}

/** Article section under the article h1, beside other h2s such as related records. */
export function ArticleHeading({ className = "", children, ...props }: H2LabelProps) {
  const size =
    "font-heading text-[length:var(--type-title)] leading-[1.1] font-medium tracking-[0.02em] uppercase";
  return (
    <h2 className={className ? `${size} ${className}` : size} {...props}>
      {children}
    </h2>
  );
}
