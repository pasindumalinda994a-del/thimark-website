import PlusMark, { type PlusArms } from "@/app/(frontend)/components/PlusMark";
import { GridLine } from "@/app/(frontend)/components/SectionGrid";

const joinLeftEdge: PlusArms = { up: true, down: true, left: false, right: true };
const joinRightEdge: PlusArms = { up: true, down: true, left: true, right: false };
const joinTeeUp: PlusArms = { up: true, down: false, left: true, right: true };

/**
 * Desktop rails for a homepage-style solution band. `foot` draws the closing
 * line; leave it off when the next block draws its own top joints.
 */
export function BandRails({ last = false, foot = true }: { last?: boolean; foot?: boolean }) {
  return (
    <>
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 solutions-v hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-6 solutions-v hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 solutions-v hidden md:block" />
      {foot ? (
        <>
          <GridLine axis="h" unstyled tone="page" className="h-seg-0-mid solutions-h hidden md:block" />
          <GridLine axis="h" unstyled tone="page" className="h-seg-mid-12 solutions-h hidden md:block" />
          <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 solutions-h hidden md:block" />
          <PlusMark
            tone="page"
            arms={last ? joinTeeUp : undefined}
            className="v-g1-6 solutions-h hidden md:block"
          />
          <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 solutions-h hidden md:block" />
        </>
      ) : null}
    </>
  );
}

/** Phone side rails for one half of a band, closed by a foot line. */
export function BandMobileRails() {
  return (
    <>
      <GridLine axis="v" unstyled tone="page" className="left-0 hero-v-between-pluses md:hidden" />
      <GridLine axis="v" unstyled tone="page" className="left-full hero-v-between-pluses md:hidden" />
      <GridLine
        axis="h"
        unstyled
        tone="page"
        className="at-bottom left-(--line-stop) w-[calc(100%-2*var(--line-stop))] md:hidden"
      />
      <PlusMark tone="page" arms={joinLeftEdge} className="left-0 at-bottom md:hidden" />
      <PlusMark tone="page" arms={joinRightEdge} className="left-full at-bottom md:hidden" />
    </>
  );
}
