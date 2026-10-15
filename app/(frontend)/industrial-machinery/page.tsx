import PhraseBar from "@/app/(frontend)/components/PhraseBar";
import SectionBreak from "@/app/(frontend)/components/SectionBreak";
import { isoGlyphs } from "@/app/(frontend)/components/isoGlyphs";
import CapabilitiesSection from "@/app/(frontend)/homesections/CapabilitiesSection";
import AboutHero from "@/app/(frontend)/about/pagesection/AboutHero";
import { QualityCred } from "@/app/(frontend)/about/pagesection/QualitySection";
import { QUALITY } from "@/app/(frontend)/about/pagesection/about";
import ProcessSection from "@/app/(frontend)/automotive/pagesection/ProcessSection";
import JsonLd from "@/app/(frontend)/seo/JsonLd";
import { pageMetadata } from "@/app/(frontend)/seo/metadata";
import { breadcrumbNode, graph, serviceNode, webPageNode } from "@/app/(frontend)/seo/schema";
import FeaturedSection from "./pagesection/FeaturedSection";
import PortfolioSection from "./pagesection/PortfolioSection";
import {
  BANDS,
  CAPABILITIES,
  CAPABILITIES_COPY,
  CLOSING_PHRASES,
  HERO,
  PROCESS,
  STAGES,
} from "./pagesection/machinery";

const SEO = {
  title: "Industrial Machinery Manufacturer in Sri Lanka",
  description:
    "Custom industrial machinery made in Sri Lanka: hydropower trash rack cleaners, sluice gates, pneumatic conveyors, dust collectors and special-purpose machines.",
  path: "/industrial-machinery",
};

export const metadata = pageMetadata({
  ...SEO,
  og: "industrial-machinery",
  keywords: [
    "industrial machinery manufacturer",
    "custom industrial machinery manufacturer",
    "industrial equipment manufacturer",
    "hydropower equipment manufacturer",
    "hydropower trash rack cleaning machine",
    "special purpose machine manufacturer",
    "pneumatic conveying system manufacturer",
    "industrial conveyor manufacturer",
    "dust collector manufacturer",
    "custom water management machinery",
    "KILGHARRAH 600",
  ],
});

const SCHEMA = graph(
  webPageNode({ name: SEO.title, description: SEO.description, path: SEO.path }),
  breadcrumbNode([{ name: "Industrial Machinery", path: SEO.path }]),
  serviceNode({
    name: "Custom Industrial Machinery Manufacturing",
    serviceType: "Industrial machinery design and manufacturing",
    description: SEO.description,
    path: SEO.path,
    catalog: {
      name: "Industrial machinery portfolio",
      groups: BANDS.map((band) => ({
        name: band.title,
        items: band.items.map((item) => item.name),
      })),
    },
  }),
);

const CREAM = "relative z-10 bg-cream [--page-bg:var(--cream)] [--page-ink:var(--steel)]";
const STEEL = "relative z-10 bg-steel [--page-bg:var(--steel)] [--page-ink:var(--cream)]";

export default function IndustrialMachineryPage() {
  return (
    <main className="product-page content-plate pt-14 xl:ml-sidebar xl:pt-0">
      <JsonLd data={SCHEMA} />
      <div className={CREAM}>
        <AboutHero
          id="hero"
          copy={HERO}
        />
        <SectionBreak tone="page" />
        <PortfolioSection />
        <SectionBreak tone="page" />
        <ProcessSection
          id="process"
          copy={PROCESS}
          stages={STAGES}
          glyphs={isoGlyphs(STAGES, "ps-glyph-mark")}
          pace={0.75}
        />
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
          glyphs={isoGlyphs(CAPABILITIES, "caps-glyph")}
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
