import Link from "next/link";
import type { ServerProps } from "payload";

export async function InboxLink({ payload, user }: ServerProps) {
  if (!user) return null;

  const { totalDocs } = await payload.count({
    collection: "enquiries",
    where: { status: { equals: "new" } },
    overrideAccess: false,
    user,
  });
  const adminRoute = payload.config.routes.admin;

  return (
    <div className="tm-nav-inbox">
      <Link href={`${adminRoute}`} className="tm-nav-inbox__link tm-nav-inbox__link--home">
        Dashboard
      </Link>
      <Link
        href={`${adminRoute}/collections/enquiries?where[status][equals]=new`}
        className={`tm-nav-inbox__link${totalDocs > 0 ? " has-new" : ""}`}
      >
        <span>New enquiries</span>
        <span className="tm-nav-inbox__count" aria-label={`${totalDocs} new`}>
          {totalDocs}
        </span>
      </Link>
    </div>
  );
}
