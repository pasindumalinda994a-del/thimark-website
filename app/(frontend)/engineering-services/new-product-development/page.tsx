import type { Metadata } from "next";
import UnderDevelopmentPage from "@/app/(frontend)/components/UnderDevelopmentPage";

export const metadata: Metadata = {
  title: "New Product Development — Thimark",
};

export default function NewProductDevelopmentPage() {
  return <UnderDevelopmentPage name="New Product Development" />;
}
