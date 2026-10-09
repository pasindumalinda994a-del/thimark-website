import type { Metadata } from "next";
import SectionBreak from "@/app/(frontend)/components/SectionBreak";
import CapabilitiesSection from "@/app/(frontend)/homesections/CapabilitiesSection";
import HeroSection from "./pagesection/HeroSection";
import NewProductDevelopmentSection from "./pagesection/NewProductDevelopmentSection";
import PowderCoatingSection from "./pagesection/PowderCoatingSection";
import ReverseEngineeringSection from "./pagesection/ReverseEngineeringSection";
import { CAPABILITIES, CAPABILITIES_CTA } from "./pagesection/services";

export const metadata: Metadata = {
  title: "Engineering & Services — Thimark",
  description:
    "New product development, reverse engineering and powder coating from Thimark Technocreations — from an engineering idea through to a manufactured finish.",
};

const CREAM = "relative z-10 bg-cream [--page-bg:var(--cream)] [--page-ink:var(--steel)]";
const STEEL = "relative z-10 bg-steel [--page-bg:var(--steel)] [--page-ink:var(--cream)]";

export default function EngineeringServicesPage() {
  return (
    <main className="content-plate pt-14 md:ml-sidebar md:pt-0">
      <div className={CREAM}>
        <HeroSection />
      </div>
      <div className={STEEL}>
        <SectionBreak tone="page" />
        <PowderCoatingSection />
      </div>
      <div className={CREAM}>
        <SectionBreak tone="page" />
        <NewProductDevelopmentSection />
      </div>
      <div className={STEEL}>
        <SectionBreak tone="page" />
        <ReverseEngineeringSection />
      </div>
      <div className={CREAM}>
        <SectionBreak tone="page" />
        <CapabilitiesSection id="capabilities" items={CAPABILITIES} cta={CAPABILITIES_CTA} />
      </div>
    </main>
  );
}
