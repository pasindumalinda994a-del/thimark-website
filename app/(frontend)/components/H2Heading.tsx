"use client";

import type { ReactNode } from "react";
import MaskRevealHeading from "@/app/(frontend)/components/MaskRevealHeading";

/** Section title. Same scale on every section. */
const SIZE =
  "font-heading text-[length:var(--type-h2)] leading-none font-medium uppercase";

type H2HeadingProps = {
  id?: string;
  className?: string;
  children: ReactNode;
  waitForPreload?: boolean;
  stagger?: number;
  duration?: number;
  delay?: number;
  start?: string;
};

export default function H2Heading({ className = "", ...props }: H2HeadingProps) {
  return (
    <MaskRevealHeading
      as="h2"
      className={className ? `${SIZE} ${className}` : SIZE}
      {...props}
    />
  );
}
