import PhraseBar from "@/app/(frontend)/components/PhraseBar";
import SectionBreak from "@/app/(frontend)/components/SectionBreak";
import { isoGlyphs } from "@/app/(frontend)/components/isoGlyphs";
import CapabilitiesSection from "@/app/(frontend)/homesections/CapabilitiesSection";
import AboutHero from "@/app/(frontend)/about/pagesection/AboutHero";
import { QualityCred } from "@/app/(frontend)/about/pagesection/QualitySection";
import { QUALITY } from "@/app/(frontend)/about/pagesection/about";
import JsonLd from "@/app/(frontend)/seo/JsonLd";
import { pageMetadata } from "@/app/(frontend)/seo/metadata";
import { breadcrumbNode, graph, serviceNode, webPageNode } from "@/app/(frontend)/seo/schema";
import LocalValueSection from "./pagesection/LocalValueSection";
import OemSection from "./pagesection/OemSection";
import ProcessSection from "./pagesection/ProcessSection";
import RangeSection from "./pagesection/RangeSection";
import {
  CAPABILITIES,
  CAPABILITIES_COPY,
  CLOSING_PHRASES,
  COMPONENTS,
  HERO,
  PROCESS_CTA,
  STAGES,
} from "./pagesection/automotive";

const SEO = {
  title: "OEM Motorcycle Parts Manufacturer in Sri Lanka",
  description:
    "OEM motorcycle parts manufacturer in Sri Lanka making brackets, centre and side stands, leg guards, handlebars and carriers for local vehicle assembly.",
  path: "/automotive",
};

export const metadata = pageMetadata({
  ...SEO,
  og: "automotive",
  keywords: [
    "automotive component manufacturer",
    "motorcycle parts manufacturer",
    "OEM automotive components",
    "motorcycle component supplier",
    "motorcycle brackets manufacturer",
    "motorcycle battery bracket manufacturer",
    "automotive sheet metal components",
    "automotive metal fabrication",
  ],
});

const SCHEMA = graph(
  webPageNode({ name: SEO.title, description: SEO.description, path: SEO.path }),
  breadcrumbNode([{ name: "Automotive Components", path: SEO.path }]),
  serviceNode({
    name: "OEM Automotive Component Manufacturing",
    serviceType: "Motorcycle parts manufacturing",
    description: SEO.description,
    path: SEO.path,
    catalog: {
      name: "Metallic motorcycle components",
      groups: COMPONENTS.map((group) => ({ name: group.title, items: group.items })),
    },
  }),
);

const CREAM = "relative z-10 bg-cream [--page-bg:var(--cream)] [--page-ink:var(--steel)]";
const STEEL = "relative z-10 bg-steel [--page-bg:var(--steel)] [--page-ink:var(--cream)]";

export default function AutomotivePage() {
  return (
    <main className="product-page content-plate pt-14 xl:ml-sidebar xl:pt-0">
      <JsonLd data={SCHEMA} />
      <div className={CREAM}>
        <AboutHero
          id="hero"
          copy={HERO}
          ctaCol={8}
        />
        <SectionBreak tone="page" />
        <RangeSection glyphs={isoGlyphs(COMPONENTS, "vm-principle-mark")} />
      </div>
      <div className={STEEL}>
        <SectionBreak tone="page" />
        <OemSection />
        <SectionBreak tone="page" />
        <LocalValueSection />
      </div>
      <div className={CREAM}>
        <SectionBreak tone="page" />
        <ProcessSection cta={PROCESS_CTA} glyphs={isoGlyphs(STAGES, "ps-glyph-mark")} />
        <SectionBreak tone="page" />
        <CapabilitiesSection
          id="manufacturing"
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
