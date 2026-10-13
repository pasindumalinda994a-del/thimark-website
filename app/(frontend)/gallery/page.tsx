import type { Metadata } from "next";
import GalleryView from "@/app/(frontend)/gallery/GalleryView";
import { getGalleryFrames } from "@/cms/queries/gallery";

export const metadata: Metadata = {
  title: "Gallery — Thimark",
  description:
    "Photographs from Thimark's Kadawatha workshop, the Kilgharrah 600, SLTC awards, and company events.",
};

export default async function GalleryPage() {
  const frames = await getGalleryFrames();

  return (
    <main className="gallery content-plate relative z-10 bg-cream pt-14 text-steel xl:ml-sidebar xl:pt-0 [--page-bg:var(--cream)] [--page-ink:var(--steel)]">
      <GalleryView frames={frames} />
    </main>
  );
}
