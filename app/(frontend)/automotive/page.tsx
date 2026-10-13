import type { Metadata } from "next";
import PhraseBar from "@/app/(frontend)/components/PhraseBar";
import SectionBreak from "@/app/(frontend)/components/SectionBreak";
import CapabilitiesSection from "@/app/(frontend)/homesections/CapabilitiesSection";
import AboutHero from "@/app/(frontend)/about/pagesection/AboutHero";
import { QualityCred } from "@/app/(frontend)/about/pagesection/QualitySection";
import { QUALITY } from "@/app/(frontend)/about/pagesection/about";
import OemSection from "./pagesection/OemSection";
import ProcessSection from "./pagesection/ProcessSection";
import RangeSection from "./pagesection/RangeSection";
import {
  CAPABILITIES,
  CAPABILITIES_COPY,
  CLOSING_PHRASES,
  HERO,
} from "./pagesection/automotive";

export const metadata: Metadata = {
  title: "Automotive Components — Thimark",
  description:
    "Precision-engineered motorcycle components from Thimark Technocreations: stands, guards, handlebars, carriers and brackets manufactured in Sri Lanka for OEM and local assembly partners.",
};

const CREAM = "relative z-10 bg-cream [--page-bg:var(--cream)] [--page-ink:var(--steel)]";
const STEEL = "relative z-10 bg-steel [--page-bg:var(--steel)] [--page-ink:var(--cream)]";

export default function AutomotivePage() {
  return (
    <main className="product-page content-plate pt-14 xl:ml-sidebar xl:pt-0">
      <div className={CREAM}>
        <AboutHero
          id="hero"
          copy={HERO}
          ctaCol={8}
        />
        <SectionBreak tone="page" />
        <RangeSection />
      </div>
      <div className={STEEL}>
        <SectionBreak tone="page" />
        <OemSection />
      </div>
      <div className={CREAM}>
        <SectionBreak tone="page" />
        <ProcessSection />
        <SectionBreak tone="page" />
        <CapabilitiesSection
          id="manufacturing"
          items={CAPABILITIES}
          copy={CAPABILITIES_COPY}
          progressLabel="Capabilities"
          foot={<PhraseBar phrases={CLOSING_PHRASES} />}
          cta={null}
          aside={<QualityCred {...QUALITY.cred} />}
        />
      </div>
    </main>
  );
}
