import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/stuffs-builds/encyclopedie",
        destination: "/encyclopedie",
        permanent: true,
      },
      {
        source: "/stuffs-builds/ajouter",
        destination: "/encyclopedie/ajouter",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dofusdb.fr",
        pathname: "/img/**",
      },
      ...(supabaseHostname
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHostname,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
