import type { Capability } from "@/app/(frontend)/homesections/CapabilitiesSection";

export const HOME_CAPABILITIES: readonly Capability[] = [
  {
    id: "precision",
    tag: "Precision",
    title: "Precision Manufacturing",
    body: "Quality-controlled production processes designed for accuracy, reliability and consistency.",
    icon: "precision",
  },
  {
    id: "engineering",
    tag: "Engineering",
    title: "Engineering & Design",
    body: "Practical engineering solutions developed around automotive and industrial requirements.",
    icon: "schema",
  },
  {
    id: "fabrication",
    tag: "Fabrication",
    title: "Heavy Steel Fabrication",
    body: "Proven fabrication capabilities built through years of mechanical engineering and industrial projects.",
    icon: "work",
  },
  {
    id: "oem",
    tag: "OEM",
    title: "OEM Manufacturing",
    body: "Precision motorcycle components manufactured for established local assembly and manufacturing partners.",
    icon: "factory",
  },
  {
    id: "machinery",
    tag: "Machinery",
    title: "Industrial Machinery",
    body: "Custom-designed machinery and mechanical systems for demanding industrial applications.",
    icon: "forklift",
  },
  {
    id: "automation",
    tag: "Automation",
    title: "Automation & Custom Solutions",
    body: "Integration of mechanical, hydraulic and control technologies to address specialized industrial challenges.",
    icon: "electrical",
  },
];
