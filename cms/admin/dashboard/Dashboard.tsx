import Link from "next/link";
import type { AdminViewServerProps } from "payload";
import { topicLabel, type TopicId } from "../../../app/(frontend)/enquire/enquire";
import { StatusBadge } from "../enquiries/StatusBadge";

const TIME_ZONE = "Asia/Colombo";
const DAY = 24 * 60 * 60 * 1000;

type RecentItem = {
  id: string;
  title: string;
  kind: "News" | "Photo";
  href: string;
  updatedAt: string;
  draft?: boolean;
};

function requestTime() {
  return Date.now();
}

function greeting(date: Date) {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: TIME_ZONE }).format(date),
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function relative(iso: string, now: number) {
  const diff = new Date(iso).getTime() - now;
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (abs < 60 * 60 * 1000) return rtf.format(Math.round(diff / (60 * 1000)), "minute");
  if (abs < DAY) return rtf.format(Math.round(diff / (60 * 60 * 1000)), "hour");
  if (abs < 7 * DAY) return rtf.format(Math.round(diff / DAY), "day");
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: TIME_ZONE }).format(
    new Date(iso),
  );
}

function StatCard({
  label,
  value,
  hint,
  href,
  tone,
}: {
  label: string;
  value: number;
  hint: string;
  href: string;
  tone?: "brand";
}) {
  return (
    <Link href={href} className={`tm-stat${tone ? ` tm-stat--${tone}` : ""}`}>
      <span className="tm-stat__label">{label}</span>
      <span className="tm-stat__value">{value}</span>
      <span className="tm-stat__hint">{hint}</span>
    </Link>
  );
}

export async function Dashboard({ initPageResult, payload, user }: AdminViewServerProps) {
  const req = initPageResult.req;
  const admin = payload.config.routes.admin;
  const now = requestTime();
  const weekAgo = new Date(now - 7 * DAY).toISOString();
  const scoped = { overrideAccess: false, user: req.user, req } as const;

  const [newEnquiries, weekEnquiries, published, drafts, photos, recentEnquiries, recentNews, recentPhotos] =
    await Promise.all([
      payload.count({ collection: "enquiries", where: { status: { equals: "new" } }, ...scoped }),
      payload.count({ collection: "enquiries", where: { createdAt: { greater_than_equal: weekAgo } }, ...scoped }),
      payload.count({ collection: "news", where: { _status: { equals: "published" } }, ...scoped }),
      payload.count({ collection: "news", where: { _status: { equals: "draft" } }, ...scoped }),
      payload.count({ collection: "gallery", ...scoped }),
      payload.find({
        collection: "enquiries",
        sort: "-createdAt",
        limit: 6,
        depth: 0,
        select: { reference: true, name: true, company: true, topic: true, status: true, createdAt: true },
        ...scoped,
      }),
      payload.find({
        collection: "news",
        sort: "-updatedAt",
        limit: 5,
        depth: 0,
        draft: true,
        select: { title: true, updatedAt: true, _status: true },
        ...scoped,
      }),
      payload.find({
        collection: "gallery",
        sort: "-updatedAt",
        limit: 5,
        depth: 0,
        select: { title: true, updatedAt: true },
        ...scoped,
      }),
    ]);

  const recent: RecentItem[] = [
    ...recentNews.docs.map((doc) => ({
      id: `news-${doc.id}`,
      title: doc.title || "Untitled story",
      kind: "News" as const,
      href: `${admin}/collections/news/${doc.id}`,
      updatedAt: doc.updatedAt,
      draft: doc._status === "draft",
    })),
    ...recentPhotos.docs.map((doc) => ({
      id: `gallery-${doc.id}`,
      title: doc.title || "Untitled photo",
      kind: "Photo" as const,
      href: `${admin}/collections/gallery/${doc.id}`,
      updatedAt: doc.updatedAt,
    })),
  ]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 6);

  const firstName = (user as { name?: string } | null)?.name?.split(" ")[0];
  const today = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: TIME_ZONE,
  }).format(new Date(now));

  const waiting = newEnquiries.totalDocs;
  const lede =
    waiting === 0
      ? "The inbox is clear. A good moment to share some news."
      : `${waiting} new ${waiting === 1 ? "enquiry is" : "enquiries are"} waiting for a reply.`;

  return (
    <div className="tm-dash gutter--left gutter--right">
      <header className="tm-dash__head">
        <div>
          <p className="tm-eyebrow">{today}</p>
          <h1 className="tm-dash__title">
            {greeting(new Date(now))}
            {firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="tm-dash__lede">{lede}</p>
        </div>
        <div className="tm-dash__actions">
          <Link href={`${admin}/collections/news/create`} className="tm-btn tm-btn--primary">
            Write news
          </Link>
          <Link href={`${admin}/collections/gallery/create`} className="tm-btn">
            Add photo
          </Link>
          <a href="/" target="_blank" rel="noreferrer" className="tm-btn tm-btn--ghost">
            View site ↗
          </a>
        </div>
      </header>

      <section className="tm-stats" aria-label="Overview">
        <StatCard
          label="New enquiries"
          value={waiting}
          hint={waiting ? "Waiting for a reply" : "All caught up"}
          href={`${admin}/collections/enquiries?where[status][equals]=new`}
          tone={waiting ? "brand" : undefined}
        />
        <StatCard
          label="This week"
          value={weekEnquiries.totalDocs}
          hint="Enquiries in the last 7 days"
          href={`${admin}/collections/enquiries`}
        />
        <StatCard
          label="Published news"
          value={published.totalDocs}
          hint={drafts.totalDocs ? `${drafts.totalDocs} draft${drafts.totalDocs === 1 ? "" : "s"} in progress` : "No drafts"}
          href={`${admin}/collections/news`}
        />
        <StatCard
          label="Gallery photos"
          value={photos.totalDocs}
          hint="Shown on /gallery"
          href={`${admin}/collections/gallery`}
        />
      </section>

      <div className="tm-dash__grid">
        <section className="tm-card">
          <header className="tm-card__head">
            <h2 className="tm-card__title">Recent enquiries</h2>
            <Link href={`${admin}/collections/enquiries`} className="tm-link">
              View all →
            </Link>
          </header>
          {recentEnquiries.docs.length === 0 ? (
            <p className="tm-empty">No enquiries yet. They appear here as soon as someone submits the form.</p>
          ) : (
            <ul className="tm-enquiries">
              {recentEnquiries.docs.map((doc) => (
                <li key={doc.id}>
                  <Link href={`${admin}/collections/enquiries/${doc.id}`} className="tm-enquiry">
                    <span className="tm-enquiry__who">
                      <span className="tm-enquiry__name">{doc.name}</span>
                      <span className="tm-enquiry__meta">
                        {doc.reference} · {topicLabel(doc.topic as TopicId)}
                        {doc.company ? ` · ${doc.company}` : ""}
                      </span>
                    </span>
                    <StatusBadge status={doc.status} />
                    <span className="tm-enquiry__time">{relative(doc.createdAt, now)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="tm-card">
          <header className="tm-card__head">
            <h2 className="tm-card__title">Recently edited</h2>
          </header>
          {recent.length === 0 ? (
            <p className="tm-empty">Nothing edited yet.</p>
          ) : (
            <ul className="tm-recent">
              {recent.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className="tm-recent__item">
                    <span className={`tm-chip tm-chip--${item.kind.toLowerCase()}`}>{item.kind}</span>
                    <span className="tm-recent__title">{item.title}</span>
                    {item.draft ? <span className="tm-chip tm-chip--draft">Draft</span> : null}
                    <span className="tm-recent__time">{relative(item.updatedAt, now)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="tm-shortcuts">
            <Link href={`${admin}/collections/news`} className="tm-shortcut">
              Newsroom
            </Link>
            <Link href={`${admin}/collections/gallery`} className="tm-shortcut">
              Gallery
            </Link>
            <Link href={`${admin}/collections/media`} className="tm-shortcut">
              Media library
            </Link>
            <Link href={`${admin}/collections/users`} className="tm-shortcut">
              Team
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
