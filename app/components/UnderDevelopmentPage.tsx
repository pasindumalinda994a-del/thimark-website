import BrandButton from "@/app/components/BrandButton";

type UnderDevelopmentPageProps = {
  name: string;
  /** Service slug for a Request a Quote deep link, e.g. "automotive". */
  quoteService?: string;
};

export default function UnderDevelopmentPage({ name, quoteService }: UnderDevelopmentPageProps) {
  return (
    <main className="content-plate min-h-dvh bg-cream pt-14 md:ml-sidebar md:pt-0 [--page-bg:var(--cream)] [--page-ink:var(--steel)]">
      <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center gap-10 px-4 md:min-h-dvh">
        <h1 className="font-heading text-center text-[clamp(28px,3.4vw,48px)] leading-none font-medium text-steel uppercase">
          {name} under development
        </h1>
        {quoteService ? (
          <BrandButton
            href={`/request-a-quote?service=${quoteService}`}
            className="w-full max-w-[320px]"
          >
            Request a Quote
          </BrandButton>
        ) : null}
      </div>
    </main>
  );
}
