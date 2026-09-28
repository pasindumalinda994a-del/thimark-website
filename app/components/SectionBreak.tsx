import { GridLine, type GridTone } from "@/app/components/SectionGrid";

export default function SectionBreak({ tone = "dark" }: { tone?: GridTone }) {
  return (
    <div className="relative z-20 h-0" aria-hidden>
      <GridLine
        axis="h"
        unstyled
        tone={tone}
        className="top-0 left-(--g1-line-0) w-[calc(var(--g1-line-12)-var(--g1-line-0))]"
      />
    </div>
  );
}
