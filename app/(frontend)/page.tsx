import PreLoading from "@/app/(frontend)/components/PreLoading";
import SectionBreak from "@/app/(frontend)/components/SectionBreak";
import StorySection from "@/app/(frontend)/about/pagesection/StorySection";
import AboutSection from "@/app/(frontend)/homesections/AboutSection";
import CapabilitiesSection from "@/app/(frontend)/homesections/CapabilitiesSection";
import FeturedProducts from "@/app/(frontend)/homesections/FeturedProducts";
import HeroSection from "@/app/(frontend)/homesections/HeroSection";
import OurTwoCoreSection from "@/app/(frontend)/homesections/OurTwoCoreSection";
import PartnersSection from "@/app/(frontend)/homesections/PartnersSection";
import QualitySection from "@/app/(frontend)/homesections/QualitySection";

export default function Home() {
  return (
    <>
      <PreLoading />
      <main className="content-plate pt-14 xl:ml-sidebar xl:pt-0">
        <div
          id="foreground-plate"
          className="relative z-10 bg-steel [--page-bg:var(--steel)] [--page-ink:var(--cream)]"
        >
          <HeroSection />
          <SectionBreak tone="dark" />
          <StorySection />
          <SectionBreak tone="dark" />
          <AboutSection figures showTitles />
          <SectionBreak tone="dark" />
          <OurTwoCoreSection />
        </div>
        <div className="relative z-10 bg-cream [--page-bg:var(--cream)] [--page-ink:var(--steel)]">
          <SectionBreak tone="dark" />
          <FeturedProducts />
        </div>
        <div className="relative z-10 bg-cream [--page-bg:var(--cream)] [--page-ink:var(--steel)]">
          <SectionBreak tone="dark" />
          <CapabilitiesSection />
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
