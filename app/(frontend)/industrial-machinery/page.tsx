import type { Metadata } from "next";
import SectionBreak from "@/app/(frontend)/components/SectionBreak";
import CapabilitiesSection from "@/app/(frontend)/homesections/CapabilitiesSection";
import ApproachSection from "./pagesection/ApproachSection";
import ExportsSection from "./pagesection/ExportsSection";
import FeaturedProjectSection from "./pagesection/FeaturedProjectSection";
import HeroSection from "./pagesection/HeroSection";
import ProductsServicesSection from "./pagesection/ProductsServicesSection";
import { CAPABILITIES, CAPABILITIES_CTA } from "./pagesection/machinery";

export const metadata: Metadata = {
  title: "Industrial Machinery — Thimark",
  description:
    "Thimark designs and manufactures custom industrial machinery, hydraulic and water-management equipment, material handling and filtration systems, from Kadawatha, Sri Lanka to the Kilgharrah 600 for KenGen in Kenya.",
};

const CREAM = "relative z-10 bg-cream [--page-bg:var(--cream)] [--page-ink:var(--steel)]";
const STEEL = "relative z-10 bg-steel [--page-bg:var(--steel)] [--page-ink:var(--cream)]";

export default function IndustrialMachineryPage() {
  return (
    <main className="content-plate pt-14 md:ml-sidebar md:pt-0">
      <div className={CREAM}>
        <HeroSection />
        <SectionBreak tone="page" />
        <ProductsServicesSection />
      </div>
      <div className={STEEL}>
        <SectionBreak tone="page" />
        <FeaturedProjectSection />
      </div>
      <div className={CREAM}>
        <SectionBreak tone="page" />
        <ApproachSection />
      </div>
      <div className={STEEL}>
        <SectionBreak tone="page" />
        <ExportsSection />
      </div>
      <div className={CREAM}>
        <SectionBreak tone="page" />
        <CapabilitiesSection id="capabilities" items={CAPABILITIES} cta={CAPABILITIES_CTA} />
      </div>
    </main>
  );
}
