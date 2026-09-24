import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PlusMark from "@/app/components/PlusMark";
import Stamp from "@/app/components/Stamp";
import { GridLine } from "@/app/components/SectionGrid";
import {
  NEWS_RECORDS,
  categoryById,
  formatRecordDate,
  getRecord,
} from "@/app/newsroom/records";

type ArticleProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return NEWS_RECORDS.map((record) => ({ slug: record.slug }));
}

export async function generateMetadata({ params }: ArticleProps): Promise<Metadata> {
  const { slug } = await params;
  const record = getRecord(slug);
  if (!record) return { title: "Newsroom — Thimark" };
  return {
    title: `${record.title} — Thimark`,
    description: record.excerpt,
  };
}

export default async function NewsArticlePage({ params }: ArticleProps) {
  const { slug } = await params;
  const record = getRecord(slug);
  if (!record) notFound();

  const category = categoryById(record.category);

  return (
    <main className="newsroom news-article content-plate relative z-10 bg-cream pt-14 text-steel md:ml-sidebar md:pt-0 [--page-bg:var(--cream)] [--page-ink:var(--steel)]">
      <header className="news-article-head">
        <GridLine axis="v" unstyled tone="page" className="v-g1-0 news-rail" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 news-rail" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-8 news-rail hidden md:block" />

        <div className="news-article-copy">
          <Link href="/newsroom" className="news-read">
            All records
          </Link>
          <p className="news-meta index-tag">
            <span>{category.full}</span>
            <span aria-hidden> | </span>
            <time dateTime={record.date}>{formatRecordDate(record.date)}</time>
          </p>
          <h1 className="news-article-title">{record.title}</h1>
        </div>

        <div className="news-article-side">
          <Stamp strong={category.label} sub={formatRecordDate(record.date)} />
        </div>

        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom" />
        <PlusMark tone="page" className="v-g1-0 at-bottom" />
        <PlusMark tone="page" className="v-g1-8 at-bottom hidden md:block" />
        <PlusMark tone="page" className="v-g1-12 at-bottom" />
      </header>

      <figure className="news-article-figure">
        <GridLine axis="v" unstyled tone="page" className="v-g1-0 news-rail" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 news-rail" />
        <div className="news-article-frame relative">
          <span className="news-article-photo">
            <Image
              src={record.image}
              alt={record.alt}
              fill
              priority
              sizes="(min-width: 768px) 70vw, 100vw"
              className="object-cover"
            />
          </span>
          <PlusMark tone="page" className="top-0 left-0" />
          <PlusMark tone="page" className="top-0 left-full" />
          <PlusMark tone="page" className="top-full left-0" />
          <PlusMark tone="page" className="top-full left-full" />
        </div>
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom" />
        <PlusMark tone="page" className="v-g1-0 at-bottom" />
        <PlusMark tone="page" className="v-g1-12 at-bottom" />
      </figure>

      <div className="news-article-body">
        <GridLine axis="v" unstyled tone="page" className="v-g1-0 news-rail" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-8 news-rail hidden md:block" />
        <GridLine axis="v" unstyled tone="page" className="v-g1-12 news-rail" />
        <div className="news-article-prose">
          {record.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <GridLine axis="h" unstyled tone="page" className="h-seg-0-12 at-bottom" />
        <PlusMark tone="page" className="v-g1-0 at-bottom" />
        <PlusMark tone="page" className="v-g1-8 at-bottom hidden md:block" />
        <PlusMark tone="page" className="v-g1-12 at-bottom" />
      </div>
    </main>
  );
}
