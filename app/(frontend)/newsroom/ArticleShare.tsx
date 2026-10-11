"use client";

import { useEffect, useState } from "react";

type ArticleShareProps = {
  title: string;
};

type ShareKind = "linkedin" | "facebook" | "instagram" | "copy";

const LINKEDIN =
  "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z";

const FACEBOOK =
  "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m13 2h-2.5A3.5 3.5 0 0 0 12 8.5V11h-2v3h2v7h3v-7h3v-3h-3V9a1 1 0 0 1 1-1h2V5z";

const INSTAGRAM =
  "M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z";

const CONTENT_COPY =
  "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z";

const CHECK = "M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z";

function absoluteUrl() {
  return window.location.href;
}

function shareHref(kind: "linkedin" | "facebook", url: string) {
  const encoded = encodeURIComponent(url);
  if (kind === "linkedin") {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`;
  }
  return `https://www.facebook.com/sharer/sharer.php?u=${encoded}`;
}

function MaterialIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="news-share-icon">
      <path d={d} />
    </svg>
  );
}

export default function ArticleShare({ title }: ArticleShareProps) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState<ShareKind | null>(null);

  useEffect(() => {
    setUrl(absoluteUrl());
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(null), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copyLink(kind: ShareKind) {
    const next = url || absoluteUrl();
    try {
      await navigator.clipboard.writeText(next);
      setCopied(kind);
    } catch {
      setCopied(null);
    }
  }

  async function onInstagram() {
    const next = url || absoluteUrl();
    if (navigator.share) {
      try {
        await navigator.share({ title, url: next });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    await copyLink("instagram");
  }

  return (
    <div className="news-article-share">
      <p className="news-meta index-tag">Share</p>
      <div className="news-article-share-row">
        <a
          className="news-share-btn"
          href={url ? shareHref("linkedin", url) : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
        >
          <MaterialIcon d={LINKEDIN} />
        </a>
        <a
          className="news-share-btn"
          href={url ? shareHref("facebook", url) : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
        >
          <MaterialIcon d={FACEBOOK} />
        </a>
        <button type="button" className="news-share-btn" aria-label="Share on Instagram" onClick={onInstagram}>
          <MaterialIcon d={copied === "instagram" ? CHECK : INSTAGRAM} />
        </button>
        <button
          type="button"
          className="news-share-btn"
          aria-label={copied === "copy" ? "Link copied" : "Copy link"}
          onClick={() => copyLink("copy")}
        >
          <MaterialIcon d={copied === "copy" ? CHECK : CONTENT_COPY} />
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {copied === "copy" || copied === "instagram" ? "Link copied" : ""}
      </p>
    </div>
  );
}
