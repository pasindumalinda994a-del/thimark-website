"use client";

import { useState } from "react";
import Copy from "@/app/(frontend)/components/Copy";
import { padIndex } from "@/app/(frontend)/homesections/StoryProgress";
import type { MachineryItem } from "./machinery";

/** Phone list of a band's machines: names stay visible, one description opens at a time. */
export default function MachineryList({
  id,
  items,
}: {
  id: string;
  items: readonly MachineryItem[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ol data-reveal className="im-acc md:hidden">
      {items.map((item, i) => {
        const expanded = open === i;
        const triggerId = `${id}-machine-${i}`;
        const panelId = `${triggerId}-panel`;
        return (
          <li key={item.name} className="im-acc-item" data-open={expanded ? "true" : undefined}>
            <button
              id={triggerId}
              type="button"
              className="im-acc-trigger"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => setOpen(expanded ? null : i)}
            >
              <span className="im-acc-index index-tag tabular-nums">[{padIndex(i)}]</span>
              <span className="im-acc-name">{item.name}</span>
              <span aria-hidden className="im-acc-sign" />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className="im-acc-panel"
              inert={!expanded}
            >
              <div className="im-acc-panel-inner">
                <Copy variant="body" className="im-acc-body">
                  {item.body}
                </Copy>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
