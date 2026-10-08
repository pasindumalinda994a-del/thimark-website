import type { Metadata } from "next";
import UnderDevelopmentPage from "@/app/(frontend)/components/UnderDevelopmentPage";

export const metadata: Metadata = {
  title: "Industrial Machinery — Thimark",
};

export default function IndustrialMachineryPage() {
  return <UnderDevelopmentPage name="Industrial Machinery" quoteService="industrial" />;
}
