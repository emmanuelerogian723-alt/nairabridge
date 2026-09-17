import type { NextConfig } from "next";

// The Pollar publishable key is public by design (client-side, like a Stripe
// publishable key), so it is safe to inline as a build-time fallback. This
// guarantees the client bundle always has a valid key even when the host
// (e.g. Render) does not define NEXT_PUBLIC_POLLAR_PUBLISHABLE_KEY, which
// previously crashed the dashboard with an undefined apiKey in PollarProvider.
const POLLAR_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_POLLAR_PUBLISHABLE_KEY || "pub_testnet_a4ef064a5cf03868fce4fa967615e712";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_POLLAR_PUBLISHABLE_KEY: POLLAR_PUBLISHABLE_KEY,
  },
};

export default nextConfig;
