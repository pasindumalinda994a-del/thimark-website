import GalleryView from "@/app/(frontend)/gallery/GalleryView";
import JsonLd from "@/app/(frontend)/seo/JsonLd";
import { pageMetadata } from "@/app/(frontend)/seo/metadata";
import { breadcrumbNode, graph, webPageNode } from "@/app/(frontend)/seo/schema";
import { getGalleryFrames } from "@/cms/queries/gallery";

const SEO = {
  title: "Gallery",
  description:
    "Photographs of Thimark's Kadawatha engineering workshop, steel fabrication, the KILGHARRAH 600 hydropower trash rack cleaner, SLTC awards and company events.",
  path: "/gallery",
};

export const metadata = pageMetadata({
  ...SEO,
  keywords: ["Thimark gallery", "KILGHARRAH 600", "steel fabrication workshop Sri Lanka"],
});

const SCHEMA = graph(
  webPageNode({ type: "CollectionPage", name: SEO.title, description: SEO.description, path: SEO.path }),
  breadcrumbNode([{ name: "Gallery", path: SEO.path }]),
);

export default async function GalleryPage() {
  const frames = await getGalleryFrames();

  return (
    <main className="gallery content-plate relative z-10 h-dvh overflow-hidden bg-cream pt-14 text-steel xl:ml-sidebar xl:pt-0 [--page-bg:var(--cream)] [--page-ink:var(--steel)]">
      <JsonLd data={SCHEMA} />
      <GalleryView frames={frames} />
    </main>
  );
}
