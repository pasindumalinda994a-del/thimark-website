import type { Metadata } from "next";
import RfqView from "@/app/request-a-quote/RfqView";
import { parseService } from "@/app/request-a-quote/rfq-schema";

export const metadata: Metadata = {
  title: "Request a Quote — Thimark",
  description:
    "Automotive components, industrial machinery, powder coating or a general engineering inquiry — tell Thimark what you need, upload your drawings and get a considered quotation.",
};

type RequestQuoteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RequestQuotePage({ searchParams }: RequestQuoteProps) {
  const { service } = await searchParams;
  const initial = parseService(Array.isArray(service) ? service[0] : service);

  return (
    <main className="rfq content-plate relative z-10 bg-cream pt-14 text-steel md:ml-sidebar md:pt-0 [--page-bg:var(--cream)] [--page-ink:var(--steel)]">
      <RfqView key={initial ?? "none"} initialService={initial} />
    </main>
  );
}
