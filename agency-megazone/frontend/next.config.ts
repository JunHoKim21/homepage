import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const apiBase = process.env.INTERNAL_API_URL || "http://localhost:8080";
    return {
      fallback: [
        {
          source: "/api/:path*",
          destination: `${apiBase}/api/:path*`,
        },
        {
          source: "/uploads/public/:path*",
          destination: `${apiBase}/uploads/public/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;


