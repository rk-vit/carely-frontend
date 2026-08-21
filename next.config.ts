import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow phones on the local network to load Next.js development assets.
  // Without this, the page HTML loads but client-side dashboard controls do not hydrate.
  allowedDevOrigins: ["localhost", "127.0.0.1", "192.168.29.82"],
};

export default nextConfig;
