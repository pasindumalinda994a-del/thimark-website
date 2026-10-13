import type { Metadata } from "next";
import PhraseBar from "@/app/(frontend)/components/PhraseBar";
import SectionBreak from "@/app/(frontend)/components/SectionBreak";
import CapabilitiesSection from "@/app/(frontend)/homesections/CapabilitiesSection";
import AboutHero from "@/app/(frontend)/about/pagesection/AboutHero";
import { QualityCred } from "@/app/(frontend)/about/pagesection/QualitySection";
import { QUALITY } from "@/app/(frontend)/about/pagesection/about";
import ProcessSection from "@/app/(frontend)/automotive/pagesection/ProcessSection";
import FeaturedSection from "./pagesection/FeaturedSection";
import PortfolioSection from "./pagesection/PortfolioSection";
import {
  CAPABILITIES,
  CAPABILITIES_COPY,
  CLOSING_PHRASES,
  HERO,
  PROCESS,
  STAGES,
} from "./pagesection/machinery";

export const metadata: Metadata = {
  title: "Industrial Machinery — Thimark",
  description:
    "Thimark engineers and manufactures custom machinery and industrial systems for water and hydropower infrastructure, industrial processing, and material handling, including the KILGARRAH 600 for KenGen.",
};

const CREAM = "relative z-10 bg-cream [--page-bg:var(--cream)] [--page-ink:var(--steel)]";
const STEEL = "relative z-10 bg-steel [--page-bg:var(--steel)] [--page-ink:var(--cream)]";

export default function IndustrialMachineryPage() {
  return (
    <main className="product-page content-plate pt-14 xl:ml-sidebar xl:pt-0">
      <div className={CREAM}>
        <AboutHero
          id="hero"
          copy={HERO}
        />
        <SectionBreak tone="page" />
        <PortfolioSection />
        <SectionBreak tone="page" />
        <ProcessSection id="process" copy={PROCESS} stages={STAGES} pace={0.75} />
      </div>
      <div className={STEEL}>
        <SectionBreak tone="page" />
        <FeaturedSection />
      </div>
      <div className={CREAM}>
        <SectionBreak tone="page" />
        <CapabilitiesSection
          id="capabilities"
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
