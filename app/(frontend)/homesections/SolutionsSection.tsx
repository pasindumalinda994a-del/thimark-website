import Image from "next/image";
import Copy from "@/app/(frontend)/components/Copy";
import Link from "next/link";
import H3Heading from "@/app/(frontend)/components/H3Heading";
import DirectionPulse from "@/app/(frontend)/components/DirectionPulse";
import PlusMark, { type PlusArms } from "@/app/(frontend)/components/PlusMark";
import { GridLine } from "@/app/(frontend)/components/SectionGrid";
import FigMark, { HOME_FIG } from "@/app/(frontend)/components/FigMark";

const joinLeftEdge: PlusArms = { up: true, down: true, left: false, right: true };
const joinRightEdge: PlusArms = { up: true, down: true, left: true, right: false };
const joinTeeUp: PlusArms = { up: true, down: false, left: true, right: true };

function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

const SOLUTIONS = [
  {
    id: "kilgharrah",
    name: "Kilgharrah 600",
    title: "Automated Trash Rack Cleaning Machine",
    callout: ["KenGen", "Hydropower Infrastructure"],
    image: "/pages/home/featured-kilgharrah.png",
    alt: "Kilgharrah 600 trash-rack cleaner operating at a hydropower intake",
    href: "/industrial-machinery#kilgarrah",
    cta: "View the Kilgharrah 600",
    imageSide: "right",
    body: "Thimark designed and manufactured the Kilgharrah 600 for KenGen, delivering a custom-engineered hydraulic trash-rack cleaning solution for hydropower infrastructure.",
  },
  {
    id: "oem",
    name: "OEM Motorcycle Components",
    title: "Precision for Local Assembly",
    callout: ["DPMC / Bajaj", "Senaro", "Ranomoto"],
    image: "/pages/home/two-core-automotive.png",
    alt: "Precision motorcycle components on a workshop bench",
    href: "/automotive#product-range",
    cta: "View the Component Range",
    imageSide: "left",
    body: "Thimark manufactures key motorcycle components for local assembly programmes, supporting established OEM partners with precision-engineered parts and dependable production.",
  },
  {
    id: "machinery-work",
    name: "Custom Industrial Machinery",
    title: "Built Around Your Application",
    callout: ["Custom Engineering", "Site-Specific Solutions"],
    image: "/pages/home/two-core-machinery.png",
    alt: "Engineers assembling custom industrial machinery",
    href: "/industrial-machinery#portfolio",
    cta: "View Custom Machinery",
    imageSide: "right",
    body: "From specialized equipment to fabricated industrial systems, Thimark develops machinery around real operational requirements, helping customers address complex engineering challenges.",
  },
] as const;

function MobileRails() {
  return (
    <>
      <GridLine axis="v" unstyled tone="page" className="left-0 hero-v-between-pluses md:hidden" />
      <GridLine axis="v" unstyled tone="page" className="left-full hero-v-between-pluses md:hidden" />
      <GridLine
        axis="h"
        unstyled
        tone="page"
        className="at-bottom left-(--line-stop) w-[calc(100%-2*var(--line-stop))] md:hidden"
      />
      <PlusMark tone="page" arms={joinLeftEdge} className="left-0 at-bottom md:hidden" />
      <PlusMark tone="page" arms={joinRightEdge} className="left-full at-bottom md:hidden" />
    </>
  );
}

export default function SolutionsSection() {
  return (
    <div className="solutions-sheet">
      {SOLUTIONS.map((solution, index) => {
        const isLast = index === SOLUTIONS.length - 1;
        return (
          <article
            key={solution.id}
            id={solution.id}
            data-image={solution.imageSide}
            aria-labelledby={`${solution.id}-title`}
            className="solutions-band scroll-mt-16 xl:scroll-mt-0"
          >
            <GridLine axis="v" unstyled tone="page" className="v-g1-0 solutions-v hidden md:block" />
            <GridLine axis="v" unstyled tone="page" className="v-g1-6 solutions-v hidden md:block" />
            <GridLine axis="v" unstyled tone="page" className="v-g1-12 solutions-v hidden md:block" />
            <GridLine axis="h" unstyled tone="page" className="h-seg-0-mid solutions-h hidden md:block" />
            <GridLine axis="h" unstyled tone="page" className="h-seg-mid-12 solutions-h hidden md:block" />
            <PlusMark tone="page" arms={joinLeftEdge} className="v-g1-0 solutions-h hidden md:block" />
            <PlusMark
              tone="page"
              arms={isLast ? joinTeeUp : undefined}
              className="v-g1-6 solutions-h hidden md:block"
            />
            <PlusMark tone="page" arms={joinRightEdge} className="v-g1-12 solutions-h hidden md:block" />
            <MobileRails />

            <p aria-hidden className="solutions-band-head index-tag md:hidden">
              <span>Solution</span>
              <span>
                [{padIndex(index)} / {padIndex(SOLUTIONS.length - 1)}]
              </span>
            </p>

            <div className="solutions-plate">
              <div className="solutions-plate-shot">
                <Image
                  src={solution.image}
                  alt={solution.alt}
                  fill
                  sizes="(min-width: 768px) 60vw, 100vw"
                  className="object-cover"
                />
                <p className="solutions-callout index-tag">
                  {solution.callout.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
                <PlusMark tone="light" className="top-4 left-4 z-10" />
                <PlusMark tone="light" className="top-4 left-[calc(100%-16px)] z-10" />
                <PlusMark tone="light" className="top-[calc(100%-16px)] left-4 z-10" />
                <PlusMark tone="light" className="top-[calc(100%-16px)] left-[calc(100%-16px)] z-10" />
                <FigMark n={HOME_FIG.solutions + index} />
              </div>
            </div>

            <div className="solutions-note">
              <div className="solutions-note-copy">
                <p className="solutions-band-kicker index-tag">
                  <span aria-hidden className="solutions-band-mark" />
                  [{padIndex(index)}]
                </p>
                <H3Heading id={`${solution.id}-title`} variant="statement">
                  {solution.name}
                </H3Heading>
                <Copy variant="lede" className="solutions-band-title">{solution.title}</Copy>
                <Copy variant="body" className="solutions-note-body">{solution.body}</Copy>
              </div>
              <Link
                href={solution.href}
                data-cursor="explore"
                className="solutions-note-foot index-tag"
              >
                {solution.cta}
                <DirectionPulse direction="right" />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
