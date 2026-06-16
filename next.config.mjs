import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

/** @type {import('next').NextConfig} */
const baseConfig = {
  basePath: "/realfaketickets",
  outputFileTracingRoot: import.meta.dirname,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/realfaketickets",
        permanent: false,
      },
    ];
  },
  webpack(config, { dev }) {
    if (dev) {
      config.cache = false;
    }

    return config;
  },
};

export default function nextConfig(phase) {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      ...baseConfig,
      distDir: ".next-dev",
    };
  }

  return baseConfig;
}
