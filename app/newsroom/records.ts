export type NewsCategoryId = "company" | "projects" | "awards" | "export" | "insights";

export type NewsCategory = {
  id: NewsCategoryId;
  label: string;
  full: string;
};

export const NEWS_CATEGORIES: NewsCategory[] = [
  { id: "company", label: "Company", full: "Company news" },
  { id: "projects", label: "Projects", full: "Projects and announcements" },
  { id: "awards", label: "Awards", full: "Awards & recognition" },
  { id: "export", label: "Export", full: "Export / International Projects" },
  { id: "insights", label: "Insights", full: "Insights" },
];

export type NewsRecord = {
  slug: string;
  category: NewsCategoryId;
  date: string;
  title: string;
  excerpt: string;
  body: string[];
  image: string;
  alt: string;
};

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
] as const;

export const NEWS_RECORDS: NewsRecord[] = [
  {
    slug: "kilgharrah-600-kengen",
    category: "export",
    date: "2026-09-12",
    title: "Kilgharrah 600 leaves for KenGen",
    excerpt:
      "A mobile hydraulic trash-rack cleaner, designed and built in Kadawatha, is on its way to a Kenyan hydropower intake.",
    body: [
      "Kilgharrah 600 is a mobile hydraulic trash-rack cleaning machine designed and manufactured by Thimark for the Kenya Electricity Generating Company. It brings hydraulic technology, custom controls, heavy fabrication, and mobile adaptability into one machine.",
      "The build stayed in Kadawatha from the first plate to the last control cabinet. Bench tests on the hydraulic circuit and the custom controls were signed off before the machine was broken down for shipping.",
      "This is the record of a machine that leaves Sri Lanka as a working tool, not a drawing. The intake it is built for sits with KenGen.",
    ],
    image: "/home-images/featured-kilgharrah.png",
    alt: "Kilgharrah 600 trash-rack cleaner operating at a hydropower intake",
  },
  {
    slug: "iso-9001-on-the-floor",
    category: "company",
    date: "2026-08-04",
    title: "The certificate stays on the floor",
    excerpt:
      "ISO 9001 is the way a bracket, a weld, and a dispatch note leave the shop — not a frame on the office wall.",
    body: [
      "Thimark’s ISO 9001 certificate is kept current because the floor keeps it current. Incoming material, weld procedure, and the final inspection note are the same document trail on a motorcycle bracket and on a fabricated machine frame.",
      "The Kadawatha works runs both programmes on one quality system. A second pair of eyes still signs the batch before it is packed.",
      "Company news, in this register, is the standard the shop already works to.",
    ],
    image: "/home-images/about-workshop.png",
    alt: "Thimark workshop floor in Kadawatha",
  },
  {
    slug: "oem-bracket-programme",
    category: "projects",
    date: "2026-07-22",
    title: "A new bracket set for local assembly",
    excerpt:
      "Number-plate and pillion brackets enter production for motorcycle models assembled with DPMC/Bajaj, Senaro, and Ranomoto.",
    body: [
      "Thimark supplies components for motorcycle models manufactured and assembled locally, with OEM partners including DPMC/Bajaj, Senaro, and Ranomoto.",
      "The latest set covers number-plate brackets and pillion bars. Tooling and first-off samples are signed, and the parts now run as a repeat batch rather than a prototype.",
      "Each bracket is cut, formed, and finished to the assembly print so it meets the line without a second fitting.",
    ],
    image: "/products/Number Plate Bracket.png",
    alt: "Thimark number plate bracket for local motorcycle assembly",
  },
  {
    slug: "cited-for-a-machine-that-travelled",
    category: "awards",
    date: "2026-06-18",
    title: "Cited for a machine that travelled",
    excerpt:
      "The Kilgharrah programme is recognised for taking a Sri Lankan machine from drawing to a working hydropower intake.",
    body: [
      "Recognition, for this works, is a record of a machine that left the building and did the job it was drawn for. Kilgharrah 600 is that record: designed, fabricated, and controlled in Kadawatha, then put to work on a KenGen intake.",
      "The citation names the crossing — from a local fabrication bay to an international hydropower site — rather than a trophy on its own.",
      "Awards in this register are kept next to the project they belong to.",
    ],
    image: "/home-images/two-core-machinery.png",
    alt: "Engineers assembling custom industrial machinery",
  },
  {
    slug: "regional-component-dispatch",
    category: "export",
    date: "2026-05-09",
    title: "Components packed for a regional line",
    excerpt:
      "A first dispatch of fabricated motorcycle parts leaves Kadawatha for an assembly partner outside Sri Lanka.",
    body: [
      "Export is not only complete machines. A first crate of fabricated motorcycle components has left Kadawatha for an assembly line in the region.",
      "The parts are the same family supplied to local OEM programmes: brackets and plates held to print, packed with the inspection note in the crate.",
      "Further dispatches follow the same route — build here, record the batch, ship the crate.",
    ],
    image: "/home-images/two-core-automotive.png",
    alt: "Precision motorcycle components on a workshop bench",
  },
  {
    slug: "fabrication-bay-second-shift",
    category: "company",
    date: "2026-04-16",
    title: "A second shift opens on the fabrication bay",
    excerpt:
      "Capacity on the heavy-fab line steps up so machinery builds and component runs can share the same week.",
    body: [
      "The fabrication bay at Kadawatha now runs a second shift. Machinery frames and the automotive component run were competing for the same hours.",
      "The extra shift keeps both programmes on their dates without moving either off the quality system that already governs the floor.",
      "Hiring stays inside the works. The standard does not split between day and evening.",
    ],
    image: "/home-images/hero-bg.png",
    alt: "Thimark fabrication bay",
  },
  {
    slug: "kilgharrah-controls-signed-off",
    category: "projects",
    date: "2026-03-28",
    title: "Controls bench signed off for Kilgharrah",
    excerpt:
      "Custom controls for the trash-rack cleaner finish their bench test before the machine is broken down for shipping.",
    body: [
      "Before Kilgharrah 600 was split for freight, the custom control cabinet finished its bench test in Kadawatha. Every function the intake will ask of the machine was run against the hydraulic circuit on the shop floor.",
      "The sign-off is a project record: the controls are part of the machine, not a box added at the destination.",
      "What shipped is the same cabinet that passed the bench.",
    ],
    image: "/sections/Fetured Products B V1.png",
    alt: "Industrial machinery prepared for dispatch",
  },
  {
    slug: "named-among-local-suppliers",
    category: "awards",
    date: "2026-02-11",
    title: "Named among trusted local suppliers",
    excerpt:
      "Assembly partners cite Thimark for brackets that arrive to print, batch after batch.",
    body: [
      "Local assembly partners have named Thimark among the suppliers they return to. The reason on the record is narrow: brackets and plates that match the print, lot after lot.",
      "The work behind that line is the OEM programme with DPMC/Bajaj, Senaro, and Ranomoto — components for motorcycle models built in Sri Lanka.",
      "Recognition here is repeat business written down.",
    ],
    image: "/products/Pillion Bracket.png",
    alt: "Pillion bracket manufactured by Thimark",
  },
  {
    slug: "what-a-print-actually-asks",
    category: "insights",
    date: "2026-08-21",
    title: "What a print actually asks of a bracket",
    excerpt:
      "The useful tolerance is the one the assembly line can repeat, not the tightest number that fits on the drawing.",
    body: [
      "A bracket print carries more than a shape. Hole position, material thickness, and the weld that holds a tab are the parts the assembly line will feel.",
      "Thimark treats the print as a record of what must stay the same from the first batch to the fiftieth. The number that matters is the one a local assembly partner can fit without a second operation.",
      "Insight, here, is the habit of reading the drawing for the line it will meet.",
    ],
    image: "/products/Battery Bracket.png",
    alt: "Battery bracket manufactured by Thimark",
  },
  {
    slug: "why-the-bench-test-is-the-record",
    category: "insights",
    date: "2026-01-30",
    title: "Why the bench test is the record",
    excerpt:
      "A machine is not finished when it is assembled. It is finished when the function it was drawn for has been run on the shop floor.",
    body: [
      "Before a machine leaves Kadawatha, the function it was drawn for is run against the circuit on the bench. That run is the record. A photograph of the frame is not.",
      "The same habit applies to a bracket lot: the inspection note travels with the crate because the part and the proof are one dispatch.",
      "What we keep in this register is the test, not the claim.",
    ],
    image: "/products/Rear Plate.png",
    alt: "Rear plate manufactured by Thimark",
  },
];

export function categoryById(id: NewsCategoryId) {
  return NEWS_CATEGORIES.find((category) => category.id === id)!;
}

export function formatRecordDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}`;
}

export function recordsIn(category: NewsCategoryId) {
  return NEWS_RECORDS.filter((record) => record.category === category).sort(
    (a, b) => b.date.localeCompare(a.date),
  );
}

export function getRecord(slug: string) {
  return NEWS_RECORDS.find((record) => record.slug === slug);
}
