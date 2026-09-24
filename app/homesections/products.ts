export type ProductItem = {
  name: string;
  /** Optional photo under /public/products/<category>/... */
  image?: string;
  alt?: string;
};

export type ProductCategory = {
  id: string;
  brand: string;
  model: string;
  items: ProductItem[];
};

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: "ct100",
    brand: "Bajaj",
    model: "CT 100",
    items: [
      {
        name: "Bar Pillion LH & RH",
        image: "/products/Bar Pillion LH & RH.png",
        alt: "Black powder-coated Bajaj CT 100 bar pillion bracket, left and right",
      },
      {
        name: "Battery Bracket",
        image: "/products/Battery Bracket.png",
        alt: "Black stamped Bajaj CT 100 battery bracket with welded mounting tabs",
      },
      {
        name: "Number Plate Bracket",
        image: "/products/Number Plate Bracket.png",
        alt: "Black Bajaj CT 100 number plate bracket with dual studs",
      },
      {
        name: "Rear Plate",
        image: "/products/Rear Plate.png",
        alt: "Black stamped Bajaj CT 100 rear plate with dual mounting holes",
      },
      {
        name: "Step Stay",
        image: "/products/Number Plate Bracket.png",
        alt: "Bajaj CT 100 step stay",
      },
      {
        name: "Pillion Bracket",
        image: "/products/Pillion Bracket.png",
        alt: "Black tubular Bajaj CT 100 pillion bracket with forked arms",
      },
    ],
  },
  {
    id: "pulsar-n160",
    brand: "Bajaj",
    model: "Pulsar N160",
    items: [
      { name: "Belly Pan LH" },
      { name: "Belly Pan RH" },
      { name: "ABS Bracket" },
      { name: "Hanger Engine Front LH" },
      { name: "Hanger Engine Front RH" },
      { name: "Bracket LH / RH" },
    ],
  },
  {
    id: "gn125",
    brand: "Senaro",
    model: "GN125",
    items: [
      { name: "Center Stand" },
      { name: "Number Plate Bracket" },
      { name: "Front Bracket" },
      { name: "Side Stand" },
    ],
  },
  {
    id: "click-150i",
    brand: "Senaro",
    model: "Click 150i",
    items: [
      { name: "Center Stand" },
      { name: "Handle Bar" },
      { name: "Rear Bracket" },
    ],
  },
  {
    id: "moped",
    brand: "Ranomoto",
    model: "Moped",
    items: [
      { name: "Center Stand" },
      { name: "Handle Bar" },
      { name: "Rear Carrier" },
      { name: "Side Stand" },
    ],
  },
];

export const PRODUCT_SLOTS = 6;

export const PRODUCT_TOTALS = {
  components: PRODUCT_CATEGORIES.reduce((n, c) => n + c.items.length, 0),
  models: PRODUCT_CATEGORIES.length,
  partners: new Set(PRODUCT_CATEGORIES.map((c) => c.brand)).size,
};
