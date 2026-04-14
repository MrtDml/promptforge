import { MetadataRoute } from "next";
import { posts as staticPosts } from "./blog/posts";

async function fetchApiBlogSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const res = await fetch(`${base}/api/v1/blog`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((p: { slug: string; createdAt: string }) => ({
      slug: p.slug,
      updatedAt: p.createdAt,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://promptforgeai.dev";

  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                                  lastModified: new Date("2025-04-01"), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/pricing`,                     lastModified: new Date("2025-04-01"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/blog`,                        lastModified: new Date("2025-04-01"), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/about`,                       lastModified: new Date("2025-03-01"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/docs`,                        lastModified: new Date("2025-04-01"), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/support`,                     lastModified: new Date("2025-03-01"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`,                     lastModified: new Date("2025-03-01"), changeFrequency: "yearly",  priority: 0.6 },
    { url: `${base}/privacy`,                     lastModified: new Date("2025-03-01"), changeFrequency: "yearly",  priority: 0.4 },
    { url: `${base}/terms`,                       lastModified: new Date("2025-03-01"), changeFrequency: "yearly",  priority: 0.4 },
    { url: `${base}/kvkk`,                        lastModified: new Date("2025-03-01"), changeFrequency: "yearly",  priority: 0.4 },
    { url: `${base}/mesafeli-satis-sozlesmesi`,   lastModified: new Date("2025-03-01"), changeFrequency: "yearly",  priority: 0.4 },
    { url: `${base}/iade-politikasi`,             lastModified: new Date("2025-03-01"), changeFrequency: "yearly",  priority: 0.4 },
  ];

  // Fetch API blog posts
  const apiPosts = await fetchApiBlogSlugs();
  const apiSlugs = new Set(apiPosts.map((p) => p.slug));

  // Static posts that don't exist in API
  const staticBlogEntries: MetadataRoute.Sitemap = staticPosts
    .filter((p) => !apiSlugs.has(p.slug))
    .map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  // API blog posts
  const apiBlogEntries: MetadataRoute.Sitemap = apiPosts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...apiBlogEntries, ...staticBlogEntries];
}
