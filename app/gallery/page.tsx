import type { Metadata } from "next";
import GalleryView from "@/app/gallery/GalleryView";

export const metadata: Metadata = {
  title: "Gallery — Thimark",
  description:
    "A visual index of Thimark's manufacturing floor, automotive components, industrial machinery, engineering work, projects, and people in Kadawatha.",
};

export default function GalleryPage() {
  return (
    <main className="gallery content-plate relative z-10 bg-cream pt-14 text-steel md:ml-sidebar md:pt-0 [--page-bg:var(--cream)] [--page-ink:var(--steel)]">
      <GalleryView />
    </main>
  );
}
