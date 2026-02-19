import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Gurusewak | AI/ML Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(124, 124, 248, 0.08)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            left: "-60px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(124, 124, 248, 0.05)",
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              display: "flex",
            }}
          >
            <span style={{ color: "#ffffff" }}>Gurusewak</span>
            <span style={{ color: "#7c7cf8" }}>.in</span>
          </div>

          <div
            style={{
              fontSize: "28px",
              color: "rgba(255, 255, 255, 0.6)",
              fontWeight: 400,
              display: "flex",
            }}
          >
            AI/ML Engineer · Building Intelligent Systems
          </div>

          {/* Accent line */}
          <div
            style={{
              width: "80px",
              height: "4px",
              background: "linear-gradient(90deg, #7c7cf8, #a78bfa)",
              borderRadius: "2px",
              marginTop: "8px",
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
