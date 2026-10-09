import type { Metadata } from "next";
import SectionBreak from "@/app/(frontend)/components/SectionBreak";
import AboutSection from "@/app/(frontend)/homesections/AboutSection";
import AboutHero from "./pagesection/AboutHero";
import LeadershipSection from "./pagesection/LeadershipSection";
import OverviewSection from "./pagesection/OverviewSection";
import RecognitionSection from "./pagesection/RecognitionSection";
import VisionMissionSection from "./pagesection/VisionMissionSection";
import { JOURNEY, JOURNEY_COPY } from "./pagesection/about";

export const metadata: Metadata = {
  title: "About Us — Thimark",
  description:
    "Thimark Technocreations is a Sri Lankan engineering and manufacturing company: ISO 9001:2015 certified, OEM component supplier and builder of custom industrial machinery, from Kadawatha to KenGen in Kenya.",
};

const CREAM = "relative z-10 bg-cream [--page-bg:var(--cream)] [--page-ink:var(--steel)]";
const STEEL = "relative z-10 bg-steel [--page-bg:var(--steel)] [--page-ink:var(--cream)]";

export default function AboutPage() {
  return (
    <main className="about-page content-plate pt-14 md:ml-sidebar md:pt-0">
      <div className={CREAM}>
        <AboutHero />
        <SectionBreak tone="page" />
        <OverviewSection />
      </div>
      <div className={STEEL}>
        <SectionBreak tone="page" />
        <VisionMissionSection />
      </div>
      <div className={CREAM}>
        <SectionBreak tone="page" />
        <AboutSection id="journey" copy={JOURNEY_COPY} items={JOURNEY} showTitles />
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
