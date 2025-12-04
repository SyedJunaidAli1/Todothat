import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // config options here
  typescript: {
    ignoreBuildErrors: true, // still valid in Next.js 16
  },
};

export default nextConfig;
