import type { Metadata } from "next";
import PhraseBar from "@/app/(frontend)/components/PhraseBar";
import SectionBreak from "@/app/(frontend)/components/SectionBreak";
import CapabilitiesSection from "@/app/(frontend)/homesections/CapabilitiesSection";
import AboutHero from "@/app/(frontend)/about/pagesection/AboutHero";
import QualitySection, { QualityCred } from "@/app/(frontend)/about/pagesection/QualitySection";
import ProcessSection from "@/app/(frontend)/automotive/pagesection/ProcessSection";
import ReverseEngineeringSection from "./pagesection/ReverseEngineeringSection";
import SurfaceFinishingSection from "./pagesection/SurfaceFinishingSection";
import {
  CAPABILITIES,
  CAPABILITIES_COPY,
  CLOSING_PHRASES,
  ENGINEERING,
  HERO,
  NPD,
  NPD_CTA,
  NPD_STEPS,
} from "./pagesection/services";

export const metadata: Metadata = {
  title: "Engineering & Services — Thimark",
  description:
    "New product development, reverse engineering and surface finishing from Thimark Technocreations — from concept and 3D modelling through prototyping, inspection and powder coating to production-ready solutions.",
};

const CREAM = "relative z-10 bg-cream [--page-bg:var(--cream)] [--page-ink:var(--steel)]";
const STEEL = "relative z-10 bg-steel [--page-bg:var(--steel)] [--page-ink:var(--cream)]";

export default function EngineeringServicesPage() {
  return (
    <main className="product-page content-plate pt-14 xl:ml-sidebar xl:pt-0">
      <div className={CREAM}>
        <AboutHero
          id="hero"
          copy={HERO}
        />
        <SectionBreak tone="page" />
        <ProcessSection
          id="new-product-development"
          copy={NPD}
          stages={NPD_STEPS}
          cta={NPD_CTA}
          pace={0.75}
        />
        <SectionBreak tone="page" />
        <ReverseEngineeringSection />
      </div>
      <div className={STEEL}>
        <SectionBreak tone="page" />
        <SurfaceFinishingSection />
      </div>
      <div className={CREAM}>
        <SectionBreak tone="page" />
        <QualitySection id="engineering-quality" copy={ENGINEERING} />
        <SectionBreak tone="page" />
        <CapabilitiesSection
          id="capabilities"
          items={CAPABILITIES}
          copy={CAPABILITIES_COPY}
          progressLabel="Capabilities"
          foot={<PhraseBar phrases={CLOSING_PHRASES} />}
          cta={null}
          aside={<QualityCred {...ENGINEERING.cred} />}
        />
      </div>
    </main>
  );
}
