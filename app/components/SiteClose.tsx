"use client";

import { usePathname } from "next/navigation";
import Footer from "@/app/components/Footer";
import QuoteSection from "@/app/components/QuoteSection";
import SectionBreak from "@/app/components/SectionBreak";

export default function SiteClose() {
  const pathname = usePathname() ?? "/";
  const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  if (path === "/gallery") return null;

  const showQuote = path !== "/contact" && path !== "/request-a-quote";

  return (
    <>
      {showQuote ? (
        <div className="content-plate relative z-10 bg-steel md:ml-sidebar [--page-bg:var(--steel)] [--page-ink:var(--cream)]">
          <SectionBreak tone="page" />
          <QuoteSection />
        </div>
      ) : null}
      <Footer />
    </>
  );
}
