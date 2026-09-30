import type { Metadata } from "next";
import UnderDevelopmentPage from "@/app/components/UnderDevelopmentPage";

export const metadata: Metadata = {
  title: "Automotive Products — Thimark",
};

export default function AutomotiveProductsPage() {
  return <UnderDevelopmentPage name="Automotive Products" />;
}
