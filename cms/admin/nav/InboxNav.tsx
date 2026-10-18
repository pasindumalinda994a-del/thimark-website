"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type InboxNavProps = {
  adminRoute: string;
  newCount: number;
};

export function InboxNav({ adminRoute, newCount }: InboxNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const enquiriesHref = `${adminRoute}/collections/enquiries`;
  const onEnquiries = pathname === enquiriesHref || pathname.startsWith(`${enquiriesHref}/`);
  const statusFilter = searchParams.get("where[status][equals]");
  const viewingNew = onEnquiries && statusFilter === "new";
  const viewingAll = onEnquiries && !viewingNew && !pathname.startsWith(`${enquiriesHref}/`);

  return (
    <div className="tm-nav-inbox">
      <Link
        href={adminRoute}
        className={`tm-nav-inbox__link tm-nav-inbox__link--home${pathname === adminRoute ? " is-active" : ""}`}
      >
        Dashboard
      </Link>

      <div className="tm-nav-inbox__block">
        <p className="tm-nav-inbox__label">Enquiries</p>
        <div className="tm-nav-inbox__tabs" role="group" aria-label="Enquiries views">
          {/* Hard nav clears list filters; Payload disables same-path collection Links. */}
          <a
            href={enquiriesHref}
            className={`tm-nav-inbox__tab${viewingAll ? " is-active" : ""}`}
            aria-current={viewingAll ? "page" : undefined}
          >
            All
          </a>
          <Link
            href={`${enquiriesHref}?where[status][equals]=new`}
            className={`tm-nav-inbox__tab${viewingNew ? " is-active" : ""}${newCount > 0 ? " has-new" : ""}`}
            aria-current={viewingNew ? "page" : undefined}
          >
            <span>New</span>
            <span className="tm-nav-inbox__count" aria-label={`${newCount} new`}>
              {newCount}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
