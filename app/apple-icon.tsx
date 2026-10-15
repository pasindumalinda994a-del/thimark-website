import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const TILE = { width: 59, height: 77 } as const;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f4ed",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ ...TILE, background: "#575757" }} />
            <div style={{ ...TILE, background: "#8a151c" }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ ...TILE, background: "#c0c0c0" }} />
            <div style={{ ...TILE, background: "#575757" }} />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
