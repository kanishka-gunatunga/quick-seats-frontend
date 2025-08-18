import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.builder.io",
            },
            {
                protocol:"https",
                hostname:"kpwsy3k8jg70dgod.public.blob.vercel-storage.com"
            },
        ],
    },
  /* config options here */
};

export default nextConfig;
