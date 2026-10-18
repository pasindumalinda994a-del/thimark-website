import { Suspense } from "react";
import type { ServerProps } from "payload";
import { InboxNav } from "./InboxNav";

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
    <Suspense
      fallback={
        <div className="tm-nav-inbox">
          <a href={adminRoute} className="tm-nav-inbox__link tm-nav-inbox__link--home">
            Dashboard
          </a>
          <div className="tm-nav-inbox__block">
            <p className="tm-nav-inbox__label">Enquiries</p>
            <div className="tm-nav-inbox__tabs">
              <a href={`${adminRoute}/collections/enquiries`} className="tm-nav-inbox__tab">
                All
              </a>
              <a
                href={`${adminRoute}/collections/enquiries?where[status][equals]=new`}
                className={`tm-nav-inbox__tab${totalDocs > 0 ? " has-new" : ""}`}
              >
                <span>New</span>
                <span className="tm-nav-inbox__count">{totalDocs}</span>
              </a>
            </div>
          </div>
        </div>
      }
    >
      <InboxNav adminRoute={adminRoute} newCount={totalDocs} />
    </Suspense>
  );
}
