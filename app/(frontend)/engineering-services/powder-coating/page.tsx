import type { Metadata } from "next";
import UnderDevelopmentPage from "@/app/(frontend)/components/UnderDevelopmentPage";

export const metadata: Metadata = {
  title: "Powder Coating — Thimark",
};

export default function PowderCoatingPage() {
  return <UnderDevelopmentPage name="Powder Coating" />;
}
