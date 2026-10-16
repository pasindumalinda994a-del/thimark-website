import PhraseBar from "@/app/(frontend)/components/PhraseBar";
import SectionBreak from "@/app/(frontend)/components/SectionBreak";
import { isoGlyphs } from "@/app/(frontend)/components/isoGlyphs";
import CapabilitiesSection from "@/app/(frontend)/homesections/CapabilitiesSection";
import JsonLd from "@/app/(frontend)/seo/JsonLd";
import { pageMetadata } from "@/app/(frontend)/seo/metadata";
import { breadcrumbNode, graph, webPageNode } from "@/app/(frontend)/seo/schema";
import AboutHero from "./pagesection/AboutHero";
import JourneySection from "./pagesection/JourneySection";
import LeadershipSection from "./pagesection/LeadershipSection";
import QualitySection, { QualityCred } from "./pagesection/QualitySection";
import RecognitionSection from "./pagesection/RecognitionSection";
import StorySection from "./pagesection/StorySection";
import VisionMissionSection from "./pagesection/VisionMissionSection";
import {
  HOW_WE_WORK,
  JOURNEY,
  LEADERSHIP,
  PRACTICES,
  PRINCIPLES,
  QUALITY,
} from "./pagesection/about";

const SEO = {
  title: "About Thimark | ISO 9001 Engineering Company, Sri Lanka",
  description:
    "ISO 9001:2015 certified engineering company in Kadawatha, Sri Lanka, growing from steel fabrication in 2014 to OEM parts and industrial machinery manufacturing.",
  path: "/about",
};

export const metadata = pageMetadata({
  ...SEO,
  absoluteTitle: true,
  og: "about",
  keywords: [
    "engineering company Sri Lanka",
    "steel fabrication company",
    "heavy steel fabrication",
    "ISO 9001 manufacturer Sri Lanka",
    "engineering and manufacturing company",
    "manufacturing outsourcing",
  ],
});

const SCHEMA = graph(
  webPageNode({ type: "AboutPage", name: SEO.title, description: SEO.description, path: SEO.path }),
  breadcrumbNode([{ name: "About", path: SEO.path }]),
);

const CREAM = "relative z-10 bg-cream [--page-bg:var(--cream)] [--page-ink:var(--steel)]";
const STEEL = "relative z-10 bg-steel [--page-bg:var(--steel)] [--page-ink:var(--cream)]";

export default function AboutPage() {
  return (
    <main className="about-page content-plate pt-14 xl:ml-sidebar xl:pt-0">
      <JsonLd data={SCHEMA} />
      <div className={CREAM}>
        <AboutHero />
        <SectionBreak tone="page" />
        <StorySection />
        <SectionBreak tone="page" />
        <JourneySection glyphs={isoGlyphs(JOURNEY, "about-chapter-mark")} />
      </div>
      <div className={STEEL}>
        <SectionBreak tone="page" />
        <VisionMissionSection glyphs={isoGlyphs(PRINCIPLES, "vm-principle-mark")} />
      </div>
      <div className={CREAM}>
        <SectionBreak tone="page" />
        <QualitySection />
        <SectionBreak tone="page" />
        <CapabilitiesSection
          id="how-we-work"
          items={PRACTICES}
          glyphs={isoGlyphs(PRACTICES, "caps-glyph")}
          copy={HOW_WE_WORK}
          progressLabel={HOW_WE_WORK.progressLabel}
          foot={<PhraseBar phrases={HOW_WE_WORK.closing} />}
          cta={null}
          aside={<QualityCred {...QUALITY.cred} />}
        />
      </div>
      <div className={STEEL}>
        <SectionBreak tone="page" />
        <RecognitionSection />
      </div>
      <div className={CREAM}>
        <SectionBreak tone="page" />
        <LeadershipSection glyphs={isoGlyphs(LEADERSHIP.leaders, "ld-glyph-mark")} />
      </div>
    </main>
  );
}
