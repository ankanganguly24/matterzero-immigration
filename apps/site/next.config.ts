import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@matterzero/ui", "@matterzero/design-tokens"],
  trailingSlash: false,
  poweredByHeader: false,
};

export default nextConfig;
