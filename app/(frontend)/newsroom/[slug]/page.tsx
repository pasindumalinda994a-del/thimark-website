import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Copy from "@/app/(frontend)/components/Copy";
import H1Heading from "@/app/(frontend)/components/H1Heading";
import H3Heading, { ArticleHeading } from "@/app/(frontend)/components/H3Heading";
import H2Heading from "@/app/(frontend)/components/H2Heading";
import PlusMark, { type PlusArms } from "@/app/(frontend)/components/PlusMark";
import { GridLine } from "@/app/(frontend)/components/SectionGrid";
import ArticleContents from "@/app/(frontend)/newsroom/ArticleContents";
import ArticleGallery from "@/app/(frontend)/newsroom/ArticleGallery";
import ArticleShare from "@/app/(frontend)/newsroom/ArticleShare";
import PreviewBar from "@/app/(frontend)/newsroom/PreviewBar";
import {
  categoryById,
  formatRecordDate,
  recordSrc,
  relatedRecords,
  type NewsRecord,
} from "@/app/(frontend)/newsroom/records";
import { getNewsRecord, getNewsRecords, getNewsSlugs } from "@/cms/queries/news";

type ArticleProps = {
  params: Promise<{ slug: string }>;
};

const joinLeftEdge: PlusArms = { up: true, down: true, left: false, right: true };
const joinRightEdge: PlusArms = { up: true, down: true, left: true, right: false };
const joinTeeUp: PlusArms = { up: true, down: false, left: true, right: true };
const joinTeeDown: PlusArms = { up: false, down: true, left: true, right: true };
const joinFootLeft: PlusArms = { up: true, down: false, left: false, right: true };
const joinFootRight: PlusArms = { up: true, down: false, left: true, right: false };
const joinCross: PlusArms = { up: true, down: true, left: true, right: true };
const frameTL: PlusArms = { up: false, down: true, left: false, right: true };
const frameTR: PlusArms = { up: false, down: true, left: true, right: false };
const frameBL: PlusArms = { up: true, down: false, left: false, right: true };
const frameBR: PlusArms = { up: true, down: false, left: true, right: false };

function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

function sectionId(index: number) {
  return `section-${padIndex(index)}`;
}

function relatedNote(records: NewsRecord[]) {
  if (
    records.length > 0 &&
    records.every((item) => item.category === records[0].category)
  ) {
    return `More from ${categoryById(records[0].category).full}.`;
  }
  return "From the register.";
}

function Chevron({ direction }: { direction: "back" | "forward" }) {
  return (
    <svg aria-hidden width={12} height={12} viewBox="0 0 14 14" fill="none" className="shrink-0">
      <path
        d={direction === "back" ? "M9 2.5 4.5 7 9 11.5" : "M5 2.5 9.5 7 5 11.5"}
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
      />
    </svg>
  );
}

function RelatedFrame({ record }: { record: NewsRecord }) {
  return (
    <span className="news-related-frame relative">
      <Image
        src={recordSrc(record.image)}
        alt=""
        fill
        sizes="(min-width: 768px) 22vw, 96px"
        className="news-related-photo object-cover"
      />
      <PlusMark tone="page" className="plus-at-tl" />
      <PlusMark tone="page" className="plus-at-tr" />
      <PlusMark tone="page" className="plus-at-bl" />
      <PlusMark tone="page" className="plus-at-br" />
    </span>
  );
}

export async function generateStaticParams() {
  const slugs = await getNewsSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ArticleProps): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();
  const record = await getNewsRecord(slug, { draft });
  if (!record) return { title: "Newsroom — Thimark" };
  return {
    title: `${record.title} — Thimark`,
    description: record.excerpt,
    openGraph: record.image
      ? { title: record.title, description: record.excerpt, images: [record.image] }
      : undefined,
  };
}

export default async function NewsArticlePage({ params }: ArticleProps) {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();
  const record = await getNewsRecord(slug, { draft });
  if (!record) notFound();

  const category = categoryById(record.category);
  const related = relatedRecords(await getNewsRecords(), record);
  const continues = related.length > 0;

  return (
    <main className="newsroom news-article content-plate relative z-10 bg-cream pt-14 text-steel xl:ml-sidebar xl:pt-0 [--page-bg:var(--cream)] [--page-ink:var(--steel)]">
      {draft ? <PreviewBar path={`/newsroom/${record.slug}`} /> : null}
      <header className="news-article-head">
        <GridLine axis="v" unstyled tone="page" className="v-g1-0 hero-v-above-plus" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 hero-v-above-plus" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-8 hero-v-above-plus hidden md:block" />

        <div className="news-article-copy">
          <Link href="/newsroom" className="news-back index-tag md:hidden">
            <Chevron direction="back" />
            <span>Newsroom</span>
          </Link>
          <p className="news-meta news-article-meta index-tag">
            <span>{category.full}</span>
            <span aria-hidden className="hidden md:inline"> | </span>
            <time dateTime={record.date}>{formatRecordDate(record.date)}</time>
          </p>
          <H1Heading className="news-article-title">{record.title}</H1Heading>
        </div>

        <aside className="news-article-side">
          <Copy variant="meta">{record.excerpt}</Copy>
        </aside>

        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-8 at-bottom hidden md:block" />
        <GridLine axis="h" unstyled tone="page" className="h-seg-8-12 at-bottom hidden md:block" />
        <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 at-bottom" />
        <PlusMark tone="page" arms={joinTeeUp} className="v-g1-8 at-bottom hidden md:block" />
        <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-bottom" />
      </header>

      <figure className="news-article-figure">
        <GridLine axis="v" unstyled tone="page" className="v-g1-0 hero-v-between-pluses" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 hero-v-between-pluses" />
        <div className="news-article-frame relative">
          <span className="news-article-photo">
            <Image
              src={recordSrc(record.image)}
              alt={record.alt}
              fill
              priority
              sizes="(min-width: 768px) 70vw, 100vw"
              className="object-cover"
            />
          </span>
          <GridLine axis="h" unstyled tone="page" className="news-frame-h top-0" />
          <GridLine axis="h" unstyled tone="page" className="news-frame-h top-full" />
          <GridLine axis="v" unstyled tone="page" className="news-frame-v left-0" />
          <GridLine axis="v" unstyled tone="page" className="news-frame-v left-full" />
          <PlusMark tone="page" arms={frameTL} className="top-0 left-0" />
          <PlusMark tone="page" arms={frameTR} className="top-0 left-full" />
          <PlusMark tone="page" arms={frameBL} className="top-full left-0" />
          <PlusMark tone="page" arms={frameBR} className="top-full left-full" />
        </div>
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-8 at-bottom hidden md:block" />
        <GridLine axis="h" unstyled tone="page" className="h-seg-8-12 at-bottom hidden md:block" />
        <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 at-bottom" />
        <PlusMark tone="page" arms={joinTeeDown} className="v-g1-8 at-bottom hidden md:block" />
        <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-bottom" />
      </figure>

      <div className="news-article-body">
        <GridLine axis="v" unstyled tone="page" className="v-g1-0 hero-v-between-pluses" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-8 hero-v-between-pluses hidden md:block" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 hero-v-between-pluses" />
        <div className="news-article-toc-rail">
          <div className="news-article-toc-stick">
            <ArticleContents
              items={record.body.map((section, i) => ({
                id: sectionId(i),
                heading: section.heading,
              }))}
            />
            <ArticleShare title={record.title} />
          </div>
        </div>
        <div className="news-article-prose">
          {record.body.map((section, i) => (
            <section key={sectionId(i)} id={sectionId(i)} className="news-article-section">
              <p aria-hidden className="news-section-index news-meta index-tag md:hidden">
                [{padIndex(i)}]
              </p>
              <ArticleHeading className="news-section-label">{section.heading}</ArticleHeading>
              <Copy variant="prose">{section.text}</Copy>
              {section.href ? (
                <a
                  href={section.href}
                  target="_blank"
                  rel="noreferrer"
                  className="news-article-link"
                >
                  {section.hrefLabel ?? "Open"}
                </a>
              ) : null}
            </section>
          ))}
          {record.images.length > 1 ? (
            <ArticleGallery images={record.images.slice(1)} alt={record.alt} />
          ) : null}
        </div>
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-8 at-bottom hidden md:block" />
        <GridLine axis="h" unstyled tone="page" className="h-seg-8-12 at-bottom hidden md:block" />
        <PlusMark
          tone="page"
          arms={continues ? joinLeftEdge : joinFootLeft}
          className="v-g1-0 at-bottom"
        />
        <PlusMark
          tone="page"
          arms={continues ? joinCross : joinTeeUp}
          className="v-g1-8 at-bottom hidden md:block"
        />
        <PlusMark
          tone="page"
          arms={continues ? joinRightEdge : joinFootRight}
          className="v-g1-12 at-bottom"
        />
      </div>

      {continues ? (
        <section className="news-related" aria-labelledby="news-related-heading">
          <header className="news-related-head">
            <GridLine axis="v" unstyled tone="page" className="v-g1-0 hero-v-between-pluses" />
            <GridLine axis="v" unstyled tone="page" className="v-g1-12 hero-v-between-pluses" />
            <GridLine
              axis="v"
              unstyled
              tone="page"
              className="v-g1-8 hero-v-between-pluses hidden md:block"
            />
            <div className="news-related-lead">
              <p className="news-meta index-tag">Related</p>
              <H2Heading id="news-related-heading" className="news-related-title">
                Further records.
              </H2Heading>
            </div>
            <p className="news-related-note">{relatedNote(related)}</p>
            <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom md:hidden" />
            <GridLine axis="h" unstyled tone="page" className="h-seg-0-3 at-bottom hidden md:block" />
            <GridLine axis="h" unstyled tone="page" className="h-seg-3-6 at-bottom hidden md:block" />
            <GridLine axis="h" unstyled tone="page" className="h-seg-6-8 at-bottom hidden md:block" />
            <GridLine axis="h" unstyled tone="page" className="h-seg-8-9 at-bottom hidden md:block" />
            <GridLine axis="h" unstyled tone="page" className="h-seg-9g-12 at-bottom hidden md:block" />
            <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 at-bottom" />
            <PlusMark
              tone="page"
              arms={joinTeeDown}
              className="v-g1-3 at-bottom hidden md:block"
            />
            <PlusMark
              tone="page"
              arms={joinTeeDown}
              className="v-g1-6 at-bottom hidden md:block"
            />
            <PlusMark tone="page" arms={joinTeeUp} className="v-g1-8 at-bottom hidden md:block" />
            <PlusMark
              tone="page"
              arms={joinTeeDown}
              className="v-g1-9 at-bottom hidden md:block"
            />
            <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-bottom" />
          </header>

          <ol className="news-related-list">
            <GridLine
              axis="v"
              unstyled
              tone="page"
              className="v-g1-0 hero-v-between-pluses hidden md:block"
            />
            <GridLine
              axis="v"
              unstyled
              tone="page"
              className="v-g1-3 hero-v-between-pluses hidden md:block"
            />
            <GridLine
              axis="v"
              unstyled
              tone="page"
              className="v-g1-6 hero-v-between-pluses hidden md:block"
            />
            <GridLine
              axis="v"
              unstyled
              tone="page"
              className="v-g1-9 hero-v-between-pluses hidden md:block"
            />
            <GridLine
              axis="v"
              unstyled
              tone="page"
              className="v-g1-12 hero-v-between-pluses hidden md:block"
            />
            {related.map((item, i) => (
              <li key={item.slug} className="news-related-item">
                <Link href={`/newsroom/${item.slug}`} className="news-related-link">
                  <RelatedFrame record={item} />
                  <span className="news-related-entry">
                    <p className="news-related-kicker index-tag news-meta">
                      <span>
                        <span aria-hidden>[{padIndex(i)}]</span>{" "}
                        <span>{categoryById(item.category).label}</span>
                      </span>
                      <time dateTime={item.date}>{formatRecordDate(item.date)}</time>
                    </p>
                    <H3Heading variant="title" className="tracking-[-0.02em]">{item.title}</H3Heading>
                  </span>
                </Link>
                <GridLine
                  axis="v"
                  unstyled
                  tone="page"
                  className="v-g1-0 hero-v-between-pluses md:hidden"
                />
                <GridLine
                  axis="v"
                  unstyled
                  tone="page"
                  className="v-g1-12 hero-v-between-pluses md:hidden"
                />
                <GridLine
                  axis="h"
                  unstyled
                  tone="page"
                  className="h-seg-0-12 at-bottom md:hidden"
                />
                <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 at-bottom md:hidden" />
                <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 at-bottom md:hidden" />
              </li>
            ))}
            <li className="news-related-item news-related-more md:hidden">
              <Link href="/newsroom" className="news-related-all index-tag">
                <span>All records</span>
                <Chevron direction="forward" />
              </Link>
              <GridLine axis="v" unstyled tone="page" className="v-g1-0 hero-v-between-pluses" />
              <GridLine axis="v" unstyled tone="page" className="v-g1-12 hero-v-between-pluses" />
              <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom" />
              <PlusMark tone="page" arms={joinFootLeft} className="v-g1-0 at-bottom" />
              <PlusMark tone="page" arms={joinFootRight} className="v-g1-12 at-bottom" />
            </li>
            <GridLine axis="h" unstyled tone="page" className="h-seg-0-3 at-bottom hidden md:block" />
            <GridLine axis="h" unstyled tone="page" className="h-seg-3-6 at-bottom hidden md:block" />
            <GridLine axis="h" unstyled tone="page" className="h-seg-6-9 at-bottom hidden md:block" />
            <GridLine axis="h" unstyled tone="page" className="h-seg-9g-12 at-bottom hidden md:block" />
            <PlusMark
              tone="page"
              arms={joinFootLeft}
              className="v-g1-0 at-bottom hidden md:block"
            />
            <PlusMark
              tone="page"
              arms={joinTeeUp}
              className="v-g1-3 at-bottom hidden md:block"
            />
            <PlusMark
              tone="page"
              arms={joinTeeUp}
              className="v-g1-6 at-bottom hidden md:block"
            />
            <PlusMark
              tone="page"
              arms={joinTeeUp}
              className="v-g1-9 at-bottom hidden md:block"
            />
            <PlusMark
              tone="page"
              arms={joinFootRight}
              className="v-g1-12 at-bottom hidden md:block"
            />
          </ol>
        </section>
      ) : null}
    </main>
  );
}
