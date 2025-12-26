// src/app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // 本番URLを環境変数で管理（Vercelで設定推奨）
  // 例: NEXT_PUBLIC_SITE_URL = https://my-portfolio-ruby-delta-87.vercel.app
  const baseUrl =
    (process.env.NEXT_PUBLIC_SITE_URL ?? "https://my-portfolio-ruby-delta-87.vercel.app")
      .replace(/\/+$/, ""); // 末尾スラッシュ除去

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
