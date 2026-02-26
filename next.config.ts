import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSentryConfig(nextConfig, {
  // Silence Sentry CLI output during builds
  silent: true,

  // Route Sentry requests through Next.js to avoid adblockers
  tunnelRoute: "/monitoring",

  // Disable Sentry telemetry
  telemetry: false,
});

