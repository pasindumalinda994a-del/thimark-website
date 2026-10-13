import { StationDash, StationPlus, padIndex } from "@/app/(frontend)/homesections/StoryProgress";

function CarouselArrow({ direction }: { direction: "prev" | "next" }) {
  const prev = direction === "prev";

  return (
    <button
      type="button"
      className="carousel-arrow"
      {...(prev ? { "data-carousel-prev": "" } : { "data-carousel-next": "" })}
      aria-label={prev ? "Previous slide" : "Next slide"}
    >
      <svg aria-hidden width={14} height={14} viewBox="0 0 14 14" fill="none">
        <path
          d={prev ? "M9 2.5 4.5 7 9 11.5" : "M5 2.5 9.5 7 5 11.5"}
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="square"
        />
      </svg>
    </button>
  );
}

/** Phone readout for a scroll-snap track: counter, progress rail and step arrows. */
export default function CarouselControls({
  label,
  count,
  className = "",
}: {
  label: string;
  count: number;
  className?: string;
}) {
  return (
    <div data-carousel-controls className={`carousel-controls ${className}`}>
      <div className="carousel-readout">
        <div className="index-tag flex items-center justify-between gap-4">
          <span className="flex items-center gap-1">
            <StationPlus />
            <StationDash />
            <span>{label}</span>
          </span>
          <span className="tabular-nums" aria-live="polite">
            <span data-carousel-count>01</span>
            {" / "}
            {padIndex(count - 1)}
          </span>
        </div>
        <div className="carousel-rail" aria-hidden>
          <span data-carousel-fill className="carousel-fill" />
        </div>
      </div>
      <div className="carousel-arrows">
        <CarouselArrow direction="prev" />
        <span aria-hidden className="carousel-arrow-divider" />
        <CarouselArrow direction="next" />
      </div>
    </div>
  );
}
