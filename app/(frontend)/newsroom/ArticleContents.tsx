"use client";

import { useId, useState, type MouseEvent } from "react";
import { flushSync } from "react-dom";

type ContentsItem = {
  id: string;
  heading: string;
};

function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

/** Article contents. Always open from md up; a disclosure on phones. */
export default function ArticleContents({ items }: { items: ContentsItem[] }) {
  const [open, setOpen] = useState(false);
  const [instant, setInstant] = useState(false);
  const panelId = useId();

  const toggle = () => {
    setInstant(false);
    setOpen((value) => !value);
  };

  // Collapse before the smooth-scroll anchor handler measures the target,
  // otherwise the list folding away above it shifts the landing point.
  const onLinkCapture = (event: MouseEvent<HTMLElement>) => {
    if (!open || !(event.target instanceof Element) || !event.target.closest("a")) return;
    flushSync(() => {
      setInstant(true);
      setOpen(false);
    });
  };

  return (
    <nav
      className="news-article-toc"
      aria-label="Contents"
      data-open={open ? "true" : "false"}
      data-instant={instant ? "true" : undefined}
    >
      <p className="news-meta index-tag hidden md:block">Contents</p>
      <button
        type="button"
        className="news-toc-toggle index-tag md:hidden"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
      >
        <span>Contents</span>
        <span className="news-toc-count tabular-nums">[{padIndex(items.length - 1)}]</span>
        <span aria-hidden className="news-toc-sign" />
      </button>
      <div id={panelId} className="news-toc-panel" onClickCapture={onLinkCapture}>
        <ol>
          {items.map((item, i) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>
                <span aria-hidden className="news-toc-leader" />
                <span className="news-toc-label">{item.heading}</span>
                <span aria-hidden className="news-toc-index">
                  [{padIndex(i)}]
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
