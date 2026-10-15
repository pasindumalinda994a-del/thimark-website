import EnquireView from "@/app/(frontend)/enquire/EnquireView";
import { parseTopic } from "@/app/(frontend)/enquire/enquire";
import JsonLd from "@/app/(frontend)/seo/JsonLd";
import { pageMetadata } from "@/app/(frontend)/seo/metadata";
import { breadcrumbNode, graph, webPageNode } from "@/app/(frontend)/seo/schema";

const SEO = {
  title: "Request a Quote: Fabrication & Machinery",
  description:
    "Request a quote for OEM components, custom industrial machinery, metal fabrication or powder coating. Call +94 112 051 944 or send us your drawing.",
  path: "/enquire",
};

export const metadata = pageMetadata({
  ...SEO,
  keywords: [
    "request a quote",
    "metal fabrication quote Sri Lanka",
    "custom machinery quote",
    "contact Thimark",
  ],
});

const SCHEMA = graph(
  webPageNode({ type: "ContactPage", name: SEO.title, description: SEO.description, path: SEO.path }),
  breadcrumbNode([{ name: "Contact", path: SEO.path }]),
);

type EnquirePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EnquirePage({ searchParams }: EnquirePageProps) {
  const { service } = await searchParams;
  const initial = parseTopic(Array.isArray(service) ? service[0] : service);

  return (
    <main className="enquire content-plate relative z-10 bg-cream pt-14 text-steel xl:ml-sidebar xl:pt-0 [--page-bg:var(--cream)] [--page-ink:var(--steel)]">
      <JsonLd data={SCHEMA} />
      <EnquireView
        key={initial ?? "none"}
        initialTopic={initial}
        uploadsEnabled={Boolean(process.env.BLOB_READ_WRITE_TOKEN)}
      />
    </main>
  );
}
