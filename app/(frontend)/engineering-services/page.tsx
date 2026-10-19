import PhraseBar from "@/app/(frontend)/components/PhraseBar";
import SectionBreak from "@/app/(frontend)/components/SectionBreak";
import { isoGlyphs } from "@/app/(frontend)/components/isoGlyphs";
import CapabilitiesSection from "@/app/(frontend)/homesections/CapabilitiesSection";
import AboutHero from "@/app/(frontend)/about/pagesection/AboutHero";
import QualitySection, { QualityCred } from "@/app/(frontend)/about/pagesection/QualitySection";
import ProcessSection from "@/app/(frontend)/automotive/pagesection/ProcessSection";
import JsonLd from "@/app/(frontend)/seo/JsonLd";
import { pageMetadata } from "@/app/(frontend)/seo/metadata";
import { breadcrumbNode, graph, serviceNode, webPageNode } from "@/app/(frontend)/seo/schema";
import ReverseEngineeringSection from "./pagesection/ReverseEngineeringSection";
import SurfaceFinishingSection from "./pagesection/SurfaceFinishingSection";
import {
  CAPABILITIES,
  CAPABILITIES_COPY,
  CLOSING_PHRASES,
  ENGINEERING,
  FINISHES,
  HERO,
  NPD,
  NPD_CTA,
  NPD_STEPS,
  REVERSE_CAPABILITIES,
} from "./pagesection/services";

const SEO = {
  title: "Reverse Engineering & Product Development Services",
  description:
    "Product development, reverse engineering, 3D scanning and powder coating services in Sri Lanka, taking parts from concept and prototype to production.",
  path: "/engineering-services",
};

export const metadata = pageMetadata({
  ...SEO,
  og: "engineering-services",
  keywords: [
    "reverse engineering services",
    "product development engineering services",
    "precision engineering services",
    "powder coating services",
    "metal fabrication services",
    "industrial machinery design services",
    "3D scanning Sri Lanka",
  ],
});

const SCHEMA = graph(
  webPageNode({ name: SEO.title, description: SEO.description, path: SEO.path }),
  breadcrumbNode([{ name: "Engineering Services", path: SEO.path }]),
  serviceNode({
    name: "New Product Development",
    serviceType: "Product development engineering services",
    description: HERO.body ?? SEO.description,
    path: `${SEO.path}#new-product-development`,
    catalog: {
      name: "Product development stages",
      groups: NPD_STEPS.map((step) => ({ name: step.title, items: [step.body] })),
    },
  }),
  serviceNode({
    name: "Reverse Engineering & 3D Scanning",
    serviceType: "Reverse engineering services",
    description:
      "Reverse engineering turns physical components into usable engineering information, through 3D scanning, digital modelling, simulation and design evaluation.",
    path: `${SEO.path}#reverse-engineering`,
    catalog: {
      name: "Reverse engineering capabilities",
      groups: REVERSE_CAPABILITIES.map((item) => ({ name: item.title, items: [item.body] })),
    },
  }),
  serviceNode({
    name: "Powder Coating & Surface Finishing",
    serviceType: "Powder coating services",
    description:
      "Powder coating, ED/e-coating, black zinc and hard chromium electroplating for metallic components, with an 11-stage dip pre-treatment process.",
    path: `${SEO.path}#surface-finishing`,
    catalog: {
      name: "Surface finishing services",
      groups: FINISHES.map((finish) => ({ name: finish.label, items: [finish.lead] })),
    },
  }),
);

const CREAM = "relative z-10 bg-cream [--page-bg:var(--cream)] [--page-ink:var(--steel)]";
const STEEL = "relative z-10 bg-steel [--page-bg:var(--steel)] [--page-ink:var(--cream)]";

export default function EngineeringServicesPage() {
  return (
    <main className="product-page content-plate pt-14 xl:ml-sidebar xl:pt-0">
      <JsonLd data={SCHEMA} />
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
          glyphs={isoGlyphs(NPD_STEPS, "ps-glyph-mark")}
          cta={NPD_CTA}
          pace={0.75}
          visual="glyph"
        />
        <SectionBreak tone="page" />
        <ReverseEngineeringSection glyphs={isoGlyphs(REVERSE_CAPABILITIES, "vm-principle-mark")} />
      </div>
      <div className={STEEL}>
        <SectionBreak tone="page" />
        <SurfaceFinishingSection glyphs={isoGlyphs(FINISHES, "sf-finish-mark")} />
      </div>
      <div className={CREAM}>
        <SectionBreak tone="page" />
        <QualitySection id="engineering-quality" copy={ENGINEERING} />
        <SectionBreak tone="page" />
        <CapabilitiesSection
          id="capabilities"
          items={CAPABILITIES}
          glyphs={isoGlyphs(CAPABILITIES, "caps-glyph")}
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
