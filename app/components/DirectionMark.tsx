type DirectionStack = "pair" | "trio";

type DirectionMarkProps = {
  direction?: "down" | "up" | "right";
  /** Pair is the two-corner link mark. Trio is the scroll hint. */
  stack?: DirectionStack;
  /** One corner, rear first. Omit to draw the whole stack. */
  index?: number;
  className?: string;
};

function corner(x: number, y: number) {
  return `M${x}${y}v-420h60v360h360v60H${x}Z`;
}

/** Two-corner mark used on links. Rear, then tip. */
const PAIR = [corner(420, -340), corner(200, -120)];

/** Three corners, same step, centered in the view box. Rear, tail, tip. */
const TRIO = [corner(490, -490), corner(270, -270), corner(50, -50)];

const STACKS = { pair: PAIR, trio: TRIO };

export default function DirectionMark({
  direction = "right",
  stack = "pair",
  index,
  className = "",
}: DirectionMarkProps) {
  const glyphs = STACKS[stack];
  const paths = index == null ? glyphs : [glyphs[index] ?? glyphs[0]];

  return (
    <svg
      aria-hidden
      className={`direction-mark direction-mark-${direction}${className ? ` ${className}` : ""}`}
      viewBox="0 -960 960 960"
    >
      {paths.map((d) => (
        <path key={d} fill="currentColor" d={d} />
      ))}
    </svg>
  );
}
