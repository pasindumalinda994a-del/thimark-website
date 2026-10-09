import MaskRevealHeading from "@/app/(frontend)/components/MaskRevealHeading";
import { GridLine } from "@/app/(frontend)/components/SectionGrid";

export default function ManufacturingSection() {
  return (
    <section
      id="manufacturing"
      aria-labelledby="manufacturing-heading"
      className="relative flex min-h-rows-7 items-center bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)] scroll-mt-16 md:scroll-mt-0"
    >
      <GridLine axis="v" unstyled tone="page" className="v-g1-0" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12" />
      <div className="px-[calc(var(--g1-line-0)+16px)]">
        <MaskRevealHeading
          as="h2"
          id="manufacturing-heading"
          className="font-heading text-[clamp(28px,2.5vw,48px)] leading-none font-medium uppercase"
        >
          Manufacturing
        </MaskRevealHeading>
      </div>
    </section>
  );
}
