"use client";

import { usePathname } from "next/navigation";
import Footer from "@/app/(frontend)/components/Footer";
import { RAQ_LINK } from "@/app/(frontend)/components/nav";
import QuoteSection, { type QuoteCopy } from "@/app/(frontend)/components/QuoteSection";
import SectionBreak from "@/app/(frontend)/components/SectionBreak";

const QUOTE_COPY: Record<string, QuoteCopy> = {
  "/about": {
    eyebrow: "Your Next Engineering Challenge Starts Here",
    heading: ["Let\u2019s Turn Your Requirement", "Into a Solution."],
    lede: "Looking for an OEM partner, precision components or custom machinery? Thimark brings the people, expertise and manufacturing to move your project forward.",
    closing: ["Tell us what you need.", "Let\u2019s explore what\u2019s possible."],
    primary: { label: "Request a Quote", href: RAQ_LINK.href },
    secondary: { label: "Talk to Our Team", href: "tel:+94112051944" },
  },
  "/automotive": {
    eyebrow: "Request a Quote",
    heading: ["Looking for a Reliable Automotive", "Component Manufacturing Partner?"],
    lede: "Whether you need established motorcycle components or a specific metallic part, we work with your team on application, specs and production needs.",
    closing: ["Let\u2019s discuss your requirements", "and support your next project."],
    primary: { label: "Request a Component Quote", href: "/enquire?service=automotive" },
    secondary: { label: "Talk to Our Team", href: "tel:+94112051944" },
  },
  "/industrial-machinery": {
    eyebrow: "Request a Quote",
    heading: ["Have a Machinery Challenge?", "Let\u2019s Engineer the Solution."],
    lede: "Planning hydropower equipment, processing machinery or a custom machine? We work with your team to understand the requirement and explore a practical solution.",
    closing: ["Share your application with us.", "Let\u2019s engineer what comes next."],
    primary: { label: "Request a Quote", href: "/enquire?service=industrial" },
    secondary: { label: "Talk to Our Team", href: "tel:+94112051944" },
  },
  "/engineering-services": {
    eyebrow: "Request a Quote",
    heading: ["Have an Engineering Challenge?", "Let\u2019s Work Through It."],
    lede: "Developing a product, recreating a part, checking manufacturability or finishing a surface? Our team is ready to understand your requirements.",
    closing: ["Tell us what you need.", "Let\u2019s explore what\u2019s possible."],
    primary: { label: "Request a Quote", href: RAQ_LINK.href },
    secondary: { label: "Talk to Our Team", href: "tel:+94112051944" },
  },
};

export default function SiteClose() {
  const pathname = usePathname() ?? "/";
  const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  if (path === "/gallery") return null;

  const showQuote = path !== "/enquire";

  return (
    <>
      {showQuote ? (
        <div className="content-plate relative z-10 bg-steel xl:ml-sidebar [--page-bg:var(--steel)] [--page-ink:var(--cream)]">
          <SectionBreak tone="page" />
          <QuoteSection copy={QUOTE_COPY[path]} />
        </div>
      ) : null}
      <Footer />
    </>
  );
}
