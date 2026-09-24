import PlusMark from "@/app/components/PlusMark";
import { GridLine, type GridTone } from "@/app/components/SectionGrid";

export type BreakSplit =
  | "9"
  | "6"
  | "9g"
  | "8"
  | "6g"
  | "thirds"
  | "quarters"
  | "none";

const SPLITS: Record<BreakSplit, { segs: string[]; joints: string[] }> = {
  "9": { segs: ["h-seg-0-9", "h-seg-9-12"], joints: ["v-g2-9"] },
  "6": { segs: ["h-seg-0-6", "h-seg-6-12"], joints: ["v-g2-6"] },
  "9g": { segs: ["h-seg-0-9g", "h-seg-9g-12"], joints: ["v-g1-9"] },
  "8": { segs: ["h-seg-0-8", "h-seg-8-12"], joints: ["v-g1-8"] },
  "6g": { segs: ["h-seg-0-mid", "h-seg-mid-12"], joints: ["v-g1-6"] },
  thirds: {
    segs: ["h-seg-0-4", "h-seg-4-8", "h-seg-8-12"],
    joints: ["v-g1-4", "v-g1-8"],
  },
  quarters: {
    segs: ["h-seg-0-3", "h-seg-3-6", "h-seg-6-9", "h-seg-9g-12"],
    joints: ["v-g1-3", "v-g1-6", "v-g1-9"],
  },
  none: { segs: ["h-seg-0-12"], joints: [] },
};

export default function SectionBreak({
  tone = "dark",
  split = "9",
}: {
  tone?: GridTone;
  split?: BreakSplit;
}) {
  const { segs, joints } = SPLITS[split];

  return (
    <div className="relative z-20 h-0" aria-hidden>
      <div className="relative h-[7px] -translate-y-1/2">
        <PlusMark tone={tone} className="v-g1-0 top-1/2" />
        <GridLine
          axis="h"
          unstyled
          tone={tone}
          className="h-seg-0-12 top-1/2 md:hidden"
        />
        {segs.map((seg) => (
          <GridLine
            key={seg}
            axis="h"
            unstyled
            tone={tone}
            className={`${seg} top-1/2 hidden md:block`}
          />
        ))}
        {joints.map((joint) => (
          <PlusMark
            key={joint}
            tone={tone}
            className={`${joint} top-1/2 hidden md:block`}
          />
        ))}
        <PlusMark tone={tone} className="v-g1-12 top-1/2" />
      </div>
    </div>
  );
}
