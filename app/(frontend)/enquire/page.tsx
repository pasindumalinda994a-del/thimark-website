import type { Metadata } from "next";
import EnquireView from "@/app/(frontend)/enquire/EnquireView";
import { parseTopic } from "@/app/(frontend)/enquire/enquire";

export const metadata: Metadata = {
  title: "Enquire — Thimark",
  description: "Send Thimark a requirement. Add a drawing if you have one.",
};

type EnquirePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EnquirePage({ searchParams }: EnquirePageProps) {
  const { service } = await searchParams;
  const initial = parseTopic(Array.isArray(service) ? service[0] : service);

  return (
    <main className="enquire content-plate relative z-10 bg-cream pt-14 text-steel xl:ml-sidebar xl:pt-0 [--page-bg:var(--cream)] [--page-ink:var(--steel)]">
      <EnquireView
        key={initial ?? "none"}
        initialTopic={initial}
        uploadsEnabled={Boolean(process.env.BLOB_READ_WRITE_TOKEN)}
      />
    </main>
  );
}
