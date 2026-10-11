"use client";

import { usePathname } from "next/navigation";
import Footer from "@/app/(frontend)/components/Footer";
import { RAQ_LINK } from "@/app/(frontend)/components/nav";
import QuoteSection, { type QuoteCopy } from "@/app/(frontend)/components/QuoteSection";
import SectionBreak from "@/app/(frontend)/components/SectionBreak";

const QUOTE_COPY: Record<string, QuoteCopy> = {
  "/about": {
    eyebrow: "Have an Engineering Challenge?",
    heading: ["Let\u2019s Build", "What\u2019s Next."],
    lede: "Thimark combines engineering expertise, manufacturing capability and a commitment to innovation to help turn ambitious requirements into practical solutions.",
    closing: ["Tell us what you need.", "We\u2019ll help engineer what comes next."],
    primary: { label: RAQ_LINK.label, href: RAQ_LINK.href },
    secondary: { label: "Explore Our Capabilities", href: "/#capabilities" },
  },
  "/industrial-machinery": {
    eyebrow: "Have an Engineering Challenge?",
    heading: ["Let\u2019s Turn Your Requirement", "Into a Solution."],
    lede: "Whether you need custom industrial machinery, specialized mechanical equipment, fabricated components or an automated system, our engineering team is ready to understand your requirement and explore the right solution.",
    closing: ["Tell us what you need.", "We\u2019ll help engineer what comes next."],
    primary: { label: "Request an Industrial Quote", href: RAQ_LINK.href },
    secondary: { label: "Talk to Our Team", href: "tel:+94112051944" },
  },
  "/engineering-services": {
    eyebrow: "Have an Engineering Requirement?",
    heading: ["Let\u2019s Turn Your Requirement", "Into a Solution."],
    lede: "Whether you\u2019re developing a new product, investigating an existing component or looking for a powder coating partner, our team is ready to understand your requirements and explore the right solution.",
    closing: ["Tell us what you need.", "We\u2019ll help engineer what comes next."],
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
        <div className="content-plate relative z-10 bg-steel md:ml-sidebar [--page-bg:var(--steel)] [--page-ink:var(--cream)]">
          <SectionBreak tone="page" />
          <QuoteSection copy={QUOTE_COPY[path]} />
        </div>
      ) : null}
      <Footer />
    </>
  );
}
