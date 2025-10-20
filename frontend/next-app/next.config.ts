import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  outputFileTracingRoot: '/Users/morzh/productsApp/frontend/next-app',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
        port: '',
        pathname: '/img/**',
      },
    ],
  },
};

export default nextConfig;
