// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/site";
import { works } from "@/content/works";
import { hasDetailPage } from "@/features/works";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  // 詳細ページは works/[id]/page.tsx の generateStaticParams と同じ条件で並べる
  const workPages = works
    .filter((w) => !w.hidden && hasDetailPage(w))
    .map((w) => ({ url: `${SITE_URL}/works/${w.id}`, lastModified, changeFrequency: "monthly" as const, priority: w.featured ? 0.8 : 0.6 }));

  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/resume`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    ...workPages,
  ];
}
