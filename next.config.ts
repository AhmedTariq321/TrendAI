import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@heyputer/puter.js"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.clerk.com" },
      { protocol: "https", hostname: "images.clerk.dev" },
    ],
  },
};

export default nextConfig;
