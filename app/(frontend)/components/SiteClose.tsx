"use client";

import { usePathname } from "next/navigation";
import Footer from "@/app/(frontend)/components/Footer";
import { RAQ_LINK } from "@/app/(frontend)/components/nav";
import QuoteSection, { type QuoteCopy } from "@/app/(frontend)/components/QuoteSection";
import SectionBreak from "@/app/(frontend)/components/SectionBreak";

const QUOTE_COPY: Record<string, QuoteCopy> = {
  "/about": {
    eyebrow: "Have an Engineering Challenge?",
    heading: "Let\u2019s Build What\u2019s Next.",
    lede: "Thimark combines engineering expertise, manufacturing capability and a commitment to innovation to help turn ambitious requirements into practical solutions.",
    closing: ["Tell us what you need.", "We\u2019ll help engineer what comes next."],
    primary: { label: RAQ_LINK.label, href: RAQ_LINK.href },
    secondary: { label: "Explore Our Capabilities", href: "/#capabilities" },
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
