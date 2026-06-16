import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

/** @type {import('next').NextConfig} */
const BASE_PATH = "/realfaketickets";

const baseConfig = {
  basePath: BASE_PATH,
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
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
