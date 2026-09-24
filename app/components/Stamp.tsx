import type { HTMLAttributes } from "react";
import PlusMark from "@/app/components/PlusMark";

type StampProps = {
  strong: string;
  sub?: string;
  className?: string;
} & Omit<HTMLAttributes<HTMLParagraphElement>, "children" | "className">;

export default function Stamp({
  strong,
  sub,
  className = "",
  ...rest
}: StampProps) {
  return (
    <p className={`stamp ${className}`} {...rest}>
      <PlusMark tone="page" className="top-0 left-0" />
      <PlusMark tone="page" className="top-0 left-full" />
      <PlusMark tone="page" className="top-full left-0" />
      <PlusMark tone="page" className="top-full left-full" />
      <span aria-hidden className="hero-provenance-edge hero-provenance-edge-t" />
      <span aria-hidden className="hero-provenance-edge hero-provenance-edge-r" />
      <span aria-hidden className="hero-provenance-edge hero-provenance-edge-b" />
      <span aria-hidden className="hero-provenance-edge hero-provenance-edge-l" />
      <span className="stamp-copy">
        <span>
          <span className="stamp-strong">{strong}</span>
        </span>
        {sub ? <span className="stamp-sub">{sub}</span> : null}
      </span>
    </p>
  );
}
