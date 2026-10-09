import MaskRevealHeading from "@/app/(frontend)/components/MaskRevealHeading";
import SectionGrid, { GridLine } from "@/app/(frontend)/components/SectionGrid";

export default function HeroSection() {
  return (
    <SectionGrid
      id="hero"
      aria-labelledby="hero-heading"
      rows={14}
      tone="page"
      outerV={false}
      className="flex flex-col justify-center bg-cream text-steel [--page-bg:var(--cream)] [--page-ink:var(--steel)] scroll-mt-16 md:scroll-mt-0"
    >
      <GridLine axis="v" unstyled tone="page" className="v-g1-0" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12" />
      <div className="px-[calc(var(--g1-line-0)+16px)]">
        <MaskRevealHeading
          as="h1"
          id="hero-heading"
          className="font-heading text-[clamp(40px,4.4vw,80px)] leading-[0.89] font-medium tracking-[-0.01em] uppercase"
        >
          Automotive Components
        </MaskRevealHeading>
      </div>
    </SectionGrid>
  );
}
