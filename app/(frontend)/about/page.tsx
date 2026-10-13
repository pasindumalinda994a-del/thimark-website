import type { Metadata } from "next";
import PhraseBar from "@/app/(frontend)/components/PhraseBar";
import SectionBreak from "@/app/(frontend)/components/SectionBreak";
import CapabilitiesSection from "@/app/(frontend)/homesections/CapabilitiesSection";
import AboutHero from "./pagesection/AboutHero";
import JourneySection from "./pagesection/JourneySection";
import LeadershipSection from "./pagesection/LeadershipSection";
import QualitySection, { QualityCred } from "./pagesection/QualitySection";
import RecognitionSection from "./pagesection/RecognitionSection";
import StorySection from "./pagesection/StorySection";
import VisionMissionSection from "./pagesection/VisionMissionSection";
import { HOW_WE_WORK, PRACTICES, QUALITY } from "./pagesection/about";

export const metadata: Metadata = {
  title: "About Us — Thimark",
  description:
    "Thimark Technocreations is a Sri Lankan engineering and manufacturing company, from steel fabrication in 2014 to ISO 9001:2015 certified OEM manufacturing, custom industrial machinery and engineering services.",
};

const CREAM = "relative z-10 bg-cream [--page-bg:var(--cream)] [--page-ink:var(--steel)]";
const STEEL = "relative z-10 bg-steel [--page-bg:var(--steel)] [--page-ink:var(--cream)]";

export default function AboutPage() {
  return (
    <main className="about-page content-plate pt-14 xl:ml-sidebar xl:pt-0">
      <div className={CREAM}>
        <AboutHero />
        <SectionBreak tone="page" />
        <StorySection />
        <SectionBreak tone="page" />
        <JourneySection />
      </div>
      <div className={STEEL}>
        <SectionBreak tone="page" />
        <VisionMissionSection />
      </div>
      <div className={CREAM}>
        <SectionBreak tone="page" />
        <QualitySection />
        <SectionBreak tone="page" />
        <CapabilitiesSection
          id="how-we-work"
          items={PRACTICES}
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
        <LeadershipSection />
      </div>
    </main>
  );
}
