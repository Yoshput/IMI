import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer, webpack }) => {
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource: any) => {
        resource.request = resource.request.replace(/^node:/, "");
      })
    );
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        https: false,
        http: false,
        stream: false,
        zlib: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
};

export default nextConfig;
