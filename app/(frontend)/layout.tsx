import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Onest, Space_Grotesk } from "next/font/google";
import CustomCursorLoader from "@/app/(frontend)/components/CustomCursorLoader";
import PageTransition from "@/app/(frontend)/components/PageTransition";
import { PRELOAD_SKIP_SCRIPT } from "@/app/(frontend)/components/preloadSession";
import Sidebar from "@/app/(frontend)/components/Sidebar";
import SiteClose from "@/app/(frontend)/components/SiteClose";
import SmoothScroll from "@/app/(frontend)/components/SmoothScroll";
import { COMPANY } from "@/app/(frontend)/components/site";
import JsonLd from "@/app/(frontend)/seo/JsonLd";
import { siteSchema } from "@/app/(frontend)/seo/schema";
import {
  DEFAULT_DESCRIPTION,
  INDEXABLE,
  OG_SIZE,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
  TITLE_TEMPLATE,
  ogImagePath,
} from "@/app/(frontend)/seo/metadata";
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

const DEFAULT_TITLE = "Engineering & Manufacturing Company in Sri Lanka | Thimark";

const verificationOther: Record<string, string> = {};
if (process.env.BING_SITE_VERIFICATION) {
  verificationOther["msvalidate.01"] = process.env.BING_SITE_VERIFICATION;
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: TITLE_TEMPLATE },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: COMPANY.name, url: SITE_URL }],
  creator: COMPANY.name,
  publisher: COMPANY.name,
  category: "Engineering and manufacturing",
  formatDetection: { telephone: false, address: false, email: false },
  robots: INDEXABLE
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      }
    : { index: false, follow: false },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: verificationOther,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    url: "/",
    images: [{ url: ogImagePath(), alt: DEFAULT_TITLE, ...OG_SIZE }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#575757",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${onest.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRELOAD_SKIP_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <JsonLd data={siteSchema()} />
        <SmoothScroll />
        <Sidebar />
        <PageTransition />
        <CustomCursorLoader />
        {children}
        <SiteClose />
        <SpeedInsights />
      </body>
    </html>
  );
}
