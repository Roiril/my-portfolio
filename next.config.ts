import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  experimental: {},
  async redirects() {
    return [
      // 修士研究は論文が未公開なので詳細ページを作らない。
      // 提出済みの ES にこの URL を載せているため、トップの研究の面へ送る
      { source: '/works/robot-collab', destination: '/#research', permanent: false },
    ];
  },
};

export default nextConfig;
