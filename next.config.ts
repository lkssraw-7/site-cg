import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { qualities: [75, 85] },
  devIndicators: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
