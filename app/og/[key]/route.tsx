import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { OG_KEYS, OG_SIZE, type OgKey } from "@/app/(frontend)/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return OG_KEYS.map((key) => ({ key }));
}

const CARDS: Record<OgKey, { kicker: string; title: string }> = {
  default: {
    kicker: "Engineering \u00b7 Manufacturing \u00b7 Sri Lanka",
    title: "Engineering what moves industry forward.",
  },
  automotive: {
    kicker: "Automotive Component Manufacturer",
    title: "OEM motorcycle components, manufactured in Sri Lanka.",
  },
  "industrial-machinery": {
    kicker: "Industrial Machinery Manufacturer",
    title: "Custom machinery for hydropower, processing and material handling.",
  },
  "engineering-services": {
    kicker: "Engineering Services",
    title: "Product development, reverse engineering and powder coating.",
  },
  about: {
    kicker: "About Thimark",
    title: "ISO 9001:2015 certified engineering and manufacturing since 2014.",
  },
};

const CREAM = "#F1EDE3";
const STEEL = "#3A3D42";
const SILVER = "#A8ADB4";
const BRAND = "#6E1218";

export async function GET(_request: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const card = CARDS[key as OgKey] ?? CARDS.default;
  const logo = await readFile(join(process.cwd(), "public/brand/logo-horizontal.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: CREAM,
          color: STEEL,
          padding: "64px 72px",
          borderLeft: `16px solid ${BRAND}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- satori renders plain img only */}
          <img src={logoSrc} width={347} height={62} alt="" />
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 3, color: STEEL }}>
            THIMARK.COM
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: BRAND,
            }}
          >
            {card.kicker}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              lineHeight: 1.08,
              letterSpacing: -1.5,
              maxWidth: 1000,
            }}
          >
            {card.title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: `2px solid ${SILVER}`,
            paddingTop: 24,
            fontSize: 22,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex" }}>Thimark Technocreations (Pvt) Ltd</div>
          <div style={{ display: "flex" }}>{"ISO 9001:2015 \u00b7 Kadawatha, Sri Lanka"}</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" },
    },
  );
}
