import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "NearMePG — Find Verified PGs & Stays Near You";
export const size = { width: 1200, height: 600 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
          fontFamily: "system-ui, sans-serif",
          gap: 40,
          padding: "0 80px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 20,
            background: "rgba(255,255,255,0.15)",
            border: "2px solid rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 52, fontWeight: 900, color: "#fff" }}>P</span>
        </div>

        {/* Text */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span style={{ fontSize: 64, fontWeight: 900, color: "#fff", letterSpacing: -2 }}>
              NearMe
            </span>
            <span style={{ fontSize: 64, fontWeight: 900, color: "#fbbf24", letterSpacing: -2 }}>
              PG
            </span>
          </div>
          <span style={{ fontSize: 24, color: "rgba(255,255,255,0.75)", marginTop: 8 }}>
            India's most trusted PG booking platform
          </span>
        </div>
      </div>
    ),
    size
  );
}
