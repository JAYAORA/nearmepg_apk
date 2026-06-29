import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "NearMePG — Find Verified PGs & Stays Near You";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Logo badge */}
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 20,
            background: "rgba(255,255,255,0.15)",
            border: "2px solid rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <span style={{ fontSize: 48, fontWeight: 900, color: "#fff" }}>P</span>
        </div>

        {/* Brand name */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
          <span style={{ fontSize: 72, fontWeight: 900, color: "#fff", letterSpacing: -2 }}>
            NearMe
          </span>
          <span style={{ fontSize: 72, fontWeight: 900, color: "#fbbf24", letterSpacing: -2 }}>
            PG
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.8)",
            marginTop: 16,
            letterSpacing: 0.5,
            fontWeight: 400,
          }}
        >
          Find Verified PGs & Stays Near You
        </p>

        {/* Sub-tag */}
        <p
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.55)",
            marginTop: 12,
          }}
        >
          India's most trusted PG booking platform
        </p>

        {/* Bottom URL bar */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>
            nearmepg.com
          </span>
        </div>
      </div>
    ),
    size
  );
}
