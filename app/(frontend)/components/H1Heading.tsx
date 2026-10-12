"use client";

import type { ReactNode } from "react";
import MaskRevealHeading from "@/app/(frontend)/components/MaskRevealHeading";

/** Page title. Same scale as the home hero, on every page. */
const SIZE =
  "font-heading text-[clamp(30px,8vw,34px)] leading-[0.92] font-medium tracking-[-0.01em] uppercase md:text-[clamp(40px,3.5vw,64px)] md:leading-[0.89]";

type H1HeadingProps = {
  id?: string;
  className?: string;
  children: ReactNode;
  waitForPreload?: boolean;
  stagger?: number;
  duration?: number;
  delay?: number;
  start?: string;
};

export default function H1Heading({ className = "", ...props }: H1HeadingProps) {
  return (
    <MaskRevealHeading
      as="h1"
      className={className ? `${SIZE} ${className}` : SIZE}
      {...props}
    />
  );
}
