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
    lede: "Whether you are looking for a reliable OEM manufacturing partner, precision-engineered components or custom industrial machinery, Thimark brings together the people, expertise and manufacturing capabilities to help move your project forward.",
    closing: ["Tell us what you need.", "Let\u2019s explore what\u2019s possible."],
    primary: { label: "Enquire", href: RAQ_LINK.href },
    secondary: { label: "Talk to Our Team", href: "tel:+94112051944" },
  },
  "/automotive": {
    eyebrow: "Request a Quote",
    heading: ["Looking for a Reliable Automotive", "Component Manufacturing Partner?"],
    lede: "Whether you need established motorcycle components or have a specific metallic component requirement, Thimark can work with your team to understand the application, manufacturing specifications and production needs.",
    closing: ["Let\u2019s discuss your requirements", "and support your next project."],
    primary: { label: "Request a Quote", href: RAQ_LINK.href },
    secondary: { label: "Contact Our Team", href: "tel:+94112051944" },
  },
  "/industrial-machinery": {
    eyebrow: "Request a Quote",
    heading: ["Have a Machinery Challenge?", "Let\u2019s Engineer the Solution."],
    lede: "Whether you are planning a hydropower system, developing industrial processing equipment, or looking for custom machinery for a specialized application, Thimark can work with your team to understand the requirement and explore a practical solution.",
    closing: [
      "Share your application, operating requirements, or project concept with us.",
      "Let\u2019s bring engineering and manufacturing together to move your project forward.",
    ],
    primary: { label: "Request a Quote", href: "/enquire?service=industrial" },
    secondary: { label: "Contact Our Team", href: "tel:+94112051944" },
  },
  "/engineering-services": {
    eyebrow: "Request a Quote",
    heading: ["Have an Engineering Challenge?", "Let\u2019s Work Through It."],
    lede: "Whether you are developing a new product, recreating an existing component, evaluating a design for manufacturing, or looking for a suitable surface finishing solution, our team is ready to understand your requirements.",
    closing: [
      "Tell us what you need to develop, improve, or finish.",
      "Together, we can explore a practical engineering solution aligned with your application and production goals.",
    ],
    primary: { label: "Request a Quote", href: RAQ_LINK.href },
    secondary: { label: "Contact Our Team", href: "tel:+94112051944" },
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
        <div className="content-plate relative z-10 bg-steel md:ml-sidebar [--page-bg:var(--steel)] [--page-ink:var(--cream)]">
          <SectionBreak tone="page" />
          <QuoteSection copy={QUOTE_COPY[path]} />
        </div>
      ) : null}
      <Footer />
    </>
  );
}
