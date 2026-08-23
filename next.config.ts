import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow phones on the local network to load Next.js development assets.
  // Without this, the page HTML loads but client-side dashboard controls do not hydrate.
  allowedDevOrigins: ["localhost", "127.0.0.1", "192.168.29.82"],
  // Keep one Vercel variable name while making the backend origin available
  // to the browser for direct frontend-to-backend requests.
  env: {
    CARELY_API_BASE_URL: process.env.CARELY_API_BASE_URL ?? "http://localhost:8080",
  },
};

export default nextConfig;
