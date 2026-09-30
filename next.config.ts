import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Without this, pages built from DB data (e.g. /customer-lead-list) can
    // show a stale client-side snapshot after using the browser back button
    // from a page that just saved new data (e.g. /ratebook).
    staleTimes: {
      dynamic: 0,
    },
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
