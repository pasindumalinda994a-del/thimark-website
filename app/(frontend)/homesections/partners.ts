import { montserrat, oswald, oxanium, saira } from "@/app/(frontend)/homesections/partnerFonts";

export type PartnerMark = {
  /** CSS font-family, usually from a next/font loader. */
  font: string;
  weight: number;
  italic?: boolean;
  /** Defaults to uppercase. KenGen keeps its own casing. */
  uppercase?: boolean;
  tracking?: string;
};

export type Partner = {
  id: string;
  brand: string;
  legalName: string;
  sector: string;
  /** Optional logo asset (SVG/PNG under /public). Falls back to a typographic wordmark. */
  logo?: string;
  /** Stand-in wordmark. Official artwork still belongs in `logo`. */
  mark?: PartnerMark;
};

export const PARTNERS: Partner[] = [
  {
    id: "dpmc",
    brand: "Bajaj",
    legalName: "David Pieris Motor Company Lanka Ltd.",
    sector: "OEM Manufacturing Partner",
    mark: {
      font: oxanium.style.fontFamily,
      weight: 700,
      tracking: "-0.04em",
    },
  },
  {
    id: "senaro",
    brand: "Senaro",
    legalName: "Senaro Motor Company (Pvt) Ltd.",
    sector: "OEM Manufacturing Partner",
    mark: {
      font: saira.style.fontFamily,
      weight: 800,
      italic: true,
      tracking: "0.04em",
    },
  },
  {
    id: "ranomoto",
    brand: "Ranomoto",
    legalName: "Ranatunga Motors (Pvt) Ltd.",
    sector: "OEM Manufacturing Partner",
    mark: {
      font: oswald.style.fontFamily,
      weight: 600,
      tracking: "0.06em",
    },
  },
  {
    id: "kengen",
    brand: "KenGen",
    legalName: "Kenya Electricity Generating Company",
    sector: "International Engineering Project",
    mark: {
      font: montserrat.style.fontFamily,
      weight: 700,
      uppercase: false,
      tracking: "-0.03em",
    },
  },
  {
    id: "varomatech",
    brand: "Varomatech",
    legalName: "Varomatech Ltd. — Kenya",
    sector: "International Project Collaborator",
  },
];
