import DirectionPulse from "@/app/components/DirectionPulse";

type ScrollHintProps = {
  seat: "col-8" | "col-9";
  edge?: "top" | "bottom";
};

export default function ScrollHint({ seat, edge = "bottom" }: ScrollHintProps) {
  const upward = edge === "top";

  return (
    <div
      aria-hidden
      className={`scroll-hint scroll-hint-${seat}${upward ? " scroll-hint-top" : ""}`}
    >
      {upward ? null : <span className="index-tag">Scroll</span>}
      <DirectionPulse direction={upward ? "up" : "down"} stack="trio" />
    </div>
  );
}
