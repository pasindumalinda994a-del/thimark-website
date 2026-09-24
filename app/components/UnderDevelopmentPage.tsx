type UnderDevelopmentPageProps = {
  name: string;
};

export default function UnderDevelopmentPage({ name }: UnderDevelopmentPageProps) {
  return (
    <main className="content-plate min-h-dvh bg-cream pt-14 md:ml-sidebar md:pt-0 [--page-bg:var(--cream)] [--page-ink:var(--steel)]">
      <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-4 md:min-h-dvh">
        <h1 className="font-heading text-center text-[clamp(28px,3.4vw,48px)] leading-none font-medium text-steel uppercase">
          {name} under development
        </h1>
      </div>
    </main>
  );
}
