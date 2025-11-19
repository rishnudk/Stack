import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'stack.s3.amazonaws.com',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
