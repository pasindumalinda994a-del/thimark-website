import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPayload, type Payload } from "payload";
import config from "../payload.config";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicFile = (...parts: string[]) => path.join(root, "public", ...parts);
const context = { disableRevalidate: true, skipEnquiryEmail: true };

type SeedNews = {
  slug: string;
  category: "company" | "projects" | "awards" | "export" | "insights";
  date: string;
  title: string;
  excerpt: string;
  body: { heading: string; text: string; href?: string; hrefLabel?: string }[];
  photos: string[];
  alt: string;
};

type SeedFrame = {
  title: string;
  category: "manufacturing" | "projects" | "recognition" | "people";
  note: string;
  file: string;
  alt: string;
  fit: "cover" | "contain";
  place: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

const NEWS: SeedNews[] = [
  {
    slug: "two-awards-kilgharrah-600",
    category: "awards",
    date: "2025-11-14",
    title: "Honored with two awards for Kilgharrah 600",
    excerpt:
      "Two awards for the Kenya project Kilgharrah 600, for engineering innovation and industrial research.",
    body: [
      {
        heading: "The awards",
        text: "These two awards were presented last Wednesday for the Kenya project, Kilgharrah 600, recognizing the team’s commitment to innovation, engineering excellence, and impactful industrial research.",
      },
      { heading: "Excellence in Engineering Innovation", text: "Award for Excellence in Engineering Innovation." },
      { heading: "Outstanding Industrial Research", text: "Merit Award for Outstanding Industrial Research." },
      {
        heading: "The team",
        text: "A big thank-you to everyone who contributed to making this project a success. Onward to even greater milestones.",
      },
    ],
    photos: [1, 2, 3, 4].map((n) => publicFile("news", `awards-${pad(n)}.jpg`)),
    alt: "Thimark receiving awards for the Kilgharrah 600 Kenya project",
  },
  {
    slug: "product-launch-kilgharrah-600",
    category: "projects",
    date: "2025-10-31",
    title: "Product launch — Kilgharrah 600",
    excerpt: "The Kilgharrah 600 product launch, with the event video and photographs.",
    body: [
      { heading: "The launch", text: "Product launch for Kilgharrah 600." },
      {
        heading: "Event video",
        text: "The launch event is on record.",
        href: "https://drive.google.com/file/d/1joGCLjZyCgivZhEPsG_cVD23dzu1b2RH/view",
        hrefLabel: "Event video",
      },
    ],
    photos: Array.from({ length: 17 }, (_, i) => publicFile("news", `launch-${pad(i + 1)}.jpg`)),
    alt: "Kilgharrah 600 at the product launch",
  },
];

const gallery = (file: string) => publicFile("Gallery Images", file);
const photo = (file: string) => publicFile("photos", file);

const FRAMES: SeedFrame[] = [
  {
    title: "QC Bench",
    category: "manufacturing",
    note: "Passed stock on the rack, the next check already on the table.",
    file: gallery("ThimarkWorkshop-tlkjrLBgY8PszAucZdS4Cg.jpg"),
    alt: "Three technicians inspecting metal brackets at a workshop bench beneath a QC passed sign",
    fit: "cover",
    place: "Kadawatha",
  },
  {
    title: "Kilgharrah 600",
    category: "projects",
    note: "Trash-rack cleaner built for a hydropower intake.",
    file: gallery("Kilgharrah600-H4eS3WLBj1Hf5xwZhFBNSw.jpg"),
    alt: "Yellow Kilgharrah 600 trash-rack cleaner with its boom raised on an outdoor steel platform",
    fit: "cover",
    place: "KenGen",
  },
  {
    title: "SLTC Awards",
    category: "recognition",
    note: "Merit for outstanding R&D, and excellence in in-house research, 2025.",
    file: gallery("WhatsAppImage2025-11-14at12.15.49-D0F_FxSurq4Ojsp3LuH4cA.jpeg"),
    alt: "Two SLTC Research and Innovation Awards 2025 trophies presented to Thimark Technocreations",
    fit: "contain",
    place: "Colombo",
  },
  {
    title: "Welcome Line",
    category: "people",
    note: "Garlands on, folders in hand, the evening just opening.",
    file: gallery("1-ZVxCUBk0IreVmuR95D0V9Q.jpeg"),
    alt: "Guests in formal dress and flower garlands gathered in a bright lobby",
    fit: "cover",
    place: "Evening",
  },
  {
    title: "Arrivals",
    category: "people",
    note: "The floor by the lift, before the hall.",
    file: gallery("3-HeDn1dimB8Vb51HQKxWyqg.jpeg"),
    alt: "Guests wearing flower garlands standing together beside a lobby elevator",
    fit: "cover",
    place: "Evening",
  },
  {
    title: "Greeting",
    category: "people",
    note: "A welcome returned, hands together.",
    file: gallery("4-exUKhkkue2KGxE_rjGbwWw.jpeg"),
    alt: "A guest in a light suit and garland greeting a host in a blue dress",
    fit: "cover",
    place: "Evening",
  },
  {
    title: "Traditional Welcome",
    category: "people",
    note: "Dancers at the threshold, trays held out.",
    file: gallery("5-ZyrwZppXEF-u6EKLybVF8Q.jpeg"),
    alt: "A guest receiving a ceremonial tray from dancers in traditional dress on a lit stage",
    fit: "cover",
    place: "Evening",
  },
  {
    title: "Lamp Lighting",
    category: "people",
    note: "The first flame, held over the tray.",
    file: gallery("6-hXnqhAULC-l4wUwYeqNiCw.jpeg"),
    alt: "A guest lighting a ceremonial lamp while dancers hold trays on stage",
    fit: "cover",
    place: "Evening",
  },
  {
    title: "Oil Lamp",
    category: "people",
    note: "The next wick, with the line of guests behind.",
    file: gallery("7-Md8itFQlzgQ_GZ7PcjTcqQ.jpeg"),
    alt: "A guest in a white shirt lighting an oil lamp during a traditional ceremony",
    fit: "cover",
    place: "Evening",
  },
  {
    title: "Stage",
    category: "people",
    note: "Colour, feathers, and the lights above the steps.",
    file: gallery("8-urXBskOm3V0pFy5ONpNVJg.jpeg"),
    alt: "Five performers in bright feathered costumes posed on a stage under red spotlights",
    fit: "cover",
    place: "Evening",
  },
  {
    title: "Laser Head",
    category: "manufacturing",
    note: "The first cut, sparks falling through the slats.",
    file: photo("laser-head-sparks.jpg"),
    alt: "A fibre laser head cutting sheet steel, sparks falling through the slat bed",
    fit: "cover",
    place: "Kadawatha",
  },
  {
    title: "Tube Laser",
    category: "manufacturing",
    note: "Tube stock, cut to length and profile in one pass.",
    file: photo("laser-tube-sparks.jpg"),
    alt: "Sparks from a tube laser cutter as a Thimark operator watches the cut",
    fit: "cover",
    place: "Kadawatha",
  },
  {
    title: "Pipe Bending Area",
    category: "manufacturing",
    note: "CNC benders in a row, tube racks within reach.",
    file: photo("pipe-bending-hall.jpg"),
    alt: "A Thimark operator at a CNC tube bender in the pipe bending area of the factory hall",
    fit: "cover",
    place: "Kadawatha",
  },
  {
    title: "Power Press",
    category: "manufacturing",
    note: "The die set loaded, light curtains up.",
    file: photo("power-press-wide.jpg"),
    alt: "A Thimark operator running a power press stamping line",
    fit: "cover",
    place: "Kadawatha",
  },
  {
    title: "Projection Welding",
    category: "manufacturing",
    note: "Nuts fused to brackets, one press of the pedal at a time.",
    file: photo("projection-welder-operator.jpg"),
    alt: "A Thimark operator joining a bracket on a resistance projection welding machine",
    fit: "cover",
    place: "Kadawatha",
  },
  {
    title: "Weld Bay",
    category: "manufacturing",
    note: "A helmet down, the arc lit, the fixture holding true.",
    file: photo("mig-welding-booth.jpg"),
    alt: "A Thimark welder MIG welding a steel part in the weld bay, sparks fanning across the bench",
    fit: "cover",
    place: "Kadawatha",
  },
  {
    title: "Multi-Spindle Drilling",
    category: "manufacturing",
    note: "Several holes, one clamping, every part the same.",
    file: photo("spm-drilling-overview.jpg"),
    alt: "A Thimark operator running a multi-spindle special-purpose drilling machine",
    fit: "cover",
    place: "Kadawatha",
  },
  {
    title: "Part Marking",
    category: "manufacturing",
    note: "Each bracket stamped with its number before it moves on.",
    file: photo("dot-peen-marking-jacket.jpg"),
    alt: "A Thimark operator marking a part number onto a bracket with a dot-peen machine",
    fit: "cover",
    place: "Kadawatha",
  },
  {
    title: "Raw Items",
    category: "manufacturing",
    note: "Welded stands racked and counted, waiting for the finish.",
    file: photo("raw-items-rack.jpg"),
    alt: "Rows of welded motorcycle stands hung on a rack labelled raw items",
    fit: "cover",
    place: "Kadawatha",
  },
  {
    title: "Coating Check",
    category: "manufacturing",
    note: "Film thickness read off the gauge, not guessed.",
    file: photo("coating-thickness-gauge.jpg"),
    alt: "A coating thickness gauge held against a finished black bracket",
    fit: "cover",
    place: "Kadawatha",
  },
  {
    title: "Finished Stands",
    category: "manufacturing",
    note: "Coated, cured and lined up for the assembly plant.",
    file: photo("coated-stands-row.jpg"),
    alt: "Rows of finished, powder-coated motorcycle stands on a table",
    fit: "cover",
    place: "Kadawatha",
  },
  {
    title: "Ready for Dispatch",
    category: "manufacturing",
    note: "Stands, carriers, handlebars and brackets, one table.",
    file: photo("finished-goods-table.jpg"),
    alt: "Finished motorcycle stands, rear carriers, handlebars and brackets laid out on a table",
    fit: "cover",
    place: "Kadawatha",
  },
  {
    title: "Inspection Line",
    category: "people",
    note: "Every part through gloved hands before it leaves.",
    file: photo("inspection-line.jpg"),
    alt: "Thimark team members inspecting and assembling formed steel parts on the production line",
    fit: "cover",
    place: "Kadawatha",
  },
  {
    title: "Assembly Line",
    category: "people",
    note: "Side by side, sub-assemblies building up on the bench.",
    file: photo("assembly-line-pair.jpg"),
    alt: "Two Thimark technicians assembling motorcycle bracket components on the assembly line",
    fit: "cover",
    place: "Kadawatha",
  },
  {
    title: "Engineering Review",
    category: "people",
    note: "The drawing, the record and the people who make it.",
    file: photo("engineering-review.jpg"),
    alt: "Thimark engineers and production leads reviewing records together at a laptop",
    fit: "cover",
    place: "Kadawatha",
  },
  {
    title: "Award Shelf",
    category: "recognition",
    note: "SLTC, NBEA, IDB and CNCI, side by side.",
    file: photo("awards-shelf.jpg"),
    alt: "Thimark's SLTC, NBEA, IDB and CNCI award trophies displayed together",
    fit: "cover",
    place: "Kadawatha",
  },
  {
    title: "SLTC Merit Award",
    category: "recognition",
    note: "Merit for outstanding R&D in an SME, 2025.",
    file: photo("award-sltc-2025.jpg"),
    alt: "SLTC Research and Innovation Awards 2025 merit trophy presented to Thimark Technocreations",
    fit: "contain",
    place: "Colombo",
  },
  {
    title: "IDB Gold Award",
    category: "recognition",
    note: "Gold for metal-based automobile components, 2023.",
    file: photo("award-idb-2023.jpg"),
    alt: "National Industry Excellence Award 2023 gold trophy from the Industrial Development Board",
    fit: "contain",
    place: "Colombo",
  },
  {
    title: "NBEA Gold Award",
    category: "recognition",
    note: "National Business Excellence Awards, 2026.",
    file: photo("award-nbea-2026.jpg"),
    alt: "National Business Excellence Awards 2026 gold lotus trophy presented to Thimark Technocreations",
    fit: "contain",
    place: "Colombo",
  },
];

async function uploadImage(payload: Payload, filePath: string, alt: string) {
  const doc = await payload.create({
    collection: "media",
    data: { alt },
    filePath,
    context,
  });
  payload.logger.info(`  uploaded ${path.basename(filePath)}`);
  return doc.id;
}

async function seedAdmin(payload: Payload) {
  const { totalDocs } = await payload.count({ collection: "users" });
  if (totalDocs > 0) {
    payload.logger.info("Users exist, skipping admin account");
    return;
  }
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    payload.logger.warn("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create the first admin, or create it at /admin");
    return;
  }
  await payload.create({
    collection: "users",
    data: { email, password, name: "Thimark Admin", role: "admin" },
    context,
  });
  payload.logger.info(`Created admin ${email}`);
}

async function seedNews(payload: Payload) {
  for (const story of NEWS) {
    const existing = await payload.find({
      collection: "news",
      where: { slug: { equals: story.slug } },
      limit: 1,
      depth: 0,
      draft: true,
    });
    if (existing.totalDocs > 0) {
      payload.logger.info(`News "${story.slug}" exists, skipping`);
      continue;
    }

    payload.logger.info(`News "${story.slug}"`);
    const [coverPath, ...photoPaths] = story.photos;
    const heroImage = await uploadImage(payload, coverPath, story.alt);
    const images = [];
    for (const [index, photo] of photoPaths.entries()) {
      images.push(await uploadImage(payload, photo, `${story.alt}, photograph ${index + 2}`));
    }

    await payload.create({
      collection: "news",
      data: {
        title: story.title,
        slug: story.slug,
        category: story.category,
        date: `${story.date}T06:30:00.000Z`,
        excerpt: story.excerpt,
        heroImage,
        body: story.body,
        images,
        _status: "published",
      },
      context,
    });
  }
}

async function seedGallery(payload: Payload) {
  for (const frame of FRAMES) {
    const existing = await payload.find({
      collection: "gallery",
      where: { title: { equals: frame.title } },
      limit: 1,
      depth: 0,
    });
    if (existing.totalDocs > 0) {
      payload.logger.info(`Photo "${frame.title}" exists, skipping`);
      continue;
    }

    payload.logger.info(`Photo "${frame.title}"`);
    const image = await uploadImage(payload, frame.file, frame.alt);
    await payload.create({
      collection: "gallery",
      data: {
        title: frame.title,
        category: frame.category,
        note: frame.note,
        image,
        fit: frame.fit,
        place: frame.place,
      },
      context,
    });
  }
}

const payload = await getPayload({ config });
await seedAdmin(payload);
await seedNews(payload);
await seedGallery(payload);
payload.logger.info("Seed complete");
process.exit(0);
