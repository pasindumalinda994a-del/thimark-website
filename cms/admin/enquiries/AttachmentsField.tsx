"use client";

import { FieldLabel, useField } from "@payloadcms/ui";
import type { JSONFieldClientComponent } from "payload";
import { fileExt, formatBytes } from "../../../app/(frontend)/enquire/enquire";

export type Attachment = { name: string; url?: string; size: number; type?: string };

export function AttachmentList({ files }: { files?: Attachment[] | null }) {
  const list = Array.isArray(files) ? files : [];
  if (list.length === 0) return <p className="tm-muted">No files attached.</p>;

  return (
    <ul className="tm-files">
      {list.map((file, index) => (
        <li key={`${file.name}-${index}`} className="tm-file">
          <span className="tm-file__ext">{fileExt(file.name) || "FILE"}</span>
          <span className="tm-file__name" title={file.name}>
            {file.name}
          </span>
          <span className="tm-file__size">{formatBytes(file.size)}</span>
          {file.url ? (
            <a className="tm-file__action" href={file.url} target="_blank" rel="noreferrer" download={file.name}>
              Download
            </a>
          ) : (
            <span className="tm-file__action is-missing">Not uploaded</span>
          )}
        </li>
      ))}
    </ul>
  );
}

export const AttachmentsField: JSONFieldClientComponent = ({ field, path }) => {
  const { value } = useField<Attachment[]>({ path });
  return (
    <div className="field-type tm-attachments-field">
      <FieldLabel label={field.label} path={path} />
      <AttachmentList files={value} />
    </div>
  );
};
