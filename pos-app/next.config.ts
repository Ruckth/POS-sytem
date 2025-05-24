import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.bewellstyle.com",
        port: "",
        pathname: '/wp-content/**',
      },
    ],
  },
};

export default nextConfig;
