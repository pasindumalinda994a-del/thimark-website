import SectionBreak from "@/app/(frontend)/components/SectionBreak";
import NewsroomIndex from "@/app/(frontend)/newsroom/NewsroomIndex";
import NewsroomVideos from "@/app/(frontend)/newsroom/NewsroomVideos";
import JsonLd from "@/app/(frontend)/seo/JsonLd";
import { pageMetadata } from "@/app/(frontend)/seo/metadata";
import { breadcrumbNode, graph, webPageNode } from "@/app/(frontend)/seo/schema";
import { getNewsRecords } from "@/cms/queries/news";
import { getNewsVideos } from "@/cms/queries/videos";

const SEO = {
  title: "Newsroom",
  description:
    "News from Thimark in Sri Lanka: the KILGHARRAH 600 hydropower project for KenGen, SLTC innovation awards, product launches and export work.",
  path: "/newsroom",
};

export const metadata = pageMetadata({
  ...SEO,
  keywords: ["Thimark news", "KILGHARRAH 600", "KenGen", "Sri Lanka engineering exports"],
});

const SCHEMA = graph(
  webPageNode({ type: "CollectionPage", name: SEO.title, description: SEO.description, path: SEO.path }),
  breadcrumbNode([{ name: "Newsroom", path: SEO.path }]),
);

export default async function NewsroomPage() {
  const [records, videos] = await Promise.all([getNewsRecords(), getNewsVideos()]);

  return (
    <main className="newsroom content-plate relative z-10 bg-cream pt-14 text-steel xl:ml-sidebar xl:pt-0 [--page-bg:var(--cream)] [--page-ink:var(--steel)]">
      <JsonLd data={SCHEMA} />
      <NewsroomIndex records={records} />
      {videos.length > 0 ? (
        <>
          <SectionBreak tone="page" />
          <NewsroomVideos videos={videos} />
        </>
      ) : null}
    </main>
  );
}
