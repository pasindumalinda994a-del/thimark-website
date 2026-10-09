import type { Metadata } from "next";
import SectionBreak from "@/app/(frontend)/components/SectionBreak";
import CapabilitiesSection from "@/app/(frontend)/homesections/CapabilitiesSection";
import HeroSection from "./pagesection/HeroSection";
import LocalValueAdditionSection from "./pagesection/LocalValueAdditionSection";
import ManufacturingSection from "./pagesection/ManufacturingSection";

export const metadata: Metadata = {
  title: "Automotive Components — Thimark",
  description:
    "Automotive component manufacturing and local value addition from Thimark Technocreations in Sri Lanka.",
};

const CREAM =
  "relative z-10 bg-cream [--page-bg:var(--cream)] [--page-ink:var(--steel)]";

export default function AutomotivePage() {
  return (
    <main className="content-plate pt-14 md:ml-sidebar md:pt-0">
      <div className={CREAM}>
        <HeroSection />
        <SectionBreak tone="page" />
        <ManufacturingSection />
        <SectionBreak tone="page" />
        <LocalValueAdditionSection />
        <SectionBreak tone="page" />
        <CapabilitiesSection id="capabilities" />
      </div>
    </main>
  );
}
