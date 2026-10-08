import type { Metadata } from "next";
import UnderDevelopmentPage from "@/app/(frontend)/components/UnderDevelopmentPage";

export const metadata: Metadata = {
  title: "Reverse Engineering — Thimark",
};

export default function ReverseEngineeringPage() {
  return <UnderDevelopmentPage name="Reverse Engineering" />;
}
