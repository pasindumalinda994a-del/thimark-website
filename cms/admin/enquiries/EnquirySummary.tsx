"use client";

import { useDocumentInfo } from "@payloadcms/ui";
import { topicLabel, type TopicId } from "../../../app/(frontend)/enquire/enquire";
import { AttachmentList, type Attachment } from "./AttachmentsField";
import { StatusBadge } from "./StatusBadge";
import { useValue } from "./useValue";

function formatReceived(iso: unknown) {
  if (typeof iso !== "string") return "";
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Colombo",
  }).format(new Date(iso));
}

export function EnquirySummary() {
  const { initialData } = useDocumentInfo();
  const reference = useValue<string>("reference");
  const status = useValue<string>("status");
  const topic = useValue<TopicId>("topic");
  const name = useValue<string>("name");
  const company = useValue<string>("company");
  const email = useValue<string>("email");
  const phone = useValue<string>("phone");
  const message = useValue<string>("message");
  const files = useValue<Attachment[]>("files");

  if (!reference) return null;

  const tel = phone ? phone.replace(/[^\d+]/g, "") : "";

  return (
    <section className="tm-summary" aria-label="Enquiry">
      <header className="tm-summary__head">
        <div>
          <p className="tm-eyebrow">
            {topic ? topicLabel(topic) : "Enquiry"} · {formatReceived(initialData?.createdAt)}
          </p>
          <h2 className="tm-summary__name">{name}</h2>
          {company ? <p className="tm-summary__company">{company}</p> : null}
        </div>
        <StatusBadge status={status} />
      </header>

      <dl className="tm-summary__contact">
        <div>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${email}`}>{email}</a>
          </dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>{tel ? <a href={`tel:${tel}`}>{phone}</a> : "—"}</dd>
        </div>
        <div>
          <dt>Reference</dt>
          <dd className="tm-mono">{reference}</dd>
        </div>
      </dl>

      <div className="tm-summary__message">
        <p className="tm-summary__label">Message</p>
        <p className="tm-summary__body">{message}</p>
      </div>

      <div className="tm-summary__files">
        <p className="tm-summary__label">Attachments</p>
        <AttachmentList files={files} />
      </div>
    </section>
  );
}
