import type { NextConfig } from "next";
import { withBetterStack } from "@logtail/next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withBetterStack(nextConfig);
