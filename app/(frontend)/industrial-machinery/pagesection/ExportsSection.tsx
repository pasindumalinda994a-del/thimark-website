"use client";

import { useRef } from "react";
import MaskRevealHeading from "@/app/(frontend)/components/MaskRevealHeading";
import SectionGrid from "@/app/(frontend)/components/SectionGrid";
import Stamp from "@/app/(frontend)/components/Stamp";
import {
  Cell,
  Corners,
  Eyebrow,
  Frame,
  MobileEdge,
  type HLine,
  type VLine,
} from "@/app/(frontend)/components/plate";
import { usePlateMotion } from "@/app/(frontend)/components/usePlateMotion";
import { padIndex } from "@/app/(frontend)/homesections/StoryProgress";
import { EXPORTS } from "./machinery";

const H: HLine[] = [
  [3, 0, 12],
  [4, 0, 12],
  [12, 0, 12],
  [15, 0, 12],
];

const V: VLine[] = [
  [0, 0, 18],
  [12, 0, 18],
  [8, 0, 3],
  [6, 3, 12],
  [3, 12, 15],
  [6, 12, 15],
  [9, 12, 15],
  [8, 15, 18],
];

/** Equirectangular plot: 30°E–90°E across, 15°N–10°S down. */
const plot = (lon: number, lat: number) => ({
  x: 40 + (lon - 30) * (320 / 60),
  y: 40 + (15 - lat) * (220 / 25),
});

const ORIGIN = plot(79.95, 7.0);
const DESTINATION = plot(36.82, -1.29);
const ARC = `M ${ORIGIN.x} ${ORIGIN.y} Q ${(ORIGIN.x + DESTINATION.x) / 2} ${ORIGIN.y - 120} ${DESTINATION.x} ${DESTINATION.y}`;
const LATITUDES = [10, 0, -10];
const LONGITUDES = [40, 60, 80];

function Crosshair({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle data-glyph-stroke="visible" cx={x} cy={y} r="7" />
      <line data-glyph-stroke="visible" x1={x - 12} y1={y} x2={x + 12} y2={y} />
      <line data-glyph-stroke="visible" x1={x} y1={y - 12} x2={x} y2={y + 12} />
      <circle data-seal-fade="" cx={x} cy={y} r="2.5" className="im-route-pin" />
    </g>
  );
}

function RouteDrawing() {
  const { origin, destination, caption } = EXPORTS.route;
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid meet"
      className="im-route-svg"
      role="img"
      aria-label={`Route from ${origin.name}, ${origin.country} to ${destination.name}, ${destination.country}`}
    >
      <g className="im-route-grid" data-seal-fade="">
        {LATITUDES.map((lat) => {
          const { y } = plot(30, lat);
          return (
            <g key={`lat-${lat}`}>
              <line x1="40" x2="360" y1={y} y2={y} />
              <text x="364" y={y + 3}>
                {lat === 0 ? "0\u00b0" : `${Math.abs(lat)}\u00b0${lat > 0 ? "N" : "S"}`}
              </text>
            </g>
          );
        })}
        {LONGITUDES.map((lon) => {
          const { x } = plot(lon, 0);
          return (
            <g key={`lon-${lon}`}>
              <line x1={x} x2={x} y1="40" y2="260" />
              <text x={x} y="274" textAnchor="middle">
                {lon}&deg;E
              </text>
            </g>
          );
        })}
      </g>

      <path d={ARC} className="im-route-arc-ghost" data-seal-fade="" />
      <path d={ARC} data-glyph-stroke="visible" className="im-route-arc" />

      <Crosshair {...ORIGIN} />
      <Crosshair {...DESTINATION} />

      <g data-seal-fade="" className="im-route-label">
        <text x={ORIGIN.x} y={ORIGIN.y + 30} textAnchor="middle" className="im-route-name">
          {origin.name}
        </text>
        <text x={ORIGIN.x} y={ORIGIN.y + 44} textAnchor="middle">
          {origin.country}
        </text>
        <text x={ORIGIN.x} y={ORIGIN.y + 57} textAnchor="middle" className="im-route-meta">
          {origin.coords}
        </text>
      </g>
      <g data-seal-fade="" className="im-route-label">
        <text x={DESTINATION.x} y={DESTINATION.y + 30} textAnchor="middle" className="im-route-name">
          {destination.name}
        </text>
        <text x={DESTINATION.x} y={DESTINATION.y + 44} textAnchor="middle">
          {destination.country}
        </text>
        <text
          x={DESTINATION.x}
          y={DESTINATION.y + 57}
          textAnchor="middle"
          className="im-route-meta"
        >
          {destination.coords}
        </text>
      </g>
      <text
        data-seal-fade=""
        x={(ORIGIN.x + DESTINATION.x) / 2}
        y={ORIGIN.y - 66}
        textAnchor="middle"
        className="im-route-meta"
      >
        {caption}
      </text>

      <g data-seal-fade="" className="im-route-north">
        <line x1="56" y1="70" x2="56" y2="50" />
        <path d="M 52 56 L 56 50 L 60 56" />
        <text x="56" y="82" textAnchor="middle">
          N
        </text>
      </g>
    </svg>
  );
}

export default function ExportsSection() {
  const ref = useRef<HTMLElement>(null);
  usePlateMotion(ref);

  return (
    <SectionGrid
      ref={ref}
      id="exports"
      aria-labelledby="exports-heading"
      rows={18}
      tone="page"
      outerV={false}
      className="flex flex-col bg-steel text-cream [--page-bg:var(--steel)] [--page-ink:var(--cream)] scroll-mt-16 md:scroll-mt-0"
    >
      <Frame h={H} v={V} />

      <Cell at={[0, 8, 0, 3]} className="plate-title">
        <MobileEdge open />
        <Eyebrow data-reveal index={EXPORTS.index}>
          {EXPORTS.eyebrow}
        </Eyebrow>
        <MaskRevealHeading
          id="exports-heading"
          className="font-heading text-[clamp(28px,2.5vw,48px)] leading-none font-medium uppercase"
        >
          {EXPORTS.heading[0]}
          <span className="block">{EXPORTS.heading[1]}</span>
        </MaskRevealHeading>
      </Cell>

      <Cell at={[8, 12, 0, 3]} className="plate-lede">
        <MobileEdge />
        <p
          data-reveal
          className="font-heading text-[clamp(12px,1vw,16px)] leading-[1.1] font-medium uppercase md:text-justify md:[text-align-last:left]"
        >
          {EXPORTS.lede}
        </p>
      </Cell>

      <Cell at={[0, 6, 3, 4]} className="ab-head index-tag">
        <MobileEdge open />
        <span className="flex items-center gap-2">
          <span aria-hidden className="ab-marker" />
          {EXPORTS.routeLabel}
        </span>
        <span>[Fig. 04]</span>
      </Cell>

      <Cell at={[0, 6, 4, 12]} className="im-route">
        <MobileEdge />
        <div data-draw className="plate-fill dot-field-soft im-route-frame">
          <Corners />
          <RouteDrawing />
        </div>
      </Cell>

      <Cell at={[6, 12, 3, 4]} className="ab-head index-tag">
        <MobileEdge open />
        <span>{EXPORTS.highlightLabel}</span>
        <span>[KE]</span>
      </Cell>

      <Cell at={[6, 12, 4, 12]} className="ov-story">
        <MobileEdge />
        <p
          data-reveal
          className="font-heading text-[clamp(16px,1.35vw,24px)] leading-[1.08] font-medium uppercase"
        >
          {EXPORTS.lead}
        </p>
        <div className="ov-story-list">
          {EXPORTS.paragraphs.map((paragraph, i) => (
            <div key={paragraph} data-reveal className="ov-story-item">
              <span className="index-tag tabular-nums" aria-hidden>
                {padIndex(i)}
              </span>
              <p className="ab-copy">{paragraph}</p>
            </div>
          ))}
        </div>
      </Cell>

      {EXPORTS.facts.map((fact, i) => (
        <Cell key={fact.id} at={[i * 3, i * 3 + 3, 12, 15]} as="dl" className="im-fact">
          <MobileEdge />
          <dt className="ov-stat-head index-tag">
            <span>{fact.label}</span>
            <span className="tabular-nums opacity-60">[{padIndex(i)}]</span>
          </dt>
          <dd data-reveal className="im-fact-value">
            {fact.value}
          </dd>
        </Cell>
      ))}

      <Cell at={[0, 8, 15, 18]} className="plate-statement">
        <MobileEdge open />
        <p data-reveal className="ab-statement im-statement">
          {EXPORTS.statement[0]}
          <span className="ab-statement-muted">{EXPORTS.statement[1]}</span>
        </p>
      </Cell>

      <Cell at={[8, 12, 15, 18]} className="im-stamp">
        <MobileEdge />
        <Stamp data-reveal strong={EXPORTS.stamp.strong} sub={EXPORTS.stamp.sub} />
      </Cell>
    </SectionGrid>
  );
}
