import { STORY } from "@/app/(frontend)/homesections/StoryProgress";

/** Homepage photographs, in page order: story, three disciplines, solutions, quality. */
export const HOME_FIG = {
  story: 1,
  core: 1 + STORY.length,
  solutions: 1 + STORY.length + 3,
  quality: 1 + STORY.length + 6,
} as const;

export function figLabel(n: number) {
  return `Fig. ${String(n).padStart(2, "0")}`;
}

export default function FigMark({ n }: { n: number }) {
  return (
    <p aria-hidden className="fig-mark index-tag">
      {figLabel(n)}
    </p>
  );
}
