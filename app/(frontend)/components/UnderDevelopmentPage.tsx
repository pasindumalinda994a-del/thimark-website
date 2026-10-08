import BrandButton from "@/app/(frontend)/components/BrandButton";
import { RAQ_LINK } from "@/app/(frontend)/components/nav";

type UnderDevelopmentPageProps = {
  name: string;
  /** Shows the Enquire button when the page is a service that used to deep-link a topic. */
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
            href={`${RAQ_LINK.href}?service=${quoteService}`}
            aria-label={RAQ_LINK.ariaLabel}
            className="w-full max-w-[320px]"
          >
            {RAQ_LINK.label}
          </BrandButton>
        ) : null}
      </div>
    </main>
  );
}
