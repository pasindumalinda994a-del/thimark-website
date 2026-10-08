import type { Metadata } from "next";
import UnderDevelopmentPage from "@/app/(frontend)/components/UnderDevelopmentPage";

export const metadata: Metadata = {
  title: "Automotive Components Manufacturing — Thimark",
};

export default function AutomotiveManufacturingPage() {
  return <UnderDevelopmentPage name="Manufacturing" />;
}
