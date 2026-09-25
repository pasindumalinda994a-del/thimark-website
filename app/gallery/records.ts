export type GalleryCategoryId =
  | "manufacturing"
  | "automotive"
  | "machinery"
  | "engineering"
  | "projects"
  | "people";

export type GallerySpan = "feature" | "stack" | "band";
export type GalleryFit = "cover" | "contain";

export type GalleryFrame = {
  id: string;
  title: string;
  category: GalleryCategoryId;
  note: string;
  image: string;
  alt: string;
  fit: GalleryFit;
  span: GallerySpan;
  place: string;
};

export type GalleryCategory = {
  id: GalleryCategoryId;
  label: string;
  full: string;
};

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  { id: "manufacturing", label: "Manufacturing", full: "Manufacturing" },
  {
    id: "automotive",
    label: "Automotive",
    full: "Automotive Components",
  },
  {
    id: "machinery",
    label: "Machinery",
    full: "Industrial Machinery",
  },
  {
    id: "engineering",
    label: "Engineering",
    full: "Engineering & Design",
  },
  { id: "projects", label: "Projects", full: "Projects" },
  { id: "people", label: "People", full: "Factory & People" },
];

export const GALLERY_FRAMES: GalleryFrame[] = [
  {
    id: "workshop-bay",
    title: "Fabrication Bay",
    category: "manufacturing",
    note: "Heavy steel taking shape under the hoist in Kadawatha.",
    image: "/home-images/about-workshop.png",
    alt: "Welders and fabricators working steel frames inside an open workshop bay",
    fit: "cover",
    span: "feature",
    place: "Kadawatha",
  },
  {
    id: "steel-bay",
    title: "Steel Line",
    category: "manufacturing",
    note: "Beams, sparks, and the long cut of a fabrication shift.",
    image: "/home-images/about-steel-fabrication.jpeg",
    alt: "A fabricator welding a steel beam while others grind and lift stock nearby",
    fit: "cover",
    span: "stack",
    place: "Kadawatha",
  },
  {
    id: "lean-line",
    title: "Lean Line",
    category: "manufacturing",
    note: "Stations set so the next part is already within reach.",
    image: "/home-images/quality-lean-production.jpeg",
    alt: "Operators assembling components along a lit, organized production line",
    fit: "cover",
    span: "stack",
    place: "Kadawatha",
  },
  {
    id: "component-bench",
    title: "Component Bench",
    category: "automotive",
    note: "Gears, housings, and the check that follows the cut.",
    image: "/home-images/about-automotive-manufacturing.jpeg",
    alt: "Technicians inspecting machined automotive gears and housings at a bench",
    fit: "cover",
    span: "feature",
    place: "Kadawatha",
  },
  {
    id: "frame-jig",
    title: "Frame Jig",
    category: "automotive",
    note: "A fixture holds the part so the fastener lands once.",
    image: "/home-images/two-core-automotive.jpeg",
    alt: "Two assemblers fastening a motorcycle frame in a shop-floor jig",
    fit: "cover",
    span: "stack",
    place: "Kadawatha",
  },
  {
    id: "battery-bracket",
    title: "Battery Bracket",
    category: "automotive",
    note: "Stamped steel, welded tabs, finished for the CT 100.",
    image: "/products/Battery Bracket.png",
    alt: "Black stamped Bajaj CT 100 battery bracket with welded mounting tabs",
    fit: "contain",
    span: "stack",
    place: "CT 100",
  },
  {
    id: "machine-floor",
    title: "Machine Floor",
    category: "manufacturing",
    note: "CNC, weld light, and the aisle between them.",
    image: "/home-images/hero-bg.png",
    alt: "A machinist running a CNC mill on a factory floor with welders working behind him",
    fit: "cover",
    span: "band",
    place: "Kadawatha",
  },
  {
    id: "process-line",
    title: "Process Machine",
    category: "machinery",
    note: "A drum, a drive, and the crew that keeps it turning.",
    image: "/home-images/two-core-machinery.jpeg",
    alt: "Engineers inspecting a large rotating process machine inside a factory hall",
    fit: "cover",
    span: "feature",
    place: "Kadawatha",
  },
  {
    id: "automation-cell",
    title: "Automation Cell",
    category: "machinery",
    note: "A robot arm beside the line, checked before it runs.",
    image: "/home-images/about-industrial-automation.jpeg",
    alt: "Engineers reviewing a robotic cell and conveyor inside an industrial hall",
    fit: "cover",
    span: "stack",
    place: "Kadawatha",
  },
  {
    id: "iso-bench",
    title: "Precision Bench",
    category: "engineering",
    note: "Caliper on the part, drawing on the bench.",
    image: "/home-images/about-iso-precision.jpeg",
    alt: "Two engineers measuring a machined gear against drawings in a metrology bay",
    fit: "cover",
    span: "stack",
    place: "Kadawatha",
  },
  {
    id: "kilgharrah",
    title: "Kilgharrah 600",
    category: "projects",
    note: "Trash-rack cleaner built for a hydropower intake.",
    image: "/home-images/featured-kilgharrah.png",
    alt: "Kilgharrah 600 trash-rack cleaner operating at a hydropower intake",
    fit: "cover",
    span: "feature",
    place: "KenGen",
  },
  {
    id: "drawing-review",
    title: "Drawing Review",
    category: "engineering",
    note: "The housing on the table, the print beside it.",
    image: "/home-images/quality-continuous-improvement.jpeg",
    alt: "Engineers reviewing a manufactured housing against production drawings",
    fit: "cover",
    span: "stack",
    place: "Kadawatha",
  },
  {
    id: "caliper-check",
    title: "Caliper Check",
    category: "people",
    note: "A measured face, not a guessed one.",
    image: "/home-images/quality-inspection.jpeg",
    alt: "An engineer inspecting a machined metal component with a digital caliper",
    fit: "cover",
    span: "stack",
    place: "Kadawatha",
  },
  {
    id: "intake-crew",
    title: "Intake Crew",
    category: "projects",
    note: "Controls, gates, and the people walking the deck.",
    image: "/home-images/about-international-engineering.jpeg",
    alt: "Engineers commissioning mechanical gates on a hydropower intake deck",
    fit: "cover",
    span: "band",
    place: "Site",
  },
  {
    id: "bar-pillion",
    title: "Bar Pillion",
    category: "automotive",
    note: "Left and right, powder-coated, ready for assembly.",
    image: "/products/Bar Pillion LH & RH.png",
    alt: "Black powder-coated Bajaj CT 100 bar pillion bracket, left and right",
    fit: "contain",
    span: "feature",
    place: "CT 100",
  },
  {
    id: "number-plate",
    title: "Number Plate Bracket",
    category: "automotive",
    note: "Dual studs, one bracket, held to the drawing.",
    image: "/products/Number Plate Bracket.png",
    alt: "Black Bajaj CT 100 number plate bracket with dual studs",
    fit: "contain",
    span: "stack",
    place: "CT 100",
  },
  {
    id: "rear-plate",
    title: "Rear Plate",
    category: "automotive",
    note: "Stamped plate with the mounting holes already in place.",
    image: "/products/Rear Plate.png",
    alt: "Black stamped Bajaj CT 100 rear plate with dual mounting holes",
    fit: "contain",
    span: "stack",
    place: "CT 100",
  },
  {
    id: "pillion-bracket",
    title: "Pillion Bracket",
    category: "automotive",
    note: "Tubular arms, forked, finished in black.",
    image: "/products/Pillion Bracket.png",
    alt: "Black tubular Bajaj CT 100 pillion bracket with forked arms",
    fit: "contain",
    span: "band",
    place: "CT 100",
  },
];

export const HERO_TALL_ID = "workshop-bay";
export const HERO_WIDE_ID = "process-line";
export const FEATURED_ID = "machine-floor";

export function categoryById(id: GalleryCategoryId) {
  const category = GALLERY_CATEGORIES.find((item) => item.id === id);
  if (!category) throw new Error(`Unknown gallery category: ${id}`);
  return category;
}

export function frameById(id: string) {
  const frame = GALLERY_FRAMES.find((item) => item.id === id);
  if (!frame) throw new Error(`Unknown gallery frame: ${id}`);
  return frame;
}

export function framesIn(category: GalleryCategoryId | "all") {
  if (category === "all") return GALLERY_FRAMES;
  return GALLERY_FRAMES.filter((frame) => frame.category === category);
}

export function frameSrc(path: string) {
  return encodeURI(path).replaceAll("&", "%26");
}

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}
