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
          background: "#000000",
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
        {/* Subtle white glow circles */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.04)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            left: "-80px",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.025)",
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
              fontWeight: 800,
              letterSpacing: "-0.04em",
              display: "flex",
            }}
          >
            <span style={{ color: "#ffffff" }}>Gurusewak</span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>.in</span>
          </div>

          <div
            style={{
              fontSize: "28px",
              color: "rgba(255, 255, 255, 0.45)",
              fontWeight: 300,
              display: "flex",
            }}
          >
            AI/ML Engineer · Building Intelligent Systems
          </div>

          {/* Accent line */}
          <div
            style={{
              width: "60px",
              height: "2px",
              background: "rgba(255, 255, 255, 0.4)",
              borderRadius: "1px",
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
