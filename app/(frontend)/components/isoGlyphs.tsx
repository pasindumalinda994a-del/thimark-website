import type { ReactNode } from "react";
import IsoGlyph, { type IsoIcon } from "@/app/(frontend)/components/IsoGlyph";

/** Pre-rendered glyphs keyed by icon, passed into client sections so the path data never ships as JS. */
export type GlyphSet = Partial<Record<IsoIcon, ReactNode>>;

/** Server-only: renders one glyph per distinct icon used by `items`. */
export function isoGlyphs(items: readonly { icon: IsoIcon }[], className: string): GlyphSet {
  const set: GlyphSet = {};
  for (const { icon } of items) {
    set[icon] ??= <IsoGlyph kind={icon} className={className} />;
  }
  return set;
}
