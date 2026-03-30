import path from "path";
import { fileURLToPath } from "url";
import { withSentryConfig } from "@sentry/nextjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "**.railway.app" },
      { protocol: "https", hostname: "**.vercel.app" },
    ],
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@components": path.resolve(__dirname, "components"),
      "@app": path.resolve(__dirname, "app"),
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/:path*`,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: "promptforge-gm",
  project: "promptforge-frontend",
  silent: true,
  disableLogger: true,
  automaticVercelMonitors: false,
});
