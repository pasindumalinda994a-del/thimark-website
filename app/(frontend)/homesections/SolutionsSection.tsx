import Image from "next/image";
import Link from "next/link";
import DirectionPulse from "@/app/(frontend)/components/DirectionPulse";
import PlusMark, { type PlusArms } from "@/app/(frontend)/components/PlusMark";
import { GridLine } from "@/app/(frontend)/components/SectionGrid";

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
    title: "Trash Rack Cleaning Machine",
    callout: ["KenGen", "Mobile hydraulic"],
    image: "/home-images/featured-kilgharrah.png",
    alt: "Kilgharrah 600 trash-rack cleaner operating at a hydropower intake",
    href: "/#contact",
    cta: "Discover Kilgharrah 600",
    imageSide: "right",
    body: "Thimark built the Kilgharrah 600 for KenGen, a mobile hydraulic trash rack cleaner with custom controls and fabrication.",
  },
  {
    id: "oem",
    name: "OEM Motorcycle Components",
    title: "Precision for Local Assembly",
    callout: ["DPMC · Bajaj", "Local assembly"],
    image: "/home-images/two-core-automotive.png",
    alt: "Precision motorcycle components on a workshop bench",
    href: "/#catalogue",
    cta: "Explore OEM Components",
    imageSide: "left",
    body: "Thimark now supplies key parts for the local motorcycle assembly with its OEM partners DPMC/Bajaj, Senaro and Ranomoto.",
  },
  {
    id: "machinery-work",
    name: "Custom Industrial Machinery",
    title: "Built Around Your Application",
    callout: ["Custom build", "Built for the site"],
    image: "/home-images/two-core-machinery.png",
    alt: "Engineers assembling custom industrial machinery",
    href: "/#manufacturing",
    cta: "Explore Industrial Machinery",
    imageSide: "right",
    body: "Thimark also develops custom machinery and fabricated systems built around the real operational needs of each new site.",
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
            className="solutions-band scroll-mt-16 md:scroll-mt-0"
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
              </div>
              <span aria-hidden className="solutions-datum hidden md:block" />
              <MobileRails />
            </div>

            <div className="solutions-note">
              <div className="solutions-note-copy">
                <p className="solutions-band-kicker index-tag">
                  <span aria-hidden className="solutions-band-mark" />
                  [{padIndex(index)}]
                </p>
                <h3 id={`${solution.id}-title`} className="solutions-band-name">
                  {solution.name}
                </h3>
                <p className="solutions-band-title">{solution.title}</p>
                <p className="solutions-note-body">{solution.body}</p>
              </div>
              <Link
                href={solution.href}
                data-cursor="explore"
                className="solutions-note-foot index-tag"
              >
                {solution.cta}
                <DirectionPulse direction="right" />
              </Link>
              <MobileRails />
            </div>
          </article>
        );
      })}
    </div>
  );
}
