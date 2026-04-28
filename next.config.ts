import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Security headers + immutable cache for the Spline scene */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
      {
        // The .splinecode is content-addressed (we replace the file when
        // we re-export from Spline) so it's safe to cache forever.
        source: "/scene.splinecode",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
