import PreLoading from "@/app/components/PreLoading";
import SectionBreak from "@/app/components/SectionBreak";
import AboutSection from "@/app/homesections/AboutSection";
import CapabilitiesSection from "@/app/homesections/CapabilitiesSection";
import FeturedProducts from "@/app/homesections/FeturedProducts";
import HeroSection from "@/app/homesections/HeroSection";
import OurTwoCoreSection from "@/app/homesections/OurTwoCoreSection";
import PartnersSection from "@/app/homesections/PartnersSection";
import ProductCatalogueSection from "@/app/homesections/ProductCatalogueSection";
import QualitySection from "@/app/homesections/QualitySection";

export default function Home() {
  return (
    <>
      <PreLoading />
      <main className="content-plate md:ml-sidebar">
        <div
          id="foreground-plate"
          className="relative z-10 bg-steel [--page-bg:var(--steel)] [--page-ink:var(--cream)]"
        >
          <HeroSection />
          <SectionBreak tone="dark" />
          <AboutSection />
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
          <ProductCatalogueSection />
        </div>
      </main>
    </>
  );
}
