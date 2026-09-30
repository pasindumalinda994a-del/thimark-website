export type GalleryCategoryId =
  | "manufacturing"
  | "projects"
  | "recognition"
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
  { id: "projects", label: "Projects", full: "Projects" },
  { id: "recognition", label: "Recognition", full: "Recognition" },
  { id: "people", label: "People", full: "People & Events" },
];

const gallery = (file: string) => `/Gallery Images/${file}`;

export const GALLERY_FRAMES: GalleryFrame[] = [
  {
    id: "qc-bench",
    title: "QC Bench",
    category: "manufacturing",
    note: "Passed stock on the rack, the next check already on the table.",
    image: gallery("ThimarkWorkshop-tlkjrLBgY8PszAucZdS4Cg.jpg"),
    alt: "Three technicians inspecting metal brackets at a workshop bench beneath a QC passed sign",
    fit: "cover",
    span: "feature",
    place: "Kadawatha",
  },
  {
    id: "kilgharrah",
    title: "Kilgharrah 600",
    category: "projects",
    note: "Trash-rack cleaner built for a hydropower intake.",
    image: gallery("Kilgharrah600-H4eS3WLBj1Hf5xwZhFBNSw.jpg"),
    alt: "Yellow Kilgharrah 600 trash-rack cleaner with its boom raised on an outdoor steel platform",
    fit: "cover",
    span: "feature",
    place: "KenGen",
  },
  {
    id: "sltc-awards",
    title: "SLTC Awards",
    category: "recognition",
    note: "Merit for outstanding R&D, and excellence in in-house research, 2025.",
    image: gallery(
      "WhatsAppImage2025-11-14at12.15.49-D0F_FxSurq4Ojsp3LuH4cA.jpeg",
    ),
    alt: "Two SLTC Research and Innovation Awards 2025 trophies presented to Thimark Technocreations",
    fit: "contain",
    span: "band",
    place: "Colombo",
  },
  {
    id: "welcome-line",
    title: "Welcome Line",
    category: "people",
    note: "Garlands on, folders in hand, the evening just opening.",
    image: gallery("1-ZVxCUBk0IreVmuR95D0V9Q.jpeg"),
    alt: "Guests in formal dress and flower garlands gathered in a bright lobby",
    fit: "cover",
    span: "feature",
    place: "Evening",
  },
  {
    id: "arrivals",
    title: "Arrivals",
    category: "people",
    note: "The floor by the lift, before the hall.",
    image: gallery("3-HeDn1dimB8Vb51HQKxWyqg.jpeg"),
    alt: "Guests wearing flower garlands standing together beside a lobby elevator",
    fit: "cover",
    span: "stack",
    place: "Evening",
  },
  {
    id: "greeting",
    title: "Greeting",
    category: "people",
    note: "A welcome returned, hands together.",
    image: gallery("4-exUKhkkue2KGxE_rjGbwWw.jpeg"),
    alt: "A guest in a light suit and garland greeting a host in a blue dress",
    fit: "cover",
    span: "stack",
    place: "Evening",
  },
  {
    id: "traditional-welcome",
    title: "Traditional Welcome",
    category: "people",
    note: "Dancers at the threshold, trays held out.",
    image: gallery("5-ZyrwZppXEF-u6EKLybVF8Q.jpeg"),
    alt: "A guest receiving a ceremonial tray from dancers in traditional dress on a lit stage",
    fit: "cover",
    span: "feature",
    place: "Evening",
  },
  {
    id: "lamp-lighting",
    title: "Lamp Lighting",
    category: "people",
    note: "The first flame, held over the tray.",
    image: gallery("6-hXnqhAULC-l4wUwYeqNiCw.jpeg"),
    alt: "A guest lighting a ceremonial lamp while dancers hold trays on stage",
    fit: "cover",
    span: "stack",
    place: "Evening",
  },
  {
    id: "oil-lamp",
    title: "Oil Lamp",
    category: "people",
    note: "The next wick, with the line of guests behind.",
    image: gallery("7-Md8itFQlzgQ_GZ7PcjTcqQ.jpeg"),
    alt: "A guest in a white shirt lighting an oil lamp during a traditional ceremony",
    fit: "cover",
    span: "stack",
    place: "Evening",
  },
  {
    id: "stage",
    title: "Stage",
    category: "people",
    note: "Colour, feathers, and the lights above the steps.",
    image: gallery("8-urXBskOm3V0pFy5ONpNVJg.jpeg"),
    alt: "Five performers in bright feathered costumes posed on a stage under red spotlights",
    fit: "cover",
    span: "band",
    place: "Evening",
  },
];

export const HERO_TALL_ID = "qc-bench";
export const HERO_WIDE_ID = "kilgharrah";
export const FEATURED_ID = "sltc-awards";

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
