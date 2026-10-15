import PreLoading from "@/app/(frontend)/components/PreLoading";
import SectionBreak from "@/app/(frontend)/components/SectionBreak";
import { isoGlyphs } from "@/app/(frontend)/components/isoGlyphs";
import StorySection from "@/app/(frontend)/about/pagesection/StorySection";
import AboutSection from "@/app/(frontend)/homesections/AboutSection";
import CapabilitiesSection from "@/app/(frontend)/homesections/CapabilitiesSection";
import { HOME_CAPABILITIES } from "@/app/(frontend)/homesections/capabilities";
import { STORY } from "@/app/(frontend)/homesections/StoryProgress";
import FeturedProducts from "@/app/(frontend)/homesections/FeturedProducts";
import HeroSection from "@/app/(frontend)/homesections/HeroSection";
import OurTwoCoreSection from "@/app/(frontend)/homesections/OurTwoCoreSection";
import PartnersSection from "@/app/(frontend)/homesections/PartnersSection";
import QualitySection from "@/app/(frontend)/homesections/QualitySection";
import JsonLd from "@/app/(frontend)/seo/JsonLd";
import { DEFAULT_DESCRIPTION, pageMetadata } from "@/app/(frontend)/seo/metadata";
import { graph, webPageNode } from "@/app/(frontend)/seo/schema";

const SEO = {
  title: "Engineering & Manufacturing Company in Sri Lanka | Thimark",
  description: DEFAULT_DESCRIPTION,
  path: "/",
};

export const metadata = pageMetadata({
  ...SEO,
  absoluteTitle: true,
  keywords: [
    "engineering company Sri Lanka",
    "engineering and manufacturing company",
    "industrial machinery manufacturer",
    "automotive component manufacturer",
    "steel fabrication company",
    "OEM manufacturing Sri Lanka",
  ],
});

export default function Home() {
  return (
    <>
      <JsonLd data={graph(webPageNode({ name: SEO.title, description: SEO.description, path: SEO.path }))} />
      <PreLoading />
      <main className="content-plate pt-14 xl:ml-sidebar xl:pt-0">
        <div
          id="foreground-plate"
          className="relative z-10 bg-steel [--page-bg:var(--steel)] [--page-ink:var(--cream)]"
        >
          <HeroSection />
          <SectionBreak tone="dark" />
          <StorySection cta={{ label: "See the Journey", href: "/#about" }} />
          <SectionBreak tone="dark" />
          <AboutSection figures showTitles glyphs={isoGlyphs(STORY, "about-chapter-mark")} />
          <SectionBreak tone="dark" />
          <OurTwoCoreSection />
        </div>
        <div className="relative z-10 bg-cream [--page-bg:var(--cream)] [--page-ink:var(--steel)]">
          <SectionBreak tone="dark" />
          <FeturedProducts />
        </div>
        <div className="relative z-10 bg-cream [--page-bg:var(--cream)] [--page-ink:var(--steel)]">
          <SectionBreak tone="dark" />
          <CapabilitiesSection glyphs={isoGlyphs(HOME_CAPABILITIES, "caps-glyph")} />
        </div>
        <div className="relative z-10 bg-steel [--page-bg:var(--steel)] [--page-ink:var(--cream)]">
          <SectionBreak tone="page" />
          <QualitySection />
        </div>
        <div className="relative z-10 bg-cream [--page-bg:var(--cream)] [--page-ink:var(--steel)]">
          <SectionBreak tone="dark" />
          <PartnersSection />
          <SectionBreak tone="dark" />
        </div>
      </main>
    </>
  );
}
