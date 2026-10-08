import type { Metadata } from "next";
import { Onest, Space_Grotesk } from "next/font/google";
import CustomCursor from "@/app/(frontend)/components/CustomCursor";
import PageTransition from "@/app/(frontend)/components/PageTransition";
import Sidebar from "@/app/(frontend)/components/Sidebar";
import SiteClose from "@/app/(frontend)/components/SiteClose";
import SmoothScroll from "@/app/(frontend)/components/SmoothScroll";
import { SERVER_URL } from "@/cms/preview";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(SERVER_URL),
  title: "Thimark — We Engineer What Moves Industry Forward",
  description:
    "From precision automotive components to purpose-built industrial machinery, Thimark turns engineering challenges into dependable solutions — designed, manufactured, and built in Sri Lanka.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${onest.variable} antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <SmoothScroll />
        <Sidebar />
        <PageTransition />
        <CustomCursor />
        {children}
        <SiteClose />
      </body>
    </html>
  );
}
