import type { Metadata } from "next";
import Link from "next/link";
import { posts as staticPosts } from "./posts";
import LandingNav from "@components/layout/LandingNav";
import LandingFooter from "@components/layout/LandingFooter";
import AnnouncementBanner from "@components/layout/AnnouncementBanner";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog – Prompt Forge",
  description:
    "Yapay zeka destekli kod üretimi, NestJS, SaaS mimarisi ve üretime hazır uygulama geliştirme üzerine rehberler ve içgörüler.",
  keywords: [
    "AI kod üretimi blog",
    "NestJS rehberleri",
    "SaaS geliştirme kılavuzu",
    "yapay zeka ile SaaS geliştirme",
    "Prisma şema rehberi",
  ],
  alternates: { canonical: "https://promptforgeai.dev/blog" },
  openGraph: {
    title: "Blog – Prompt Forge",
    description:
      "Yapay zeka destekli kod üretimi, NestJS ve SaaS mimarisi üzerine rehberler ve içgörüler.",
    url: "https://promptforgeai.dev/blog",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Prompt Forge Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog – Prompt Forge",
    description: "Yapay zeka destekli kod üretimi ve SaaS geliştirme üzerine rehberler ve içgörüler.",
    images: ["/twitter-image"],
  },
};

interface NormalizedPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: number;
  category: string;
}

async function fetchApiPosts(): Promise<NormalizedPost[]> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const res = await fetch(`${base}/api/v1/blog`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((p: { slug: string; title: string; description: string; createdAt: string; readTime: number; category: string }) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      date: p.createdAt,
      readTime: p.readTime,
      category: p.category,
    }));
  } catch {
    return [];
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  Tutorial: "bg-indigo-950/60 border-indigo-800/50 text-indigo-300",
  Engineering: "bg-blue-950/60 border-blue-800/50 text-blue-300",
  Comparison: "bg-purple-950/60 border-purple-800/50 text-purple-300",
};

export default async function BlogPage() {
  const apiPosts = await fetchApiPosts();

  // API posts take priority; remove static posts that share a slug with API posts
  const apiSlugs = new Set(apiPosts.map((p) => p.slug));
  const mergedStatic: NormalizedPost[] = staticPosts
    .filter((p) => !apiSlugs.has(p.slug))
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      date: p.date,
      readTime: p.readTime,
      category: p.category,
    }));

  const all = [...apiPosts, ...mergedStatic].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const [featured, ...rest] = all;

  if (!featured) {
    return (
      <>
        <AnnouncementBanner />
        <LandingNav />
        <main className="min-h-screen bg-[#0a0b14] text-white pt-20">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Blog</h1>
            <p className="text-slate-400">Henüz yazı yok.</p>
          </div>
        </main>
        <LandingFooter />
      </>
    );
  }

  return (
    <>
      <AnnouncementBanner />
      <LandingNav />
      <main className="min-h-screen bg-[#0a0b14] text-white pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Blog</h1>
            <p className="text-slate-400 text-lg">
              Yapay zeka destekli SaaS geliştirme üzerine rehberler, eğitimler ve mühendislik içgörüleri.
            </p>
          </div>

          {/* Featured post */}
          <Link
            href={`/blog/${featured.slug}`}
            className="block glass-card p-7 mb-8 hover:border-slate-600/80 transition-all group"
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                  CATEGORY_COLORS[featured.category] ?? "bg-slate-800 border-slate-700 text-slate-400"
                }`}
              >
                {featured.category}
              </span>
              <span className="text-xs text-slate-500">Öne Çıkan</span>
            </div>
            <h2 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors mb-3 leading-snug">
              {featured.title}
            </h2>
            <p className="text-slate-400 leading-relaxed mb-5">{featured.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(featured.date).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {featured.readTime} dk okuma
                </span>
              </div>
              <span className="text-indigo-400 group-hover:text-indigo-300 text-sm flex items-center gap-1 transition-colors">
                Makaleyi oku <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Post grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="glass-card p-5 hover:border-slate-600/80 transition-all group flex flex-col"
              >
                <div className="mb-3">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                      CATEGORY_COLORS[post.category] ?? "bg-slate-800 border-slate-700 text-slate-400"
                    }`}
                  >
                    {post.category}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors mb-2 leading-snug flex-1">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                  {post.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.date).toLocaleDateString("tr-TR", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime} dk
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <LandingFooter />
    </>
  );
}
