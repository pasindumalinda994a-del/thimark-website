export type Partner = {
  id: string;
  brand: string;
  legalName: string;
  sector: string;
  /** Optional logo asset (SVG/PNG under /public). Falls back to a typographic wordmark. */
  logo?: string;
};

export const PARTNERS: Partner[] = [
  {
    id: "dpmc",
    brand: "Bajaj",
    legalName: "David Pieris Motor Company Lanka Ltd.",
    sector: "OEM Partner",
  },
  {
    id: "senaro",
    brand: "Senaro",
    legalName: "Senaro Motor Company (Pvt) Ltd.",
    sector: "OEM Partner",
  },
  {
    id: "ranomoto",
    brand: "Ranomoto",
    legalName: "Ranatunga Motors (Pvt) Ltd.",
    sector: "OEM Partner",
  },
  {
    id: "kengen",
    brand: "KenGen",
    legalName: "Kenya Electricity Generating Company",
    sector: "International Project",
  },
  {
    id: "varomatech",
    brand: "Varomatech",
    legalName: "Varomatech Ltd — Kenya",
    sector: "International Project",
  },
];
