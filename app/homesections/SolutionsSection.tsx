import Image from "next/image";
import Link from "next/link";
import PlusMark from "@/app/components/PlusMark";
import ScrollHint from "@/app/components/ScrollHint";
import { GridLine } from "@/app/components/SectionGrid";

function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

const CARDS = [
  {
    id: "kilgharrah",
    bar: "Kilgharrah 600",
    title: "Automated Trash Rack Cleaning Machine",
    image: "/home-images/featured-kilgharrah.png",
    alt: "Kilgharrah 600 trash-rack cleaner operating at a hydropower intake",
    col: "solutions-col-a",
    href: "/#contact",
    cta: "Discover Kilgharrah 600 →",
    body: (
      <>
        A mobile hydraulic trash rack cleaning machine designed and manufactured
        by Thimark for the Kenya Electricity Generating Company (KenGen). The
        Kilgharrah 600 brings together hydraulic technology, custom controls,
        heavy fabrication and mobile adaptability.
      </>
    ),
  },
  {
    id: "oem",
    bar: "OEM Motorcycle Components",
    title: "Precision Manufacturing for Local Assembly",
    image: "/home-images/two-core-automotive.png",
    alt: "Precision motorcycle components on a workshop bench",
    col: "solutions-col-b",
    href: "/#catalogue",
    cta: "Explore OEM Components →",
    body: (
      <>
        Thimark supplies components for motorcycle models manufactured and
        assembled locally, working with established OEM partners including
        DPMC/Bajaj, Senaro and Ranomoto.
      </>
    ),
  },
  {
    id: "machinery-work",
    bar: "Custom Industrial Machinery",
    title: "Built Around Your Application",
    image: "/home-images/two-core-machinery.png",
    alt: "Engineers assembling custom industrial machinery",
    col: "solutions-col-c",
    href: "/#manufacturing",
    cta: "Explore Industrial Machinery →",
    body: (
      <>
        From industrial machinery and systems to specialized fabricated
        solutions, Thimark develops equipment around specific operational
        requirements.
      </>
    ),
  },
] as const;

export default function SolutionsSection() {
  return (
    <div className="relative md:contents">
      {/* Outer rails */}
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-top-3 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-3-br5 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-br5-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-0 v-seg-br2-end hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-top-3 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-3-br5 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-br5-br2 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-12 v-seg-br2-end hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-8 v-seg-top-3 hidden md:block" />
      <GridLine axis="v" unstyled tone="page" className="v-g1-8 v-seg-br2-end hidden md:block" />

      {/* Column dividers, drawn by the scrub */}
      <GridLine
        axis="v"
        unstyled
        tone="page"
        data-mid-line="top"
        className="v-g1-4 v-seg-3-br5 hidden md:block"
      />
      <GridLine
        axis="v"
        unstyled
        tone="page"
        data-mid-line="base"
        className="v-g1-4 v-seg-br5-br2 hidden md:block"
      />
      <GridLine
        axis="v"
        unstyled
        tone="page"
        data-mid-line="top"
        className="v-g1-8 v-seg-3-br5 hidden md:block"
      />
      <GridLine
        axis="v"
        unstyled
        tone="page"
        data-mid-line="base"
        className="v-g1-8 v-seg-br5-br2 hidden md:block"
      />

      {/* Row 3 — intro base / bar lane top */}
      <GridLine axis="h" unstyled tone="page" className="h-seg-0-8 top-rows-3 hidden md:block" />
      <GridLine axis="h" unstyled tone="page" className="h-seg-8-12 top-rows-3 hidden md:block" />
      <PlusMark tone="page" className="v-g1-0 top-rows-3 hidden md:block" />
      <PlusMark tone="page" className="v-g1-8 top-rows-3 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 top-rows-3 hidden md:block" />

      {/* Row 5 — bar lane base, played per card when its bar seats */}
      <GridLine
        axis="h"
        unstyled
        tone="page"
        className="h-seg-0-4 top-rows-5 hidden md:block"
        data-card-lane="0"
      />
      <GridLine
        axis="h"
        unstyled
        tone="page"
        className="h-seg-4-8 top-rows-5 hidden md:block"
        data-card-lane="1"
      />
      <GridLine
        axis="h"
        unstyled
        tone="page"
        className="h-seg-8-12 top-rows-5 hidden md:block"
        data-card-lane="2"
      />
      <PlusMark tone="page" className="v-g1-0 top-rows-5 hidden md:block" />
      <PlusMark tone="page" className="v-g1-4 top-rows-5 hidden md:block" />
      <PlusMark tone="page" className="v-g1-8 top-rows-5 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 top-rows-5 hidden md:block" />

      {/* Row 11 — media base, drawn per card as its bar lands */}
      <GridLine
        axis="h"
        unstyled
        tone="page"
        className="h-seg-0-4 at-br-5 hidden md:block"
        data-card-base="0"
      />
      <GridLine
        axis="h"
        unstyled
        tone="page"
        className="h-seg-4-8 at-br-5 hidden md:block"
        data-card-base="1"
      />
      <GridLine
        axis="h"
        unstyled
        tone="page"
        className="h-seg-8-12 at-br-5 hidden md:block"
        data-card-base="2"
      />
      <PlusMark tone="page" className="v-g1-0 at-br-5 hidden md:block" />
      <PlusMark tone="page" data-mid-plus="" className="v-g1-4 at-br-5 hidden md:block" />
      <PlusMark tone="page" data-mid-plus="" className="v-g1-8 at-br-5 hidden md:block" />
      <PlusMark tone="page" className="v-g1-12 at-br-5 hidden md:block" />

      {/* Row 14 — foot */}
      <GridLine
        axis="h"
        unstyled
        tone="page"
        data-end-line=""
        className="h-seg-0-4 at-br-2 hidden md:block"
      />
      <GridLine
        axis="h"
        unstyled
        tone="page"
        data-end-line=""
        className="h-seg-4-8 at-br-2 hidden md:block"
      />
      <GridLine
        axis="h"
        unstyled
        tone="page"
        data-end-line=""
        className="h-seg-8-12 at-br-2 hidden md:block"
      />
      <PlusMark tone="page" data-end-plus="" className="v-g1-0 at-br-2 hidden md:block" />
      <PlusMark tone="page" data-end-plus="" className="v-g1-4 at-br-2 hidden md:block" />
      <PlusMark tone="page" data-end-plus="" className="v-g1-8 at-br-2 hidden md:block" />
      <PlusMark tone="page" data-end-plus="" className="v-g1-12 at-br-2 hidden md:block" />

      <div className="solutions-track">
        {CARDS.map((card, i) => (
          <article
            key={card.id}
            id={card.id}
            className={`solutions-card ${card.col} scroll-mt-16 md:scroll-mt-0`}
          >
            <div data-card-bar={i} className="solutions-bar">
              <p className="solutions-bar-plate">
                <span aria-hidden>[{padIndex(i)}]</span>
                <span>{card.bar}</span>
              </p>
            </div>
            <Link
              href={card.href}
              data-card-image={i}
              data-cursor="explore"
              aria-label={card.cta.replace(" →", "")}
              className="solutions-card-media"
            >
              <Image
                src={card.image}
                alt={card.alt}
                fill
                sizes="(min-width: 768px) 30vw, 100vw"
                className="object-cover"
              />
              <PlusMark tone="light" className="top-4 left-4 z-10" />
              <PlusMark tone="light" className="top-4 left-[calc(100%-16px)] z-10" />
              <PlusMark tone="light" className="top-[calc(100%-16px)] left-4 z-10" />
              <PlusMark tone="light" className="top-[calc(100%-16px)] left-[calc(100%-16px)] z-10" />
            </Link>
            <div className="solutions-card-copy">
              <h3
                data-card-title={i}
                className="font-heading text-[clamp(16px,1.25vw,24px)] leading-none font-medium text-left uppercase"
              >
                {card.title}
              </h3>
              <p
                data-card-body={i}
                className="font-heading text-[clamp(10px,0.85vw,12px)] leading-none font-normal text-left uppercase md:text-justify md:[text-align-last:left]"
              >
                {card.body}
              </p>
              <Link
                href={card.href}
                data-card-cta={i}
                data-cursor="explore"
                className="index-tag mt-auto flex w-fit items-center gap-2"
              >
                <span aria-hidden className="inline-block h-[1.5px] w-4 bg-current" />
                {card.cta}
              </Link>
            </div>
            <GridLine
              axis="h"
              unstyled
              tone="page"
              className="at-bottom left-0 w-full md:hidden"
            />
          </article>
        ))}
      </div>
      <ScrollHint seat="col-8" />
    </div>
  );
}
