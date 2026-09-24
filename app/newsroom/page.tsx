import type { Metadata } from "next";
import NewsroomIndex from "@/app/newsroom/NewsroomIndex";

export const metadata: Metadata = {
  title: "Newsroom — Thimark",
  description:
    "Company news, project dispatches, awards, and export work from Thimark in Kadawatha.",
};

export default function NewsroomPage() {
  return (
    <main className="newsroom content-plate relative z-10 bg-cream pt-14 text-steel md:ml-sidebar md:pt-0 [--page-bg:var(--cream)] [--page-ink:var(--steel)]">
      <NewsroomIndex />
    </main>
  );
}
