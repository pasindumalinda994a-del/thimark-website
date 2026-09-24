import type { Metadata } from "next";
import UnderDevelopmentPage from "@/app/components/UnderDevelopmentPage";

export const metadata: Metadata = {
  title: "Gallery — Thimark",
};

export default function GalleryPage() {
  return <UnderDevelopmentPage name="Gallery" />;
}
