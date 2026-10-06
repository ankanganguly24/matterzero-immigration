import type { MetadataRoute } from "next";
import { articles } from "@/features/resources/articles";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/resources`, changeFrequency: "weekly", priority: 0.8 },
    ...articles.map(({ slug, date }) => ({
      url: `${siteUrl}/resources/${slug}`,
      lastModified: new Date(date),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
