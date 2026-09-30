"use client";

import Link from "next/link";
import { useId, useRef, useState, type DragEvent } from "react";
import PlusMark from "@/app/components/PlusMark";
import { CheckCell } from "@/app/request-a-quote/components/RfqField";
import { BODY_TOP, SHEET_ROWS, SheetPanel, rowTracks } from "@/app/request-a-quote/components/RfqSheet";
import type { Lines } from "@/app/request-a-quote/components/SheetLines";
import { useRfq, type UploadItem } from "@/app/request-a-quote/rfq-context";
import {
  CORE_FORMATS,
  MAX_FILE_MB,
  UPLOAD_FORMATS,
  acceptAttr,
  formatBytes,
} from "@/app/request-a-quote/rfq-schema";

const DROP_ROWS = 4;

export const UPLOAD_LINES: Lines = {
  h: [
    { y: BODY_TOP + 1, from: 6, to: 12 },
    { y: BODY_TOP + 1 + DROP_ROWS, from: 6, to: 12 },
    { y: SHEET_ROWS - 1, from: 6, to: 12 },
  ],
  v: [{ x: 9, from: SHEET_ROWS - 1, to: SHEET_ROWS }],
};

const EXTRA_FORMATS = UPLOAD_FORMATS.filter(
  (ext) => ext !== "JPEG" && !(CORE_FORMATS as readonly string[]).includes(ext),
);

function statusLabel(item: UploadItem) {
  if (item.status === "uploading") return `${Math.round(item.progress)}%`;
  if (item.status === "processing") return "Processing";
  return "Uploaded";
}

export default function UploadEngine() {
  const { uploads, addFiles, removeFile, values, setValue } = useRfq();
  const inputRef = useRef<HTMLInputElement>(null);
  const depth = useRef(0);
  const [over, setOver] = useState(false);
  const [rejected, setRejected] = useState<string[]>([]);
  const helpId = `${useId()}-help`;
  const done = uploads.filter((item) => item.status === "uploaded").length;

  const ingest = (files: FileList | File[]) => setRejected(addFiles(files));

  const onDragEnter = (event: DragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer.types.includes("Files")) return;
    event.preventDefault();
    depth.current += 1;
    setOver(true);
  };

  const onDragLeave = () => {
    depth.current = Math.max(0, depth.current - 1);
    if (depth.current === 0) setOver(false);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    depth.current = 0;
    setOver(false);
    if (event.dataTransfer.files.length) ingest(event.dataTransfer.files);
  };

  const tone = over ? "brand" : "page";

  return (
    <SheetPanel side="right" edge="mid" rows={rowTracks([1, DROP_ROWS, "fill", 1])}>
      <div className="rfq-panel-head" data-rfq-copy>
        <p className="rfq-panel-title">Drawings &amp; files</p>
        <ul className="rfq-formats" aria-label="Preferred formats">
          {CORE_FORMATS.map((ext) => (
            <li key={ext} className="rfq-format">
              {ext}
            </li>
          ))}
        </ul>
      </div>

      <div className="rfq-drop-cell" data-rfq-copy>
        <div
          className={`rfq-drop${over ? " is-over" : ""}`}
          onDragEnter={onDragEnter}
          onDragOver={(event) => {
            if (event.dataTransfer.types.includes("Files")) event.preventDefault();
          }}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("button")) return;
            inputRef.current?.click();
          }}
        >
          <svg aria-hidden className="rfq-drop-frame">
            <rect x="0.5" y="0.5" width="100%" height="100%" />
          </svg>
          <PlusMark tone={tone} className="rfq-drop-corner is-tl" />
          <PlusMark tone={tone} className="rfq-drop-corner is-tr" />
          <PlusMark tone={tone} className="rfq-drop-corner is-bl" />
          <PlusMark tone={tone} className="rfq-drop-corner is-br" />
          <p className="rfq-drop-title">{over ? "Release to attach" : "Drop files here"}</p>
          <button
            type="button"
            className="rfq-browse"
            aria-describedby={helpId}
            onClick={() => inputRef.current?.click()}
          >
            Browse files
          </button>
          <p id={helpId} className="rfq-drop-help index-tag">
            Also {EXTRA_FORMATS.join(" · ")} — up to {MAX_FILE_MB} MB
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={acceptAttr(UPLOAD_FORMATS)}
            className="sr-only"
            tabIndex={-1}
            onChange={(event) => {
              if (event.target.files?.length) ingest(event.target.files);
              event.target.value = "";
            }}
          />
        </div>
      </div>

      <div className="rfq-register" data-lenis-prevent>
        {rejected.length ? (
          <ul className="rfq-rejected" role="alert">
            {rejected.map((message) => (
              <li key={message} className="index-tag">
                {message}
              </li>
            ))}
          </ul>
        ) : null}
        {uploads.length ? (
          <ol className="rfq-register-list" aria-label="Attached files">
            {uploads.map((item, index) => (
              <li key={item.id} className={`rfq-register-row is-${item.status}`}>
                <span className="index-tag opacity-60">{String(index + 1).padStart(2, "0")}</span>
                <span className="rfq-register-name" title={item.name}>
                  {item.name}
                </span>
                <span className="index-tag opacity-60">{formatBytes(item.size)}</span>
                <span className="rfq-register-status index-tag">
                  {item.status === "uploaded" ? <span aria-hidden>✓ </span> : null}
                  {statusLabel(item)}
                </span>
                <button
                  type="button"
                  className="rfq-remove"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => removeFile(item.id)}
                >
                  ×
                </button>
                {item.status !== "uploaded" ? (
                  <span
                    aria-hidden
                    className="rfq-register-progress"
                    style={{ transform: `scaleX(${item.progress / 100})` }}
                  />
                ) : null}
              </li>
            ))}
          </ol>
        ) : (
          <p className="rfq-register-empty index-tag">No files attached — drawings are optional</p>
        )}
        <p className="sr-only" role="status">
          {uploads.length ? `${done} of ${uploads.length} files uploaded.` : ""}
        </p>
      </div>

      <div className="rfq-flags">
        <CheckCell
          checked={values.sendFilesLater === "yes"}
          onChange={(checked) => setValue("sendFilesLater", checked ? "yes" : "")}
        >
          Send files later
        </CheckCell>
        <CheckCell
          checked={values.confidential === "yes"}
          onChange={(checked) => setValue("confidential", checked ? "yes" : "")}
        >
          Confidential{" "}
          <Link href="/privacy-policy" className="rfq-flag-link">
            Privacy
          </Link>
        </CheckCell>
      </div>
    </SheetPanel>
  );
}
